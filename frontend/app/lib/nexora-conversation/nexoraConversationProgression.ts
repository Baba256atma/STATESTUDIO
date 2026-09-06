/**
 * Semantic coverage, not turn count.
 * Reuses NEX-ENT-FIX2 depth vocabulary as the canonical progression states.
 */

export const NEXORA_CONVERSATION_COVERAGE = Object.freeze([
  "NONE",
  "INTRODUCTORY",
  "DEEPENED",
  "PRACTICAL",
  "SATURATED",
] as const);

export type NexoraConversationCoverage =
  (typeof NEXORA_CONVERSATION_COVERAGE)[number];

export function advanceConversationCoverage(
  current: NexoraConversationCoverage,
): NexoraConversationCoverage {
  if (current === "NONE") return "INTRODUCTORY";
  if (current === "INTRODUCTORY") return "DEEPENED";
  if (current === "DEEPENED") return "PRACTICAL";
  return "SATURATED";
}

export function conversationCoverageIsSaturated(
  coverage: NexoraConversationCoverage,
): boolean {
  return coverage === "SATURATED";
}

export function defaultMoveForCoverage(
  coverage: NexoraConversationCoverage,
): "ANSWER" | "DEEPEN" | "PROGRESS" | "CLARIFY" {
  if (coverage === "DEEPENED") return "DEEPEN";
  if (coverage === "PRACTICAL") return "PROGRESS";
  if (coverage === "SATURATED") return "CLARIFY";
  return "ANSWER";
}
