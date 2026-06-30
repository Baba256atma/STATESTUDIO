/**
 * LLM-3 — Public runtime contract exports and facade.
 */

import {
  LLM_RUNTIME_CONTRACT_VERSION,
  LLM_RUNTIME_FOUNDATION_DEPENDENCY,
  LLM_RUNTIME_MODE_KEYS,
  LLM_RUNTIME_PLATFORM_ID,
  LLM_RUNTIME_PLATFORM_NAME,
  LLM_RUNTIME_PRINCIPLES,
  LLM_RUNTIME_PROVIDER_DEPENDENCY,
  LLM_RUNTIME_PUBLIC_API_REGISTRY,
  LLM_RUNTIME_STATUS_KEYS,
} from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope, buildLlmRuntimeResponseEnvelope } from "./llmRuntimeEnvelope.ts";
import { executeDryRunRuntimeRequest, executeMockRuntimeRequest } from "./llmRuntimeMock.ts";
import {
  discoverLlmRuntimeModes,
  discoverLlmRuntimeValidationRules,
  ensureLlmRuntimeDependenciesReady,
  getLlmRuntimeRegistry,
  resetLlmRuntimeRegistryForTests,
  seedDefaultLlmRuntimeRegistry,
} from "./llmRuntimeRegistry.ts";
import type { LlmRuntimeExecutionResult, LlmRuntimeLayerState, LlmRuntimeManifest } from "./llmRuntimeTypes.ts";
import { validateLlmRuntimeRequest, validateLlmRuntimeResponse } from "./llmRuntimeValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): LlmRuntimeExecutionResult | Readonly<{ success: boolean; reason: string; data: T | null; readOnly: true }> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetLlmRuntimeContractLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmRuntimeRegistryForTests();
}

export function getLlmRuntimeLayerState(timestamp: string = new Date(0).toISOString()): LlmRuntimeLayerState {
  return Object.freeze({
    contractVersion: LLM_RUNTIME_CONTRACT_VERSION,
    foundationDependency: LLM_RUNTIME_FOUNDATION_DEPENDENCY,
    providerDependency: LLM_RUNTIME_PROVIDER_DEPENDENCY,
    initialized: layerInitialized,
    registry: getLlmRuntimeRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmRuntimeContractLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmRuntimeLayerState | null; readOnly: true }> {
  if (!ensureLlmRuntimeDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 and LLM/2 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultLlmRuntimeRegistry(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Runtime contract layer created.",
    data: getLlmRuntimeLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmRuntimeManifest(): LlmRuntimeManifest {
  return Object.freeze({
    manifestId: "llm-runtime-contract-manifest",
    platformId: LLM_RUNTIME_PLATFORM_ID,
    version: LLM_RUNTIME_CONTRACT_VERSION,
    title: LLM_RUNTIME_PLATFORM_NAME,
    goal: "Canonical runtime request/response envelopes, status, lifecycle, validation, and dry-run execution contracts.",
    foundationDependency: LLM_RUNTIME_FOUNDATION_DEPENDENCY,
    providerDependency: LLM_RUNTIME_PROVIDER_DEPENDENCY,
    publicApis: LLM_RUNTIME_PUBLIC_API_REGISTRY,
    statusKeys: LLM_RUNTIME_STATUS_KEYS,
    modeKeys: LLM_RUNTIME_MODE_KEYS,
    readOnly: true as const,
  });
}

export {
  buildLlmRuntimeRequestEnvelope,
  buildLlmRuntimeResponseEnvelope,
  validateLlmRuntimeRequest,
  validateLlmRuntimeResponse,
  executeDryRunRuntimeRequest,
  executeMockRuntimeRequest,
  getLlmRuntimeRegistry,
  discoverLlmRuntimeModes,
  discoverLlmRuntimeValidationRules,
  LLM_RUNTIME_PUBLIC_API_REGISTRY,
  LLM_RUNTIME_PRINCIPLES,
};

export const LlmRuntimeContractLayer = Object.freeze({
  buildLlmRuntimeRequestEnvelope,
  buildLlmRuntimeResponseEnvelope,
  validateLlmRuntimeRequest,
  validateLlmRuntimeResponse,
  executeDryRunRuntimeRequest,
  executeMockRuntimeRequest,
  getLlmRuntimeRegistry,
  buildLlmRuntimeContractLayer,
  getLlmRuntimeManifest,
  getLlmRuntimeLayerState,
  resetLlmRuntimeContractLayerForTests,
  version: LLM_RUNTIME_CONTRACT_VERSION,
});
