/**
 * SMM-8 — Platform freeze runner orchestrating certification and manifest publication.
 */

import { runSharedMentalModelPlatformCertification } from "./sharedMentalModelPlatformCertification.ts";
import { getSharedMentalModelPlatformCompatibilityMatrix } from "./sharedMentalModelPlatformCompatibility.ts";
import {
  buildSharedMentalModelPlatformManifest,
  validateSharedMentalModelPlatformManifest,
} from "./sharedMentalModelPlatformManifest.ts";
import { getSharedMentalModelPlatformRegistry } from "./sharedMentalModelPlatformFreezeRegistry.ts";
import type {
  SharedMentalModelPlatformCertificationResult,
  SharedMentalModelPlatformFreezeReport,
  SharedMentalModelPlatformFreezeState,
} from "./sharedMentalModelPlatformFreezeTypes.ts";

let platformFrozen = false;
let lastCertification: SharedMentalModelPlatformCertificationResult | null = null;
let lastFrozenAt: string | null = null;

export function resetSharedMentalModelPlatformFreezeForTests(): void {
  platformFrozen = false;
  lastCertification = null;
  lastFrozenAt = null;
}

export function getSharedMentalModelPlatformFreezeState(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): SharedMentalModelPlatformFreezeState {
  return Object.freeze({
    contractVersion: "SMM/8",
    frozen: platformFrozen,
    registry: getSharedMentalModelPlatformRegistry(),
    compatibilityMatrix: getSharedMentalModelPlatformCompatibilityMatrix(),
    lastCertification,
    timestamp: lastFrozenAt ?? timestamp,
    readOnly: true as const,
  });
}

export function runSharedMentalModelPlatformFreeze(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): SharedMentalModelPlatformFreezeReport {
  const certification = runSharedMentalModelPlatformCertification(timestamp);
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

  const manifest = buildSharedMentalModelPlatformManifest(timestamp, certification.certificationStatus);
  if (!validateSharedMentalModelPlatformManifest(manifest)) {
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
    reason: "The Shared Mental Model Platform is Certified, Frozen, and Released.",
    manifest,
    certification,
    readOnly: true as const,
  });
}

export function getLastSharedMentalModelPlatformCertificationResult(): SharedMentalModelPlatformCertificationResult | null {
  return lastCertification;
}

export function isSharedMentalModelPlatformFrozen(): boolean {
  return platformFrozen;
}
