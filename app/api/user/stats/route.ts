import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Accrue daily earnings for active investments
    const activeInvestments = await db
      .collection("investments")
      .find({ userId: session.user.id, status: "Active" })
      .toArray();

    let accruedTotal = 0;
    const now = new Date();
    for (const inv of activeInvestments) {
      const durationDays = Number((inv as any).durationDays ?? 30);
      const dailyPercent = Number((inv as any).dailyPercent ?? 0);
      const daysAccrued = Number((inv as any).daysAccrued ?? 0);
      const lastAccruedAt = (inv as any).lastAccruedAt ? new Date((inv as any).lastAccruedAt) : new Date((inv as any).approvedAt || Date.now());
      const amount = Number((inv as any).amount ?? 0);

      if (dailyPercent <= 0 || amount <= 0 || daysAccrued >= durationDays) continue;

      // Calculate whole days elapsed since lastAccruedAt
      const msPerDay = 24 * 60 * 60 * 1000;
      const elapsedDays = Math.floor((now.getTime() - lastAccruedAt.getTime()) / msPerDay);
      if (elapsedDays <= 0) continue;

      const remaining = durationDays - daysAccrued;
      const toAccrueDays = Math.min(elapsedDays, remaining);
      const accrueAmount = toAccrueDays * (dailyPercent * amount);

      if (accrueAmount > 0) {
        accruedTotal += accrueAmount;
        await db.collection("investments").updateOne(
          { _id: inv._id },
          {
            $inc: { earnings: accrueAmount, daysAccrued: toAccrueDays },
            $set: { lastAccruedAt: now.toISOString() },
          }
        );
        // Log ROI accrual into earnings_logs (single aggregate entry for this run)
        await db.collection("earnings_logs").insertOne({
          userId: session.user.id,
          investmentId: (inv as any)._id?.toString?.() || null,
          amount: accrueAmount,
          days: toAccrueDays,
          dailyPercent,
          createdAt: now.toISOString(),
          type: "roi",
          planName: (inv as any).planName,
        });
      }
    }

    if (accruedTotal > 0) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(session.user.id) },
        { $inc: { balance: accruedTotal, totalEarnings: accruedTotal } }
      );
    }

    // Fetch user balance/totalInvested if present on user doc
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) });

    // Compute active investments and fallback totals from investments collection
    const [activeInvestmentsCount, totalsFromInvestments] = await Promise.all([
      db
        .collection("investments")
        .countDocuments({ userId: session.user.id, status: "Active" }),
      db
        .collection("investments")
        .aggregate([
          { $match: { userId: session.user.id } },
          { $group: { _id: null, totalInvested: { $sum: "$amount" }, totalEarnings: { $sum: "$earnings" } } },
        ])
        .toArray(),
    ]);

    const totalInvestedFromAgg = totalsFromInvestments[0]?.totalInvested ?? 0;
    const totalEarningsFromAgg = totalsFromInvestments[0]?.totalEarnings ?? 0;

    const balance = (user as any)?.balance ?? 0;
    const totalInvested = (user as any)?.totalInvested ?? totalInvestedFromAgg;
    const totalEarnings = (user as any)?.totalEarnings ?? totalEarningsFromAgg;

    // Referral totals
    const [refAgg, refCount] = await Promise.all([
      db
        .collection("referral_payouts")
        .aggregate([
          { $match: { referrerId: session.user.id } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        .toArray(),
      db.collection("users").countDocuments({ referredBy: session.user.id }),
    ]);
    const referralEarnings = Number(refAgg[0]?.total || 0);
    const referralCount = Number(refCount || 0);

    return NextResponse.json({
      balance,
      totalInvested,
      activeInvestmentsCount,
      totalEarnings,
      earningsToday: accruedTotal,
      referralEarnings,
      referralCount,
    });
  } catch (e) {
    console.error("GET /api/user/stats error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
