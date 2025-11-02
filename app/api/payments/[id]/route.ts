import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any).role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body as { status: "Approved" | "Rejected" | "Pending" };
    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const payment = await db
      .collection("payments")
      .findOne({ _id: new ObjectId(id) });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    await db
      .collection("payments")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, paidAt: status === "Approved" ? new Date().toISOString() : null } }
      );

    // On approval from non-approved state, create an investment record and update user totals
    if (status === "Approved" && payment.status !== "Approved") {
      const now = new Date();
      const dailyPercent = 0.10; // 10% daily
      const investmentDoc = {
        userId: payment.userId,
        userEmail: payment.userEmail,
        userName: payment.userName,
        planId: payment.planId ?? null,
        planName: payment.planName,
        amount: payment.amount,
        roi: payment.roi,
        duration: payment.duration,
        approvedAt: now.toISOString(),
        status: "Active" as const,
        // accrual tracking
        earnings: 0, // Start with 0 earnings, will be added daily
        durationDays: 30,
        dailyPercent,
        daysAccrued: 0, // Start with 0 days accrued
        lastAccruedAt: now.toISOString(),
        canWithdraw: false, // Can't withdraw until first 10% is added
        firstPayoutDate: null as string | null // Track when first 10% is added
      };
      await db.collection("investments").insertOne(investmentDoc);
      // Only add the initial investment amount to user's balance
      await db.collection("users").updateOne(
        { _id: new ObjectId(payment.userId) },
        { $inc: { balance: payment.amount, totalInvested: payment.amount } }
      );

      // Referral bonus: award $10 to referrer on first approved investment
      const referredUser = await db.collection("users").findOne({ _id: new ObjectId(payment.userId) });
      const referrerId = (referredUser as any)?.referredBy as string | undefined;
      if (referrerId) {
        // ensure not already rewarded for this referred user
        const existing = await db.collection("referral_payouts").findOne({ referredUserId: payment.userId });
        if (!existing && Number(payment.amount) >= 100) {
          const bonus = 10;
          await db.collection("referral_payouts").insertOne({
            referrerId,
            referredUserId: payment.userId,
            amount: bonus,
            createdAt: now.toISOString(),
            type: "referral_bonus",
          });
          await db.collection("users").updateOne(
            { _id: new ObjectId(referrerId) },
            { $inc: { balance: bonus, totalEarnings: bonus } }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/payments/[id] error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
