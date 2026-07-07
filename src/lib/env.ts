import { z } from 'zod';

/**
 * Server-side environment variable validation.
 * Throws at startup if any required variable is missing or malformed.
 * Import `env` instead of `process.env` everywhere in server code.
 *
 * NEVER import this file in client components — it would expose secrets.
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .min(1, 'DATABASE_URL must not be empty')
    .url('DATABASE_URL must be a valid URL'),

  // NextAuth
  NEXTAUTH_SECRET: z
    .string({ required_error: 'NEXTAUTH_SECRET is required' })
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000'),

  // Anthropic Claude
  ANTHROPIC_API_KEY: z
    .string({ required_error: 'ANTHROPIC_API_KEY is required' })
    .min(1, 'ANTHROPIC_API_KEY must not be empty')
    .startsWith('sk-ant-', 'ANTHROPIC_API_KEY must start with sk-ant-'),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Optional public app URL (used in absolute links / exports)
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional(),
});

/** Inferred TypeScript type for the validated env object. */
export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n');

    throw new Error(
      `\n\n❌ Invalid environment variables:\n${formatted}\n\n` +
        `Copy .env.example to .env and fill in the required values.\n`
    );
  }

  return parsed.data;
}

/**
 * Validated, typed environment variables.
 * Throws at module load time if any required variable is missing.
 */
export const env = validateEnv();
