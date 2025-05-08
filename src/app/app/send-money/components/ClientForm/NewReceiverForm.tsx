import React from 'react';
import { BaseClientForm } from './BaseClientForm';
import { useAnalytics } from '@/lib/analytics';

interface NewReceiverFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
}

export function NewReceiverForm({
  onClose,
  onSubmit,
  isSubmitting,
  error,
  success
}: NewReceiverFormProps) {
  const { trackEvent } = useAnalytics();

  const handleFormSubmit = (data: any) => {
    trackEvent({
      category: 'Form',
      action: 'Submit',
      label: 'New Receiver',
      data
    });
    onSubmit(data);
  };

  return (
    <BaseClientForm
      onClose={onClose}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      error={error}
      success={success}
      title="New Receiver"
      submitLabel="Create Receiver"
    />
  );
}
