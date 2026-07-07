import { FeedbackChannel, FeedbackStatus, Role, Sentiment } from '@prisma/client';
import { z } from 'zod';
import { FEEDBACK_CONFIG, AUTH_CONFIG } from '@/constants/config';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Validates a CUID or CUID2 style id string. */
export const idSchema = z
  .string({ required_error: 'ID is required' })
  .min(1, 'ID must not be empty');

/** ISO 8601 date string. */
export const isoDateSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO 8601 datetime string' });

/** Optional ISO 8601 date string. */
export const optionalIsoDateSchema = isoDateSchema.optional();

/** Non-empty trimmed string. */
export const nonEmptyStringSchema = z
  .string()
  .min(1, 'This field is required')
  .trim();

/** Email address. */
export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Must be a valid email address')
  .toLowerCase()
  .trim();

/** Password — enforces minimum length from config. */
export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(
    AUTH_CONFIG.MIN_PASSWORD_LENGTH,
    `Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters`
  );

// ---------------------------------------------------------------------------
// Enum schemas — derived from Prisma enums so they stay in sync
// ---------------------------------------------------------------------------

export const roleSchema = z.nativeEnum(Role, {
  errorMap: () => ({ message: 'Invalid role' }),
});

export const sentimentSchema = z.nativeEnum(Sentiment, {
  errorMap: () => ({ message: 'Invalid sentiment value' }),
});

export const feedbackStatusSchema = z.nativeEnum(FeedbackStatus, {
  errorMap: () => ({ message: 'Invalid feedback status' }),
});

export const feedbackChannelSchema = z.nativeEnum(FeedbackChannel, {
  errorMap: () => ({ message: 'Invalid feedback channel' }),
});

// ---------------------------------------------------------------------------
// Workspace
// ---------------------------------------------------------------------------

export const createWorkspaceSchema = z.object({
  name: nonEmptyStringSchema.max(100, 'Workspace name must be 100 characters or fewer'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

// ---------------------------------------------------------------------------
// User / Auth
// ---------------------------------------------------------------------------

export const signupSchema = z
  .object({
    name: nonEmptyStringSchema.max(100, 'Name must be 100 characters or fewer'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    workspaceName: nonEmptyStringSchema.max(100, 'Workspace name must be 100 characters or fewer'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const inviteUserSchema = z.object({
  name: nonEmptyStringSchema.max(100, 'Name must be 100 characters or fewer'),
  email: emailSchema,
  role: roleSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z
  .object({
    name: nonEmptyStringSchema.max(100, 'Name must be 100 characters or fewer').optional(),
    email: emailSchema.optional(),
    currentPassword: z.string().optional(),
    newPassword: passwordSchema.optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    { message: 'Current password is required to set a new password', path: ['currentPassword'] }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) return false;
      return true;
    },
    { message: 'New passwords do not match', path: ['confirmNewPassword'] }
  );

export const updateUserRoleSchema = z.object({
  role: roleSchema,
});

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export const createFeedbackSchema = z.object({
  title: nonEmptyStringSchema.max(
    FEEDBACK_CONFIG.MAX_TITLE_LENGTH,
    `Title must be ${FEEDBACK_CONFIG.MAX_TITLE_LENGTH} characters or fewer`
  ),
  content: nonEmptyStringSchema.max(
    FEEDBACK_CONFIG.MAX_CONTENT_LENGTH,
    `Content must be ${FEEDBACK_CONFIG.MAX_CONTENT_LENGTH} characters or fewer`
  ),
  channel: feedbackChannelSchema,
  customerName: z
    .string()
    .max(100, 'Customer name must be 100 characters or fewer')
    .optional(),
  customerEmail: emailSchema.optional(),
});

export const updateFeedbackSchema = z.object({
  title: z
    .string()
    .max(FEEDBACK_CONFIG.MAX_TITLE_LENGTH)
    .optional(),
  content: z
    .string()
    .max(FEEDBACK_CONFIG.MAX_CONTENT_LENGTH)
    .optional(),
  channel: feedbackChannelSchema.optional(),
  status: feedbackStatusSchema.optional(),
  sentiment: sentimentSchema.optional(),
  customerName: z.string().max(100).optional(),
  customerEmail: emailSchema.optional(),
});

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export const createThemeSchema = z.object({
  name: nonEmptyStringSchema.max(100, 'Theme name must be 100 characters or fewer'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
});

export const updateThemeSchema = createThemeSchema.partial();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

export const generateReportSchema = z.object({
  title: nonEmptyStringSchema.max(200, 'Report title must be 200 characters or fewer'),
  periodStart: isoDateSchema,
  periodEnd: isoDateSchema,
}).refine(
  (data) => new Date(data.periodStart) < new Date(data.periodEnd),
  { message: 'Period start must be before period end', path: ['periodEnd'] }
);

// ---------------------------------------------------------------------------
// Ask LOOP
// ---------------------------------------------------------------------------

export const askLoopSchema = z.object({
  question: nonEmptyStringSchema.max(1_000, 'Question must be 1000 characters or fewer'),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1),
      })
    )
    .max(20, 'Conversation history must not exceed 20 messages')
    .optional(),
});

export const semanticSearchSchema = z.object({
  query: nonEmptyStringSchema.max(500, 'Search query must be 500 characters or fewer'),
  topK: z.number().int().min(1).max(50).optional().default(10),
});
