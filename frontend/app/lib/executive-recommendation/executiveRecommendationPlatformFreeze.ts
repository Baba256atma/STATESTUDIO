/**
 * APP-12:9 — Executive Recommendation Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getExecutiveRecommendationCompatibility } from "./executiveRecommendationPlatformFreezeCompatibility.ts";
import type { ExecutiveRecommendationPlatformFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
  getExecutiveRecommendationPlatformRegistry,
  getPublishedExecutiveRecommendationFreezeManifest,
} from "./executiveRecommendationPlatformFreezeRegistry.ts";
import {
  getExecutiveRecommendationPlatformFreezeReport,
  resetExecutiveRecommendationPlatformFreezeForTests,
  runExecutiveRecommendationPlatformFreeze,
} from "./executiveRecommendationPlatformFreezeRunner.ts";
import { validateExecutiveRecommendationPlatformFreeze as validateFreezeManifest } from "./executiveRecommendationPlatformFreezeValidation.ts";
import type { ExecutiveRecommendationPlatformFreezeValidationResult } from "./executiveRecommendationPlatformFreezeTypes.ts";

export { EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST } from "./executiveRecommendationPlatformFreezeManifest.ts";

export {
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
};

export {
  runExecutiveRecommendationPlatformFreeze,
  getExecutiveRecommendationPlatformFreezeReport,
  resetExecutiveRecommendationPlatformFreezeForTests,
};

export type {
  ExecutiveRecommendationPlatformFreezeCheck,
  ExecutiveRecommendationPlatformFreezeRunResult,
  ExecutiveRecommendationPlatformFreezeValidationCheck,
  ExecutiveRecommendationPlatformFreezeValidationResult,
  ExecutiveRecommendationPlatformRegistrySnapshot,
} from "./executiveRecommendationPlatformFreezeTypes.ts";

export type { ExecutiveRecommendationPlatformFreezeManifest };

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_VERSION =
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getExecutiveRecommendationPlatformFreezeManifest(): ExecutiveRecommendationPlatformFreezeManifest | null {
  return getPublishedExecutiveRecommendationFreezeManifest();
}

export function validateExecutiveRecommendationPlatformFreeze(): ExecutiveRecommendationPlatformFreezeValidationResult {
  const report = getExecutiveRecommendationPlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedExecutiveRecommendationFreezeManifest());
}

export function freezeExecutiveRecommendationPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  manifest: ExecutiveRecommendationPlatformFreezeManifest | null;
  readOnly: true;
}> {
  const result = runExecutiveRecommendationPlatformFreeze(timestamp);
  return Object.freeze({
    certified: result.certified,
    frozen: result.frozen,
    released: result.released,
    readyForRelease: result.readyForRelease,
    manifest: result.manifest,
    readOnly: true as const,
  });
}

export { getExecutiveRecommendationCompatibility, getExecutiveRecommendationPlatformRegistry };

export { buildExecutiveRecommendationPlatformFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";

export const ExecutiveRecommendationPlatformFreeze = Object.freeze({
  runExecutiveRecommendationPlatformFreeze,
  validateExecutiveRecommendationPlatformFreeze,
  freezeExecutiveRecommendationPlatform,
  getExecutiveRecommendationPlatformFreezeManifest,
  getExecutiveRecommendationCompatibility,
  getExecutiveRecommendationPlatformRegistry,
  getExecutiveRecommendationPlatformFreezeReport,
  version: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_TAGS,
});
