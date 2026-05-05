import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function isAdminSession(session: any) {
  return (
    (session?.user as any)?.role === "admin" ||
    (session?.user?.email &&
      process.env.ADMIN_EMAIL &&
      session.user.email === process.env.ADMIN_EMAIL)
  );
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await the params (new Next.js 15 requirement)
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { balance, totalEarnings, totalInvested } = (await req.json()) as {
      balance?: number;
      totalEarnings?: number;
      totalInvested?: number;
    };

    // Validate input
    if (
      balance === undefined ||
      totalEarnings === undefined ||
      totalInvested === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields: balance, totalEarnings, totalInvested" },
        { status: 400 }
      );
    }

    if (
      typeof balance !== "number" ||
      typeof totalEarnings !== "number" ||
      typeof totalInvested !== "number" ||
      balance < 0 ||
      totalEarnings < 0 ||
      totalInvested < 0
    ) {
      return NextResponse.json(
        { error: "All fields must be non-negative numbers" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    // Update user details
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          balance,
          totalEarnings,
          totalInvested,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "User details updated successfully"
    });
  } catch (e) {
    console.error("PUT /api/admin/users/[id]/details error", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
