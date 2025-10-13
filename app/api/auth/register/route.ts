import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const result = await db.collection("users").insertOne({
      name: username,
      email,
      passwordHash: hashedPassword,
      role: "user",
      status: "active",
      balance: 5, // welcome bonus
      totalInvested: 0,
      totalEarnings: 5, // count welcome bonus as earnings
      welcomeBonusGranted: true,
      createdAt: new Date(),
    });

    if (!result.insertedId) {
      throw new Error("User creation failed");
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
