import React, { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSendMoneyForm } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import { FormContainer } from '@/components/ui/FormContainer';
import { ClientForm } from '@/app/(app)/send-money/components/ClientForm';

export type NewSenderFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  idType: string;
  idNumber: string;
  bankAccount: string;
  currency: string;
};

interface NewSenderFormProps {
  onClose: () => void;
}

export function NewSenderForm({ onClose }: NewSenderFormProps) {
  const [formSuccess, setFormError] = useState<string | null>(null);

  const { setSelectedSender } = useSendMoneyForm();
  const analytics = useAnalytics();

  const handleFormSubmit = async (data: NewSenderFormData) => {
    try {
      await setSelectedSender(data);
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: 'NewSenderForm',
        data: { type: 'sender' }
      });
      // Close after success
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError(err instanceof Error ? err.message : 'An error occurred');
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: 'NewSenderForm',
        data: { type: 'sender', error: err instanceof Error ? err.message : 'Unknown error' }
      });
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'id', label: 'ID Card' },
    { value: 'driver', label: 'Driver License' }
  ];

  const countries = [
    { value: 'IL', label: 'Israel' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' }
  ];

  const currencies = [
    { value: 'ILS', label: 'Israeli Shekel' },
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' }
  ];

  return (
    <FormContainer
      title="Add New Sender"
      onSubmit={handleFormSubmit}
      onClose={onClose}
      submitLabel="Add Sender"
      className="w-full max-w-2xl"
    >
      {formError && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {formError}
        </div>
      )}

      <ClientForm
        onSubmit={onSubmit}
        fieldSet={['personal', 'address', 'idInfo', 'bankInfo']}
      />
      <div className="space-y-4">
        <div>
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            {...register('idNumber')}
            className={errors.idNumber ? 'border-red-500' : ''}
          />
          {errors.idNumber && (
            <p className="text-sm text-red-500">{errors.idNumber.message}</p>
          )}
        </div>
      </div>

      {/* Bank Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankAccount">Bank Account</Label>
          <Input
            id="bankAccount"
            {...register('bankAccount')}
            className={errors.bankAccount ? 'border-red-500' : ''}
          />
          {errors.bankAccount && (
            <p className="text-sm text-red-500">{errors.bankAccount.message}</p>
          )}
        </div>
      </div>
    </FormContainer>
  );
}
