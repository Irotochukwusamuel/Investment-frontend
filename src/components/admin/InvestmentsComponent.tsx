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
import { ChartBarIcon, CurrencyDollarIcon, ClockIcon, UsersIcon, ArrowTrendingUpIcon, PauseIcon, PlayIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface Investment {
  _id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  planId: string;
  plan: {
    name: string;
    currency: 'naira' | 'usdt';
  };
  amount: number;
  currency: 'naira' | 'usdt';
  dailyRoi: number;
  totalRoi: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'paused';
  earnedAmount: number;
  expectedReturn: number;
  autoReinvest: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentStats {
  totalInvestments: number;
  totalAmount: number;
  totalEarnings: number;
  activeInvestments: number;
  completedInvestments: number;
  pendingInvestments: number;
}

export default function InvestmentsComponent() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    currency: 'all',
  });

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

  // Fetch investments and stats
  const fetchInvestments = async () => {
    try {
      const [investmentsResponse, statsResponse] = await Promise.all([
        api.get(endpoints.admin.investments, { params: { ...filters, page: pagination.page, limit: pagination.limit } }),
        api.get(`${endpoints.admin.investments}/stats`)
      ]);
      
      // Handle different possible response structures
      const investmentsData = investmentsResponse.data;
      setInvestments(Array.isArray(investmentsData) ? investmentsData : 
                    investmentsData?.investments || investmentsData?.data || []);
      setStats(statsResponse.data);
      setPagination(investmentsResponse.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch investment data:', error);
      toast.error('Failed to fetch investments');
      // Set empty arrays/objects on error to prevent undefined errors
      setInvestments([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [filters, pagination.page, pagination.limit]);

  // Update investment status
  const updateInvestmentStatus = async (investmentId: string, status: string) => {
    try {
      const response = await api.patch(`${endpoints.admin.investments}/${investmentId}`, {
        status
      });
      setInvestments(investments.map(inv => inv._id === investmentId ? response.data : inv));
      toast.success(`Investment ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update investment status');
    }
  };

  // Delete investment
  const deleteInvestment = async (id: string) => {
    try {
      await api.delete(`${endpoints.admin.investments}/${id}`);
      setInvestments(investments.filter(inv => inv._id !== id));
      toast.success('Investment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete investment');
    }
  };

  const handleViewDetails = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | undefined | null, currency: string) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₦0';
    }
    const symbol = currency === 'naira' ? '₦' : 'USDT';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getFilteredInvestments = () => {
    // Ensure investments is an array before filtering
    if (!Array.isArray(investments)) {
      return [];
    }
    
    return investments.filter(investment => {
      if (filters.status !== 'all' && investment.status !== filters.status) return false;
      if (filters.currency !== 'all' && investment.currency !== filters.currency) return false;
      return true;
    });
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

  // Ensure investments is initialized as an array
  const investmentsArray = Array.isArray(investments) ? investments : [];
  const filteredInvestments = getFilteredInvestments();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investments Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage all user investments</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold">{stats.totalInvestments || 0}</p>
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
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings, 'naira')}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{stats.activeInvestments || 0}</p>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
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

      {/* Investments Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>All Investments ({filteredInvestments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredInvestments.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No investments found matching the filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Daily ROI</TableHead>
                  <TableHead>Earned</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {investment.user
                            ? `${investment.user.firstName} ${investment.user.lastName}`
                            : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {investment.user ? investment.user.email : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {investment.plan ? investment.plan.name : 'Unknown Plan'}
                        </p>
                        <Badge variant="outline">
                          {investment.currency ? investment.currency.toUpperCase() : 'N/A'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(investment.amount, investment.currency)}
                    </TableCell>
                    <TableCell>{investment.dailyRoi || 0}%</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(investment.earnedAmount, investment.currency)}
                    </TableCell>
                    <TableCell>{formatDate(investment.startDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(investment.status || 'pending')}>
                        {investment.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(investment)}
                        >
                          View
                        </Button>
                        {investment.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvestmentStatus(investment._id, 'paused')}
                          >
                            <PauseIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {investment.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvestmentStatus(investment._id, 'active')}
                          >
                            <PlayIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {investment.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvestmentStatus(investment._id, 'active')}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <XMarkIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Investment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this investment? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteInvestment(investment._id)}
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
      {investmentsArray.length > 0 && (
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
              label="investments"
              emptyMessage="No investments found"
            />
          </CardContent>
        </Card>
      )}

      {/* Investment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Investment Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Detailed information about the investment.
            </DialogDescription>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">User</Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedInvestment.user
                      ? `${selectedInvestment.user.firstName} ${selectedInvestment.user.lastName}`
                      : 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedInvestment.user ? selectedInvestment.user.email : ''}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Plan</Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedInvestment.plan ? selectedInvestment.plan.name : 'Unknown Plan'}
                  </p>
                  <Badge variant="outline">
                    {selectedInvestment.currency ? selectedInvestment.currency.toUpperCase() : 'N/A'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Investment Amount</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedInvestment.amount, selectedInvestment.currency)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Daily ROI</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedInvestment.dailyRoi || 0}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Total ROI</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedInvestment.totalRoi || 0}%</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Duration</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedInvestment.duration || 0} days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Earned Amount</Label>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedInvestment.earnedAmount, selectedInvestment.currency)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Expected Return</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedInvestment.expectedReturn, selectedInvestment.currency)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedInvestment.startDate)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">End Date</Label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedInvestment.endDate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedInvestment.status || 'pending')}>
                    {selectedInvestment.status || 'pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Auto-reinvest</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedInvestment.autoReinvest ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-10 px-6">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 