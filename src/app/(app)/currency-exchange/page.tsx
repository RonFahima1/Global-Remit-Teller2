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
        {/* Main Conversion Card */}
        <div className="lg:col-span-2">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Currency Exchange</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-500">You Pay</label>
                  <button
                    onClick={refreshRates}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    <span>Refresh Rates</span>
                  </button>
                </div>
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
                      {currencies.map(currency => (
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

              {/* Exchange Rate */}
              <div className="flex items-center justify-center py-2">
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    1 {fromCurrency} = {rate} {toCurrency}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
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
                      {currencies.map(currency => (
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button className="flex-1 h-12">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Exchange Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorites and Info Card */}
        <div className="space-y-6">
          {/* Favorites Card */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Favorite Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {favorites.map(code => {
                  const currency = currencies.find(c => c.code === code);
                  if (!currency) return null;
                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{currency.code}</p>
                        <p className="text-sm text-gray-500">{currency.name}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(code)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Exchange Information
              </CardTitle>
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