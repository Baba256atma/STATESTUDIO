/**
 * LLM-11 — Timeout policy definitions (metadata only).
 */

import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_TIMEOUT_METADATA_MS,
  LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import type {
  LlmResilienceTimeoutPolicyInput,
  LlmResilienceTimeoutPolicyKey,
  LlmResilienceTimeoutPolicyRegistration,
} from "./llmResilienceTypes.ts";

export const LLM_RESILIENCE_TIMEOUT_POLICY_LABELS = Object.freeze({
  immediate: "Immediate Timeout",
  short: "Short Timeout",
  standard: "Standard Timeout",
  long: "Long Timeout",
  enterprise_override: "Enterprise Override Timeout",
} as const);

export function isLlmResilienceTimeoutPolicyKey(value: string): value is LlmResilienceTimeoutPolicyKey {
  return (LLM_RESILIENCE_TIMEOUT_POLICY_KEYS as readonly string[]).includes(value);
}

export function resolveDefaultTimeoutPolicyKey(): LlmResilienceTimeoutPolicyKey {
  return "standard";
}

export function buildLlmResilienceTimeoutPolicyRegistration(
  input: LlmResilienceTimeoutPolicyInput,
  timestamp: string
): LlmResilienceTimeoutPolicyRegistration {
  return Object.freeze({
    policyId: `timeout-policy-${input.policyKey}`,
    policyKey: input.policyKey,
    label: input.label ?? LLM_RESILIENCE_TIMEOUT_POLICY_LABELS[input.policyKey],
    description:
      input.description ??
      `Timeout metadata placeholder: ${LLM_RESILIENCE_TIMEOUT_POLICY_LABELS[input.policyKey]}.`,
    version: LLM_RESILIENCE_CONTRACT_VERSION,
    timeoutMs: input.timeoutMs ?? LLM_RESILIENCE_TIMEOUT_METADATA_MS[input.policyKey],
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmResilienceTimeoutPolicyKeys(): readonly LlmResilienceTimeoutPolicyKey[] {
  return LLM_RESILIENCE_TIMEOUT_POLICY_KEYS;
}
