import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { Phone, User, CreditCard, QrCode } from 'lucide-react';
import { Document, Building2 } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select } from './select';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

interface IdentificationType {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  pattern?: string;
  maxLength?: number;
  helpText: string;
}

const identificationTypes: IdentificationType[] = [
  {
    value: 'phone',
    label: 'Phone Number',
    icon: Phone,
    placeholder: 'Enter phone number',
    pattern: '^\\+?[0-9]{10,15}$',
    helpText: 'Format: +1234567890 or 1234567890',
  },
  {
    value: 'name',
    label: 'Full Name',
    icon: User,
    placeholder: 'Enter full name',
    helpText: 'Enter first and last name',
  },
  {
    value: 'id',
    label: 'ID Type',
    icon: Document,
    placeholder: 'Enter ID number',
    pattern: '^[A-Za-z0-9-]+$',
    helpText: 'Driver License, National ID, or Passport',
  },
  {
    value: 'bank',
    label: 'Bank Account',
    icon: Building2,
    placeholder: 'Enter 9-digit account number',
    pattern: '^[0-9]{9}$',
    maxLength: 9,
    helpText: '9-digit account number only',
  },
  {
    value: 'qr',
    label: 'QR Code',
    icon: QrCode,
    placeholder: 'Scan or enter QR code',
    helpText: 'Scan QR code or enter manually',
  },
  {
    value: 'card',
    label: 'Customer Card',
    icon: CreditCard,
    placeholder: 'Enter card number',
    helpText: 'Customer card number',
  },
];

const idTypes = [
  { value: 'driver', label: 'Driver License' },
  { value: 'national', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
];

interface IdentificationSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function IdentificationSelector({ 
  value, 
  onChange, 
  className 
}: IdentificationSelectorProps) {
  const [selectedType, setSelectedType] = useState<IdentificationType>(
    identificationTypes[0]
  );
  const [idType, setIdType] = useState(idTypes[0].value);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = (message: string) => {
    console.log(message);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = identificationTypes.findIndex(
        t => t.value === selectedType.value
      );
      const nextIndex = (currentIndex + 1) % identificationTypes.length;
      setSelectedType(identificationTypes[nextIndex]);
      onChange?.('');
      toast(`Searching by ${identificationTypes[nextIndex].label} - ${identificationTypes[nextIndex].helpText}`);
    }
  };

  // Handle mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (inputRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        const currentIndex = identificationTypes.findIndex(
          t => t.value === selectedType.value
        );
        const nextIndex = (currentIndex + (e.deltaY > 0 ? 1 : -1)) % identificationTypes.length;
        const newIndex = nextIndex >= 0 ? nextIndex : identificationTypes.length - 1;
        setSelectedType(identificationTypes[newIndex]);
        onChange?.('');
        toast({
          title: `Searching by ${identificationTypes[newIndex].label}`,
          description: identificationTypes[newIndex].helpText,
        });
      }
    };

    document.addEventListener('wheel', handleWheel);
    return () => document.removeEventListener('wheel', handleWheel);
  }, [selectedType.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleTypeChange = (type: IdentificationType) => {
    setSelectedType(type);
    onChange?.(''); // Clear input when type changes
  };

  const handleIdTypeChange = (type: string) => {
    setIdType(type);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const currentIndex = identificationTypes.findIndex(
                    t => t.value === selectedType.value
                  );
                  const nextIndex = (currentIndex + 1) % identificationTypes.length;
                  setSelectedType(identificationTypes[nextIndex]);
                  onChange?.('');
                }}
              >
                <selectedType.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Searching by {selectedType.label}</p>
              <p className="text-xs text-muted-foreground">{selectedType.helpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Label className="sr-only">Search by {selectedType.label}</Label>
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedType.placeholder}
          pattern={selectedType.pattern}
          maxLength={selectedType.maxLength}
          ref={inputRef}
          className="pl-12"
        />
        {selectedType.value === 'qr' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Scan QR
          </button>
        )}
      </div>
      {selectedType.value === 'id' && (
        <div className="mt-2">
          <Label>Document Type</Label>
          <Select
            value={idType}
            onValueChange={handleIdTypeChange}
          >
            {idTypes.map((type) => (
              <SelectPrimitive.Item
                key={type.value}
                value={type.value}
              >
                {type.label}
              </SelectPrimitive.Item>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
