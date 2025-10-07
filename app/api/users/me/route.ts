import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(((session as any).user.id as string)) },
      { projection: { passwordHash: 0 } }
    );
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: (user as any).username,
      wallets: (user as any).wallets || {},
      twoFactorEnabled: (user as any).twoFactorEnabled || false,
      loginAlertsEnabled: (user as any).loginAlertsEnabled || false,
      createdAt: user.createdAt,
      lastLogin: (user as any).lastLogin,
      loginHistory: (user as any).loginHistory || [],
    });
  } catch (e) {
    console.error("GET /api/users/me error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { twoFactorEnabled, loginAlertsEnabled } = body as {
      twoFactorEnabled?: boolean;
      loginAlertsEnabled?: boolean;
    };
    const update: Record<string, unknown> = {};
    if (typeof twoFactorEnabled === "boolean") update.twoFactorEnabled = twoFactorEnabled;
    if (typeof loginAlertsEnabled === "boolean") update.loginAlertsEnabled = loginAlertsEnabled;
    if (!Object.keys(update).length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    const client = await clientPromise;
    const db = client.db("crypto-investment");
    await db.collection("users").updateOne(
      { _id: new ObjectId(((session as any).user.id as string)) },
      { $set: update }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/users/me error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


