"use client"
import React, { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner'
import { useUser } from '@/utils/UserProvider';

interface WalletProps {
  onAmountChange?: (amount: number) => void;
}

function Wallet({ onAmountChange }: WalletProps) {
  const { user } = useUser();
  
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/wallet/balance');
      const data = await response.json();

      if (response.ok) {
        const walletBalance = data.balance || 0;
        setBalance(walletBalance);
        
        // Update parent component
        if (onAmountChange) {
          onAmountChange(walletBalance);
        }
      } else {
        toast.error('Failed to load wallet balance');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Error loading wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);

    if (!amount || amount < 100) {
      toast.error('Minimum topup amount is ₦100');
      return;
    }

    if (amount > 1000000) {
      toast.error('Maximum topup amount is ₦1,000,000');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error initiating topup:', error);
      toast.error('Error processing request');
      setProcessing(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full py-12 px-5">
        {/* Title */}
        <div className="w-full px-1 text-left">
          <div className="text-black font-bold text-2xl sm:text-3xl mb-2">
            My wallet
          </div>
        </div>

        {/* Separator line */}
        <Separator className="w-32 my-4" />

        {/* Balance section */}
        <div className="flex flex-col items-center">
          <h5 className="text-gray-600 text-2xl mb-2">
            Current balance
          </h5>
          <div className="flex items-center gap-1 text-3xl font-semibold text-black mb-6">
            ₦{balance.toLocaleString()}
          </div>

          <button
            onClick={() => setShowTopupModal(true)}
            disabled={processing}
            className="px-10 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Top up wallet'}
          </button>
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Top up wallet</h2>

            {/* Quick amount buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick select
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopupAmount(amt.toString())}
                    className={`py-2 px-4 rounded-lg border ${
                      topupAmount === amt.toString()
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                    } transition`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₦</span>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  min="100"
                  max="1000000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: ₦100 • Maximum: ₦1,000,000
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTopupModal(false);
                  setTopupAmount('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTopup}
                disabled={processing || !topupAmount}
                className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Continue to payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Wallet;