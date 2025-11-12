import { connect_db, get_db } from "@/lib/mongodb";

// ✅ Fetch all upcomingorders
export async function upcomingorder() {
  try {
    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection
      .find({ status: "processing delivery" })
      .sort({ createdAt: -1 })
      .toArray();

    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
export async function completedorder() {
  try {
    await connect_db();
    const db = get_db();
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection
      .find({ status: "completed" })
      .sort({ createdAt: -1 })
      .toArray();

    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
