import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface FormErrorProps {
  error?: string;
  onRetry?: () => void;
  onClose: () => void;
}

export function FormError({
  error = 'An error occurred',
  onRetry,
  onClose,
}: FormErrorProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-red-600">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <div className="mt-4 flex justify-center gap-2">
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-600"
              >
                Retry
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Close
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
