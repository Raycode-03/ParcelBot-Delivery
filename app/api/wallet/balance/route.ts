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

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(sessionUser.userId) },
      { projection: { walletBalance: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: user.walletBalance || 0,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
