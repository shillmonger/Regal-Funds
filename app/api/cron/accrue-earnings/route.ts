import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("crypto-investment");
    const now = new Date();
    
    // Get all active investments that haven't reached their duration
    const activeInvestments = await db
      .collection("investments")
      .find({
        status: "Active",
        $expr: { $lt: ["$daysAccrued", "$durationDays"] },
      })
      .toArray();

    let processedCount = 0;
    
    for (const inv of activeInvestments) {
      try {
        const amount = Number(inv.amount) || 0;
        const dailyPercent = Number(inv.dailyPercent) || 0.10; // Default to 10% if not set
        const daysAccrued = Number(inv.daysAccrued) || 0;
        const durationDays = Number(inv.durationDays) || 30;
        const lastAccruedAt = inv.lastAccruedAt ? new Date(inv.lastAccruedAt) : new Date(inv.approvedAt);
        
        // Calculate hours since last accrual
        const msPerHour = 60 * 60 * 1000;
        const hoursSinceLastAccrual = (now.getTime() - lastAccruedAt.getTime()) / msPerHour;
        
        // For the first ROI, ensure 24 hours have passed since approval
        const approvedAt = new Date(inv.approvedAt);
        const hoursSinceApproval = (now.getTime() - approvedAt.getTime()) / msPerHour;
        
        // Skip if less than 24 hours since approval or less than 24 hours since last accrual
        if (hoursSinceApproval < 24 || hoursSinceLastAccrual < 24) continue;
        
        // Calculate earnings for the elapsed days (1 day at a time)
        const daysToAccrue = 1;
        const earnings = amount * dailyPercent * daysToAccrue;
        const newDaysAccrued = daysAccrued + daysToAccrue;
        
        // Update investment with new earnings
        const update: any = {
          $inc: { earnings, daysAccrued: daysToAccrue },
          $set: { lastAccruedAt: now.toISOString() },
        };
        
        // If this is the first 10% being added (after 24 hours), mark investment as eligible for withdrawal
        if (!inv.canWithdraw && newDaysAccrued >= 1 && hoursSinceApproval >= 24) {
          update.$set.canWithdraw = true;
          update.$set.firstPayoutDate = now.toISOString();
          
          // Add a log entry for the first ROI
          await db.collection('earnings_logs').insertOne({
            userId: inv.userId,
            investmentId: inv._id,
            amount: earnings,
            days: 1,
            dailyPercent,
            createdAt: now.toISOString(),
            type: 'first_roi',
            planName: inv.planName,
          });
        }
        
        await db.collection("investments").updateOne(
          { _id: inv._id },
          update
        );
        
        // Update user's balance and total earnings
        await db.collection("users").updateOne(
          { _id: new ObjectId(inv.userId) },
          { 
            $inc: { 
              balance: earnings,
              totalEarnings: earnings 
            } 
          }
        );
        
        // Log the earnings
        await db.collection("earnings_logs").insertOne({
          userId: inv.userId,
          investmentId: inv._id,
          amount: earnings,
          days: daysToAccrue,
          dailyPercent,
          createdAt: now.toISOString(),
          type: "roi",
          planName: inv.planName,
        });
        
        processedCount++;
      } catch (error) {
        console.error(`Error processing investment ${inv._id}:`, error);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: processedCount,
      totalInvestments: activeInvestments.length 
    });
    
  } catch (error) {
    console.error('Error in accrue-earnings:', error);
    return NextResponse.json(
      { error: 'Failed to process earnings accrual' },
      { status: 500 }
    );
  }
}
