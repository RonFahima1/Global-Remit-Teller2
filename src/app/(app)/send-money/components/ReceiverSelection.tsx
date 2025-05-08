import React from 'react';
import { UserPlus } from 'lucide-react';
import { Client } from '../hooks/useSendMoneyForm';
import { ClientSelection } from './ClientSelection';
import { Button } from '@/components/ui/button';

interface ReceiverSelectionProps {
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedReceiver: Client | null;
  setSelectedReceiver: (client: Client | null) => void;
  setShowNewReceiverForm: (show: boolean) => void;
}

export const ReceiverSelection: React.FC<ReceiverSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedReceiver,
  setSelectedReceiver,
  setShowNewReceiverForm
}) => {
  return (
    <ClientSelection
      initialLoading={initialLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredClients={filteredClients}
      selectedClient={selectedReceiver}
      setSelectedClient={setSelectedReceiver}
      showNewForm={() => setShowNewReceiverForm(true)}
      title="Receiver"
      emptyMessage="No receivers found"
      buttonLabel="Add New Receiver"
      buttonIcon={UserPlus}
      selectedBorderColor="green-500"
      selectedBackgroundColor="green-50"
      selectedTextColor="green-500"
    />
  );
};
