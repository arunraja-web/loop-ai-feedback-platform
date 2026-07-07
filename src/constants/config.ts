/**
 * Application-wide configuration constants.
 * Values here are safe to import on both server and client.
 * Secrets and env-specific URLs live in lib/env.ts instead.
 */

// ---------------------------------------------------------------------------
// Application metadata
// ---------------------------------------------------------------------------
export const APP_CONFIG = {
  NAME: 'LOOP',
  TAGLINE: 'Close the loop on customer feedback.',
  DESCRIPTION:
    'AI-powered customer feedback intelligence platform — classify, cluster, and act on what customers actually want.',
  VERSION: '1.0.0',
} as const;

// ---------------------------------------------------------------------------
// Pagination defaults
// ---------------------------------------------------------------------------
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const;

// ---------------------------------------------------------------------------
// Feedback ingestion
// ---------------------------------------------------------------------------
export const FEEDBACK_CONFIG = {
  /** Maximum characters allowed in the content field. */
  MAX_CONTENT_LENGTH: 10_000,
  /** Maximum characters allowed in the title field. */
  MAX_TITLE_LENGTH: 255,
  /** Max number of rows a single CSV upload may contain. */
  CSV_MAX_ROWS: 1_000,
  /** Accepted MIME types for CSV upload. */
  CSV_ACCEPTED_TYPES: ['text/csv', 'application/vnd.ms-excel'] as const,
  /** Required CSV columns (case-insensitive match). */
  CSV_REQUIRED_COLUMNS: ['content', 'channel'] as const,
  /** Optional CSV columns. */
  CSV_OPTIONAL_COLUMNS: ['title', 'customer_name', 'customer_email', 'created_at'] as const,
} as const;

// ---------------------------------------------------------------------------
// AI / Claude configuration
// ---------------------------------------------------------------------------
export const AI_CONFIG = {
  /** Claude model ID used across all AI features. */
  MODEL: 'claude-sonnet-4-5',
  /** Max tokens for classification responses. */
  CLASSIFY_MAX_TOKENS: 512,
  /** Max tokens for theme clustering. */
  CLUSTER_MAX_TOKENS: 1_024,
  /** Max tokens for Ask LOOP answers. */
  CHAT_MAX_TOKENS: 2_048,
  /** Max tokens for VoC report generation. */
  REPORT_MAX_TOKENS: 4_096,
  /** Top-K feedback items retrieved for RAG. */
  RAG_TOP_K: 10,
  /** Similarity threshold below which a result is discarded (cosine, 0–1). */
  RAG_SIMILARITY_THRESHOLD: 0.7,
  /** Number of retries on a failed Claude call before flagging for manual review. */
  CLASSIFY_RETRY_COUNT: 1,
} as const;

// ---------------------------------------------------------------------------
// Trend detection
// ---------------------------------------------------------------------------
export const TRENDS_CONFIG = {
  /** A theme is flagged as "spiking" if growth exceeds this percentage. */
  SPIKE_THRESHOLD_PERCENT: 50,
  /** Default comparison window in days (current vs previous). */
  DEFAULT_TREND_WINDOW_DAYS: 7,
} as const;

// ---------------------------------------------------------------------------
// Rate limiting (applied server-side per IP)
// ---------------------------------------------------------------------------
export const RATE_LIMIT = {
  /** Max requests per window for general API calls. */
  GENERAL_MAX: 60,
  /** Max requests per window for AI endpoints (more expensive). */
  AI_MAX: 20,
  /** Window duration in seconds. */
  WINDOW_SECONDS: 60,
} as const;

// ---------------------------------------------------------------------------
// Session / auth
// ---------------------------------------------------------------------------
export const AUTH_CONFIG = {
  /** JWT session max age in seconds (7 days). */
  SESSION_MAX_AGE: 7 * 24 * 60 * 60,
  /** Minimum password length enforced at signup. */
  MIN_PASSWORD_LENGTH: 8,
  /** bcrypt salt rounds. */
  BCRYPT_ROUNDS: 12,
} as const;

// ---------------------------------------------------------------------------
// Date / time
// ---------------------------------------------------------------------------
export const DATE_CONFIG = {
  /** Default locale for date formatting. */
  LOCALE: 'en-US',
  /** Default timezone label shown in the UI. */
  TIMEZONE_LABEL: 'UTC',
} as const;
