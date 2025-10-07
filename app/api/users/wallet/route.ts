import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/users/wallet
// body: { type: 'btc' | 'eth' | 'usdt' | 'bnb', address: string }
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, address } = (await req.json()) as {
      type?: string;
      address?: string;
    };

    const allowed = new Set(["btc", "eth", "usdt", "bnb"]);
    if (!type || !allowed.has(type)) {
      return NextResponse.json({ error: "Invalid wallet type" }, { status: 400 });
    }
    if (!address || typeof address !== "string" || address.trim().length < 6) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const userId = ((session as any).user?.id as string) || "";
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { [`wallets.${type}`]: address.trim() } },
      { upsert: false }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Save wallet error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


