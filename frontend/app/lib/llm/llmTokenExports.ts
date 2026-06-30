/**
 * LLM-6 — Public Token Usage Meter exports and facade.
 */

import {
  LLM_TOKEN_AGGREGATION_SCOPE_KEYS,
  LLM_TOKEN_CONTEXT_DEPENDENCY,
  LLM_TOKEN_CONTRACT_VERSION,
  LLM_TOKEN_PLATFORM_ID,
  LLM_TOKEN_PLATFORM_NAME,
  LLM_TOKEN_PRINCIPLES,
  LLM_TOKEN_PUBLIC_API_REGISTRY,
} from "./llmTokenContracts.ts";
import { aggregateTokenUsage, lookupTokenAggregation } from "./llmTokenAggregation.ts";
import {
  estimateTokenUsage,
  buildRequestTokenSummary,
  buildResponseTokenSummary,
} from "./llmTokenEstimator.ts";
import { getTokenManifest } from "./llmTokenManifest.ts";
import {
  getTokenRegistry,
  lookupTokenAggregationFromRegistry,
  lookupTokenUsage,
  recordTokenUsage,
  resetLlmTokenRegistryForTests,
  ensureLlmTokenDependenciesReady,
} from "./llmTokenRegistry.ts";
import { validateTokenRecordPublic } from "./llmTokenUsage.ts";
import type { LlmTokenMeterLayerState, LlmTokenPlatformManifest } from "./llmTokenTypes.ts";
import { validateTokenRecord } from "./llmTokenValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmTokenMeterLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmTokenRegistryForTests();
}

export function getLlmTokenMeterLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmTokenMeterLayerState {
  return Object.freeze({
    contractVersion: LLM_TOKEN_CONTRACT_VERSION,
    contextDependency: LLM_TOKEN_CONTEXT_DEPENDENCY,
    initialized: layerInitialized,
    registry: getTokenRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmTokenMeterLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmTokenMeterLayerState | null; readOnly: true }> {
  if (!ensureLlmTokenDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/5 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Token Usage Meter layer created.",
    data: getLlmTokenMeterLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmTokenPlatformManifest(): LlmTokenPlatformManifest {
  return Object.freeze({
    manifestId: "llm-token-meter-manifest",
    platformId: LLM_TOKEN_PLATFORM_ID,
    version: LLM_TOKEN_CONTRACT_VERSION,
    title: LLM_TOKEN_PLATFORM_NAME,
    goal: "Deterministic token accounting and aggregation without billing or provider tokenizers.",
    publicApis: LLM_TOKEN_PUBLIC_API_REGISTRY,
    aggregationScopes: LLM_TOKEN_AGGREGATION_SCOPE_KEYS,
    readOnly: true as const,
  });
}

export {
  recordTokenUsage,
  estimateTokenUsage,
  aggregateTokenUsage,
  validateTokenRecord,
  validateTokenRecordPublic,
  getTokenManifest,
  getTokenRegistry,
  lookupTokenUsage,
  lookupTokenAggregation,
  lookupTokenAggregationFromRegistry,
  buildRequestTokenSummary,
  buildResponseTokenSummary,
  LLM_TOKEN_PUBLIC_API_REGISTRY,
  LLM_TOKEN_PRINCIPLES,
};

export const TokenUsageMeterPlatform = Object.freeze({
  recordTokenUsage,
  estimateTokenUsage,
  aggregateTokenUsage,
  validateTokenRecord,
  getTokenManifest,
  getTokenRegistry,
  buildLlmTokenMeterLayer,
  getLlmTokenPlatformManifest,
  getLlmTokenMeterLayerState,
  resetLlmTokenMeterLayerForTests,
  version: LLM_TOKEN_CONTRACT_VERSION,
});
