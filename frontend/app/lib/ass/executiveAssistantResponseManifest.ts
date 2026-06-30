/**
 * ASS-6 — Executive Response Contract Architecture manifest.
 */

import {
  ASS_RESPONSE_PLATFORM_ID,
  ASS_RESPONSE_PLATFORM_NAME,
  ASS_RESPONSE_REGISTRY_KEYS,
  ASS_RESPONSE_VERSION,
} from "./executiveAssistantResponseContracts.ts";
import type {
  ExecutiveAssistantResponseManifest,
  ExecutiveAssistantResponseRegistryBundle,
} from "./executiveAssistantResponseTypes.ts";
import {
  getDefaultResponseCompatibility,
  validateExecutiveAssistantResponseManifestRecord,
  validateExecutiveAssistantResponseRegistry,
} from "./executiveAssistantResponseValidation.ts";

export function getExecutiveAssistantResponseManifest(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseManifest {
  const validation = validateExecutiveAssistantResponseRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-response-manifest",
    platformId: ASS_RESPONSE_PLATFORM_ID,
    version: ASS_RESPONSE_VERSION,
    title: ASS_RESPONSE_PLATFORM_NAME,
    goal: "Metadata-only executive response categories, structure, tone, explanation, follow-up, action suggestion, and ASS/5 intent binding placeholders.",
    registryKeys: ASS_RESPONSE_REGISTRY_KEYS,
    responseCategoryCount: registry.responseCategoryCount,
    intentBindingCount: registry.responseIntentBindingCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultResponseCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantResponseManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
