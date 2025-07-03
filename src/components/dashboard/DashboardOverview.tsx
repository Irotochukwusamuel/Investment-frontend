'use client';

import { useUser } from '@/lib/hooks/useAuth';
import { useWalletBalance, useTransactionHistory } from '@/lib/hooks/useWallet';
import { useMyInvestments, useInvestmentStats } from '@/lib/hooks/useInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Coins
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function DashboardOverview() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance();
  const { data: investments, isLoading: investmentsLoading } = useMyInvestments();
  const { data: investmentStats, isLoading: statsLoading } = useInvestmentStats();
  const { data: transactionData, isLoading: transactionsLoading } = useTransactionHistory({
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const isLoading = userLoading || walletLoading || investmentsLoading || statsLoading || transactionsLoading;

  // Calculate derived values from real data
  const totalInvested = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const totalEarnings = investments?.reduce((sum, inv) => sum + inv.totalEarnings, 0) || 0;
  const activeInvestments = investments?.filter(inv => inv.status === 'active').length || 0;
  const recentTransactions = transactionData?.transactions || [];

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your investments today.
          </p>
        </div>
        <Badge variant={user?.emailVerified ? "default" : "destructive"}>
          {user?.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletBalance?.totalBalance?.naira || 0, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(walletBalance?.totalBalance?.usdt || 0, 'USDT')} USDT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalInvested, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeInvestments} active investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEarnings, 'NGN')}
            </div>
            <p className="text-xs text-muted-foreground">
              From {investments?.length || 0} investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInvested > 0 ? ((totalEarnings / totalInvested) * 100).toFixed(2) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Active Investments</CardTitle>
            <CardDescription>
              Your current investment portfolio performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments && investments.length > 0 ? (
                investments.slice(0, 3).map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{investment.plan?.name || 'Investment Plan'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(investment.amount, investment.currency?.toUpperCase() || 'NGN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +{formatCurrency(investment.totalEarnings, investment.currency?.toUpperCase() || 'NGN')}
                      </p>
                      <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active investments</p>
                  <Button className="mt-4">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start Investing
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {transaction.type === 'deposit' ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        ) : (
                          <Activity className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
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
                        {formatCurrency(transaction.amount, transaction.currency?.toUpperCase() || 'NGN')}
                      </p>
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' :
                        'destructive'
                      } className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent transactions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions you can take
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Wallet className="h-4 w-4 mr-2" />
              Deposit Funds
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              New Investment
            </Button>
            <Button variant="outline">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 