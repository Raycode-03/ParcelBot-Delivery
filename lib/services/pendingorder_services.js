import { connect_db, get_db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Fetch all pending orders
export async function getpendingorder() {
  try {
    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

// ✅ Delete order by ID
export async function deleteorder(id) {
  try {
    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
}