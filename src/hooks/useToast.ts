'use client';

import toast, { type ToastOptions } from 'react-hot-toast';

/**
 * Thin typed wrapper around react-hot-toast.
 *
 * Provides consistent styling options and pre-built helpers for the four
 * common toast variants used throughout LOOP: success, error, info, loading.
 *
 * Usage:
 *   const { success, error } = useToast();
 *   success('Feedback saved.');
 *   error('Something went wrong.');
 */

const BASE_OPTIONS: ToastOptions = {
  duration: 4_000,
  position: 'bottom-right',
};

const SUCCESS_OPTIONS: ToastOptions = {
  ...BASE_OPTIONS,
  style: {
    background: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    fontWeight: 500,
  },
  iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
};

const ERROR_OPTIONS: ToastOptions = {
  ...BASE_OPTIONS,
  duration: 6_000,
  style: {
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    fontWeight: 500,
  },
  iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
};

const INFO_OPTIONS: ToastOptions = {
  ...BASE_OPTIONS,
  style: {
    background: '#eff6ff',
    color: '#1e40af',
    border: '1px solid #bfdbfe',
    fontWeight: 500,
  },
  iconTheme: { primary: '#2563eb', secondary: '#eff6ff' },
};

export interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => Promise<T>;
}

export function useToast(): UseToastReturn {
  return {
    success: (message, options) =>
      toast.success(message, { ...SUCCESS_OPTIONS, ...options }),

    error: (message, options) =>
      toast.error(message, { ...ERROR_OPTIONS, ...options }),

    info: (message, options) =>
      toast(message, { ...INFO_OPTIONS, ...options }),

    loading: (message, options) =>
      toast.loading(message, { ...BASE_OPTIONS, ...options }),

    dismiss: (toastId) => toast.dismiss(toastId),

    promise: <T>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string }
    ) =>
      toast.promise(promise, messages, {
        success: SUCCESS_OPTIONS,
        error: ERROR_OPTIONS,
        loading: BASE_OPTIONS,
      }),
  };
}
