/**
 * APP-9:9 — Confidence Evolution Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getConfidenceEvolutionCompatibility } from "./confidenceEvolutionPlatformFreezeCompatibility.ts";
import type { ConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_TAGS,
  getConfidenceEvolutionPlatformRegistry,
  getPublishedConfidenceEvolutionFreezeManifest,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";
import {
  getConfidenceEvolutionPlatformFreezeReport,
  resetConfidenceEvolutionPlatformFreezeForTests,
  runConfidenceEvolutionPlatformFreeze,
} from "./confidenceEvolutionPlatformFreezeRunner.ts";
import { validateConfidenceEvolutionPlatformFreeze as validateFreezeManifest } from "./confidenceEvolutionPlatformFreezeValidation.ts";
import type { ConfidenceEvolutionPlatformFreezeValidationResult } from "./confidenceEvolutionPlatformFreezeTypes.ts";

export { CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST } from "./confidenceEvolutionPlatformFreezeManifest.ts";

export {
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_TAGS,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";

export {
  runConfidenceEvolutionPlatformFreeze,
  getConfidenceEvolutionPlatformFreezeReport,
  resetConfidenceEvolutionPlatformFreezeForTests,
};

export type {
  ConfidenceEvolutionPlatformFreezeCheck,
  ConfidenceEvolutionPlatformFreezeRunResult,
  ConfidenceEvolutionPlatformFreezeValidationCheck,
  ConfidenceEvolutionPlatformFreezeValidationResult,
  ConfidenceEvolutionPlatformRegistrySnapshot,
} from "./confidenceEvolutionPlatformFreezeTypes.ts";

export type { ConfidenceEvolutionPlatformFreezeManifest };

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_VERSION = CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getConfidenceEvolutionFreezeManifest(): ConfidenceEvolutionPlatformFreezeManifest | null {
  return getPublishedConfidenceEvolutionFreezeManifest();
}

export function validateConfidenceEvolutionPlatformFreeze(): ConfidenceEvolutionPlatformFreezeValidationResult {
  const report = getConfidenceEvolutionPlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedConfidenceEvolutionFreezeManifest());
}

export { getConfidenceEvolutionCompatibility, getConfidenceEvolutionPlatformRegistry };

export { buildConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";

export const ConfidenceEvolutionPlatformFreeze = Object.freeze({
  runConfidenceEvolutionPlatformFreeze,
  validateConfidenceEvolutionPlatformFreeze,
  getConfidenceEvolutionFreezeManifest,
  getConfidenceEvolutionCompatibility,
  getConfidenceEvolutionPlatformRegistry,
  getConfidenceEvolutionPlatformFreezeReport,
  version: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_TAGS,
});
