import type { IdentityScopeLevel } from "./identityScopeIndex.ts";

export const IDENTITY_PERMISSION_CONTRACT_VERSION = "IDN-5" as const;

export const PERMISSION_ACTIONS = Object.freeze([
  "read",
  "create",
  "update",
  "delete",
  "archive",
  "restore",
  "execute",
  "simulate",
  "compare",
  "export",
  "manage",
] as const);

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const PERMISSION_RESOURCES = Object.freeze([
  "identity",
  "organization",
  "workspace",
  "project",
  "object",
  "scenario",
  "dashboard",
  "assistant",
  "report",
  "dataSource",
  "service",
  "api",
] as const);

export type PermissionResource = (typeof PERMISSION_RESOURCES)[number];

export const PERMISSION_LIFECYCLE_STATES = Object.freeze([
  "Created",
  "Active",
  "Archived",
  "Revoked",
] as const);

export type PermissionLifecycleState = (typeof PERMISSION_LIFECYCLE_STATES)[number];

export const PERMISSION_SUBJECT_TYPES = Object.freeze(["Identity", "Role"] as const);

export type PermissionSubjectType = (typeof PERMISSION_SUBJECT_TYPES)[number];

export const PERMISSION_SCOPE_LEVELS = Object.freeze([
  "Global",
  "Tenant",
  "Organization",
  "Workspace",
  "Project",
] as const satisfies readonly IdentityScopeLevel[]);

export type PermissionScopeLevel = (typeof PERMISSION_SCOPE_LEVELS)[number];
