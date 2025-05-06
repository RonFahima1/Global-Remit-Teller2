import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface ConfettiSuccessProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  amount?: string;
  currency?: string;
  receiverName?: string;
  onSendAnother?: () => void;
}

export const ConfettiSuccess = ({
  message,
  description,
  actionLabel,
  onActionClick,
  amount,
  currency,
  receiverName,
  onSendAnother
}: ConfettiSuccessProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
      
      // Fire confetti with more modest settings
      const duration = 1500; // Reduced duration
      const end = Date.now() + duration;
      
      const leftConfetti = () => {
        confetti({
          particleCount: 25, // Reduced particle count
          angle: 60,
          spread: 50, // Reduced spread
          origin: { x: 0.2, y: 0.5 }, // Moved origin more toward center
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8, // Increased gravity for faster fall
          scalar: 0.8 // Smaller confetti pieces
        });
      };
      
      const rightConfetti = () => {
        confetti({
          particleCount: 25, // Reduced particle count
          angle: 120,
          spread: 50, // Reduced spread
          origin: { x: 0.8, y: 0.5 }, // Moved origin more toward center
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8, // Increased gravity for faster fall
          scalar: 0.8 // Smaller confetti pieces
        });
      };
      
      // Fire once immediately
      leftConfetti();
      rightConfetti();
      
      // Then fire at intervals until duration is reached
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        
        leftConfetti();
        rightConfetti();
      }, 300);
      
      return () => {
        clearInterval(interval);
      };
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </motion.div>
            
            <motion.h2
              className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {message || 'Success!'}
            </motion.h2>
            
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {description || (amount && receiverName ? 
                `You've sent ${currency}${amount} to ${receiverName} successfully.` : 
                'Your transaction has been completed successfully.')}
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {actionLabel && onActionClick && (
                <Button 
                  onClick={onActionClick}
                  className="bg-[#007AFF] hover:bg-blue-600 text-white rounded-full"
                >
                  {actionLabel}
                </Button>
              )}
              
              {onSendAnother && (
                <Button 
                  onClick={onSendAnother}
                  variant="outline"
                  className="rounded-full border-gray-300 dark:border-gray-700"
                >
                  Send Another
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
