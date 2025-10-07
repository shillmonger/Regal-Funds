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
    const { fullName, username }: { fullName?: string; username?: string } = body;

    const update: Record<string, unknown> = {};
    if (typeof fullName === "string") update.name = fullName.trim();
    if (typeof username === "string") update.username = username.trim();

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

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
