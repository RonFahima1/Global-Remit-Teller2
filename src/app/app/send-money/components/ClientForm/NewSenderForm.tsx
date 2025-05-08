import React from 'react';
import { BaseClientForm } from './BaseClientForm';
import { useAnalytics } from '@/lib/analytics';
import { Client } from '@/app/(app)/send-money/hooks/useSendMoneyForm';

interface NewSenderFormProps {
  onClose: () => void;
  onSubmit: (data: Client) => void;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
}

export function NewSenderForm({
  onClose,
  onSubmit,
  isSubmitting,
  error,
  success
}: NewSenderFormProps) {
  const { trackEvent } = useAnalytics();

  const handleFormSubmit = (data: Client) => {
    trackEvent({
      category: 'Form',
      action: 'Submit',
      label: 'New Sender',
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
      title="New Sender"
      submitLabel="Create Sender"
    />
  );
}
