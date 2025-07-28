'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Building2,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletBalance } from '@/lib/hooks/useWallet';
import { useActiveBankDetails } from '@/lib/hooks/useBank';
import { useCreateWithdrawal } from '@/lib/hooks/useWithdrawal';
import { useWithdrawalSettings } from '@/lib/hooks/useWallet';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  currency?: 'naira' | 'usdt';
  initialAmount?: string;
}

export function WithdrawalDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  currency = 'naira', 
  initialAmount,
}: WithdrawalDialogProps) {
  const [step, setStep] = useState<'amount' | 'confirm' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance();
  const { data: bankDetails, isLoading: bankLoading } = useActiveBankDetails();
  const { data: withdrawalSettings, isLoading: settingsLoading, refetch: refetchSettings } = useWithdrawalSettings();
  const createWithdrawal = useCreateWithdrawal();

  // Get withdrawal limits and fees from settings
  const minWithdrawal = withdrawalSettings?.minWithdrawalAmount ?? 100;
  const maxWithdrawal = withdrawalSettings?.maxWithdrawalAmount ?? 1000000;
  const withdrawalFee = withdrawalSettings?.withdrawalFee ?? 2.5;

  // Initialize amount when dialog opens
  useEffect(() => {
    if (open && initialAmount) {
      setAmount(initialAmount);
    }
  }, [open, initialAmount]);

  // Refetch settings when dialog opens to ensure latest fees
  useEffect(() => {
    if (open) {
      refetchSettings();
    }
  }, [open, refetchSettings]);

  // Debug log to see what fee is being used
  useEffect(() => {
    if (withdrawalSettings) {
      console.log('Withdrawal settings loaded:', {
        withdrawalFee: withdrawalSettings.withdrawalFee,
        minWithdrawal: withdrawalSettings.minWithdrawalAmount,
        maxWithdrawal: withdrawalSettings.maxWithdrawalAmount
      });
    }
  }, [withdrawalSettings]);

  // Reset component state when currency changes
  useEffect(() => {
    if (open) {
      setStep('amount');
      setAmount('');
      setAmountError(null);
      setIsProcessing(false);
    }
  }, [currency, open]);

  const availableBalance = currency === 'naira' 
    ? walletBalance?.totalBalance?.naira || 0
    : walletBalance?.totalBalance?.usdt || 0;

  // Update fee calculation to use backend settings
  const calculateFee = (amount: number) => {
    return (amount * withdrawalFee) / 100; // Calculate fee as percentage
  };

  const fee = amount ? calculateFee(parseFloat(amount)) : 0;
  const netAmount = amount ? parseFloat(amount) - fee : 0;

  const formatCurrency = (value: number) => {
    if (currency === 'naira') {
      return `₦${value.toLocaleString()}`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const handleAmountSubmit = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt < minWithdrawal) {
      setAmountError(`Please enter a valid amount (minimum ${formatCurrency(minWithdrawal)})`);
      toast.error(`Please enter a valid amount (minimum ${formatCurrency(minWithdrawal)})`);
      return;
    }
    if (amt > maxWithdrawal) {
      setAmountError(`Amount exceeds the maximum allowed (${formatCurrency(maxWithdrawal)})`);
      toast.error(`Amount exceeds the maximum allowed (${formatCurrency(maxWithdrawal)})`);
      return;
    }
    if (amt > availableBalance) {
      setAmountError(`Amount exceeds your available balance (${formatCurrency(availableBalance)})`);
      toast.error(`Amount exceeds your available balance (${formatCurrency(availableBalance)})`);
      return;
    }
    setAmountError(null);
    if (!bankDetails) {
      toast.error('No bank details found. Please add your bank details in Settings first.');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmWithdrawal = async () => {
    if (!bankDetails) {
      toast.error('Bank details not found');
      return;
    }

    setIsProcessing(true);
    try {
      await createWithdrawal.mutateAsync({
        amount: parseFloat(amount),
        currency,
        notes: `ROI withdrawal request for ${currency === 'naira' ? 'NGN' : 'USDT'}`
      });

      setStep('success');
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handled by the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setIsProcessing(false);
    onOpenChange(false);
  };

  const handleCreateNew = () => {
    setStep('amount');
    setAmount('');
    setIsProcessing(false);
  };

  if (settingsLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Loading Withdrawal Settings</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <span className="ml-2 text-gray-900 dark:text-gray-100">Loading withdrawal settings...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <Wallet className="h-6 w-6 text-red-600" />
            Withdraw {currency === 'naira' ? 'NGN' : 'USDT'}
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {step === 'amount' && 'Enter the amount you want to withdraw'}
            {step === 'confirm' && 'Confirm your withdrawal details'}
            {step === 'success' && 'Your withdrawal request has been submitted'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-base font-medium">Amount ({currency === 'naira' ? 'NGN' : 'USDT'})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Enter amount (min ${formatCurrency(minWithdrawal)}, max ${formatCurrency(maxWithdrawal)})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={minWithdrawal}
                  max={maxWithdrawal}
                  step={currency === 'naira' ? '100' : '1'}
                  className="text-lg sm:text-xl h-12"
                />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm text-gray-500">
                  <span>Available: {formatCurrency(availableBalance)}</span>
                  <span>Min: {formatCurrency(minWithdrawal)}</span>
                  <span>Max: {formatCurrency(maxWithdrawal)}</span>
                </div>
                {amountError && <div className="text-red-600 text-sm mt-1">{amountError}</div>}
              </div>

              {amount && parseFloat(amount) >= minWithdrawal && (
                <Card className="bg-gray-50 dark:bg-gray-800/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Withdrawal Amount</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{formatCurrency(parseFloat(amount))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Processing Fee ({withdrawalFee}%)</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{formatCurrency(fee)}</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">You'll Receive</span>
                        <span className="text-green-600 dark:text-green-400 font-bold text-xl">{formatCurrency(netAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bank Details Preview */}
              {bankLoading ? (
                <div className="animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ) : bankDetails ? (
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      Withdrawal Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Bank</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Account</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Name</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-right max-w-[60%]">{bankDetails.accountName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No bank details found. Please add your bank details in Settings first.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Withdrawals are processed within 1-24 hours. You'll receive an email confirmation once processed.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 h-12 text-base font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAmountSubmit}
                  disabled={!amount || parseFloat(amount) < minWithdrawal || !bankDetails}
                  className="flex-1 h-12 text-base font-medium bg-red-600 hover:bg-red-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    Confirm Withdrawal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Amount</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Processing Fee ({withdrawalFee}%)</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(fee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-gray-100">You'll Receive</span>
                      <span className="text-green-600 dark:text-green-400">{formatCurrency(netAmount)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Bank Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bank</span>
                        <span className="text-gray-900 dark:text-gray-100">{bankDetails?.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Account</span>
                        <span className="text-gray-900 dark:text-gray-100">{bankDetails?.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Name</span>
                        <span className="text-gray-900 dark:text-gray-100">{bankDetails?.accountName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('amount')}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmWithdrawal}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Withdrawal Request Submitted!</h3>
                <p className="text-gray-600 mt-2">
                  Your withdrawal request for {formatCurrency(parseFloat(amount))} has been submitted successfully.
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p>You'll receive {formatCurrency(netAmount)} after processing.</p>
                <p>Processing time: 1-24 hours</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleCreateNew}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  New Withdrawal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 