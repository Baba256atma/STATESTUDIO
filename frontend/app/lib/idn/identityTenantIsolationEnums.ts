export const IDENTITY_TENANT_ISOLATION_CONTRACT_VERSION = "IDN-9" as const;

export const TENANT_BOUNDARY_LIFECYCLE_STATES = Object.freeze([
  "Active",
  "Suspended",
  "Archived",
  "Deleted",
] as const);

export type TenantBoundaryLifecycleState = (typeof TENANT_BOUNDARY_LIFECYCLE_STATES)[number];
