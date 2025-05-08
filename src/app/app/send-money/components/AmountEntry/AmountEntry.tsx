import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSendMoneyForm } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import { useAnalytics } from '@/hooks/useAnalytics';
import { FormContainer } from '@/components/ui/FormContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AmountEntryProps {
  onClose: () => void;
}

type Currency = {
  value: string;
  label: string;
};

export function AmountEntry({ onClose }: AmountEntryProps) {
  const [formSuccess, setFormSuccess] = useState(false);
  const { formData, setFormData } = useSendMoneyForm();
  const analytics = useAnalytics();

  // Initialize currencies
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('USD');

  // Form state
  const [amount, setAmount] = useState(formData.amount || '');
  const [fee, setFee] = useState(formData.fee || '');
  const [total, setTotal] = useState('');
  const [exchangeRate, setExchangeRate] = useState(formData.exchangeRate || '');
  const [recipientAmount, setRecipientAmount] = useState('');

  useEffect(() => {
    // Initialize currencies
    const defaultCurrencies: Currency[] = [
      { value: 'USD', label: 'US Dollar' },
      { value: 'EUR', label: 'Euro' },
      { value: 'GBP', label: 'British Pound' },
      { value: 'CAD', label: 'Canadian Dollar' }
    ];
    setCurrencies(defaultCurrencies);
  }, []);

  useEffect(() => {
    if (amount) {
      // Calculate fee (example: 1% of amount)
      const calculatedFee = (Number(amount) * 0.01).toFixed(2);
      setFee(calculatedFee);

      // Calculate total
      const calculatedTotal = (Number(amount) + Number(calculatedFee)).toFixed(2);
      setTotal(calculatedTotal);

      // Calculate recipient amount (example: 99% of amount)
      const calculatedRecipientAmount = (Number(amount) * 0.99).toFixed(2);
      setRecipientAmount(calculatedRecipientAmount);

      // Update form data
      setFormData({
        ...formData,
        amount,
        fee: calculatedFee,
        total: calculatedTotal,
        recipientAmount: calculatedRecipientAmount,
        sourceCurrency,
        targetCurrency
      });
    }
  }, [amount, sourceCurrency, targetCurrency, formData, setFormData]);

  const handleSubmit = async () => {
    try {
      if (!amount || !sourceCurrency || !targetCurrency) {
        throw new Error('Please fill in all required fields');
      }

      const transferAmount = {
        amount: amount.toString(),
        fee: fee.toString(),
        total: total.toString(),
        recipientAmount: recipientAmount.toString(),
        exchangeRate: exchangeRate.toString(),
        sourceCurrency,
        targetCurrency
      };

      setFormData((prev) => ({ ...prev, ...transferAmount }));
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: 'AmountEntry',
        data: { amount: transferAmount }
      });
      setFormSuccess(true);
      onClose();
    } catch (err) {
      console.error('Error submitting amount:', err);
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: 'AmountEntry',
        data: { error: err instanceof Error ? err.message : 'Unknown error' }
      });
    }
  };

  return (
    <FormContainer
      title="Amount Details"
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel="Continue"
      className="w-full max-w-2xl"
    >
      {/* Amount Input */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Amount</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
                placeholder="Enter amount"
              />
              <Select
                value={sourceCurrency}
                onValueChange={(value) => setSourceCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Target Currency</Label>
            <Select
              value={targetCurrency}
              onValueChange={(value) => setTargetCurrency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calculated Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-500">Fee</Label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">${fee}</span>
              <span className="text-xs text-gray-400">(1% of amount)</span>
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Total</Label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">${total}</span>
              <span className="text-xs text-gray-400">(Amount + Fee)</span>
            </div>
          </div>
        </div>
      </div>
    </FormContainer>
  );
}
