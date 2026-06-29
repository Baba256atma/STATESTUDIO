/**
 * APP-8:9 — Decision Journal Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getDecisionJournalCompatibility } from "./decisionJournalPlatformFreezeCompatibility.ts";
import type { DecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import {
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_TAGS,
  getDecisionJournalPlatformRegistry,
  getPublishedDecisionJournalFreezeManifest,
} from "./decisionJournalPlatformFreezeRegistry.ts";
import {
  getDecisionJournalPlatformFreezeReport,
  resetDecisionJournalPlatformFreezeForTests,
  runDecisionJournalPlatformFreeze,
} from "./decisionJournalPlatformFreezeRunner.ts";
import { validateDecisionJournalPlatformFreeze as validateFreezeManifest } from "./decisionJournalPlatformFreezeValidation.ts";
import type { DecisionJournalPlatformFreezeValidationResult } from "./decisionJournalPlatformFreezeTypes.ts";

export { DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST } from "./decisionJournalPlatformFreezeManifest.ts";

export {
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_TAGS,
  DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
} from "./decisionJournalPlatformFreezeRegistry.ts";

export {
  runDecisionJournalPlatformFreeze,
  getDecisionJournalPlatformFreezeReport,
  resetDecisionJournalPlatformFreezeForTests,
};

export type {
  DecisionJournalPlatformFreezeCheck,
  DecisionJournalPlatformFreezeRunResult,
  DecisionJournalPlatformFreezeValidationCheck,
  DecisionJournalPlatformFreezeValidationResult,
  DecisionJournalPlatformRegistrySnapshot,
} from "./decisionJournalPlatformFreezeTypes.ts";

export type { DecisionJournalPlatformFreezeManifest };

export const DECISION_JOURNAL_PLATFORM_FREEZE_VERSION = DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getDecisionJournalFreezeManifest(): DecisionJournalPlatformFreezeManifest | null {
  return getPublishedDecisionJournalFreezeManifest();
}

export function validateDecisionJournalPlatformFreeze(): DecisionJournalPlatformFreezeValidationResult {
  const report = getDecisionJournalPlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedDecisionJournalFreezeManifest());
}

export { getDecisionJournalCompatibility, getDecisionJournalPlatformRegistry };

export { buildDecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";

export const DecisionJournalPlatformFreeze = Object.freeze({
  runDecisionJournalPlatformFreeze,
  validateDecisionJournalPlatformFreeze,
  getDecisionJournalFreezeManifest,
  getDecisionJournalCompatibility,
  getDecisionJournalPlatformRegistry,
  getDecisionJournalPlatformFreezeReport,
  version: DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_PLATFORM_FREEZE_TAGS,
});
