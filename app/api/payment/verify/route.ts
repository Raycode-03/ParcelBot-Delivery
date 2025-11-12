// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import { connect_db, get_db } from "@/lib/mongodb";
import Paystack from "paystack";

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const verification = await paystack.transaction.verify(reference);

    if (!verification.status || verification.data.status !== 'success') {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    // Update order status
    await ordersCollection.updateOne(
      { paymentReference: reference },
      { 
        $set: { 
          paymentStatus: "completed",
          status: "completed",
          paidAt: new Date()
        } 
      }
    );

    // Return transaction details
    return NextResponse.json({
      success: true,
      transaction: {
        reference: verification.data.reference,
        amount: verification.data.amount / 100, // Convert from kobo
        paidAt: verification.data.paid_at,
        metadata: verification.data.metadata
      }
    });

  }catch (error:any) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
}