'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, History, DollarSign } from "lucide-react";

// Mock data for demonstration
const balanceHistory = [
  { 
    id: 1, 
    date: '2024-03-20', 
    type: 'Deposit',
    amount: 1000,
    currency: 'USD',
    balance: 1000,
    status: 'Completed'
  },
  { 
    id: 2, 
    date: '2024-03-21', 
    type: 'Withdrawal',
    amount: -300,
    currency: 'USD',
    balance: 700,
    status: 'Completed'
  },
  { 
    id: 3, 
    date: '2024-03-22', 
    type: 'Deposit',
    amount: 500,
    currency: 'USD',
    balance: 1200,
    status: 'Completed'
  },
];

export default function ClientBalancePage() {
  const handleClientSearch = (searchParams: any) => {
    console.log('Searching for client:', searchParams);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Client Balance</h1>
            <p className="text-muted-foreground mt-1">View and manage client balances</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Balance Overview Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-2xl font-bold">$1,200.00</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Last updated: Today at 10:30 AM</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Deposits</p>
                        <p className="text-2xl font-bold text-green-500">$1,500.00</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">2 transactions this month</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                        <ArrowDownLeft className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                        <p className="text-2xl font-bold text-red-500">$300.00</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">1 transaction this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Recent balance changes and transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'Deposit' ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                              {transaction.type === 'Deposit' ? (
                                <ArrowUpRight className={`h-4 w-4 text-green-500`} />
                              ) : (
                                <ArrowDownLeft className={`h-4 w-4 text-red-500`} />
                              )}
                            </div>
                            {transaction.type}
                          </div>
                        </TableCell>
                        <TableCell className={`${
                          transaction.type === 'Deposit' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'Deposit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>${transaction.balance.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Customer Search Panel */}
          <div>
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle>Search Client</CardTitle>
                <CardDescription>Find a client to view their balance</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerSearch
                  onSearch={handleClientSearch}
                  defaultTab="phone"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 