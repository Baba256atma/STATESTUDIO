import type { IdentityScopeLevel } from "./identityScopeIndex.ts";

export const IDENTITY_ROLE_CONTRACT_VERSION = "IDN-4" as const;

export const IDENTITY_ROLES = Object.freeze([
  "Owner",
  "Executive",
  "Admin",
  "Manager",
  "Analyst",
  "Operator",
  "Advisor",
  "Viewer",
  "Service",
  "Agent",
] as const);

export type IdentityRoleName = (typeof IDENTITY_ROLES)[number];

export const ROLE_LIFECYCLE_STATES = Object.freeze([
  "Created",
  "Active",
  "Archived",
  "Revoked",
] as const);

export type RoleLifecycleState = (typeof ROLE_LIFECYCLE_STATES)[number];

export const ROLE_SCOPE_LEVELS = Object.freeze([
  "Global",
  "Tenant",
  "Organization",
  "Workspace",
  "Project",
] as const satisfies readonly IdentityScopeLevel[]);

export type RoleScopeLevel = (typeof ROLE_SCOPE_LEVELS)[number];

export const CANONICAL_ROLE_SCOPE_ALLOWANCES = Object.freeze({
  Owner: ["Global", "Tenant", "Organization", "Workspace", "Project"],
  Executive: ["Tenant", "Organization", "Workspace"],
  Admin: ["Tenant", "Organization", "Workspace", "Project"],
  Manager: ["Organization", "Workspace", "Project"],
  Analyst: ["Organization", "Workspace", "Project"],
  Operator: ["Workspace", "Project"],
  Advisor: ["Tenant", "Organization", "Workspace", "Project"],
  Viewer: ["Global", "Tenant", "Organization", "Workspace", "Project"],
  Service: ["Global", "Tenant", "Organization", "Workspace"],
  Agent: ["Workspace", "Project"],
} as const satisfies Readonly<Record<IdentityRoleName, readonly RoleScopeLevel[]>>);
