import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Printer, Check } from 'lucide-react';

interface ConfettiSuccessProps {
  message: string;
  description: string;
  amount: string;
  fee: string;
  actionLabel: string;
  onActionClick: () => void;
  currency: string;
  senderName?: string;
  receiverName?: string;
  transferDate?: string;
  referenceId?: string;
  onSendAnother?: () => void;
}

export function ConfettiSuccess({
  message,
  description,
  amount,
  fee,
  actionLabel,
  onActionClick,
  currency,
  senderName,
  receiverName,
  transferDate,
  referenceId,
  onSendAnother,
}: ConfettiSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const calculatedTotal = (parseFloat(amount) + parseFloat(fee)).toFixed(2);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  useEffect(() => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowConfetti(true);
      const duration = 1000;
      const end = Date.now() + duration;
      const particleCount = 10;

      const confettiEffect = (angle: number) => {
        confetti({
          particleCount,
          angle,
          spread: 50,
          origin: { x: angle === 60 ? 0.2 : 0.8, y: 0.5 },
          colors: ['#007AFF', '#34C759', '#5AC8FA', '#FF0000'],
          gravity: 0.7,
          scalar: 1.0,
          startVelocity: 25
        });
      };

      confettiEffect(60);
      confettiEffect(120);

      const interval = setInterval(() => {
        if (Date.now() > end) clearInterval(interval);
        confettiEffect(60);
        confettiEffect(120);
      }, 200);

      return () => clearInterval(interval);
    }, 300);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-lg transition-all duration-300 ease-in-out">
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md mx-4 h-[600px] overflow-y-auto print:shadow-none print:max-w-md print:mx-0 print:h-auto border border-gray-100 dark:border-gray-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            <div className="p-6">
              {showConfetti && (
                <motion.div
                  className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 print:mb-2"
                  animate={{ scale: [0, 1] }}
                  transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                >
                  <Check className="h-10 w-10 text-green-600" />
                </motion.div>
              )}
              <motion.h2
                className="text-xl font-bold text-gray-900 dark:text-white mb-4 print:mb-2"
                animate={{ opacity: [0, 1], y: [20, 0] }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              >
                {message}
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 print:mb-2"
                animate={{ opacity: [0, 1], y: [20, 0] }}
                transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
              >
                {description}
              </motion.p>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-100 dark:border-gray-700 print:border-none print:p-0 print:bg-white shadow-lg"
                animate={{ opacity: [0, 1], y: [20, 0] }}
                transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Receipt</h3>
                  <div className="flex items-center space-x-2">
                    <Printer className="h-4 w-4 text-gray-500" />
                    <button
                      onClick={handlePrint}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Print
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {senderName && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Sender</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{senderName}</span>
                    </div>
                  )}
                  {receiverName && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Receiver</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{receiverName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Amount</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{currency}{amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Fee</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{currency}{fee}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Total</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{currency}{calculatedTotal}</span>
                  </div>
                  {transferDate && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{transferDate}</span>
                    </div>
                  )}
                  {referenceId && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-300 print:text-gray-600">Reference ID</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white print:text-black">{referenceId}</span>
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.div
                className="mt-4"
                animate={{ opacity: [0, 1], y: [20, 0] }}
                transition={{ delay: 1.3, duration: 0.5, ease: "easeOut" }}
              >
                {actionLabel && onActionClick && (
                  <Button
                    onClick={onActionClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium py-3 print:bg-green-500 print:hover:bg-green-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {actionLabel}
                  </Button>
                )}
                {onSendAnother && (
                  <Button
                    onClick={onSendAnother}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium py-3 print:bg-blue-500 print:hover:bg-blue-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Another
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
