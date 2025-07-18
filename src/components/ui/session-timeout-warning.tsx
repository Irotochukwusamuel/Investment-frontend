'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface SessionTimeoutWarningProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

export function SessionTimeoutWarning({ 
  isOpen, 
  onStayLoggedIn, 
  onLogout, 
  timeRemaining 
}: SessionTimeoutWarningProps) {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session will expire due to inactivity. Please choose an action to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">
                {formatTime(countdown)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Time remaining before automatic logout
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1"
          >
            Logout Now
          </Button>
          <Button
            onClick={onStayLoggedIn}
            className="flex-1 bg-amber-600 hover:bg-amber-700"
          >
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 