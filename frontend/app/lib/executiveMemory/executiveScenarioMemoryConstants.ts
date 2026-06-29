/**
 * APP-4:6 — Executive Scenario Memory constants.
 */

export const EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION = "APP-4/6" as const;
export const EXECUTIVE_SCENARIO_MEMORY_ARCHITECTURE_VERSION = "APP-4/6-scenario-memory-arch" as const;
export const EXECUTIVE_SCENARIO_MEMORY_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_SCENARIO_MEMORY_TAGS = Object.freeze([
  "[APP4_6]",
  "[SCENARIO_MEMORY]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[NO_SIMULATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_SCENARIO_MEMORY_STATE_KEYS = Object.freeze(["active", "archived"] as const);

export const EXECUTIVE_SCENARIO_MEMORY_REFERENCE_TYPE_KEYS = Object.freeze([
  "scenario",
  "goal",
  "intent",
  "decision",
  "risk",
  "kpi",
  "object",
  "relationship",
  "timeline",
  "executive_memory",
  "evidence",
  "custom",
] as const);

export const EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES = Object.freeze({
  missingScenario: "missing_scenario",
  duplicateMemory: "duplicate_memory",
  invalidReferences: "invalid_references",
  invalidMetadata: "invalid_metadata",
  invalidLifecycle: "invalid_lifecycle",
  validationFailure: "validation_failure",
  memoryNotFound: "memory_not_found",
  transactionRollback: "transaction_rollback",
  workspaceMismatch: "workspace_mismatch",
} as const);

export const EXECUTIVE_SCENARIO_MEMORY_LIMITS = Object.freeze({
  maxAssumptions: 32,
  maxOutcomes: 32,
  maxEvidence: 64,
  maxReferences: 128,
  maxExecutiveMemoryIds: 64,
  maxRiskIds: 64,
  maxKpiIds: 64,
  maxObjectIds: 64,
  maxRelationshipIds: 64,
  maxTimelineIds: 32,
  maxLessonsLearned: 32,
  maxConstraints: 32,
  maxTitleLength: 512,
  maxSummaryLength: 4096,
} as const);
