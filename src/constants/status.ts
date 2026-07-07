import { FeedbackChannel, FeedbackStatus, Sentiment } from '@prisma/client';

/**
 * Display metadata for Prisma enums used across pages, filters, and badges.
 * Keeps all label / color / icon decisions in one place.
 */

// ---------------------------------------------------------------------------
// Feedback Status
// ---------------------------------------------------------------------------

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
  [FeedbackStatus.NEW]: 'New',
  [FeedbackStatus.REVIEWED]: 'Reviewed',
  [FeedbackStatus.ACTIONED]: 'Actioned',
};

/** Tailwind colour classes for status badges. */
export const STATUS_COLORS: Record<FeedbackStatus, string> = {
  [FeedbackStatus.NEW]: 'bg-blue-100 text-blue-800',
  [FeedbackStatus.REVIEWED]: 'bg-yellow-100 text-yellow-800',
  [FeedbackStatus.ACTIONED]: 'bg-green-100 text-green-800',
};

/** The valid next state(s) for each status — drives the inline workflow. */
export const STATUS_TRANSITIONS: Record<FeedbackStatus, FeedbackStatus[]> = {
  [FeedbackStatus.NEW]: [FeedbackStatus.REVIEWED],
  [FeedbackStatus.REVIEWED]: [FeedbackStatus.ACTIONED, FeedbackStatus.NEW],
  [FeedbackStatus.ACTIONED]: [FeedbackStatus.REVIEWED],
};

export const STATUS_OPTIONS: Array<{ value: FeedbackStatus; label: string }> =
  Object.values(FeedbackStatus).map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }));

// ---------------------------------------------------------------------------
// Sentiment
// ---------------------------------------------------------------------------

export const SENTIMENT_LABELS: Record<Sentiment, string> = {
  [Sentiment.POSITIVE]: 'Positive',
  [Sentiment.NEUTRAL]: 'Neutral',
  [Sentiment.NEGATIVE]: 'Negative',
};

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [Sentiment.POSITIVE]: 'bg-emerald-100 text-emerald-800',
  [Sentiment.NEUTRAL]: 'bg-slate-100 text-slate-700',
  [Sentiment.NEGATIVE]: 'bg-red-100 text-red-800',
};

/** Hex values used by Recharts chart fills. */
export const SENTIMENT_CHART_COLORS: Record<Sentiment, string> = {
  [Sentiment.POSITIVE]: '#10b981',
  [Sentiment.NEUTRAL]: '#94a3b8',
  [Sentiment.NEGATIVE]: '#ef4444',
};

export const SENTIMENT_OPTIONS: Array<{ value: Sentiment; label: string }> =
  Object.values(Sentiment).map((s) => ({
    value: s,
    label: SENTIMENT_LABELS[s],
  }));

// ---------------------------------------------------------------------------
// Feedback Channel
// ---------------------------------------------------------------------------

export const CHANNEL_LABELS: Record<FeedbackChannel, string> = {
  [FeedbackChannel.SURVEY]: 'Survey',
  [FeedbackChannel.EMAIL]: 'Email',
  [FeedbackChannel.APP_REVIEW]: 'App Review',
  [FeedbackChannel.SUPPORT]: 'Support Ticket',
  [FeedbackChannel.SOCIAL_MEDIA]: 'Social Media',
  [FeedbackChannel.OTHER]: 'Other',
};

export const CHANNEL_COLORS: Record<FeedbackChannel, string> = {
  [FeedbackChannel.SURVEY]: 'bg-purple-100 text-purple-800',
  [FeedbackChannel.EMAIL]: 'bg-indigo-100 text-indigo-800',
  [FeedbackChannel.APP_REVIEW]: 'bg-sky-100 text-sky-800',
  [FeedbackChannel.SUPPORT]: 'bg-orange-100 text-orange-800',
  [FeedbackChannel.SOCIAL_MEDIA]: 'bg-pink-100 text-pink-800',
  [FeedbackChannel.OTHER]: 'bg-slate-100 text-slate-700',
};

/** Hex values used by Recharts chart fills. */
export const CHANNEL_CHART_COLORS: Record<FeedbackChannel, string> = {
  [FeedbackChannel.SURVEY]: '#a855f7',
  [FeedbackChannel.EMAIL]: '#6366f1',
  [FeedbackChannel.APP_REVIEW]: '#0ea5e9',
  [FeedbackChannel.SUPPORT]: '#f97316',
  [FeedbackChannel.SOCIAL_MEDIA]: '#ec4899',
  [FeedbackChannel.OTHER]: '#94a3b8',
};

export const CHANNEL_OPTIONS: Array<{ value: FeedbackChannel; label: string }> =
  Object.values(FeedbackChannel).map((c) => ({
    value: c,
    label: CHANNEL_LABELS[c],
  }));
