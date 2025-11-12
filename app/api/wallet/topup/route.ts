import { NextResponse } from "next/server";
import { connect_db, get_db } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/getsessionuser";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    // Validate amount
    if (!amount || amount < 100) {
      return NextResponse.json({ 
        error: "Amount must be at least ₦100" 
      }, { status: 400 });
    }

    await connect_db();
    const db = await get_db();

    // Get user details
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(sessionUser.userId) }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata: {
          userId: sessionUser.userId,
          type: 'wallet_topup',
          fullName: user.fullName || 'User',
        },
        callback_url: `${process.env.NEXTAUTH_URL}/orders?tab=wallet`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);
      return NextResponse.json({ 
        error: "Failed to initialize payment" 
      }, { status: 500 });
    }

    // Save pending transaction
    await db.collection("wallet_transactions").insertOne({
      userId: new ObjectId(sessionUser.userId),
      reference: paystackData.data.reference,
      amount: amount,
      type: 'topup',
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });

  } catch (error) {
    console.error("Error initiating wallet topup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
