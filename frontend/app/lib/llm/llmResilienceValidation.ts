/**
 * LLM-11 — Resilience validation.
 */

import { discoverLlmRoutePolicies } from "./llmRouterExports.ts";
import {
  LLM_RESILIENCE_COMPATIBLE_VERSIONS,
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_ROUTER_DEPENDENCY,
  LLM_RESILIENCE_SECURITY_DEPENDENCY,
} from "./llmResilienceContracts.ts";
import { isFallbackRoutePolicyReferenceValid } from "./llmFallbackPolicies.ts";
import {
  classifyResilienceFailure,
  isLlmResilienceFailureCategoryKey,
} from "./llmFailureClassification.ts";
import { isLlmResilienceRetryPolicyKey } from "./llmRetryPolicies.ts";
import { isLlmResilienceTimeoutPolicyKey } from "./llmTimeoutPolicies.ts";
import { isLlmResilienceFallbackPolicyKey } from "./llmFallbackPolicies.ts";
import type {
  LlmResilienceDecision,
  LlmResilienceDecisionInput,
  LlmResilienceFallbackPolicyRegistration,
  LlmResilienceManifest,
  LlmResilienceRegistry,
  LlmResilienceRetryPolicyRegistration,
  LlmResilienceTimeoutPolicyRegistration,
  LlmResilienceValidationIssue,
  LlmResilienceValidationReport,
} from "./llmResilienceTypes.ts";

function issue(code: string, message: string, field?: string): LlmResilienceValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmResilienceValidationIssue[]): LlmResilienceValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateResilienceDecisionInput(input: LlmResilienceDecisionInput): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (!input.requestId.trim()) {
    issues.push(issue("missing_request_id", "Request ID is required.", "requestId"));
  }
  if (!isLlmResilienceFailureCategoryKey(input.failureCategory)) {
    issues.push(issue("invalid_failure_category", "Failure category is invalid.", "failureCategory"));
  }
  if (input.retryPolicyKey && !isLlmResilienceRetryPolicyKey(input.retryPolicyKey)) {
    issues.push(issue("invalid_retry_policy", "Retry policy key is invalid.", "retryPolicyKey"));
  }
  if (input.timeoutPolicyKey && !isLlmResilienceTimeoutPolicyKey(input.timeoutPolicyKey)) {
    issues.push(issue("invalid_timeout_policy", "Timeout policy key is invalid.", "timeoutPolicyKey"));
  }
  if (input.fallbackPolicyKey && !isLlmResilienceFallbackPolicyKey(input.fallbackPolicyKey)) {
    issues.push(issue("invalid_fallback_policy", "Fallback policy key is invalid.", "fallbackPolicyKey"));
  }
  return report(issues);
}

export function validateRetryPolicyConsistency(
  retryPolicy: LlmResilienceRetryPolicyRegistration
): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (retryPolicy.version !== LLM_RESILIENCE_CONTRACT_VERSION) {
    issues.push(issue("retry_version_mismatch", "Retry policy version must be LLM/11."));
  }
  if (retryPolicy.policyKey === "never_retry" && retryPolicy.maxAttempts !== 0) {
    issues.push(issue("retry_consistency", "Never retry policy must declare zero attempts."));
  }
  if (retryPolicy.policyKey !== "never_retry" && retryPolicy.maxAttempts < 0) {
    issues.push(issue("retry_consistency", "Retry attempts cannot be negative."));
  }
  return report(issues);
}

export function validateTimeoutPolicyConsistency(
  timeoutPolicy: LlmResilienceTimeoutPolicyRegistration
): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (timeoutPolicy.version !== LLM_RESILIENCE_CONTRACT_VERSION) {
    issues.push(issue("timeout_version_mismatch", "Timeout policy version must be LLM/11."));
  }
  if (timeoutPolicy.timeoutMs <= 0) {
    issues.push(issue("timeout_consistency", "Timeout metadata must be positive."));
  }
  return report(issues);
}

