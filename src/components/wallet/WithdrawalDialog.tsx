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
  initialAmount 
}: WithdrawalDialogProps) {
  const [step, setStep] = useState<'amount' | 'confirm' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance();
  const { data: bankDetails, isLoading: bankLoading } = useActiveBankDetails();
  const createWithdrawal = useCreateWithdrawal();

  // Initialize amount when dialog opens
  useEffect(() => {
    if (open && initialAmount) {
      setAmount(initialAmount);
    }
  }, [open, initialAmount]);

  const availableBalance = currency === 'naira' 
    ? walletBalance?.totalBalance?.naira || 0
    : walletBalance?.totalBalance?.usdt || 0;

  const minWithdrawal = currency === 'naira' ? 2000 : 10; // ₦2,000 or $10
  const maxWithdrawal = availableBalance;

  const calculateFee = (amount: number) => {
    if (currency === 'naira') {
      return amount > 50000 ? 100 : 50; // ₦100 for amounts > ₦50,000, else ₦50
    } else {
      return amount > 100 ? 5 : 2; // $5 for amounts > $100, else $2
    }
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
    if (!amount || parseFloat(amount) < minWithdrawal) {
      toast.error(`Please enter a valid amount (minimum ${formatCurrency(minWithdrawal)})`);
      return;
    }

    if (parseFloat(amount) > maxWithdrawal) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(maxWithdrawal)}`);
      return;
    }

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
        withdrawalMethod: 'bank_transfer',
        bankDetails: {
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          accountName: bankDetails.accountName,
          bankCode: bankDetails.bankCode,
          sortCode: bankDetails.sortCode,
        }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-red-600" />
            Withdraw {currency === 'naira' ? 'NGN' : 'USDT'}
          </DialogTitle>
          <DialogDescription>
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
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currency === 'naira' ? 'NGN' : 'USDT'})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Enter amount (minimum ${formatCurrency(minWithdrawal)})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={minWithdrawal}
                  max={maxWithdrawal}
                  step={currency === 'naira' ? '100' : '1'}
                  className="text-lg"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Available: {formatCurrency(availableBalance)}</span>
                  <span>Min: {formatCurrency(minWithdrawal)}</span>
                </div>
              </div>

              {amount && parseFloat(amount) >= minWithdrawal && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Withdrawal Amount</span>
                        <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span className="font-medium">{formatCurrency(fee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>You'll Receive</span>
                        <span className="text-green-600">{formatCurrency(netAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bank Details Preview */}
              {bankLoading ? (
                <div className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ) : bankDetails ? (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Withdrawal Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank</span>
                        <span className="font-medium">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account</span>
                        <span className="font-medium">{bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{bankDetails.accountName}</span>
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

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAmountSubmit}
                  disabled={!amount || parseFloat(amount) < minWithdrawal || !bankDetails}
                  className="flex-1 bg-red-600 hover:bg-red-700"
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
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    Confirm Withdrawal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span className="font-semibold">{formatCurrency(fee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>You'll Receive</span>
                      <span className="text-green-600">{formatCurrency(netAmount)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Withdrawal Account</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank</span>
                        <span className="font-medium">{bankDetails?.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account</span>
                        <span className="font-medium">{bankDetails?.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{bankDetails?.accountName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Please verify your bank details are correct. 
                  Withdrawals cannot be reversed once processed.
                </AlertDescription>
              </Alert>

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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Withdrawal Request Submitted!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your withdrawal request for {formatCurrency(netAmount)} has been submitted successfully.
                  </p>
                  <div className="space-y-2 text-sm text-green-600">
                    <p>• You'll receive an email confirmation shortly</p>
                    <p>• Processing typically takes 1-24 hours</p>
                    <p>• Funds will be sent to your registered bank account</p>
                  </div>
                </CardContent>
              </Card>

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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Make Another Withdrawal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 