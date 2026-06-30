/**
 * LLM-12 — Immutable freeze manifest generation.
 */

import { getLlmPlatformCompatibilityMatrix } from "./llmPlatformCompatibility.ts";
import {
  getLlmPlatformExtensionRegistry,
  getLlmPlatformPublicApiRegistry,
  getLlmPlatformRegistry,
  LLM_PLATFORM_FREEZE_VERSION,
  LLM_PLATFORM_RELEASE_STAGE,
  LLM_PLATFORM_RELEASE_VERSION,
} from "./llmPlatformFreezeRegistry.ts";
import type { LlmPlatformCertificationStatusKey, LlmPlatformFreezeManifest } from "./llmPlatformFreezeTypes.ts";

export function buildLlmPlatformFreezeManifest(
  timestamp: string = "2026-01-01T00:00:00.000Z",
  certificationStatus: LlmPlatformCertificationStatusKey = "certified"
): LlmPlatformFreezeManifest {
  const registry = getLlmPlatformRegistry();
  const compatibility = getLlmPlatformCompatibilityMatrix();
  return Object.freeze({
    manifestId: "llm-platform-freeze-manifest",
    platformName: registry.platformName,
    releaseVersion: LLM_PLATFORM_RELEASE_VERSION,
    freezeVersion: LLM_PLATFORM_FREEZE_VERSION,
    certifiedPhases: Object.freeze(registry.certifiedPhases.map((phase) => phase.phaseId)),
    compatibility: Object.freeze([
      ...registry.certifiedPhases.map((phase) => phase.contractVersion),
      "APP",
      "KNL",
      "SMM",
      "ASS",
      "LAY",
      "LLM/12",
    ]),
    publicApis: getLlmPlatformPublicApiRegistry(),
    extensionRegistry: getLlmPlatformExtensionRegistry(),
    certificationTimestamp: timestamp,
    releaseStage: LLM_PLATFORM_RELEASE_STAGE,
    certificationStatus,
    readOnly: true as const,
  });
}

export function validateLlmPlatformFreezeManifest(manifest: LlmPlatformFreezeManifest): boolean {
  return (
    manifest.certifiedPhases.length === 11 &&
    manifest.publicApis.length > 0 &&
    manifest.freezeVersion === LLM_PLATFORM_FREEZE_VERSION &&
    manifest.compatibility.includes("LLM/12")
  );
}
