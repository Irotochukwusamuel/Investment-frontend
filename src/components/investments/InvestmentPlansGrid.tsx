'use client';

import { useState } from 'react';
import { useInvestmentPlans } from '@/lib/hooks/useInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export function InvestmentPlansGrid() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  
  const { data: plans, isLoading } = useInvestmentPlans();

  const renderPlanCard = (plan: any) => {
    const isSelected = selectedPlan === plan.id;
    const amount = parseFloat(investmentAmount) || 0;
    const isValidAmount = amount >= plan.minAmount && amount <= plan.maxAmount;

    return (
      <Card 
        key={plan.id} 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setSelectedPlan(plan.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {plan.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Plan Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Daily ROI</p>
              <p className="font-semibold text-green-600">
                {formatPercentage(plan.dailyRoi)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total ROI</p>
              <p className="font-semibold text-blue-600">
                {formatPercentage(plan.totalRoi)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold">
                {plan.duration} days
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Currency</p>
              <p className="font-semibold uppercase">
                {plan.currency}
              </p>
            </div>
          </div>

          {/* Investment Range */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Investment Range</p>
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(plan.minAmount, plan.currency.toUpperCase())}</span>
              <span>{formatCurrency(plan.maxAmount, plan.currency.toUpperCase())}</span>
            </div>
            <Progress 
              value={plan.totalVolume > 0 ? (plan.totalVolume / plan.maxAmount) * 100 : 0} 
              className="h-2" 
            />
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Features</p>
              <div className="flex flex-wrap gap-1">
                {plan.features.slice(0, 3).map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {plan.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Plan Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{plan.totalInvestors} investors</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{formatCurrency(plan.totalVolume, plan.currency.toUpperCase())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div>Loading investment plans...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans && plans.length > 0 ? (
        plans.map((plan: any) => renderPlanCard(plan))
      ) : (
        <div>No investment plans available.</div>
      )}
    </div>
  );
} 