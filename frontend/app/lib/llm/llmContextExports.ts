/**
 * LLM-5 — Public Context Builder exports and facade.
 */

import {
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_FOUNDATION_DEPENDENCY,
  LLM_CONTEXT_PLATFORM_ID,
  LLM_CONTEXT_PLATFORM_NAME,
  LLM_CONTEXT_PRINCIPLES,
  LLM_CONTEXT_PROMPT_DEPENDENCY,
  LLM_CONTEXT_PUBLIC_API_REGISTRY,
  LLM_CONTEXT_SOURCE_KEYS,
} from "./llmContextContracts.ts";
import { buildContextPackage, validateContextPackagePublic } from "./llmContextPackage.ts";
import { getContextManifest } from "./llmContextManifest.ts";
import { resetLlmContextApprovedReferencesForTests } from "./llmContextResolver.ts";
import {
  discoverContextSources,
  ensureLlmContextDependenciesReady,
  getContextRegistry,
  registerContextSource,
  resetLlmContextRegistryForTests,
  seedDefaultContextSources,
} from "./llmContextRegistry.ts";
import type { LlmContextBuilderLayerState, LlmContextPlatformManifest } from "./llmContextTypes.ts";
import { validateContextPackage } from "./llmContextValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmContextBuilderLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmContextRegistryForTests();
  resetLlmContextApprovedReferencesForTests();
}

export function getLlmContextBuilderLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmContextBuilderLayerState {
  return Object.freeze({
    contractVersion: LLM_CONTEXT_CONTRACT_VERSION,
    foundationDependency: LLM_CONTEXT_FOUNDATION_DEPENDENCY,
    promptDependency: LLM_CONTEXT_PROMPT_DEPENDENCY,
    initialized: layerInitialized,
    registry: getContextRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmContextBuilderLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmContextBuilderLayerState | null; readOnly: true }> {
  if (!ensureLlmContextDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1 through LLM/4 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultContextSources(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Context Builder layer created.",
    data: getLlmContextBuilderLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmContextPlatformManifest(): LlmContextPlatformManifest {
  return Object.freeze({
    manifestId: "llm-context-builder-manifest",
    platformId: LLM_CONTEXT_PLATFORM_ID,
    version: LLM_CONTEXT_CONTRACT_VERSION,
    title: LLM_CONTEXT_PLATFORM_NAME,
    goal: "Deterministic context composition from approved references for Prompt Builder consumption.",
    publicApis: LLM_CONTEXT_PUBLIC_API_REGISTRY,
    sourceKeys: LLM_CONTEXT_SOURCE_KEYS,
    readOnly: true as const,
  });
}

export {
  buildContextPackage,
  validateContextPackage,
  validateContextPackagePublic,
  registerContextSource,
  discoverContextSources,
  getContextManifest,
  getContextRegistry,
  LLM_CONTEXT_PUBLIC_API_REGISTRY,
  LLM_CONTEXT_PRINCIPLES,
};

export const ContextBuilderPlatform = Object.freeze({
  buildContextPackage,
  validateContextPackage,
  registerContextSource,
  discoverContextSources,
  getContextManifest,
  getContextRegistry,
  buildLlmContextBuilderLayer,
  getLlmContextPlatformManifest,
  getLlmContextBuilderLayerState,
  resetLlmContextBuilderLayerForTests,
  version: LLM_CONTEXT_CONTRACT_VERSION,
});
