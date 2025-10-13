import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

function isAdminSession(session: any) {
  return (
    (session?.user as any)?.role === "admin" ||
    (session?.user?.email && process.env.ADMIN_EMAIL && session.user.email === process.env.ADMIN_EMAIL)
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const mapStatus = (s?: string) => {
      switch ((s || "active").toLowerCase()) {
        case "active":
          return "Active";
        case "blocked":
        case "banned":
          return "Suspended";
        default:
          return "Active";
      }
    };

    return NextResponse.json(
      users.map((u: any) => ({
        id: u._id.toString(),
        name: u.name || "",
        email: u.email || "",
        role: u.role || "user",
        joined: u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
        status: mapStatus(u.status),
        investment: Number(u.totalInvested || 0),
      }))
    );
  } catch (e) {
    console.error("GET /api/admin/users error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
