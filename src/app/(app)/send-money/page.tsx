'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LucideIcon, ArrowLeft, Check, ChevronRight, User, Users, FileText, DollarSign, CheckCircle, Shield, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccessNew';
import { useSendMoneyForm } from './hooks/useSendMoneyForm';
import { SenderSelection } from './components/SenderSelection';
import { ReceiverSelection } from './components/ReceiverSelection';
import { TransferDetails } from './components/TransferDetails';
import { AmountEntry } from './components/AmountEntry';
import { ConfirmationStep } from './components/ConfirmationStep';
import { SimpleProgressIndicator } from '@/components/ui/SimpleProgressIndicator';

// Define step interfaces
interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function SendMoneyPage() {
  const {
    steps: formSteps,
    activeStep: initialActiveStep,
    navigationDirection,
    transferComplete,
    showSuccessMessage,
    isSubmitting,
    initialLoading,
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
    handleSendAnother
  } = useSendMoneyForm();

  const [isPrinting, setIsPrinting] = useState(false);

  // Use activeStep directly from useSendMoneyForm

  // Define our steps with icons
  const steps = [
    { 
      title: 'Sender', 
      description: 'Select who is sending the money',
      icon: User
    },
    { 
      title: 'Receiver', 
      description: 'Select who will receive the money',
      icon: Users
    },
    { 
      title: 'Details', 
      description: 'Specify transfer details',
      icon: FileText
    },
    { 
      title: 'Amount', 
      description: 'Enter amount and review fees',
      icon: DollarSign
    },
    { 
      title: 'Confirm', 
      description: 'Review and confirm transfer',
      icon: CheckCircle
    }
  ];
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Update steps with activeStep from useSendMoneyForm
  const currentSteps = steps.map((step, index) => ({
    ...step,
    showCheck: index < initialActiveStep,
    completed: index < initialActiveStep
  }));
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add event listener for form submission from ConfirmationStep
  useEffect(() => {
    const handleFormSubmit = () => {
      if (initialActiveStep === 5 && formData.termsAccepted && !isSubmitting) {
        // Trigger the next step navigation which will call handleSubmit() in the hook
        handleNavigation('next');
      }
    };
    
    window.addEventListener('submit-form', handleFormSubmit);
    return () => window.removeEventListener('submit-form', handleFormSubmit);
  }, [initialActiveStep, formData.termsAccepted, isSubmitting, handleNavigation]);
  
  // Render the current step content
  const renderStepContent = () => {
    switch (initialActiveStep) {
      case 0:
        return (
          <SenderSelection
            initialLoading={initialLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredClients={filteredClients}
            selectedSender={selectedSender}
            setSelectedSender={setSelectedSender}
            setShowNewSenderForm={setShowNewSenderForm}
          />
        );
      case 1:
        return (
          <ReceiverSelection
            initialLoading={initialLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredClients={filteredClients}
            selectedReceiver={selectedReceiver}
            setSelectedReceiver={setSelectedReceiver}
            setShowNewReceiverForm={setShowNewReceiverForm}
          />
        );
      case 2:
        return (
          <TransferDetails
            sourceOfFunds={formData.sourceOfFunds}
            purposeOfTransfer={formData.purposeOfTransfer}
            transferType={formData.transferType}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <AmountEntry
            formData={formData}
            handleInputChange={handleInputChange}
            calculateFee={calculateFee}
            calculateRecipientAmount={calculateRecipientAmount}
            calculateTotalAmount={calculateTotalAmount}
            errors={errors}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            selectedSender={selectedSender}
            selectedReceiver={selectedReceiver}
            handleCheckboxChange={handleCheckboxChange}
            isSubmitting={isSubmitting}
            errors={errors}
            transferComplete={transferComplete}
            handleSendAnother={handleSendAnother}
            calculateFee={calculateFee}
            calculateRecipientAmount={calculateRecipientAmount}
            calculateTotalAmount={calculateTotalAmount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              {initialActiveStep > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation('back')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Send Money</h1>
            </div>
            <div className="flex items-center">
              {initialActiveStep < formSteps.length && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation('next')}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4">
            <SimpleProgressIndicator
              steps={steps}
              activeStep={initialActiveStep}
              onStepChange={(direction) => {
                handleNavigation(direction);
              }}
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex flex-col gap-8">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={initialActiveStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div
              key={initialActiveStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-end gap-4"
            >
              {initialActiveStep > 0 && (
                <Button
                  onClick={() => handleNavigation('back')}
                  variant="outline"
                  className="rounded-xl"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={() => handleNavigation('next')}
                className={cn(
                  "rounded-xl w-full sm:w-auto",
                  !canProceed ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" :
                  "bg-blue-500 hover:bg-blue-600 text-white"
                )}
                disabled={!canProceed || isSubmitting}
              >
                {initialActiveStep === formSteps.length - 1 ? 'Submit' : 'Next'}
                {initialActiveStep === formSteps.length - 1 ? null : <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <AnimatePresence>
        {showSuccessMessage && (
          <ConfettiSuccess
            message="Transfer Successful!"
            description="Your money transfer has been completed successfully."
            actionLabel="Print Receipt"
            onActionClick={handlePrint}
            onSendAnother={handleSendAnother}
            amount={formData.amount}
            currency="USD"
            receiverName={selectedReceiver?.name || ''}
            senderName={selectedSender?.name || ''}
            transferDate={new Date().toLocaleDateString()}
            referenceId={Math.random().toString(36).substring(2, 10).toUpperCase()}
            fee={formData.fee || '0'}
            totalAmount={(parseFloat(formData.amount) + parseFloat(formData.fee || '0')).toFixed(2)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
