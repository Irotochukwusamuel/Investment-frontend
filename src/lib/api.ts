import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not on a login/auth page
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (!currentPath.startsWith('/auth/')) {
        localStorage.removeItem('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints - Updated to match actual backend routes
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    resetPasswordOtp: '/auth/reset-password-otp',
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
  },
  
  // Users
  users: {
    all: '/users',
    create: '/users',
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile', 
    stats: '/users/stats',
    verifyEmail: (id: string) => `/users/${id}/verify-email`,
    resetPassword: (id: string) => `/users/${id}/reset-password`,
  },
  
  // Investment Plans
  plans: {
    all: '/plans',
    create: '/plans',
    byId: (id: string) => `/plans/${id}`,
    update: (id: string) => `/plans/${id}`,
    delete: (id: string) => `/plans/${id}`,
  },
  
  // Investments
  investments: {
    all: '/investments',
    my: '/investments/my',
    create: '/investments',
    byId: (id: string) => `/investments/${id}`,
    update: (id: string) => `/investments/${id}`,
    delete: (id: string) => `/investments/${id}`,
    complete: (id: string) => `/investments/${id}/complete`,
    cancel: (id: string) => `/investments/${id}/cancel`,
    updateRoi: (id: string) => `/investments/${id}/update-roi`,
    stats: '/investments/stats',
    active: '/investments/active',
    byCurrency: (currency: string) => `/investments/currency/${currency}`,
  },
  
  // Transactions
  transactions: {
    all: '/transactions',
    my: '/transactions/my',
    create: '/transactions',
    byId: (id: string) => `/transactions/${id}`,
    update: (id: string) => `/transactions/${id}`,
    delete: (id: string) => `/transactions/${id}`,
    process: (id: string) => `/transactions/${id}/process`,
  },
  
  // Wallet
  wallet: {
    all: '/wallets',
    create: '/wallets',
    byId: (id: string) => `/wallets/${id}`,
    update: (id: string) => `/wallets/${id}`,
    delete: (id: string) => `/wallets/${id}`,
    stats: '/wallets/stats',
    byUser: (userId: string) => `/wallets/user/${userId}`,
    deposit: (userId: string) => `/wallets/${userId}/deposit`,
    withdraw: (userId: string) => `/wallets/${userId}/withdraw`,
    transfer: (userId: string) => `/wallets/${userId}/transfer`,
  },
  
  // Health
  health: '/health',
};

// API response types
export interface ApiResponse<T = any> {
  message: string;
  data: T;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
export const handleApiResponse = <T>(response: any): T => {
  if (response.data && response.data.success !== false) {
    return response.data.data || response.data;
  }
  throw new ApiError(
    response.status,
    response.data?.message || 'An error occurred',
    response.data
  );
}; 