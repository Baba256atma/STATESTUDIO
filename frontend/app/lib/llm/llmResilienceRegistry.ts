/**
 * LLM-11 — Resilience policy registry and decision builder.
 */

import { buildLlmModelRouterLayer } from "./llmRouterExports.ts";
import { buildLlmSecurityRedactionLayer } from "./llmSecurityExports.ts";
import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_DEFAULT_LIMITS,
  LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
  LLM_RESILIENCE_RETRY_POLICY_KEYS,
  LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import {
  classifyResilienceFailure,
  resolveDefaultResiliencePolicyKeys,
  resolveResilienceEligibility,
} from "./llmFailureClassification.ts";
import { buildLlmResilienceFallbackPolicyRegistration } from "./llmFallbackPolicies.ts";
import { buildLlmResilienceRetryPolicyRegistration } from "./llmRetryPolicies.ts";
import { buildLlmResilienceTimeoutPolicyRegistration } from "./llmTimeoutPolicies.ts";
import type {
  LlmResilienceDecisionInput,
  LlmResilienceDecisionResult,
  LlmResilienceFallbackPolicyInput,
  LlmResilienceFallbackPolicyKey,
  LlmResilienceFallbackPolicyRegistration,
  LlmResilienceRegistry,
  LlmResilienceRetryPolicyInput,
  LlmResilienceRetryPolicyKey,
  LlmResilienceRetryPolicyRegistration,
  LlmResilienceTimeoutPolicyInput,
  LlmResilienceTimeoutPolicyKey,
  LlmResilienceTimeoutPolicyRegistration,
} from "./llmResilienceTypes.ts";
import {
  getDefaultResilienceCompatibility,
  validateFallbackRouterCompatibility,
  validateResilienceDecision,
  validateResilienceDecisionInput,
  validateRetryPolicyConsistency,
  validateTimeoutPolicyConsistency,
} from "./llmResilienceValidation.ts";

const retryRegistry = new Map<LlmResilienceRetryPolicyKey, LlmResilienceRetryPolicyRegistration>();
const timeoutRegistry = new Map<LlmResilienceTimeoutPolicyKey, LlmResilienceTimeoutPolicyRegistration>();
const fallbackRegistry = new Map<LlmResilienceFallbackPolicyKey, LlmResilienceFallbackPolicyRegistration>();

export function resetLlmResilienceRegistryForTests(): void {
  retryRegistry.clear();
  timeoutRegistry.clear();
  fallbackRegistry.clear();
}

export function registerRetryPolicy(
  input: LlmResilienceRetryPolicyInput,
  timestamp: string
): LlmResilienceRetryPolicyRegistration {
  const registration = buildLlmResilienceRetryPolicyRegistration(input, timestamp);
  const validation = validateRetryPolicyConsistency(registration);
  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Retry policy registration failed.");
  }
  retryRegistry.set(registration.policyKey, registration);
  return registration;
}

export function registerTimeoutPolicy(
  input: LlmResilienceTimeoutPolicyInput,
  timestamp: string
): LlmResilienceTimeoutPolicyRegistration {
  const registration = buildLlmResilienceTimeoutPolicyRegistration(input, timestamp);
  const validation = validateTimeoutPolicyConsistency(registration);
  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Timeout policy registration failed.");
  }
  timeoutRegistry.set(registration.policyKey, registration);
  return registration;
}

export function registerFallbackPolicy(
  input: LlmResilienceFallbackPolicyInput,
  timestamp: string
): LlmResilienceFallbackPolicyRegistration {
  const registration = buildLlmResilienceFallbackPolicyRegistration(input, timestamp);
  const validation = validateFallbackRouterCompatibility(registration);
  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Fallback policy registration failed.");
  }
  fallbackRegistry.set(registration.policyKey, registration);
  return registration;
}

export function discoverResiliencePolicies(): LlmResilienceRegistry {
  return getResilienceRegistry();
}

export function lookupRetryPolicy(policyKey: LlmResilienceRetryPolicyKey): LlmResilienceRetryPolicyRegistration | null {
  return retryRegistry.get(policyKey) ?? null;
}

export function lookupTimeoutPolicy(
  policyKey: LlmResilienceTimeoutPolicyKey
): LlmResilienceTimeoutPolicyRegistration | null {
  return timeoutRegistry.get(policyKey) ?? null;
}

export function lookupFallbackPolicy(
  policyKey: LlmResilienceFallbackPolicyKey
): LlmResilienceFallbackPolicyRegistration | null {
  return fallbackRegistry.get(policyKey) ?? null;
}

export function getResilienceRegistry(): LlmResilienceRegistry {
  const retryPolicies = Object.freeze([...retryRegistry.values()].sort((left, right) =>
    left.policyKey.localeCompare(right.policyKey)
  ));
  const timeoutPolicies = Object.freeze([...timeoutRegistry.values()].sort((left, right) =>
    left.policyKey.localeCompare(right.policyKey)
  ));
  const fallbackPolicies = Object.freeze([...fallbackRegistry.values()].sort((left, right) =>
    left.policyKey.localeCompare(right.policyKey)
  ));
  return Object.freeze({
    retryPolicies,
    retryPolicyCount: retryPolicies.length,
    timeoutPolicies,
    timeoutPolicyCount: timeoutPolicies.length,
    fallbackPolicies,
    fallbackPolicyCount: fallbackPolicies.length,
    readOnly: true as const,
  });
}

