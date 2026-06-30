/**
 * LLM-8 — Routing policy definitions.
 */

import {
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_PLACEHOLDER_POLICY_KEYS,
  LLM_ROUTER_POLICY_KEYS,
} from "./llmRouterContracts.ts";
import type { LlmRoutePolicyKey, LlmRoutePolicyRegistration } from "./llmRouterTypes.ts";

export const LLM_ROUTER_POLICY_LABELS = Object.freeze({
  default_route: "Default Route",
  provider_preferred: "Provider Preferred Route",
  model_preferred: "Model Preferred Route",
  capability_based: "Capability-Based Route",
  cost_aware: "Cost-Aware Route (Placeholder)",
  latency_aware: "Latency-Aware Route (Placeholder)",
  local_first: "Local-First Route (Placeholder)",
  enterprise_override: "Enterprise Override Route",
} as const);

export function isLlmRoutePolicyKey(value: string): value is LlmRoutePolicyKey {
  return (LLM_ROUTER_POLICY_KEYS as readonly string[]).includes(value);
}

export function isLlmRoutePlaceholderPolicy(policyKey: LlmRoutePolicyKey): boolean {
  return (LLM_ROUTER_PLACEHOLDER_POLICY_KEYS as readonly string[]).includes(policyKey);
}

export function buildLlmRoutePolicyRegistration(
  policyKey: LlmRoutePolicyKey,
  timestamp: string
): LlmRoutePolicyRegistration {
  return Object.freeze({
    policyId: `route-policy-${policyKey}`,
    policyKey,
    label: LLM_ROUTER_POLICY_LABELS[policyKey],
    description: `Deterministic routing policy: ${LLM_ROUTER_POLICY_LABELS[policyKey]}.`,
    version: LLM_ROUTER_CONTRACT_VERSION,
    placeholder: isLlmRoutePlaceholderPolicy(policyKey),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmRoutePolicyKeys(): readonly LlmRoutePolicyKey[] {
  return LLM_ROUTER_POLICY_KEYS;
}

export function resolveDefaultRoutePolicyKey(): LlmRoutePolicyKey {
  return "default_route";
}
