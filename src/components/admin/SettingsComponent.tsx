'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cog6ToothIcon, CurrencyDollarIcon, ShieldCheckIcon, BellIcon, ArrowTrendingUpIcon, CheckCircleIcon, ExclamationTriangleIcon, GiftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface PlatformSettings {
  withdrawalLimits: {
    minAmount: number;
    maxAmount: number;
  };
  depositLimits: {
    minAmount: number;
    maxAmount: number;
  };
  fees: {
    withdrawalFee: number;
    depositFee: number;
    transactionFee: number;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  autoPayout?: boolean;
  bonusWithdrawalPeriod?: number;
  bonusWithdrawalUnit?: 'minutes' | 'hours' | 'days';
  // USDT Feature Toggles
  usdtWithdrawalEnabled?: boolean;
  usdtInvestmentEnabled?: boolean;
}

interface TestingModeSettings {
  enabled: boolean;
  hourlyUpdateInterval: number;
  dailyCycleInterval: number;
  monthlyCycleInterval: number;
  overdueThreshold: number;
  minUpdateInterval: number;
  countdownUpdateThreshold: number;
}

interface WithdrawalPolicy {
  roiOnly: boolean;
}

export default function SettingsComponent() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<PlatformSettings>({
    withdrawalLimits: { minAmount: 0, maxAmount: 0 },
    depositLimits: { minAmount: 0, maxAmount: 0 },
    fees: { withdrawalFee: 0, depositFee: 0, transactionFee: 0 },
    security: { requireEmailVerification: true, requirePhoneVerification: false, twoFactorAuth: false, sessionTimeout: 24 },
    notifications: { emailNotifications: true, smsNotifications: false, pushNotifications: true },
    maintenance: { maintenanceMode: false, maintenanceMessage: '' },
    autoPayout: false,
    bonusWithdrawalPeriod: 15,
    bonusWithdrawalUnit: 'days',
    // USDT Feature Toggles
    usdtWithdrawalEnabled: false,
    usdtInvestmentEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [withdrawalPolicy, setWithdrawalPolicy] = useState<WithdrawalPolicy>({ roiOnly: true });
  const [policyLoading, setPolicyLoading] = useState(true);
  const [policySaving, setPolicySaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings | null>(null);
  
  // Testing Mode State
  const [testingModeSettings, setTestingModeSettings] = useState<TestingModeSettings>({
    enabled: false,
    hourlyUpdateInterval: 60 * 60 * 1000,
    dailyCycleInterval: 24 * 60 * 60 * 1000,
    monthlyCycleInterval: 30 * 24 * 60 * 60 * 1000,
    overdueThreshold: 60 * 60 * 1000,
    minUpdateInterval: 30 * 1000,
    countdownUpdateThreshold: 60 * 1000,
  });
  const [testingModeLoading, setTestingModeLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchWithdrawalPolicy();
    fetchTestingModeSettings();
  }, []);

  // Track changes
  useEffect(() => {
    if (originalSettings) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(hasChanges);
    }
  }, [settings]);

  // Handle initial change detection when originalSettings is set
  useEffect(() => {
    if (originalSettings && settings) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(hasChanges);
    }
  }, [originalSettings]);

  const fetchSettings = async () => {
    try {
      const response = await api.get(endpoints.admin.settings);
      const fetchedSettings = response.data;
      
      // Ensure all required properties exist with defaults
      const safeSettings: PlatformSettings = {
        withdrawalLimits: {
          minAmount: fetchedSettings?.withdrawalLimits?.minAmount ?? 1000,
          maxAmount: fetchedSettings?.withdrawalLimits?.maxAmount ?? 1000000,
        },
        depositLimits: {
          minAmount: fetchedSettings?.depositLimits?.minAmount ?? 100,
          maxAmount: fetchedSettings?.depositLimits?.maxAmount ?? 1000000,
        },
        fees: {
          withdrawalFee: fetchedSettings?.fees?.withdrawalFee ?? 2.5,
          depositFee: fetchedSettings?.fees?.depositFee ?? 0,
          transactionFee: fetchedSettings?.fees?.transactionFee ?? 1.0,
        },
        security: {
          requireEmailVerification: fetchedSettings?.security?.requireEmailVerification ?? true,
          requirePhoneVerification: fetchedSettings?.security?.requirePhoneVerification ?? false,
          twoFactorAuth: fetchedSettings?.security?.twoFactorAuth ?? false,
          sessionTimeout: fetchedSettings?.security?.sessionTimeout ?? 24,
        },
        notifications: {
          emailNotifications: fetchedSettings?.notifications?.emailNotifications ?? true,
          smsNotifications: fetchedSettings?.notifications?.smsNotifications ?? false,
          pushNotifications: fetchedSettings?.notifications?.pushNotifications ?? true,
        },
        maintenance: {
          maintenanceMode: fetchedSettings?.maintenance?.maintenanceMode ?? false,
          maintenanceMessage: fetchedSettings?.maintenance?.maintenanceMessage ?? '',
        },
        autoPayout: fetchedSettings?.autoPayout ?? false,
        bonusWithdrawalPeriod: fetchedSettings?.bonusWithdrawalPeriod ?? 15,
        bonusWithdrawalUnit: fetchedSettings?.bonusWithdrawalUnit ?? 'days',
        // USDT Feature Toggles
        usdtWithdrawalEnabled: fetchedSettings?.usdtWithdrawalEnabled ?? false,
        usdtInvestmentEnabled: fetchedSettings?.usdtInvestmentEnabled ?? false,
      };
      
      setSettings(safeSettings);
      setOriginalSettings(JSON.parse(JSON.stringify(safeSettings)));
    } catch (error) {
      toast.error('Failed to fetch settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalPolicy = async () => {
    try {
      const response = await api.get(endpoints.admin.withdrawalPolicy);
      setWithdrawalPolicy(response.data);
    } catch (error) {
      toast.error('Failed to fetch withdrawal policy');
      console.error('Error fetching withdrawal policy:', error);
    } finally {
      setPolicyLoading(false);
    }
  };

  const fetchTestingModeSettings = async () => {
    try {
      setTestingModeLoading(true);
      const response = await api.get('/admin/settings/roi-testing-mode');
      setTestingModeSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch testing mode settings:', error);
      // Use default production settings if fetch fails
      setTestingModeSettings({
        enabled: false,
        hourlyUpdateInterval: 60 * 60 * 1000,
        dailyCycleInterval: 24 * 60 * 60 * 1000,
        monthlyCycleInterval: 30 * 24 * 60 * 60 * 1000,
        overdueThreshold: 60 * 60 * 1000,
        minUpdateInterval: 30 * 1000,
        countdownUpdateThreshold: 60 * 1000,
      });
    } finally {
      setTestingModeLoading(false);
    }
  };

  const validateSettings = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate withdrawal limits
    if ((settings.withdrawalLimits?.minAmount ?? 0) < 0) {
      errors.minAmount = 'Minimum withdrawal amount cannot be negative';
    }
    if ((settings.withdrawalLimits?.maxAmount ?? 0) <= 0) {
      errors.maxAmount = 'Maximum withdrawal amount must be positive';
    }
    if ((settings.withdrawalLimits?.minAmount ?? 0) >= (settings.withdrawalLimits?.maxAmount ?? 0)) {
      errors.maxAmount = 'Maximum amount must be greater than minimum amount';
    }

    // Validate deposit limits
    if ((settings.depositLimits?.minAmount ?? 0) < 0) {
      errors.depositMinAmount = 'Minimum deposit amount cannot be negative';
    }
    if ((settings.depositLimits?.maxAmount ?? 0) <= 0) {
      errors.depositMaxAmount = 'Maximum deposit amount must be positive';
    }
    if ((settings.depositLimits?.minAmount ?? 0) >= (settings.depositLimits?.maxAmount ?? 0)) {
      errors.depositMaxAmount = 'Maximum deposit amount must be greater than minimum amount';
    }

    // Validate fees
    if ((settings.fees?.withdrawalFee ?? 0) < 0 || (settings.fees?.withdrawalFee ?? 0) > 100) {
      errors.withdrawalFee = 'Withdrawal fee must be between 0 and 100%';
    }
    if ((settings.fees?.depositFee ?? 0) < 0 || (settings.fees?.depositFee ?? 0) > 100) {
      errors.depositFee = 'Deposit fee must be between 0 and 100%';
    }
    if ((settings.fees?.transactionFee ?? 0) < 0 || (settings.fees?.transactionFee ?? 0) > 100) {
      errors.transactionFee = 'Transaction fee must be between 0 and 100%';
    }

    // Validate security settings
    if ((settings.security?.sessionTimeout ?? 24) < 1 || (settings.security?.sessionTimeout ?? 24) > 168) {
      errors.sessionTimeout = 'Session timeout must be between 1 and 168 hours';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateSettings = async () => {
    if (!validateSettings()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    setSaving(true);
    try {
      // Handle bonus withdrawal period separately if it changed
      const originalBonusPeriod = originalSettings?.bonusWithdrawalPeriod ?? 15;
      const newBonusPeriod = settings.bonusWithdrawalPeriod ?? 15;
      const originalBonusUnit = originalSettings?.bonusWithdrawalUnit ?? 'days';
      const newBonusUnit = settings.bonusWithdrawalUnit ?? 'days';
      
      if (originalBonusPeriod !== newBonusPeriod || originalBonusUnit !== newBonusUnit) {
        try {
          const bonusResponse = await api.patch(endpoints.admin.settings + '/bonus-withdrawal-period', {
            value: newBonusPeriod,
            unit: newBonusUnit
          });
          
          if (bonusResponse.data.affectedUsers > 0) {
            toast.success(`Bonus withdrawal period updated! ${bonusResponse.data.affectedUsers} users were notified of the change.`);
          } else {
            toast.success('Bonus withdrawal period updated successfully!');
          }
        } catch (error: any) {
          console.error('Error updating bonus withdrawal period:', error);
          toast.error('Failed to update bonus withdrawal period: ' + (error.response?.data?.message || 'Unknown error'));
          setSaving(false);
          return;
        }
      }

      // Update other settings
      const response = await api.patch(endpoints.admin.settings, settings);
      
      // Invalidate withdrawal settings cache to ensure frontend reflects new fees immediately
      queryClient.invalidateQueries({ queryKey: ['settings', 'withdrawal'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'platform'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'bonusWithdrawalPeriod'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['investment-stats'] });
      
      // Update original settings to reflect the saved state
      setOriginalSettings(JSON.parse(JSON.stringify(response.data)));
      setHasChanges(false);
      
      toast.success('Settings updated successfully! All users will be affected by these changes.');
      
      // Show detailed success message
      toast.success('Changes applied:', {
        description: '• Withdrawal fees updated for all pending withdrawals\n• All users notified of changes\n• Settings saved to database\n• Frontend cache cleared for immediate effect',
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error('Error updating settings:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update settings';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateWithdrawalPolicy = async (roiOnly: boolean) => {
    setPolicySaving(true);
    try {
      const response = await api.patch(endpoints.admin.withdrawalPolicy, { roiOnly });
      setWithdrawalPolicy(response.data);
      toast.success('Withdrawal policy updated successfully');
    } catch (error: any) {
      console.error('Error updating withdrawal policy:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update withdrawal policy';
      toast.error(errorMessage);
    } finally {
      setPolicySaving(false);
    }
  };

  const handleSettingChange = (path: string, value: any) => {
    // Create a completely new settings object
    const newSettings = JSON.parse(JSON.stringify(settings));
    const keys = path.split('.');
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings: PlatformSettings = {
      withdrawalLimits: { minAmount: 1000, maxAmount: 1000000 },
      depositLimits: { minAmount: 1000, maxAmount: 1000000 },
      fees: { withdrawalFee: 2.5, depositFee: 0, transactionFee: 1.0 },
      security: { requireEmailVerification: true, requirePhoneVerification: false, twoFactorAuth: false, sessionTimeout: 24 },
      notifications: { emailNotifications: true, smsNotifications: false, pushNotifications: true },
      maintenance: { maintenanceMode: false, maintenanceMessage: '' },
      autoPayout: false,
      bonusWithdrawalPeriod: 15,
      bonusWithdrawalUnit: 'days',
      // USDT Feature Toggles
      usdtWithdrawalEnabled: false,
      usdtInvestmentEnabled: false,
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure platform-wide settings and preferences</p>
          {hasChanges && (
            <div className="flex items-center mt-2 text-amber-600">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
          )}
          {!hasChanges && originalSettings && (
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">All changes saved</span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            disabled={saving}
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={updateSettings} 
            disabled={saving || !hasChanges}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Limits */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span>Withdrawal Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Amount</Label>
                <Input
                  type="number"
                  value={settings.withdrawalLimits?.minAmount ?? 0}
                  onChange={(e) => handleSettingChange('withdrawalLimits.minAmount', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.minAmount ? 'border-red-500' : ''}`}
                  placeholder="1000"
                />
                {validationErrors.minAmount && (
                  <p className="text-xs text-red-500">{validationErrors.minAmount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maximum Amount</Label>
                <Input
                  type="number"
                  value={settings.withdrawalLimits?.maxAmount ?? 0}
                  onChange={(e) => handleSettingChange('withdrawalLimits.maxAmount', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.maxAmount ? 'border-red-500' : ''}`}
                  placeholder="1000000"
                />
                {validationErrors.maxAmount && (
                  <p className="text-xs text-red-500">{validationErrors.maxAmount}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-4">
              <Switch
                id="autoPayout"
                checked={!!settings.autoPayout}
                onCheckedChange={(checked) => handleSettingChange('autoPayout', checked)}
              />
              <Label htmlFor="autoPayout" className="text-sm font-medium">Enable Auto Payout</Label>
            </div>
            <div className="flex items-center space-x-3 pt-4">
              <Switch
                id="roiOnlyPolicy"
                checked={!!withdrawalPolicy.roiOnly}
                onCheckedChange={(checked) => updateWithdrawalPolicy(checked)}
                disabled={policyLoading || policySaving}
              />
              <Label htmlFor="roiOnlyPolicy" className="text-sm font-medium">
                Enforce ROI-Only Withdrawal Policy
              </Label>
              {policyLoading && <span className="text-xs text-gray-400">Loading...</span>}
              {policySaving && <span className="text-xs text-gray-400">Saving...</span>}
            </div>
          </CardContent>
        </Card>

        {/* Deposit Limits */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span>Deposit Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Amount</Label>
                <Input
                  type="number"
                  value={settings.depositLimits?.minAmount ?? 0}
                  onChange={(e) => handleSettingChange('depositLimits.minAmount', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.depositMinAmount ? 'border-red-500' : ''}`}
                  placeholder="100"
                />
                {validationErrors.depositMinAmount && (
                  <p className="text-xs text-red-500">{validationErrors.depositMinAmount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maximum Amount</Label>
                <Input
                  type="number"
                  value={settings.depositLimits?.maxAmount ?? 0}
                  onChange={(e) => handleSettingChange('depositLimits.maxAmount', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.depositMaxAmount ? 'border-red-500' : ''}`}
                  placeholder="1000000"
                />
                {validationErrors.depositMaxAmount && (
                  <p className="text-xs text-red-500">{validationErrors.depositMaxAmount}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              <span>Fee Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Withdrawal Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.fees?.withdrawalFee ?? 0}
                  onChange={(e) => handleSettingChange('fees.withdrawalFee', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.withdrawalFee ? 'border-red-500' : ''}`}
                  placeholder="2.5"
                />
                {validationErrors.withdrawalFee && (
                  <p className="text-xs text-red-500">{validationErrors.withdrawalFee}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Deposit Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.fees?.depositFee ?? 0}
                  onChange={(e) => handleSettingChange('fees.depositFee', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.depositFee ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {validationErrors.depositFee && (
                  <p className="text-xs text-red-500">{validationErrors.depositFee}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.fees?.transactionFee ?? 0}
                  onChange={(e) => handleSettingChange('fees.transactionFee', parseFloat(e.target.value) || 0)}
                  className={`h-10 ${validationErrors.transactionFee ? 'border-red-500' : ''}`}
                  placeholder="1.0"
                />
                {validationErrors.transactionFee && (
                  <p className="text-xs text-red-500">{validationErrors.transactionFee}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Require Email Verification</Label>
                <Switch
                  checked={settings.security?.requireEmailVerification ?? true}
                  onCheckedChange={(checked) => handleSettingChange('security.requireEmailVerification', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Require Phone Verification</Label>
                <Switch
                  checked={settings.security?.requirePhoneVerification ?? false}
                  onCheckedChange={(checked) => handleSettingChange('security.requirePhoneVerification', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <Switch
                  checked={settings.security?.twoFactorAuth ?? false}
                  onCheckedChange={(checked) => handleSettingChange('security.twoFactorAuth', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Session Timeout (hours)</Label>
                <Input
                  type="number"
                  value={settings.security?.sessionTimeout ?? 24}
                  onChange={(e) => handleSettingChange('security.sessionTimeout', parseInt(e.target.value) || 24)}
                  className={`h-10 ${validationErrors.sessionTimeout ? 'border-red-500' : ''}`}
                  placeholder="24"
                />
                {validationErrors.sessionTimeout && (
                  <p className="text-xs text-red-500">{validationErrors.sessionTimeout}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <Switch
                  checked={settings.notifications?.emailNotifications ?? true}
                  onCheckedChange={(checked) => handleSettingChange('notifications.emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <Switch
                  checked={settings.notifications?.smsNotifications ?? false}
                  onCheckedChange={(checked) => handleSettingChange('notifications.smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <Switch
                  checked={settings.notifications?.pushNotifications ?? true}
                  onCheckedChange={(checked) => handleSettingChange('notifications.pushNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="lg:col-span-2 mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Maintenance Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Enable Maintenance Mode</Label>
              <Switch
                checked={settings.maintenance?.maintenanceMode ?? false}
                onCheckedChange={(checked) => handleSettingChange('maintenance.maintenanceMode', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Maintenance Message</Label>
              <Input
                value={settings.maintenance?.maintenanceMessage ?? ''}
                onChange={(e) => handleSettingChange('maintenance.maintenanceMessage', e.target.value)}
                placeholder="Enter maintenance message to display to users"
                className="h-10"
                disabled={!settings.maintenance?.maintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bonus Settings */}
        <Card className="mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <GiftIcon className="h-5 w-5" />
              <span>Bonus Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bonus Withdrawal Period</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.bonusWithdrawalPeriod ?? 15}
                  onChange={(e) => handleSettingChange('bonusWithdrawalPeriod', parseInt(e.target.value) || 15)}
                  className="h-10 flex-1"
                  placeholder="15"
                  min="1"
                  max="365"
                />
                <Select
                  value={settings.bonusWithdrawalUnit ?? 'days'}
                  onValueChange={(value: 'minutes' | 'hours' | 'days') => handleSettingChange('bonusWithdrawalUnit', value)}
                >
                  <SelectTrigger className="h-10 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500">
                Time period users must wait after their first active investment before they can withdraw bonuses. 
                After this period, bonuses can be withdrawn anytime. Changing this will notify affected users.
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    const res = await api.post('/admin/referrals/fix-all-stats');
                    toast.success(`Referral stats updated for ${res.data.updated} users!`);
                  } catch (e: any) {
                    toast.error('Failed to update referral stats');
                  }
                }}
              >
                Run One-Time Referral Stats Fix
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will update referral earnings and investment stats for all users and their referred users. Use only if you notice referral earnings are out of sync.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* USDT Feature Toggles */}
        <Card className="lg:col-span-2 mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              <span>USDT Feature Toggles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable USDT Withdrawal</Label>
                <Switch
                  checked={!!settings.usdtWithdrawalEnabled}
                  onCheckedChange={(checked) => handleSettingChange('usdtWithdrawalEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable USDT Investment</Label>
                <Switch
                  checked={!!settings.usdtInvestmentEnabled}
                  onCheckedChange={(checked) => handleSettingChange('usdtInvestmentEnabled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Testing Mode */}
        <Card className="lg:col-span-2 mb-6">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>ROI Testing Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Testing Mode</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Accelerates ROI timings for testing: 60s hourly, 60m daily, 3h monthly
                  </p>
                  {testingModeLoading && (
                    <p className="text-xs text-blue-500 mt-1">🔄 Updating...</p>
                  )}
                  <div className="text-xs text-gray-600 mt-1">
                    <span className={`font-medium ${testingModeSettings.enabled ? 'text-green-600' : 'text-blue-600'}`}>
                      Current Status: {testingModeSettings.enabled ? 'Testing Mode' : 'Production Mode'}
                    </span>
                    <div className="mt-1">
                      {testingModeSettings.enabled ? (
                        <>
                          <div className="text-green-600">Hourly: {testingModeSettings.hourlyUpdateInterval / 1000}s</div>
                          <div className="text-green-600">Daily: {testingModeSettings.dailyCycleInterval / 60000}m</div>
                          <div className="text-green-600">Monthly: {testingModeSettings.monthlyCycleInterval / 3600000}h</div>
                        </>
                      ) : (
                        <>
                          <div className="text-blue-600">Hourly: {Math.round(testingModeSettings.hourlyUpdateInterval / (60 * 60 * 1000) * 10) / 10}hr</div>
                          <div className="text-blue-600">Daily: {Math.round(testingModeSettings.dailyCycleInterval / (24 * 60 * 60 * 1000) * 10) / 10}hrs</div>
                          <div className="text-blue-600">Monthly: {Math.round(testingModeSettings.monthlyCycleInterval / (30 * 24 * 60 * 60 * 1000) * 10) / 10} days</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={testingModeSettings.enabled}
                  disabled={testingModeLoading}
                  onCheckedChange={async (checked) => {
                    try {
                      setTestingModeLoading(true);
                      if (checked) {
                        await api.post('/admin/settings/roi-testing-mode/enable');
                        toast.success('Testing mode enabled successfully');
                      } else {
                        await api.post('/admin/settings/roi-testing-mode/disable');
                        toast.success('Testing mode disabled successfully');
                      }
                      // Refresh the testing mode settings instead of reloading the page
                      await fetchTestingModeSettings();
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to update testing mode');
                      // Revert the switch if the API call failed
                      setTestingModeSettings(prev => ({ ...prev, enabled: !checked }));
                    } finally {
                      setTestingModeLoading(false);
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      setTestingModeLoading(true);
                      await api.post('/admin/settings/roi-testing-mode/enable');
                      toast.success('Testing mode enabled successfully');
                      await fetchTestingModeSettings();
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to enable testing mode');
                    } finally {
                      setTestingModeLoading(false);
                    }
                  }}
                  disabled={testingModeLoading || testingModeSettings.enabled}
                  className="w-full"
                >
                  Enable Testing Mode
                </Button>
                
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      setTestingModeLoading(true);
                      await api.post('/admin/settings/roi-testing-mode/disable');
                      toast.success('Testing mode disabled successfully');
                      await fetchTestingModeSettings();
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to disable testing mode');
                    } finally {
                      setTestingModeLoading(false);
                    }
                  }}
                  disabled={testingModeLoading || !testingModeSettings.enabled}
                  className="w-full"
                >
                  Disable Testing Mode
                </Button>
                
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      setTestingModeLoading(true);
                      await api.post('/admin/settings/roi-testing-mode/toggle');
                      toast.success('Testing mode toggled successfully');
                      await fetchTestingModeSettings();
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to toggle testing mode');
                    } finally {
                      setTestingModeLoading(false);
                    }
                  }}
                  disabled={testingModeLoading}
                  className="w-full"
                >
                  Toggle Mode
                </Button>
              </div>
              
              {/* Current Status Display */}
              <div className="pt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="text-sm font-medium text-gray-200 mb-3">Current Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Mode Status</div>
                    <div className={`text-sm font-medium ${testingModeSettings.enabled ? 'text-green-400' : 'text-blue-400'}`}>
                      {testingModeSettings.enabled ? '🟢 Testing Mode' : '🔵 Production Mode'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Timing Intervals</div>
                    <div className="text-xs space-y-1">
                      {testingModeSettings.enabled ? (
                        <>
                          <div className="text-green-400">⏰ Hourly: {testingModeSettings.hourlyUpdateInterval / 1000}s</div>
                          <div className="text-green-400">⏰ Daily: {testingModeSettings.dailyCycleInterval / 60000}m</div>
                          <div className="text-green-400">⏰ Monthly: {testingModeSettings.monthlyCycleInterval / 3600000}h</div>
                        </>
                      ) : (
                        <>
                          <div className="text-blue-400">⏰ Hourly: {Math.round(testingModeSettings.hourlyUpdateInterval / (60 * 60 * 1000) * 10) / 10}hr</div>
                          <div className="text-blue-400">⏰ Daily: {Math.round(testingModeSettings.dailyCycleInterval / (24 * 60 * 60 * 1000) * 10) / 10}hrs</div>
                          <div className="text-blue-400">⏰ Monthly: {Math.round(testingModeSettings.monthlyCycleInterval / (30 * 24 * 60 * 60 * 1000) * 10) / 10} days</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Additional Settings</div>
                  <div className="text-xs space-y-1">
                    <div className="text-gray-300">Overdue Threshold: {testingModeSettings.overdueThreshold / 1000}s</div>
                    <div className="text-gray-300">Min Update Interval: {testingModeSettings.minUpdateInterval / 1000}s</div>
                    <div className="text-gray-300">Countdown Threshold: {testingModeSettings.countdownUpdateThreshold / 1000}s</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      setTestingModeLoading(true);
                      await fetchTestingModeSettings();
                      const mode = testingModeSettings.enabled ? 'Testing' : 'Production';
                      toast.success(`Current mode: ${mode}`);
                      
                      // Show detailed timing information
                      const hourly = testingModeSettings.hourlyUpdateInterval / 1000;
                      const daily = testingModeSettings.dailyCycleInterval / 60000;
                      const monthly = testingModeSettings.monthlyCycleInterval / 3600000;
                      
                      console.log('Testing mode settings:', {
                        mode,
                        hourly: `${hourly}s`,
                        daily: `${daily}m`,
                        monthly: `${monthly}h`
                      });
                    } catch (error: any) {
                      toast.error('Failed to get testing mode status');
                    } finally {
                      setTestingModeLoading(false);
                    }
                  }}
                  disabled={testingModeLoading}
                  className="w-full"
                >
                  Refresh Status
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Refresh the current testing mode status and timings. Testing mode accelerates ROI processing for development and testing purposes.
                </p>
                
                {/* Debug Information */}
                <div className="pt-4 p-3 bg-gray-900 rounded border border-gray-700">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                      🔍 Debug Information
                    </summary>
                    <div className="mt-2 space-y-1 text-gray-500">
                      <div>Raw Settings: {JSON.stringify(testingModeSettings, null, 2)}</div>
                      <div>Loading State: {testingModeSettings.enabled ? 'true' : 'false'}</div>
                      <div>Toggle State: {testingModeSettings.enabled ? 'ON' : 'OFF'}</div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 