export function validateFallbackRouterCompatibility(
  fallbackPolicy: LlmResilienceFallbackPolicyRegistration
): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (fallbackPolicy.version !== LLM_RESILIENCE_CONTRACT_VERSION) {
    issues.push(issue("fallback_version_mismatch", "Fallback policy version must be LLM/11."));
  }
  if (!isFallbackRoutePolicyReferenceValid(fallbackPolicy.routePolicyReference)) {
    issues.push(issue("invalid_route_reference", "Fallback route policy reference is invalid."));
    return report(issues);
  }
  if (fallbackPolicy.routePolicyReference) {
    const registeredRoutePolicies = discoverLlmRoutePolicies().map((policy) => policy.policyKey);
    if (!registeredRoutePolicies.includes(fallbackPolicy.routePolicyReference)) {
      issues.push(issue("route_policy_not_registered", "Referenced LLM/8 route policy is not registered."));
    }
  }
  if (fallbackPolicy.policyKey === "local_first" && fallbackPolicy.routePolicyReference !== "local_first") {
    issues.push(issue("local_first_incompatible", "Local-first fallback must reference local_first route policy."));
  }
  return report(issues);
}

export function validateResilienceDecision(decision: LlmResilienceDecision): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (!decision.decisionId.trim()) {
    issues.push(issue("missing_decision_id", "Decision ID is required.", "decisionId"));
  }
  if (!decision.requestId.trim()) {
    issues.push(issue("missing_request_id", "Request ID is required.", "requestId"));
  }
  if (!isLlmResilienceFailureCategoryKey(decision.failureCategory)) {
    issues.push(issue("invalid_failure_category", "Failure category is invalid.", "failureCategory"));
  }
  if (!isLlmResilienceRetryPolicyKey(decision.retryPolicyKey)) {
    issues.push(issue("invalid_retry_policy", "Retry policy key is invalid.", "retryPolicyKey"));
  }
  if (!isLlmResilienceTimeoutPolicyKey(decision.timeoutPolicyKey)) {
    issues.push(issue("invalid_timeout_policy", "Timeout policy key is invalid.", "timeoutPolicyKey"));
  }
  if (!isLlmResilienceFallbackPolicyKey(decision.fallbackPolicyKey)) {
    issues.push(issue("invalid_fallback_policy", "Fallback policy key is invalid.", "fallbackPolicyKey"));
  }
  if (decision.failureCategory === "security_denial" && decision.eligibility.retryEligible) {
    issues.push(issue("security_retry_conflict", "Security denial must not be retry eligible."));
  }
  if (decision.failureCategory === "security_denial" && decision.eligibility.fallbackEligible) {
    issues.push(issue("security_fallback_conflict", "Security denial must not be fallback eligible."));
  }
  if (!(decision.compatibility as readonly string[]).includes(LLM_RESILIENCE_CONTRACT_VERSION)) {
    issues.push(issue("missing_resilience_compatibility", "Decision must declare LLM/11 compatibility."));
  }
  return report(issues);
}

export function validateResilienceRegistryState(registry: LlmResilienceRegistry): LlmResilienceValidationReport {
  if (
    registry.retryPolicyCount === 0 ||
    registry.timeoutPolicyCount === 0 ||
    registry.fallbackPolicyCount === 0
  ) {
    return report([issue("incomplete_registry", "Resilience registry must include retry, timeout, and fallback policies.")]);
  }
  return report([]);
}

export function validateResilienceManifestConsistency(manifest: LlmResilienceManifest): LlmResilienceValidationReport {
  const issues: LlmResilienceValidationIssue[] = [];
  if (manifest.resilienceVersion !== LLM_RESILIENCE_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Resilience manifest version must be LLM/11."));
  }
  if (!(manifest.compatibility as readonly string[]).includes(LLM_RESILIENCE_SECURITY_DEPENDENCY)) {
    issues.push(issue("missing_security_compatibility", "Manifest must declare LLM/10 compatibility."));
  }
  if (!(manifest.compatibility as readonly string[]).includes(LLM_RESILIENCE_ROUTER_DEPENDENCY)) {
    issues.push(issue("missing_router_compatibility", "Manifest must declare LLM/8 compatibility."));
  }
  return report(issues);
}

export function getDefaultResilienceCompatibility(): readonly string[] {
  return Object.freeze([...LLM_RESILIENCE_COMPATIBLE_VERSIONS, LLM_RESILIENCE_CONTRACT_VERSION]);
}

export { classifyResilienceFailure };
