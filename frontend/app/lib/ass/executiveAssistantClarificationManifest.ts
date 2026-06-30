/**
 * ASS-7 — Executive Clarification Architecture manifest.
 */

import {
  ASS_CLARIFICATION_PLATFORM_ID,
  ASS_CLARIFICATION_PLATFORM_NAME,
  ASS_CLARIFICATION_REGISTRY_KEYS,
  ASS_CLARIFICATION_VERSION,
} from "./executiveAssistantClarificationContracts.ts";
import type {
  ExecutiveAssistantClarificationManifest,
  ExecutiveAssistantClarificationRegistryBundle,
} from "./executiveAssistantClarificationTypes.ts";
import {
  getDefaultClarificationCompatibility,
  validateExecutiveAssistantClarificationManifestRecord,
  validateExecutiveAssistantClarificationRegistry,
} from "./executiveAssistantClarificationValidation.ts";

export function getExecutiveAssistantClarificationManifest(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationManifest {
  const validation = validateExecutiveAssistantClarificationRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-clarification-manifest",
    platformId: ASS_CLARIFICATION_PLATFORM_ID,
    version: ASS_CLARIFICATION_VERSION,
    title: ASS_CLARIFICATION_PLATFORM_NAME,
    goal: "Metadata-only clarification categories, triggers, question types, ambiguity, missing context, priority, and ASS/5/ASS/6 binding placeholders.",
    registryKeys: ASS_CLARIFICATION_REGISTRY_KEYS,
    clarificationCategoryCount: registry.clarificationCategoryCount,
    intentBindingCount: registry.clarificationIntentBindingCount,
    responseBindingCount: registry.clarificationResponseBindingCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultClarificationCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantClarificationManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
