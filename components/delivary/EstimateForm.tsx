"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Box, TruckIcon, FileText, Utensils } from "lucide-react";
import { DeliveryFormData } from "@/types/deliverytypeform";

interface Props {
  data: DeliveryFormData;
  setData: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  nextStep: () => void;
  routeInfo: { distance: string; duration: string } | null;
}

export default function EstimateForm({ data, setData, nextStep, routeInfo }: Props) {
  const [deliverySpeed, setDeliverySpeed] = useState("premium");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const options = [
    { label: "Bulky Goods", icon: <TruckIcon className="w-5 h-5" /> },
    { label: "Small Parcel", icon: <Box className="w-5 h-5" /> },
    { label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { label: "Food", icon: <Utensils className="w-5 h-5" /> },
  ];

  // Calculate prices based on duration
// Simpler pricing calculation
const calculatePrices = () => {
  if (!routeInfo?.duration) {
    return { premium: 3000, economy: 2000 };
  }

  const durationText = routeInfo.duration.toLowerCase();
  let hours = 0;

  // Extract hours - handle both "h/m" and "hour/min" formats
  if (durationText.includes('h') && durationText.includes('m')) {
    const hoursMatch = durationText.match(/(\d+)\s*h/);
    const minsMatch = durationText.match(/(\d+)\s*m/);
    hours = (hoursMatch ? parseInt(hoursMatch[1]) : 0) + (minsMatch ? parseInt(minsMatch[1]) / 60 : 0);
  } else if (durationText.includes("hour") && durationText.includes("min")) {
    const hoursMatch = durationText.match(/(\d+)\s*hour/);
    const minsMatch = durationText.match(/(\d+)\s*min/);
    hours = (hoursMatch ? parseInt(hoursMatch[1]) : 0) + (minsMatch ? parseInt(minsMatch[1]) / 60 : 0);
  }

  // Simple tier-based pricing
  if (hours <= 4) {
    return { premium: 3000, economy: 2000 };
  } else if (hours <= 24) {
    return { premium: 5000, economy: 3000 };
  } else {
    // For multi-day deliveries
    const days = Math.ceil(hours / 24);
    return { 
      premium: 3000 + (2000 * days), 
      economy: 2000 + (1000 * days) 
    };
  }
};
  const prices = calculatePrices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.deliveryType || !data.pickup || !data.destination) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Estimate calculated successfully!");
      setLoading(false);
      nextStep();
    }, 800);
  };

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `NGN ${amount.toLocaleString()}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-lg"
    >
      {/* Logo */}
      <div className="flex items-center mb-12">
        <Image
          src="/parclelogogreen.png"
          alt="Parcel Logo"
          width={140}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center flex-1">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">
              1
            </span>
            <div className="flex-1 h-[2px] bg-gray-200 mx-3" />
          </div>
          
          <div className="flex items-center flex-1">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-sm font-medium">
              2
            </span>
            <div className="flex-1 h-[2px] bg-gray-200 mx-3" />
          </div>
          
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-sm font-medium">
            3
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-900 flex-1 text-left">
            Estimate price
          </span>
          <span className="text-gray-400 flex-1 text-center">
            Sender&apos;s information
          </span>
          <span className="text-gray-400 flex-1 text-right">
            Receiver&apos;s information
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Good Type */}
        <div className="relative" ref={menuRef}>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Good Type
          </label>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span>{data.deliveryType || "Select delivery type"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {open && (
            <ul className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <li
                  key={opt.label}
                  onClick={() => {
                    setData((prev: any) => ({ ...prev, deliveryType: opt.label }));
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 cursor-pointer"
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* From */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            From:
          </label>
          <input
            type="text"
            value={data.pickup}
            onChange={(e) =>
              setData((prev) => ({ ...prev, pickup: e.target.value }))
            }
            placeholder=""
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            To:
          </label>
          <input
            type="text"
            value={data.destination}
            onChange={(e) =>
              setData((prev) => ({ ...prev, destination: e.target.value }))
            }
            placeholder=""
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>

        {/* Delivery Options */}
        <label className="grid grid-cols-3 items-center border border-gray-200 rounded-lg px-4 py-3.5 cursor-pointer hover:border-green-400 transition-colors">
          {/* Left: Radio + Delivery type */}
          <div className="flex items-center space-x-3 col-span-1">
            <input
              type="radio"
              name="delivery"
              value="premium"
              checked={deliverySpeed === "premium"}
              onChange={() => setDeliverySpeed("premium")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <p className="font-normal text-gray-900 text-sm">Premium</p>
          </div>

          {/* Middle: Duration */}
          <div className="text-center col-span-1">
            {routeInfo ? (
              <div>
                <p className="text-sm text-blue-700">Duration</p>
                <p className="font-light text-xs">{routeInfo.duration}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-light text-xs text-gray-400">Calculating...</p>
              </div>
            )}
          </div>

          {/* Right: Price */}
          <div className="text-right col-span-1">
            <span className="text-gray-900 font-medium text-sm">
              {formatCurrency(prices.premium)}
            </span>
          </div>
        </label>

        <label className="grid grid-cols-3 items-center border border-gray-200 rounded-lg px-4 py-3.5 cursor-pointer hover:border-green-400 transition-colors">
          <div className="flex items-center space-x-3 col-span-1">
            <input
              type="radio"
              name="delivery"
              value="economy"
              checked={deliverySpeed === "economy"}
              onChange={() => setDeliverySpeed("economy")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <p className="font-normal text-gray-900 text-sm">Economy</p>
          </div>

          {/* Middle: Duration */}
          <div className="text-center col-span-1">
            {routeInfo ? (
              <div>
                <p className="text-sm text-blue-700">Duration</p>
                <p className="font-light text-xs">{routeInfo.duration}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-light text-xs text-gray-400">Calculating...</p>
              </div>
            )}
          </div>

          <div className="text-right col-span-1">
            <span className="text-gray-900 font-medium text-sm">
              {formatCurrency(prices.economy)}
            </span>
          </div>
        </label>

        {/* Order Estimate */}
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-gray-700">Order Estimate:</span>
          <span className="font-semibold text-lg text-gray-900">
            {deliverySpeed === "premium" 
              ? formatCurrency(prices.premium) 
              : formatCurrency(prices.economy)
            }
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !routeInfo}
          className="py-3.5 px-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
          >
          {loading ? "Loading..." : !routeInfo ? "Calculating price..." : "Request now"}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By clicking on request you have agreed to the{" "}
          <span className="text-green-600 underline cursor-pointer">
            terms and conditions
          </span>{" "}
          and{" "}
          <span className="text-green-600 underline cursor-pointer">
            privacy policy
          </span>
          .
        </p>
      </div>
    </form>
  );
}