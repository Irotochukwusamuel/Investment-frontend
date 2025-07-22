'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BarChart3, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface InvestmentConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment?: {
    id: string;
    plan: {
      name: string;
      currency: 'naira' | 'usdt';
    };
    amount: number;
    currency: 'naira' | 'usdt';
    dailyRoi: number;
    totalRoi: number;
    duration: number;
    startDate: string;
    expectedReturn: number;
  };
}

const formatCurrency = (amount: number, currency: 'naira' | 'usdt') => {
  const symbol = currency === 'naira' ? '₦' : '$';
  return `${symbol}${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export function InvestmentConfirmationModal({ 
  open, 
  onOpenChange, 
  investment 
}: InvestmentConfirmationModalProps) {
  if (!investment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-green-800">
            Investment Confirmed!
          </DialogTitle>
          <p className="text-green-700">Your Investment is Now Active</p>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Investment Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Investment Plan:</span>
                  <span className="font-semibold">{investment.plan.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Invested:</span>
                  <span className="font-semibold">{formatCurrency(investment.amount, investment.currency)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily ROI:</span>
                  <span className="font-semibold text-green-600">{investment.dailyRoi}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-semibold">{investment.duration} days</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="font-semibold">{formatDate(investment.startDate)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected Total ROI:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(investment.expectedReturn, investment.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              What happens next?
            </h4>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your investment starts earning daily returns</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>You'll receive ROI payments according to your plan</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Track your progress in your dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                // Navigate to investments page
                window.location.href = '/dashboard/investments';
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              View Investments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 