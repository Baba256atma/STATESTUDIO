/**
 * LLM-4 — Public Prompt Builder exports and facade.
 */

import {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_FOUNDATION_DEPENDENCY,
  LLM_PROMPT_PLATFORM_ID,
  LLM_PROMPT_PLATFORM_NAME,
  LLM_PROMPT_PRINCIPLES,
  LLM_PROMPT_PUBLIC_API_REGISTRY,
  LLM_PROMPT_RUNTIME_DEPENDENCY,
  LLM_PROMPT_SECTION_KEYS,
  LLM_PROMPT_TEMPLATE_KEYS,
} from "./llmPromptContracts.ts";
import { buildPromptPackage, validatePromptPackagePublic } from "./llmPromptAssembler.ts";
import { getPromptManifest } from "./llmPromptManifest.ts";
import {
  discoverPromptTemplates,
  ensureLlmPromptDependenciesReady,
  getPromptRegistry,
  registerPromptTemplate,
  resetLlmPromptRegistryForTests,
  seedDefaultPromptTemplates,
} from "./llmPromptRegistry.ts";
import type { LlmPromptBuilderLayerState, LlmPromptPlatformManifest } from "./llmPromptTypes.ts";
import { validatePromptPackage } from "./llmPromptValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetLlmPromptBuilderLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetLlmPromptRegistryForTests();
}

export function getLlmPromptBuilderLayerState(
  timestamp: string = new Date(0).toISOString()
): LlmPromptBuilderLayerState {
  return Object.freeze({
    contractVersion: LLM_PROMPT_CONTRACT_VERSION,
    foundationDependency: LLM_PROMPT_FOUNDATION_DEPENDENCY,
    runtimeDependency: LLM_PROMPT_RUNTIME_DEPENDENCY,
    initialized: layerInitialized,
    registry: getPromptRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildLlmPromptBuilderLayer(
  timestamp: string = new Date(0).toISOString()
): Readonly<{ success: boolean; reason: string; data: LlmPromptBuilderLayerState | null; readOnly: true }> {
  if (!ensureLlmPromptDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "LLM/1, LLM/2, and LLM/3 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedDefaultPromptTemplates(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Prompt Builder layer created.",
    data: getLlmPromptBuilderLayerState(timestamp),
    readOnly: true as const,
  });
}

export function getLlmPromptPlatformManifest(): LlmPromptPlatformManifest {
  return Object.freeze({
    manifestId: "llm-prompt-builder-manifest",
    platformId: LLM_PROMPT_PLATFORM_ID,
    version: LLM_PROMPT_CONTRACT_VERSION,
    title: LLM_PROMPT_PLATFORM_NAME,
    goal: "Deterministic, provider-neutral prompt package composition from validated runtime requests.",
    publicApis: LLM_PROMPT_PUBLIC_API_REGISTRY,
    templateKeys: LLM_PROMPT_TEMPLATE_KEYS,
    sectionKeys: LLM_PROMPT_SECTION_KEYS,
    readOnly: true as const,
  });
}

export {
  buildPromptPackage,
  validatePromptPackage,
  validatePromptPackagePublic,
  registerPromptTemplate,
  discoverPromptTemplates,
  getPromptManifest,
  getPromptRegistry,
  LLM_PROMPT_PUBLIC_API_REGISTRY,
  LLM_PROMPT_PRINCIPLES,
};

export const PromptBuilderPlatform = Object.freeze({
  buildPromptPackage,
  validatePromptPackage,
  registerPromptTemplate,
  discoverPromptTemplates,
  getPromptManifest,
  getPromptRegistry,
  buildLlmPromptBuilderLayer,
  getLlmPromptPlatformManifest,
  getLlmPromptBuilderLayerState,
  resetLlmPromptBuilderLayerForTests,
  version: LLM_PROMPT_CONTRACT_VERSION,
});
