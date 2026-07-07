/**
 * Centralised route constants for the entire application.
 * Use these everywhere instead of raw strings to prevent typos
 * and make refactoring a single-file change.
 */

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

// ---------------------------------------------------------------------------
// Dashboard routes
// ---------------------------------------------------------------------------
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  FEEDBACK: {
    ROOT: '/feedback',
    NEW: '/feedback/new',
    IMPORT: '/feedback/import',
    DETAIL: (id: string) => `/feedback/${id}`,
  },
  INBOX: '/inbox',
  THEMES: {
    ROOT: '/themes',
    DETAIL: (id: string) => `/themes/${id}`,
  },
  ASK_LOOP: '/ask-loop',
  REPORTS: {
    ROOT: '/reports',
    DETAIL: (id: string) => `/reports/${id}`,
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
    WORKSPACE: '/settings/workspace',
    TEAM: '/settings/team',
    ROLES: '/settings/roles',
  },
  ADMIN: {
    USERS: '/admin/users',
    WORKSPACES: '/admin/workspaces',
  },
} as const;

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
export const API_ROUTES = {
  AUTH: {
    SESSION: '/api/auth/session',
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
  },
  FEEDBACK: {
    ROOT: '/api/feedback',
    DETAIL: (id: string) => `/api/feedback/${id}`,
    IMPORT: '/api/feedback/import',
  },
  INBOX: '/api/inbox',
  THEMES: {
    ROOT: '/api/themes',
    DETAIL: (id: string) => `/api/themes/${id}`,
  },
  REPORTS: {
    ROOT: '/api/reports',
    DETAIL: (id: string) => `/api/reports/${id}`,
    EXPORT: (id: string) => `/api/reports/${id}/export`,
  },
  ASK_LOOP: {
    CHAT: '/api/ask-loop/chat',
    SEARCH: '/api/ask-loop/search',
  },
  SETTINGS: {
    PROFILE: '/api/settings/profile',
    WORKSPACE: '/api/settings/workspace',
    TEAM: '/api/settings/team',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    WORKSPACES: '/api/admin/workspaces',
  },
} as const;

// ---------------------------------------------------------------------------
// Route guards — routes that require authentication
// ---------------------------------------------------------------------------
export const PROTECTED_ROUTE_PREFIXES = [
  '/dashboard',
  '/feedback',
  '/inbox',
  '/themes',
  '/ask-loop',
  '/reports',
  '/settings',
  '/admin',
] as const;

/** Routes that should redirect to dashboard if user is already logged in. */
export const PUBLIC_ONLY_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.FORGOT_PASSWORD,
] as const;

/** Default redirect after successful login. */
export const DEFAULT_LOGIN_REDIRECT = DASHBOARD_ROUTES.HOME;

/** Default redirect when user is unauthenticated. */
export const DEFAULT_AUTH_REDIRECT = AUTH_ROUTES.LOGIN;
