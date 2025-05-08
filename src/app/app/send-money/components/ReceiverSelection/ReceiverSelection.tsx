import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSendMoneyForm } from '@/app/(app)/send-money/hooks/useSendMoneyForm';
import { NewReceiverForm } from './NewReceiverForm';
import ConfettiSuccessForm from '@/components/ui/confetti-success-form';

interface ReceiverSelectionProps {
  onClose: () => void;
}

export function ReceiverSelection({ onClose }: ReceiverSelectionProps) {
  const [searchType, setSearchType] = useState<'phone' | 'name' | 'id'>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewReceiverForm, setShowNewReceiverForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const { selectedReceiver, setSelectedReceiver } = useSendMoneyForm();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual search logic
    console.log('Searching for receiver:', { searchType, searchQuery });
  };

  const handleNewReceiver = () => {
    setShowNewReceiverForm(true);
  };

  const handleSelectReceiver = (receiverId: string) => {
    // TODO: Implement receiver selection logic
    console.log('Selecting receiver:', receiverId);
  };

  const handleSelectSameAsSender = () => {
    // TODO: Implement same as sender logic
    console.log('Using same as sender');
  };

  const handleSelectGlobalRemit = () => {
    // TODO: Implement global remit selection logic
    console.log('Selecting Global Remit Product');
  };

  if (formSuccess) {
    return <ConfettiSuccessForm onClose={onClose} message="Receiver added successfully!" />;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Select Receiver</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="id">ID Number</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={`Enter ${searchType === 'phone' ? 'phone number' : searchType === 'name' ? 'name' : 'ID number'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </div>
          </div>

          {/* Receiver Options */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleNewReceiver}
              className="w-full"
            >
              Add New Receiver
            </Button>
            <Button
              variant="outline"
              onClick={handleSelectSameAsSender}
              className="w-full"
            >
              Same as Sender
            </Button>
            <Button
              variant="outline"
              onClick={handleSelectGlobalRemit}
              className="w-full"
            >
              Global Remit Product
            </Button>
          </div>

          {/* New Receiver Form */}
          {showNewReceiverForm && (
            <NewReceiverForm
              onClose={() => setShowNewReceiverForm(false)}
              onSuccess={() => {
                setFormSuccess(true);
                setShowNewReceiverForm(false);
              }}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
