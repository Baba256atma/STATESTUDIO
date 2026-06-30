/**
 * LLM-4 — Prompt package validation.
 */

import { LLM_PROVIDER_KEYS } from "./llmPlatformContracts.ts";
import {
  LLM_PROMPT_COMPATIBLE_VERSIONS,
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_DEFAULT_LIMITS,
  LLM_PROMPT_REQUIRED_SECTION_KEYS,
  LLM_PROMPT_RUNTIME_DEPENDENCY,
} from "./llmPromptContracts.ts";
import { validateLlmPromptSectionOrdering } from "./llmPromptSections.ts";
import { getLlmPromptTemplateSectionKeys, isLlmPromptTemplateKey } from "./llmPromptTemplates.ts";
import type {
  LlmPromptBuildInput,
  LlmPromptPackage,
  LlmPromptTemplate,
  LlmPromptValidationIssue,
  LlmPromptValidationReport,
} from "./llmPromptTypes.ts";
import { validateLlmRuntimeRequest } from "./llmRuntimeValidation.ts";

function issue(code: string, message: string, field?: string): LlmPromptValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmPromptValidationIssue[]): LlmPromptValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validatePromptVersionCompatibility(version: string): LlmPromptValidationReport {
  if (!(LLM_PROMPT_COMPATIBLE_VERSIONS as readonly string[]).includes(version) && version !== LLM_PROMPT_CONTRACT_VERSION) {
    if (version !== LLM_PROMPT_RUNTIME_DEPENDENCY && version !== LLM_PROMPT_CONTRACT_VERSION) {
      return report([issue("incompatible_version", `Version ${version} is not compatible with LLM/4 prompt builder.`)]);
    }
  }
  return report([]);
}

export function validatePromptPackage(pkg: LlmPromptPackage): LlmPromptValidationReport {
  const issues: LlmPromptValidationIssue[] = [];
  if (pkg.promptVersion !== LLM_PROMPT_CONTRACT_VERSION) {
    issues.push(issue("prompt_version_mismatch", "Prompt version must be LLM/4.", "promptVersion"));
  }
  if (pkg.runtimeVersion !== LLM_PROMPT_RUNTIME_DEPENDENCY) {
    issues.push(issue("runtime_version_mismatch", "Runtime version must be LLM/3.", "runtimeVersion"));
  }
  if (!isLlmPromptTemplateKey(pkg.templateId)) {
    issues.push(issue("invalid_template", "Template ID is invalid.", "templateId"));
  }
  if (pkg.sections.length === 0) {
    issues.push(issue("empty_sections", "Prompt package must include sections."));
  }
  if (pkg.sections.length > LLM_PROMPT_DEFAULT_LIMITS.maxSectionsPerPackage) {
    issues.push(issue("too_many_sections", "Prompt package exceeds section limit."));
  }
  for (const message of validateLlmPromptSectionOrdering(pkg.sections)) {
    issues.push(issue("invalid_section_order", message));
  }
  for (const requiredKey of LLM_PROMPT_REQUIRED_SECTION_KEYS) {
    const section = pkg.sections.find((entry) => entry.sectionKey === requiredKey);
    if (!section || !section.contentRef.trim()) {
      issues.push(issue("missing_required_section", `Required section missing or empty: ${requiredKey}`, requiredKey));
    }
  }
  for (const section of pkg.sections) {
    if (section.contentRef.length > LLM_PROMPT_DEFAULT_LIMITS.maxContentRefLength) {
      issues.push(issue("content_ref_too_long", `Section content ref too long: ${section.sectionKey}`, section.sectionKey));
    }
  }
  if (pkg.providerCompatibility.length === 0) {
    issues.push(issue("empty_provider_compatibility", "Provider compatibility must be declared."));
  }
  for (const key of Object.keys(pkg.metadata)) {
    if (!key.trim()) {
      issues.push(issue("invalid_metadata", "Metadata keys must be non-empty.", "metadata"));
    }
  }
  return report(issues);
}

export function validatePromptBuildInput(
  input: LlmPromptBuildInput,
  template?: LlmPromptTemplate
): LlmPromptValidationReport {
  const issues: LlmPromptValidationIssue[] = [];
  const runtimeValidation = validateLlmRuntimeRequest(input.runtimeRequest);
  issues.push(...runtimeValidation.issues.map((entry) => issue(entry.code, entry.message, entry.field)));
  const templateId = input.templateId ?? "general_assistant";
  if (!isLlmPromptTemplateKey(templateId)) {
    issues.push(issue("invalid_template", "Template ID is invalid.", "templateId"));
    return report(issues);
  }
  if (!input.runtimeRequest.userMessage.trim()) {
    issues.push(issue("empty_user_message", "User message is required.", "userMessage"));
  }
  if (!input.runtimeRequest.systemInstructionRef.trim()) {
    issues.push(issue("missing_system_instruction", "System instruction reference is required.", "systemInstructionRef"));
  }
  const resolvedTemplate = template ?? Object.freeze({
    templateId,
    label: templateId,
    promptType: "assistant" as const,
    sectionKeys: getLlmPromptTemplateSectionKeys(templateId),
    version: LLM_PROMPT_CONTRACT_VERSION,
    description: "",
    registeredAt: "",
    readOnly: true as const,
  });
  if (resolvedTemplate.sectionKeys.length === 0) {
    issues.push(issue("empty_template", "Template has no section definitions.", "templateId"));
  }
  return report(issues);
}

export function validatePromptRegistryUniqueness(templates: readonly LlmPromptTemplate[]): LlmPromptValidationReport {
  const ids = templates.map((template) => template.templateId);
  if (new Set(ids).size !== ids.length) {
    return report([issue("duplicate_template", "Template IDs must be unique.")]);
  }
  return report([]);
}

export function validatePromptRuntimeCompatibility(runtimeVersion: string): LlmPromptValidationReport {
  if (runtimeVersion !== LLM_PROMPT_RUNTIME_DEPENDENCY) {
    return report([issue("runtime_incompatible", `Prompt builder requires runtime version ${LLM_PROMPT_RUNTIME_DEPENDENCY}.`)]);
  }
  return report([]);
}

export function getDefaultProviderCompatibility(): readonly (typeof LLM_PROVIDER_KEYS)[number][] {
  return LLM_PROVIDER_KEYS;
}
