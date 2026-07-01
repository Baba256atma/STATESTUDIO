export const IDENTITY_CONTRACT_VERSION = "IDN-1" as const;

export const IDENTITY_TYPES = Object.freeze([
  "User",
  "Organization",
  "Workspace",
  "Project",
  "Object",
  "Agent",
  "Service",
  "API",
  "Session",
  "Tenant",
] as const);

export type IdentityType = (typeof IDENTITY_TYPES)[number];

export const IDENTITY_LIFECYCLE_STATES = Object.freeze([
  "Created",
  "Active",
  "Archived",
  "Deleted",
] as const);

export type IdentityLifecycleState = (typeof IDENTITY_LIFECYCLE_STATES)[number];

export const IDENTITY_SOURCES = Object.freeze([
  "system",
  "import",
  "migration",
  "manual",
  "integration",
] as const);

export type IdentitySource = (typeof IDENTITY_SOURCES)[number];

export type IdentityValidationSeverity = "error" | "warning";
