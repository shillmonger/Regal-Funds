import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const investment = await db.collection("investments").findOne({
      _id: new ObjectId(id),
      userId: (session as any).user.id,
    });

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 });
    }

    // Update lastAccruedAt to current time to resume accrual
    await db.collection("investments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { lastAccruedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Investment resumed successfully" });
  } catch (e) {
    console.error("POST /api/investments/[id]/resume error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
