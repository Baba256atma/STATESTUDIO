/**
 * LLM-12 — Platform freeze runner orchestrating certification and manifest publication.
 */

import { runLlmPlatformCertification } from "./llmPlatformCertification.ts";
import { buildLlmPlatformFreezeManifest, validateLlmPlatformFreezeManifest } from "./llmPlatformFreezeManifest.ts";
import { getLlmPlatformRegistry } from "./llmPlatformFreezeRegistry.ts";
import type { LlmPlatformCertificationResult, LlmPlatformFreezeReport, LlmPlatformFreezeState } from "./llmPlatformFreezeTypes.ts";
import { getLlmPlatformCompatibilityMatrix } from "./llmPlatformCompatibility.ts";

let platformFrozen = false;
let lastCertification: LlmPlatformCertificationResult | null = null;
let lastFrozenAt: string | null = null;

export function resetLlmPlatformFreezeForTests(): void {
  platformFrozen = false;
  lastCertification = null;
  lastFrozenAt = null;
}

export function getLlmPlatformFreezeState(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): LlmPlatformFreezeState {
  return Object.freeze({
    contractVersion: "LLM/12",
    frozen: platformFrozen,
    registry: getLlmPlatformRegistry(),
    compatibilityMatrix: getLlmPlatformCompatibilityMatrix(),
    lastCertification,
    timestamp: lastFrozenAt ?? timestamp,
    readOnly: true as const,
  });
}

export function runLlmPlatformFreeze(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): LlmPlatformFreezeReport {
  const certification = runLlmPlatformCertification(timestamp);
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

  const manifest = buildLlmPlatformFreezeManifest(timestamp, certification.certificationStatus);
  if (!validateLlmPlatformFreezeManifest(manifest)) {
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
    reason: "Nexora LLM Platform certified, frozen, and released.",
    manifest,
    certification,
    readOnly: true as const,
  });
}

export function getLastLlmPlatformCertificationResult(): LlmPlatformCertificationResult | null {
  return lastCertification;
}

export function isLlmPlatformFrozen(): boolean {
  return platformFrozen;
}
