/**
 * ASS-9 — Immutable platform manifest generation.
 */

import { getExecutiveAssistantPlatformCompatibilityMatrix } from "./executiveAssistantPlatformCompatibility.ts";
import {
  ASS_EXTENSION_POLICY,
  ASS_PLATFORM_FREEZE_VERSION,
  ASS_PLATFORM_RELEASE_DECLARATION,
  ASS_PLATFORM_RELEASE_STAGE,
  ASS_PLATFORM_RELEASE_VERSION,
  getExecutiveAssistantPlatformExtensionRegistry,
  getExecutiveAssistantPlatformPublicApiRegistry,
  getExecutiveAssistantPlatformRegistry,
} from "./executiveAssistantPlatformFreezeRegistry.ts";
import type {
  ExecutiveAssistantPlatformCertificationStatusKey,
  ExecutiveAssistantPlatformManifest,
} from "./executiveAssistantPlatformFreezeTypes.ts";

export function buildExecutiveAssistantPlatformManifest(
  timestamp: string = "2026-01-01T00:00:00.000Z",
  certificationStatus: ExecutiveAssistantPlatformCertificationStatusKey = "certified"
): ExecutiveAssistantPlatformManifest {
  const registry = getExecutiveAssistantPlatformRegistry();
  getExecutiveAssistantPlatformCompatibilityMatrix();
  return Object.freeze({
    manifestId: "executive-assistant-platform-freeze-manifest",
    platformName: registry.platformName,
    releaseVersion: ASS_PLATFORM_RELEASE_VERSION,
    freezeVersion: ASS_PLATFORM_FREEZE_VERSION,
    certifiedPhases: Object.freeze(registry.certifiedPhases.map((phase) => phase.phaseId)),
    compatibility: Object.freeze([
      ...registry.certifiedPhases.map((phase) => phase.contractVersion),
      "CORE",
      "KNL",
      "APP",
      "LLM",
      "SMM",
      "IDN",
      "LAY",
      "ASS/9",
    ]),
    publicApis: getExecutiveAssistantPlatformPublicApiRegistry(),
    extensionRegistry: getExecutiveAssistantPlatformExtensionRegistry(),
    extensionPolicy: ASS_EXTENSION_POLICY,
    regressionMetadata: Object.freeze({
      regressionSuite: "ass-platform-regression",
      phaseCount: registry.phaseCount,
      readOnly: true as const,
    }),
    certificationTimestamp: timestamp,
    releaseStage: ASS_PLATFORM_RELEASE_STAGE,
    certificationStatus,
    officialPublication: ASS_PLATFORM_RELEASE_DECLARATION,
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantPlatformManifest(manifest: ExecutiveAssistantPlatformManifest): boolean {
  return (
    manifest.certifiedPhases.length === 8 &&
    manifest.publicApis.length > 0 &&
    manifest.freezeVersion === ASS_PLATFORM_FREEZE_VERSION &&
    manifest.compatibility.includes("ASS/9") &&
    manifest.compatibility.includes("ASS/8") &&
    manifest.extensionPolicy.length > 0 &&
    manifest.officialPublication === ASS_PLATFORM_RELEASE_DECLARATION
  );
}
