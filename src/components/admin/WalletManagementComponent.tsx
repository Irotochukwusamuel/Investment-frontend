'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/ui/pagination';
import { WalletIcon, PlusIcon, MinusIcon, ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, BanknotesIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface Wallet {
  _id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  nairaBalance: number;
  usdtBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  totalEarnings: number;
  totalBonuses: number;
  totalReferralEarnings: number;
  status: 'active' | 'suspended' | 'locked';
  createdAt: string;
  updatedAt: string;
}

interface WalletStats {
  totalWallets: number;
  totalBalance: {
    naira: number;
    usdt: number;
  };
  totalDeposits: number;
  totalWithdrawals: number;
  activeWallets: number;
  suspendedWallets: number;
}

export default function WalletManagementComponent() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    type: 'deposit' as 'deposit' | 'withdrawal',
    currency: 'naira' as 'naira' | 'usdt',
    amount: '',
    reason: '',
  });

  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ ...prev, limit: itemsPerPage, page: 1 }));
  };

  // Search handlers
  const handleSearch = async (email: string) => {
    setSearchLoading(true);
    setSearchEmail(email);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
    setSearchLoading(false);
  };

  const clearSearch = () => {
    setSearchEmail('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Fetch wallets and stats
  const fetchWallets = async () => {
    try {
      const params: any = { page: pagination.page, limit: pagination.limit };
      if (searchEmail.trim()) {
        params.email = searchEmail.trim();
      }

      const [walletsResponse, statsResponse] = await Promise.all([
        api.get(endpoints.admin.wallet, { params }),
        api.get(`${endpoints.admin.wallet}/stats`)
      ]);
      
      // Handle different possible response structures
      const walletsData = walletsResponse.data;
      setWallets(Array.isArray(walletsData) ? walletsData : 
                walletsData?.wallets || walletsData?.data || []);
      setStats(statsResponse.data);
      setPagination(walletsResponse.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      toast.error('Failed to fetch wallet data');
      // Set empty arrays/objects on error to prevent undefined errors
      setWallets([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [pagination.page, pagination.limit, searchEmail]);

  // Adjust wallet balance
  const adjustWalletBalance = async () => {
    if (!selectedWallet || !adjustForm.amount) return;
    
    try {
      const amount = parseFloat(adjustForm.amount);
      const endpoint = adjustForm.type === 'deposit' 
        ? `${endpoints.admin.wallet}/${selectedWallet._id}/deposit`
        : `${endpoints.admin.wallet}/${selectedWallet._id}/withdraw`;
      
      await api.post(endpoint, {
        amount,
        currency: adjustForm.currency,
        reason: adjustForm.reason,
      });
      
      setShowAdjustDialog(false);
      setSelectedWallet(null);
      setAdjustForm({ type: 'deposit', currency: 'naira', amount: '', reason: '' });
      fetchWallets(); // Refresh data
      toast.success(`Wallet ${adjustForm.type} successful`);
    } catch (error) {
      toast.error(`Failed to ${adjustForm.type} from wallet`);
    }
  };

  // Toggle wallet status
  const toggleWalletStatus = async (wallet: Wallet) => {
    const newStatus = wallet.status === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`${endpoints.admin.wallet}/${wallet._id}`, {
        status: newStatus
      });
      setWallets(wallets.map(w => w._id === wallet._id ? { ...w, status: newStatus } : w));
      toast.success(`Wallet ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update wallet status');
    }
  };

  const handleAdjustBalance = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowAdjustDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'naira' ? '₦' : 'USDT';
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Ensure wallets is initialized as an array
  const walletsArray = Array.isArray(wallets) ? wallets : [];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage user wallets and transactions</p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Search Users</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchEmail);
                  }
                }}
                className="pl-10 pr-10"
                disabled={searchLoading}
              />
              {searchEmail && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              onClick={() => handleSearch(searchEmail)}
              disabled={searchLoading || !searchEmail.trim()}
              className="min-w-[100px]"
            >
              {searchLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
            {searchEmail && (
              <Button
                variant="outline"
                onClick={clearSearch}
                className="min-w-[80px]"
              >
                Clear
              </Button>
            )}
          </div>
          {searchEmail && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MagnifyingGlassIcon className="h-4 w-4" />
              Searching for: <span className="font-medium">"{searchEmail}"</span>
              {pagination.total > 0 && (
                <span className="text-green-600 dark:text-green-400">
                  ({pagination.total} result{pagination.total !== 1 ? 's' : ''} found)
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <WalletIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Wallets</p>
                  <p className="text-2xl font-bold">{stats.totalWallets}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Balance</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.totalBalance.naira, 'naira')}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(stats.totalBalance.usdt, 'usdt')}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowUpIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalDeposits, 'naira')}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowDownIcon className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalWithdrawals, 'naira')}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Wallets Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>All Wallets</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {walletsArray.length === 0 ? (
            <div className="text-center py-8">
              {searchEmail ? (
                <>
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No wallets found for "{searchEmail}".</p>
                  <p className="text-sm text-gray-400 mt-2">Try searching with a different email address.</p>
                </>
              ) : (
                <>
                  <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No wallets found.</p>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Naira Balance</TableHead>
                  <TableHead>USDT Balance</TableHead>
                  <TableHead>Total Deposits</TableHead>
                  <TableHead>Total Withdrawals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletsArray.map((wallet) => (
                  <TableRow key={wallet._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {wallet.user
                            ? `${wallet.user.firstName} ${wallet.user.lastName}`
                            : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {wallet.user ? wallet.user.email : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(wallet.nairaBalance, 'naira')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(wallet.usdtBalance, 'usdt')}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(wallet.totalDeposits, 'naira')}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(wallet.totalWithdrawals, 'naira')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(wallet.status)}>
                        {wallet.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdjustBalance(wallet)}
                        >
                          {adjustForm.type === 'deposit' ? (
                            <PlusIcon className="h-4 w-4" />
                          ) : (
                            <MinusIcon className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWalletStatus(wallet)}
                        >
                          {wallet.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {walletsArray.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[10, 20, 50, 100]}
              showItemsPerPage={true}
              showPageInfo={true}
              label="wallets"
            />
          </CardContent>
        </Card>
      )}

      {/* Adjust Balance Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>
              {selectedWallet && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    User: {selectedWallet.user
                      ? `${selectedWallet.user.firstName} ${selectedWallet.user.lastName}`
                      : 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Balance: {formatCurrency(selectedWallet.nairaBalance, 'naira')} / {formatCurrency(selectedWallet.usdtBalance, 'usdt')}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={adjustForm.type} onValueChange={(value: any) => setAdjustForm({ ...adjustForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={adjustForm.currency} onValueChange={(value: any) => setAdjustForm({ ...adjustForm, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="naira">Naira (₦)</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={adjustForm.amount}
                onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                placeholder="Enter reason for adjustment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={adjustWalletBalance} 
              disabled={!adjustForm.amount}
              className={adjustForm.type === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {adjustForm.type === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 