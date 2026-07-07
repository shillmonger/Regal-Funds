import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const now = new Date();

    const investments = await db.collection("investments").find({}).toArray();

    const investmentDetails = investments.map(inv => {
      const approvedAt = new Date(inv.approvedAt);
      const lastAccruedAt = inv.lastAccruedAt ? new Date(inv.lastAccruedAt) : approvedAt;
      const hoursSinceApproval = (now.getTime() - approvedAt.getTime()) / 36e5;
      const hoursSinceLastAccrual = (now.getTime() - lastAccruedAt.getTime()) / 36e5;

      return {
        _id: inv._id,
        userId: inv.userId,
        planName: inv.planName,
        amount: inv.amount,
        status: inv.status,
        daysAccrued: inv.daysAccrued,
        durationDays: inv.durationDays,
        earnings: inv.earnings,
        dailyPercent: inv.dailyPercent,
        canWithdraw: inv.canWithdraw,
        approvedAt: inv.approvedAt,
        lastAccruedAt: inv.lastAccruedAt,
        firstPayoutDate: inv.firstPayoutDate,
        hoursSinceApproval: Math.round(hoursSinceApproval * 100) / 100,
        hoursSinceLastAccrual: Math.round(hoursSinceLastAccrual * 100) / 100,
        shouldUnlockWithdraw: !inv.canWithdraw && (
          (inv.daysAccrued === 0 && hoursSinceApproval >= 24) ||
          (inv.daysAccrued >= 1)
        ),
        shouldAddDailyROI: inv.daysAccrued > 0 && hoursSinceLastAccrual >= 24,
        shouldAddFirstROI: inv.daysAccrued === 0 && hoursSinceApproval >= 24,
        progressPercent: Math.round((inv.daysAccrued / inv.durationDays) * 100)
      };
    });

    return NextResponse.json({
      total: investments.length,
      investments: investmentDetails
    });

  } catch (error) {
    console.error("Debug investments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
