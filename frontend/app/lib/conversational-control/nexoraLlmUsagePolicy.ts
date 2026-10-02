/**
 * LLM-MVP:4 — provider-neutral usage policy contract (CC-facing).
 * Server remains the paid-call authority. This module does not call providers.
 */

export const nexoraLlmUsagePolicyIdentity =
  "LLM-MVP:4/UsagePolicyCostGuard" as const;

export const NEXORA_LLM_USAGE_POLICY_BOUNDARY = Object.freeze({
  identity: nexoraLlmUsagePolicyIdentity,
  isConversationAuthority: false as const,
  mutatesCanonicalState: false as const,
  ownsProviderRouting: false as const,
  ownsBilling: false as const,
  managerVisibleContribution: false as const,
  failClosedForPaidLlm: true as const,
});

export const NEXORA_LLM_USAGE_SKIP_REASONS = Object.freeze([
  "LLM_DISABLED",
  "ALLOWANCE_EXHAUSTED",
  "BUDGET_EXHAUSTED",
  "POLICY_DECLINED",
  "USAGE_UNAVAILABLE",
  "CONFIGURATION_ERROR",
] as const);

export type NexoraLlmUsageSkipReason =
  (typeof NEXORA_LLM_USAGE_SKIP_REASONS)[number];

export type NexoraLlmUsageDecision =
  | Readonly<{
      readonly allowed: true;
      readonly reason: "ALLOWED";
      readonly reservationId: string | null;
    }>
  | Readonly<{
      readonly allowed: false;
      readonly reason: NexoraLlmUsageSkipReason;
      readonly reservationId: null;
    }>;
