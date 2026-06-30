/**
 * LLM-10 — Security manifest generation.
 */

import {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_REDACTION_RULE_KEYS,
} from "./llmSecurityContracts.ts";
import type { LlmSecurityManifest, LlmSecurityRegistry } from "./llmSecurityTypes.ts";
import {
  getDefaultSecurityCompatibility,
  validateSecurityManifestConsistency,
} from "./llmSecurityValidation.ts";

export function getSecurityManifest(registry: LlmSecurityRegistry): LlmSecurityManifest {
  const compatibility = getDefaultSecurityCompatibility();
  const manifest = Object.freeze({
    manifestId: "llm-security-redaction-manifest",
    securityVersion: LLM_SECURITY_CONTRACT_VERSION,
    policyCount: registry.policyCount,
    redactionRuleCount: LLM_SECURITY_REDACTION_RULE_KEYS.length,
    validationResult: registry.policyCount > 0 ? ("valid" as const) : ("invalid" as const),
    compatibility,
    readOnly: true as const,
  });
  const validation = validateSecurityManifestConsistency(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
