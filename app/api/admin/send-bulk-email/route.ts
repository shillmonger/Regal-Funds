import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from 'nodemailer';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function isAdminSession(session: any) {
  return (
    (session?.user as any)?.role === "admin" ||
    (session?.user?.email && process.env.ADMIN_EMAIL && session.user.email === process.env.ADMIN_EMAIL)
  );
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { userIds, subject, message } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-investment");

    // Fetch selected users
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id: string) => new ObjectId(id)) } })
      .toArray();

    if (users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const from = process.env.EMAIL_FROM || 'Regal Investment <regalinvestment358@gmail.com>';

    // Send emails to all selected users
    const emailPromises = users.map(async (user: any) => {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/bNychjPg/dark-logo.png" alt="Regal Investment" style="max-width: 200px; height: auto;" />
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #72a210; margin-top: 0;">${subject}</h2>
            
            <p>Hello ${user.name || 'Valued Investor'},</p>
            
            <div style="line-height: 1.6; margin: 20px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Regal Investment Team</p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px;">
            <p>© ${new Date().getFullYear()} Regal Investment. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from,
          to: user.email,
          subject: subject,
          html: emailHtml,
        });
        return { success: true, email: user.email };
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        return { success: false, email: user.email, error };
      }
    });

    const results = await Promise.all(emailPromises);

    const successful = results.filter((r: any) => r.success).length;
    const failed = results.filter((r: any) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Email sent to ${successful} user(s)`,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error("POST /api/admin/send-bulk-email error", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
