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

    await connect_db();
    const db = await get_db();

    const transactions = await db
      .collection("wallet_transactions")
      .find({ userId: new ObjectId(sessionUser.userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}