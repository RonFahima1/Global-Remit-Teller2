import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ButtonGroup } from './ButtonGroup';
import { SuccessMessage } from './SuccessMessage';
import { FormError } from './FormError';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onClose: () => void;
  onReset?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  showConfetti?: boolean;
}

export function FormContainer({
  title,
  children,
  onSubmit,
  onClose,
  onReset,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  className = '',
  successMessage,
  errorMessage,
  onRetry,
  showConfetti = true,
}: FormContainerProps) {
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);
  const analytics = useAnalytics();

  const handleSubmit = async () => {
    try {
      await onSubmit();
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: title,
      });
      setFormSuccess(true);
      setFormError(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError(true);
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: title,
        data: { error: err instanceof Error ? err.message : 'Unknown error' },
      });
    }
  };

  if (formSuccess && successMessage) {
    return (
      <SuccessMessage
        onClose={onClose}
        message={successMessage}
        showConfetti={showConfetti}
      />
    );
  }

  if (formError && errorMessage) {
    return (
      <FormError
        error={errorMessage}
        onRetry={onRetry}
        onClose={onClose}
      />
    );
  }

  return (
    <Card className={`${className} w-full max-w-2xl`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          <ButtonGroup
            onSubmit={handleSubmit}
            onCancel={onClose}
            onReset={onReset}
            loading={loading}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            resetLabel={resetLabel}
          />
        </form>
      </CardContent>
    </Card>
  );
}
