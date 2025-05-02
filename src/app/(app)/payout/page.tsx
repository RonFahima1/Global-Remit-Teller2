'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MoreHorizontal, CheckCircle, Clock, XCircle, User, Landmark, HandCoins, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock Data
const payoutOrders = [
  { id: 'POUT001', transactionId: 'TXN123', receiver: 'Jane Smith', amount: 500, currency: 'USD', status: 'Pending Pickup', operator: 'Teller 1' },
  { id: 'POUT002', transactionId: 'TXN127', receiver: 'David Lee', amount: 750, currency: 'ILS', status: 'Ready', operator: 'Teller 1' },
  { id: 'POUT003', transactionId: 'TXN128', receiver: 'Anna Bell', amount: 200, currency: 'EUR', status: 'Paid', operator: 'Teller 2' },
   { id: 'POUT004', transactionId: 'TXN129', receiver: 'Mark Young', amount: 1000, currency: 'USD', status: 'Cancelled', operator: 'Teller 1' },
];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ready':
        case 'pending pickup':
            return <Clock className="h-4 w-4 text-ios-orange" />;
        case 'paid':
            return <CheckCircle className="h-4 w-4 text-ios-green" />;
        case 'cancelled':
            return <XCircle className="h-4 w-4 text-ios-red" />;
        default:
            return <Clock className="h-4 w-4 text-ios-gray" />;
    }
};

const getStatusPillClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ready':
        case 'pending pickup':
            return 'ios-status-pill-orange';
        case 'paid':
            return 'ios-status-pill-green';
        case 'cancelled':
            return 'ios-status-pill-red';
        default:
            return 'ios-status-pill-gray'; // Use gray for others
    }
};

export default function PayoutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof payoutOrders[0] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading payout data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-h1 font-h1 text-foreground">Payout Processing</h1>

      <Card className="card-ios">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <CardTitle className="text-h3 font-h3 text-card-foreground">Search Payout Orders</CardTitle>
             <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search by Order ID, TXN ID, Receiver..." className="input-ios pl-8 w-full md:w-[300px]" />
                </div>
               <Select defaultValue="teller1">
                    <SelectTrigger className="w-[150px] input-ios focus:ring-primary">
                        <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                        <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="teller1">Teller 1</SelectItem>
                        <SelectItem value="teller2">Teller 2</SelectItem>
                         <SelectItem value="all">All Operators</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer hover:bg-muted/50 ${selectedOrder?.id === order.id ? 'bg-primary/10' : ''}`}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.transactionId}</TableCell>
                  <TableCell>{order.receiver}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.amount, order.currency)}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                         <span className={`ios-status-pill ${getStatusPillClass(order.status)}`}>
                           {order.status}
                        </span>
                     </div>
                  </TableCell>
                  <TableCell>{order.operator}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full" onClick={(e) => e.stopPropagation()}>
                            <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>View Details</DropdownMenuItem>
                        { (order.status === 'Ready' || order.status === 'Pending Pickup') &&
                           <DropdownMenuItem className="text-ios-green focus:text-ios-green focus:bg-green-500/10">Mark as Paid</DropdownMenuItem>
                        }
                         { order.status !== 'Paid' && order.status !== 'Cancelled' &&
                           <DropdownMenuItem className="text-ios-red focus:text-ios-red focus:bg-red-500/10">Cancel Payout</DropdownMenuItem>
                         }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         {/* Add Pagination Controls here */}
      </Card>

      {/* Payout Details Panel */}
      {selectedOrder && (
        <Card className="card-ios">
          <CardHeader>
            <CardTitle className="text-h3 font-h3 text-card-foreground">Payout Details - {selectedOrder.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Transaction ID:</strong> {selectedOrder.transactionId}</p>
              <p><strong>Receiver:</strong> {selectedOrder.receiver}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedOrder.amount, selectedOrder.currency)} {selectedOrder.currency}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Assigned Operator:</strong> {selectedOrder.operator}</p>
            </div>
             {/* Pickup Management Section (if applicable) */}
            {(selectedOrder.status === 'Ready' || selectedOrder.status === 'Pending Pickup') && (
              <div className="border-t pt-4 mt-4">
                 <h4 className="font-semibold mb-2 text-foreground">Pickup Management</h4>
                  <div className="space-y-2">
                     <Label htmlFor="pickup-code" className="label-ios">Pickup Code / ID Verification</Label>
                     <Input id="pickup-code" placeholder="Enter verification code or scan ID" className="input-ios focus:ring-primary"/>
                  </div>
              </div>
            )}
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
             {(selectedOrder.status === 'Ready' || selectedOrder.status === 'Pending Pickup') && (
               <Button className="btn-ios-primary bg-ios-green hover:bg-ios-green/90"> {/* Use Green for Confirm */}
                 <HandCoins className="mr-2 h-4 w-4" /> Confirm Payment & Payout
               </Button>
             )}
             {selectedOrder.status !== 'Paid' && selectedOrder.status !== 'Cancelled' && (
                <Button variant="destructive" className="btn-ios-destructive">
                   Cancel Payout
                </Button>
             )}
             <Button variant="secondary" onClick={() => setSelectedOrder(null)} className="btn-ios-secondary">
               Close Details
             </Button>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}
