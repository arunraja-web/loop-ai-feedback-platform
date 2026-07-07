import { Role } from '@prisma/client';

/**
 * RBAC permission definitions for Project LOOP.
 *
 * Roles (least → most privileged):
 *   VIEWER   — read-only access to feedback, themes, reports, dashboard.
 *   ANALYST  — all VIEWER permissions + write access to feedback/themes.
 *   ADMIN    — all ANALYST permissions + user/workspace management.
 */

// ---------------------------------------------------------------------------
// Permission keys
// ---------------------------------------------------------------------------
export const PERMISSIONS = {
  // Feedback
  FEEDBACK_VIEW: 'feedback:view',
  FEEDBACK_CREATE: 'feedback:create',
  FEEDBACK_EDIT: 'feedback:edit',
  FEEDBACK_DELETE: 'feedback:delete',
  FEEDBACK_IMPORT: 'feedback:import',
  FEEDBACK_RECLASSIFY: 'feedback:reclassify',

  // Themes
  THEMES_VIEW: 'themes:view',
  THEMES_CREATE: 'themes:create',
  THEMES_EDIT: 'themes:edit',
  THEMES_DELETE: 'themes:delete',
  THEMES_CLUSTER: 'themes:cluster',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_GENERATE: 'reports:generate',
  REPORTS_EXPORT: 'reports:export',

  // Ask LOOP
  ASK_LOOP_USE: 'ask-loop:use',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',

  // Inbox
  INBOX_VIEW: 'inbox:view',
  INBOX_TRIAGE: 'inbox:triage',

  // Settings — workspace
  SETTINGS_PROFILE: 'settings:profile',
  SETTINGS_WORKSPACE: 'settings:workspace',
  SETTINGS_TEAM: 'settings:team',

  // Admin — system-wide
  ADMIN_USERS: 'admin:users',
  ADMIN_WORKSPACES: 'admin:workspaces',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ---------------------------------------------------------------------------
// Role → permission maps
// ---------------------------------------------------------------------------

const VIEWER_PERMISSIONS: Permission[] = [
  PERMISSIONS.FEEDBACK_VIEW,
  PERMISSIONS.THEMES_VIEW,
  PERMISSIONS.REPORTS_VIEW,
  PERMISSIONS.REPORTS_EXPORT,
  PERMISSIONS.ASK_LOOP_USE,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.INBOX_VIEW,
  PERMISSIONS.SETTINGS_PROFILE,
];

const ANALYST_PERMISSIONS: Permission[] = [
  ...VIEWER_PERMISSIONS,
  PERMISSIONS.FEEDBACK_CREATE,
  PERMISSIONS.FEEDBACK_EDIT,
  PERMISSIONS.FEEDBACK_DELETE,
  PERMISSIONS.FEEDBACK_IMPORT,
  PERMISSIONS.FEEDBACK_RECLASSIFY,
  PERMISSIONS.THEMES_CREATE,
  PERMISSIONS.THEMES_EDIT,
  PERMISSIONS.THEMES_DELETE,
  PERMISSIONS.THEMES_CLUSTER,
  PERMISSIONS.REPORTS_GENERATE,
  PERMISSIONS.INBOX_TRIAGE,
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...ANALYST_PERMISSIONS,
  PERMISSIONS.SETTINGS_WORKSPACE,
  PERMISSIONS.SETTINGS_TEAM,
  PERMISSIONS.ADMIN_USERS,
  PERMISSIONS.ADMIN_WORKSPACES,
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.VIEWER]: VIEWER_PERMISSIONS,
  [Role.ANALYST]: ANALYST_PERMISSIONS,
  [Role.ADMIN]: ADMIN_PERMISSIONS,
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Returns true if the given role has the requested permission. */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** Returns true if the given role has ALL of the requested permissions. */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/** Returns true if the given role has ANY of the requested permissions. */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// ---------------------------------------------------------------------------
// Display metadata
// ---------------------------------------------------------------------------

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Admin',
  [Role.ANALYST]: 'Analyst',
  [Role.VIEWER]: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.ADMIN]: 'Full access including team and workspace management.',
  [Role.ANALYST]:
    'Can ingest, classify, and manage feedback and themes. Cannot manage team members.',
  [Role.VIEWER]: 'Read-only access. Cannot create or modify any data.',
};

/** Ordered from least to most privileged — useful for role selectors. */
export const ROLE_OPTIONS: Array<{ value: Role; label: string; description: string }> =
  [
    {
      value: Role.VIEWER,
      label: ROLE_LABELS[Role.VIEWER],
      description: ROLE_DESCRIPTIONS[Role.VIEWER],
    },
    {
      value: Role.ANALYST,
      label: ROLE_LABELS[Role.ANALYST],
      description: ROLE_DESCRIPTIONS[Role.ANALYST],
    },
    {
      value: Role.ADMIN,
      label: ROLE_LABELS[Role.ADMIN],
      description: ROLE_DESCRIPTIONS[Role.ADMIN],
    },
  ];
