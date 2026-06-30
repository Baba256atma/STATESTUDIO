/**
 * ASS-5 — Executive Intent Interpretation Contract manifest.
 */

import {
  ASS_INTENT_PLATFORM_ID,
  ASS_INTENT_PLATFORM_NAME,
  ASS_INTENT_REGISTRY_KEYS,
  ASS_INTENT_VERSION,
} from "./executiveAssistantIntentContracts.ts";
import type {
  ExecutiveAssistantIntentManifest,
  ExecutiveAssistantIntentRegistryBundle,
} from "./executiveAssistantIntentTypes.ts";
import {
  getDefaultIntentCompatibility,
  validateExecutiveAssistantIntentManifestRecord,
  validateExecutiveAssistantIntentRegistry,
} from "./executiveAssistantIntentValidation.ts";

export function getExecutiveAssistantIntentManifest(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentManifest {
  const validation = validateExecutiveAssistantIntentRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-intent-manifest",
    platformId: ASS_INTENT_PLATFORM_ID,
    version: ASS_INTENT_VERSION,
    title: ASS_INTENT_PLATFORM_NAME,
    goal: "Metadata-only executive intent interpretation categories, signals, ambiguity, clarification, confidence, and ASS/4 route binding placeholders.",
    registryKeys: ASS_INTENT_REGISTRY_KEYS,
    intentCategoryCount: registry.intentCategoryCount,
    routeBindingCount: registry.intentRouteBindingCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultIntentCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantIntentManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
