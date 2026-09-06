/**
 * Canonical Conversational Move vocabulary.
 * Semantic strategy, not wording and not a business action.
 */

export const NEXORA_CONVERSATIONAL_MOVES = Object.freeze([
  "ANSWER",
  "DEEPEN",
  "CONNECT",
  "OFFER_NEXT",
  "CLARIFY",
  "REPEAT",
  "EXPLAIN_WHY",
  "SHOW",
  "COMPARE",
  "INVESTIGATE",
  "CONTINUE",
  "SUMMARIZE",
] as const);

export type NexoraConversationalMove =
  (typeof NEXORA_CONVERSATIONAL_MOVES)[number];

export const NEXORA_CONVERSATION_PURPOSES = Object.freeze([
  "IDENTIFY",
  "WHY_PRESENT",
  "WHY_RELEVANT",
  "EXPLAIN",
  "COMPARE",
  "INVESTIGATE",
  "CAUSE",
  "CAPABILITY",
  "APPEARS",
  "FOCUS",
] as const);

export type NexoraConversationPurpose =
  (typeof NEXORA_CONVERSATION_PURPOSES)[number];

export const NEXORA_CONVERSATION_CAPABILITY_KINDS = Object.freeze([
  "SHOW",
  "COMPARE",
  "INVESTIGATE",
  "NEXT",
  "FOCUS",
] as const);

export type NexoraConversationCapabilityKind =
  (typeof NEXORA_CONVERSATION_CAPABILITY_KINDS)[number];

export const NEXORA_CONVERSATION_MOVE_REASONS = Object.freeze([
  "UNANSWERED_SUBJECT_PURPOSE",
  "PRIOR_IDENTITY_EXPLANATION_EXISTS",
  "PRIOR_WHY_EXPLANATION_EXISTS",
  "CONNECTED_COVERAGE_EXISTS",
  "SUBJECT_PURPOSE_SATURATED",
  "EXPLICIT_REPEAT_REQUESTED",
  "SHOW_UNSUPPORTED",
  "COMPARE_UNSUPPORTED",
  "PRESENTATION_NOT_DEMONSTRATED",
  "PENDING_OFFER_ACCEPTED",
  "PENDING_CLARIFICATION_RESOLVED",
  "NEW_MATERIAL_CONTEXT",
] as const);

export type NexoraConversationMoveReason =
  (typeof NEXORA_CONVERSATION_MOVE_REASONS)[number];
