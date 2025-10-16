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
    const { status, txHash, adminNote } = body as {
      status: "Approved" | "Rejected" | "Pending";
      txHash?: string | null;
      adminNote?: string | null;
    };

    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const w = await db
      .collection("withdrawals")
      .findOne({ _id: new ObjectId(id) });

    if (!w) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    // Update status and optional fields
    await db.collection("withdrawals").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          txHash: txHash ?? w.txHash ?? null,
          adminNote: adminNote ?? w.adminNote ?? null,
          approvedAt: status === "Approved" ? new Date().toISOString() : null,
        },
      }
    );

    // If approving, deduct user balance
    if (status === "Approved" && w.status !== "Approved") {
      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(w.userId) }, { $inc: { balance: -Number(w.amount || 0) } });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/withdrawals/[id] error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
