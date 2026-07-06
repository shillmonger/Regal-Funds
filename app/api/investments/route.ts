import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const investments = await db
      .collection("investments")
      .find({ userId: (session as any).user.id })
      .sort({ approvedAt: -1 })
      .toArray();

    // Fetch earnings logs for each investment
    const investmentIds = investments.map((inv: any) => inv._id.toString());
    const earningsLogs = await db
      .collection("earnings_logs")
      .find({ investmentId: { $in: investmentIds } })
      .sort({ createdAt: -1 })
      .toArray();

    // Group earnings logs by investmentId
    const earningsByInvestment: Record<string, any[]> = {};
    earningsLogs.forEach((log: any) => {
      const investmentId = log.investmentId.toString();
      if (!earningsByInvestment[investmentId]) {
        earningsByInvestment[investmentId] = [];
      }
      earningsByInvestment[investmentId].push({
        date: new Date(log.createdAt).toLocaleDateString(),
        rate: (log.dailyPercent * 100).toFixed(2),
        amount: log.amount,
        days: log.days,
      });
    });

    // Convert ObjectId to string for JSON serialization and add profit history
    const serializedInvestments = investments.map((inv: any) => ({
      ...inv,
      _id: inv._id.toString(),
      profitHistory: earningsByInvestment[inv._id.toString()] || [],
    }));

    return NextResponse.json({ investments: serializedInvestments });
  } catch (e) {
    console.error("GET /api/investments error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
