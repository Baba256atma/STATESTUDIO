/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getCrossScenarioLearningCompatibility } from "./crossScenarioLearningPlatformFreezeCompatibility.ts";
import type { CrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_TAGS,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
  getCrossScenarioLearningPlatformRegistry,
  getPublishedCrossScenarioLearningFreezeManifest,
} from "./crossScenarioLearningPlatformFreezeRegistry.ts";
import {
  getCrossScenarioLearningPlatformFreezeReport,
  resetCrossScenarioLearningPlatformFreezeForTests,
  runCrossScenarioLearningPlatformFreeze,
} from "./crossScenarioLearningPlatformFreezeRunner.ts";
import { validateCrossScenarioLearningPlatformFreeze as validateFreezeManifest } from "./crossScenarioLearningPlatformFreezeValidation.ts";
import type { CrossScenarioLearningPlatformFreezeValidationResult } from "./crossScenarioLearningPlatformFreezeTypes.ts";

export { CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST } from "./crossScenarioLearningPlatformFreezeManifest.ts";

export {
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_TAGS,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
};

export {
  runCrossScenarioLearningPlatformFreeze,
  getCrossScenarioLearningPlatformFreezeReport,
  resetCrossScenarioLearningPlatformFreezeForTests,
};

export type {
  CrossScenarioLearningPlatformFreezeCheck,
  CrossScenarioLearningPlatformFreezeRunResult,
  CrossScenarioLearningPlatformFreezeValidationCheck,
  CrossScenarioLearningPlatformFreezeValidationResult,
  CrossScenarioLearningPlatformRegistrySnapshot,
} from "./crossScenarioLearningPlatformFreezeTypes.ts";

export type { CrossScenarioLearningPlatformFreezeManifest };

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_VERSION = CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getCrossScenarioLearningPlatformFreezeManifest(): CrossScenarioLearningPlatformFreezeManifest | null {
  return getPublishedCrossScenarioLearningFreezeManifest();
}

export function validateCrossScenarioLearningPlatformFreeze(): CrossScenarioLearningPlatformFreezeValidationResult {
  const report = getCrossScenarioLearningPlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedCrossScenarioLearningFreezeManifest());
}

export function freezeCrossScenarioLearningPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  manifest: CrossScenarioLearningPlatformFreezeManifest | null;
  readOnly: true;
}> {
  const result = runCrossScenarioLearningPlatformFreeze(timestamp);
  return Object.freeze({
    certified: result.certified,
    frozen: result.frozen,
    released: result.released,
    readyForRelease: result.readyForRelease,
    manifest: result.manifest,
    readOnly: true as const,
  });
}

export { getCrossScenarioLearningCompatibility, getCrossScenarioLearningPlatformRegistry };

export { buildCrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";

export const CrossScenarioLearningPlatformFreeze = Object.freeze({
  runCrossScenarioLearningPlatformFreeze,
  validateCrossScenarioLearningPlatformFreeze,
  freezeCrossScenarioLearningPlatform,
  getCrossScenarioLearningPlatformFreezeManifest,
  getCrossScenarioLearningCompatibility,
  getCrossScenarioLearningPlatformRegistry,
  getCrossScenarioLearningPlatformFreezeReport,
  version: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_TAGS,
});
