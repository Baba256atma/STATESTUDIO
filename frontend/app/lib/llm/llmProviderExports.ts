/**
 * LLM-2 — Public provider adapter exports and facade.
 */

import {
  LLM_PROVIDER_CAPABILITY_KEYS,
  LLM_PROVIDER_CONTRACT_VERSION,
  LLM_PROVIDER_ERROR_CATEGORY_KEYS,
  LLM_PROVIDER_FOUNDATION_DEPENDENCY,
  LLM_PROVIDER_HEALTH_STATE_KEYS,
  LLM_PROVIDER_PLATFORM_ID,
  LLM_PROVIDER_PLATFORM_NAME,
  LLM_PROVIDER_PRINCIPLES,
  LLM_PROVIDER_PUBLIC_API_REGISTRY,
} from "./llmProviderContracts.ts";
import {
  discoverLlmProviderAdapters,
  ensureLlmProviderFoundationReady,
  getLlmProviderAdapterRegistry,
  registerLlmProviderAdapter,
  resetLlmProviderRegistryForTests,
  seedDefaultLlmProviderAdapters,
  validateLlmProviderRegistryState,
} from "./llmProviderRegistry.ts";
import type {
  LlmProviderAdapterLayerState,
  LlmProviderAdapterManifest,
  LlmProviderAdapterResult,
  LlmProviderValidationReport,
} from "./llmProviderTypes.ts";
import {
  validateLlmProviderAdapter,
  validateLlmProviderRegistry,
} from "./llmProviderValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): LlmProviderAdapterResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetLlmProviderAdapterLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmProviderRegistryForTests();
}

export function getLlmProviderAdapterLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmProviderAdapterLayerState {
  return Object.freeze({
    contractVersion: LLM_PROVIDER_CONTRACT_VERSION,
    foundationDependency: LLM_PROVIDER_FOUNDATION_DEPENDENCY,
    initialized: layerInitialized,
    adapterCount: getLlmProviderAdapterRegistry().adapterCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmProviderAdapterLayer(
  timestamp: string = new Date(0).toISOString()
): LlmProviderAdapterResult<LlmProviderAdapterLayerState> {
  const foundationReady = ensureLlmProviderFoundationReady(timestamp);
  if (!foundationReady.success) {
    return createResult(false, foundationReady.reason, null);
  }
  seedDefaultLlmProviderAdapters(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Provider adapter layer created.", getLlmProviderAdapterLayerState(timestamp));
}

export function validateLlmProviderAdapterLayer(): LlmProviderValidationReport {
  const registry = getLlmProviderAdapterRegistry();
  const issues = [...validateLlmProviderRegistry(registry.adapters).issues];
  if (!layerInitialized) {
    issues.push(Object.freeze({
      code: "not_initialized",
      message: "Provider adapter layer has not been initialized.",
      readOnly: true as const,
    }));
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function getLlmProviderAdapterManifest(): LlmProviderAdapterManifest {
  return Object.freeze({
    manifestId: "llm-provider-adapter-manifest",
    platformId: LLM_PROVIDER_PLATFORM_ID,
    version: LLM_PROVIDER_CONTRACT_VERSION,
    title: LLM_PROVIDER_PLATFORM_NAME,
    goal: "Canonical provider adapter contracts — identity, capabilities, request/response, errors, health, and registry.",
    foundationDependency: LLM_PROVIDER_FOUNDATION_DEPENDENCY,
    publicApis: LLM_PROVIDER_PUBLIC_API_REGISTRY,
    capabilityKeys: LLM_PROVIDER_CAPABILITY_KEYS,
    errorCategories: LLM_PROVIDER_ERROR_CATEGORY_KEYS,
    healthStates: LLM_PROVIDER_HEALTH_STATE_KEYS,
    readOnly: true as const,
  });
}

export {
  registerLlmProviderAdapter,
  discoverLlmProviderAdapters,
  getLlmProviderAdapterRegistry,
  validateLlmProviderAdapter,
  validateLlmProviderRegistry,
  LLM_PROVIDER_PUBLIC_API_REGISTRY,
  LLM_PROVIDER_PRINCIPLES,
};

export const LlmProviderAdapterLayer = Object.freeze({
  registerLlmProviderAdapter,
  discoverLlmProviderAdapters,
  getLlmProviderAdapterRegistry,
  validateLlmProviderAdapter,
  validateLlmProviderRegistry,
  validateLlmProviderAdapterLayer,
  buildLlmProviderAdapterLayer,
  getLlmProviderAdapterManifest,
  getLlmProviderAdapterLayerState,
  resetLlmProviderAdapterLayerForTests,
  version: LLM_PROVIDER_CONTRACT_VERSION,
});
