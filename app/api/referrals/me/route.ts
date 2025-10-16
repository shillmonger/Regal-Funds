import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function generateReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const userId = new ObjectId(session.user.id);
    let user = await db.collection("users").findOne({ _id: userId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ensure referralCode exists and is unique
    let referralCode = (user as any).referralCode as string | undefined;
    if (!referralCode) {
      // try up to 5 times to avoid collisions
      for (let i = 0; i < 5; i++) {
        const code = generateReferralCode();
        const exists = await db.collection("users").findOne({ referralCode: code });
        if (!exists) {
          await db.collection("users").updateOne({ _id: userId }, { $set: { referralCode: code } });
          referralCode = code;
          break;
        }
      }
      user = await db.collection("users").findOne({ _id: userId });
    }

    const totalReferrals = await db.collection("users").countDocuments({ referredBy: session.user.id });

    const payoutsAgg = await db
      .collection("referral_payouts")
      .aggregate([
        { $match: { referrerId: session.user.id } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();
    const totalReferralEarnings = payoutsAgg[0]?.total || 0;

    const origin = process.env.NEXT_PUBLIC_APP_URL || (req as any).nextUrl?.origin || req.headers.get("origin") || "http://localhost:3000";
    const referralURL = `${origin}/auth/register?ref=${referralCode}`;

    return NextResponse.json({
      referralCode,
      referralURL,
      totalReferrals,
      totalReferralEarnings,
    });
  } catch (e) {
    console.error("GET /api/referrals/me error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
