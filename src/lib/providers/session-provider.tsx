'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSessionTimeout } from '../hooks/useAuth';

interface SessionContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => void;
  checkAuth: () => Promise<void>;
  showWarning: boolean;
  resetSessionTimer: () => void;
  lastActivity: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { resetSessionTimer, lastActivity } = useSessionTimeout();

  return (
    <SessionContext.Provider value={{ ...auth, resetSessionTimer, lastActivity }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 