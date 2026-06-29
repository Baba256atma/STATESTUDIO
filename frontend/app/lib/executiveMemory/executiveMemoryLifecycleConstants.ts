/**
 * APP-4:10 — Executive Memory Lifecycle constants.
 */

export const EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION = "APP-4/10" as const;
export const EXECUTIVE_MEMORY_LIFECYCLE_ARCHITECTURE_VERSION = "APP-4/10-lifecycle-arch" as const;
export const EXECUTIVE_MEMORY_LIFECYCLE_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_MEMORY_LIFECYCLE_TAGS = Object.freeze([
  "[APP4_10]",
  "[LIFECYCLE]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[GOVERNANCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_MEMORY_LIFECYCLE_STATE_KEYS = Object.freeze([
  "draft",
  "active",
  "archived",
  "superseded",
  "merged",
  "split",
  "locked",
] as const);

export const EXECUTIVE_MEMORY_LIFECYCLE_VERSION_OPERATION_KEYS = Object.freeze([
  "create",
  "update",
  "merge",
  "split",
  "supersede",
  "archive",
  "restore",
] as const);

export const EXECUTIVE_MEMORY_RETENTION_POLICY_TYPE_KEYS = Object.freeze([
  "keep_forever",
  "archive_after_period",
  "protected_memory",
  "temporary_memory",
  "regulatory_retention",
] as const);

export const EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES = Object.freeze({
  invalidTransition: "invalid_transition",
  mergeConflict: "merge_conflict",
  splitFailure: "split_failure",
  integrityViolation: "integrity_violation",
  invalidRetentionPolicy: "invalid_retention_policy",
  invalidVersionChain: "invalid_version_chain",
  validationFailure: "validation_failure",
  memoryNotFound: "memory_not_found",
  transactionRollback: "transaction_rollback",
  supersedeConflict: "supersede_conflict",
} as const);

export const EXECUTIVE_MEMORY_LIFECYCLE_LIMITS = Object.freeze({
  maxMergeSources: 16,
  minSplitTargets: 2,
  maxSplitTargets: 8,
  maxVersionHistory: 128,
  maxAuthorLength: 256,
  maxPolicyLabelLength: 256,
} as const);

export const EXECUTIVE_MEMORY_RETENTION_POLICY_IDS = Object.freeze({
  keepForever: "retention-keep-forever",
  archiveAfterPeriod: "retention-archive-after-period",
  protectedMemory: "retention-protected-memory",
  temporaryMemory: "retention-temporary-memory",
  regulatoryRetention: "retention-regulatory-retention",
} as const);
