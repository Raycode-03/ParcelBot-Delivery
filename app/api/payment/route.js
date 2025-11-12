import { NextResponse } from "next/server";
import { connect_db, get_db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Paystack from "paystack";
// Initialize Paystack
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    const {
      id,
      orderNumber,
      senderName,
      senderPhone,
      senderEmail,
      receiverName,
      receiverPhone,
      packageDescription,
      packageValue,
      price,
    } = body;

    // Validate required fields
    if (!id || !orderNumber || !senderEmail) {
      return NextResponse.json(
        { error: "Order ID, order number, and sender email are required" },
        { status: 400 }
      );
    }

    if (!packageValue || price <= 0 || !price || packageValue<=0) {
      return NextResponse.json(
        { error: "Valid package value is required" },
        { status: 400 }
      );
    }

    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    // Verify the order exists and is still pending
    const existingOrder = await ordersCollection.findOne({
      _id: new ObjectId(id),
      status: "pending"
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found or already processed" },
        { status: 400 }
      );
    }
    const paymentReference = `${orderNumber}}`;

    // ✅ Create Paystack transaction with callback URL
    const transaction = await paystack.transaction.initialize({
      email: senderEmail,
      amount: Math.round(price * 100), // Convert to kobo
      currency: "NGN",
      reference: `ORD_${orderNumber}_${Date.now()}`,
      callback_url: `${process.env.NEXTAUTH_URL}/transaction?reference=${paymentReference}`,
      metadata: {
        orderId: id,
        orderNumber: orderNumber,
        senderName: senderName,
        senderPhone: senderPhone,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        packageDescription: packageDescription,
        price:price
      }
    });

    if (!transaction.status) {
      return NextResponse.json(
        { error: "Failed to initialize payment with Paystack" },
        { status: 500 }
      );
    }

    // Store payment reference in order
    await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          paymentReference: transaction.data.reference,
          paymentStatus: "initiated",
          paymentGateway: "paystack",
          updatedAt: new Date(),
        } 
      }
    );

    return NextResponse.json({
      success: true,
      authorizationUrl: transaction.data.authorization_url,
      reference: transaction.data.reference,
      message: "Redirect to Paystack to complete payment"
    }, { status: 200 });

  } catch (error) {
          const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
           console.error("Paystack payment initialization error:", error);
          return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
      }
}