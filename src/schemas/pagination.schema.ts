import { z } from 'zod';
import { PAGINATION } from '@/constants/config';

/**
 * Reusable pagination + filtering schemas.
 * These are composed into feature-specific query schemas at the API layer.
 */

// ---------------------------------------------------------------------------
// Core pagination
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : PAGINATION.DEFAULT_PAGE))
    .pipe(
      z
        .number()
        .int('Page must be an integer')
        .min(1, 'Page must be at least 1')
    ),

  pageSize: z
    .string()
    .optional()
    .transform((val) =>
      val ? parseInt(val, 10) : PAGINATION.DEFAULT_PAGE_SIZE
    )
    .pipe(
      z
        .number()
        .int('Page size must be an integer')
        .min(1, 'Page size must be at least 1')
        .max(
          PAGINATION.MAX_PAGE_SIZE,
          `Page size must be at most ${PAGINATION.MAX_PAGE_SIZE}`
        )
    ),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ---------------------------------------------------------------------------
// Date range filter
// ---------------------------------------------------------------------------

export const dateRangeSchema = z
  .object({
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return new Date(data.dateFrom) <= new Date(data.dateTo);
      }
      return true;
    },
    { message: 'dateFrom must be before or equal to dateTo', path: ['dateTo'] }
  );

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// ---------------------------------------------------------------------------
// Feedback inbox filters (pagination + all filterable fields)
// ---------------------------------------------------------------------------

export const feedbackFiltersSchema = paginationSchema
  .merge(dateRangeSchema)
  .extend({
    search: z
      .string()
      .max(200, 'Search query must be 200 characters or fewer')
      .optional(),

    channel: z
      .enum([
        'SURVEY',
        'EMAIL',
        'APP_REVIEW',
        'SUPPORT',
        'SOCIAL_MEDIA',
        'OTHER',
      ])
      .optional(),

    sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']).optional(),

    status: z.enum(['NEW', 'REVIEWED', 'ACTIONED']).optional(),

    themeId: z.string().optional(),
  });

export type FeedbackFiltersInput = z.infer<typeof feedbackFiltersSchema>;

// ---------------------------------------------------------------------------
// Helper: build a PaginationMeta object from counts + query params
// ---------------------------------------------------------------------------

export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number
) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
