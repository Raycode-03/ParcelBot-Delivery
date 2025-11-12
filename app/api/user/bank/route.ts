import { NextResponse } from "next/server";
import { connect_db, get_db } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/getsessionuser";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountName, accountNumber, bankName } = await req.json();

    if (!accountName || !accountNumber || !bankName) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await connect_db();
    const db = await get_db();

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(sessionUser.userId) },
      {
        $set: {
          bank: { accountName, accountNumber, bankName },
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    // Check if the update was successful
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // The updated document might be in different properties based on MongoDB driver
    const updatedUser = result.value || result;

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bank details updated successfully",
        data: updatedUser,
      },
      { status: 200 } // Changed from 201 to 200 since this is an update, not creation
    );
  } catch (err) {
        const error=err as  Error;
      const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
    console.error("Error updating bank details:", error);
    return NextResponse.json(
      { error: isDbError ? "Network unavailable" : "Internal server error" },
      { status: 500 }
    );
  }
}