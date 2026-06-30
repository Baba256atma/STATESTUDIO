/**
 * LLM-8 — Route decision validation.
 */

import { isLlmProviderCapabilityKey } from "./llmProviderCapabilities.ts";
import { isLlmProviderKey } from "./llmProviderValidation.ts";
import {
  LLM_ROUTER_COMPATIBLE_VERSIONS,
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_COST_DEPENDENCY,
  LLM_ROUTER_KNOWN_ROUTES,
  LLM_ROUTER_RUNTIME_DEPENDENCY,
} from "./llmRouterContracts.ts";
import { isLlmRoutePolicyKey } from "./llmRouterPolicies.ts";
import type {
  LlmRouteDecision,
  LlmRouteSelectionInput,
  LlmRouteValidationIssue,
  LlmRouteValidationReport,
} from "./llmRouterTypes.ts";
import type { LlmCostPricingProfile } from "./llmCostTypes.ts";
import { validateLlmRuntimeRequest } from "./llmRuntimeValidation.ts";

function issue(code: string, message: string, field?: string): LlmRouteValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmRouteValidationIssue[]): LlmRouteValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isKnownLlmRoute(providerKey: string, modelKey: string): boolean {
  return LLM_ROUTER_KNOWN_ROUTES.some(
    (route) => route.providerKey === providerKey && route.modelKey === modelKey
  );
}

export function validateLlmRouteSelectionInput(input: LlmRouteSelectionInput): LlmRouteValidationReport {
  const issues: LlmRouteValidationIssue[] = [];
  const runtimeValidation = validateLlmRuntimeRequest(input.runtimeRequest);
  issues.push(...runtimeValidation.issues.map((entry) => issue(entry.code, entry.message, entry.field)));
  if (input.policyKey && !isLlmRoutePolicyKey(input.policyKey)) {
    issues.push(issue("invalid_policy", "Route policy key is invalid.", "policyKey"));
  }
  if (input.requiredCapabilities) {
    for (const capability of input.requiredCapabilities) {
      if (!isLlmProviderCapabilityKey(capability)) {
        issues.push(issue("invalid_capability", `Invalid capability: ${capability}`, "requiredCapabilities"));
      }
    }
  }
  if (input.enterpriseOverride) {
    if (!isLlmProviderKey(input.enterpriseOverride.providerKey)) {
      issues.push(issue("invalid_override_provider", "Enterprise override provider is invalid."));
    }
    if (!isKnownLlmRoute(input.enterpriseOverride.providerKey, input.enterpriseOverride.modelKey)) {
      issues.push(issue("invalid_override_route", "Enterprise override route is not a known route."));
    }
  }
  return report(issues);
}

export function validateLlmRouteDecision(decision: LlmRouteDecision): LlmRouteValidationReport {
  const issues: LlmRouteValidationIssue[] = [];
  if (!isLlmRoutePolicyKey(decision.policyKey)) {
    issues.push(issue("invalid_policy", "Policy key is invalid.", "policyKey"));
  }
  if (!isLlmProviderKey(decision.providerKey)) {
    issues.push(issue("invalid_provider", "Provider key is invalid.", "providerKey"));
  }
  if (!isKnownLlmRoute(decision.providerKey, decision.modelKey)) {
    issues.push(issue("invalid_route", "Selected route is not a known provider/model pair."));
  }
  if (!isLlmProviderKey(decision.fallbackProviderKey)) {
    issues.push(issue("invalid_fallback_provider", "Fallback provider key is invalid.", "fallbackProviderKey"));
  }
  if (!isKnownLlmRoute(decision.fallbackProviderKey, decision.fallbackModelKey)) {
    issues.push(issue("invalid_fallback_route", "Fallback route is not valid."));
  }
  if (decision.confidence < 0 || decision.confidence > 1) {
    issues.push(issue("invalid_confidence", "Confidence must be between 0 and 1.", "confidence"));
  }
  if (!decision.reason.trim()) {
    issues.push(issue("missing_reason", "Route reason is required.", "reason"));
  }
  for (const capability of decision.requiredCapabilities) {
    if (!isLlmProviderCapabilityKey(capability)) {
      issues.push(issue("invalid_capability", `Invalid required capability: ${capability}`));
    }
  }
  if (!(decision.compatibility as readonly string[]).includes(LLM_ROUTER_RUNTIME_DEPENDENCY)) {
    issues.push(issue("missing_runtime_compatibility", "Route decision must declare runtime compatibility."));
  }
  return report(issues);
}

export function validateCostAwareRouteCompatibility(
  decision: LlmRouteDecision,
  pricingProfiles: readonly LlmCostPricingProfile[]
): LlmRouteValidationReport {
  if (decision.policyKey !== "cost_aware") {
    return report([]);
  }
  const profile = pricingProfiles.find(
    (entry) => entry.providerKey === decision.providerKey && entry.modelKey === decision.modelKey
  );
  if (!profile) {
    return report([issue("missing_cost_profile", "Cost-aware route lacks LLM/7 pricing profile compatibility.")]);
  }
  if (!(decision.compatibility as readonly string[]).includes(LLM_ROUTER_COST_DEPENDENCY)) {
    return report([issue("missing_cost_compatibility", "Cost-aware route must declare cost dependency compatibility.")]);
  }
  return report([]);
}

export function validateRouterVersionCompatibility(): LlmRouteValidationReport {
  if (!(LLM_ROUTER_COMPATIBLE_VERSIONS as readonly string[]).includes(LLM_ROUTER_RUNTIME_DEPENDENCY)) {
    return report([issue("runtime_incompatible", "Router is incompatible with runtime version.")]);
  }
  return report([]);
}

export function getDefaultRouterCompatibility(): readonly string[] {
  return Object.freeze([...LLM_ROUTER_COMPATIBLE_VERSIONS, LLM_ROUTER_CONTRACT_VERSION]);
}

export function validateLlmRouteRegistryUniqueness(
  policies: readonly import("./llmRouterTypes.ts").LlmRoutePolicyRegistration[]
): LlmRouteValidationReport {
  const keys = policies.map((policy) => policy.policyKey);
  if (new Set(keys).size !== keys.length) {
    return report([issue("duplicate_policy", "Duplicate route policy keys.")]);
  }
  return report([]);
}
