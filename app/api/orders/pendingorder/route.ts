import { NextResponse } from "next/server";
import { getpendingorder } from "@/services/pendingorder_services";
import { deleteorder } from "@/services/pendingorder_services";
export async function GET() {
    try {
        const result = await getpendingorder(); // Added 'await'
        
        if (result.length === 0) {
            return NextResponse.json({ 
                message: "No pending orders found",
                orders: [] 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: true, result 
        }, { status: 200 });

    }catch (error:any) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Error Fetching orders:", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
}

// ✅ DELETE an order by ID
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // 👈 expects { "id": "orderId" }

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteorder(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error:any) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Error deleting order", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
}