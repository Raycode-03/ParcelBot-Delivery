"use client"
import React, { useState , useEffect} from 'react'
import {Separator} from '@/components/ui/separator';
import {toast} from 'sonner'
interface PendingDeliveryProps {
  onAmountChange?: (count: number) => void;
}
function Wallet({ onAmountChange }: PendingDeliveryProps) {
  const [amount , setamount] = useState(0);

   useEffect(() => {
    // const fetchOrders = async () => {
    //   try {
    //     const res = await fetch(`/api/orders/upcomingorder`, {
    //       method: "GET",
    //       headers: { "Content-type": "application/json" },
    //     });
    //     const data = await res.json();

    //     if (!res.ok) {
    //       toast.error(data.error || "Failed to fetch orders");
    //     } else {
    //       if (onAmountChange) {
    //         const count = Array.isArray(data?.result)
    //           ? data.result.length
    //           : 0;
    //         onAmountChange(count);
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error fetching orders:", error);
    //     toast.error("Failed to load orders");
    //   }
    // };

    // fetchOrders();
  }, [onAmountChange]);

  return (
   <div className="flex flex-col items-center justify-center w-full bg-white py-12 px-5">
  {/* Title */}
  <div className="w-full px-1 text-left">
    <div className="text-black font-bold text-2xl sm:text-3xl mb-2">
      My wallet
    </div>
  </div>

  {/* Separator line */}
  <Separator className="w-32 my-4" />

  {/* Balance section */}
  <div className="flex flex-col items-center">
    <h5 className="text-gray-600 text-2xl mb-2">
      Current balance
    </h5>
    <div className="flex items-center gap-1 text-3xl font-semibold text-black mb-6">
      ₦{amount.toLocaleString()}
    </div>

    <button className="px-10 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
      Top up wallet
    </button>
  </div>
</div>

  )
}

export default Wallet