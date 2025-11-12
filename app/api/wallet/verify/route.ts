import { NextResponse } from "next/server";
import { connect_db, get_db } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/getsessionuser";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    await connect_db();
    const db = await get_db();

    // Check if transaction already verified
    const existingTransaction = await db.collection("wallet_transactions").findOne({
      reference: reference,
    });

    if (existingTransaction?.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: "Transaction already verified",
        transaction: existingTransaction,
      });
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      return NextResponse.json({ 
        error: "Payment verification failed" 
      }, { status: 400 });
    }

    const paymentData = paystackData.data;

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      await db.collection("wallet_transactions").updateOne(
        { reference: reference },
        { 
          $set: { 
            status: 'failed',
            updatedAt: new Date(),
          } 
        }
      );

      return NextResponse.json({
        success: false,
        message: "Payment was not successful",
      });
    }

    const amount = paymentData.amount / 100; // Convert from kobo to naira

    // Update wallet balance
    const updateResult = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(sessionUser.userId) },
      {
        $inc: { walletBalance: amount },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    // Update transaction status
    await db.collection("wallet_transactions").updateOne(
      { reference: reference },
      {
        $set: {
          status: 'completed',
          paidAt: new Date(paymentData.paid_at),
          updatedAt: new Date(),
        },
      }
    );

    const updatedUser = updateResult.value || updateResult;

    return NextResponse.json({
      success: true,
      message: "Wallet topped up successfully!",
      transaction: {
        reference: reference,
        amount: amount,
        newBalance: updatedUser?.walletBalance || 0,
      },
    });

  } catch (error) {
    console.error("Error verifying wallet topup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
