import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  // Handle null/undefined amounts
  if (amount === null || amount === undefined || isNaN(amount)) {
    amount = 0;
  }

  // Normalize currency codes and handle both uppercase and lowercase
  const normalizedCurrency = currency.toUpperCase();
  
  // Map common currency variations to standard codes
  const currencyMap: { [key: string]: string } = {
    'NAIRA': 'NGN',
    'NGN': 'NGN',
    'USDT': 'USD', // USDT is not a standard ISO currency code, use USD for formatting
    'USD': 'USD',
    'BITCOIN': 'USD', // Format as USD for now
    'BTC': 'USD', // Format as USD for now
  };

  const finalCurrency = currencyMap[normalizedCurrency] || 'NGN'; // Default to NGN if unknown

  try {
    // Try to format with the specified currency
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: finalCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    const formatted = formatter.format(amount);
    
    // Handle special cases for display
    if (normalizedCurrency === 'USDT') {
      // Replace USD symbol with USDT label
      return formatted.replace(/^\$/, '').replace(/USD/, '') + ' USDT';
    } else if (normalizedCurrency === 'NAIRA' && finalCurrency === 'NGN') {
      // Keep NGN formatting as is
      return formatted;
    }
    
    return formatted;
  } catch (error) {
    // Fallback to simple number formatting if currency is invalid
    console.warn(`Invalid currency code: ${finalCurrency}, falling back to simple formatting`);
    
    const numberFormatter = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    // Provide appropriate symbols for known currencies
    const currencySymbols: { [key: string]: string } = {
      'NAIRA': '₦',
      'NGN': '₦',
      'USDT': '',
      'USD': '$',
    };
    
    const symbol = currencySymbols[normalizedCurrency] || normalizedCurrency;
    const formattedNumber = numberFormatter.format(amount);
    
    if (normalizedCurrency === 'USDT') {
      return `${formattedNumber} USDT`;
    } else {
      return `${symbol}${formattedNumber}`;
    }
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
