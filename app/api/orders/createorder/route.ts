import { NextResponse } from "next/server";
import { validateorder } from "@/validations/validate_order";
import { neworder_services } from "@/services/order_services";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data } = body;
        if (!data) {
            return NextResponse.json({ error: "Missing order data" }, { status: 400 });
        }

        // Validate order input
        const validationerror = validateorder(data);
        if (validationerror) {
            return NextResponse.json({ ok: false, error: validationerror }, { status: 400 });
        }

        // Create order service
        const serviceResult = await neworder_services(data);
        
        if (typeof serviceResult === "string") {
            // Service returned an error message
            return NextResponse.json({ ok: false, error: serviceResult }, { status: 400 });
        }

        // ✅ Success response
        return NextResponse.json({ 
            ok: true,
            success: "Order created successfully!",
        }, { status: 201 });

    } catch (error: any) {
        const isDbError = error.message?.includes('MongoNetworkError') || 
                         error.message?.includes('ENOTFOUND');
        console.error("Error creating order:", error);
        return NextResponse.json({ 
            ok: false, 
            error: isDbError ? "Database connection failed" : "Internal server error" 
        }, { status: 500 });
    }
}
