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

        // ---------- FIXED FIRST PAYOUT UNLOCK ----------
        const shouldUnlockWithdraw =
          !inv.canWithdraw && (
            (inv.daysAccrued === 0 && hoursSinceApproval >= 24) ||
            (inv.daysAccrued >= 1) // Already has ROI but still locked
          );

        // ---------- Normal daily ROI ----------
        const shouldAddDailyROI =
          inv.daysAccrued > 0 &&
          hoursSinceLastAccrual >= 24;

        // ---------- First real payout ----------
        const shouldAddFirstROI =
          inv.daysAccrued === 0 &&
          hoursSinceApproval >= 24;

        // If nothing is due, continue
        if (!shouldUnlockWithdraw && !shouldAddDailyROI && !shouldAddFirstROI)
          continue;

        const update: any = {};
        let earnings = 0;

        // ------- Handle first ROI payout -------
        if (shouldAddFirstROI) {
          earnings = amount * dailyPercent;

          update.$inc = { earnings: earnings, daysAccrued: 1 };
          update.$set = {
            lastAccruedAt: now.toISOString(),
            canWithdraw: true,
            firstPayoutDate: now.toISOString()
          };

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

        // ------- Handle normal daily ROI -------
        else if (shouldAddDailyROI) {
          earnings = amount * dailyPercent;

          update.$inc = { earnings: earnings, daysAccrued: 1 };
          update.$set = { lastAccruedAt: now.toISOString() };

          await db.collection("earnings_logs").insertOne({
            userId: inv.userId,
            investmentId: inv._id,
            amount: earnings,
            dailyPercent,
            createdAt: now.toISOString(),
            type: "roi",
            planName: inv.planName
          });
        }

        // ------- Handle unlock only (no payout) -------
        else if (shouldUnlockWithdraw) {
          update.$set = {
            canWithdraw: true,
            firstPayoutDate: now.toISOString()
          };
        }

        // Apply investment update
        await db.collection("investments").updateOne(
          { _id: inv._id },
          update
        );

        // Add earnings to user (only if earnings > 0)
        if (earnings > 0) {
          await db.collection("users").updateOne(
            { _id: ObjectId.createFromHexString(inv.userId) },
            {
              $inc: {
                balance: earnings,
                totalEarnings: earnings
              }
            }
          );
        }

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
