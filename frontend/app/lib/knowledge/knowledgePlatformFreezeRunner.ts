/**
 * KNL-15 — Knowledge Platform Freeze runner.
 */

import {
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNL_FROZEN_PHASE_KEYS,
} from "./knowledgePlatformFreezeCatalog.ts";
import { getKnowledgePlatformCompatibilityMatrix } from "./knowledgePlatformFreezeCompatibility.ts";
import { buildKnowledgePlatformFreezeManifest } from "./knowledgePlatformFreezeManifest.ts";
import type {
  FreezeManifest,
  KnowledgePlatformFreezeRunResult,
} from "./knowledgePlatformFreezeTypes.ts";
import {
  validateKnowledgePlatformCertificationPassed,
  validateKnowledgePlatformFreezeManifest,
} from "./knowledgePlatformFreezeValidation.ts";
import { runKnowledgePlatformCertification } from "./knowledgePlatformCertificationRunner.ts";

export const KNOWLEDGE_PLATFORM_FREEZE_RUNNER_VERSION = "KNL/15-RUNNER-1" as const;

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

let lastManifest: FreezeManifest | null = null;
let platformFrozen = false;
let platformReleased = false;

export function resetKnowledgePlatformFreezeForTests(): void {
  lastManifest = null;
  platformFrozen = false;
  platformReleased = false;
}

export function isKnowledgePlatformFrozen(): boolean {
  return platformFrozen;
}

export function isKnowledgePlatformReleased(): boolean {
  return platformReleased;
}

export function runKnowledgePlatformFreeze(
  timestamp: string = FIXED_TIME
): KnowledgePlatformFreezeRunResult {
  const certification = runKnowledgePlatformCertification(timestamp);
  if (!certification.success) {
    platformFrozen = false;
    platformReleased = false;
    lastManifest = null;
    return Object.freeze({
      success: false,
      reason: "KNL/14 certification must pass before platform freeze.",
      frozen: false,
      released: false,
      phasesFrozen: 0,
      totalPhases: KNL_FROZEN_PHASE_KEYS.length,
      readOnly: true as const,
    });
  }

  const certificationValidation = validateKnowledgePlatformCertificationPassed(timestamp);
  if (!certificationValidation.valid) {
    platformFrozen = false;
    platformReleased = false;
    lastManifest = null;
    return Object.freeze({
      success: false,
      reason: "KNL/14 certification validation failed.",
      frozen: false,
      released: false,
      phasesFrozen: 0,
      totalPhases: KNL_FROZEN_PHASE_KEYS.length,
      readOnly: true as const,
    });
  }

  const manifest = buildKnowledgePlatformFreezeManifest(timestamp);
  const manifestValidation = validateKnowledgePlatformFreezeManifest(manifest);
  if (!manifestValidation.valid) {
    platformFrozen = false;
    platformReleased = false;
    lastManifest = null;
    return Object.freeze({
      success: false,
      reason: manifestValidation.issues.map((entry) => entry.message).join("; "),
      frozen: false,
      released: false,
      phasesFrozen: 0,
      totalPhases: KNL_FROZEN_PHASE_KEYS.length,
      readOnly: true as const,
    });
  }

  lastManifest = manifest;
  platformFrozen = true;
  platformReleased = manifest.releaseMetadata.status === "released";

  return Object.freeze({
    success: true,
    reason: "Knowledge platform officially frozen and released.",
    frozen: platformFrozen,
    released: platformReleased,
    phasesFrozen: manifest.certifiedPhases.length,
    totalPhases: KNL_FROZEN_PHASE_KEYS.length,
    readOnly: true as const,
  });
}

export function getStoredKnowledgePlatformFreezeManifest(): FreezeManifest | null {
  return lastManifest;
}

export const KnowledgePlatformFreezeRunner = Object.freeze({
  runKnowledgePlatformFreeze,
  getStoredKnowledgePlatformFreezeManifest,
  resetKnowledgePlatformFreezeForTests,
  version: KNOWLEDGE_PLATFORM_FREEZE_RUNNER_VERSION,
});
