"use client";
import React, {   useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
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
  const [showPassword , setShowPassword]  = useState(false);
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
      <div className="relative mt-4">
      <label className="block text-sm mb-2">Password</label>

      <input
        type={showPassword ? "text" : "password"}
        value={data.sender.password}
        onChange={(e) =>
          setData((prev: any) => ({
            ...prev,
            sender: { ...prev.sender, password: e.target.value },
          }))
        }
        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-1 focus:ring-green-500"
      />

      {/* Toggle Icon */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-11 text-gray-500 hover:text-green-600"
      >
        {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
      </button>
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
          {loading ? "Saving..." : "Next"}
        </button>
        </div>
      
    </form>
  );
}
export default SenderInfoForm