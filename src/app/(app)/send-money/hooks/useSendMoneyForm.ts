import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { User, Users, FileText, DollarSign, CheckCircle } from 'lucide-react';

// Types
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  idType: string;
  idNumber: string;
  bankAccount: string;
  status: string;
  kycVerified: boolean;
  riskRating: string;
  currency?: string;
}

export interface FormData {
  sourceOfFunds: string;
  purposeOfTransfer: string;
  transferType: string;
  amount: string;
  currency: string;
  fee: string;
  total: string;
  exchangeRate: string;
  recipientAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  termsAccepted: boolean;
  operator: string;
}

import { LucideIcon } from 'lucide-react';

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  completed?: boolean;
  showCheck?: boolean;
}

export const useSendMoneyForm = () => {
  const router = useRouter();
  
  // Steps configuration
  const steps: Step[] = [
    { 
      title: "Sender", 
      description: "Select who is sending the money",
      icon: User,
      color: 'bg-blue-500'
    },
    { 
      title: "Receiver", 
      description: "Select who will receive the money",
      icon: Users,
      color: 'bg-green-500'
    },
    { 
      title: "Details", 
      description: "Specify transfer details",
      icon: FileText,
      color: 'bg-purple-500'
    },
    { 
      title: "Amount", 
      description: "Enter amount and review fees",
      icon: DollarSign,
      color: 'bg-orange-500'
    },
    { 
      title: "Confirm", 
      description: "Review and confirm transfer",
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];
  
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'backward'>('forward');
  const [transferComplete, setTransferComplete] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Client selection state
  const [selectedSender, setSelectedSender] = useState<Client | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<Client | null>(null);
  const [showNewSenderForm, setShowNewSenderForm] = useState(false);
  const [showNewReceiverForm, setShowNewReceiverForm] = useState(false);
  
  // Demo clients data
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'CUST1001',
      name: 'John Smith',
      phone: '+1 555-1234',
      email: 'john.smith@example.com',
      address: '123 Main St, New York, NY',
      country: 'USA',
      idType: 'Passport',
      idNumber: 'P12345678',
      bankAccount: '****1234',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'USD'
    },
    {
      id: 'CUST1002',
      name: 'Maria Garcia',
      phone: '+1 555-5678',
      email: 'maria.garcia@example.com',
      address: '456 Oak St, Miami, FL',
      country: 'USA',
      idType: 'Driver License',
      idNumber: 'DL87654321',
      bankAccount: '****5678',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'EUR'
    },
    {
      id: 'CUST1003',
      name: 'David Johnson',
      phone: '+1 555-9012',
      email: 'david.johnson@example.com',
      address: '789 Pine St, Chicago, IL',
      country: 'USA',
      idType: 'Passport',
      idNumber: 'P98765432',
      bankAccount: '****9012',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'GBP'
    },
    {
      id: 'CUST1004',
      name: 'Sarah Williams',
      phone: '+1 555-3456',
      email: 'sarah.williams@example.com',
      address: '321 Elm St, Los Angeles, CA',
      country: 'USA',
      idType: 'Driver License',
      idNumber: 'DL12345678',
      bankAccount: '****3456',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'JPY'
    }
  ]);
  
  // Form data
  const initialFormData: FormData = {
    sourceOfFunds: '',
    purposeOfTransfer: '',
    transferType: 'bank',
    amount: '',
    currency: 'USD',
    fee: '4.99',
    exchangeRate: '1.10',
    total: '',
    recipientAmount: '',
    sourceCurrency: 'USD',
    targetCurrency: 'USD',
    termsAccepted: false,
    operator: ''
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // Filtered clients based on search query
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter clients when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          client =>
            client.name.toLowerCase().includes(query) ||
            client.phone.toLowerCase().includes(query) ||
            client.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);
  
  // Navigation and form handling
  const handleNavigation = (direction: 'next' | 'back') => {
    if (direction === 'back') {
      setNavigationDirection('backward');
      if (activeStep > 1) {
        setActiveStep(activeStep - 1);
      } else {
        // Handle cancel/exit
        router.push('/dashboard');
      }
    } else {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setNavigationDirection('forward');
        if (activeStep < steps.length) {
          setActiveStep(activeStep + 1);
        } else {
          // Handle form submission
          handleSubmit();
        }
      }
    }
  };
  
  // Check if can proceed to next step
  const canProceed = (): boolean => {
    switch (activeStep) {
      case 1:
        return !!selectedSender;
      case 2:
        return !!selectedReceiver;
      case 3:
        return !!formData.sourceOfFunds && !!formData.purposeOfTransfer;
      case 4:
        return !!formData.amount && parseFloat(formData.amount) > 0;
      case 5:
        return formData.termsAccepted;
      default:
        return false;
    }
  };
  
  // Define Zod schemas for validation
  const senderSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    address: z.string().min(5),
    country: z.string().min(2),
    idType: z.string().min(2),
    idNumber: z.string().min(2),
    bankAccount: z.string().min(4),
    status: z.string().min(2),
    kycVerified: z.boolean(),
    riskRating: z.string().min(2)
  });

  const formDataSchema = z.object({
    sourceOfFunds: z.string().min(1, 'Please select a source of funds'),
    purposeOfTransfer: z.string().min(1, 'Please select a purpose of transfer'),
    transferType: z.string().min(1),
    amount: z.string()
      .min(1, 'Please enter an amount')
      .transform(Number)
      .pipe(z.number().positive('Amount must be greater than zero')),
    currency: z.string().min(3, 'Please select a currency'),
    fee: z.string().min(1),
    total: z.string().min(1),
    exchangeRate: z.string().min(1),
    recipientAmount: z.string().min(1),
    sourceCurrency: z.string().min(3, 'Please select a source currency'),
    targetCurrency: z.string().min(3, 'Please select a target currency'),
    termsAccepted: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
    operator: z.string().min(1, 'Please select an operator')
  });

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    try {
      switch (activeStep) {
        case 1:
          if (!selectedSender) {
            throw new Error('Please select a sender');
          }
          senderSchema.parse(selectedSender);
          break;
        case 2:
          if (!selectedReceiver) {
            throw new Error('Please select a receiver');
          }
          senderSchema.parse(selectedReceiver);
          break;
        case 3:
          formDataSchema.pick({ sourceOfFunds: true, purposeOfTransfer: true }).parse(formData);
          break;
        case 4:
          formDataSchema.pick({ amount: true, currency: true }).parse(formData);
          break;
        case 5:
          formDataSchema.pick({ termsAccepted: true }).parse(formData);
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          newErrors[err.path[0] as string] = err.message;
        });
      } else if (error instanceof Error) {
        newErrors[activeStep === 1 ? 'sender' : activeStep === 2 ? 'receiver' : 'general'] = error.message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    handleInputChange(name, value);
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Calculate fee based on amount
  const calculateFee = (amount: number): number => {
    // Simple fee calculation: 0.5% with minimum of 4.99
    const calculatedFee = amount * 0.005;
    return Math.max(calculatedFee, 4.99);
  };
  
  // Calculate recipient amount based on exchange rate
  const calculateRecipientAmount = (amount: number): number => {
    if (!amount) return 0;
    return amount * parseFloat(formData.exchangeRate);
  };
  
  // Calculate total amount (including fee)
  const calculateTotalAmount = (amount: number): number => {
    if (!amount) return 0;
    return amount + calculateFee(amount);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTransferComplete(true);
    setShowSuccessMessage(true);
    setIsSubmitting(false);
  };
  
  // Reset form
  const resetForm = () => {
    setActiveStep(1);
    setSelectedSender(null);
    setSelectedReceiver(null);
    setFormData(initialFormData);
    setErrors({});
    setShowSuccessMessage(false);
    setTransferComplete(false);
  };
  
  // Handle "Send Another" action
  const handleSendAnother = () => {
    resetForm();
  };
  
  return {
    steps,
    activeStep,
    navigationDirection,
    transferComplete,
    showSuccessMessage,
    isSubmitting,
    initialLoading,
    loading,
    errors,
    searchQuery,
    setSearchQuery,
    selectedSender,
    setSelectedSender,
    selectedReceiver,
    setSelectedReceiver,
    showNewSenderForm,
    setShowNewSenderForm,
    showNewReceiverForm,
    setShowNewReceiverForm,
    formData,
    setFormData,
    filteredClients,
    handleNavigation,
    canProceed,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    calculateFee,
    calculateRecipientAmount,
    calculateTotalAmount,
    handleSubmit,
    resetForm,
    handleSendAnother
  };
};
