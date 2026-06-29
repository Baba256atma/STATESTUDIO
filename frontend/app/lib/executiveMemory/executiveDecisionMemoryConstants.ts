/**
 * APP-4:7 — Executive Decision Memory constants.
 */

export const EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION = "APP-4/7" as const;
export const EXECUTIVE_DECISION_MEMORY_ARCHITECTURE_VERSION = "APP-4/7-decision-memory-arch" as const;
export const EXECUTIVE_DECISION_MEMORY_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_DECISION_MEMORY_TAGS = Object.freeze([
  "[APP4_7]",
  "[DECISION_MEMORY]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[NO_RECOMMENDATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_DECISION_MEMORY_STATE_KEYS = Object.freeze(["active", "archived"] as const);

export const EXECUTIVE_DECISION_MEMORY_REFERENCE_TYPE_KEYS = Object.freeze([
  "decision",
  "goal",
  "intent",
  "scenario",
  "risk",
  "kpi",
  "object",
  "relationship",
  "timeline",
  "executive_memory",
  "evidence",
  "custom",
] as const);

export const EXECUTIVE_DECISION_MEMORY_CONFIDENCE_LEVEL_KEYS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
  "unknown",
] as const);

export const EXECUTIVE_DECISION_MEMORY_ERROR_CODES = Object.freeze({
  missingDecision: "missing_decision",
  duplicateMemory: "duplicate_memory",
  invalidReferences: "invalid_references",
  invalidConfidence: "invalid_confidence",
  invalidLifecycle: "invalid_lifecycle",
  validationFailure: "validation_failure",
  memoryNotFound: "memory_not_found",
  transactionRollback: "transaction_rollback",
  workspaceMismatch: "workspace_mismatch",
} as const);

export const EXECUTIVE_DECISION_MEMORY_LIMITS = Object.freeze({
  minConfidenceScore: 0,
  maxConfidenceScore: 1,
  maxAssumptions: 32,
  maxAlternatives: 16,
  maxEvidence: 64,
  maxReferences: 128,
  maxOutcomes: 32,
  maxLessonsLearned: 32,
  maxConstraints: 32,
  maxTitleLength: 512,
  maxSummaryLength: 4096,
  maxRationaleLength: 8192,
} as const);
