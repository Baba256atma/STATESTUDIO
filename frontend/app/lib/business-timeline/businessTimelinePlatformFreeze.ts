/**
 * APP-7:8 — Business Timeline Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getBusinessTimelineCompatibility } from "./businessTimelinePlatformFreezeCompatibility.ts";
import type { BusinessTimelinePlatformFreezeManifest } from "./businessTimelinePlatformFreezeManifest.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS,
  getBusinessTimelinePlatformRegistry,
  getPublishedBusinessTimelineFreezeManifest,
} from "./businessTimelinePlatformFreezeRegistry.ts";
import {
  getBusinessTimelinePlatformFreezeReport,
  resetBusinessTimelinePlatformFreezeForTests,
  runBusinessTimelinePlatformFreeze,
} from "./businessTimelinePlatformFreezeRunner.ts";
import { validateBusinessTimelinePlatformFreeze as validateFreezeManifest } from "./businessTimelinePlatformFreezeValidation.ts";
import type { BusinessTimelinePlatformFreezeValidationResult } from "./businessTimelinePlatformFreezeTypes.ts";

export { BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST } from "./businessTimelinePlatformFreezeManifest.ts";

export {
  BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS,
  BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG,
} from "./businessTimelinePlatformFreezeRegistry.ts";

export {
  runBusinessTimelinePlatformFreeze,
  getBusinessTimelinePlatformFreezeReport,
  resetBusinessTimelinePlatformFreezeForTests,
};

export type {
  BusinessTimelinePlatformFreezeCheck,
  BusinessTimelinePlatformFreezeRunResult,
  BusinessTimelinePlatformFreezeValidationCheck,
  BusinessTimelinePlatformFreezeValidationResult,
  BusinessTimelinePlatformRegistrySnapshot,
} from "./businessTimelinePlatformFreezeTypes.ts";

export type { BusinessTimelinePlatformFreezeManifest };

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_VERSION = BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getBusinessTimelineFreezeManifest(): BusinessTimelinePlatformFreezeManifest | null {
  return getPublishedBusinessTimelineFreezeManifest();
}

export function validateBusinessTimelinePlatformFreeze(): BusinessTimelinePlatformFreezeValidationResult {
  const report = getBusinessTimelinePlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedBusinessTimelineFreezeManifest());
}

export { getBusinessTimelineCompatibility, getBusinessTimelinePlatformRegistry };

export { buildBusinessTimelinePlatformFreezeManifest } from "./businessTimelinePlatformFreezeManifest.ts";

export const BusinessTimelinePlatformFreeze = Object.freeze({
  runBusinessTimelinePlatformFreeze,
  validateBusinessTimelinePlatformFreeze,
  getBusinessTimelineFreezeManifest,
  getBusinessTimelineCompatibility,
  getBusinessTimelinePlatformRegistry,
  getBusinessTimelinePlatformFreezeReport,
  version: BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS,
});
