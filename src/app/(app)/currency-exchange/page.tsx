'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for currencies and rates
const currencies = [
  { code: 'USD', name: 'US Dollar', rate: 1.0000 },
  { code: 'EUR', name: 'Euro', rate: 0.9200 },
  { code: 'GBP', name: 'British Pound', rate: 0.7900 },
  { code: 'JPY', name: 'Japanese Yen', rate: 151.5000 },
  { code: 'ILS', name: 'Israeli Shekel', rate: 3.6900 },
  { code: 'AUD', name: 'Australian Dollar', rate: 1.5200 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.3500 },
];

export default function CurrencyExchangePage() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [rate, setRate] = useState(0.9200);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [favorites, setFavorites] = useState<string[]>(['USD', 'EUR', 'GBP']);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate conversion
  const calculateConversion = (amount: string, from: string, to: string) => {
    if (!amount) return '';
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    const result = (parseFloat(amount) * toRate) / fromRate;
    return result.toFixed(4);
  };

  // Handle amount changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value) {
      setToAmount(calculateConversion(value, fromCurrency, toCurrency));
    } else {
      setToAmount('');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value) {
      setFromAmount(calculateConversion(value, toCurrency, fromCurrency));
    } else {
      setFromAmount('');
    }
  };

  // Handle currency changes
  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    if (fromAmount) {
      setToAmount(calculateConversion(fromAmount, value, toCurrency));
    }
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
    if (fromAmount) {
      setToAmount(calculateConversion(fromAmount, fromCurrency, value));
    }
  };

  // Toggle favorite
  const toggleFavorite = (currency: string) => {
    setFavorites(prev => 
      prev.includes(currency)
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  // Refresh rates
  const refreshRates = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="card-ios">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Currency Exchange</CardTitle>
                <button
                  onClick={refreshRates}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  <span>Refresh Rates</span>
                </button>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {favorites.map((currency: string) => (
                  <button
                    key={currency}
                    onClick={() => toggleFavorite(currency)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                      currency === fromCurrency || currency === toCurrency
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </CardContent>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500">You Pay</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => handleFromAmountChange(e.target.value)}
                          placeholder="0.00"
                          className="h-12 text-lg font-medium"
                        />
                      </div>
                      <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                        <SelectTrigger className="w-[120px] h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency: { code: string; name: string; rate: number }) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.code}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(currency.code);
                                  }}
                                  className={cn(
                                    "ml-2",
                                    favorites.includes(currency.code) ? "text-yellow-500" : "text-gray-400"
                                  )}
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setFromCurrency(toCurrency);
                        setToCurrency(fromCurrency);
                        if (fromAmount) {
                          setToAmount(fromAmount);
                          setFromAmount(calculateConversion(fromAmount, toCurrency, fromCurrency));
                        }
                      }}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5 rotate-90" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500">You Receive</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={toAmount}
                          onChange={(e) => handleToAmountChange(e.target.value)}
                          placeholder="0.00"
                          className="h-12 text-lg font-medium"
                        />
                      </div>
                      <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                        <SelectTrigger className="w-[120px] h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency: { code: string; name: string; rate: number }) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.code}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(currency.code);
                                  }}
                                  className={cn(
                                    "ml-2",
                                    favorites.includes(currency.code) ? "text-yellow-500" : "text-gray-400"
                                  )}
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Exchange Rate</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      1 {fromCurrency} = {rate} {toCurrency}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <div className="space-y-2">
                  {Array.from({ length: 5 }, (_, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">USD → EUR</p>
                        <p className="text-sm text-gray-500">1 hour ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">1,500.00</p>
                        <p className="text-sm text-gray-500">1,380.00</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="card-ios">
            <CardHeader>
              <CardTitle>Currency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Current Rates</h4>
                  <div className="space-y-1">
                    {currencies.map((currency: { code: string; name: string; rate: number }) => (
                      <div key={currency.code} className="flex justify-between items-center">
                        <span className="text-sm">{currency.code}</span>
                        <span className="font-medium">{currency.rate.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Market Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Current market trends indicate a slight increase in EUR value against USD. 
                    Consider locking in rates for larger transactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 pt-4">
          <Button className="flex-1 h-12">
            <ArrowRight className="h-5 w-5 mr-2" />
            Exchange Now
          </Button>
        </div>
        <div className="flex gap-4 pt-4">
          <Button className="flex-1 h-12">
            <ArrowRight className="h-5 w-5 mr-2" />
            View Transaction History
          </Button>
        </div>
        <div className="flex gap-4 pt-4">
          <Button className="flex-1 h-12">
            Exchange Information
          </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Rates are updated every 60 seconds. The final rate will be locked in when you confirm the exchange.
                </p>
                <p className="text-sm text-gray-500">
                  Exchange fees may apply. Please check the final amount before confirming.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 