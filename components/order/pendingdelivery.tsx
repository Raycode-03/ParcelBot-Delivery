"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Package2, EllipsisVertical } from "lucide-react";

interface PendingDeliveryProps {
  onOrdersCountChange?: (count: number) => void;
}
interface Receiver {
  fullname: string;
phoneNumber:string;
packageValue: number;
packageDescription: string
  
}
interface Sender{
fullname:string;
phoneNumber:string;
email:string;
}
interface Order {
  _id: string;
  orderNumber: string;
  deliveryType: string;
  pickup: string;
  destination: string;
  status: string;
  createdAt: string;
  description:string;
  price:number;
  receiver: Receiver;
  sender: Sender;
}

function Pendingdelivary({ onOrdersCountChange }: PendingDeliveryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/pendingorder`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch orders");
        } else {
          setOrders(data.result);
           if (onOrdersCountChange) {
              const count = Array.isArray(data?.result) ? data.result.length : 0;
              onOrdersCountChange(count);
            }
        } 
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
   // ✅ Delete Order function
  const deleteOrder = async (id: string) => {
    try {
      // Optimistically remove from UI
      setOrders((prev) => prev.filter((order) => order._id !== id));

      const res = await fetch(`/api/orders/pendingorder`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete order");
        // Revert if failed
        setOrders((prev) => [...prev, data.deletedOrder]);
      } else {
        if (onOrdersCountChange) {
        onOrdersCountChange(orders.length - 1); 
      }
        toast.success("Order deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("An error occurred while deleting order");
    }
  };

  // payment function
  // In your PendingDelivery component
const payment = async (order: Order) => {
  try {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order._id,
        orderNumber: order.orderNumber,
        senderName: order.sender.fullname,
        senderPhone: order.sender.phoneNumber,
        senderEmail: order.sender.email,
        receiverName: order.receiver.fullname,
        receiverPhone: order.receiver.phoneNumber,
        packageDescription: order.receiver.packageDescription,
        packageValue: order.receiver.packageValue,
        price:order.price
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Payment initialization failed");
      return;
    }

    // Redirect to Paystack
    if (data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
    }
    
  } catch (err) {
    console.error("Payment error:", err);
    toast.error("An error occurred during payment initialization");
  }
}
  const formatDate = (dateString: string) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-sm">Loading pending orders...</p>
      </div>
    );
  }

  const filteredOrders =Array.isArray(orders)?orders.filter((order) =>
      order.receiver.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      order.destination?.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryType?.toLowerCase().includes(search.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(search.toLowerCase())
  ):[];

  return (
    <div className="flex flex-col p-6 h-[430px]">
      {/* Header */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Pending Request
        </h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search pending request"
            className="w-[50%] pl-10 pr-3 py-2 border bg-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredOrders?.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending orders found</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders?.map((order: Order) => (
  <div
    key={order._id}
    className="border border-gray-100 rounded-xl p-4 transition-shadow"
  >
    {/* Date row */}
    <div className="flex items-center gap-2 mb-2">
      <Package2 className="h-4 w-4 text-black" />
      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
    </div>

    {/* Order details grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs uppercase tracking-wide">
          Receiver&apos;s name
        </span>
        <span className="text-gray-800 text-sm font-medium">
          {order.receiver.fullname || "—"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-500 text-xs uppercase tracking-wide">
          Destination
        </span>
        <span className="text-gray-800 text-sm font-medium">
          {order.destination || "—"}
        </span>
      </div>

      {/* Delivery type + ellipsis on same line */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wide">
            Delivery Type
          </span>
          <span className="text-gray-800 text-sm font-medium">
            {order.deliveryType || "—"}
          </span>
        </div>
       <div className="relative group">
  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
    <EllipsisVertical size={18} className="text-gray-600" />
  </button>
  
  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
   <button
  className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors cursor-pointer active:scale-95"
  onClick={() => payment(order)}
>
  Continue to Payment
</button>

<button
  className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors cursor-pointer"
  onClick={() => deleteOrder(order._id)}
>
  Delete
</button>

  </div>
</div>
      </div>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Pendingdelivary;
