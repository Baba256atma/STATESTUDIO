/**
 * LLM-4 — Deterministic prompt assembly.
 */

import {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_RUNTIME_DEPENDENCY,
  LLM_PROMPT_TEMPLATE_TYPES,
} from "./llmPromptContracts.ts";
import { getPromptManifest } from "./llmPromptManifest.ts";
import { buildLlmPromptSection, sortLlmPromptSections } from "./llmPromptSections.ts";
import {
  getLlmPromptTemplateSectionKeys,
  resolveDefaultPromptTemplateKey,
} from "./llmPromptTemplates.ts";
import type {
  LlmPromptBuildInput,
  LlmPromptBuildResult,
  LlmPromptPackage,
  LlmPromptSection,
  LlmPromptSectionKey,
} from "./llmPromptTypes.ts";
import {
  getDefaultProviderCompatibility,
  validatePromptBuildInput,
  validatePromptPackage,
} from "./llmPromptValidation.ts";

function resolveSectionContentRef(
  sectionKey: LlmPromptSectionKey,
  input: LlmPromptBuildInput
): string {
  const request = input.runtimeRequest;
  switch (sectionKey) {
    case "system":
      return request.systemInstructionRef;
    case "developer":
      return input.developerContentRef ?? "";
    case "context_reference":
      return input.contextContentRef ?? request.metadata.contextRef ?? "";
    case "user":
      return request.userMessage;
    case "constraints":
      return input.constraintsContentRef ?? request.metadata.constraintsRef ?? "";
    case "output_format":
      return input.outputFormatContentRef ?? request.metadata.outputFormatRef ?? "output-format-ref-default";
    case "safety":
      return input.safetyContentRef ?? request.metadata.safetyRef ?? "";
    case "metadata":
      return JSON.stringify({
        traceId: request.traceId,
        correlationId: request.correlationId,
        workspaceId: request.workspaceId,
        organizationId: request.organizationId,
        userId: request.userId,
        ...(input.additionalMetadata ?? {}),
      });
    default:
      return "";
  }
}

export function assemblePromptSections(input: LlmPromptBuildInput): readonly LlmPromptSection[] {
  const templateId = input.templateId ?? resolveDefaultPromptTemplateKey();
  const sectionKeys = getLlmPromptTemplateSectionKeys(templateId);
  const sections: LlmPromptSection[] = [];
  for (const sectionKey of sectionKeys) {
    const contentRef = resolveSectionContentRef(sectionKey, input);
    const section = buildLlmPromptSection(sectionKey, contentRef);
    if (section) {
      sections.push(section);
    }
  }
  return sortLlmPromptSections(sections);
}

export function buildPromptPackage(
  input: LlmPromptBuildInput,
  timestamp: string = new Date(0).toISOString()
): LlmPromptBuildResult {
  const templateId = input.templateId ?? resolveDefaultPromptTemplateKey();
  const inputValidation = validatePromptBuildInput(input);
  if (!inputValidation.valid) {
    return Object.freeze({
      success: false,
      reason: inputValidation.issues[0]?.message ?? "Prompt build input validation failed.",
      package: null,
      manifest: null,
      readOnly: true as const,
    });
  }

  const sections = assemblePromptSections(input);
  const pkg: LlmPromptPackage = Object.freeze({
    promptId: `prompt-${input.runtimeRequest.requestId}`,
    promptVersion: LLM_PROMPT_CONTRACT_VERSION,
    runtimeVersion: LLM_PROMPT_RUNTIME_DEPENDENCY,
    providerCompatibility: getDefaultProviderCompatibility(),
    promptType: LLM_PROMPT_TEMPLATE_TYPES[templateId],
    templateId,
    sections,
    metadata: Object.freeze({
      requestId: input.runtimeRequest.requestId,
      traceId: input.runtimeRequest.traceId,
      correlationId: input.runtimeRequest.correlationId,
      providerKey: input.runtimeRequest.providerKey,
      modelKey: input.runtimeRequest.modelKey,
      contractVersion: LLM_PROMPT_CONTRACT_VERSION,
      ...(input.additionalMetadata ?? {}),
    }),
    createdAt: timestamp,
    readOnly: true as const,
  });

  const packageValidation = validatePromptPackage(pkg);
  if (!packageValidation.valid) {
    return Object.freeze({
      success: false,
      reason: packageValidation.issues[0]?.message ?? "Prompt package validation failed.",
      package: null,
      manifest: null,
      readOnly: true as const,
    });
  }

  const manifest = getPromptManifest(pkg);
  return Object.freeze({
    success: true,
    reason: "Prompt package assembled deterministically.",
    package: pkg,
    manifest,
    readOnly: true as const,
  });
}

export function validatePromptPackagePublic(pkg: LlmPromptPackage) {
  return validatePromptPackage(pkg);
}
