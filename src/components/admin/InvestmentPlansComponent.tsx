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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Pagination } from '@/components/ui/pagination';
import { ChartBarIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon, ArrowTrendingUpIcon, Cog6ToothIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, DocumentDuplicateIcon, ArchiveBoxIcon, ChartPieIcon, DocumentTextIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface InvestmentPlan {
  _id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyRoi: number;
  totalRoi: number;
  duration: number;
  currency: 'naira' | 'usdt';
  status: 'active' | 'inactive' | 'archived';
  priority: number;
  features: string[];
  terms: string[];
  featured: boolean;
  popularity: number;
  totalInvestments: number;
  totalAmount: number;
  totalEarnings: number;
  activeInvestments: number;
  completionRate: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface PlanStats {
  totalPlans: number;
  activePlans: number;
  totalInvestments: number;
  totalAmount: number;
  totalEarnings: number;
  averageRoi: number;
  popularPlans: number;
  recommendedPlans: number;
}

interface PlanAnalytics {
  planPerformance: { planId: string; planName: string; performance: number }[];
  investmentTrends: { date: string; amount: number; count: number }[];
  roiComparison: { planId: string; planName: string; dailyRoi: number; totalRoi: number }[];
  userPreferences: { currency: string; percentage: number }[];
}

export default function InvestmentPlansComponent() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [stats, setStats] = useState<PlanStats | null>(null);
  const [analytics, setAnalytics] = useState<PlanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    currency: 'all',
    search: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minAmount: 0,
    maxAmount: 0,
    dailyRoi: 0,
    totalRoi: 0,
    duration: 0,
    currency: 'naira' as 'naira' | 'usdt',
    status: 'active' as 'active' | 'inactive' | 'archived',
    priority: 1,
    features: [] as string[],
    terms: [] as string[],
    featured: false,
    popularity: 0,
  });

  // Plan templates
  const planTemplates = [
    {
      name: 'Starter Plan',
      description: 'Perfect for beginners with low risk and steady returns',
      minAmount: 10000,
      maxAmount: 100000,
      dailyRoi: 0.5,
      totalRoi: 15,
      duration: 30,
      features: ['Low risk', 'Steady returns', 'Daily payouts', '24/7 support'],
      terms: ['Minimum investment: ₦10,000', 'Maximum investment: ₦100,000', '30-day duration']
    },
    {
      name: 'Premium Plan',
      description: 'High returns for experienced investors',
      minAmount: 100000,
      maxAmount: 1000000,
      dailyRoi: 1.2,
      totalRoi: 36,
      duration: 30,
      features: ['High returns', 'Priority support', 'Bonus rewards', 'Referral bonuses'],
      terms: ['Minimum investment: ₦100,000', 'Maximum investment: ₦1,000,000', '30-day duration']
    },
    {
      name: 'VIP Plan',
      description: 'Exclusive plan for VIP investors with maximum returns',
      minAmount: 1000000,
      maxAmount: 10000000,
      dailyRoi: 2.0,
      totalRoi: 60,
      duration: 30,
      features: ['Maximum returns', 'VIP support', 'Exclusive bonuses', 'Personal manager'],
      terms: ['Minimum investment: ₦1,000,000', 'Maximum investment: ₦10,000,000', '30-day duration']
    }
  ];

  // Fetch plans, stats, and analytics
  const fetchData = async () => {
    try {
      const [plansResponse, statsResponse, analyticsResponse] = await Promise.all([
        api.get(endpoints.admin.plans, { params: { ...filters, page: pagination.page, limit: pagination.limit } }),
        api.get(`${endpoints.admin.plans}/stats`),
        api.get(`${endpoints.admin.plans}/analytics`)
      ]);
      
      // Handle the response structure from backend
      const plansData = plansResponse.data;
      setPlans(plansData.plans || plansData);
      setStats(statsResponse.data);
      setAnalytics(analyticsResponse.data);
      setPagination(plansData.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (error) {
      toast.error('Failed to fetch plan data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page, pagination.limit]);

  // Create plan
  const createPlan = async () => {
    try {
      // Validate form data
      const validationErrors = validateFormData(formData);
      if (validationErrors.length > 0) {
        toast.error(`Validation errors: ${validationErrors.join(', ')}`);
        return;
      }

      // Prepare data for API
      const planData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        minAmount: Number(formData.minAmount),
        maxAmount: Number(formData.maxAmount),
        dailyRoi: Number(formData.dailyRoi),
        totalRoi: Number(formData.totalRoi),
        duration: Number(formData.duration),
        priority: Number(formData.priority),
        features: formData.features || [],
        featured: formData.featured,
        popularity: Number(formData.popularity),
      };

      const response = await api.post(endpoints.admin.plans, planData);
      
      if (response.data) {
        setPlans([...plans, response.data]);
        toast.success('Investment plan created successfully');
        setShowCreateDialog(false);
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      console.error('Create plan error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create investment plan';
      toast.error(errorMessage);
    }
  };

  // Update plan
  const updatePlan = async () => {
    if (!selectedPlan) return;
    
    try {
      // Validate form data
      const validationErrors = validateFormData(formData);
      if (validationErrors.length > 0) {
        toast.error(`Validation errors: ${validationErrors.join(', ')}`);
        return;
      }

      // Prepare data for API
      const planData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        minAmount: Number(formData.minAmount),
        maxAmount: Number(formData.maxAmount),
        dailyRoi: Number(formData.dailyRoi),
        totalRoi: Number(formData.totalRoi),
        duration: Number(formData.duration),
        priority: Number(formData.priority),
        features: formData.features || [],
        featured: formData.featured,
        popularity: Number(formData.popularity),
      };

      const response = await api.patch(`${endpoints.admin.plans}/${selectedPlan._id}`, planData);
      
      if (response.data) {
        setPlans(plans.map(plan => plan._id === selectedPlan._id ? response.data : plan));
        toast.success('Investment plan updated successfully');
        setShowEditDialog(false);
        resetForm();
        fetchData();
      }
    } catch (error: any) {
      console.error('Update plan error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update investment plan';
      toast.error(errorMessage);
    }
  };

  // Delete plan
  const deletePlan = async (id: string) => {
    try {
      const response = await api.delete(`${endpoints.admin.plans}/${id}`);
      
      if (response.status === 204 || response.status === 200) {
        setPlans(plans.filter(plan => plan._id !== id));
        toast.success('Investment plan deleted successfully');
        fetchData();
      }
    } catch (error: any) {
      console.error('Delete plan error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete investment plan';
      toast.error(errorMessage);
    }
  };

  // Duplicate plan
  const duplicatePlan = async (plan: InvestmentPlan) => {
    try {
      // Remove fields that shouldn't be duplicated
      const { _id, createdAt, updatedAt, totalInvestments, totalAmount, totalEarnings, activeInvestments, completionRate, averageRating, ...duplicatedPlan } = plan;
      
      const planData = {
        ...duplicatedPlan,
        name: `${plan.name} (Copy)`,
        status: 'inactive' as const,
        featured: false,
        popularity: 0,
        // Ensure numeric fields are properly typed
        minAmount: Number(duplicatedPlan.minAmount),
        maxAmount: Number(duplicatedPlan.maxAmount),
        dailyRoi: Number(duplicatedPlan.dailyRoi),
        totalRoi: Number(duplicatedPlan.totalRoi),
        duration: Number(duplicatedPlan.duration),
        priority: Number(duplicatedPlan.priority || 1),
        features: duplicatedPlan.features || [],
      };

      const response = await api.post(endpoints.admin.plans, planData);
      
      if (response.data) {
        setPlans([...plans, response.data]);
        toast.success('Investment plan duplicated successfully');
        fetchData();
      }
    } catch (error: any) {
      console.error('Duplicate plan error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to duplicate investment plan';
      toast.error(errorMessage);
    }
  };

  // Archive/Unarchive plan
  const toggleArchive = async (plan: InvestmentPlan) => {
    const newStatus = plan.status === 'archived' ? 'inactive' : 'archived';
    try {
      const response = await api.patch(`${endpoints.admin.plans}/${plan._id}`, { status: newStatus });
      
      if (response.data) {
        setPlans(plans.map(p => p._id === plan._id ? response.data : p));
        toast.success(`Plan ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully`);
        fetchData();
      }
    } catch (error: any) {
      console.error('Toggle archive error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update plan status';
      toast.error(errorMessage);
    }
  };

  // Use template
  const useTemplate = (template: any) => {
    setFormData({
      name: template.name,
      description: template.description,
      minAmount: template.minAmount,
      maxAmount: template.maxAmount,
      dailyRoi: template.dailyRoi,
      totalRoi: template.totalRoi,
      duration: template.duration,
      currency: 'naira',
      status: 'inactive',
      priority: 1,
      features: template.features || [],
      terms: template.terms || [],
      featured: false,
      popularity: 0,
    });
    setShowTemplatesDialog(false);
    setShowCreateDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minAmount: 0,
      maxAmount: 0,
      dailyRoi: 0,
      totalRoi: 0,
      duration: 0,
      currency: 'naira',
      status: 'active',
      priority: 1,
      features: [],
      terms: [],
      featured: false,
      popularity: 0,
    });
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    // Convert numeric fields to proper types
    if (['minAmount', 'maxAmount', 'dailyRoi', 'totalRoi', 'duration', 'priority', 'popularity'].includes(field)) {
      const numValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(numValue)) return; // Don't update if invalid number
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add feature/term
  const addFeature = () => {
    const feature = prompt('Enter feature:');
    if (feature && feature.trim()) {
      setFormData(prev => ({ ...prev, features: [...(prev.features || []), feature.trim()] }));
    }
  };

  const addTerm = () => {
    const term = prompt('Enter term:');
    if (term && term.trim()) {
      setFormData(prev => ({ ...prev, terms: [...(prev.terms || []), term.trim()] }));
    }
  };

  // Remove feature/term
  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
  };

  const removeTerm = (index: number) => {
    setFormData(prev => ({ ...prev, terms: (prev.terms || []).filter((_, i) => i !== index) }));
  };

  // Validate form data
  const validateFormData = (data: any) => {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim() === '') {
      errors.push('Plan name is required');
    }
    
    if (!data.description || data.description.trim() === '') {
      errors.push('Description is required');
    }
    
    if (data.minAmount <= 0) {
      errors.push('Minimum amount must be greater than 0');
    }
    
    if (data.maxAmount <= 0) {
      errors.push('Maximum amount must be greater than 0');
    }
    
    if (data.maxAmount <= data.minAmount) {
      errors.push('Maximum amount must be greater than minimum amount');
    }
    
    if (data.dailyRoi <= 0) {
      errors.push('Daily ROI must be greater than 0');
    }
    
    if (data.totalRoi <= 0) {
      errors.push('Total ROI must be greater than 0');
    }
    
    if (data.duration <= 0) {
      errors.push('Duration must be greater than 0');
    }
    
    if (data.priority <= 0) {
      errors.push('Priority must be greater than 0');
    }
    
    if (data.popularity < 0 || data.popularity > 100) {
      errors.push('Popularity must be between 0 and 100');
    }
    
    return errors;
  };

  const handleCreatePlan = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const handleEditPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      minAmount: plan.minAmount,
      maxAmount: plan.maxAmount,
      dailyRoi: plan.dailyRoi,
      totalRoi: plan.totalRoi,
      duration: plan.duration,
      currency: plan.currency,
      status: plan.status,
      priority: plan.priority,
      features: plan.features || [],
      terms: plan.terms || [],
      featured: plan.featured,
      popularity: plan.popularity,
    });
    setShowEditDialog(true);
  };

  const handleViewDetails = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrencyColor = (currency: string) => {
    return currency === 'naira' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency === 'naira' ? 'NGN' : 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilteredPlans = () => {
    return plans.filter(plan => {
      if (filters.status !== 'all' && plan.status !== filters.status) return false;
      if (filters.currency !== 'all' && plan.currency !== filters.currency) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          plan.name.toLowerCase().includes(searchTerm) ||
          plan.description.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
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

  const filteredPlans = getFilteredPlans();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Plans Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage investment plans for users</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowTemplatesDialog(true)} variant="outline">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleCreatePlan}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold">{stats.totalPlans}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold">{stats.activePlans}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold">{stats.totalInvestments}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="mb-6">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg ROI</p>
                  <p className="text-2xl font-bold">{stats.averageRoi}%</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <ChartBarIcon className="h-5 w-5" />
              <span>Plan Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Top Performing Plans</h4>
                <div className="space-y-3">
                  {analytics.planPerformance.slice(0, 5).map((plan, index) => (
                    <div key={plan.planId} className="flex items-center justify-between">
                      <span className="text-sm">{plan.planName}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={plan.performance} className="w-20" />
                        <span className="text-sm font-medium">{plan.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">ROI Comparison</h4>
                <div className="space-y-3">
                  {analytics.roiComparison.slice(0, 5).map((plan) => (
                    <div key={plan.planId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{plan.planName}</span>
                      <div className="text-right">
                        <p className="text-sm text-green-600">{plan.dailyRoi}% daily</p>
                        <p className="text-xs text-gray-500">{plan.totalRoi}% total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Plans</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency-filter">Currency</Label>
              <Select value={filters.currency} onValueChange={(value) => setFilters({ ...filters, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="naira">Naira</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card className="mb-6">
        <CardHeader className="p-6">
          <CardTitle>Investment Plans ({filteredPlans.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No investment plans found matching the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Amount Range</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-500">{plan.description}</p>
                          <div className="flex space-x-1 mt-1">
                            {plan.featured && <Badge key="featured" variant="secondary" className="text-xs">Featured</Badge>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCurrencyColor(plan.currency)}>
                          {plan.currency.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{formatCurrency(plan.minAmount, plan.currency)}</p>
                          <p className="text-gray-500">to {formatCurrency(plan.maxAmount, plan.currency)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{plan.dailyRoi}% daily</p>
                          <p className="text-gray-500">{plan.totalRoi}% total</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span>{plan.duration} days</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{plan.activeInvestments} active</p>
                          <p className="text-gray-500">{plan.completionRate}% completion</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(plan)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => duplicatePlan(plan)}
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleArchive(plan)}
                          >
                            <ArchiveBoxIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Investment Plan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this investment plan? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePlan(plan._id)}
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
            label="plans"
            emptyMessage="No plans found"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Plan Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">{showCreateDialog ? 'Create Investment Plan' : 'Edit Investment Plan'}</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {showCreateDialog ? 'Create a new investment plan for users' : 'Update the investment plan details'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter plan name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleFormChange('currency', value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="naira">Naira (NGN)</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Enter plan description"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-sm font-medium">Minimum Amount</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => handleFormChange('minAmount', e.target.value)}
                    placeholder="0"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-sm font-medium">Maximum Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => handleFormChange('maxAmount', e.target.value)}
                    placeholder="0"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyRoi" className="text-sm font-medium">Daily ROI (%)</Label>
                  <Input
                    id="dailyRoi"
                    type="number"
                    step="0.01"
                    value={formData.dailyRoi}
                    onChange={(e) => handleFormChange('dailyRoi', e.target.value)}
                    placeholder="0.00"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalRoi" className="text-sm font-medium">Total ROI (%)</Label>
                  <Input
                    id="totalRoi"
                    type="number"
                    step="0.01"
                    value={formData.totalRoi}
                    onChange={(e) => handleFormChange('totalRoi', e.target.value)}
                    placeholder="0.00"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleFormChange('duration', e.target.value)}
                  placeholder="30"
                  className="h-10"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Features</Label>
                <div className="space-y-3">
                  {(formData.features || []).map((feature, index) => (
                    <div key={`form-feature-${index}`} className="flex items-center space-x-3">
                      <Input value={feature} readOnly className="flex-1 h-10" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-10 px-4"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addFeature} variant="outline" size="sm" className="h-10 px-4">
                    Add Feature
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Terms & Conditions</Label>
                <div className="space-y-3">
                  {(formData.terms || []).map((term, index) => (
                    <div key={`form-term-${index}`} className="flex items-center space-x-3">
                      <Input value={term} readOnly className="flex-1 h-10" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTerm(index)}
                        className="h-10 px-4"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addTerm} variant="outline" size="sm" className="h-10 px-4">
                    Add Term
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                    placeholder="1"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleFormChange('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">Mark as Featured</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Label htmlFor="popularity" className="text-sm font-medium">Popularity (%)</Label>
                  <Input
                    id="popularity"
                    type="number"
                    value={formData.popularity}
                    onChange={(e) => handleFormChange('popularity', e.target.value)}
                    placeholder="0"
                    className="h-10"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setShowEditDialog(false);
              resetForm();
            }} className="h-10 px-6">
              Cancel
            </Button>
            <Button onClick={showCreateDialog ? createPlan : updatePlan} className="h-10 px-6">
              {showCreateDialog ? 'Create Plan' : 'Update Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Investment Plan Templates</DialogTitle>
            <DialogDescription>
              Choose from pre-configured investment plan templates to get started quickly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planTemplates.map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Amount Range</p>
                      <p className="text-gray-600">₦{template.minAmount.toLocaleString()} - ₦{template.maxAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">ROI</p>
                      <p className="text-gray-600">{template.dailyRoi}% daily / {template.totalRoi}% total</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Features:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {(template.features || []).map((feature, i) => (
                        <li key={`template-feature-${i}`}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => useTemplate(template)} className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Plan Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected investment plan.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Plan Name</Label>
                    <p className="text-sm font-medium">{selectedPlan.name}</p>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Badge className={getCurrencyColor(selectedPlan.currency)}>
                      {selectedPlan.currency.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label>Amount Range</Label>
                    <p className="text-sm">{formatCurrency(selectedPlan.minAmount, selectedPlan.currency)} - {formatCurrency(selectedPlan.maxAmount, selectedPlan.currency)}</p>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <p className="text-sm">{selectedPlan.duration} days</p>
                  </div>
                  <div>
                    <Label>Daily ROI</Label>
                    <p className="text-sm font-medium text-green-600">{selectedPlan.dailyRoi}%</p>
                  </div>
                  <div>
                    <Label>Total ROI</Label>
                    <p className="text-sm font-medium text-green-600">{selectedPlan.totalRoi}%</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedPlan.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Investments</Label>
                    <p className="text-2xl font-bold">{selectedPlan.totalInvestments || 0}</p>
                  </div>
                  <div>
                    <Label>Active Investments</Label>
                    <p className="text-2xl font-bold">{selectedPlan.activeInvestments || 0}</p>
                  </div>
                  <div>
                    <Label>Total Amount</Label>
                    <p className="text-2xl font-bold">{formatCurrency(selectedPlan.totalAmount || 0, selectedPlan.currency)}</p>
                  </div>
                  <div>
                    <Label>Total Earnings</Label>
                    <p className="text-2xl font-bold">{formatCurrency(selectedPlan.totalEarnings || 0, selectedPlan.currency)}</p>
                  </div>
                </div>
                <div>
                  <Label>Completion Rate</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedPlan.completionRate || 0} className="flex-1" />
                    <span className="text-sm font-medium">{selectedPlan.completionRate || 0}%</span>
                  </div>
                </div>
                <div>
                  <Label>Average Rating</Label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= (selectedPlan.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                    <span className="text-sm ml-2">({(selectedPlan.averageRating || 0).toFixed(1)})</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div>
                  <Label>Features</Label>
                  <ul className="space-y-1">
                    {(selectedPlan.features || []).map((feature, index) => (
                      <li key={`feature-${index}`} className="text-sm flex items-center space-x-2">
                        <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label>Terms & Conditions</Label>
                  <ul className="space-y-1">
                    {(selectedPlan.terms || []).map((term, index) => (
                      <li key={`term-${index}`} className="text-sm flex items-center space-x-2">
                        <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="investments" className="space-y-4">
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Investment details will be shown here</p>
                  <p className="text-sm text-gray-400">This feature is coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 