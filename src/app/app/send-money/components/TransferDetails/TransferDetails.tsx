import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSendMoneyForm } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import { useAnalytics } from '@/hooks/useAnalytics';
import { FormContainer } from '@/components/ui/FormContainer';

interface TransferDetailsProps {
  onClose: () => void;
}

export function TransferDetails({ onClose }: TransferDetailsProps) {
  const [formSuccess, setFormSuccess] = useState(false);
  const { formData, setFormData } = useSendMoneyForm();
  const analytics = useAnalytics();

  const sourceOfFunds = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'mobile_money', label: 'Mobile Money' }
  ];

  const purposeOfTransfer = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical' },
    { value: 'other', label: 'Other' }
  ];

  const operator = [
    { value: 'ron_fahima', label: 'Ron Fahima' },
    { value: 'john_doe', label: 'John Doe' },
    { value: 'jane_smith', label: 'Jane Smith' }
  ];

  const transferType = [
    { value: 'instant', label: 'Instant' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'bulk', label: 'Bulk' }
  ];

  const handleSubmit = async () => {
    try {
      // TODO: Add actual validation logic
      if (!formData.sourceOfFunds || !formData.purposeOfTransfer) {
        throw new Error('Please fill in all required fields');
      }

      // Update form data with current values
      setFormData({
        ...formData,
        sourceOfFunds: formData.sourceOfFunds,
        purposeOfTransfer: formData.purposeOfTransfer,
        transferType: formData.transferType,
        currency: formData.currency
      });
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: 'TransferDetails',
        data: { details: formData }
      });
      setFormSuccess(true);
      onClose();
    } catch (err) {
      console.error('Error submitting transfer details:', err);
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: 'TransferDetails',
        data: { error: err instanceof Error ? err.message : 'Unknown error' }
      });
    }
  };

  return (
    <FormContainer
      title="Transfer Details"
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel="Continue"
      className="w-full max-w-2xl"
    >
      {/* Source of Funds */}
      <div>
        <Label>Source of Funds</Label>
        <Select
          value={formData.sourceOfFunds}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, sourceOfFunds: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source of funds" />
          </SelectTrigger>
          <SelectContent>
            {sourceOfFunds.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Purpose of Transfer */}
      <div>
        <Label>Purpose of Transfer</Label>
        <Select
          value={formData.purposeOfTransfer}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, purposeOfTransfer: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select purpose of transfer" />
          </SelectTrigger>
          <SelectContent>
            {purposeOfTransfer.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Operator */}
      <div>
        <Label>Operator</Label>
        <Select
          value={formData.operator}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, operator: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operator.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transfer Type */}
      <div>
        <Label>Transfer Type</Label>
        <Select
          value={formData.transferType}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, transferType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            {transferType.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormContainer>
  );
}
