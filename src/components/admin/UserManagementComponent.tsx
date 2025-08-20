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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { UserIcon, ShieldCheckIcon, ShieldExclamationIcon, EnvelopeIcon, CalendarIcon, CurrencyDollarIcon, ChartBarIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, UserPlusIcon, Cog6ToothIcon, EyeIcon, PencilIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  totalInvestments?: number; // legacy
  totalEarnings?: number; // legacy
  walletBalance?: number; // legacy
  totalInvestmentAmount?: number; // sum of all investment amounts
  totalInvestmentCount?: number; // number of investments
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAdmins: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

interface UserAnalytics {
  userGrowth: { date: string; count: number }[];
  userActivity: { date: string; active: number; inactive: number }[];
  topReferrers: { user: string; referrals: number }[];
  userEngagement: { category: string; percentage: number }[];
}

export default function UserManagementComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    verification: 'all',
    search: '',
    dateRange: 'all',
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

  // Fetch users, stats, and analytics
  const fetchData = async () => {
    try {
      const [usersResponse, statsResponse, analyticsResponse] = await Promise.all([
        api.get(endpoints.admin.users, { params: { ...filters, page: pagination.page, limit: pagination.limit } }),
        api.get(`${endpoints.admin.users}/stats`),
        api.get(`${endpoints.admin.users}/analytics`)
      ]);
      
      setUsers(usersResponse.data.users || usersResponse.data);
      setStats(statsResponse.data);
      setAnalytics(analyticsResponse.data);
      setPagination(usersResponse.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page, pagination.limit]);

  // Update user status
  const updateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      const isActive = status === 'active';
      const response = await api.patch(`${endpoints.admin.users}/${userId}`, {
        isActive,
        statusReason: reason,
        statusUpdatedAt: new Date().toISOString()
      });
      setUsers(users.map(user => user._id === userId ? response.data : user));
      toast.success(`User ${status} successfully`);
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await api.patch(`${endpoints.admin.users}/${userId}`, {
        role,
        roleUpdatedAt: new Date().toISOString()
      });
      setUsers(users.map(user => user._id === userId ? response.data : user));
      toast.success(`User role updated to ${role} successfully`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  // Update user information
  const updateUserInfo = async (userId: string, updateData: any) => {
    try {
      const response = await api.patch(`${endpoints.admin.users}/${userId}`, updateData);
      setUsers(users.map(user => user._id === userId ? response.data : user));
      toast.success('User information updated successfully');
      setShowEditDialog(false);
    } catch (error) {
      toast.error('Failed to update user information');
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      await api.delete(`${endpoints.admin.users}/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Bulk operations
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      await api.post(`${endpoints.admin.users}/bulk-action`, {
        userIds: selectedUsers,
        action,
        reason: `Bulk ${action} by admin`
      });
      
      toast.success(`Bulk ${action} completed successfully`);
      setSelectedUsers([]);
      fetchData();
    } catch (error) {
      toast.error(`Failed to perform bulk ${action}`);
    }
  };

  // Export users
  const exportUsers = async (format: 'csv' | 'excel') => {
    try {
      const response = await api.get(`${endpoints.admin.users}/export`, {
        params: { format, filters },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Users exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export users');
    }
  };

  // Send notification to user
  const sendNotification = async (userId: string, message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    try {
      await api.post(`${endpoints.admin.users}/${userId}/notify`, {
        message,
        type,
        sentAt: new Date().toISOString()
      });
      toast.success('Notification sent successfully');
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  // Reset user password
  const resetUserPassword = async (userId: string) => {
    try {
      const response = await api.post(`${endpoints.admin.users}/${userId}/reset-password`);
      toast.success(`Password reset link sent to user email: ${response.data.tempPassword}`);
    } catch (error) {
      toast.error('Failed to reset user password');
    }
  };

  // Verify user email/phone
  const verifyUser = async (userId: string, type: 'email' | 'phone') => {
    try {
      await api.post(`${endpoints.admin.users}/${userId}/verify`, { type });
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, [`${type}Verified`]: true }
          : user
      ));
      toast.success(`User ${type} verified successfully`);
    } catch (error) {
      toast.error(`Failed to verify user ${type}`);
    }
  };

  // Cleanup orphaned data
  const cleanupOrphanedData = async () => {
    try {
      const response = await api.post(endpoints.admin.cleanupOrphanedData);
      toast.success(`Cleanup completed: ${response.data.deletedWallets} wallets, ${response.data.deletedInvestments} investments, ${response.data.deletedWithdrawals} withdrawals removed`);
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error('Cleanup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cleanup orphaned data';
      toast.error(errorMessage);
    }
  };

  // Process missing referral bonuses
  const processMissingReferralBonuses = async () => {
    try {
      const response = await api.post(endpoints.admin.processMissingReferralBonuses);
      toast.success(`Processed ${response.data.processedCount} missing referral bonuses totaling ${response.data.totalBonusAmount} ${response.data.currency}`);
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error('Process missing referral bonuses error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process missing referral bonuses';
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      if (filters.status !== 'all' && user.isActive !== (filters.status === 'active')) return false;
      if (filters.role !== 'all' && user.role !== filters.role) return false;
      if (filters.verification !== 'all') {
        if (filters.verification === 'verified' && (!user.emailVerified || !user.phoneVerified)) return false;
        if (filters.verification === 'unverified' && (user.emailVerified && user.phoneVerified)) return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          (user.firstName?.toLowerCase() ?? '').includes(searchTerm) ||
          (user.lastName?.toLowerCase() ?? '').includes(searchTerm) ||
          (user.email?.toLowerCase() ?? '').includes(searchTerm) ||
          (user.referralCode?.toLowerCase() ?? '').includes(searchTerm)
        );
      }
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

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage platform users and their accounts</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={cleanupOrphanedData} variant="outline" size="sm" className="text-orange-600 hover:text-orange-700">
            <TrashIcon className="h-4 w-4 mr-2" />
            Cleanup Orphaned Data
          </Button>
          <Button onClick={processMissingReferralBonuses} variant="outline" size="sm" className="text-yellow-600 hover:text-yellow-700">
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Process Missing Referrals
          </Button>
          <Button onClick={() => exportUsers('csv')} variant="outline" size="sm">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportUsers('excel')} variant="outline" size="sm">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold">{stats.inactiveUsers}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold">{stats.newUsersThisMonth}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Advanced Filters */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <span>Advanced Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or referral code..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification-filter">Verification</Label>
              <Select value={filters.verification} onValueChange={(value) => setFilters({ ...filters, verification: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedUsers.length} user(s) selected
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleBulkAction('activate')}
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Activate All
                </Button>
                <Button
                  onClick={() => handleBulkAction('deactivate')}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <NoSymbolIcon className="h-4 w-4 mr-2" />
                  Deactivate All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Investments</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={(checked) => handleSelectUser(user._id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">@{user.referralCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.isActive ? 'active' : 'inactive')}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Badge variant={user.emailVerified ? "default" : "secondary"} className="text-xs">
                            Email
                          </Badge>
                          {user.phone && (
                            <Badge variant={user.phoneVerified ? "default" : "secondary"} className="text-xs">
                              Phone
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{user.totalInvestmentCount ?? user.totalInvestments ?? 0}</p>
                          <p className="text-gray-500">{formatCurrency(user.totalInvestmentAmount ?? 0)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{formatCurrency(user.walletBalance ?? 0)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(user)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          {user.isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user._id, 'inactive')}
                              className="text-red-600 hover:text-red-700"
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user._id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Activate
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUser(user._id)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {users.length > 0 && (
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
              label="users"
              emptyMessage="No users found"
            />
          </CardContent>
        </Card>
      )}

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Comprehensive information about the selected user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-gray-700">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-700">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-gray-700">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Referral Code</Label>
                    <p className="text-sm text-gray-700">{selectedUser.referralCode}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedUser.isActive ? 'active' : 'inactive')}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Total Investments</Label>
                    <p className="text-2xl font-bold text-gray-900">{selectedUser.totalInvestments}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Total Earnings</Label>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedUser.totalEarnings)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Wallet Balance</Label>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedUser.walletBalance)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Total Referrals</Label>
                    <p className="text-2xl font-bold text-purple-600">{selectedUser.totalReferrals}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Joined Date</Label>
                    <p className="text-sm text-gray-700">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Last Login</Label>
                    <p className="text-sm text-gray-700">{selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Verified</Label>
                    <Badge variant={selectedUser.emailVerified ? "default" : "secondary"}>
                      {selectedUser.emailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone Verified</Label>
                    <Badge variant={selectedUser.phoneVerified ? "default" : "secondary"}>
                      {selectedUser.phoneVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => resetUserPassword(selectedUser._id)}
                    variant="outline"
                    className="w-full h-10"
                  >
                    Reset Password
                  </Button>
                  <Button
                    onClick={() => verifyUser(selectedUser._id, 'email')}
                    variant="outline"
                    className="w-full h-10"
                    disabled={selectedUser.emailVerified}
                  >
                    Verify Email
                  </Button>
                  <Button
                    onClick={() => verifyUser(selectedUser._id, 'phone')}
                    variant="outline"
                    className="w-full h-10"
                    disabled={selectedUser.phoneVerified}
                  >
                    Verify Phone
                  </Button>
                  <Button
                    onClick={() => sendNotification(selectedUser._id, 'Test notification', 'info')}
                    variant="outline"
                    className="w-full h-10"
                  >
                    Send Notification
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={selectedUser.lastName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as 'user' | 'admin' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedUser.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, isActive: value === 'active' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateUserInfo(selectedUser._id, selectedUser)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 