'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/ui/pagination';
import { ArrowDownTrayIcon, CurrencyDollarIcon, ClockIcon, CheckIcon, XMarkIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface Withdrawal {
  _id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  currency: 'naira' | 'usdt';
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  withdrawalMethod: 'bank_transfer' | 'crypto';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    sortCode: string;
  };
  cryptoDetails?: {
    walletAddress: string;
    network: string;
  };
  reference: string;
  externalReference?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

interface WithdrawalStats {
  totalWithdrawals: number;
  totalAmount: number;
  totalFees: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  failedWithdrawals: number;
}

interface WithdrawalSettings {
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalFee: number;
  processingTime: number;
}

export default function WithdrawalsComponent() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [settings, setSettings] = useState<WithdrawalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    currency: 'all',
  });
  const [settingsForm, setSettingsForm] = useState({
    minWithdrawalAmount: 0,
    maxWithdrawalAmount: 0,
    withdrawalFee: 0,
    processingTime: 24,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch withdrawals, stats, and settings
  const fetchData = async () => {
    try {
      const [withdrawalsResponse, statsResponse, settingsResponse] = await Promise.all([
        api.get(endpoints.admin.withdrawals, { params: { ...filters, page: pagination.page, limit: pagination.limit } }),
        api.get(`${endpoints.admin.withdrawals}/stats`),
        api.get(`${endpoints.admin.withdrawals}/settings`)
      ]);
      
      // Handle different possible response structures
      const withdrawalsData = withdrawalsResponse.data;
      setWithdrawals(Array.isArray(withdrawalsData) ? withdrawalsData : 
                    withdrawalsData?.withdrawals || withdrawalsData?.data || []);
      
      setStats(statsResponse.data);
      setSettings(settingsResponse.data);
      setPagination(withdrawalsResponse.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch withdrawal data:', error);
      toast.error('Failed to fetch withdrawal data');
      // Set empty arrays/objects on error to prevent undefined errors
      setWithdrawals([]);
      setStats(null);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page, pagination.limit]);

  // Update withdrawal status
  const updateWithdrawalStatus = async (withdrawalId: string, status: string, notes?: string) => {
    try {
      const response = await api.patch(`${endpoints.admin.withdrawals}/${withdrawalId}`, {
        status,
        notes: notes ? [notes] : undefined
      });
      setWithdrawals(withdrawals.map(w => w._id === withdrawalId ? response.data : w));
      toast.success(`Withdrawal ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update withdrawal status');
    }
  };

  // Update withdrawal settings
  const updateSettings = async () => {
    try {
      await api.patch(`${endpoints.admin.withdrawals}/settings`, settingsForm);
      setSettings(settingsForm);
      setShowSettingsDialog(false);
      toast.success('Withdrawal settings updated successfully');
    } catch (error) {
      toast.error('Failed to update withdrawal settings');
    }
  };

  // Delete withdrawal
  const deleteWithdrawal = async (id: string) => {
    try {
      await api.delete(`${endpoints.admin.withdrawals}/${id}`);
      setWithdrawals(withdrawals.filter(w => w._id !== id));
      toast.success('Withdrawal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete withdrawal');
    }
  };

  // Trigger payout for pending withdrawal
  const triggerPayout = async (withdrawalId: string) => {
    try {
      await api.post(`/withdrawals/admin/${withdrawalId}/trigger-payout`);
      toast.success('Payout triggered successfully');
      // Refresh the data to get updated status
      fetchData();
    } catch (error) {
      toast.error('Failed to trigger payout');
    }
  };

  const handleViewDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsDialog(true);
  };

  const handleEditSettings = () => {
    if (settings) {
      setSettingsForm({
        minWithdrawalAmount: settings.minWithdrawalAmount,
        maxWithdrawalAmount: settings.maxWithdrawalAmount,
        withdrawalFee: settings.withdrawalFee,
        processingTime: settings.processingTime,
      });
    }
    setShowSettingsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'naira' ? '₦' : 'USDT';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilteredWithdrawals = () => {
    // Ensure withdrawals is an array before filtering
    if (!Array.isArray(withdrawals)) {
      return [];
    }
    
    return withdrawals.filter(withdrawal => {
      if (filters.status !== 'all' && withdrawal.status !== filters.status) return false;
      if (filters.currency !== 'all' && withdrawal.currency !== filters.currency) return false;
      return true;
    });
  };

  // Add this handler for individual row selection
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Add this handler for select all (filtered)
  const handleSelectAllFiltered = () => {
    const filteredIds = getFilteredWithdrawals()
      .filter((w) => w.status === 'pending' || w.status === 'processing')
      .map((w) => w._id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !filteredIds.includes(id)) : Array.from(new Set([...selectedIds, ...filteredIds])));
  };

  // After bulk payout, clear selection
  const handleBulkPayout = async () => {
    setIsBulkLoading(true);
    try {
      const res = await api.post(endpoints.admin.bulkTriggerPayout, { withdrawalIds: selectedIds });
      toast.success(`Processed: ${res.data.processed.length}, Failed: ${res.data.failed.length}`);
      setSelectedIds([]); // Clear selection
      fetchData();
    } catch (err) {
      toast.error('Bulk payout failed');
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ ...prev, limit: itemsPerPage, page: 1 }));
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

  // Ensure withdrawals is initialized as an array
  const withdrawalsArray = Array.isArray(withdrawals) ? withdrawals : [];
  const filteredWithdrawals = getFilteredWithdrawals();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawals Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage withdrawal requests and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleEditSettings}
            variant="outline"
            className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
          >
            Settings
          </Button>
          <Button
            onClick={handleBulkPayout}
            disabled={isBulkLoading || selectedIds.length === 0}
            className="ml-2"
          >
            {isBulkLoading ? 'Processing...' : `Bulk Payout${selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}`}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowDownTrayIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                  <p className="text-2xl font-bold">{stats.totalWithdrawals}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount, 'naira')}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingWithdrawals}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedWithdrawals}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency-filter">Currency</Label>
              <Select value={filters.currency} onValueChange={(value) => setFilters({ ...filters, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="naira">Naira (₦)</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>All Withdrawals ({filteredWithdrawals.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredWithdrawals.length === 0 ? (
            <div className="text-center py-8">
              <ArrowDownTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No withdrawals found matching the filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={filteredWithdrawals.length > 0 && filteredWithdrawals.filter(w => w.status === 'pending' || w.status === 'processing').every(w => selectedIds.includes(w._id))}
                      onChange={handleSelectAllFiltered}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(withdrawal._id)}
                        disabled={!(withdrawal.status === 'pending' || withdrawal.status === 'processing')}
                        onChange={() => handleSelectRow(withdrawal._id)}
                        aria-label="Select withdrawal"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {withdrawal.user
                            ? `${withdrawal.user.firstName} ${withdrawal.user.lastName}`
                            : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {withdrawal.user ? withdrawal.user.email : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(withdrawal.amount, withdrawal.currency)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(withdrawal.fee, withdrawal.currency)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(withdrawal.netAmount, withdrawal.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {withdrawal.withdrawalMethod === 'bank_transfer' ? 'Bank Transfer' : 'Crypto'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(withdrawal)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        {withdrawal.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => triggerPayout(withdrawal._id)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              Trigger Payout
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateWithdrawalStatus(withdrawal._id, 'processing')}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Process
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateWithdrawalStatus(withdrawal._id, 'completed')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {withdrawal.status === 'processing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal._id, 'completed')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {(withdrawal.status === 'pending' || withdrawal.status === 'processing') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal._id, 'failed')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Withdrawal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this withdrawal? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteWithdrawal(withdrawal._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
      <Card className="mb-6">
        <CardContent className="p-0">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[5, 10, 20, 50, 100]}
            showItemsPerPage={true}
            showPageInfo={true}
            label="withdrawals"
            emptyMessage="No withdrawals found"
          />
        </CardContent>
      </Card>

      {/* Withdrawal Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Withdrawal Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Detailed information about the withdrawal request.
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">User</Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedWithdrawal.user
                      ? `${selectedWithdrawal.user.firstName} ${selectedWithdrawal.user.lastName}`
                      : 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedWithdrawal.user ? selectedWithdrawal.user.email : ''}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Reference</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedWithdrawal.reference}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedWithdrawal.amount, selectedWithdrawal.currency)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Fee</Label>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(selectedWithdrawal.fee, selectedWithdrawal.currency)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Net Amount</Label>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedWithdrawal.netAmount, selectedWithdrawal.currency)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Method</Label>
                  <Badge variant="outline">
                    {selectedWithdrawal.withdrawalMethod === 'bank_transfer' ? 'Bank Transfer' : 'Crypto'}
                  </Badge>
                </div>
              </div>
              {selectedWithdrawal.bankDetails && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-600">Bank Details</Label>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-sm"><span className="font-medium">Bank:</span> {selectedWithdrawal.bankDetails.bankName}</p>
                    <p className="text-sm"><span className="font-medium">Account:</span> {selectedWithdrawal.bankDetails.accountNumber}</p>
                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedWithdrawal.bankDetails.accountName}</p>
                  </div>
                </div>
              )}
              {selectedWithdrawal.cryptoDetails && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-600">Crypto Details</Label>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-sm"><span className="font-medium">Address:</span> {selectedWithdrawal.cryptoDetails.walletAddress}</p>
                    <p className="text-sm"><span className="font-medium">Network:</span> {selectedWithdrawal.cryptoDetails.network}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedWithdrawal.status)}>
                    {selectedWithdrawal.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedWithdrawal.createdAt)}</p>
                </div>
              </div>
              {selectedWithdrawal.notes && selectedWithdrawal.notes.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <div className="space-y-2">
                    {selectedWithdrawal.notes.map((note, index) => (
                      <p key={index} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{note}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-10 px-6">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Withdrawal Settings</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Configure withdrawal limits and fees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minAmount" className="text-sm font-medium">Minimum Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={settingsForm.minWithdrawalAmount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minWithdrawalAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter minimum amount"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount" className="text-sm font-medium">Maximum Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={settingsForm.maxWithdrawalAmount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxWithdrawalAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter maximum amount"
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fee" className="text-sm font-medium">Withdrawal Fee (%)</Label>
                <Input
                  id="fee"
                  type="number"
                  step="0.01"
                  value={settingsForm.withdrawalFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, withdrawalFee: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter fee percentage"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingTime" className="text-sm font-medium">Processing Time (hours)</Label>
                <Input
                  id="processingTime"
                  type="number"
                  value={settingsForm.processingTime}
                  onChange={(e) => setSettingsForm({ ...settingsForm, processingTime: parseInt(e.target.value) || 0 })}
                  placeholder="Enter processing time"
                  className="h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)} className="h-10 px-6">
              Cancel
            </Button>
            <Button onClick={updateSettings} className="h-10 px-6">
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 