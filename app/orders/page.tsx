"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import CompletedDelivery from "@/components/order/completeddelivery";
import UpcomingDelivery from "@/components/order/upcomingdelivery";
import Wallet from "@/components/order/wallet";
import PendingDelivery from "@/components/order/pendingdelivery";

export default function OrdersPage() {
  const [pendingAmount, setPendingAmount] = useState(0);
  const [upcomingAmount, setUpcomingAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");

  const renderComponent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingDelivery />;
      case "upcoming":
        return <UpcomingDelivery />;
      case "completed":
        return <CompletedDelivery />;
      case "wallet":
        return <Wallet />;
      default:
        return <PendingDelivery />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 border-b">
        <Image
          src="/parclelogogreen.png"
          alt="Parcelbot Logo"
          width={140}
          height={40}
          className="object-contain"
        />
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/setting" className="hover:text-green-600">
            Setting
          </Link>
          <Link href="/help" className="hover:text-green-600">
            Help
          </Link>
        </div>
      </nav>

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
            <div className="text-2xl font-bold">{walletAmount}</div>
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
