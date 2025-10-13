import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function isAdminSession(session: any) {
  return (
    (session?.user as any)?.role === "admin" ||
    (session?.user?.email && process.env.ADMIN_EMAIL && session.user.email === process.env.ADMIN_EMAIL)
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { status } = body as { status: "Active" | "Suspended" };
    if (!status || (status !== "Active" && status !== "Suspended")) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const dbStatus = status === "Active" ? "active" : "blocked";

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { status: dbStatus } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/admin/users/[id] error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    await db.collection("users").deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/users/[id] error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
