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
import { Pagination } from '@/components/ui/pagination';
import { ArrowTrendingUpIcon, ChartBarIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface ROISetting {
  _id: string;
  planId: string;
  planName: string;
  dailyRoi: number;
  totalRoi: number;
  duration: number;
  currency: 'naira' | 'usdt';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ROIStats {
  totalActiveInvestments: number;
  totalDailyROI: number;
  totalEarnings: number;
  averageDailyROI: number;
}

export default function ROIManagementComponent() {
  const [roiSettings, setRoiSettings] = useState<ROISetting[]>([]);
  const [stats, setStats] = useState<ROIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<ROISetting | null>(null);
  const [editForm, setEditForm] = useState({
    dailyRoi: '',
    totalRoi: '',
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch ROI settings and stats
  const fetchROISettings = async () => {
    try {
      const [settingsResponse, statsResponse] = await Promise.all([
        api.get(endpoints.admin.roiSettings, { params: { page: pagination.page, limit: pagination.limit } }),
        api.get(endpoints.admin.roiStats)
      ]);
      const settingsData = settingsResponse.data;
      setRoiSettings(settingsData.roiSettings || settingsData);
      setStats(statsResponse.data);
      setPagination(settingsData.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch ROI settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchROISettings();
  }, [pagination.page, pagination.limit]);

  // Update ROI setting
  const updateROISetting = async () => {
    if (!selectedSetting) return;
    
    try {
      const response = await api.patch(`${endpoints.admin.plans}/roi-settings/${selectedSetting._id}`, {
        dailyRoi: parseFloat(editForm.dailyRoi),
        totalRoi: parseFloat(editForm.totalRoi),
        isActive: editForm.isActive,
      });
      
      setRoiSettings(roiSettings.map(setting => 
        setting._id === selectedSetting._id ? response.data : setting
      ));
      setShowEditDialog(false);
      setSelectedSetting(null);
      setEditForm({ dailyRoi: '', totalRoi: '', isActive: true });
      toast.success('ROI setting updated successfully');
    } catch (error) {
      toast.error('Failed to update ROI setting');
    }
  };

  const handleEdit = (setting: ROISetting) => {
    setSelectedSetting(setting);
    setEditForm({
      dailyRoi: setting.dailyRoi.toString(),
      totalRoi: setting.totalRoi.toString(),
      isActive: setting.isActive,
    });
    setShowEditDialog(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'naira' ? '₦' : 'USDT';
    return `${symbol}${amount.toLocaleString()}`;
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

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ROI Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage Return on Investment rates and settings</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold">{stats.totalActiveInvestments}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Daily ROI</p>
                  <p className="text-2xl font-bold">{stats.totalDailyROI.toFixed(2)}%</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
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
                  <p className="text-sm font-medium text-gray-600">Avg Daily ROI</p>
                  <p className="text-2xl font-bold">{stats.averageDailyROI.toFixed(2)}%</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* ROI Settings Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>ROI Settings by Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {roiSettings.length === 0 ? (
            <div className="text-center py-8">
              <ArrowTrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ROI settings found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Daily ROI</TableHead>
                  <TableHead>Total ROI</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roiSettings.map((setting) => (
                  <TableRow key={setting._id}>
                    <TableCell className="font-medium">{setting.planName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{setting.currency.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{setting.dailyRoi}%</TableCell>
                    <TableCell className="font-medium">{setting.totalRoi}%</TableCell>
                    <TableCell>{setting.duration} days</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(setting.isActive)}>
                        {setting.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {roiSettings.length > 0 && (
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
              label="ROI settings"
              emptyMessage="No ROI settings found"
            />
          </CardContent>
        </Card>
      )}

      {/* Edit ROI Setting Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Edit ROI Setting</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {selectedSetting && (
                <div className="space-y-1">
                  <p className="text-sm">
                    Plan: <span className="font-medium">{selectedSetting.planName}</span>
                  </p>
                  <p className="text-sm">
                    Currency: <span className="font-medium">{selectedSetting.currency.toUpperCase()}</span>
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="dailyRoi" className="text-sm font-medium">Daily ROI (%)</Label>
              <Input
                id="dailyRoi"
                type="number"
                step="0.01"
                value={editForm.dailyRoi}
                onChange={(e) => setEditForm({ ...editForm, dailyRoi: e.target.value })}
                placeholder="Enter daily ROI percentage"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalRoi" className="text-sm font-medium">Total ROI (%)</Label>
              <Input
                id="totalRoi"
                type="number"
                step="0.01"
                value={editForm.totalRoi}
                onChange={(e) => setEditForm({ ...editForm, totalRoi: e.target.value })}
                placeholder="Enter total ROI percentage"
                className="h-10"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="h-10 px-6">
              Cancel
            </Button>
            <Button 
              onClick={updateROISetting} 
              disabled={!editForm.dailyRoi || !editForm.totalRoi}
              className="h-10 px-6"
            >
              Update Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 