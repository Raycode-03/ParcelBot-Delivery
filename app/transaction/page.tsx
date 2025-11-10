"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface TransactionData {
  reference: string;
  amount: number;
  paidAt: string;
  metadata: {
    orderId: string;
    orderNumber: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    packageDescription: string;
    price: number;
  };
}

export default function TransactionReceipt() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [generating, setGenerating] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      router.push('/delivery');
    }
  }, [reference, router]);

  const verifyPayment = async (ref: any) => {
    try {
      const res = await fetch(`/api/payment/verify?reference=${ref}`);
      const data = await res.json();
      
      if (data.success) {
        setTransaction(data.transaction);
      } else {
        toast.error("Payment verification failed");
        setTimeout(() => router.push('/delivery'), 3000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Error verifying payment");
      setTimeout(() => router.push('/delivery'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsPDF = async () => {
    if (!receiptRef.current) return;
    
    setGenerating(true);
    
    try {
      // Generate canvas from HTML
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`transaction-receipt-${transaction?.reference}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto" ref={receiptRef}>
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/parclelogogreen.png"
            alt="Parcelbot Logo"
            width={120}
            height={35}
            className="object-contain"
          />
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center mb-8 text-gray-800">
            Transaction receipts
          </h2>

          <div className="space-y-5">
            {/* Tracking ID */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-900 text-sm font-semibold">Tracking ID</span>
              <div className="flex-1 ml-4">
                <span className="font-semibold text-sm text-gray-900">
                  {transaction?.reference || 'N/A'}
                </span>
              </div>
            </div>

            {/* Date of order */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Date of order:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.paidAt 
                    ? new Date(transaction.paidAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Sender's name */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Sender&apos;s name:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.senderName || 'N/A'}
                </span>
              </div>
            </div>

            {/* Phone number */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Phone number:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.senderPhone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Receiver's name */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Receiver&apos;s name:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.receiverName || 'N/A'}
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Phone Number:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.receiverPhone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Description:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.packageDescription || 'N/A'}
                </span>
              </div>
            </div>

            {/* Estimate */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Estimate:</span>
              <div className="flex-1 ml-4">
                <span className="text-sm text-gray-500">
                  NGN {transaction?.metadata?.price?.toLocaleString() || transaction?.amount?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Save as PDF Button */}
          <button
            onClick={handleSaveAsPDF}
            disabled={generating}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm shadow-sm"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating PDF...
              </span>
            ) : (
              'Save as PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}