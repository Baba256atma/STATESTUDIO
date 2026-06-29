/**
 * APP-11:7 — Executive Inbox Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateExecutiveInboxFoundation } from "./executiveInboxContracts.ts";
import {
  buildExecutiveInboxPlatformCertificationManifest,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES,
  validateExecutiveInboxPlatformCertificationManifest,
  type ExecutiveInboxPlatformCertificationManifest,
} from "./executiveInboxPlatformCertificationManifest.ts";
import { runExecutiveInboxPlatformRegression } from "./executiveInboxPlatformRegression.ts";
import {
  getExecutiveInboxCertificationManifest,
  getExecutiveInboxPlatformCertificationReport,
  resetExecutiveInboxPlatformCertificationForTests,
  runExecutiveInboxPlatformCertification,
} from "./executiveInboxPlatformCertificationRunner.ts";

export type {
  ExecutiveInboxPlatformCertificationCheck,
  ExecutiveInboxPlatformCertificationGroup,
  ExecutiveInboxPlatformCertificationReport,
  ExecutiveInboxPlatformCertificationResult,
  ExecutiveInboxPlatformCertificationStatus,
  ExecutiveInboxPlatformLayerRegressionResult,
  ExecutiveInboxPlatformRegressionResult,
} from "./executiveInboxPlatformCertificationTypes.ts";

export type { ExecutiveInboxPlatformCertificationManifest };
export type ExecutiveInboxPlatformCertificationGroupKey =
  (typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES,
  buildExecutiveInboxPlatformCertificationManifest,
  validateExecutiveInboxPlatformCertificationManifest,
  runExecutiveInboxPlatformRegression,
  runExecutiveInboxPlatformCertification,
  getExecutiveInboxPlatformCertificationReport,
  resetExecutiveInboxPlatformCertificationForTests,
  getExecutiveInboxCertificationManifest,
};

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_VERSION =
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateExecutiveInboxPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateExecutiveInboxFoundation(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.length !== 6) {
    issues.push("Expected six certified modules.");
  }
  const regression = runExecutiveInboxPlatformRegression(timestamp);
  if (!regression.success) {
    issues.push(regression.summary);
  }
  const manifest = buildExecutiveInboxPlatformCertificationManifest(
    timestamp,
    regression.success,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    })
  );
  const manifestValidation = validateExecutiveInboxPlatformCertificationManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function certifyExecutiveInboxPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: ReturnType<typeof runExecutiveInboxPlatformCertification>["report"];
  manifest: ExecutiveInboxPlatformCertificationManifest;
  readOnly: true;
}> {
  const result = runExecutiveInboxPlatformCertification(timestamp);
  const manifest = getExecutiveInboxCertificationManifest(timestamp);
  return Object.freeze({
    certified: result.certified,
    readyForFreeze: result.certified,
    report: result.report,
    manifest,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPlatformCertification = Object.freeze({
  runExecutiveInboxPlatformCertification,
  runExecutiveInboxPlatformRegression,
  getExecutiveInboxCertificationManifest,
  getExecutiveInboxPlatformCertificationReport,
  validateExecutiveInboxPlatform,
  certifyExecutiveInboxPlatform,
  buildExecutiveInboxPlatformCertificationManifest,
  version: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
