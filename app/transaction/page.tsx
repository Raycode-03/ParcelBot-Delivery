"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { jsPDF } from 'jspdf';
import Link from "next/link";
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
  if (!transaction) return;
  
  setGenerating(true);
  
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Helper function to add text
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont(options.font || 'helvetica', options.style || 'normal');
      pdf.setTextColor(options.color || '#000000');
      pdf.text(text, x, y, options);
    };

    // Add logo text (or you can add image if needed)
    addText('Parcelbot', margin, yPosition, { fontSize: 18, style: 'bold', color: '#16a34a' });
    yPosition += 15;

    // Add title
    addText('Transaction Receipt', pageWidth / 2, yPosition, { 
      fontSize: 16, 
      style: 'bold',
      align: 'center'
    });
    yPosition += 15;

    // Add border box
    const boxY = yPosition;
    pdf.setDrawColor(229, 231, 235); // gray-200
    pdf.setLineWidth(0.5);
    pdf.rect(margin, boxY, contentWidth, 150, 'S');

    yPosition += 10;

    // Helper function to add receipt row
    const addRow = (label: string, value: string, isBold: boolean = false) => {
      addText(label, margin + 5, yPosition, { 
        fontSize: 10,
        style: isBold ? 'bold' : 'normal',
        color: isBold ? '#111827' : '#374151'
      });
      
      const valueLines = pdf.splitTextToSize(value, contentWidth - 90);
      addText(valueLines, pageWidth - margin - 5, yPosition, { 
        fontSize: 10,
        color: isBold ? '#111827' : '#6b7280',
        align: 'right'
      });
      
      yPosition += 8;
    };

    // Add all transaction details
    addRow('Tracking ID', transaction.reference || 'N/A', true);
    yPosition += 2;

    addRow(
      'Date of order:',
      transaction.paidAt 
        ? new Date(transaction.paidAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : 'N/A'
    );

    addRow('Sender\'s name:', transaction.metadata?.senderName || 'N/A');
    addRow('Phone number:', transaction.metadata?.senderPhone || 'N/A');
    addRow('Receiver\'s name:', transaction.metadata?.receiverName || 'N/A');
    addRow('Phone Number:', transaction.metadata?.receiverPhone || 'N/A');
    addRow('Description:', transaction.metadata?.packageDescription || 'N/A');
    addRow(
      'Estimate:',
      `NGN ${transaction.metadata?.price?.toLocaleString() || transaction.amount?.toLocaleString() || '0'}`
    );

    // Add footer
    yPosition = pdf.internal.pageSize.getHeight() - 20;
    addText(
      'Thank you for using Parcelbot',
      pageWidth / 2,
      yPosition,
      { fontSize: 9, color: '#6b7280', align: 'center' }
    );

    // Save the PDF
    pdf.save(`transaction-receipt-${transaction.reference || 'receipt'}.pdf`);
    toast.success('PDF downloaded successfully!');
    
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
          <Link href={'/'}>
          <Image
            src="/parclelogogreen.png"
            alt="Parcelbot Logo"
            width={120}
            height={35}
            className="object-contain"
          />
          </Link>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center mb-8 text-gray-800">
            Transaction receipts
          </h2>

          <div className="space-y-5">
            {/* Tracking ID */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-900 text-ms font-bold">Tracking ID</span>
              <div className="text-right">
                <span className="font-semibold text-sm text-gray-900">
                  {transaction?.reference || 'N/A'}
                </span>
              </div>
            </div>

            {/* Date of order */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Date of order:</span>
              <div className="text-right">
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
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.senderName || 'N/A'}
                </span>
              </div>
            </div>

            {/* Phone number */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Phone number:</span>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.senderPhone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Receiver's name */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Receiver&apos;s name:</span>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.receiverName || 'N/A'}
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Phone Number:</span>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.receiverPhone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Description:</span>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {transaction?.metadata?.packageDescription || 'N/A'}
                </span>
              </div>
            </div>

            {/* Estimate */}
            <div className="flex justify-between items-start py-1">
              <span className="text-gray-700 text-sm font-medium">Estimate:</span>
              <div className="text-right">
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

