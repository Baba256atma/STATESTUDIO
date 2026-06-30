/**
 * LLM-4 — Prompt template contracts (structure only).
 */

import {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_TEMPLATE_KEYS,
  LLM_PROMPT_TEMPLATE_LABELS,
  LLM_PROMPT_TEMPLATE_SECTIONS,
  LLM_PROMPT_TEMPLATE_TYPES,
} from "./llmPromptContracts.ts";
import type { LlmPromptSectionKey, LlmPromptTemplate, LlmPromptTemplateKey } from "./llmPromptTypes.ts";

export function isLlmPromptTemplateKey(value: string): value is LlmPromptTemplateKey {
  return (LLM_PROMPT_TEMPLATE_KEYS as readonly string[]).includes(value);
}

export function getLlmPromptTemplateSectionKeys(templateId: LlmPromptTemplateKey): readonly LlmPromptSectionKey[] {
  return LLM_PROMPT_TEMPLATE_SECTIONS[templateId];
}

export function buildLlmPromptTemplateDefinition(
  templateId: LlmPromptTemplateKey,
  timestamp: string
): LlmPromptTemplate {
  return Object.freeze({
    templateId,
    label: LLM_PROMPT_TEMPLATE_LABELS[templateId],
    promptType: LLM_PROMPT_TEMPLATE_TYPES[templateId],
    sectionKeys: LLM_PROMPT_TEMPLATE_SECTIONS[templateId],
    version: LLM_PROMPT_CONTRACT_VERSION,
    description: `Structure-only template for ${LLM_PROMPT_TEMPLATE_LABELS[templateId]}. No business intelligence.`,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmPromptTemplateKeys(): readonly LlmPromptTemplateKey[] {
  return LLM_PROMPT_TEMPLATE_KEYS;
}

export function resolveDefaultPromptTemplateKey(): LlmPromptTemplateKey {
  return "general_assistant";
}
