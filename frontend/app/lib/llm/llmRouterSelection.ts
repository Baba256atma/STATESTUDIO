/**
 * LLM-8 — Deterministic model route selection.
 */

import { getSupportedLlmProviderCapabilities } from "./llmProviderCapabilities.ts";
import type { LlmProviderCapabilityKey } from "./llmProviderTypes.ts";
import type { LlmProviderKey } from "./llmPlatformTypes.ts";
import type { LlmCostPricingProfile } from "./llmCostTypes.ts";
import {
  LLM_ROUTER_COMPATIBLE_VERSIONS,
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_COST_DEPENDENCY,
  LLM_ROUTER_DEFAULT_FALLBACK,
  LLM_ROUTER_DEFAULT_MODEL_BY_PROVIDER,
  LLM_ROUTER_DEFAULT_ROUTE,
  LLM_ROUTER_KNOWN_ROUTES,
} from "./llmRouterContracts.ts";
import { isLlmRoutePlaceholderPolicy, resolveDefaultRoutePolicyKey } from "./llmRouterPolicies.ts";
import type {
  LlmRouteDecision,
  LlmRouteSelectionInput,
  LlmRouteSelectionResult,
  LlmRouteTarget,
} from "./llmRouterTypes.ts";
import { validateLlmRouteSelectionInput } from "./llmRouterValidation.ts";

function isKnownRoute(providerKey: string, modelKey: string): boolean {
  return LLM_ROUTER_KNOWN_ROUTES.some(
    (route) => route.providerKey === providerKey && route.modelKey === modelKey
  );
}

function providerSupportsCapabilities(
  providerKey: LlmProviderKey,
  required: readonly LlmProviderCapabilityKey[]
): boolean {
  const supported = new Set(getSupportedLlmProviderCapabilities(providerKey));
  return required.every((capability) => supported.has(capability));
}

function findCapabilityRoute(required: readonly LlmProviderCapabilityKey[]): LlmRouteTarget | null {
  for (const route of LLM_ROUTER_KNOWN_ROUTES) {
    if (providerSupportsCapabilities(route.providerKey, required)) {
      return Object.freeze({ ...route, readOnly: true as const });
    }
  }
  return null;
}

function findCostAwareRoute(profiles: readonly LlmCostPricingProfile[]): LlmRouteTarget | null {
  if (profiles.length === 0) {
    return null;
  }
  const sorted = [...profiles].sort((left, right) => {
    const leftScore = left.inputTokenPrice + left.outputTokenPrice;
    const rightScore = right.inputTokenPrice + right.outputTokenPrice;
    return leftScore - rightScore || left.providerKey.localeCompare(right.providerKey) || left.modelKey.localeCompare(right.modelKey);
  });
  const best = sorted[0];
  return Object.freeze({
    providerKey: best.providerKey,
    modelKey: best.modelKey,
    readOnly: true as const,
  });
}

function buildRouteDecision(
  input: LlmRouteSelectionInput,
  target: LlmRouteTarget,
  policyKey: LlmRouteSelectionInput["policyKey"],
  reason: string,
  confidence: number,
  routeDecisionId: string,
  timestamp: string
): LlmRouteDecision {
  const policy = policyKey ?? resolveDefaultRoutePolicyKey();
  const requiredCapabilities = input.requiredCapabilities ?? [];
  const compatibility = Object.freeze([
    ...LLM_ROUTER_COMPATIBLE_VERSIONS,
    LLM_ROUTER_CONTRACT_VERSION,
    ...(policy === "cost_aware" ? [LLM_ROUTER_COST_DEPENDENCY] : []),
  ]);
  return Object.freeze({
    routeDecisionId,
    requestId: input.runtimeRequest.requestId,
    providerKey: target.providerKey,
    modelKey: target.modelKey,
    policyKey: policy,
    reason,
    confidence,
    fallbackProviderKey: LLM_ROUTER_DEFAULT_FALLBACK.providerKey,
    fallbackModelKey: LLM_ROUTER_DEFAULT_FALLBACK.modelKey,
    requiredCapabilities,
    compatibility,
    metadata: Object.freeze({
      traceId: input.runtimeRequest.traceId,
      correlationId: input.runtimeRequest.correlationId,
      placeholderPolicy: String(isLlmRoutePlaceholderPolicy(policy)),
      ...(input.metadata ?? {}),
    }),
    timestamp,
    readOnly: true as const,
  });
}

