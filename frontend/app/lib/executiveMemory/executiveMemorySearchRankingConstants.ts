/**
 * APP-4:9 — Executive Memory Search & Ranking constants.
 */

export const EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION = "APP-4/9" as const;
export const EXECUTIVE_MEMORY_SEARCH_RANKING_ARCHITECTURE_VERSION = "APP-4/9-search-ranking-arch" as const;
export const EXECUTIVE_MEMORY_SEARCH_RANKING_SCHEMA_VERSION = "1.0.0" as const;

export const EXECUTIVE_MEMORY_SEARCH_RANKING_TAGS = Object.freeze([
  "[APP4_9]",
  "[SEARCH_RANKING]",
  "[EXECUTIVE_MEMORY]",
  "[DETERMINISTIC]",
  "[NO_SEMANTIC]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS = Object.freeze([
  "exact_identifier_match",
  "workspace_match",
  "intent_linkage",
  "scenario_linkage",
  "decision_linkage",
  "context_linkage",
  "confidence_score",
  "record_freshness",
  "active_state",
  "metadata_completeness",
] as const);

export const EXECUTIVE_MEMORY_RANKING_PROFILE_IDS = Object.freeze({
  default: "default",
  recentFirst: "recent_first",
  highestConfidence: "highest_confidence",
  intentFocus: "intent_focus",
  scenarioFocus: "scenario_focus",
  decisionFocus: "decision_focus",
  contextFocus: "context_focus",
} as const);

export const EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES = Object.freeze({
  invalidSearchQuery: "invalid_search_query",
  unsupportedRankingProfile: "unsupported_ranking_profile",
  invalidRankingRule: "invalid_ranking_rule",
  malformedFilter: "malformed_filter",
  validationFailure: "validation_failure",
  duplicateRankingProfile: "duplicate_ranking_profile",
  retrievalFailure: "retrieval_failure",
} as const);

export const EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS = Object.freeze({
  minConfidenceScore: 0,
  maxConfidenceScore: 1,
  minRuleWeight: 0,
  maxRuleWeight: 100,
  defaultLimit: 50,
  maxLimit: 500,
  maxProfileRules: 16,
  maxTitleLength: 256,
} as const);
