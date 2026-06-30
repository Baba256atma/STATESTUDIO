/**
 * LLM-11 — Retry policy definitions.
 */

import {
  LLM_RESILIENCE_CONFIGURABLE_RETRY_ATTEMPTS,
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_RETRY_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import type {
  LlmResilienceRetryPolicyInput,
  LlmResilienceRetryPolicyKey,
  LlmResilienceRetryPolicyRegistration,
} from "./llmResilienceTypes.ts";

export const LLM_RESILIENCE_RETRY_POLICY_LABELS = Object.freeze({
  never_retry: "Never Retry",
  retry_once: "Retry Once",
  retry_twice: "Retry Twice",
  configurable_retry: "Configurable Retry",
  provider_failure: "Provider Failure Retry",
  timeout_failure: "Timeout Failure Retry",
  network_failure: "Network Failure Retry (Placeholder)",
  unknown_failure: "Unknown Failure Retry",
} as const);

export function isLlmResilienceRetryPolicyKey(value: string): value is LlmResilienceRetryPolicyKey {
  return (LLM_RESILIENCE_RETRY_POLICY_KEYS as readonly string[]).includes(value);
}

export function resolveDefaultRetryPolicyKey(): LlmResilienceRetryPolicyKey {
  return "retry_once";
}

function resolveMaxAttempts(policyKey: LlmResilienceRetryPolicyKey): number {
  switch (policyKey) {
    case "never_retry":
      return 0;
    case "retry_once":
      return LLM_RESILIENCE_CONFIGURABLE_RETRY_ATTEMPTS.retry_once;
    case "retry_twice":
      return LLM_RESILIENCE_CONFIGURABLE_RETRY_ATTEMPTS.retry_twice;
    case "configurable_retry":
      return LLM_RESILIENCE_CONFIGURABLE_RETRY_ATTEMPTS.configurable_retry;
    case "provider_failure":
    case "timeout_failure":
    case "network_failure":
    case "unknown_failure":
      return 1;
  }
}

export function buildLlmResilienceRetryPolicyRegistration(
  input: LlmResilienceRetryPolicyInput,
  timestamp: string
): LlmResilienceRetryPolicyRegistration {
  return Object.freeze({
    policyId: `retry-policy-${input.policyKey}`,
    policyKey: input.policyKey,
    label: input.label ?? LLM_RESILIENCE_RETRY_POLICY_LABELS[input.policyKey],
    description:
      input.description ??
      `Deterministic retry intent: ${LLM_RESILIENCE_RETRY_POLICY_LABELS[input.policyKey]}.`,
    version: LLM_RESILIENCE_CONTRACT_VERSION,
    maxAttempts: input.maxAttempts ?? resolveMaxAttempts(input.policyKey),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmResilienceRetryPolicyKeys(): readonly LlmResilienceRetryPolicyKey[] {
  return LLM_RESILIENCE_RETRY_POLICY_KEYS;
}
