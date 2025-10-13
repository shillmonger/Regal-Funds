import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";

// PATCH /api/users/profile
export async function PATCH(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user?: { id?: string; email?: string | null; name?: string | null; image?: string | null };
    };

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, username, email }: { fullName?: string; username?: string; email?: string } = body;

    const update: Record<string, unknown> = {};
    if (typeof fullName === "string") update.name = fullName.trim();
    if (typeof username === "string") update.username = username.trim();

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Handle email update with uniqueness check
    if (typeof email === "string") {
      const newEmail = email.trim().toLowerCase();
      // rudimentary email check
      const emailOk = /.+@.+\..+/.test(newEmail);
      if (!emailOk) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      // If email is actually changing, ensure it's unique
      const current = await db.collection("users").findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { email: 1 } }
      );
      if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if ((current as any).email !== newEmail) {
        const exists = await db.collection("users").findOne({ email: newEmail });
        if (exists) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
        update.email = newEmail;
      }
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: update }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
