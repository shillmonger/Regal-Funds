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

    // Check for investments where first 10% has been added (canWithdraw is true)
    const maturedCount = await db.collection("investments").countDocuments({
      userId: session.user.id,
      status: "Active",
      canWithdraw: true
    });

    const userDoc = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) });

    const balance = Number((userDoc as any)?.balance ?? 0);

    return NextResponse.json({
      eligible: maturedCount > 0,
      maturedInvestments: maturedCount,
      balance,
      minimumWithdrawal: 50,
    });
  } catch (e) {
    console.error("GET /api/withdrawals/eligibility error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db("crypto-investment");

//     // For testing: allow withdrawals immediately after deposit
//     // So we’ll treat all active investments as “matured”
//     const activeCount = await db.collection("investments").countDocuments({
//       userId: session.user.id,
//       status: "Active",
//     });

//     const userDoc = await db
//       .collection("users")
//       .findOne({ _id: new ObjectId(session.user.id) });

//     const balance = Number((userDoc as any)?.balance ?? 0);

//     return NextResponse.json({
//       eligible: activeCount > 0, // instantly eligible if they have any active investment
//       maturedInvestments: activeCount,
//       balance,
//       minimumWithdrawal: 50,
//       testMode: true, // optional flag to indicate testing mode
//     });
//   } catch (e) {
//     console.error("GET /api/withdrawals/eligibility error", e);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }
