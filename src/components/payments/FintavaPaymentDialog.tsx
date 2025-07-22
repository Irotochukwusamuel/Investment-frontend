'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  RefreshCw,
  X,
  Info,
  Timer,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateVirtualWallet, formatTimeRemaining, isVirtualWalletExpired, getStatusColor, type VirtualWallet } from '@/lib/hooks/usePayments';
import { useSocket } from '@/lib/useSocket';
import { useQueryClient } from '@tanstack/react-query';

interface FintavaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (virtualWallet: VirtualWallet) => void;
  initialAmount?: string;
}

export function FintavaPaymentDialog({ open, onOpenChange, onSuccess, initialAmount }: FintavaPaymentDialogProps) {
  const [step, setStep] = useState<'amount' | 'payment' | 'completed'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [virtualWallet, setVirtualWallet] = useState<VirtualWallet | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState<number>(100);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');

  const createVirtualWallet = useCreateVirtualWallet();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Initialize amount when dialog opens
  useEffect(() => {
    if (open && initialAmount) {
      setAmount(initialAmount);
    }
  }, [open, initialAmount]);

  // Timer effect
  useEffect(() => {
    if (!virtualWallet || step !== 'payment') return;

    const timer = setInterval(() => {
      const remaining = formatTimeRemaining(virtualWallet.expiresAt);
      const expired = isVirtualWalletExpired(virtualWallet.expiresAt);
      
      setTimeRemaining(remaining);
      setIsExpired(expired);
      
      // Calculate progress (time remaining as percentage)
      const totalTime = virtualWallet.expireTimeInMin * 60 * 1000;
      const elapsed = Date.now() - new Date(virtualWallet.createdAt).getTime();
      const progressPercent = Math.max(0, Math.min(100, ((totalTime - elapsed) / totalTime) * 100));
      setProgress(progressPercent);
      
      if (expired) {
        clearInterval(timer);
        toast.error('Payment time expired. Please create a new payment.');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [virtualWallet, step]);

  useEffect(() => {
    if (!socket || !open || !virtualWallet || !isListening) return;
    setProcessingMsg('We are processing your transaction. This may take a few moments...');
    const handler = (data: any) => {
      if (data.reference === virtualWallet.merchantReference) {
        setStep('completed');
        setIsListening(false);
        setProcessingMsg('');
        toast.success('Deposit confirmed and wallet credited!');
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        queryClient.invalidateQueries({ queryKey: ['virtual-wallets'] });
        if (onSuccess) onSuccess(virtualWallet);
        setTimeout(() => {
          onOpenChange(false);
        }, 3000);
      }
    };
    socket.on('wallet:depositConfirmed', handler);
    return () => {
      socket.off('wallet:depositConfirmed', handler);
    };
  }, [socket, open, virtualWallet, queryClient, onSuccess, onOpenChange, isListening]);

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Please enter a valid amount (minimum ₦100)');
      return;
    }

    try {
      const result = await createVirtualWallet.mutateAsync({
        amount: parseFloat(amount),
        expireTimeInMin: 30,
      });
      
      setVirtualWallet(result);
      setStep('payment');
      setTimeRemaining(formatTimeRemaining(result.expiresAt));
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setVirtualWallet(null);
    setTimeRemaining('');
    setProgress(100);
    setIsExpired(false);
    onOpenChange(false);
  };

  const handleCreateNew = () => {
    setStep('amount');
    setVirtualWallet(null);
    setTimeRemaining('');
    setProgress(100);
    setIsExpired(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            NGN Wallet Deposit
          </DialogTitle>
          <DialogDescription>
            {step === 'amount' && 'Enter the amount you want to deposit'}
            {step === 'payment' && 'Complete your payment using the details below'}
            {step === 'completed' && 'Your payment has been processed successfully'}
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
                <Label htmlFor="amount">Amount (NGN)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (minimum ₦100)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="100"
                  className="text-lg bg-white dark:bg-[#232526] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  A virtual bank account will be generated for your deposit. 
                  The account expires in 30 minutes after creation.
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
                  disabled={createVirtualWallet.isPending || !amount || parseFloat(amount) < 100}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {createVirtualWallet.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Payment'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && virtualWallet && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Timer and Progress */}
              <Card className={`border-2 py-5 ${isExpired ? 'border-red-200 bg-red-50 dark:bg-[#232526]/60' : 'border-green-200 bg-green-50 dark:bg-[#232526]/60'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      {isExpired ? 'Payment Expired' : 'Time Remaining'}
                    </span>
                    <Badge variant={isExpired ? 'destructive' : 'default'} className="text-sm">
                      {timeRemaining}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    {isExpired 
                      ? 'This payment link has expired. Please create a new one.'
                      : 'Complete your payment before the timer expires'
                    }
                  </p>
                </CardContent>
              </Card>

              {!isExpired && (
                <>
                  {/* Amount */}
                  <Card className='py-5'>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        ₦{virtualWallet.amount.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Transfer exactly this amount to the account below
                      </p>
                    </CardContent>
                  </Card>

                  {/* Bank Details */}
                  <Card className='py-5 bg-white/90 dark:bg-[#232526]/90'>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Bank Transfer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Bank Name</Label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#232526]/60 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{virtualWallet.bank}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(virtualWallet.bank || '', 'Bank name')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Account Number</Label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#232526]/60 rounded-lg">
                          <span className="font-mono text-lg font-medium text-gray-900 dark:text-gray-100">{virtualWallet.virtualAcctNo}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(virtualWallet.virtualAcctNo || '', 'Account number')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Account Name</Label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#232526]/60 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{virtualWallet.virtualAcctName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(virtualWallet.virtualAcctName || '', 'Account name')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instructions */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Transfer exactly ₦{virtualWallet.amount.toLocaleString()} 
                      to the account above. Your wallet will be credited automatically once payment is confirmed.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {isExpired && (
                    <Button
                      onClick={handleCreateNew}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Create New Payment
                    </Button>
                  )}
                </div>
                {!isExpired && !isListening && (
                  <Button
                    onClick={() => setIsListening(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  >
                    I have sent the money
                  </Button>
                )}
                {isListening && (
                  <div className="flex flex-col items-center gap-3 mt-2 p-4 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    <p className="text-blue-700 dark:text-blue-300 font-medium">{processingMsg || 'Processing your transaction...'}</p>
                    <Button
                      variant="outline"
                      onClick={() => { setIsListening(false); setProcessingMsg(''); }}
                      className="mt-2"
                    >
                      Stop Waiting
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 py-5">
                <CardContent className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    Your deposit of ₦{amount ? parseFloat(amount).toLocaleString() : '0'} has been confirmed 
                    and your wallet has been credited.
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    This dialog will close automatically in a few seconds.
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 