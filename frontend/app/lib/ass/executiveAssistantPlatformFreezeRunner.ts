/**
 * ASS-9 — Platform freeze runner orchestrating certification and manifest publication.
 */

import { runExecutiveAssistantPlatformCertification } from "./executiveAssistantPlatformCertification.ts";
import { getExecutiveAssistantPlatformCompatibilityMatrix } from "./executiveAssistantPlatformCompatibility.ts";
import {
  buildExecutiveAssistantPlatformManifest,
  validateExecutiveAssistantPlatformManifest,
} from "./executiveAssistantPlatformFreezeManifest.ts";
import { getExecutiveAssistantPlatformRegistry } from "./executiveAssistantPlatformFreezeRegistry.ts";
import type {
  ExecutiveAssistantPlatformCertificationResult,
  ExecutiveAssistantPlatformFreezeReport,
  ExecutiveAssistantPlatformFreezeState,
} from "./executiveAssistantPlatformFreezeTypes.ts";

let platformFrozen = false;
let lastCertification: ExecutiveAssistantPlatformCertificationResult | null = null;
let lastFrozenAt: string | null = null;

export function resetExecutiveAssistantPlatformFreezeForTests(): void {
  platformFrozen = false;
  lastCertification = null;
  lastFrozenAt = null;
}

export function getExecutiveAssistantPlatformFreezeState(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveAssistantPlatformFreezeState {
  return Object.freeze({
    contractVersion: "ASS/9",
    frozen: platformFrozen,
    registry: getExecutiveAssistantPlatformRegistry(),
    compatibilityMatrix: getExecutiveAssistantPlatformCompatibilityMatrix(),
    lastCertification,
    timestamp: lastFrozenAt ?? timestamp,
    readOnly: true as const,
  });
}

export function runExecutiveAssistantPlatformFreeze(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveAssistantPlatformFreezeReport {
  const certification = runExecutiveAssistantPlatformCertification(timestamp);
  lastCertification = certification;

  if (!certification.success) {
    return Object.freeze({
      success: false,
      reason: certification.summary,
      manifest: null,
      certification,
      readOnly: true as const,
    });
  }

  const manifest = buildExecutiveAssistantPlatformManifest(timestamp, certification.certificationStatus);
  if (!validateExecutiveAssistantPlatformManifest(manifest)) {
    return Object.freeze({
      success: false,
      reason: "Freeze manifest validation failed.",
      manifest: null,
      certification,
      readOnly: true as const,
    });
  }

  platformFrozen = true;
  lastFrozenAt = timestamp;
  return Object.freeze({
    success: true,
    reason: manifest.officialPublication,
    manifest,
    certification,
    readOnly: true as const,
  });
}

export function getLastExecutiveAssistantPlatformCertificationResult(): ExecutiveAssistantPlatformCertificationResult | null {
  return lastCertification;
}

export function isExecutiveAssistantPlatformFrozen(): boolean {
  return platformFrozen;
}
