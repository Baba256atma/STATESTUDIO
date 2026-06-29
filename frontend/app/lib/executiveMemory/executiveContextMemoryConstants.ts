/**
 * APP-4:8 — Executive Context Memory constants.
 */

export const EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION = "APP-4/8" as const;
export const EXECUTIVE_CONTEXT_MEMORY_ARCHITECTURE_VERSION = "APP-4/8-context-memory-arch" as const;
export const EXECUTIVE_CONTEXT_MEMORY_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_CONTEXT_MEMORY_TAGS = Object.freeze([
  "[APP4_8]",
  "[CONTEXT_MEMORY]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[NO_RECOMMENDATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_CONTEXT_MEMORY_STATE_KEYS = Object.freeze(["active", "archived"] as const);

export const EXECUTIVE_CONTEXT_MEMORY_REFERENCE_TYPE_KEYS = Object.freeze([
  "workspace",
  "goal",
  "intent",
  "scenario",
  "decision",
  "business_context",
  "stakeholder",
  "resource",
  "risk",
  "kpi",
  "timeline",
  "executive_memory",
  "external_event",
  "policy",
  "custom",
] as const);

export const EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES = Object.freeze({
  duplicateContext: "duplicate_context",
  invalidReferences: "invalid_references",
  invalidMetadata: "invalid_metadata",
  invalidLifecycle: "invalid_lifecycle",
  validationFailure: "validation_failure",
  memoryNotFound: "memory_not_found",
  transactionRollback: "transaction_rollback",
  workspaceMismatch: "workspace_mismatch",
  unregisteredWorkspace: "unregistered_workspace",
  invalidStakeholder: "invalid_stakeholder",
  invalidResource: "invalid_resource",
  invalidBusinessContext: "invalid_business_context",
} as const);

export const EXECUTIVE_CONTEXT_MEMORY_LIMITS = Object.freeze({
  maxAssumptions: 32,
  maxStakeholders: 64,
  maxResources: 64,
  maxExternalEvents: 32,
  maxPolicies: 32,
  maxReferences: 128,
  maxStrategicPriorities: 16,
  maxBusinessConstraints: 32,
  maxTitleLength: 512,
  maxSummaryLength: 4096,
  maxDescriptionLength: 8192,
} as const);
