/**
 * APP-4:12 — Executive Memory Dashboard constants.
 */

export const EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION = "APP-4/12" as const;
export const EXECUTIVE_MEMORY_DASHBOARD_ARCHITECTURE_VERSION =
  "APP-4/12-executive-memory-dashboard-arch" as const;
export const EXECUTIVE_MEMORY_DASHBOARD_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_MEMORY_DASHBOARD_TAGS = Object.freeze([
  "[APP4_12]",
  "[DASHBOARD]",
  "[READ_ONLY]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_MEMORY_DASHBOARD_HEALTH_LEVELS = Object.freeze([
  "healthy",
  "warning",
  "critical",
] as const);

export const EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES = Object.freeze({
  aggregationFailure: "aggregation_failure",
  missingStatistics: "missing_statistics",
  integrityUnavailable: "integrity_unavailable",
  invalidDashboardSection: "invalid_dashboard_section",
  validationFailure: "validation_failure",
} as const);

export const EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS = Object.freeze({
  integrityViolationWarning: 1,
  integrityViolationCritical: 5,
  ungovernedRecordWarning: 1,
  archivedRatioWarning: 0.5,
  accessDenialWarning: 3,
  accessDenialCritical: 10,
} as const);

export const EXECUTIVE_MEMORY_DASHBOARD_CATEGORY_GROUPS = Object.freeze({
  intent: "intent",
  scenario: "scenario",
  decision: "decision",
  context: "business_context",
} as const);
