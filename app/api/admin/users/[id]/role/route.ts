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

    const { role } = (await req.json()) as { role?: string };
    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/admin/users/[id]/role error", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