export function seedDefaultResiliencePolicies(timestamp: string): void {
  if (retryRegistry.size < LLM_RESILIENCE_DEFAULT_LIMITS.maxRetryPolicies) {
    for (const policyKey of LLM_RESILIENCE_RETRY_POLICY_KEYS) {
      registerRetryPolicy(Object.freeze({ policyKey }), timestamp);
    }
  }
  if (timeoutRegistry.size < LLM_RESILIENCE_DEFAULT_LIMITS.maxTimeoutPolicies) {
    for (const policyKey of LLM_RESILIENCE_TIMEOUT_POLICY_KEYS) {
      registerTimeoutPolicy(Object.freeze({ policyKey }), timestamp);
    }
  }
  if (fallbackRegistry.size < LLM_RESILIENCE_DEFAULT_LIMITS.maxFallbackPolicies) {
    for (const policyKey of LLM_RESILIENCE_FALLBACK_POLICY_KEYS) {
      registerFallbackPolicy(Object.freeze({ policyKey }), timestamp);
    }
  }
}

export function ensureLlmResilienceDependenciesReady(timestamp: string): boolean {
  const securityLayer = buildLlmSecurityRedactionLayer(timestamp);
  const routerLayer = buildLlmModelRouterLayer(timestamp);
  return securityLayer.success && routerLayer.success;
}

export function buildResilienceDecision(
  input: LlmResilienceDecisionInput,
  timestamp: string = new Date(0).toISOString()
): LlmResilienceDecisionResult {
  const inputValidation = validateResilienceDecisionInput(input);
  if (!inputValidation.valid) {
    return Object.freeze({
      success: false,
      reason: inputValidation.issues[0]?.message ?? "Resilience decision input is invalid.",
      decision: null,
      readOnly: true as const,
    });
  }

  const failureCategory = classifyResilienceFailure(input.failureCategory, input.metadata ?? Object.freeze({}));
  const defaults = resolveDefaultResiliencePolicyKeys(failureCategory);
  const retryPolicyKey = input.retryPolicyKey ?? defaults.retryPolicyKey;
  const timeoutPolicyKey = input.timeoutPolicyKey ?? defaults.timeoutPolicyKey;
  const fallbackPolicyKey = input.fallbackPolicyKey ?? defaults.fallbackPolicyKey;

  const retryPolicy = lookupRetryPolicy(retryPolicyKey);
  const timeoutPolicy = lookupTimeoutPolicy(timeoutPolicyKey);
  const fallbackPolicy = lookupFallbackPolicy(fallbackPolicyKey);

  if (!retryPolicy || !timeoutPolicy || !fallbackPolicy) {
    return Object.freeze({
      success: false,
      reason: "One or more resilience policies are not registered.",
      decision: null,
      readOnly: true as const,
    });
  }

  const fallbackValidation = validateFallbackRouterCompatibility(fallbackPolicy);
  if (!fallbackValidation.valid) {
    return Object.freeze({
      success: false,
      reason: fallbackValidation.issues[0]?.message ?? "Fallback policy is incompatible with LLM/8.",
      decision: null,
      readOnly: true as const,
    });
  }

  const eligibility = resolveResilienceEligibility(retryPolicy, timeoutPolicy, fallbackPolicy, failureCategory);
  const decision = Object.freeze({
    decisionId: `resilience-decision-${input.requestId}-${timestamp}`,
    requestId: input.requestId,
    retryPolicyKey,
    timeoutPolicyKey,
    fallbackPolicyKey,
    failureCategory,
    eligibility,
    compatibility: getDefaultResilienceCompatibility(),
    timestamp,
    metadata: Object.freeze({
      contractVersion: LLM_RESILIENCE_CONTRACT_VERSION,
      retryMaxAttempts: String(retryPolicy.maxAttempts),
      timeoutMs: String(timeoutPolicy.timeoutMs),
      routePolicyReference: fallbackPolicy.routePolicyReference ?? "",
      ...(input.metadata ?? {}),
    }),
    readOnly: true as const,
  });

  const decisionValidation = validateResilienceDecision(decision);
  if (!decisionValidation.valid) {
    return Object.freeze({
      success: false,
      reason: decisionValidation.issues[0]?.message ?? "Resilience decision validation failed.",
      decision: null,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    success: true,
    reason: "Resilience decision created.",
    decision,
    readOnly: true as const,
  });
}

export function lookupResiliencePolicyCompatibility(
  policyKey: LlmResilienceRetryPolicyKey | LlmResilienceTimeoutPolicyKey | LlmResilienceFallbackPolicyKey
): readonly string[] | null {
  const policy =
    lookupRetryPolicy(policyKey as LlmResilienceRetryPolicyKey) ??
    lookupTimeoutPolicy(policyKey as LlmResilienceTimeoutPolicyKey) ??
    lookupFallbackPolicy(policyKey as LlmResilienceFallbackPolicyKey);
  if (!policy) {
    return null;
  }
  return Object.freeze([LLM_RESILIENCE_CONTRACT_VERSION, policy.version]);
}
