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
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/upcomingorder`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch orders");
        } else {
          if (onAmountChange) {
            const count = Array.isArray(data?.result)
              ? data.result.length
              : 0;
            onAmountChange(count);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [onAmountChange]);

  return (
    <div>
      <div className='text-black'>Wallet</div>
      <Separator />
      <div>
        <h5>Current balance</h5>
        ₦{amount.toLocaleString()}
        <button className='text-white bg-black rounded-full'>Top up wallet</button>
      </div>
    </div>
  )
}

export default Wallet