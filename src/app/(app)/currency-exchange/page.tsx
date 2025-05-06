'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { IOSHeader } from '@/components/ui/IOSHeader';
import { useCurrencyExchange } from './hooks/useCurrencyExchange';
import { ExchangeForm } from './components/ExchangeForm';
import { RatesTable } from './components/RatesTable';
import { TransactionHistory } from './components/TransactionHistory';

export default function CurrencyExchangePage() {
  const {
    currencies,
    exchangeData,
    isLoading,
    showSuccessMessage,
    activeTab,
    errors,
    favorites,
    lastUpdated,
    isFlipping,
    recentTransactions,
    getCurrency,
    handleFromAmountChange,
    handleToAmountChange,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    swapCurrencies,
    toggleFavorite,
    refreshRates,
    processExchange,
    resetSuccess,
    setActiveTab,
    handleCheckboxChange,
    calculateFee,
    calculateTotalAmount
  } = useCurrencyExchange();

  const fromCurrency = getCurrency(exchangeData.fromCurrency);
  const toCurrency = getCurrency(exchangeData.toCurrency);

  return (
    <div className="min-h-screen pb-16">
      {/* Animated background with subtle animation */}
      <LiquidBackground colorScheme="blue" variant="subtle" opacity={0.08} />
      
      {/* Header */}
      <IOSHeader
        title="Currency Exchange"
        subtitle="Exchange currencies with real-time rates"
      />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <Tabs 
          defaultValue="exchange" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="exchange" className="text-base">Exchange</TabsTrigger>
            <TabsTrigger value="rates" className="text-base">Rates</TabsTrigger>
            <TabsTrigger value="history" className="text-base">History</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="exchange" className="mt-0">
              <motion.div
                key="exchange"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ExchangeForm
                  currencies={currencies}
                  exchangeData={exchangeData}
                  handleFromAmountChange={handleFromAmountChange}
                  handleToAmountChange={handleToAmountChange}
                  handleFromCurrencyChange={handleFromCurrencyChange}
                  handleToCurrencyChange={handleToCurrencyChange}
                  swapCurrencies={swapCurrencies}
                  toggleFavorite={toggleFavorite}
                  processExchange={processExchange}
                  favorites={favorites}
                  errors={errors}
                  isLoading={isLoading}
                  isFlipping={isFlipping}
                  handleCheckboxChange={handleCheckboxChange}
                  calculateFee={calculateFee}
                  calculateTotalAmount={calculateTotalAmount}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="rates" className="mt-0">
              <motion.div
                key="rates"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RatesTable
                  currencies={currencies}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  refreshRates={refreshRates}
                  isLoading={isLoading}
                  lastUpdated={lastUpdated}
                  baseCurrency={exchangeData.fromCurrency}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TransactionHistory
                  transactions={recentTransactions}
                  currencies={currencies}
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
      
      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <ConfettiSuccess
            message="Exchange Successful!"
            description={`You've exchanged ${fromCurrency.symbol}${exchangeData.fromAmount} to ${toCurrency.symbol}${exchangeData.toAmount}`}
            actionLabel="View History"
            onActionClick={() => {
              setActiveTab('history');
              resetSuccess();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}