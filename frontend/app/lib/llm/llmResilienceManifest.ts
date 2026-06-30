/**
 * LLM-11 — Resilience manifest generation.
 */

import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_FAILURE_CATEGORY_KEYS,
} from "./llmResilienceContracts.ts";
import type { LlmResilienceManifest, LlmResilienceRegistry } from "./llmResilienceTypes.ts";
import {
  getDefaultResilienceCompatibility,
  validateResilienceManifestConsistency,
  validateResilienceRegistryState,
} from "./llmResilienceValidation.ts";

export function getResilienceManifest(registry: LlmResilienceRegistry): LlmResilienceManifest {
  const registryValidation = validateResilienceRegistryState(registry);
  const manifest = Object.freeze({
    manifestId: "llm-resilience-coordinator-manifest",
    resilienceVersion: LLM_RESILIENCE_CONTRACT_VERSION,
    retryPolicyCount: registry.retryPolicyCount,
    timeoutPolicyCount: registry.timeoutPolicyCount,
    fallbackPolicyCount: registry.fallbackPolicyCount,
    failureCategoryCount: LLM_RESILIENCE_FAILURE_CATEGORY_KEYS.length,
    validationResult: registryValidation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultResilienceCompatibility(),
    readOnly: true as const,
  });
  const validation = validateResilienceManifestConsistency(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && registryValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
