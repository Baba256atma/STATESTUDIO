export const IDENTITY_AUDIT_CONTRACT_VERSION = "IDN-8" as const;

export const AUDIT_ACTIONS = Object.freeze([
  "identity.created",
  "identity.updated",
  "identity.archived",
  "identity.deleted",
  "role.assigned",
  "role.revoked",
  "permission.assigned",
  "permission.revoked",
  "authorization.evaluated",
  "session.created",
  "session.closed",
] as const);

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_LIFECYCLE_STATES = Object.freeze([
  "Recorded",
  "Validated",
  "Rejected",
  "Archived",
] as const);

export type AuditLifecycleState = (typeof AUDIT_LIFECYCLE_STATES)[number];
