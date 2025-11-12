"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Navbarorders from '@/components/order/navbarorders'
import CompletedDelivery from "@/components/order/completeddelivery";
import UpcomingDelivery from "@/components/order/upcomingdelivery";
import Wallet from "@/components/order/wallet";
import PendingDelivery from "@/components/order/pendingdelivery";
import { useUser } from '@/utils/UserProvider';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  
  const [pendingAmount, setPendingAmount] = useState(0);
  const [upcomingAmount, setUpcomingAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/?modal=login');
      return;
    }

    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam === 'wallet') {
      setActiveTab('wallet');
    }

    // Check for payment verification (Paystack callback)
    const trxref = searchParams.get('trxref');
    const reference = searchParams.get('reference');
    
    if (reference || trxref) {
      const paymentRef = reference || trxref;
      if (paymentRef) {
        setActiveTab('wallet');
        verifyPayment(paymentRef);
      }
    }
  }, [user, searchParams, router]);

  const verifyPayment = async (reference: string) => {
    setVerifyingPayment(true);
    try {
      const response = await fetch(`/api/wallet/verify?reference=${reference}`);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Wallet topped up successfully!');
        setWalletAmount(data.transaction.newBalance);
        // Clean up URL
        router.replace('/orders?tab=wallet');
      } else {
        toast.error(data.error || 'Payment verification failed');
        router.replace('/orders?tab=wallet');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment');
      router.replace('/orders?tab=wallet');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (!user) {
    return null;
  }

  const renderComponent = () => {
    if (verifyingPayment) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "pending":
        return <PendingDelivery onOrdersCountChange={setPendingAmount} />;
      case "upcoming":
        return <UpcomingDelivery onOrdersCountChange={setUpcomingAmount} />;
      case "completed":
        return <CompletedDelivery onOrdersCountChange={setCompletedAmount} />;
      case "wallet":
        return <Wallet onAmountChange={setWalletAmount} />;
      default:
        return <PendingDelivery onOrdersCountChange={setPendingAmount} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbarorders />

      {/* MAIN LAYOUT */}
      <main className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 p-8">
        {/* LEFT SECTION - Summary Cards */}
        <section className="grid grid-cols-2 gap-4 h-fit">
          <button
            onClick={() => setActiveTab("pending")}
            className={`p-6 rounded-lg border text-left transition-all ${
              activeTab === "pending"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
          >
            <p className="font-medium mb-2">Pending request</p>
            <div className="text-2xl font-bold">{pendingAmount}</div>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`p-6 rounded-lg border text-left transition-all ${
              activeTab === "upcoming"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
          >
            <p className="font-medium mb-2">Upcoming deliveries</p>
            <div className="text-2xl font-bold">{upcomingAmount}</div>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`p-6 rounded-lg border text-left transition-all ${
              activeTab === "completed"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
          >
            <p className="font-medium mb-2">Completed deliveries</p>
            <div className="text-2xl font-bold">{completedAmount}</div>
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`p-6 rounded-lg border text-left transition-all ${
              activeTab === "wallet"
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
          >
            <p className="font-medium mb-2">Wallet</p>
            <div className={`text-2xl font-bold ${activeTab === "wallet" ? "text-white" : "text-gray-800"}`}>
              ₦{walletAmount.toLocaleString()}
            </div>
          </button>
        </section>

        {/* RIGHT SECTION - Active Component */}
        <section className="bg-white rounded-lg border shadow-sm p-6">
          {renderComponent()}
        </section>
      </main>
    </div>
  );
}