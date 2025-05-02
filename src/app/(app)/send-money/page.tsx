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
import { Toaster, toast } from "sonner";
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SwipeableCard } from "@/components/ui/swipeable-card";
import { motion, AnimatePresence } from "framer-motion";

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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

   const handleSenderSearch = (searchParams: any) => {
      console.log("Searching for Sender:", searchParams);
      // Mock finding a sender
      if (searchParams.type === 'phone' && searchParams.value === '502345678') {
          setSelectedSender({ name: 'John Doe', id: 'CUST001' }); // Mock sender data
      } else {
          setSelectedSender(null);
      }
      // In a real app, fetch sender data
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

  return (
    <>
      <Toaster position="top-center" />
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
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-base font-medium">Search for Sender</Label>
                            <CustomerSearch
                              onSearch={handleSenderSearch}
                              className="h-12 rounded-xl"
                            />
                          </div>

                          {selectedSender && (
                            <Card className="border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-green-900 dark:text-green-400">{selectedSender.name}</h3>
                                    <p className="text-sm text-green-700 dark:text-green-500">ID: {selectedSender.id}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {errors.sender && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{errors.sender}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {/* Step 2: Receiver */}
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-base font-medium">Search for Receiver</Label>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUseSameAsSender}
                                disabled={!selectedSender}
                                className="text-sm"
                              >
                                Same as Sender
                              </Button>
                              <Link href="/clients/new" passHref>
                                <Button variant="outline" size="sm" className="text-sm">
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  New Receiver
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <CustomerSearch
                            onSearch={handleReceiverSearch}
                            className="h-12 rounded-xl"
                          />

                          {selectedReceiver && (
                            <Card className="border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-green-900 dark:text-green-400">{selectedReceiver.name}</h3>
                                    <p className="text-sm text-green-700 dark:text-green-500">ID: {selectedReceiver.id}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {errors.receiver && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{errors.receiver}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {/* Step 3: Transaction Details */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-base font-medium">Source of Funds</Label>
                              <Select value={sourceOfFunds} onValueChange={setSourceOfFunds}>
                                <SelectTrigger className="h-12 rounded-xl">
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
                                <p className="text-sm text-destructive">{errors.sourceOfFunds}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-base font-medium">Purpose of Transfer</Label>
                              <Select value={purposeOfTransfer} onValueChange={setPurposeOfTransfer}>
                                <SelectTrigger className="h-12 rounded-xl">
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
                                <p className="text-sm text-destructive">{errors.purposeOfTransfer}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-base font-medium">Transfer Type</Label>
                              <Select value={transferType} onValueChange={setTransferType}>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select transfer type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="instant">Instant Transfer</SelectItem>
                                  <SelectItem value="standard">Standard Transfer</SelectItem>
                                  <SelectItem value="scheduled">Scheduled Transfer</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.transferType && (
                                <p className="text-sm text-destructive">{errors.transferType}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Amount and Payment */}
                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="relative space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-medium">You Pay</Label>
                                <button
                                  type="button"
                                  onClick={() => setShowRateInfo(!showRateInfo)}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
                                    className="h-12 text-lg font-medium rounded-xl"
                                  />
                                </div>
                                <Select value={payCurrency} onValueChange={setPayCurrency}>
                                  <SelectTrigger className="w-[120px] h-12 rounded-xl">
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

                            <div className="space-y-2">
                              <Label className="text-base font-medium">They Receive</Label>
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    value={receiveAmount}
                                    onChange={(e) => setReceiveAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="h-12 text-lg font-medium rounded-xl"
                                  />
                                </div>
                                <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                                  <SelectTrigger className="w-[120px] h-12 rounded-xl">
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

                            {showRateInfo && <RateInfo />}

                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-700 dark:text-blue-300">Exchange Rate</span>
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                  1 {payCurrency} = {rate} {receiveCurrency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 5: Confirmation */}
                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <div className="rounded-xl border bg-card p-6 space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-medium text-lg">Transaction Summary</h3>
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

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="terms"
                              checked={termsAccepted}
                              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm text-muted-foreground"
                            >
                              I agree to the terms and conditions of this transfer
                            </label>
                          </div>

                          {errors.terms && (
                            <p className="text-sm text-destructive">{errors.terms}</p>
                          )}
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
    </>
  );
}
