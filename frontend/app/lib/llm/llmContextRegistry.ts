/**
 * LLM-5 — Context source registry.
 */

import { buildLlmPromptBuilderLayer } from "./llmPromptExports.ts";
import {
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_DEFAULT_LIMITS,
  LLM_CONTEXT_SOURCE_KEYS,
} from "./llmContextContracts.ts";
import { buildLlmContextSourceRegistration, isLlmContextSourceKey } from "./llmContextSources.ts";
import type { LlmContextRegistry, LlmContextSourceKey, LlmContextSourceRegistration } from "./llmContextTypes.ts";
import { validateContextRegistryUniqueness } from "./llmContextValidation.ts";

const sourceRegistry = new Map<LlmContextSourceKey, LlmContextSourceRegistration>();

export function resetLlmContextRegistryForTests(): void {
  sourceRegistry.clear();
}

export function registerContextSource(
  sourceKey: LlmContextSourceKey,
  timestamp: string
): LlmContextSourceRegistration {
  const registration = buildLlmContextSourceRegistration(sourceKey, timestamp);
  sourceRegistry.set(sourceKey, registration);
  return registration;
}

export function discoverContextSources(): readonly LlmContextSourceRegistration[] {
  return getContextRegistry().sources;
}

export function getContextRegistry(): LlmContextRegistry {
  const sources = Object.freeze([...sourceRegistry.values()].sort((left, right) =>
    left.sourceKey.localeCompare(right.sourceKey)
  ));
  return Object.freeze({
    sources,
    sourceCount: sources.length,
    readOnly: true as const,
  });
}

export function lookupContextSourceCompatibility(sourceKey: LlmContextSourceKey): readonly string[] | null {
  const source = sourceRegistry.get(sourceKey);
  if (!source) {
    return null;
  }
  return Object.freeze([LLM_CONTEXT_CONTRACT_VERSION, source.version]);
}

export function seedDefaultContextSources(timestamp: string): void {
  if (sourceRegistry.size >= LLM_CONTEXT_DEFAULT_LIMITS.maxRegisteredSources) {
    return;
  }
  for (const sourceKey of LLM_CONTEXT_SOURCE_KEYS) {
    registerContextSource(sourceKey, timestamp);
  }
}

export function ensureLlmContextDependenciesReady(timestamp: string): boolean {
  const promptLayer = buildLlmPromptBuilderLayer(timestamp);
  return promptLayer.success;
}

export function validateContextRegistryState(): boolean {
  return validateContextRegistryUniqueness(getContextRegistry().sources).valid;
}

export { isLlmContextSourceKey };
