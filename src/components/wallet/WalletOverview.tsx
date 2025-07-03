'use client';

import { useState } from 'react';
import { useWalletBalance, useTransactionHistory, useCreateDeposit, useCreateWithdrawal } from '@/lib/hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  History,
  CreditCard,
  Banknote,
  Coins
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export function WalletOverview() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [depositData, setDepositData] = useState({
    amount: '',
    currency: 'naira',
    paymentMethod: 'bank_transfer'
  });
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    currency: 'naira',
    withdrawalMethod: 'bank_transfer'
  });

  const { data: walletBalance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransactionHistory({
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const createDeposit = useCreateDeposit();
  const createWithdrawal = useCreateWithdrawal();

  const isLoading = balanceLoading || transactionsLoading;

  const handleDeposit = async () => {
    if (!depositData.amount || parseFloat(depositData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await createDeposit.mutateAsync({
        amount: parseFloat(depositData.amount),
        currency: depositData.currency as 'naira' | 'usdt',
        paymentMethod: depositData.paymentMethod as 'bank_transfer' | 'crypto' | 'card'
      });
      
      toast.success('Deposit request created successfully');
      setIsDepositOpen(false);
      setDepositData({ amount: '', currency: 'naira', paymentMethod: 'bank_transfer' });
    } catch (error) {
      toast.error('Failed to create deposit request');
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalData.amount || parseFloat(withdrawalData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await createWithdrawal.mutateAsync({
        amount: parseFloat(withdrawalData.amount),
        currency: withdrawalData.currency as 'naira' | 'usdt',
        withdrawalMethod: withdrawalData.withdrawalMethod as 'bank_transfer' | 'crypto'
      });
      
      toast.success('Withdrawal request created successfully');
      setIsWithdrawalOpen(false);
      setWithdrawalData({ amount: '', currency: 'naira', withdrawalMethod: 'bank_transfer' });
    } catch (error) {
      toast.error('Failed to create withdrawal request');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'roi':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'investment':
        return <Coins className="h-4 w-4 text-purple-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletBalance?.walletBalances?.naira || 0, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(walletBalance?.walletBalances?.usdt || 0, 'USDT')} USDT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletBalance?.profitBalances?.naira || 0, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(walletBalance?.profitBalances?.usdt || 0, 'USDT')} USDT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletBalance?.totalEarnings || 0, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(walletBalance?.referralEarnings || 0, 'NGN')} from referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletBalance?.totalInvested || 0, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all investments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your wallet and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Deposit Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add funds to your wallet using your preferred payment method.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={depositData.amount}
                      onChange={(e) => setDepositData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deposit-currency">Currency</Label>
                    <Select 
                      value={depositData.currency} 
                      onValueChange={(value) => setDepositData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="naira">NGN (Naira)</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deposit-method">Payment Method</Label>
                    <Select 
                      value={depositData.paymentMethod} 
                      onValueChange={(value) => setDepositData(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="card">Card Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleDeposit} 
                    disabled={createDeposit.isPending}
                    className="w-full"
                  >
                    {createDeposit.isPending ? 'Processing...' : 'Create Deposit'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isWithdrawalOpen} onOpenChange={setIsWithdrawalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Minus className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your wallet to your preferred account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdrawal-amount">Amount</Label>
                    <Input
                      id="withdrawal-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="withdrawal-currency">Currency</Label>
                    <Select 
                      value={withdrawalData.currency} 
                      onValueChange={(value) => setWithdrawalData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="naira">NGN (Naira)</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="withdrawal-method">Withdrawal Method</Label>
                    <Select 
                      value={withdrawalData.withdrawalMethod} 
                      onValueChange={(value) => setWithdrawalData(prev => ({ ...prev, withdrawalMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleWithdrawal} 
                    disabled={createWithdrawal.isPending}
                    className="w-full"
                  >
                    {createWithdrawal.isPending ? 'Processing...' : 'Create Withdrawal'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Your latest wallet activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.transactions?.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              transactions?.transactions?.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'deposit' || transaction.type === 'roi' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'roi' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency.toUpperCase())}
                    </p>
                    <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 