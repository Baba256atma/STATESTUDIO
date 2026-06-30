/**
 * LLM-4 — Prompt section definitions and ordering.
 */

import {
  LLM_PROMPT_REQUIRED_SECTION_KEYS,
  LLM_PROMPT_SECTION_KEYS,
} from "./llmPromptContracts.ts";
import type { LlmPromptSection, LlmPromptSectionKey } from "./llmPromptTypes.ts";

export function isLlmPromptSectionKey(value: string): value is LlmPromptSectionKey {
  return (LLM_PROMPT_SECTION_KEYS as readonly string[]).includes(value);
}

export function isLlmPromptRequiredSection(sectionKey: LlmPromptSectionKey): boolean {
  return (LLM_PROMPT_REQUIRED_SECTION_KEYS as readonly string[]).includes(sectionKey);
}

export function getLlmPromptSectionOrder(sectionKey: LlmPromptSectionKey): number {
  return LLM_PROMPT_SECTION_KEYS.indexOf(sectionKey);
}

export function sortLlmPromptSections(sections: readonly LlmPromptSection[]): readonly LlmPromptSection[] {
  return Object.freeze([...sections].sort((left, right) => left.order - right.order));
}

export function buildLlmPromptSection(
  sectionKey: LlmPromptSectionKey,
  contentRef: string,
  required: boolean = isLlmPromptRequiredSection(sectionKey)
): LlmPromptSection | null {
  if (!contentRef.trim()) {
    return required ? Object.freeze({
      sectionId: `section-${sectionKey}`,
      sectionKey,
      order: getLlmPromptSectionOrder(sectionKey),
      contentRef: "",
      required,
      readOnly: true as const,
    }) : null;
  }
  return Object.freeze({
    sectionId: `section-${sectionKey}`,
    sectionKey,
    order: getLlmPromptSectionOrder(sectionKey),
    contentRef,
    required,
    readOnly: true as const,
  });
}

export function getAllLlmPromptSectionKeys(): readonly LlmPromptSectionKey[] {
  return LLM_PROMPT_SECTION_KEYS;
}

export function validateLlmPromptSectionOrdering(sections: readonly LlmPromptSection[]): readonly string[] {
  const issues: string[] = [];
  const sorted = sortLlmPromptSections(sections);
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].order < sorted[index - 1].order) {
      issues.push("Prompt sections are not in deterministic order.");
      break;
    }
  }
  const seen = new Set<LlmPromptSectionKey>();
  for (const section of sections) {
    if (seen.has(section.sectionKey)) {
      issues.push(`Duplicate section key: ${section.sectionKey}`);
    }
    seen.add(section.sectionKey);
  }
  return Object.freeze(issues);
}
