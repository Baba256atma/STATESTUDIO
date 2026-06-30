/**
 * SMM-8 — Immutable platform manifest generation.
 */

import { getSharedMentalModelPlatformCompatibilityMatrix } from "./sharedMentalModelPlatformCompatibility.ts";
import {
  getSharedMentalModelPlatformExtensionRegistry,
  getSharedMentalModelPlatformPublicApiRegistry,
  getSharedMentalModelPlatformRegistry,
  SMM_EXTENSION_POLICY,
  SMM_PLATFORM_FREEZE_VERSION,
  SMM_PLATFORM_RELEASE_STAGE,
  SMM_PLATFORM_RELEASE_VERSION,
} from "./sharedMentalModelPlatformFreezeRegistry.ts";
import type {
  SharedMentalModelPlatformCertificationStatusKey,
  SharedMentalModelPlatformManifest,
} from "./sharedMentalModelPlatformFreezeTypes.ts";

export function buildSharedMentalModelPlatformManifest(
  timestamp: string = "2026-01-01T00:00:00.000Z",
  certificationStatus: SharedMentalModelPlatformCertificationStatusKey = "certified"
): SharedMentalModelPlatformManifest {
  const registry = getSharedMentalModelPlatformRegistry();
  getSharedMentalModelPlatformCompatibilityMatrix();
  return Object.freeze({
    manifestId: "smm-platform-freeze-manifest",
    platformName: registry.platformName,
    releaseVersion: SMM_PLATFORM_RELEASE_VERSION,
    freezeVersion: SMM_PLATFORM_FREEZE_VERSION,
    certifiedPhases: Object.freeze(registry.certifiedPhases.map((phase) => phase.phaseId)),
    compatibility: Object.freeze([
      ...registry.certifiedPhases.map((phase) => phase.contractVersion),
      "CORE",
      "KNL",
      "APP",
      "LLM",
      "ASS",
      "IDN",
      "LAY",
      "SMM/8",
    ]),
    publicApis: getSharedMentalModelPlatformPublicApiRegistry(),
    extensionRegistry: getSharedMentalModelPlatformExtensionRegistry(),
    extensionPolicy: SMM_EXTENSION_POLICY,
    certificationTimestamp: timestamp,
    releaseStage: SMM_PLATFORM_RELEASE_STAGE,
    certificationStatus,
    readOnly: true as const,
  });
}

export function validateSharedMentalModelPlatformManifest(manifest: SharedMentalModelPlatformManifest): boolean {
  return (
    manifest.certifiedPhases.length === 7 &&
    manifest.publicApis.length > 0 &&
    manifest.freezeVersion === SMM_PLATFORM_FREEZE_VERSION &&
    manifest.compatibility.includes("SMM/8") &&
    manifest.extensionPolicy.length > 0
  );
}
