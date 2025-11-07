"use client";
import { useState, useEffect } from "react";
import EstimateForm from "@/components/delivary/EstimateForm";
import SenderInfoForm from "@/components/delivary/SenderInfo";
import ReceiverInfoForm from "@/components/delivary/ReceiverInfoForm";
import MapView from "@/components/delivary/MapView";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
type FormData = {
  deliveryType: string;
  pickup: string;
  destination: string;
  senderName: string;
  receiverName: string;
};
export default function DeliveryPage() {
  const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
  deliveryType: "",
  pickup: "",
  destination: "",
  senderName: "",
  receiverName: "",
});

  const searchParams = useSearchParams();

  useEffect(() => {
    const deliveryTypeParam = searchParams.get("deliveryType");
    const pickupParam = searchParams.get("pickup");
    const destinationParam = searchParams.get("destination");
    // Check if we have minimal required data 
    // ✅ When user comes from route like /delivery/estimate?deliveryType=Food&pickup=Yenagoa&destination=Okaka
    const hasRequiredParams = deliveryTypeParam && pickupParam && destinationParam;
    setFormData((prev) => ({
      
      ...prev,
      deliveryType: deliveryTypeParam || prev.deliveryType,
      pickup: pickupParam || prev.pickup,
      destination: destinationParam || prev.destination,
    }));

    // Optional: Show toast if coming without parameters
    if (!hasRequiredParams) {
      toast.info("Please fill in the delivery details");
    }

    setIsLoading(false);
  }, [searchParams]);

  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

    if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  } 
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left - Dynamic Form Section */}
      <div className="flex items-center justify-center bg-gray-50 p-8">
        {step === 1 && (
          <EstimateForm
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
          />
        )}
        {/* {step === 2 && (
          <SenderInfoForm
            data={formData}
            setData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )} */}
        {/* {step === 3 && (
          <ReceiverInfoForm
            data={formData}
            setData={setFormData}
            prevStep={prevStep}
          />
        )} */}
      </div>

      {/* Right: Map */}
      <div className="relative hidden lg:block">
        {/* <MapView pickup={formData.pickup} destination={formData.destination} /> */}
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.593!2d6.3383!3d4.951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1042950!2sYenagoa!5e0!3m2!1sen!2sng!4v000000000"
          allowFullScreen
        />
      </div>
    </div>
  );
}
