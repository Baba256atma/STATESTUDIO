/**
 * LLM-11 — Fallback policy definitions (references LLM-8 routes, never selects).
 */

import { LLM_ROUTER_POLICY_KEYS } from "./llmRouterContracts.ts";
import type { LlmRoutePolicyKey } from "./llmRouterTypes.ts";
import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import type {
  LlmResilienceFallbackPolicyInput,
  LlmResilienceFallbackPolicyKey,
  LlmResilienceFallbackPolicyRegistration,
} from "./llmResilienceTypes.ts";

export const LLM_RESILIENCE_FALLBACK_POLICY_LABELS = Object.freeze({
  no_fallback: "No Fallback",
  same_provider_alternate_model: "Same Provider Alternate Model",
  alternate_provider: "Alternate Provider",
  local_first: "Local-First Fallback",
  enterprise_override: "Enterprise Override Fallback",
} as const);

export function isLlmResilienceFallbackPolicyKey(value: string): value is LlmResilienceFallbackPolicyKey {
  return (LLM_RESILIENCE_FALLBACK_POLICY_KEYS as readonly string[]).includes(value);
}

export function resolveDefaultFallbackPolicyKey(): LlmResilienceFallbackPolicyKey {
  return "no_fallback";
}

function resolveDefaultRouteReference(policyKey: LlmResilienceFallbackPolicyKey): LlmRoutePolicyKey | null {
  switch (policyKey) {
    case "no_fallback":
      return null;
    case "same_provider_alternate_model":
      return "model_preferred";
    case "alternate_provider":
      return "provider_preferred";
    case "local_first":
      return "local_first";
    case "enterprise_override":
      return "enterprise_override";
  }
}

export function buildLlmResilienceFallbackPolicyRegistration(
  input: LlmResilienceFallbackPolicyInput,
  timestamp: string
): LlmResilienceFallbackPolicyRegistration {
  return Object.freeze({
    policyId: `fallback-policy-${input.policyKey}`,
    policyKey: input.policyKey,
    label: input.label ?? LLM_RESILIENCE_FALLBACK_POLICY_LABELS[input.policyKey],
    description:
      input.description ??
      `Fallback coordination intent: ${LLM_RESILIENCE_FALLBACK_POLICY_LABELS[input.policyKey]}.`,
    version: LLM_RESILIENCE_CONTRACT_VERSION,
    routePolicyReference: input.routePolicyReference ?? resolveDefaultRouteReference(input.policyKey),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function isFallbackRoutePolicyReferenceValid(routePolicyReference: LlmRoutePolicyKey | null): boolean {
  if (routePolicyReference === null) {
    return true;
  }
  return (LLM_ROUTER_POLICY_KEYS as readonly string[]).includes(routePolicyReference);
}

export function getAllLlmResilienceFallbackPolicyKeys(): readonly LlmResilienceFallbackPolicyKey[] {
  return LLM_RESILIENCE_FALLBACK_POLICY_KEYS;
}
