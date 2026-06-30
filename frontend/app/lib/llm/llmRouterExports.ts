/**
 * LLM-8 — Public Model Router exports and facade.
 */

import { getLlmCostRegistry } from "./llmCostExports.ts";
import {
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_COST_DEPENDENCY,
  LLM_ROUTER_PLATFORM_ID,
  LLM_ROUTER_PLATFORM_NAME,
  LLM_ROUTER_POLICY_KEYS,
  LLM_ROUTER_PRINCIPLES,
  LLM_ROUTER_PUBLIC_API_REGISTRY,
} from "./llmRouterContracts.ts";
import { getLlmRouteManifest } from "./llmRouterManifest.ts";
import {
  discoverLlmRoutePolicies,
  ensureLlmRouterDependenciesReady,
  getLlmRouterRegistry,
  registerLlmRoutePolicy,
  resetLlmRouterRegistryForTests,
  seedDefaultLlmRoutePolicies,
} from "./llmRouterRegistry.ts";
import { selectLlmModelRoute } from "./llmRouterSelection.ts";
import type { LlmRouteSelectionInput, LlmRouteSelectionResult, LlmRouterLayerState, LlmRouterPlatformManifest } from "./llmRouterTypes.ts";
import {
  validateCostAwareRouteCompatibility,
  validateLlmRouteDecision,
} from "./llmRouterValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmModelRouterLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmRouterRegistryForTests();
}

export function getLlmModelRouterLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmRouterLayerState {
  return Object.freeze({
    contractVersion: LLM_ROUTER_CONTRACT_VERSION,
    costDependency: LLM_ROUTER_COST_DEPENDENCY,
    initialized: layerInitialized,
    registry: getLlmRouterRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmModelRouterLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmRouterLayerState | null; readOnly: true }> {
  if (!ensureLlmRouterDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/7 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultLlmRoutePolicies(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Model Router layer created.",
    data: getLlmModelRouterLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmRouterPlatformManifest(): LlmRouterPlatformManifest {
  return Object.freeze({
    manifestId: "llm-model-router-manifest",
    platformId: LLM_ROUTER_PLATFORM_ID,
    version: LLM_ROUTER_CONTRACT_VERSION,
    title: LLM_ROUTER_PLATFORM_NAME,
    goal: "Deterministic provider/model route selection without execution, billing, or live health checks.",
    publicApis: LLM_ROUTER_PUBLIC_API_REGISTRY,
    policyKeys: LLM_ROUTER_POLICY_KEYS,
    readOnly: true as const,
  });
}

export function selectLlmModelRoutePublic(
  input: LlmRouteSelectionInput,
  routeDecisionId: string,
  timestamp: string = new Date(0).toISOString()
): LlmRouteSelectionResult {
  return selectLlmModelRoute(input, routeDecisionId, timestamp, getLlmCostRegistry().pricingProfiles);
}

export function validateLlmRouteDecisionPublic(
  decision: import("./llmRouterTypes.ts").LlmRouteDecision
) {
  const base = validateLlmRouteDecision(decision);
  if (!base.valid) {
    return base;
  }
  const costValidation = validateCostAwareRouteCompatibility(decision, getLlmCostRegistry().pricingProfiles);
  if (!costValidation.valid) {
    return costValidation;
  }
  return base;
}

export {
  selectLlmModelRoutePublic as selectLlmModelRoute,
  validateLlmRouteDecisionPublic as validateLlmRouteDecision,
  registerLlmRoutePolicy,
  discoverLlmRoutePolicies,
  getLlmRouteManifest,
  getLlmRouterRegistry,
  LLM_ROUTER_PUBLIC_API_REGISTRY,
  LLM_ROUTER_PRINCIPLES,
};

export const ModelRouterPlatform = Object.freeze({
  selectLlmModelRoute: selectLlmModelRoutePublic,
  validateLlmRouteDecision: validateLlmRouteDecisionPublic,
  registerLlmRoutePolicy,
  discoverLlmRoutePolicies,
  getLlmRouteManifest,
  getLlmRouterRegistry,
  buildLlmModelRouterLayer,
  getLlmRouterPlatformManifest,
  getLlmModelRouterLayerState,
  resetLlmModelRouterLayerForTests,
  version: LLM_ROUTER_CONTRACT_VERSION,
});
