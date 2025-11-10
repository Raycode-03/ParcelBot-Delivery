import { get_db, connect_db } from "@/lib/mongodb";
// Generate unique order number
function generateOrderNumber() {
    const prefix = "ORD";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}   

export async function neworder_services(data) {
    try {
        await connect_db();
        const db = get_db();

        // Check if orders collection exists, if not create it
        const ordersCollection = db.collection("orders");

        // Prepare order document
        const orderDocument = {
            orderNumber: generateOrderNumber(),
            deliveryType: data.deliveryType,
            pickup: data.pickup,
            destination: data.destination,
            price: data.price,
            deliverySpeed: data.deliverySpeed,
            duration: data.duration || null,
            
            // Sender information
            sender: {
                fullname: data.sender.fullname,
                phoneNumber: data.sender.phoneNumber,
                email: data.sender.email,
            },
            
            // Receiver information
            receiver: {
                fullname: data.receiver.fullname,
                phoneNumber: data.receiver.phoneNumber,
                packageValue: data.receiver.packageValue,
                packageDescription: data.receiver.packageDescription,
            },
            
            // Order metadata
            status: "pending", // pending, in_transit, delivered, cancelled
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert order into database
        const result = await ordersCollection.insertOne(orderDocument);

        if (!result.insertedId) {
            return "Failed to create order";
        }

        // Return the created order with ID
        return {
            _id: result.insertedId,
            ...orderDocument
        };

    } catch (error) {
        console.error("Service error creating order:", error);
        
        if (error.code === 11000) {
            return "Order with this information already exists";
        }
        
        return "Failed to create order. Please try again.";
    }
}

