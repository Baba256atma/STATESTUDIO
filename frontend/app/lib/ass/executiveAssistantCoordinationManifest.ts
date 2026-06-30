/**
 * ASS-8 — Executive Assistant Coordination Manifest builder.
 */

import {
  ASS_COORDINATION_PLATFORM_ID,
  ASS_COORDINATION_PLATFORM_NAME,
  ASS_COORDINATION_REGISTRY_KEYS,
  ASS_COORDINATION_VERSION,
} from "./executiveAssistantCoordinationContracts.ts";
import type {
  ExecutiveAssistantCoordinationManifest,
  ExecutiveAssistantCoordinationRegistryBundle,
} from "./executiveAssistantCoordinationTypes.ts";
import {
  getDefaultCoordinationCompatibility,
  validateExecutiveAssistantCoordinationManifestRecord,
  validateExecutiveAssistantCoordinationRegistry,
} from "./executiveAssistantCoordinationValidation.ts";

export function buildExecutiveAssistantCoordinationPlatformManifest(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationManifest {
  const validation = validateExecutiveAssistantCoordinationRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-coordination-manifest",
    platformId: ASS_COORDINATION_PLATFORM_ID,
    version: ASS_COORDINATION_VERSION,
    title: ASS_COORDINATION_PLATFORM_NAME,
    goal: "Unified deterministic coordination manifest aggregating certified ASS/1 through ASS/7 metadata.",
    registryKeys: ASS_COORDINATION_REGISTRY_KEYS,
    certifiedPhaseCount: registry.certifiedPhaseCount,
    compatibilityEntryCount: registry.compatibilityEntryCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultCoordinationCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantCoordinationManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
