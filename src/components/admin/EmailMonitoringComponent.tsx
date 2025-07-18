'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Send,
  Settings,
  TestTube,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { api, endpoints } from '@/lib/api';

interface EmailStatus {
  activeProvider: string;
  fallbackProvider: string;
  activeProviderConfigured: boolean;
  fallbackProviderConfigured: boolean;
  availableTemplates: string[];
}

interface TestResult {
  success: boolean;
  message: string;
  provider: string;
}

export default function EmailMonitoringComponent() {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const fetchEmailStatus = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/email/status');
      setEmailStatus(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch email status');
      console.error('Email status error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    setIsTesting(true);
    try {
      const response = await api.post('/email/test-configuration', { to: testEmail });
      setTestResult(response.data);
      
      if (response.data.success) {
        toast.success('Test email sent successfully!');
      } else {
        toast.error('Test email failed');
      }
    } catch (error) {
      toast.error('Failed to test email configuration');
      console.error('Email test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const sendTestTemplateEmail = async (templateName: string) => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    try {
      const response = await api.post('/email/send-template', {
        to: testEmail,
        template: templateName,
        data: {
          userName: 'Test User',
          userEmail: testEmail,
          dashboardUrl: 'http://localhost:3000/dashboard',
          otpCode: '123456',
          verificationCode: '123456',
          resetUrl: 'http://localhost:3000/reset-password',
          amount: 10000,
          currency: 'NGN',
          planName: 'Test Plan',
          dailyRoi: 2.5,
          duration: 30,
          startDate: new Date(),
          expectedTotalRoi: 75,
          investmentId: 'test-inv-123',
          paymentDate: new Date(),
          paymentType: 'Daily ROI',
          transactionId: 'test-txn-123',
          investmentName: 'Test Investment',
          status: 'completed',
          type: 'deposit',
          reference: 'TEST-REF-123',
          date: new Date(),
          description: 'Test transaction',
          totalRoi: 7500,
          initialAmount: 10000,
          completionDate: new Date(),
          referralCode: 'TEST123',
          referredUser: 'Referred User',
          bonusAmount: 1000,
          availableDate: new Date(),
          userId: 'test-user-123',
          alertType: 'Suspicious Login',
          alertDate: new Date(),
          ipAddress: '192.168.1.1',
          location: 'Test Location',
          device: 'Test Device',
          alertId: 'alert-123',
          withdrawalMethod: 'Bank Transfer',
          withdrawalRequestDate: new Date(),
          accountDetails: 'Test Bank Account',
          withdrawalCompletionDate: new Date(),
          transactionHash: 'test-hash-123',
          newFeePercentage: 2.5,
          updateDate: new Date(),
          paymentMethod: 'Bank Transfer',
          depositRequestDate: new Date(),
          depositConfirmationDate: new Date(),
        }
      });

      if (response.data.success) {
        toast.success(`${templateName} template email sent successfully!`);
      } else {
        toast.error(`Failed to send ${templateName} template email`);
      }
    } catch (error) {
      toast.error(`Failed to send ${templateName} template email`);
      console.error('Template email error:', error);
    }
  };

  useEffect(() => {
    fetchEmailStatus();
  }, []);

  const getProviderStatusColor = (configured: boolean) => {
    return configured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getProviderStatusIcon = (configured: boolean) => {
    return configured ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Status
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEmailStatus}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailStatus ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Active Provider</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{emailStatus.activeProvider}</Badge>
                    <Badge className={getProviderStatusColor(emailStatus.activeProviderConfigured)}>
                      {getProviderStatusIcon(emailStatus.activeProviderConfigured)}
                      {emailStatus.activeProviderConfigured ? 'Configured' : 'Not Configured'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Fallback Provider</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{emailStatus.fallbackProvider}</Badge>
                    <Badge className={getProviderStatusColor(emailStatus.fallbackProviderConfigured)}>
                      {getProviderStatusIcon(emailStatus.fallbackProviderConfigured)}
                      {emailStatus.fallbackProviderConfigured ? 'Configured' : 'Not Configured'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Available Templates ({emailStatus.availableTemplates.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {emailStatus.availableTemplates.map((template) => (
                    <Badge key={template} variant="secondary" className="text-xs">
                      {template}
                    </Badge>
                  ))}
                </div>
              </div>

              {!emailStatus.activeProviderConfigured && !emailStatus.fallbackProviderConfigured && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">No Email Providers Configured</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Neither the active nor fallback email providers are configured. 
                    Please check your environment variables and email service configuration.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Failed to load email service status</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Email Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email address for testing"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={testEmailConfiguration}
                disabled={isTesting || !testEmail}
                className="min-w-[120px]"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Test Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {testResult && (
            <Alert className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.success ? 'Test Successful' : 'Test Failed'}
              </AlertTitle>
              <AlertDescription className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                {testResult.message} (Provider: {testResult.provider})
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Test Email Templates</Label>
            <p className="text-sm text-gray-500">
              Send test emails using specific templates to verify they work correctly.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {emailStatus?.availableTemplates.slice(0, 8).map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestTemplateEmail(template)}
                  disabled={!testEmail}
                  className="text-xs"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {template}
                </Button>
              ))}
            </div>
            {emailStatus && emailStatus.availableTemplates.length > 8 && (
              <p className="text-xs text-gray-500">
                Showing first 8 templates. Total: {emailStatus.availableTemplates.length}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Configuration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Environment Variables</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div><code>EMAIL_PROVIDER=resend</code> - Set to: resend, brevo, nodemailer, or console</div>
              <div><code>RESEND_API_KEY=your-api-key</code> - Required for Resend</div>
              <div><code>BREVO_API_KEY=your-api-key</code> - Required for Brevo</div>
              <div><code>SMTP_HOST=smtp.gmail.com</code> - Required for Nodemailer</div>
              <div><code>SMTP_USER=your-email</code> - Required for Nodemailer</div>
              <div><code>SMTP_PASS=your-password</code> - Required for Nodemailer</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Quick Setup</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Choose an email provider (Resend recommended for production)</li>
              <li>Set the <code>EMAIL_PROVIDER</code> environment variable</li>
              <li>Configure the provider-specific API keys</li>
              <li>Restart the application</li>
              <li>Test the email service using this dashboard</li>
            </ol>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Monitoring</AlertTitle>
            <AlertDescription className="text-blue-700">
              Check the application logs for email-related errors and delivery status. 
              Failed emails will be logged with detailed error messages.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
} 