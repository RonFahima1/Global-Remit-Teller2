import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Printer, ArrowRight, Download } from 'lucide-react';


interface ConfettiSuccessProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  amount?: string;
  currency?: string;
  receiverName?: string;
  onSendAnother?: () => void;
  senderName?: string;
  transferDate?: string;
  referenceId?: string;
  fee?: string;
  totalAmount?: string;
}

export const ConfettiSuccess = ({
  message,
  description,
  actionLabel,
  onActionClick,
  amount,
  currency,
  receiverName,
  onSendAnother,
  senderName = 'Sender',
  transferDate = new Date().toLocaleDateString(),
  referenceId = Math.random().toString(36).substring(2, 10).toUpperCase(),
  fee = '5.00',
  totalAmount
}: ConfettiSuccessProps) => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const calculatedTotal = totalAmount || (amount ? (parseFloat(amount) + parseFloat(fee)).toFixed(2) : '0.00');

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
      
      const duration = 1500;
      const end = Date.now() + duration;

      const leftConfetti = () => {
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 50,
          origin: { x: 0.2, y: 0.5 },
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8,
          scalar: 0.8
        });
      };

      const rightConfetti = () => {
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 50,
          origin: { x: 0.8, y: 0.5 },
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8,
          scalar: 0.8
        });
      };

      leftConfetti();
      rightConfetti();

      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        leftConfetti();
        rightConfetti();
      }, 250);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm print:bg-white print:backdrop-blur-none p-8 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-[80%] sm:max-w-[500px] mx-4 sm:mx-auto mt-24 mb-24 shadow-lg rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[calc(100vh-15rem)] print:overflow-visible print:max-h-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="p-4 sm:p-6">
              <motion.div
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 sm:mb-6 mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </motion.div>
              <motion.h2
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {message}
              </motion.h2>
              <motion.p
                className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {description}
              </motion.p>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200 dark:border-gray-700 print:border-none print:p-0 print:bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {amount && currency && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Receipt</h3>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">Completed</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{senderName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">To</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{receiverName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{amount}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Fee</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{fee}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{calculatedTotal}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{transferDate}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Reference ID</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{referenceId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="mt-6 sm:mt-8 flex flex-col gap-4">
                {actionLabel && onActionClick && (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => router.push('/')}
                  >
                    Dashboard
                  </Button>
                )}
                {onSendAnother && (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={onSendAnother}
                  >
                    Send Another
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
