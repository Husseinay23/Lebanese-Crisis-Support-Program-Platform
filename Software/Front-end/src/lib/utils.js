import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Function to combine class names and resolve conflicts in Tailwind
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Function to format currency in USD format
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Optional: Additional utility functions

// Example for handling numbers with comma separation (e.g., 1,000,000)
export function formatNumber(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

// Example for handling date formatting (default format YYYY-MM-DD)
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}

// You can also add any other utility function that you need across your components.

