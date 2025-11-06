import { NextResponse } from "next/server";
import {sendmessage } from "@/components/message"
import validator from 'validator';
export async function POST(req: Request) {
    try {
        const { email, message } = await req.json();
        if (!email || !message) {
            return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
        }
        if (!validator.isEmail(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }
        if(message.length > 500){
            return NextResponse.json({ error: "Message is too long. Maximum length is 500 characters." }, { status: 400 });
        }
        if (!message.trim()) {
            return NextResponse.json(
                { error: "Message cannot be empty or just spaces." },
                { status: 400 }
            );
            }
        await sendmessage(email , message);
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (err) {
        const error=err as  Error;
    const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
                    console.error("Error sending message:", error);
                    return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, {status: 500});
  }
}