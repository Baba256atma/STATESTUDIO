/**
 * APP-11:8 — Executive Inbox Platform Freeze.
 * Official metadata-only platform freeze entry point.
 */

import { getExecutiveInboxCompatibility } from "./executiveInboxPlatformFreezeCompatibility.ts";
import type { ExecutiveInboxPlatformFreezeManifest } from "./executiveInboxPlatformFreezeManifest.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG,
  getExecutiveInboxPlatformRegistry,
  getPublishedExecutiveInboxFreezeManifest,
} from "./executiveInboxPlatformFreezeRegistry.ts";
import {
  getExecutiveInboxPlatformFreezeReport,
  resetExecutiveInboxPlatformFreezeForTests,
  runExecutiveInboxPlatformFreeze,
} from "./executiveInboxPlatformFreezeRunner.ts";
import { validateExecutiveInboxPlatformFreeze as validateFreezeManifest } from "./executiveInboxPlatformFreezeValidation.ts";
import type { ExecutiveInboxPlatformFreezeValidationResult } from "./executiveInboxPlatformFreezeTypes.ts";

export { EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST } from "./executiveInboxPlatformFreezeManifest.ts";

export {
  EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG,
};

export {
  runExecutiveInboxPlatformFreeze,
  getExecutiveInboxPlatformFreezeReport,
  resetExecutiveInboxPlatformFreezeForTests,
};

export type {
  ExecutiveInboxPlatformFreezeCheck,
  ExecutiveInboxPlatformFreezeRunResult,
  ExecutiveInboxPlatformFreezeValidationCheck,
  ExecutiveInboxPlatformFreezeValidationResult,
  ExecutiveInboxPlatformRegistrySnapshot,
} from "./executiveInboxPlatformFreezeTypes.ts";

export type { ExecutiveInboxPlatformFreezeManifest };

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_VERSION = EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION;

export function getExecutiveInboxPlatformFreezeManifest(): ExecutiveInboxPlatformFreezeManifest | null {
  return getPublishedExecutiveInboxFreezeManifest();
}

export function validateExecutiveInboxPlatformFreeze(): ExecutiveInboxPlatformFreezeValidationResult {
  const report = getExecutiveInboxPlatformFreezeReport();
  return validateFreezeManifest(report?.certification ?? null, getPublishedExecutiveInboxFreezeManifest());
}

export function freezeExecutiveInboxPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  frozen: boolean;
  released: boolean;
  readyForRelease: boolean;
  manifest: ExecutiveInboxPlatformFreezeManifest | null;
  readOnly: true;
}> {
  const result = runExecutiveInboxPlatformFreeze(timestamp);
  return Object.freeze({
    certified: result.certified,
    frozen: result.frozen,
    released: result.released,
    readyForRelease: result.readyForRelease,
    manifest: result.manifest,
    readOnly: true as const,
  });
}

export { getExecutiveInboxCompatibility, getExecutiveInboxPlatformRegistry };

export { buildExecutiveInboxPlatformFreezeManifest } from "./executiveInboxPlatformFreezeManifest.ts";

export const ExecutiveInboxPlatformFreeze = Object.freeze({
  runExecutiveInboxPlatformFreeze,
  validateExecutiveInboxPlatformFreeze,
  freezeExecutiveInboxPlatform,
  getExecutiveInboxPlatformFreezeManifest,
  getExecutiveInboxCompatibility,
  getExecutiveInboxPlatformRegistry,
  getExecutiveInboxPlatformFreezeReport,
  version: EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: EXECUTIVE_INBOX_PLATFORM_FREEZE_TAGS,
});
