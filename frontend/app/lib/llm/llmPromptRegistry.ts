/**
 * LLM-4 — Prompt template registry.
 */

import { buildLlmRuntimeContractLayer } from "./llmRuntimeExports.ts";
import {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_DEFAULT_LIMITS,
  LLM_PROMPT_TEMPLATE_KEYS,
} from "./llmPromptContracts.ts";
import {
  buildLlmPromptTemplateDefinition,
  getAllLlmPromptTemplateKeys,
  isLlmPromptTemplateKey,
} from "./llmPromptTemplates.ts";
import type { LlmPromptRegistry, LlmPromptTemplate, LlmPromptTemplateKey } from "./llmPromptTypes.ts";
import { validatePromptRegistryUniqueness } from "./llmPromptValidation.ts";

const templateRegistry = new Map<LlmPromptTemplateKey, LlmPromptTemplate>();

export function resetLlmPromptRegistryForTests(): void {
  templateRegistry.clear();
}

export function registerPromptTemplate(
  templateId: LlmPromptTemplateKey,
  timestamp: string
): LlmPromptTemplate {
  const template = buildLlmPromptTemplateDefinition(templateId, timestamp);
  templateRegistry.set(templateId, template);
  return template;
}

export function discoverPromptTemplates(): readonly LlmPromptTemplate[] {
  return getPromptRegistry().templates;
}

export function getPromptRegistry(): LlmPromptRegistry {
  const templates = Object.freeze([...templateRegistry.values()].sort((left, right) =>
    left.templateId.localeCompare(right.templateId)
  ));
  return Object.freeze({
    templates,
    templateCount: templates.length,
    readOnly: true as const,
  });
}

export function lookupPromptTemplate(templateId: LlmPromptTemplateKey): LlmPromptTemplate | null {
  return templateRegistry.get(templateId) ?? null;
}

export function lookupPromptTemplateVersion(templateId: LlmPromptTemplateKey): string | null {
  return templateRegistry.get(templateId)?.version ?? null;
}

export function lookupPromptTemplateCompatibility(templateId: LlmPromptTemplateKey): readonly string[] | null {
  const template = templateRegistry.get(templateId);
  if (!template) {
    return null;
  }
  return Object.freeze([LLM_PROMPT_CONTRACT_VERSION, template.version]);
}

export function seedDefaultPromptTemplates(timestamp: string): void {
  if (templateRegistry.size >= LLM_PROMPT_DEFAULT_LIMITS.maxRegisteredTemplates) {
    return;
  }
  for (const templateId of LLM_PROMPT_TEMPLATE_KEYS) {
    registerPromptTemplate(templateId, timestamp);
  }
}

export function ensureLlmPromptDependenciesReady(timestamp: string): boolean {
  const runtimeLayer = buildLlmRuntimeContractLayer(timestamp);
  return runtimeLayer.success;
}

export function validatePromptRegistryState(): boolean {
  return validatePromptRegistryUniqueness(getPromptRegistry().templates).valid;
}

export { isLlmPromptTemplateKey, getAllLlmPromptTemplateKeys };
