"use client";
import { useState, useEffect } from "react";
import EstimateForm from "@/components/delivary/EstimateForm";
import SenderInfoForm from "@/components/delivary/SenderInfo";
import ReceiverInfoForm from "@/components/delivary/ReceiverInfoForm";
import MapView from "@/components/delivary/MapView";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"
import { DeliveryFormData } from "@/types/deliverytypeform";

export default function DeliveryPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
    // ✅ ADD THIS STATE
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [formData, setFormData] = useState<DeliveryFormData>({
    deliveryType: "",
    pickup: "",
    destination: "",
    sender: { fullname: "", phoneNumber: "", email: "", password: "" },
    receiver: { fullname: "", phoneNumber: "", packageValue: "", packageDescription: "" },
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const deliveryTypeParam = searchParams.get("deliveryType");
    const pickupParam = searchParams.get("pickup");
    const destinationParam = searchParams.get("destination");
    setFormData((prev) => ({
      ...prev,
      deliveryType: deliveryTypeParam || prev.deliveryType,
      pickup: pickupParam || prev.pickup,
      destination: destinationParam || prev.destination,
    }));
    
    setIsLoading(false);
  }, [searchParams]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleFinalSubmit = async () => {
    toast.success("Delivery completed!");
  };
   const handleRouteCalculated = (info: { distance: string; duration: string } | null) => {
    setRouteInfo(info);
    console.log('🎯 Route info received in page:', info);
  };
  if (isLoading) return <div>Loading...</div>;
  console.log(formData, "formdata")
  return (
<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
  {/* Map first on small, right on large */}
  <div className="relative order-1 lg:order-2 h-[300px] lg:h-auto">
    <MapView pickup={formData.pickup} destination={formData.destination} onRouteCalculated={handleRouteCalculated}/>
  </div>

  {/* Form below on small, left on large */}
  <div className="flex items-center justify-center bg-gray-50 p-8 order-2 lg:order-1">
    {step === 1 && (
      <EstimateForm data={formData} setData={setFormData} nextStep={nextStep}  routeInfo={routeInfo}/>
    )}
    {step === 2 && (
      <SenderInfoForm
        data={formData}
        setData={setFormData}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    )}
    {step === 3 && (
      <ReceiverInfoForm
        data={formData}
        setData={setFormData}
        prevStep={prevStep}
        onSubmit={handleFinalSubmit}
      />
    )}
  </div>
</div>

  );
}
