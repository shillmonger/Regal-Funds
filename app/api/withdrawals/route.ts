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
    const isAdmin = (session.user as any).role === "admin";
    const query = isAdmin ? {} : { userId: session.user.id };

    const withdrawals = await db
      .collection("withdrawals")
      .find(query)
      .sort({ requestedAt: -1 })
      .toArray();

    return NextResponse.json(
      withdrawals.map((w: any) => ({
        id: w._id.toString(),
        userId: w.userId,
        userEmail: w.userEmail,
        userName: w.userName,
        amount: Number(w.amount) || 0,
        walletAddress: w.walletAddress,
        crypto: w.crypto,
        status: w.status,
        requestedAt: w.requestedAt,
        approvedAt: w.approvedAt || null,
        txHash: w.txHash || null,
        adminNote: w.adminNote || null,
        investmentId: w.investmentId ? String(w.investmentId) : null,
      }))
    );
  } catch (e) {
    console.error("GET /api/withdrawals error", e);
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
    const { amount, walletAddress, crypto } = body as {
      amount: number;
      walletAddress: string;
      crypto: string;
    };

    if (!amount || !walletAddress || !crypto) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Ensure user has at least one investment with first 10% added
    const eligibleInvestment = await db.collection("investments").findOne({
      userId: session.user.id,
      status: "Active",
      canWithdraw: true
    });

    if (!eligibleInvestment) {
      return NextResponse.json(
        { error: "Withdrawals available only after first 10% ROI has been added to your investment" },
        { status: 403 }
      );
    }

    // Ensure user has sufficient balance
    const userDoc = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) });
    const balance = Number((userDoc as any)?.balance ?? 0);
    if (amount > balance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const doc = {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      amount: Number(amount),
      walletAddress,
      crypto,
      status: "Pending" as const,
      requestedAt: new Date().toISOString(),
      approvedAt: null as null,
      txHash: null as null,
      adminNote: null as null,
      investmentId: eligibleInvestment?._id ? String(eligibleInvestment._id) : null,
    };

    const inserted = await db.collection("withdrawals").insertOne(doc);

    return NextResponse.json({ id: inserted.insertedId.toString(), ...doc }, { status: 201 });
  } catch (e) {
    console.error("POST /api/withdrawals error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// // ===================
// // GET: Fetch withdrawals
// // ===================
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db("crypto-investment");

//     const isAdmin = (session.user as any).role === "admin";
//     const query = isAdmin ? {} : { userId: session.user.id };

//     const withdrawals = await db
//       .collection("withdrawals")
//       .find(query)
//       .sort({ requestedAt: -1 })
//       .toArray();

//     return NextResponse.json(
//       withdrawals.map((w: any) => ({
//         id: w._id.toString(),
//         userId: w.userId,
//         userEmail: w.userEmail,
//         userName: w.userName,
//         amount: Number(w.amount) || 0,
//         walletAddress: w.walletAddress,
//         crypto: w.crypto,
//         status: w.status,
//         requestedAt: w.requestedAt,
//         approvedAt: w.approvedAt || null,
//         txHash: w.txHash || null,
//         adminNote: w.adminNote || null,
//         investmentId: w.investmentId ? String(w.investmentId) : null,
//       }))
//     );
//   } catch (e) {
//     console.error("GET /api/withdrawals error", e);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // ===================
// // POST: Create withdrawal
// // ===================
// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { amount, walletAddress, crypto } = body as {
//       amount: number;
//       walletAddress: string;
//       crypto: string;
//     };

//     if (!amount || !walletAddress || !crypto) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db("crypto-investment");

//     const isTest = process.env.NODE_ENV !== "production";

//     // ✅ Allow withdrawal immediately during testing
//     const investmentQuery = {
//       userId: session.user.id,
//       status: "Active",
//       ...(isTest ? {} : { canWithdraw: true }), // only require canWithdraw in production
//     };

//     const eligibleInvestment = await db.collection("investments").findOne(investmentQuery);

//     if (!eligibleInvestment) {
//       return NextResponse.json(
//         {
//           error: isTest
//             ? "You need at least one active investment to withdraw (test mode)"
//             : "Withdrawals available only after first 10% ROI has been added to your investment",
//         },
//         { status: 403 }
//       );
//     }

//     // Ensure user has sufficient balance
//     const userDoc = await db
//       .collection("users")
//       .findOne({ _id: new ObjectId(session.user.id) });
//     const balance = Number((userDoc as any)?.balance ?? 0);

//     if (amount > balance) {
//       return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//     }

//     const doc = {
//       userId: session.user.id,
//       userEmail: session.user.email,
//       userName: session.user.name,
//       amount: Number(amount),
//       walletAddress,
//       crypto,
//       status: "Pending" as const,
//       requestedAt: new Date().toISOString(),
//       approvedAt: null as null,
//       txHash: null as null,
//       adminNote: null as null,
//       investmentId: eligibleInvestment?._id ? String(eligibleInvestment._id) : null,
//     };

//     const inserted = await db.collection("withdrawals").insertOne(doc);

//     return NextResponse.json({ id: inserted.insertedId.toString(), ...doc }, { status: 201 });
//   } catch (e) {
//     console.error("POST /api/withdrawals error", e);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }
