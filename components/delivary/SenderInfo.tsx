"use client";
import React, { useEffect , useRef,  useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Eye , EyeClosed} from 'lucide-react'
import { DeliveryFormData } from "@/types/deliverytypeform";

interface SenderInfoProps {
  data: DeliveryFormData;
  setData: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  nextStep: () => void;
  prevStep: () => void;
}

function SenderInfoForm({ data, setData, nextStep, prevStep }: SenderInfoProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { fullname, phoneNumber, email, password } = data.sender;
    if (!fullname || !phoneNumber || !email || !password) {
      toast.error("Please fill in all sender details");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Sender info saved!");
      setLoading(false);
      nextStep();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-10 w-full max-w-lg">
      {/* Full Name */}
      <label className="block text-sm mb-2">Full Name</label>
      <input
        type="text"
        value={data.sender.fullname}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            sender: { ...prev.sender, fullname: e.target.value },
          }))
        }
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500"
      />

      {/* Phone */}
      <label className="block text-sm mt-4 mb-2">Phone Number</label>
      <input
        type="text"
        value={data.sender.phoneNumber}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            sender: { ...prev.sender, phoneNumber: e.target.value },
          }))
        }
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500"
      />

      {/* Email */}
      <label className="block text-sm mt-4 mb-2">Email</label>
      <input
        type="email"
        value={data.sender.email}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            sender: { ...prev.sender, email: e.target.value },
          }))
        }
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500"
      />

      {/* Password */}
      <label className="block text-sm mt-4 mb-2">Password</label>
      <input
        type="password"
        value={data.sender.password}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            sender: { ...prev.sender, password: e.target.value },
          }))
        }
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-6 py-3.5 px-8 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full"
      >
        {loading ? "Saving..." : "Next"}
      </button>
    </form>
  );
}
export default SenderInfoForm