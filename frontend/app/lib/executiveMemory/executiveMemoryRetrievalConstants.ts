/**
 * APP-4:4 — Executive Memory retrieval constants.
 */

export const EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION = "APP-4/4" as const;
export const EXECUTIVE_MEMORY_RETRIEVAL_ARCHITECTURE_VERSION = "APP-4/4-retrieval-arch" as const;

export const EXECUTIVE_MEMORY_RETRIEVAL_TAGS = Object.freeze([
  "[APP4_4]",
  "[EXECUTIVE_MEMORY_RETRIEVAL]",
  "[RETRIEVAL_ENGINE]",
  "[DETERMINISTIC_QUERY]",
  "[NO_SEMANTIC_SEARCH]",
  "[NO_RANKING]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_MEMORY_QUERY_SORT_FIELDS = Object.freeze(["createdAt", "updatedAt", "id"] as const);
export const EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS = Object.freeze(["asc", "desc"] as const);

export const EXECUTIVE_MEMORY_RETRIEVAL_LIMITS = Object.freeze({
  defaultLimit: 100,
  maxLimit: 1000,
  maxOffset: 100000,
} as const);

export const EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES = Object.freeze({
  invalidQuery: "invalid_query",
  unsupportedFilter: "unsupported_filter",
  invalidSort: "invalid_sort",
  invalidPagination: "invalid_pagination",
  malformedIdentifier: "malformed_identifier",
  queryValidationFailure: "query_validation_failure",
} as const);

export const EXECUTIVE_MEMORY_RETRIEVAL_QUERY_TYPES = Object.freeze({
  byId: "by_id",
  find: "find",
  byWorkspace: "by_workspace",
  byGoal: "by_goal",
  byIntent: "by_intent",
  byScenario: "by_scenario",
  byDecision: "by_decision",
  byCategory: "by_category",
  byProvider: "by_provider",
  byReference: "by_reference",
  byTag: "by_tag",
  recent: "recent",
  count: "count",
} as const);
