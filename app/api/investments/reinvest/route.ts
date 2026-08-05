import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, originalInvestmentId } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Get user info
    const user = await db.collection("users").findOne({
      email: session.user?.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has sufficient balance
    const userBalance = Number(user.balance || 0);
    if (userBalance < amount) {
      return NextResponse.json({ 
        error: `Insufficient balance. Your current balance is $${userBalance.toLocaleString()}, but you are trying to reinvest $${amount.toLocaleString()}.` 
      }, { status: 400 });
    }

    // Get original investment details for reference
    let originalInvestment = null;
    if (originalInvestmentId) {
      originalInvestment = await db.collection("investments").findOne({
        _id: new ObjectId(originalInvestmentId),
      });
    }

    // Create reinvestment record in payments collection
    const reinvestment = {
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      planId: "reinvest",
      planName: "Reinvestments",
      amount: Number(amount),
      roi: originalInvestment?.roi || 10, // Default to 10% if no original
      duration: originalInvestment?.duration || 30, // Default to 30 days if no original
      crypto: "USDT", // Default crypto for reinvestments
      walletAddress: "Reinvestment", // Placeholder for reinvestments
      transactionId: null,
      notes: `Reinvestment from original investment: ${originalInvestmentId || "N/A"}`,
      status: "Pending",
      paidAt: null,
      createdAt: new Date().toISOString(),
      originalInvestmentId: originalInvestmentId || null,
      isReinvestment: true, // Flag to identify reinvestments
    };

    const result = await db.collection("payments").insertOne(reinvestment);

    return NextResponse.json({
      success: true,
      payment: {
        ...reinvestment,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating reinvestment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
