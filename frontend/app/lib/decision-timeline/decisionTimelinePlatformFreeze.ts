/**
 * APP-6:12 — Decision Timeline Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getDecisionTimelineCompatibility } from "./decisionTimelinePlatformFreezeCompatibility.ts";
import type { DecisionTimelinePlatformFreezeManifest } from "./decisionTimelinePlatformFreezeManifest.ts";
import {
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_TAGS,
  getDecisionTimelinePlatformRegistry,
  getPublishedDecisionTimelineFreezeManifest,
} from "./decisionTimelinePlatformFreezeRegistry.ts";
import {
  getDecisionTimelinePlatformFreezeReport,
  resetDecisionTimelinePlatformFreezeForTests,
  runDecisionTimelinePlatformFreeze,
} from "./decisionTimelinePlatformFreezeRunner.ts";
import { validateDecisionTimelinePlatformFreeze as validateFreezeManifest } from "./decisionTimelinePlatformFreezeValidation.ts";
import type {
  DecisionTimelinePlatformFreezeValidationResult,
} from "./decisionTimelinePlatformFreezeValidation.ts";

export {
  DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
} from "./decisionTimelinePlatformFreezeManifest.ts";

export {
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_TAGS,
} from "./decisionTimelinePlatformFreezeRegistry.ts";

export {
  runDecisionTimelinePlatformFreeze,
  getDecisionTimelinePlatformFreezeReport,
  resetDecisionTimelinePlatformFreezeForTests,
};

export const DECISION_TIMELINE_PLATFORM_FREEZE_VERSION = DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getDecisionTimelineFreezeManifest(): DecisionTimelinePlatformFreezeManifest | null {
  return getPublishedDecisionTimelineFreezeManifest();
}

export function validateDecisionTimelinePlatformFreeze(): DecisionTimelinePlatformFreezeValidationResult {
  const report = getDecisionTimelinePlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedDecisionTimelineFreezeManifest());
}

export { getDecisionTimelineCompatibility, getDecisionTimelinePlatformRegistry };

export type { DecisionTimelinePlatformFreezeManifest, DecisionTimelinePlatformFreezeValidationResult };
export type { DecisionTimelinePlatformFreezeRunResult } from "./decisionTimelinePlatformFreezeRunner.ts";

export const DecisionTimelinePlatformFreeze = Object.freeze({
  runDecisionTimelinePlatformFreeze,
  validateDecisionTimelinePlatformFreeze,
  getDecisionTimelineFreezeManifest,
  getDecisionTimelineCompatibility,
  getDecisionTimelinePlatformRegistry,
  getDecisionTimelinePlatformFreezeReport,
  version: DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: DECISION_TIMELINE_PLATFORM_FREEZE_TAGS,
});

export { buildDecisionTimelinePlatformFreezeManifest } from "./decisionTimelinePlatformFreezeManifest.ts";
