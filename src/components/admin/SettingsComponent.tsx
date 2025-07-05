'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cog6ToothIcon, CurrencyDollarIcon, ShieldCheckIcon, BellIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface PlatformSettings {
  withdrawalLimits: {
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
}

export default function SettingsComponent() {
  const [settings, setSettings] = useState<PlatformSettings>({
    withdrawalLimits: { minAmount: 0, maxAmount: 0 },
    fees: { withdrawalFee: 0, depositFee: 0, transactionFee: 0 },
    security: { requireEmailVerification: true, requirePhoneVerification: false, twoFactorAuth: false, sessionTimeout: 24 },
    notifications: { emailNotifications: true, smsNotifications: false, pushNotifications: true },
    maintenance: { maintenanceMode: false, maintenanceMessage: '' },
    autoPayout: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get(endpoints.admin.settings);
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    setSaving(true);
    try {
      await api.patch(endpoints.admin.settings, settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure platform-wide settings and preferences</p>
        </div>
        <Button onClick={updateSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
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
                  value={settings.withdrawalLimits.minAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    withdrawalLimits: { ...settings.withdrawalLimits, minAmount: parseFloat(e.target.value) || 0 }
                  })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maximum Amount</Label>
                <Input
                  type="number"
                  value={settings.withdrawalLimits.maxAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    withdrawalLimits: { ...settings.withdrawalLimits, maxAmount: parseFloat(e.target.value) || 0 }
                  })}
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-4">
              <Switch
                id="autoPayout"
                checked={!!settings.autoPayout}
                onCheckedChange={(checked) => setSettings({ ...settings, autoPayout: checked })}
              />
              <Label htmlFor="autoPayout" className="text-sm font-medium">Enable Auto Payout</Label>
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
                  value={settings.fees.withdrawalFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    fees: { ...settings.fees, withdrawalFee: parseFloat(e.target.value) || 0 }
                  })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Deposit Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.fees.depositFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    fees: { ...settings.fees, depositFee: parseFloat(e.target.value) || 0 }
                  })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.fees.transactionFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    fees: { ...settings.fees, transactionFee: parseFloat(e.target.value) || 0 }
                  })}
                  className="h-10"
                />
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
                  checked={settings.security.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, requireEmailVerification: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Require Phone Verification</Label>
                <Switch
                  checked={settings.security.requirePhoneVerification}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, requirePhoneVerification: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: checked }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Session Timeout (hours)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(e.target.value) || 24 }
                  })}
                  className="h-10"
                />
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
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotifications: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, smsNotifications: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, pushNotifications: checked }
                  })}
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
                checked={settings.maintenance.maintenanceMode}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, maintenanceMode: checked }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Maintenance Message</Label>
              <Input
                value={settings.maintenance.maintenanceMessage}
                onChange={(e) => setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, maintenanceMessage: e.target.value }
                })}
                placeholder="Enter maintenance message to display to users"
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 