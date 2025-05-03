'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CustomerSearch } from '@/components/customer/CustomerSearch';
import { Search, UserPlus, ArrowRight, Check, Loader2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SwipeableCard } from "@/components/ui/swipeable-card";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const steps = [
  { title: 'Sender', description: 'Select the person sending money' },
  { title: 'Receiver', description: 'Choose who will receive the funds' },
  { title: 'Details', description: 'Specify transfer details and purpose' },
  { title: 'Amount', description: 'Enter amount and currency' },
  { title: 'Confirm', description: 'Review and confirm transaction' }
];

// Add validation types
type ValidationErrors = {
  sender?: string;
  receiver?: string;
  sourceOfFunds?: string;
  purposeOfTransfer?: string;
  transferType?: string;
  amount?: string;
  terms?: string;
};

const demoClient = {
  id: 'CUST1001',
  name: 'Alex Morgan',
  phone: '+1 555-123-4567',
  email: 'alex.morgan@example.com',
  address: '123 Apple Park Way, Cupertino, CA, USA',
  country: 'USA',
  idType: 'Passport',
  idNumber: 'X1234567',
  bankAccount: '1234567890',
  customerCard: 'CARD1001',
};

const demoUser = {
  name: 'Alex Morgan',
};
const recentContacts = [
  { name: 'Jane Smith', phone: '+1 555-987-6543' },
  { name: 'Carlos Diaz', phone: '+1 555-222-3333' },
  { name: 'Dana Kim', phone: '+1 555-444-5555' },
];

