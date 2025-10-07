import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";

// POST /api/users/avatar
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user?: { id?: string; email?: string | null; name?: string | null; image?: string | null };
    };

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatar }: { avatar?: string } = await req.json();
    if (!avatar || typeof avatar !== "string") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { avatar } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
