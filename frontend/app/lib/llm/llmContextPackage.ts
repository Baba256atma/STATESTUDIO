/**
 * LLM-5 — Context package assembly.
 */

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { getContextManifest } from "./llmContextManifest.ts";
import { resolveContextReferences } from "./llmContextResolver.ts";
import type { LlmContextBuildInput, LlmContextBuildResult, LlmContextPackage } from "./llmContextTypes.ts";
import {
  getDefaultContextCompatibility,
  validateContextBuildInput,
  validateContextPackage,
  validateContextPromptCompatibility,
  validateContextRuntimeCompatibility,
} from "./llmContextValidation.ts";

export function buildContextPackage(
  input: LlmContextBuildInput,
  timestamp: string = new Date(0).toISOString()
): LlmContextBuildResult {
  const inputValidation = validateContextBuildInput(input);
  if (!inputValidation.valid) {
    return Object.freeze({
      success: false,
      reason: inputValidation.issues[0]?.message ?? "Context build input validation failed.",
      package: null,
      manifest: null,
      readOnly: true as const,
    });
  }

  const runtimeCompatibility = validateContextRuntimeCompatibility();
  const promptCompatibility = validateContextPromptCompatibility();
  if (!runtimeCompatibility.valid || !promptCompatibility.valid) {
    return Object.freeze({
      success: false,
      reason: "Context builder compatibility validation failed.",
      package: null,
      manifest: null,
      readOnly: true as const,
    });
  }

  const { sections, unresolved } = resolveContextReferences(input.references);
  const sourceKeys = Object.freeze([...new Set(sections.map((section) => section.sourceKey))]);

  const pkg: LlmContextPackage = Object.freeze({
    contextId: input.contextId,
    version: LLM_CONTEXT_CONTRACT_VERSION,
    sources: sourceKeys,
    sections,
    unresolvedReferences: unresolved,
    metadata: Object.freeze({
      contractVersion: LLM_CONTEXT_CONTRACT_VERSION,
      referenceCount: String(input.references.length),
      resolvedCount: String(sections.length),
      unresolvedCount: String(unresolved.length),
      ...(input.runtimeRequest
        ? Object.freeze({
            requestId: input.runtimeRequest.requestId,
            traceId: input.runtimeRequest.traceId,
            correlationId: input.runtimeRequest.correlationId,
          })
        : {}),
      ...(input.additionalMetadata ?? {}),
    }),
    compatibility: getDefaultContextCompatibility(),
    createdAt: timestamp,
    readOnly: true as const,
  });

  const packageValidation = validateContextPackage(pkg);
  if (!packageValidation.valid) {
    return Object.freeze({
      success: false,
      reason: packageValidation.issues[0]?.message ?? "Context package validation failed.",
      package: null,
      manifest: null,
      readOnly: true as const,
    });
  }

  if (unresolved.length > 0) {
    return Object.freeze({
      success: false,
      reason: `Unresolved references: ${unresolved.map((reference) => reference.referenceId).join(", ")}`,
      package: pkg,
      manifest: getContextManifest(pkg),
      readOnly: true as const,
    });
  }

  const manifest = getContextManifest(pkg);
  return Object.freeze({
    success: true,
    reason: "Context package assembled deterministically.",
    package: pkg,
    manifest,
    readOnly: true as const,
  });
}

export function buildContextContentRefFromPackage(pkg: LlmContextPackage): string {
  const refs = pkg.sections.map((section) => section.contentRef).join("|");
  return `context-package-ref://${pkg.contextId}?sections=${refs}`;
}

export function validateContextPackagePublic(pkg: LlmContextPackage) {
  return validateContextPackage(pkg);
}
