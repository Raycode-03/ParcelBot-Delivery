import { NextResponse } from "next/server";
import { completedorder } from "@/services/upcomingorder_services";
export async function GET() {
    try {
        const result = await completedorder();
        
        if (result.length === 0) {
            return NextResponse.json({ 
                message: "No pending orders found",
                orders: [] 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: true, result 
        }, { status: 200 });

    }catch (error) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Error Fetching orders:", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
}