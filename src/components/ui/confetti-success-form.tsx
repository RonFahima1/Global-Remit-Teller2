import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from 'react-confetti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfettiSuccessFormProps {
  onClose: () => void;
  message?: string;
}

export function ConfettiSuccessForm({ onClose, message = 'Success!' }: ConfettiSuccessFormProps) {
  return (
    <Card className="w-full max-w-2xl relative">
      <Confetti />
      <CardHeader>
        <CardTitle className="text-green-600">Success!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-green-600 font-semibold">{message}</p>
        </motion.div>
        <Button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
