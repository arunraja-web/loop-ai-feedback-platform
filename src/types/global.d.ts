/**
 * Global ambient type declarations for Project LOOP.
 * Extends built-in browser and Node.js globals where needed.
 */

// ---------------------------------------------------------------------------
// Environment variables — keeps TypeScript aware of process.env shape
// ---------------------------------------------------------------------------

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DATABASE_URL: string;
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL: string;
    readonly ANTHROPIC_API_KEY: string;
    /** Optional: base URL used for absolute links in emails / exports */
    readonly NEXT_PUBLIC_APP_URL?: string;
  }
}

// ---------------------------------------------------------------------------
// Utility type helpers used across the codebase
// ---------------------------------------------------------------------------

/** Makes specified keys required on an otherwise partial type. */
export type RequireFields<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/** Makes specified keys optional on an otherwise full type. */
export type PartialFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/** Extracts the resolved value of a Promise type. */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/** A dictionary / record with string keys and a uniform value type. */
export type Dictionary<T = unknown> = Record<string, T>;

/** Represents a value that may be null or undefined. */
export type Nullable<T> = T | null | undefined;

/** Strict object — disallows unknown keys at the call site. */
export type StrictObject<T> = { [K in keyof T]: T[K] };

/** Extracts values of an object type as a union. */
export type ValueOf<T> = T[keyof T];

/** Makes every nested property optional (deep partial). */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// ---------------------------------------------------------------------------
// Component / UI helpers
// ---------------------------------------------------------------------------

/** Generic children prop — avoids importing React.PropsWithChildren everywhere. */
export interface WithChildren {
  children: React.ReactNode;
}

/** Generic className prop. */
export interface WithClassName {
  className?: string;
}

/** Combined convenience base for most presentational components. */
export interface BaseComponentProps extends WithChildren, WithClassName {}
