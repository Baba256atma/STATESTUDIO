/**
 * APP-12:8 — Executive Recommendation Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateExecutiveRecommendationFoundation } from "./executiveRecommendationContracts.ts";
import {
  buildExecutiveRecommendationPlatformCertificationManifest,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES,
  validateExecutiveRecommendationPlatformCertificationManifest,
  type CertificationManifest,
} from "./executiveRecommendationPlatformCertificationManifest.ts";
import { runExecutiveRecommendationPlatformRegression } from "./executiveRecommendationPlatformRegression.ts";
import {
  getExecutiveRecommendationCertificationManifest,
  getExecutiveRecommendationPlatformCertificationReport,
  resetExecutiveRecommendationPlatformCertificationForTests,
  runExecutiveRecommendationPlatformCertification,
} from "./executiveRecommendationPlatformCertificationRunner.ts";

export type {
  CertificationCheck,
  CertificationGroup,
  CertificationReport,
  CertificationSummary,
  PlatformCertification,
  PlatformRegression,
  PlatformRegressionLayerResult,
} from "./executiveRecommendationPlatformCertificationTypes.ts";

export type { CertificationManifest };
export type ExecutiveRecommendationPlatformCertificationGroupKey =
  (typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES,
  buildExecutiveRecommendationPlatformCertificationManifest,
  validateExecutiveRecommendationPlatformCertificationManifest,
  runExecutiveRecommendationPlatformRegression,
  runExecutiveRecommendationPlatformCertification,
  getExecutiveRecommendationPlatformCertificationReport,
  resetExecutiveRecommendationPlatformCertificationForTests,
  getExecutiveRecommendationCertificationManifest,
};

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_VERSION =
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateExecutiveRecommendationPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateExecutiveRecommendationFoundation(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.length !== 7) {
    issues.push("Expected seven certified phases.");
  }
  const regression = runExecutiveRecommendationPlatformRegression(timestamp);
  if (!regression.success) {
    issues.push(regression.summary);
  }
  const manifest = buildExecutiveRecommendationPlatformCertificationManifest(
    timestamp,
    regression.success,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    })
  );
  const manifestValidation = validateExecutiveRecommendationPlatformCertificationManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function certifyExecutiveRecommendationPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: ReturnType<typeof runExecutiveRecommendationPlatformCertification>["report"];
  manifest: CertificationManifest;
  readOnly: true;
}> {
  const result = runExecutiveRecommendationPlatformCertification(timestamp);
  const manifest = getExecutiveRecommendationCertificationManifest(timestamp);
  return Object.freeze({
    certified: result.certified,
    readyForFreeze: result.certified,
    report: result.report,
    manifest,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationPlatformCertification = Object.freeze({
  runExecutiveRecommendationPlatformCertification,
  runExecutiveRecommendationPlatformRegression,
  getExecutiveRecommendationCertificationManifest,
  getExecutiveRecommendationPlatformCertificationReport,
  validateExecutiveRecommendationPlatform,
  certifyExecutiveRecommendationPlatform,
  buildExecutiveRecommendationPlatformCertificationManifest,
  version: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
