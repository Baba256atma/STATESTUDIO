/**
 * CC:10 — Commitment confirmation policy.
 */

import type { NexoraDecisionTransitionAction } from "./executiveDecisionTransition.ts";

export const NEXORA_DECISION_COMMITMENT_POLICY_OUTCOMES = Object.freeze([
  "confirmation-not-required",
  "confirmation-required",
  "commitment-blocked",
] as const);

export type NexoraDecisionCommitmentPolicyOutcome =
  (typeof NEXORA_DECISION_COMMITMENT_POLICY_OUTCOMES)[number];

export type NexoraDecisionCommitmentStrength =
  | "preference"
  | "soft"
  | "explicit";

export type NexoraDecisionCommitmentPolicyInput = {
  readonly strength: NexoraDecisionCommitmentStrength;
  readonly action: NexoraDecisionTransitionAction;
  readonly candidateValid: boolean;
  readonly scenarioStatus?: string | null;
  readonly hasCompoundExecutionRequest?: boolean;
};

export type NexoraDecisionCommitmentPolicyResult = {
  readonly outcome: NexoraDecisionCommitmentPolicyOutcome;
  readonly reasons: readonly string[];
};

/**
 * Explicit approve/choose/commit may apply directly.
 * Soft hedging ("I think we should probably…") requires confirmation.
 * Preference never reaches policy application (blocked earlier).
 * Unsupported scenarios are blocked (or confirmation only when explicitly allowed).
 */
export function resolveNexoraDecisionCommitmentPolicy(
  input: NexoraDecisionCommitmentPolicyInput,
): NexoraDecisionCommitmentPolicyResult {
  if (input.strength === "preference") {
    return Object.freeze({
      outcome: "commitment-blocked" as const,
      reasons: Object.freeze(["preference-only"]),
    });
  }

  if (!input.candidateValid) {
    return Object.freeze({
      outcome: "commitment-blocked" as const,
      reasons: Object.freeze(["invalid-candidate"]),
    });
  }

  if (input.scenarioStatus === "unsupported") {
    return Object.freeze({
      outcome: "commitment-blocked" as const,
      reasons: Object.freeze(["unsupported-scenario"]),
    });
  }

  if (input.scenarioStatus === "invalid") {
    return Object.freeze({
      outcome: "commitment-blocked" as const,
      reasons: Object.freeze(["invalid-scenario"]),
    });
  }

  if (input.strength === "soft") {
    return Object.freeze({
      outcome: "confirmation-required" as const,
      reasons: Object.freeze(["soft-commitment-language"]),
    });
  }

  // Explicit commitment is sufficient for create/approve/reject/defer/reconsider.
  return Object.freeze({
    outcome: "confirmation-not-required" as const,
    reasons: Object.freeze(["explicit-manager-commitment"]),
  });
}
