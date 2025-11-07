"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
type FormData = {
  deliveryType: string;
  pickup: string;
  destination: string;
  senderName: string;
  receiverName: string;
};
interface Props {
  data:FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
}

export default function EstimateForm({ data, setData , nextStep }: Props) {
  const [deliverySpeed, setDeliverySpeed] = useState("premium");
  const [loading, setLoading] = useState(false);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md"
    >
      <div className="flex items-center space-x-3">
          <Image
            src="/Parcellogo.png"
            alt="Parcel Logo"
            width={160}
            height={160}
            className="object-contain w-28 sm:w-36 md:w-40"
          />
        </div>
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-8">
        
        <div className="flex items-center space-x-2 text-green-600 font-medium">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm">
            1
          </span>
          <span>Estimate price</span>
        </div>
        <div className="w-10 border-t border-gray-300 mx-2" />
        <span className="text-gray-400">Sender&apos;s Information</span>
        <div className="w-10 border-t border-gray-300 mx-2" />
        <span className="text-gray-400">Receiver&apos;s Information</span>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Good Type
          </label>
          <input
            type="text"
            value={data.deliveryType}
            onChange={(e) =>
              setData((prev) => ({ ...prev, deliveryType: e.target.value }))
            }
            placeholder="e.g. Food, Documents"
            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="text"
            value={data.pickup}
            onChange={(e) =>
              setData((prev) => ({ ...prev, pickup: e.target.value }))
            }
            placeholder="Pickup location"
            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="text"
            value={data.destination}
            onChange={(e) =>
              setData((prev) => ({ ...prev, destination: e.target.value }))
            }
            placeholder="Destination"
            className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Delivery type */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            For bulk delivery
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:border-green-400">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="delivery"
                  value="premium"
                  checked={deliverySpeed === "premium"}
                  onChange={() => setDeliverySpeed("premium")}
                />
                <div>
                  <p className="font-medium text-gray-800">Premium delivery</p>
                  <p className="text-sm text-gray-500">2-4 hrs</p>
                </div>
              </div>
              <span className="text-gray-900 font-semibold">₦3,000.00</span>
            </label>

            <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:border-green-400">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="delivery"
                  value="economy"
                  checked={deliverySpeed === "economy"}
                  onChange={() => setDeliverySpeed("economy")}
                />
                <div>
                  <p className="font-medium text-gray-800">Economy delivery</p>
                  <p className="text-sm text-gray-500">Next day</p>
                </div>
              </div>
              <span className="text-gray-900 font-semibold">₦2,000.00</span>
            </label>
          </div>
        </div>

        {/* Total + Button */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-gray-700 mb-4">
            <span>Order Estimate:</span>
            <span className="font-bold text-lg text-gray-900">
              {deliverySpeed === "premium" ? "₦3,000.00" : "₦2,000.00"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg"
          >
            {loading ? "Loading..." : "Request now"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
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
