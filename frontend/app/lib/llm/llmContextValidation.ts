/**
 * LLM-5 — Context package validation.
 */

import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import {
  LLM_CONTEXT_COMPATIBLE_VERSIONS,
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_DEFAULT_LIMITS,
  LLM_CONTEXT_PROMPT_DEPENDENCY,
  LLM_CONTEXT_RUNTIME_DEPENDENCY,
  LLM_CONTEXT_SECTION_ORDER,
} from "./llmContextContracts.ts";
import { isLlmContextSourceKey } from "./llmContextSources.ts";
import type {
  LlmContextBuildInput,
  LlmContextPackage,
  LlmContextReference,
  LlmContextSourceRegistration,
  LlmContextValidationIssue,
  LlmContextValidationReport,
} from "./llmContextTypes.ts";
import { validateLlmRuntimeRequest } from "./llmRuntimeValidation.ts";

function issue(code: string, message: string, field?: string): LlmContextValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: LlmContextValidationIssue[]): LlmContextValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateContextReference(reference: LlmContextReference): LlmContextValidationReport {
  const issues: LlmContextValidationIssue[] = [];
  if (!reference.referenceId.trim()) {
    issues.push(issue("missing_reference_id", "Reference ID is required.", "referenceId"));
  }
  if (!isLlmContextSourceKey(reference.sourceKey)) {
    issues.push(issue("invalid_source_key", "Context source key is invalid.", "sourceKey"));
  }
  if (!reference.refId.trim()) {
    issues.push(issue("missing_ref_id", "Reference ref ID is required.", "refId"));
  }
  if (reference.refId.length > LLM_CONTEXT_DEFAULT_LIMITS.maxRefIdLength) {
    issues.push(issue("ref_id_too_long", "Reference ref ID exceeds maximum length.", "refId"));
  }
  return report(issues);
}

export function validateContextReferenceUniqueness(references: readonly LlmContextReference[]): LlmContextValidationReport {
  const ids = references.map((reference) => reference.referenceId);
  if (new Set(ids).size !== ids.length) {
    return report([issue("duplicate_reference", "Duplicate context reference IDs are not allowed.")]);
  }
  const refKeys = references.map((reference) => `${reference.sourceKey}:${reference.refId}`);
  if (new Set(refKeys).size !== refKeys.length) {
    return report([issue("duplicate_ref_key", "Duplicate source/refId pairs are not allowed.")]);
  }
  return report([]);
}

export function validateContextSectionOrdering(
  sections: LlmContextPackage["sections"]
): LlmContextValidationReport {
  const issues: LlmContextValidationIssue[] = [];
  for (let index = 1; index < sections.length; index += 1) {
    if (sections[index].order < sections[index - 1].order) {
      issues.push(issue("invalid_section_order", "Context sections are not in deterministic order."));
      break;
    }
  }
  const sourceKeys = sections.map((section) => section.sourceKey);
  if (new Set(sourceKeys).size !== sourceKeys.length) {
    issues.push(issue("duplicate_section_source", "Each source may appear only once per package."));
  }
  for (const section of sections) {
    const expectedOrder = LLM_CONTEXT_SECTION_ORDER.indexOf(section.sourceKey);
    if (expectedOrder >= 0 && section.order !== expectedOrder) {
      issues.push(issue("section_order_mismatch", `Section order mismatch for ${section.sourceKey}.`, section.sourceKey));
    }
  }
  return report(issues);
}

export function validateContextPackage(pkg: LlmContextPackage): LlmContextValidationReport {
  const issues: LlmContextValidationIssue[] = [];
  if (pkg.version !== LLM_CONTEXT_CONTRACT_VERSION) {
    issues.push(issue("version_mismatch", "Context package version must be LLM/5.", "version"));
  }
  if (!pkg.contextId.trim()) {
    issues.push(issue("missing_context_id", "Context ID is required.", "contextId"));
  }
  if (pkg.sources.length === 0 && pkg.sections.length === 0 && pkg.unresolvedReferences.length === 0) {
    issues.push(issue("empty_package", "Context package must include sources or sections."));
  }
  if (pkg.sections.length > LLM_CONTEXT_DEFAULT_LIMITS.maxSectionsPerPackage) {
    issues.push(issue("too_many_sections", "Context package exceeds section limit."));
  }
  issues.push(...validateContextSectionOrdering(pkg.sections).issues);
  for (const version of [LLM_CONTEXT_RUNTIME_DEPENDENCY, LLM_CONTEXT_PROMPT_DEPENDENCY]) {
    if (!(pkg.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("missing_compatibility", `Missing compatibility entry: ${version}`, "compatibility"));
    }
  }
  for (const key of Object.keys(pkg.metadata)) {
    if (!key.trim()) {
      issues.push(issue("invalid_metadata", "Metadata keys must be non-empty.", "metadata"));
    }
  }
  return report(issues);
}

export function validateContextBuildInput(input: LlmContextBuildInput): LlmContextValidationReport {
  const issues: LlmContextValidationIssue[] = [];
  if (!input.contextId.trim()) {
    issues.push(issue("missing_context_id", "Context ID is required.", "contextId"));
  }
  if (input.references.length === 0) {
    issues.push(issue("empty_references", "At least one context reference is required."));
  }
  if (input.references.length > LLM_CONTEXT_DEFAULT_LIMITS.maxReferencesPerPackage) {
    issues.push(issue("too_many_references", "Too many context references."));
  }
  issues.push(...validateContextReferenceUniqueness(input.references).issues);
  for (const reference of input.references) {
    issues.push(...validateContextReference(reference).issues);
  }
  if (input.runtimeRequest) {
    issues.push(...validateLlmRuntimeRequest(input.runtimeRequest).issues.map((entry) => issue(entry.code, entry.message, entry.field)));
  }
  return report(issues);
}

export function validateContextRuntimeCompatibility(): LlmContextValidationReport {
  if (!(LLM_CONTEXT_COMPATIBLE_VERSIONS as readonly string[]).includes(LLM_CONTEXT_RUNTIME_DEPENDENCY)) {
    return report([issue("runtime_incompatible", "Context builder is incompatible with runtime version.")]);
  }
  return report([]);
}

export function validateContextPromptCompatibility(): LlmContextValidationReport {
  if (!(LLM_CONTEXT_COMPATIBLE_VERSIONS as readonly string[]).includes(LLM_CONTEXT_PROMPT_DEPENDENCY)) {
    return report([issue("prompt_incompatible", "Context builder is incompatible with prompt builder version.")]);
  }
  if (LLM_PROMPT_CONTRACT_VERSION !== LLM_CONTEXT_PROMPT_DEPENDENCY) {
    return report([issue("prompt_version_mismatch", "Prompt builder version mismatch.")]);
  }
  return report([]);
}

export function validateContextRegistryUniqueness(sources: readonly LlmContextSourceRegistration[]): LlmContextValidationReport {
  const keys = sources.map((source) => source.sourceKey);
  if (new Set(keys).size !== keys.length) {
    return report([issue("duplicate_source", "Context source keys must be unique.")]);
  }
  return report([]);
}

export function getDefaultContextCompatibility(): readonly string[] {
  return Object.freeze([...LLM_CONTEXT_COMPATIBLE_VERSIONS, LLM_CONTEXT_CONTRACT_VERSION]);
}
