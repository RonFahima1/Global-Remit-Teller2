import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAnalytics } from '@/lib/analytics';
import { Client } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import { ConfettiSuccessForm } from '@/components/ui/ConfettiSuccessForm';

const baseClientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+\d+$/, 'Phone number must start with + and contain only numbers'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  country: z.string().min(2, 'Please select a country'),
  idType: z.string().min(1, 'Please select an ID type'),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  bankAccount: z.string().min(5, 'Bank account must be at least 5 characters'),
  status: z.string(),
  kycVerified: z.boolean(),
  riskRating: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a risk rating' })
  }),
  currency: z.string().optional()
});

type BaseFormData = z.infer<typeof baseClientSchema>;

interface BaseClientFormProps {
  onClose: () => void;
  onSubmit: (data: BaseFormData) => void;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
  title: string;
  submitLabel: string;
}

export const BaseClientForm: React.FC<BaseClientFormProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  error,
  success,
  title,
  submitLabel
}) => {
  const { trackEvent } = useAnalytics();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BaseFormData>({
    resolver: zodResolver(baseClientSchema),
    defaultValues: {
      status: 'pending',
      kycVerified: false,
      riskRating: 'low'
    }
  });

  const handleFormSubmit = (data: BaseFormData) => {
    onSubmit(data);
    trackEvent({
      category: 'Form',
      action: 'Submit',
      label: title,
      data
    });
  };
  });

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

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'id', label: 'National ID' },
    { value: 'drivers', label: "Driver's License" }
  ];

  const handleFormSubmit = (data: BaseFormData) => {
    onSubmit(data);
    trackEvent({
      category: 'Form',
      action: 'Submit',
      label: title,
      data
    });
  };

  return (
    <div className="space-y-4 relative" role="form" aria-label={title}>
      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-800">
          <p>{error}</p>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-green-50">
            <h3 className="text-lg font-medium text-green-800">Success!</h3>
            <p className="mt-2 text-sm text-green-700">
              {title} has been created successfully.
            </p>
          </div>
          <ConfettiSuccessForm onClose={onClose} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Full Name"
                  className={errors.name ? 'border-red-500' : ''}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Phone Number"
                  className={errors.phone ? 'border-red-500' : ''}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Email Address"
                  type="email"
                  className={errors.email ? 'border-red-500' : ''}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Address"
                  className={errors.address ? 'border-red-500' : ''}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                />
                {errors.address && (
                  <p id="address-error" className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <Select
                  {...register('country')}
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                >
                  <SelectTrigger />
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p id="country-error" className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium text-gray-700">
                  Currency
                </label>
                <Select
                  {...register('currency')}
                  aria-invalid={errors.currency ? 'true' : 'false'}
                  aria-describedby={errors.currency ? 'currency-error' : undefined}
                >
                  <SelectTrigger />
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p id="currency-error" className="text-sm text-red-500">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="idType" className="text-sm font-medium text-gray-700">
                  ID Type
                </label>
                <Select
                  {...register('idType')}
                  aria-invalid={errors.idType ? 'true' : 'false'}
                  aria-describedby={errors.idType ? 'idType-error' : undefined}
                >
                  <SelectTrigger />
                  <SelectContent>
                    {idTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idType && (
                  <p id="idType-error" className="text-sm text-red-500">
                    {errors.idType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="idNumber" className="text-sm font-medium text-gray-700">
                  ID Number
                </label>
                <Input
                  id="idNumber"
                  {...register('idNumber')}
                  placeholder="ID Number"
                  className={errors.idNumber ? 'border-red-500' : ''}
                  aria-invalid={errors.idNumber ? 'true' : 'false'}
                  aria-describedby={errors.idNumber ? 'idNumber-error' : undefined}
                />
                {errors.idNumber && (
                  <p id="idNumber-error" className="text-sm text-red-500">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="riskRating" className="text-sm font-medium text-gray-700">
                  Risk Rating
                </label>
                <Select
                  {...register('riskRating')}
                  aria-invalid={errors.riskRating ? 'true' : 'false'}
                  aria-describedby={errors.riskRating ? 'riskRating-error' : undefined}
                >
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.riskRating && (
                  <p id="riskRating-error" className="text-sm text-red-500">
                    {errors.riskRating.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="bankAccount" className="text-sm font-medium text-gray-700">
                  Bank Account
                </label>
                <Input
                  id="bankAccount"
                  {...register('bankAccount')}
                  placeholder="Bank Account"
                  className={errors.bankAccount ? 'border-red-500' : ''}
                  aria-invalid={errors.bankAccount ? 'true' : 'false'}
                  aria-describedby={errors.bankAccount ? 'bankAccount-error' : undefined}
                />
                {errors.bankAccount && (
                  <p id="bankAccount-error" className="text-sm text-red-500">
                    {errors.bankAccount.message}
                  </p>
                )}
              </div>
            </div>

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
                aria-label={submitLabel}
              >
                {isSubmitting ? 'Creating...' : submitLabel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
