'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Form Schemas
const addressSchema = z.object({
  street: z.string().min(2, 'Street must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zip: z.string().min(5, 'Zip must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

const idInfoSchema = z.object({
  type: z.string().min(1, 'ID type is required'),
  number: z.string().min(1, 'ID number is required'),
  expiry: z.string().min(1, 'Expiry date is required'),
});

const bankInfoSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  routingNumber: z.string().min(1, 'Routing number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
});

const riskInfoSchema = z.object({
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().min(1, 'Income is required'),
  sourceOfFunds: z.string().min(1, 'Source of funds is required'),
});

export const fullFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: addressSchema,
  idInfo: idInfoSchema,
  bankInfo: bankInfoSchema,
  riskInfo: riskInfoSchema,
});

export type FullFormData = z.infer<typeof fullFormSchema>;

interface ClientFormProps {
  onSubmit: (data: FullFormData) => Promise<void>;
  onClose?: () => void;
  submitLabel?: string;
  fieldSet?: string[];
}

export function ClientForm({ onSubmit, onClose, submitLabel = 'Submit', fieldSet = [] }: ClientFormProps) {
  const form = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      idInfo: {
        type: '',
        number: '',
        expiry: '',
      },
      bankInfo: {
        accountNumber: '',
        routingNumber: '',
        bankName: '',
      },
      riskInfo: {
        occupation: '',
        income: '',
        sourceOfFunds: '',
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const analytics = useAnalytics();

  const handleFormSubmit = async (data: FullFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      analytics.trackEvent({
        category: 'Form',
        action: 'Success',
        label: 'ClientForm',
        data: { type: 'sender' }
      });
      form.reset();
      onClose?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      analytics.trackEvent({
        category: 'Form',
        action: 'Error',
        label: 'ClientForm',
        data: { type: 'sender', error: error.toString() }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Info */}
          {fieldSet.includes('personal') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className={form.formState.errors.email ? 'border-red-500' : ''}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  className={form.formState.errors.phone ? 'border-red-500' : ''}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {fieldSet.includes('address') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address.street">Street</Label>
                <Input
                  id="address.street"
                  {...form.register('address.street')}
                  className={form.formState.errors.address?.street ? 'border-red-500' : ''}
                />
                {form.formState.errors.address?.street && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.street.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  {...form.register('address.city')}
                  className={form.formState.errors.address?.city ? 'border-red-500' : ''}
                />
                {form.formState.errors.address?.city && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address.state">State</Label>
                <Input
                  id="address.state"
                  {...form.register('address.state')}
                  className={form.formState.errors.address?.state ? 'border-red-500' : ''}
                />
                {form.formState.errors.address?.state && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.state.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address.zip">Zip Code</Label>
                <Input
                  id="address.zip"
                  {...form.register('address.zip')}
                  className={form.formState.errors.address?.zip ? 'border-red-500' : ''}
                />
                {form.formState.errors.address?.zip && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.zip.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address.country">Country</Label>
                <Input
                  id="address.country"
                  {...form.register('address.country')}
                  className={form.formState.errors.address?.country ? 'border-red-500' : ''}
                />
                {form.formState.errors.address?.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.country.message}</p>
                )}
              </div>
            </div>
          )}

          {/* ID Info */}
          {fieldSet.includes('id') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="idInfo.type">ID Type</Label>
                <Select {...form.register('idInfo.type')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idInfo.number">ID Number</Label>
                <Input
                  id="idInfo.number"
                  {...form.register('idInfo.number')}
                  className={form.formState.errors.idInfo?.number ? 'border-red-500' : ''}
                />
                {form.formState.errors.idInfo?.number && (
                  <p className="text-sm text-red-500">{form.formState.errors.idInfo.number.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="idInfo.expiry">Expiry Date</Label>
                <Input
                  id="idInfo.expiry"
                  type="date"
                  {...form.register('idInfo.expiry')}
                  className={form.formState.errors.idInfo?.expiry ? 'border-red-500' : ''}
                />
                {form.formState.errors.idInfo?.expiry && (
                  <p className="text-sm text-red-500">{form.formState.errors.idInfo.expiry.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Bank Info */}
          {fieldSet.includes('bank') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankInfo.accountNumber">Account Number</Label>
                <Input
                  id="bankInfo.accountNumber"
                  {...form.register('bankInfo.accountNumber')}
                  className={form.formState.errors.bankInfo?.accountNumber ? 'border-red-500' : ''}
                />
                {form.formState.errors.bankInfo?.accountNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.bankInfo.accountNumber.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="bankInfo.routingNumber">Routing Number</Label>
                <Input
                  id="bankInfo.routingNumber"
                  {...form.register('bankInfo.routingNumber')}
                  className={form.formState.errors.bankInfo?.routingNumber ? 'border-red-500' : ''}
                />
                {form.formState.errors.bankInfo?.routingNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.bankInfo.routingNumber.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="bankInfo.bankName">Bank Name</Label>
                <Input
                  id="bankInfo.bankName"
                  {...form.register('bankInfo.bankName')}
                  className={form.formState.errors.bankInfo?.bankName ? 'border-red-500' : ''}
                />
                {form.formState.errors.bankInfo?.bankName && (
                  <p className="text-sm text-red-500">{form.formState.errors.bankInfo.bankName.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Risk Info */}
          {fieldSet.includes('risk') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="riskInfo.occupation">Occupation</Label>
                <Input
                  id="riskInfo.occupation"
                  {...form.register('riskInfo.occupation')}
                  className={form.formState.errors.riskInfo?.occupation ? 'border-red-500' : ''}
                />
                {form.formState.errors.riskInfo?.occupation && (
                  <p className="text-sm text-red-500">{form.formState.errors.riskInfo.occupation.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="riskInfo.income">Monthly Income</Label>
                <Input
                  id="riskInfo.income"
                  {...form.register('riskInfo.income')}
                  className={form.formState.errors.riskInfo?.income ? 'border-red-500' : ''}
                />
                {form.formState.errors.riskInfo?.income && (
                  <p className="text-sm text-red-500">{form.formState.errors.riskInfo.income.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="riskInfo.sourceOfFunds">Source of Funds</Label>
                <Input
                  id="riskInfo.sourceOfFunds"
                  {...form.register('riskInfo.sourceOfFunds')}
                  className={form.formState.errors.riskInfo?.sourceOfFunds ? 'border-red-500' : ''}
                />
                {form.formState.errors.riskInfo?.sourceOfFunds && (
                  <p className="text-sm text-red-500">{form.formState.errors.riskInfo.sourceOfFunds.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
