import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSendMoneyForm } from '../../hooks/useSendMoneyForm';
import { NewSenderForm } from './NewSenderForm';
import { CheckCircle } from 'lucide-react';

export function SenderSearch() {
  const {
    searchQuery,
    setSearchQuery,
    filteredClients,
    selectedSender,
    setSelectedSender
  } = useSendMoneyForm();
  const [searchMethod, setSearchMethod] = useState('phone');
  const [showNewSender, setShowNewSender] = useState(false);

  const searchMethods = [
    { value: 'phone', label: 'Phone' },
    { value: 'name', label: 'Name' },
    { value: 'id', label: 'ID' },
    { value: 'bank', label: 'Bank Account' }
  ];

  const handleSearch = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    setSearchQuery(query);
  }, []);

  // Update search query when search method changes
  React.useEffect(() => {
    setSearchQuery('');
  }, [searchMethod]);

  return (
    <div className="space-y-4">
      {/* Search Method Selection */}
      <div className="flex items-center space-x-2">
        <Select
          value={searchMethod}
          onValueChange={setSearchMethod}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            {searchMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder={
              searchMethod === 'phone' ? '+972 502345678' :
              searchMethod === 'name' ? 'Enter name...' :
              searchMethod === 'id' ? 'Enter ID...' :
              searchMethod === 'bank' ? 'Enter bank account...' :
              'Enter customer card...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedSender(client)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-gray-500">
                  {searchMethod === 'phone' && client.phone}
                  {searchMethod === 'name' && client.name}
                  {searchMethod === 'id' && client.idNumber}
                  {searchMethod === 'bank' && client.bankAccount}
                </p>
              </div>
              {selectedSender?.id === client.id && (
                <div className="text-blue-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Sender Button */}
      <Button
        variant="outline"
        onClick={() => setShowNewSender(true)}
        className="w-full"
      >
        New Sender
      </Button>

      {/* New Sender Form */}
      {showNewSender && (
        <div className="mt-4">
          <NewSenderForm onClose={() => setShowNewSender(false)} />
        </div>
      )}
    </div>
  );
}
