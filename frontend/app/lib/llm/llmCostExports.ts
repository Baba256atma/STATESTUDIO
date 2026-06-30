/**
 * LLM-7 — Public Cost Estimator exports and facade.
 */

import {
  LLM_COST_AGGREGATION_SCOPE_KEYS,
  LLM_COST_CONTRACT_VERSION,
  LLM_COST_PLATFORM_ID,
  LLM_COST_PLATFORM_NAME,
  LLM_COST_PRINCIPLES,
  LLM_COST_PUBLIC_API_REGISTRY,
  LLM_COST_TOKEN_DEPENDENCY,
} from "./llmCostContracts.ts";
import { aggregateLlmCost, lookupLlmCostAggregation } from "./llmCostAggregation.ts";
import { estimateLlmCost as estimateLlmCostFromProfiles } from "./llmCostEstimator.ts";
import { getLlmCostManifest } from "./llmCostManifest.ts";
import {
  ensureLlmCostDependenciesReady,
  getLlmCostRegistry,
  lookupLlmCostAggregationFromRegistry,
  lookupLlmCostRecord,
  recordLlmCost,
  registerPricingProfile,
  registerProviderModelPricingProfile,
  resetLlmCostRegistryForTests,
} from "./llmCostRegistry.ts";
import type { LlmCostEstimate, LlmCostEstimateInput, LlmCostEstimatorLayerState, LlmCostPlatformManifest } from "./llmCostTypes.ts";
import { validateLlmCostRecord } from "./llmCostValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function estimateLlmCost(input: LlmCostEstimateInput): LlmCostEstimate | null {
  return estimateLlmCostFromProfiles(input, getLlmCostRegistry().pricingProfiles);
}

export function resetLlmCostEstimatorLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmCostRegistryForTests();
}

export function getLlmCostEstimatorLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmCostEstimatorLayerState {
  return Object.freeze({
    contractVersion: LLM_COST_CONTRACT_VERSION,
    tokenDependency: LLM_COST_TOKEN_DEPENDENCY,
    initialized: layerInitialized,
    registry: getLlmCostRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmCostEstimatorLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmCostEstimatorLayerState | null; readOnly: true }> {
  if (!ensureLlmCostDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/6 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Cost Estimator layer created.",
    data: getLlmCostEstimatorLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmCostPlatformManifest(): LlmCostPlatformManifest {
  return Object.freeze({
    manifestId: "llm-cost-estimator-manifest",
    platformId: LLM_COST_PLATFORM_ID,
    version: LLM_COST_CONTRACT_VERSION,
    title: LLM_COST_PLATFORM_NAME,
    goal: "Deterministic monetary cost estimation from LLM-6 token usage records without billing or live pricing.",
    publicApis: LLM_COST_PUBLIC_API_REGISTRY,
    aggregationScopes: LLM_COST_AGGREGATION_SCOPE_KEYS,
    readOnly: true as const,
  });
}

export {
  recordLlmCost,
  aggregateLlmCost,
  validateLlmCostRecord,
  getLlmCostManifest,
  getLlmCostRegistry,
  registerPricingProfile,
  registerProviderModelPricingProfile,
  lookupLlmCostRecord,
  lookupLlmCostAggregation,
  lookupLlmCostAggregationFromRegistry,
  LLM_COST_PUBLIC_API_REGISTRY,
  LLM_COST_PRINCIPLES,
};

export const CostEstimatorPlatform = Object.freeze({
  estimateLlmCost,
  recordLlmCost,
  aggregateLlmCost,
  validateLlmCostRecord,
  getLlmCostManifest,
  getLlmCostRegistry,
  registerPricingProfile,
  buildLlmCostEstimatorLayer,
  getLlmCostPlatformManifest,
  getLlmCostEstimatorLayerState,
  resetLlmCostEstimatorLayerForTests,
  version: LLM_COST_CONTRACT_VERSION,
});
