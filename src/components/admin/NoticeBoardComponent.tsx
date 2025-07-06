'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface Notice {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateNoticeData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
}

export default function NoticeBoardComponent() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<CreateNoticeData>({
    title: '',
    message: '',
    type: 'info',
    isActive: true,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch notices
  const fetchNotices = async () => {
    try {
      const response = await api.get(endpoints.admin.notices, { params: { page: pagination.page, limit: pagination.limit } });
      const noticesData = response.data;
      setNotices(noticesData.notices || noticesData);
      setPagination(noticesData.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [pagination.page, pagination.limit]);

  // Create notice
  const createNotice = async () => {
    try {
      const response = await api.post(endpoints.admin.notices, formData);
      setNotices([response.data, ...notices]);
      setShowCreateDialog(false);
      setFormData({ title: '', message: '', type: 'info', isActive: true });
      toast.success('Notice created successfully');
    } catch (error) {
      toast.error('Failed to create notice');
    }
  };

  // Update notice
  const updateNotice = async () => {
    if (!selectedNotice) return;
    try {
      const response = await api.patch(`${endpoints.admin.notices}/${selectedNotice._id}`, formData);
      setNotices(notices.map(notice => notice._id === selectedNotice._id ? response.data : notice));
      setShowEditDialog(false);
      setSelectedNotice(null);
      setFormData({ title: '', message: '', type: 'info', isActive: true });
      toast.success('Notice updated successfully');
    } catch (error) {
      toast.error('Failed to update notice');
    }
  };

  // Delete notice
  const deleteNotice = async (id: string) => {
    try {
      await api.delete(`${endpoints.admin.notices}/${id}`);
      setNotices(notices.filter(notice => notice._id !== id));
      toast.success('Notice deleted successfully');
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  // Toggle notice status
  const toggleNoticeStatus = async (notice: Notice) => {
    try {
      const response = await api.patch(`${endpoints.admin.notices}/${notice._id}`, {
        isActive: !notice.isActive
      });
      setNotices(notices.map(n => n._id === notice._id ? response.data : n));
      toast.success(`Notice ${notice.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update notice status');
    }
  };

  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type,
      isActive: notice.isActive,
    });
    setShowEditDialog(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
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

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notice Board Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage platform announcements and notifications</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Notice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BellIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold">{notices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{notices.filter(n => n.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">○</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">{notices.filter(n => !n.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">ℹ</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Info Type</p>
                <p className="text-2xl font-bold">{notices.filter(n => n.type === 'info').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {notices.length === 0 ? (
            <div className="text-center py-8">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notices found. Create your first notice to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice._id}>
                    <TableCell>
                      <Badge className={getTypeColor(notice.type)}>
                        {getTypeIcon(notice.type)} {notice.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notice.message}</TableCell>
                    <TableCell>
                      <Switch
                        checked={notice.isActive}
                        onCheckedChange={() => toggleNoticeStatus(notice)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(notice)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this notice? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteNotice(notice._id)}
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
      {notices.length > 0 && (
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
              label="notices"
              emptyMessage="No notices found"
            />
          </CardContent>
        </Card>
      )}

      {/* Create Notice Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Create New Notice</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Create a new notice to display to all users on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notice title"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter notice message"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="h-10 px-6">
              Cancel
            </Button>
            <Button onClick={createNotice} disabled={!formData.title || !formData.message} className="h-10 px-6">
              Create Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Edit Notice</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Update the notice details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-medium">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notice title"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message" className="text-sm font-medium">Message</Label>
              <Textarea
                id="edit-message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter notice message"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-sm font-medium">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive" className="text-sm font-medium">Active</Label>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="h-10 px-6">
              Cancel
            </Button>
            <Button onClick={updateNotice} disabled={!formData.title || !formData.message} className="h-10 px-6">
              Update Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 