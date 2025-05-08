import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { ConfettiSuccessForm } from './confetti-success-form';

interface SuccessMessageProps {
  onClose: () => void;
  message?: string;
  showConfetti?: boolean;
}

export function SuccessMessage({
  onClose,
  message = 'Success!',
  showConfetti = true,
}: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-green-600">Success!</CardTitle>
      </CardHeader>
      <CardContent>
        {showConfetti ? (
          <ConfettiSuccessForm onClose={onClose} message={message} />
        ) : (
          <div className="text-center py-4">
            <p className="text-green-600 font-semibold">{message}</p>
            <Button
              onClick={onClose}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