export default function SendMoneyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const progressValue = ((currentStep + 1) / steps.length) * 100;
  const [payAmount, setPayAmount] = useState<string>('');
  const [payCurrency, setPayCurrency] = useState<string>('USD');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [receiveCurrency, setReceiveCurrency] = useState<string>('ILS');
  const [rate, setRate] = useState<number>(3.6900);
  const [editingField, setEditingField] = useState<'pay' | 'receive'>('pay');
  const [selectedSender, setSelectedSender] = useState<any>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [purposeOfTransfer, setPurposeOfTransfer] = useState('');
  const [transferType, setTransferType] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showRateInfo, setShowRateInfo] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [searchType, setSearchType] = useState('Phone');
  const [searchValue, setSearchValue] = useState('');
  const [showNewSender, setShowNewSender] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

  const handleSenderSearch = () => {
    let found = false;
    if (searchType === 'Phone' && searchValue === demoClient.phone) found = true;
    if (searchType === 'Name' && searchValue.toLowerCase() === demoClient.name.toLowerCase()) found = true;
    if (searchType === 'ID' && searchValue === demoClient.idNumber) found = true;
    if (searchType === 'Bank Account' && searchValue === demoClient.bankAccount) found = true;
    if (searchType === 'Customer Card' && searchValue === demoClient.customerCard) found = true;
    if (searchType === 'QR Code' && searchValue === 'DEMOQR') found = true;
    if (found) {
      setSelectedSender(demoClient);
      setErrors((e) => ({ ...e, sender: undefined }));
    } else {
      setSelectedSender(null);
      setErrors((e) => ({ ...e, sender: 'No client found for this input.' }));
    }
  };

  const handleReceiverSearch = (searchParams: any) => {
    console.log("Searching for Receiver:", searchParams);
    // Mock finding a receiver
    if (searchParams.type === 'phone' && searchParams.value === '501234567') {
      setSelectedReceiver({ name: 'Jane Smith', id: 'CUST002' }); // Mock receiver data
    } else {
      setSelectedReceiver(null);
    }
    // In a real app, fetch receiver data
  };

  const handleUseSameAsSender = () => {
    if (selectedSender) {
      setSelectedReceiver(selectedSender);
    }
  };

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    switch (step) {
      case 0:
        if (!selectedSender) {
          newErrors.sender = "Please select a sender";
        }
        break;
      case 1:
        if (!selectedReceiver) {
          newErrors.receiver = "Please select a receiver";
        }
        break;
      case 2:
        if (!sourceOfFunds) {
          newErrors.sourceOfFunds = "Please select source of funds";
        }
        if (!purposeOfTransfer) {
          newErrors.purposeOfTransfer = "Please select purpose of transfer";
        }
        if (!transferType) {
          newErrors.transferType = "Please select transfer type";
        }
        break;
      case 3:
        if (!payAmount || parseFloat(payAmount) <= 0) {
          newErrors.amount = "Please enter a valid amount";
        }
        break;
      case 4:
        if (!termsAccepted) {
          newErrors.terms = "Please accept the terms and conditions";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Transaction submitted successfully!");
      // Reset form or redirect
    } catch (error) {
      toast.error("Failed to process transaction. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Add rate information tooltip
  const RateInfo = () => (
    <div className="absolute z-10 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 mt-2 max-w-xs">
      <h4 className="font-medium mb-2 dark:text-white">Exchange Rate Information</h4>
      <p className="text-sm text-muted-foreground dark:text-gray-400">
        Rates are updated every 60 seconds. The final rate will be locked in when you confirm the transaction.
      </p>
    </div>
  );

  // Handle swipe navigation
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    if (direction === 'left' && currentStep < steps.length - 1) {
      nextStep();
    } else if (direction === 'right' && currentStep > 0) {
      prevStep();
    }
  };

  const validateSenderInput = (type, value) => {
    if (!value) return false;
    if (type === 'Phone') return /^\+?\d[\d\s-]{7,}$/.test(value);
    if (type === 'Name') return value.length > 2;
    if (type === 'ID') return value.length > 3;
    if (type === 'Bank Account') return value.length > 5;
    if (type === 'Customer Card') return value.length > 5;
    return true;
  };

  return (
    <div className="w-full flex flex-col flex-1 px-4 lg:px-6">
      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 border-b dark:border-gray-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {steps[currentStep].title}
              </span>
            </div>
            <Progress 
              value={progressValue} 
              className="h-2 rounded-full [&>div]:bg-primary"
              aria-label="Form progress"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full flex flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr] gap-6 w-full flex-1">
          {/* Left Sidebar - Steps Overview */}
          {!isMobile && (
            <div className="hidden lg:block">
              <div className="space-y-3 sticky top-24">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      currentStep === index
                        ? "bg-primary/5 border-l-4 border-primary"
                        : currentStep > index
                        ? "bg-muted/50 border-l-4 border-muted"
                        : "bg-background border-l-4 border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        currentStep === index
                          ? "bg-primary text-white"
                          : currentStep > index
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Form Area */}
          <div className="w-full h-full flex-1 flex min-w-0">
            <Card className="border-0 shadow-lg w-full h-full flex-1 flex max-w-none min-h-[calc(100vh-70px)] min-w-0">
              <CardContent className="p-0 w-full h-full flex-1 flex flex-col min-w-0">
                {/* Form Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 p-6"
                  >
                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please fix the following errors:
                          <ul className="list-disc pl-4 mt-2">
                            {Object.entries(errors).map(([key, value]) => (
                              <li key={key}>{value}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Step 1: Sender */}
                    {currentStep === 0 && (
                      <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
                        <div className="rounded-[2rem] bg-white/90 dark:bg-white/10 shadow-xl px-8 py-10 max-w-2xl w-full flex flex-col gap-8 border border-white/40 dark:border-white/10 mx-auto">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Sender</h2>
                            <p className="text-gray-400 text-base">Select the person sending money</p>
                          </div>
                          
                          {/* Search Type Selector */}
                          <div className="relative">
                            <div className="flex flex-row gap-3 mb-6 overflow-x-auto whitespace-nowrap pr-6 hide-scrollbar">
                              {['Phone', 'Name', 'ID', 'Bank Account', 'QR Code', 'Customer Card'].map((type) => (
                                <motion.button
                                  key={type}
                                  type="button"
                                  whileTap={{ scale: 0.95 }}
                                  animate={searchType === type ? { scale: 1.08, boxShadow: '0 2px 12px #007AFF33' } : { scale: 1, boxShadow: 'none' }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  className={cn(
                                    'px-4 py-1.5 rounded-full font-medium transition-all shadow-sm border flex items-center justify-center',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-300',
                                    'text-base',
                                    searchType === type
                                      ? 'bg-[#007AFF] text-white border-[#007AFF]'
                                      : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 dark:bg-white/10 dark:text-gray-200 dark:border-white/10',
                                    'h-10 min-w-[90px]'
                                  )}
                                  onClick={() => { setSearchType(type); setSearchValue(''); setSelectedSender(null); setErrors((e) => ({ ...e, sender: undefined })); }}
                                >
                                  {type}
                                </motion.button>
                              ))}
                            </div>
                            <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white/90 to-transparent rounded-[2rem]" />
                          </div>

                          {/* Input UI for each search type */}
                          <div className="flex items-center gap-2 mb-6">
                            {searchType === 'Phone' && (
                              <>
                                <Select value={'+1'} disabled>
                                  <SelectTrigger className="w-16 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 shadow-inner text-base" tabIndex={0} />
                                  <SelectValue>+1</SelectValue>
                                </Select>
                                <motion.input
                                  className={cn(
                                    'flex-1 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 px-4 text-base shadow-inner placeholder-gray-400 transition-all',
                                    validateSenderInput(searchType, searchValue)
                                      ? 'ring-2 ring-green-400'
                                      : searchValue && !validateSenderInput(searchType, searchValue)
                                      ? 'ring-2 ring-red-400'
                                      : ''
                                  )}
                                  placeholder="Phone Number"
                                  value={searchValue}
                                  onChange={e => setSearchValue(e.target.value)}
                                  tabIndex={0}
                                  autoFocus
                                />
                                {validateSenderInput(searchType, searchValue) && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-1 text-green-500"
                                  >
                                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#d1fae5"/><path d="M6 10.5l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </motion.span>
                                )}
                              </>
                            )}
                            {searchType === 'Name' && (
                              <motion.input
                                className={cn(
                                  'flex-1 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 px-4 text-base shadow-inner placeholder-gray-400 transition-all',
                                  validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-green-400'
                                    : searchValue && !validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-red-400'
                                    : ''
                                )}
                                placeholder="Full Name"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                tabIndex={0}
                                autoFocus
                              />
                            )}
                            {searchType === 'ID' && (
                              <motion.input
                                className={cn(
                                  'flex-1 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 px-4 text-base shadow-inner placeholder-gray-400 transition-all',
                                  validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-green-400'
                                    : searchValue && !validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-red-400'
                                    : ''
                                )}
                                placeholder="ID Number"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                tabIndex={0}
                                autoFocus
                              />
                            )}
                            {searchType === 'Bank Account' && (
                              <motion.input
                                className={cn(
                                  'flex-1 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 px-4 text-base shadow-inner placeholder-gray-400 transition-all',
                                  validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-green-400'
                                    : searchValue && !validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-red-400'
                                    : ''
                                )}
                                placeholder="Bank Account Number"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                tabIndex={0}
                                autoFocus
                              />
                            )}
                            {searchType === 'Customer Card' && (
                              <motion.input
                                className={cn(
                                  'flex-1 h-12 rounded-full bg-[#F6F7F9] dark:bg-white/10 border-none focus:ring-2 focus:ring-blue-300 px-4 text-base shadow-inner placeholder-gray-400 transition-all',
                                  validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-green-400'
                                    : searchValue && !validateSenderInput(searchType, searchValue)
                                    ? 'ring-2 ring-red-400'
                                    : ''
                                )}
                                placeholder="Customer Card Number"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                tabIndex={0}
                                autoFocus
                              />
                            )}
                            {searchType === 'QR Code' && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="h-10 px-6 rounded-full bg-[#007AFF] text-white font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all text-base"
                                onClick={() => setShowQRModal(true)}
                                tabIndex={0}
                              >
                                Scan QR
                              </motion.button>
                            )}
                            {searchType !== 'QR Code' && (
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="h-10 px-6 rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#007AFF] text-white font-semibold shadow-lg hover:from-[#3576F6] hover:to-[#0051C7] active:scale-95 transition-all disabled:bg-blue-100 disabled:text-blue-300 disabled:shadow-none text-base"
                                onClick={handleSenderSearch}
                                disabled={!validateSenderInput(searchType, searchValue)}
                                tabIndex={0}
                              >
                                Search
                              </motion.button>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              className="rounded-full border-[#007AFF] text-[#007AFF] px-6 h-12 bg-white hover:bg-blue-50 shadow-sm flex items-center gap-2 text-base border font-medium"
                              onClick={() => setShowNewSender(true)}
                              tabIndex={0}
                            >
                              <UserPlus className="h-5 w-5" /> New Sender
                            </motion.button>
                          </div>

                          {/* Error State or Empty State */}
                          {errors.sender && (
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="mb-2">
                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e0e7ef"/><path d="M9.17 9.17a3 3 0 1 1 5.66 0M12 15v.01" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v-1" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                              <div className="text-blue-400 font-medium mb-1">No client found for this input.</div>
                              <div className="text-gray-400 text-sm">Try a different search or add a new sender.</div>
                            </div>
                          )}

                          {/* Confirmation Card */}
                          {selectedSender && (
                            <Card className="border border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-900/10 rounded-2xl shadow-md mt-4">
                              <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-green-900 dark:text-green-400">{selectedSender.name}</h3>
                                  <p className="text-sm text-green-700 dark:text-green-500">ID: {selectedSender.id}</p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Receiver */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-xl p-6 flex flex-col gap-6 border border-white/40 dark:border-white/10">
                          <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Receiver</Label>
                          <div className="flex flex-row gap-2 mb-4">
                            <Button
                              className="rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 active:scale-95 transition-all focus:ring-2 focus:ring-blue-300"
                              onClick={handleUseSameAsSender}
                              disabled={!selectedSender}
                            >
                              Same as Sender
                            </Button>
                            <Link href="/clients/new" passHref legacyBehavior>
                              <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                <UserPlus className="h-4 w-4 mr-1" /> New Receiver
                              </Button>
                            </Link>
                          </div>
                          {/* Search Field (reuse CustomerSearch for now) */}
                          <CustomerSearch
                            onSearch={handleReceiverSearch}
                            className="h-12 rounded-xl"
                          />
                          {/* Error State */}
                          {errors.receiver && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{errors.receiver}</AlertDescription>
                            </Alert>
                          )}
                          {/* Confirmation Card */}
                          {selectedReceiver && (
                            <Card className="border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10 rounded-2xl shadow-md mt-4">
                              <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-green-900 dark:text-green-400">{selectedReceiver.name}</h3>
                                  <p className="text-sm text-green-700 dark:text-green-500">ID: {selectedReceiver.id}</p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Transaction Details */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-xl p-6 flex flex-col gap-6 border border-white/40 dark:border-white/10">
                          <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transaction Details</Label>
                          {/* Source of Funds */}
                          <div className="space-y-2">
                            <Label className="text-base font-medium">Source of Funds</Label>
                            <Select value={sourceOfFunds} onValueChange={setSourceOfFunds}>
                              <SelectTrigger className="h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300">
                                <SelectValue placeholder="Select source of funds" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="savings">Savings</SelectItem>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="business">Business Income</SelectItem>
                                <SelectItem value="investment">Investment</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.sourceOfFunds && (
                              <p className="text-sm text-destructive mt-1">{errors.sourceOfFunds}</p>
                            )}
                          </div>
                          {/* Purpose of Transfer */}
                          <div className="space-y-2">
                            <Label className="text-base font-medium">Purpose of Transfer</Label>
                            <Select value={purposeOfTransfer} onValueChange={setPurposeOfTransfer}>
                              <SelectTrigger className="h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300">
                                <SelectValue placeholder="Select purpose of transfer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="family">Family Support</SelectItem>
                                <SelectItem value="business">Business Payment</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="medical">Medical Expenses</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.purposeOfTransfer && (
                              <p className="text-sm text-destructive mt-1">{errors.purposeOfTransfer}</p>
                            )}
                          </div>
                          {/* Transfer Type */}
                          <div className="space-y-2">
                            <Label className="text-base font-medium">Transfer Type</Label>
                            <Select value={transferType} onValueChange={setTransferType}>
                              <SelectTrigger className="h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300">
                                <SelectValue placeholder="Select transfer type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instant Transfer</SelectItem>
                                <SelectItem value="standard">Standard Transfer</SelectItem>
                                <SelectItem value="scheduled">Scheduled Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.transferType && (
                              <p className="text-sm text-destructive mt-1">{errors.transferType}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Amount and Payment */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-xl p-6 flex flex-col gap-6 border border-white/40 dark:border-white/10">
                          <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Amount and Payment</Label>
                          {/* You Pay */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-medium">You Pay</Label>
                              <button
                                type="button"
                                onClick={() => setShowRateInfo(!showRateInfo)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
                                aria-label="Show exchange rate info"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Input
                                  type="number"
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
                                  placeholder="0.00"
                                  className="h-12 text-lg font-medium rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300 px-4"
                                />
                              </div>
                              <Select value={payCurrency} onValueChange={setPayCurrency}>
                                <SelectTrigger className="w-[120px] h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {/* They Receive */}
                          <div className="space-y-2">
                            <Label className="text-base font-medium">They Receive</Label>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Input
                                  type="number"
                                  value={receiveAmount}
                                  onChange={(e) => setReceiveAmount(e.target.value)}
                                  placeholder="0.00"
                                  className="h-12 text-lg font-medium rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300 px-4"
                                />
                              </div>
                              <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                                <SelectTrigger className="w-[120px] h-12 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-300">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ILS">ILS</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {/* Exchange Rate Info */}
                          {showRateInfo && <RateInfo />}
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-blue-700 dark:text-blue-300">Exchange Rate</span>
                              <span className="font-medium text-blue-900 dark:text-blue-100">
                                1 {payCurrency} = {rate} {receiveCurrency}
                              </span>
                            </div>
                          </div>
                          {errors.amount && (
                            <p className="text-sm text-destructive mt-1">{errors.amount}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Confirmation */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-xl p-6 flex flex-col gap-6 border border-white/40 dark:border-white/10">
                          <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirmation</Label>
                          {/* Transaction Summary */}
                          <div className="rounded-2xl bg-white/90 dark:bg-white/10 border border-gray-100 dark:border-white/10 p-6 space-y-4 shadow">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">You Send</span>
                                <span className="font-medium">{payAmount} {payCurrency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">They Receive</span>
                                <span className="font-medium">{receiveAmount} {receiveCurrency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Exchange Rate</span>
                                <span className="font-medium">1 {payCurrency} = {rate} {receiveCurrency}</span>
                              </div>
                            </div>
                            <div className="pt-4 border-t space-y-2">
                              <h4 className="font-medium">Sender</h4>
                              <p className="text-sm text-muted-foreground">{selectedSender?.name}</p>
                            </div>
                            <div className="pt-4 border-t space-y-2">
                              <h4 className="font-medium">Receiver</h4>
                              <p className="text-sm text-muted-foreground">{selectedReceiver?.name}</p>
                            </div>
                            <div className="pt-4 border-t space-y-2">
                              <h4 className="font-medium">Transfer Details</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Source: {sourceOfFunds}</p>
                                <p>Purpose: {purposeOfTransfer}</p>
                                <p>Type: {transferType}</p>
                              </div>
                            </div>
                          </div>
                          {/* Terms Acceptance */}
                          <div className="flex items-center space-x-3 mt-4">
                            <Checkbox
                              id="terms"
                              checked={termsAccepted}
                              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                              className="w-6 h-6 rounded-xl border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-blue-300"
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm text-muted-foreground select-none"
                            >
                              I agree to the terms and conditions of this transfer
                            </label>
                          </div>
                          {errors.terms && (
                            <p className="text-sm text-destructive mt-1">{errors.terms}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="h-11"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                    disabled={isProcessing}
                    className="h-11"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentStep === steps.length - 1 ? (
                      "Confirm"
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
