/**
 * APP-7:7 — Business Timeline Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import {
  buildBusinessTimelinePlatformManifest,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES,
  validateBusinessTimelinePlatformManifest,
  type BusinessTimelinePlatformManifest,
} from "./businessTimelinePlatformCertificationManifest.ts";
import { runBusinessTimelinePlatformRegression } from "./businessTimelinePlatformRegression.ts";
import {
  buildBusinessTimelinePlatformReadinessReport,
} from "./businessTimelinePlatformReadiness.ts";
import {
  getBusinessTimelinePlatformCertificationReport,
  getBusinessTimelinePlatformManifest,
  getBusinessTimelinePlatformReadinessReportFromLastRun,
  resetBusinessTimelinePlatformCertificationReportForTests,
  runBusinessTimelinePlatformCertification,
} from "./businessTimelinePlatformCertificationRunner.ts";

export type {
  BusinessTimelinePlatformCertificationCheck,
  BusinessTimelinePlatformCertificationGroup,
  BusinessTimelinePlatformCertificationReport,
  BusinessTimelinePlatformCertificationResult,
  BusinessTimelinePlatformLayerRegressionResult,
  BusinessTimelinePlatformReadinessGate,
  BusinessTimelinePlatformReadinessReport,
  BusinessTimelinePlatformRegressionResult,
} from "./businessTimelinePlatformCertificationTypes.ts";

export type { BusinessTimelinePlatformManifest };
export type BusinessTimelinePlatformCertificationGroupKey =
  (typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES,
  buildBusinessTimelinePlatformManifest,
  validateBusinessTimelinePlatformManifest,
  runBusinessTimelinePlatformRegression,
  runBusinessTimelinePlatformCertification,
  getBusinessTimelinePlatformCertificationReport,
  resetBusinessTimelinePlatformCertificationReportForTests,
  getBusinessTimelinePlatformManifest,
  getBusinessTimelinePlatformReadinessReportFromLastRun,
  buildBusinessTimelinePlatformReadinessReport,
};

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_VERSION =
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateBusinessTimelinePlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateBusinessTimeline(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES.length !== 6) {
    issues.push("Expected six certified modules.");
  }
  const manifest = buildBusinessTimelinePlatformManifest(timestamp, false);
  const manifestValidation = validateBusinessTimelinePlatformManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const BusinessTimelinePlatformCertification = Object.freeze({
  runBusinessTimelinePlatformCertification,
  runBusinessTimelinePlatformRegression,
  getBusinessTimelinePlatformManifest,
  getBusinessTimelinePlatformCertificationReport,
  getBusinessTimelinePlatformReadinessReport: getBusinessTimelinePlatformReadinessReportFromLastRun,
  validateBusinessTimelinePlatform,
  buildBusinessTimelinePlatformManifest,
  version: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
