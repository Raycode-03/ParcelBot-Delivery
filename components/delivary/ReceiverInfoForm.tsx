"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { DeliveryFormData } from "@/types/deliverytypeform";
interface ReceiverInfoProps {
  data: DeliveryFormData;
  setData: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  prevStep: () => void;
  onSubmit: () => Promise<void>;
}

function ReceiverInfoForm({ data, setData, prevStep, onSubmit }: ReceiverInfoProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullname, phoneNumber, packageValue, packageDescription } = data.receiver;
    
    if (!fullname || !phoneNumber || !packageValue || !packageDescription) {
      toast.error("Please fill all receiver fields");
      return;
    }
    
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter receiver's name"
            value={data.receiver.fullname}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, fullname: e.target.value },
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+234"
            value={data.receiver.phoneNumber}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, phoneNumber: e.target.value },
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
          />
        </div>

        {/* Package Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Value
          </label>
          <input
            type="text"
            placeholder="NGN"
            value={data.receiver.packageValue}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, packageValue: e.target.value },
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
          />
        </div>

        {/* Package Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Description
          </label>
          <Textarea
            placeholder="Additional delivery information"
            value={data.receiver.packageDescription}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                receiver: { ...prev.receiver, packageDescription: e.target.value },
              }))
            }
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">
              Max 300 characters
            </span>
            <span className="text-xs text-gray-500 ml-2">Optional</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiverInfoForm;