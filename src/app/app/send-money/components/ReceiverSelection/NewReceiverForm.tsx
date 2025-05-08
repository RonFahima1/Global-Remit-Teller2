import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSendMoneyForm } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import type { Client } from '@/app/(app)/send-money/hooks/useSendMoneyForm';

// Form Schema
const receiverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(8, 'Phone must be at least 8 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  country: z.string(),
  idType: z.string(),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  bankAccount: z.string().optional(),
});

type ReceiverFormData = z.infer<typeof receiverSchema>;

interface NewReceiverFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function NewReceiverForm({ onClose, onSuccess }: NewReceiverFormProps) {
  const form = useForm<ReceiverFormData>({
    resolver: zodResolver(receiverSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      country: '',
      idType: '',
      idNumber: '',
      bankAccount: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const { setSelectedReceiver } = useSendMoneyForm();
  const analytics = useAnalytics();

  const onSubmit = async (data: ReceiverFormData) => {
    try {
      setIsSubmitting(true);
      await setSelectedReceiver(data);
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: 'NewReceiverForm',
        data: { type: 'receiver' }
      });
      setFormSuccess(true);
      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: 'NewReceiverForm',
        data: { type: 'receiver', error: err instanceof Error ? err.message : 'Unknown error' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting: isFormSubmitting }, watch, setValue, reset } = form;

  const handleFormSubmit = handleSubmit(onSubmit);

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'id', label: 'ID Card' },
    { value: 'drivers_license', label: 'Driver's License' }
  ];

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {formSuccess ? (
        <div className="text-center py-4">
          <h3 className="text-green-600 font-semibold">Receiver added successfully!</h3>
          <p className="text-gray-600">You can continue with the transfer process.</p>
          <Button onClick={onClose} className="mt-4 bg-green-600 hover:bg-green-700">
            Continue
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create New Receiver</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    {...register('country')}
                    error={errors.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country.message}</p>
                  )}
                </div>
              </div>

              {/* ID Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="idType">ID Type</Label>
                  <Select
                    {...register('idType')}
                    error={errors.idType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.map((idType) => (
                        <SelectItem key={idType.value} value={idType.value}>
                          {idType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.idType && (
                    <p className="text-sm text-red-500">{errors.idType.message}</p>
                  )}
                </div>
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

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  type="button"
                  aria-label="Reset and close form"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
                  aria-label="Close form"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-label="Create new receiver"
                >
                  {isSubmitting ? 'Creating...' : 'Create Receiver'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
