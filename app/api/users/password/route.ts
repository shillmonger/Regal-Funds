import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { compare, hash } from "bcryptjs";

// PATCH /api/users/password
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const user = await db.collection("users").findOne({ _id: new ObjectId(((session as any).user.id as string)) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await compare(currentPassword, (user as any).passwordHash || "");
    if (!ok) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    const newHash = await hash(newPassword, 10);
    await db.collection("users").updateOne(
      { _id: new ObjectId(((session as any).user.id as string)) },
      { $set: { passwordHash: newHash } }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/users/password error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
