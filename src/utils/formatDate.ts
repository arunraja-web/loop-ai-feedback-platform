import { DATE_CONFIG } from '@/constants/config';

/**
 * All date/time formatting utilities for Project LOOP.
 * Wraps the native Intl.DateTimeFormat API so formatting
 * is consistent across every page and component.
 */

type DateInput = Date | string | number;

/** Coerces a Date | string | number to a Date object. */
function toDate(value: DateInput): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

// ---------------------------------------------------------------------------
// Core formatters
// ---------------------------------------------------------------------------

/**
 * Returns "Jan 15, 2025" — used in tables and cards.
 */
export function formatDate(value: DateInput): string {
  return toDate(value).toLocaleDateString(DATE_CONFIG.LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns "Jan 15, 2025 at 3:42 PM" — used in detail views.
 */
export function formatDateTime(value: DateInput): string {
  return toDate(value).toLocaleString(DATE_CONFIG.LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Returns "3:42 PM" — used next to a date that is already displayed.
 */
export function formatTime(value: DateInput): string {
  return toDate(value).toLocaleTimeString(DATE_CONFIG.LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Returns "2025-01-15" (ISO date only, no time) — used in filter inputs.
 */
export function formatIsoDate(value: DateInput): string {
  return toDate(value).toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Relative time
// ---------------------------------------------------------------------------

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Returns a human-readable relative string like "2 hours ago" or "in 3 days".
 * Falls back to formatDate for differences greater than 1 year.
 */
export function formatRelative(value: DateInput): string {
  const now = Date.now();
  const then = toDate(value).getTime();
  const diff = now - then; // positive = past

  const abs = Math.abs(diff);
  const past = diff >= 0;

  const label = (n: number, unit: string) => {
    const rounded = Math.round(n);
    const unitStr = rounded === 1 ? unit : `${unit}s`;
    return past ? `${rounded} ${unitStr} ago` : `in ${rounded} ${unitStr}`;
  };

  if (abs < MINUTE) return 'just now';
  if (abs < HOUR) return label(abs / MINUTE, 'minute');
  if (abs < DAY) return label(abs / HOUR, 'hour');
  if (abs < WEEK) return label(abs / DAY, 'day');
  if (abs < MONTH) return label(abs / WEEK, 'week');
  if (abs < YEAR) return label(abs / MONTH, 'month');

  return formatDate(value);
}

// ---------------------------------------------------------------------------
// Period helpers (used by trends and report generation)
// ---------------------------------------------------------------------------

/**
 * Returns the start of the day (00:00:00.000) for the given date.
 */
export function startOfDay(value: DateInput): Date {
  const d = toDate(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date.
 */
export function endOfDay(value: DateInput): Date {
  const d = toDate(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Returns a Date that is `days` days before the given date.
 */
export function subtractDays(value: DateInput, days: number): Date {
  const d = toDate(value);
  return new Date(d.getTime() - days * 24 * 60 * 60 * 1_000);
}

/**
 * Returns { start, end } for the last N days (end = now).
 */
export function lastNDays(n: number): { start: Date; end: Date } {
  const end = new Date();
  const start = startOfDay(subtractDays(end, n - 1));
  return { start, end };
}

/**
 * Returns an array of ISO date strings (YYYY-MM-DD) between two dates inclusive.
 * Used to fill in zero-count days in volume charts.
 */
export function dateRange(start: DateInput, end: DateInput): string[] {
  const dates: string[] = [];
  const current = startOfDay(start);
  const last = startOfDay(end);

  while (current <= last) {
    dates.push(formatIsoDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
