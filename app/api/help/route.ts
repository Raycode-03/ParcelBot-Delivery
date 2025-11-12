import { NextResponse } from "next/server";
import { connect_db , get_db} from "@/lib/mongodb";
import { sendquestion } from "@/components/auth/message"; // Assuming this sends or stores the message

export async function POST(req: Request) {
  try {
      // 1️⃣ Connect to DB
    await connect_db();
    const db = await get_db();


    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

     

    // 3️⃣ Create a new message object
    const newMessage = {
      message,
      createdAt: new Date(),
      status: "unread", // optional — can track if admin viewed
    };

    // 4️⃣ Insert into collection
    const result = await db.collection("help_messages").insertOne(newMessage);
    await sendquestion(message , newMessage.createdAt);
    // 5️⃣ Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Message stored successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting question:", error);

    const isDbError =
      error.message?.includes("MongoNetworkError") ||
      error.message?.includes("ENOTFOUND");

    return NextResponse.json(
      {
        error: isDbError
          ? "Network unavailable, please try again later"
          : "Internal server error",
      },
      { status: 500 }
    );
  }
}
