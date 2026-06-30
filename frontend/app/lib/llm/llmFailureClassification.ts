/**
 * LLM-11 — Failure classification and eligibility resolution.
 */

import { LLM_RESILIENCE_FAILURE_CATEGORY_KEYS } from "./llmResilienceContracts.ts";
import { resolveDefaultRetryPolicyKey } from "./llmRetryPolicies.ts";
import { resolveDefaultFallbackPolicyKey } from "./llmFallbackPolicies.ts";
import { resolveDefaultTimeoutPolicyKey } from "./llmTimeoutPolicies.ts";
import type {
  LlmResilienceEligibility,
  LlmResilienceFailureCategoryKey,
  LlmResilienceFallbackPolicyKey,
  LlmResilienceFallbackPolicyRegistration,
  LlmResilienceRetryPolicyKey,
  LlmResilienceRetryPolicyRegistration,
  LlmResilienceTimeoutPolicyRegistration,
} from "./llmResilienceTypes.ts";

export function isLlmResilienceFailureCategoryKey(value: string): value is LlmResilienceFailureCategoryKey {
  return (LLM_RESILIENCE_FAILURE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function classifyResilienceFailure(
  failureCategory: string,
  metadata: Readonly<Record<string, string>> = Object.freeze({})
): LlmResilienceFailureCategoryKey {
  if (isLlmResilienceFailureCategoryKey(failureCategory)) {
    return failureCategory;
  }
  if (metadata.failureHint === "timeout") {
    return "timeout";
  }
  if (metadata.failureHint === "security") {
    return "security_denial";
  }
  return "unknown_failure";
}

export function resolveDefaultRetryPolicyForFailure(
  failureCategory: LlmResilienceFailureCategoryKey
): LlmResilienceRetryPolicyKey {
  switch (failureCategory) {
    case "timeout":
      return "timeout_failure";
    case "provider_unavailable":
      return "provider_failure";
    case "invalid_response":
      return "retry_once";
    case "validation_failure":
    case "security_denial":
      return "never_retry";
    case "unknown_failure":
      return "unknown_failure";
  }
}

export function resolveDefaultFallbackPolicyForFailure(
  failureCategory: LlmResilienceFailureCategoryKey
): LlmResilienceFallbackPolicyKey {
  switch (failureCategory) {
    case "timeout":
    case "provider_unavailable":
      return "alternate_provider";
    case "invalid_response":
      return "same_provider_alternate_model";
    case "validation_failure":
    case "security_denial":
      return "no_fallback";
    case "unknown_failure":
      return "no_fallback";
  }
}

export function resolveRetryEligibility(
  retryPolicy: LlmResilienceRetryPolicyRegistration,
  failureCategory: LlmResilienceFailureCategoryKey
): boolean {
  if (retryPolicy.maxAttempts === 0 || retryPolicy.policyKey === "never_retry") {
    return false;
  }
  if (failureCategory === "security_denial" || failureCategory === "validation_failure") {
    return false;
  }
  switch (retryPolicy.policyKey) {
    case "provider_failure":
      return failureCategory === "provider_unavailable" || failureCategory === "invalid_response";
    case "timeout_failure":
      return failureCategory === "timeout";
    case "network_failure":
      return failureCategory === "provider_unavailable" || failureCategory === "unknown_failure";
    case "unknown_failure":
      return failureCategory === "unknown_failure";
    default:
      return retryPolicy.maxAttempts > 0;
  }
}

export function resolveTimeoutEligibility(timeoutPolicy: LlmResilienceTimeoutPolicyRegistration): boolean {
  return timeoutPolicy.timeoutMs > 0;
}

export function resolveFallbackEligibility(
  fallbackPolicy: LlmResilienceFallbackPolicyRegistration,
  failureCategory: LlmResilienceFailureCategoryKey
): boolean {
  if (fallbackPolicy.policyKey === "no_fallback") {
    return false;
  }
  if (failureCategory === "security_denial" || failureCategory === "validation_failure") {
    return false;
  }
  return fallbackPolicy.routePolicyReference !== null || fallbackPolicy.policyKey === "enterprise_override";
}

export function resolveResilienceEligibility(
  retryPolicy: LlmResilienceRetryPolicyRegistration,
  timeoutPolicy: LlmResilienceTimeoutPolicyRegistration,
  fallbackPolicy: LlmResilienceFallbackPolicyRegistration,
  failureCategory: LlmResilienceFailureCategoryKey
): LlmResilienceEligibility {
  return Object.freeze({
    retryEligible: resolveRetryEligibility(retryPolicy, failureCategory),
    timeoutEligible: resolveTimeoutEligibility(timeoutPolicy),
    fallbackEligible: resolveFallbackEligibility(fallbackPolicy, failureCategory),
    readOnly: true as const,
  });
}

export function resolveDefaultResiliencePolicyKeys(failureCategory: LlmResilienceFailureCategoryKey): Readonly<{
  retryPolicyKey: LlmResilienceRetryPolicyKey;
  timeoutPolicyKey: ReturnType<typeof resolveDefaultTimeoutPolicyKey>;
  fallbackPolicyKey: LlmResilienceFallbackPolicyKey;
}> {
  return Object.freeze({
    retryPolicyKey: resolveDefaultRetryPolicyForFailure(failureCategory) ?? resolveDefaultRetryPolicyKey(),
    timeoutPolicyKey: resolveDefaultTimeoutPolicyKey(),
    fallbackPolicyKey: resolveDefaultFallbackPolicyForFailure(failureCategory) ?? resolveDefaultFallbackPolicyKey(),
  });
}

export function getAllLlmResilienceFailureCategoryKeys(): readonly LlmResilienceFailureCategoryKey[] {
  return LLM_RESILIENCE_FAILURE_CATEGORY_KEYS;
}
