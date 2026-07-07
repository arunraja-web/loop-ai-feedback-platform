import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx (conditional class logic) with tailwind-merge
 * (deduplicates conflicting Tailwind classes).
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-indigo-600', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
