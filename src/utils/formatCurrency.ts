/**
 * Number and count formatting utilities used across dashboards and stat cards.
 * Named "formatCurrency" per the original scaffold but covers all numeric display.
 */

// ---------------------------------------------------------------------------
// Integer / count formatting
// ---------------------------------------------------------------------------

/**
 * Formats a large integer with locale-aware separators.
 * e.g. 1234567 → "1,234,567"
 */
export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/**
 * Compact notation for large numbers.
 * e.g. 1500 → "1.5K", 2_300_000 → "2.3M"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a value as a percentage string.
 * e.g. formatPercent(0.4278) → "42.8%"
 * e.g. formatPercent(42.78, false) → "42.8%" (already multiplied)
 */
export function formatPercent(
  value: number,
  isDecimal = true,
  decimals = 1
): string {
  const pct = isDecimal ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats a percentage change with a +/- sign and colour hint.
 * Returns { label: "+12.5%", positive: true }
 */
export function formatChange(current: number, previous: number): {
  label: string;
  positive: boolean;
  neutral: boolean;
} {
  if (previous === 0) {
    return { label: current > 0 ? '+∞%' : '—', positive: current > 0, neutral: current === 0 };
  }

  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  return {
    label: `${sign}${change.toFixed(1)}%`,
    positive: change > 0,
    neutral: change === 0,
  };
}

// ---------------------------------------------------------------------------
// Sentiment score (–1 to 1 float)
// ---------------------------------------------------------------------------

/**
 * Formats a sentiment score in the –1 to 1 range.
 * e.g. 0.82 → "+0.82", -0.34 → "-0.34"
 */
export function formatSentimentScore(score: number): string {
  const fixed = score.toFixed(2);
  return score > 0 ? `+${fixed}` : fixed;
}

// ---------------------------------------------------------------------------
// Duration
// ---------------------------------------------------------------------------

/**
 * Formats a duration in milliseconds to a readable string.
 * e.g. 90000 → "1m 30s", 4500 → "4.5s"
 */
export function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1_000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1_000);
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

// ---------------------------------------------------------------------------
// Truncation
// ---------------------------------------------------------------------------

/**
 * Truncates a string to maxLength and appends an ellipsis.
 * e.g. truncate("Hello world", 8) → "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Truncates feedback content for display in table rows.
 */
export function truncateFeedback(content: string): string {
  return truncate(content, 120);
}
