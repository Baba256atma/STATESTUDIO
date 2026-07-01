export const IDENTITY_SESSION_CONTRACT_VERSION = "IDN-7" as const;

export const SESSION_LIFECYCLE_STATES = Object.freeze([
  "Created",
  "Active",
  "Suspended",
  "Expired",
  "Revoked",
  "Closed",
] as const);

export type SessionLifecycleState = (typeof SESSION_LIFECYCLE_STATES)[number];
