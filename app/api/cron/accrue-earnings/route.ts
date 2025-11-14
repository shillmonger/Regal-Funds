import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const now = new Date();

    const activeInvestments = await db.collection("investments").find({
      status: "Active",
      $expr: { $lt: ["$daysAccrued", "$durationDays"] }
    }).toArray();

    let processedCount = 0;

    for (const inv of activeInvestments) {
      try {
        const amount = Number(inv.amount) || 0;
        const dailyPercent = Number(inv.dailyPercent) || 0.10;

        const approvedAt = new Date(inv.approvedAt);
        const lastAccruedAt = inv.lastAccruedAt
          ? new Date(inv.lastAccruedAt)
          : approvedAt;

        const hoursSinceApproval =
          (now.getTime() - approvedAt.getTime()) / 36e5;

        const hoursSinceLastAccrual =
          (now.getTime() - lastAccruedAt.getTime()) / 36e5;


        // -------------- FIX #1: Correct first-day accrual --------------
        // First payout happens at 24 hours after approval ONLY ONCE
        const isFirstPayoutDue = (
          inv.daysAccrued === 0 &&
          hoursSinceApproval >= 24 &&
          !inv.canWithdraw
        );

        // -------------- FIX #2: Daily accrual after first payout --------------
        const isNormalDailyPayoutDue = (
          inv.daysAccrued > 0 &&
          hoursSinceLastAccrual >= 24
        );

        if (!isFirstPayoutDue && !isNormalDailyPayoutDue) continue;

        // ALWAYS accrue exactly one day at a time
        const earnings = amount * dailyPercent;

        // --- Prepare DB update fields
        const update: any = {
          $inc: { earnings: earnings, daysAccrued: 1 },
          $set: { lastAccruedAt: now.toISOString() }
        };

        // -------------- FIX #3: Unlock withdrawals at FIRST payout --------------
        if (isFirstPayoutDue) {
          update.$set.canWithdraw = true;
          update.$set.firstPayoutDate = now.toISOString();

          // Log the first payout
          await db.collection("earnings_logs").insertOne({
            userId: inv.userId,
            investmentId: inv._id,
            amount: earnings,
            dailyPercent,
            createdAt: now.toISOString(),
            type: "first_roi",
            planName: inv.planName
          });
        }

        // Apply investment update
        await db.collection("investments").updateOne(
          { _id: inv._id },
          update
        );

        // Add earnings to user account
        // Add earnings to user account
        await db.collection("users").updateOne(
          { _id: ObjectId.createFromHexString(inv.userId) },
          {
            $inc: {
              balance: earnings,
              totalEarnings: earnings
            }
          }
        );


        // Log normal daily ROI
        await db.collection("earnings_logs").insertOne({
          userId: inv.userId,
          investmentId: inv._id,
          amount: earnings,
          dailyPercent,
          createdAt: now.toISOString(),
          type: "roi",
          planName: inv.planName
        });

        processedCount++;

      } catch (err) {
        console.error("Error processing investment:", inv._id, err);
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      totalInvestments: activeInvestments.length
    });

  } catch (error) {
    console.error("accrue-earnings error:", error);
    return NextResponse.json(
      { error: "Failed to process earnings accrual" },
      { status: 500 }
    );
  }
}
