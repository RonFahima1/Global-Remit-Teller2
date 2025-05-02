'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, DollarSign, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";

// Mock data for demonstration
const cashMovements = [
  {
    id: 1,
    timestamp: '2024-03-22 10:30 AM',
    type: 'Opening Balance',
    amount: 5000,
    currency: 'USD',
    balance: 5000,
    operator: 'John Doe'
  },
  {
    id: 2,
    timestamp: '2024-03-22 11:15 AM',
    type: 'Cash Out',
    amount: -1000,
    currency: 'USD',
    balance: 4000,
    operator: 'John Doe'
  },
  {
    id: 3,
    timestamp: '2024-03-22 02:30 PM',
    type: 'Cash In',
    amount: 2000,
    currency: 'USD',
    balance: 6000,
    operator: 'Jane Smith'
  }
];

export default function CashRegisterPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-h1 font-h1 text-foreground">Cash Register</h1>
        <Button className="ios-button">
          <Calculator className="mr-2 h-4 w-4" />
          Open Register
        </Button>
      </div>

      {/* Cash Register Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-ios">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Last updated: Today at 02:30 PM</p>
          </CardContent>
        </Card>

        <Card className="card-ios">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash In</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">$2,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>

        <Card className="card-ios">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash Out</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">$1,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>

        <Card className="card-ios">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Today at 10:30 AM</p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Movement Actions */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Cash Movement</CardTitle>
          <CardDescription>Record cash in or cash out transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Cash In</h3>
              <div className="flex gap-2">
                <Input type="number" placeholder="Amount" className="ios-input" />
                <Button className="ios-button bg-green-500 hover:bg-green-600">
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Cash In
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Cash Out</h3>
              <div className="flex gap-2">
                <Input type="number" placeholder="Amount" className="ios-input" />
                <Button className="ios-button bg-red-500 hover:bg-red-600">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Cash Out
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Movement History */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Movement History</CardTitle>
          <CardDescription>Today's cash register movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashMovements.map((movement) => (
                  <TableRow key={movement.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{movement.timestamp}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          movement.type === 'Cash In' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          movement.type === 'Cash Out' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }
                      >
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={
                        movement.type === 'Cash In' ? 'text-green-500' :
                        movement.type === 'Cash Out' ? 'text-red-500' :
                        ''
                      }>
                        {movement.amount > 0 ? '+' : ''}{movement.amount} {movement.currency}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{movement.balance} {movement.currency}</TableCell>
                    <TableCell>{movement.operator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 