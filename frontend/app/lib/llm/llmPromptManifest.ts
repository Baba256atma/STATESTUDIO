/**
 * LLM-4 — Prompt manifest generation.
 */

import { LLM_PROMPT_COMPATIBLE_VERSIONS, LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { validatePromptPackage } from "./llmPromptValidation.ts";
import type { LlmPromptManifest, LlmPromptPackage } from "./llmPromptTypes.ts";

export function getPromptManifest(pkg: LlmPromptPackage): LlmPromptManifest {
  const validation = validatePromptPackage(pkg);
  return Object.freeze({
    manifestId: `prompt-manifest-${pkg.promptId}`,
    promptId: pkg.promptId,
    templateId: pkg.templateId,
    version: LLM_PROMPT_CONTRACT_VERSION,
    sectionCount: pkg.sections.length,
    compatibility: Object.freeze([...LLM_PROMPT_COMPATIBLE_VERSIONS, LLM_PROMPT_CONTRACT_VERSION]),
    validationResult: validation.valid ? "valid" : "invalid",
    readOnly: true as const,
  });
}

export function getPromptManifestValidationResult(pkg: LlmPromptPackage): "valid" | "invalid" {
  return getPromptManifest(pkg).validationResult;
}
