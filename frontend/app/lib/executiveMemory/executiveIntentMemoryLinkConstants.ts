/**
 * APP-4:5 — Executive Intent ↔ Memory linking constants.
 */

export const EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION = "APP-4/5" as const;
export const EXECUTIVE_INTENT_MEMORY_LINK_ARCHITECTURE_VERSION = "APP-4/5-link-arch" as const;

export const EXECUTIVE_INTENT_MEMORY_LINK_TAGS = Object.freeze([
  "[APP4_5]",
  "[INTENT_MEMORY_LINKING]",
  "[LINK_ENGINE]",
  "[DETERMINISTIC_LINKS]",
  "[NO_SEMANTIC_MATCHING]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INTENT_MEMORY_LINK_TYPE_KEYS = Object.freeze([
  "primary",
  "supporting",
  "historical",
  "follow_up",
  "alternative",
  "reference",
  "derived",
  "archived",
] as const);

export const EXECUTIVE_INTENT_MEMORY_LINK_RELATIONSHIP_KEYS = Object.freeze([
  "intent_memory",
  "intent_goal",
  "intent_scenario",
  "intent_decision",
  "intent_evidence",
  "intent_business_context",
  "intent_reference",
] as const);

export const EXECUTIVE_INTENT_MEMORY_LINK_STATE_KEYS = Object.freeze(["active", "archived"] as const);

export const EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES = Object.freeze({
  duplicateLink: "duplicate_link",
  missingIntent: "missing_intent",
  missingMemory: "missing_memory",
  invalidLinkType: "invalid_link_type",
  invalidLifecycle: "invalid_lifecycle",
  validationFailure: "validation_failure",
  linkNotFound: "link_not_found",
  selfLinkProhibited: "self_link_prohibited",
  orphanLink: "orphan_link",
  transactionRollback: "transaction_rollback",
} as const);

export const EXECUTIVE_INTENT_MEMORY_LINK_LIMITS = Object.freeze({
  maxNotesLength: 4096,
  maxLabelLength: 512,
  maxCustomMetadataKeys: 32,
} as const);
