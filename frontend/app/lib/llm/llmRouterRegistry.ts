/**
 * LLM-8 — Model router registry.
 */

import { buildLlmCostEstimatorLayer } from "./llmCostExports.ts";
import {
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_DEFAULT_LIMITS,
  LLM_ROUTER_KNOWN_ROUTES,
  LLM_ROUTER_POLICY_KEYS,
} from "./llmRouterContracts.ts";
import { buildLlmRoutePolicyRegistration } from "./llmRouterPolicies.ts";
import { selectLlmModelRoute } from "./llmRouterSelection.ts";
import type {
  LlmRoutePolicyKey,
  LlmRoutePolicyRegistration,
  LlmRouteSelectionInput,
  LlmRouteSelectionResult,
  LlmRouterRegistry,
} from "./llmRouterTypes.ts";

const policyRegistry = new Map<LlmRoutePolicyKey, LlmRoutePolicyRegistration>();

export function resetLlmRouterRegistryForTests(): void {
  policyRegistry.clear();
}

export function registerLlmRoutePolicy(
  policyKey: LlmRoutePolicyKey,
  timestamp: string
): LlmRoutePolicyRegistration {
  const registration = buildLlmRoutePolicyRegistration(policyKey, timestamp);
  policyRegistry.set(policyKey, registration);
  return registration;
}

export function discoverLlmRoutePolicies(): readonly LlmRoutePolicyRegistration[] {
  return getLlmRouterRegistry().policies;
}

export function getLlmRouterRegistry(): LlmRouterRegistry {
  const policies = Object.freeze([...policyRegistry.values()].sort((left, right) =>
    left.policyKey.localeCompare(right.policyKey)
  ));
  return Object.freeze({
    policies,
    policyCount: policies.length,
    knownRoutes: Object.freeze(
      LLM_ROUTER_KNOWN_ROUTES.map((route) => Object.freeze({ ...route, readOnly: true as const }))
    ),
    readOnly: true as const,
  });
}

export function seedDefaultLlmRoutePolicies(timestamp: string): void {
  if (policyRegistry.size >= LLM_ROUTER_DEFAULT_LIMITS.maxRegisteredPolicies) {
    return;
  }
  for (const policyKey of LLM_ROUTER_POLICY_KEYS) {
    registerLlmRoutePolicy(policyKey, timestamp);
  }
}

export function ensureLlmRouterDependenciesReady(timestamp: string): boolean {
  const costLayer = buildLlmCostEstimatorLayer(timestamp);
  return costLayer.success;
}

export function selectLlmModelRouteFromRegistry(
  input: LlmRouteSelectionInput,
  routeDecisionId: string,
  timestamp: string,
  pricingProfiles: readonly import("./llmCostTypes.ts").LlmCostPricingProfile[]
): LlmRouteSelectionResult {
  return selectLlmModelRoute(input, routeDecisionId, timestamp, pricingProfiles);
}

export function getLlmRouterRegistryVersion(): typeof LLM_ROUTER_CONTRACT_VERSION {
  return LLM_ROUTER_CONTRACT_VERSION;
}
