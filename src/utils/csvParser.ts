import Papa from 'papaparse';
import { FeedbackChannel } from '@prisma/client';
import { FEEDBACK_CONFIG } from '@/constants/config';
import { createFeedbackSchema } from '@/schemas/common.schema';

/**
 * Represents one row in the CSV after parsing.
 * Column names are normalised to lower_snake_case.
 */
export interface CsvFeedbackRow {
  title?: string;
  content: string;
  channel: string;
  customer_name?: string;
  customer_email?: string;
  created_at?: string;
}

/** A successfully validated and mapped row ready for DB insertion. */
export interface ParsedFeedbackRow {
  title: string;
  content: string;
  channel: FeedbackChannel;
  customerName?: string;
  customerEmail?: string;
  createdAt?: Date;
}

/** One row-level parse failure with a human-readable reason. */
export interface ParseRowError {
  row: number; // 1-indexed (excluding header)
  reason: string;
}

export interface CsvParseResult {
  rows: ParsedFeedbackRow[];
  errors: ParseRowError[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Normalises a raw header string: trim, lowercase, replace spaces with _. */
function normaliseHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, '_');
}

/** Maps a raw channel string to a FeedbackChannel enum value (case-insensitive). */
function resolveChannel(raw: string): FeedbackChannel | null {
  const upper = raw.trim().toUpperCase().replace(/[^A-Z_]/g, '_');
  if (Object.values(FeedbackChannel).includes(upper as FeedbackChannel)) {
    return upper as FeedbackChannel;
  }

  // Fuzzy aliases
  const aliases: Record<string, FeedbackChannel> = {
    SUPPORT_TICKET: FeedbackChannel.SUPPORT,
    TICKET: FeedbackChannel.SUPPORT,
    APP_STORE: FeedbackChannel.APP_REVIEW,
    REVIEW: FeedbackChannel.APP_REVIEW,
    NPS: FeedbackChannel.SURVEY,
    CSAT: FeedbackChannel.SURVEY,
    SOCIAL: FeedbackChannel.SOCIAL_MEDIA,
    TWITTER: FeedbackChannel.SOCIAL_MEDIA,
    SALES: FeedbackChannel.OTHER,
    CALL: FeedbackChannel.OTHER,
  };

  return aliases[upper] ?? null;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Parses a CSV string (from a file upload) into validated feedback rows.
 *
 * - Normalises column headers (case-insensitive, trims whitespace).
 * - Validates each row with the createFeedbackSchema via Zod.
 * - Returns both valid rows and per-row errors so the API can report them.
 * - Respects FEEDBACK_CONFIG.CSV_MAX_ROWS.
 */
export function parseFeedbackCsv(csvText: string): CsvParseResult {
  const result: CsvParseResult = { rows: [], errors: [] };

  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: normaliseHeader,
  });

  // PapaParse-level structural errors (bad CSV syntax)
  if (parsed.errors.length > 0) {
    const fatal = parsed.errors.find((e) => e.type === 'Delimiter' || e.type === 'Quotes');
    if (fatal) {
      result.errors.push({ row: 0, reason: `CSV parse error: ${fatal.message}` });
      return result;
    }
  }

  const data = parsed.data;

  // Validate required columns exist in the header
  const headers = Object.keys(data[0] ?? {});
  for (const required of FEEDBACK_CONFIG.CSV_REQUIRED_COLUMNS) {
    if (!headers.includes(required)) {
      result.errors.push({
        row: 0,
        reason: `Missing required column: "${required}". Required columns: ${FEEDBACK_CONFIG.CSV_REQUIRED_COLUMNS.join(', ')}.`,
      });
      return result;
    }
  }

  // Row limit guard
  const rows = data.slice(0, FEEDBACK_CONFIG.CSV_MAX_ROWS);
  const truncated = data.length > FEEDBACK_CONFIG.CSV_MAX_ROWS;

  rows.forEach((raw, index) => {
    const rowNumber = index + 1; // 1-indexed for user-facing messages

    const channel = resolveChannel(raw.channel ?? '');
    if (!channel) {
      result.errors.push({
        row: rowNumber,
        reason: `Invalid channel "${raw.channel}". Valid values: ${Object.values(FeedbackChannel).join(', ')}.`,
      });
      return;
    }

    // Build a payload that matches createFeedbackSchema
    const payload = {
      title: raw.title?.trim() || raw.content?.trim().slice(0, 80) || '',
      content: raw.content?.trim() ?? '',
      channel,
      customerName: raw.customer_name?.trim() || undefined,
      customerEmail: raw.customer_email?.trim() || undefined,
    };

    const validation = createFeedbackSchema.safeParse(payload);
    if (!validation.success) {
      const messages = validation.error.errors.map((e) => e.message).join('; ');
      result.errors.push({ row: rowNumber, reason: messages });
      return;
    }

    const parsedRow: ParsedFeedbackRow = {
      ...validation.data,
      customerName: validation.data.customerName || undefined,
      customerEmail: validation.data.customerEmail || undefined,
    };

    // Optional: parse a provided created_at
    if (raw.created_at?.trim()) {
      const d = new Date(raw.created_at.trim());
      if (!isNaN(d.getTime())) {
        parsedRow.createdAt = d;
      }
    }

    result.rows.push(parsedRow);
  });

  if (truncated) {
    result.errors.push({
      row: 0,
      reason: `File contained more than ${FEEDBACK_CONFIG.CSV_MAX_ROWS} rows. Only the first ${FEEDBACK_CONFIG.CSV_MAX_ROWS} rows were processed.`,
    });
  }

  return result;
}
