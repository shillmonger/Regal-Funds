import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const [payments, investments, withdrawals, referralPayouts, earningsLogs] = await Promise.all([
      db
        .collection("payments")
        .find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
      db
        .collection("investments")
        .find({ userId: session.user.id })
        .sort({ approvedAt: -1 })
        .limit(10)
        .toArray(),
      db
        .collection("withdrawals")
        .find({ userId: session.user.id })
        .sort({ requestedAt: -1 })
        .limit(10)
        .toArray(),
      db
        .collection("referral_payouts")
        .find({ referrerId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
      db
        .collection("earnings_logs")
        .find({ userId: session.user.id, type: "roi" })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    const paymentActivities = payments.map((p: any) => ({
      id: p._id.toString(),
      kind: "payment" as const,
      status: p.status as string,
      amount: Number(p.amount) || 0,
      planName: p.planName,
      date: p.createdAt || new Date().toISOString(),
    }));

    const investmentActivities = investments.map((i: any) => ({
      id: i._id.toString(),
      kind: "investment" as const,
      status: i.status as string,
      amount: Number(i.amount) || 0,
      planName: i.planName,
      date: i.approvedAt || new Date().toISOString(),
    }));

    const withdrawalActivities = withdrawals.map((w: any) => ({
      id: w._id.toString(),
      kind: "withdrawal" as const,
      status: w.status as string,
      amount: Number(w.amount) || 0,
      planName: undefined as any,
      date: w.requestedAt || new Date().toISOString(),
    }));

    const referralActivities = referralPayouts.map((r: any) => ({
      id: r._id.toString(),
      kind: "referral" as const,
      status: "Paid",
      amount: Number(r.amount) || 0,
      planName: undefined as any,
      date: r.createdAt || new Date().toISOString(),
    }));

    const roiActivities = earningsLogs.map((e: any) => ({
      id: e._id.toString(),
      kind: "roi" as const,
      status: "Paid",
      amount: Number(e.amount) || 0,
      planName: e.planName,
      date: e.createdAt || new Date().toISOString(),
    }));

    const merged = [...paymentActivities, ...investmentActivities, ...withdrawalActivities, ...referralActivities, ...roiActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json(merged);
  } catch (e) {
    console.error("GET /api/user/activity error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
