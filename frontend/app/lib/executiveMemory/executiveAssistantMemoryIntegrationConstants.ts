/**
 * APP-4:11 — Executive Assistant Memory Integration constants.
 */

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION = "APP-4/11" as const;
export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ARCHITECTURE_VERSION =
  "APP-4/11-assistant-memory-integration-arch" as const;
export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_TAGS = Object.freeze([
  "[APP4_11]",
  "[ASSISTANT_MEMORY]",
  "[READ_ONLY]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_ASSISTANT_MEMORY_PERMISSION_KEYS = Object.freeze([
  "read_allowed",
  "read_denied",
  "lifecycle_restricted",
  "archived_access",
  "locked_access",
] as const);

export const EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS = Object.freeze({
  executiveSummary: "assistant-executive-summary",
  decisionReview: "assistant-decision-review",
  scenarioReview: "assistant-scenario-review",
  contextReview: "assistant-context-review",
  timelineReview: "assistant-timeline-review",
} as const);

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES = Object.freeze({
  accessDenied: "access_denied",
  invalidRequest: "invalid_request",
  invalidProfile: "invalid_profile",
  lifecycleRestriction: "lifecycle_restriction",
  citationFailure: "citation_failure",
  validationFailure: "validation_failure",
  retrievalFailure: "retrieval_failure",
} as const);

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_LIMITS = Object.freeze({
  maxResults: 50,
  maxCitationReasons: 16,
} as const);
