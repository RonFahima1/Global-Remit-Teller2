import React from 'react';
import { UserPlus } from 'lucide-react';
import { Client } from '../hooks/useSendMoneyForm';
import { ClientSelection } from './ClientSelection';

interface SenderSelectionProps {
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedSender: Client | null;
  setSelectedSender: (client: Client | null) => void;
  setShowNewSenderForm: (show: boolean) => void;
}

export const SenderSelection: React.FC<SenderSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedSender,
  setSelectedSender,
  setShowNewSenderForm
}) => {
  return (
    <ClientSelection
      initialLoading={initialLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredClients={filteredClients}
      selectedClient={selectedSender}
      setSelectedClient={setSelectedSender}
      showNewForm={() => setShowNewSenderForm(true)}
      title="Sender"
      emptyMessage="No senders found"
      buttonLabel="Add New Sender"
      buttonIcon={UserPlus}
      selectedBorderColor="blue-500"
      selectedBackgroundColor="blue-50"
      selectedTextColor="blue-500"
    />
  );
};
