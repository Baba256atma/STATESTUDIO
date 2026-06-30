/**
 * LLM-5 — Context manifest generation.
 */

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { validateContextPackage } from "./llmContextValidation.ts";
import type { LlmContextManifest, LlmContextPackage } from "./llmContextTypes.ts";

export function getContextManifest(pkg: LlmContextPackage): LlmContextManifest {
  const validation = validateContextPackage(pkg);
  return Object.freeze({
    manifestId: `context-manifest-${pkg.contextId}`,
    contextId: pkg.contextId,
    version: LLM_CONTEXT_CONTRACT_VERSION,
    sourceCount: pkg.sources.length,
    sectionCount: pkg.sections.length,
    unresolvedCount: pkg.unresolvedReferences.length,
    compatibility: pkg.compatibility,
    validationResult: validation.valid && pkg.unresolvedReferences.length === 0 ? "valid" : "invalid",
    readOnly: true as const,
  });
}
