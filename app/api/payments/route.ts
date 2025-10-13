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

    // If admin, return all payments; else only user's
    const isAdmin = (session.user as any).role === "admin";
    const query = isAdmin ? {} : { userId: session.user.id };

    const payments = await db
      .collection("payments")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      payments.map((p: any) => ({
        id: p._id.toString(),
        userId: p.userId,
        userEmail: p.userEmail,
        userName: p.userName,
        amount: p.amount,
        planName: p.planName,
        planId: p.planId,
        roi: p.roi,
        duration: p.duration,
        crypto: p.crypto,
        walletAddress: p.walletAddress,
        transactionId: p.transactionId,
        notes: p.notes,
        status: p.status,
        paidAt: p.paidAt || null,
        createdAt: p.createdAt,
      }))
    );
  } catch (e) {
    console.error("GET /api/payments error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      amount,
      planId,
      planName,
      roi,
      duration,
      crypto,
      walletAddress,
      transactionId,
      notes,
    } = body as {
      amount: number;
      planId?: string | number;
      planName: string;
      roi: number;
      duration: number;
      crypto: string;
      walletAddress: string;
      transactionId?: string;
      notes?: string;
    };

    if (!amount || !planName || !roi || !duration || !crypto || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const doc = {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      amount,
      planId: planId ?? null,
      planName,
      roi,
      duration,
      crypto,
      walletAddress,
      transactionId: transactionId || null,
      notes: notes || null,
      status: "Pending" as const,
      paidAt: null as null,
      createdAt: new Date().toISOString(),
    };

    const inserted = await db.collection("payments").insertOne(doc);

    return NextResponse.json({ id: inserted.insertedId.toString(), ...doc }, { status: 201 });
  } catch (e) {
    console.error("POST /api/payments error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
