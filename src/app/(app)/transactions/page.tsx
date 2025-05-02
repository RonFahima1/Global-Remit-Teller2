'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-range';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Filter, CalendarDays, ListFilter, ChevronDown, Star, Download, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transactionService, type Transaction, type RecentRecipient } from '@/services/transaction';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

const getStatusPillClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'ios-status-pill-green';
    case 'pending': return 'ios-status-pill-orange';
    case 'failed': return 'ios-status-pill-red';
    default: return 'ios-status-pill-gray';
  }
};

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentRecipients, setRecentRecipients] = useState<RecentRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txns, recipients] = await Promise.all([
        transactionService.getRecentTransactions(),
        transactionService.getRecentRecipients()
      ]);
      setTransactions(txns);
      setRecentRecipients(recipients);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type: 'type' | 'status', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleDownloadReceipt = async (transaction: Transaction) => {
    try {
      const receiptUrl = await transactionService.generateReceipt(transaction);
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = receiptUrl;
      link.download = `receipt-${transaction.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const handleSendNotification = async (transaction: Transaction, type: 'email' | 'sms') => {
    try {
      await transactionService.sendTransactionNotification(transaction);
      toast.success(`${type === 'email' ? 'Email' : 'SMS'} notification sent successfully`);
    } catch (error) {
      toast.error(`Failed to send ${type} notification`);
    }
  };

  const handleToggleFavorite = async (recipientId: string) => {
    try {
      await transactionService.toggleFavoriteRecipient(recipientId);
      setRecentRecipients(prev => 
        prev.map(r => r.id === recipientId ? { ...r, isFavorite: !r.isFavorite } : r)
      );
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-h1 font-h1 text-foreground">Transactions</h1>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="recipients">Recent Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters Section */}
          <Card className="card-ios">
            <CardContent className="pt-6 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by ID, client, amount..." className="input-ios pl-8 w-full focus:ring-primary" />
              </div>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto btn-ios-secondary">
                    <ListFilter className="mr-2 h-4 w-4" /> Filters <ChevronDown className="ml-1 h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={filters.type === 'all'} onCheckedChange={() => handleFilterChange('type', 'all')}>All Types</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.type === 'Remittance'} onCheckedChange={() => handleFilterChange('type', 'Remittance')}>Remittance</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.type === 'Exchange'} onCheckedChange={() => handleFilterChange('type', 'Exchange')}>Exchange</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.type === 'Deposit'} onCheckedChange={() => handleFilterChange('type', 'Deposit')}>Deposit</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.type === 'Withdrawal'} onCheckedChange={() => handleFilterChange('type', 'Withdrawal')}>Withdrawal</DropdownMenuCheckboxItem>

                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={filters.status === 'all'} onCheckedChange={() => handleFilterChange('status', 'all')}>All Statuses</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.status === 'Completed'} onCheckedChange={() => handleFilterChange('status', 'Completed')}>Completed</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.status === 'Pending'} onCheckedChange={() => handleFilterChange('status', 'Pending')}>Pending</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={filters.status === 'Failed'} onCheckedChange={() => handleFilterChange('status', 'Failed')}>Failed</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Active Filters Display */}
              <div className="flex gap-2 flex-wrap">
                {filters.type !== 'all' && <Badge variant="secondary" className="rounded-ios bg-primary/10 text-primary">{filters.type}</Badge>}
                {filters.status !== 'all' && <Badge variant="secondary" className="rounded-ios bg-primary/10 text-primary">{filters.status}</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <Card className="card-ios">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter(tx => filters.type === 'all' || tx.type === filters.type)
                    .filter(tx => filters.status === 'all' || tx.status === filters.status)
                    .map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.client}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell className="text-right">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                        <TableCell>
                          <span className={`ios-status-pill ${getStatusPillClass(tx.status)}`}>
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(tx)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendNotification(tx, 'email')}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendNotification(tx, 'sms')}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send SMS
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle>Recent Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentRecipients.map(recipient => (
                    <div key={recipient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{recipient.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6",
                              recipient.isFavorite ? "text-yellow-500" : "text-muted-foreground"
                            )}
                            onClick={() => handleToggleFavorite(recipient.id)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{recipient.phone}</p>
                        <p className="text-xs text-muted-foreground">Last transaction: {recipient.lastTransaction}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Send Money
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
