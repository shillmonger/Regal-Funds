import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const cursor = db.collection("investments").find({
      $or: [
        { durationDays: { $exists: false } },
        { dailyPercent: { $exists: false } },
        { daysAccrued: { $exists: false } },
        { lastAccruedAt: { $exists: false } },
      ],
    });

    let updated = 0;
    const nowIso = new Date().toISOString();
    for await (const inv of cursor) {
      const set: Record<string, any> = {};
      if (inv.durationDays === undefined) set.durationDays = 30;
      if (inv.dailyPercent === undefined) set.dailyPercent = 0.10; // 10%
      if (inv.daysAccrued === undefined) set.daysAccrued = 0;
      if (!inv.lastAccruedAt) set.lastAccruedAt = inv.approvedAt || nowIso;
      if (inv.earnings === undefined) set.earnings = 0;

      if (Object.keys(set).length) {
        await db.collection("investments").updateOne({ _id: inv._id }, { $set: set });
        updated += 1;
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (e) {
    console.error("POST /api/investments/migrate-accrual error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