export function selectLlmModelRoute(
  input: LlmRouteSelectionInput,
  routeDecisionId: string,
  timestamp: string = new Date(0).toISOString(),
  pricingProfiles: readonly LlmCostPricingProfile[] = []
): LlmRouteSelectionResult {
  const validation = validateLlmRouteSelectionInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues[0]?.message ?? "Route selection input validation failed.",
      decision: null,
      readOnly: true as const,
    });
  }

  const policyKey = input.policyKey ?? resolveDefaultRoutePolicyKey();
  const requiredCapabilities = input.requiredCapabilities ?? [];
  let target: LlmRouteTarget | null = null;
  let reason = "Default route selected.";
  let confidence = 0.7;

  switch (policyKey) {
    case "enterprise_override": {
      if (input.enterpriseOverride && isKnownRoute(input.enterpriseOverride.providerKey, input.enterpriseOverride.modelKey)) {
        target = input.enterpriseOverride;
        reason = "Enterprise override route applied.";
        confidence = 1;
      } else {
        return Object.freeze({
          success: false,
          reason: "Enterprise override route is invalid.",
          decision: null,
          readOnly: true as const,
        });
      }
      break;
    }
    case "provider_preferred": {
      const providerKey = input.runtimeRequest.providerKey;
      const modelKey = isKnownRoute(providerKey, input.runtimeRequest.modelKey)
        ? input.runtimeRequest.modelKey
        : LLM_ROUTER_DEFAULT_MODEL_BY_PROVIDER[providerKey];
      if (isKnownRoute(providerKey, modelKey)) {
        target = Object.freeze({ providerKey, modelKey, readOnly: true as const });
        reason = "Provider-preferred route selected from runtime request.";
        confidence = 0.9;
      }
      break;
    }
    case "model_preferred": {
      const providerKey = input.runtimeRequest.providerKey;
      const modelKey = input.runtimeRequest.modelKey;
      if (isKnownRoute(providerKey, modelKey)) {
        target = Object.freeze({ providerKey, modelKey, readOnly: true as const });
        reason = "Model-preferred route selected from runtime request.";
        confidence = 0.95;
      }
      break;
    }
    case "capability_based": {
      if (requiredCapabilities.length === 0) {
        return Object.freeze({
          success: false,
          reason: "Capability-based routing requires requiredCapabilities.",
          decision: null,
          readOnly: true as const,
        });
      }
      target = findCapabilityRoute(requiredCapabilities);
      reason = target ? "Capability-based route matched provider capabilities." : "No route matches required capabilities.";
      confidence = target ? 0.85 : 0;
      break;
    }
    case "cost_aware": {
      target = findCostAwareRoute(pricingProfiles);
      reason = "Cost-aware placeholder selected lowest placeholder pricing profile.";
      confidence = 0.6;
      break;
    }
    case "latency_aware": {
      target = Object.freeze({ ...LLM_ROUTER_DEFAULT_ROUTE, readOnly: true as const });
      reason = "Latency-aware placeholder route — contract-level only, no live latency data.";
      confidence = 0.5;
      break;
    }
    case "local_first": {
      target = Object.freeze({
        providerKey: "local_models",
        modelKey: "local-default",
        readOnly: true as const,
      });
      reason = "Local-first placeholder route selected.";
      confidence = 0.65;
      break;
    }
    case "default_route":
    default: {
      target = Object.freeze({ ...LLM_ROUTER_DEFAULT_ROUTE, readOnly: true as const });
      reason = "Default route selected.";
      confidence = 0.7;
      break;
    }
  }

  if (!target) {
    return Object.freeze({
      success: false,
      reason: reason || "No valid route could be selected.",
      decision: null,
      readOnly: true as const,
    });
  }

  const decision = buildRouteDecision(input, target, policyKey, reason, confidence, routeDecisionId, timestamp);
  return Object.freeze({
    success: true,
    reason: "Route selected deterministically.",
    decision,
    readOnly: true as const,
  });
}
