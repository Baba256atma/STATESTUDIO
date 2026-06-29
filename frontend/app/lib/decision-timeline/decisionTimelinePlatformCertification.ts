/**
 * APP-6:11 — Decision Timeline Platform Certification.
 * Official read-only platform-wide certification entry point.
 */

import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";
import {
  DECISION_TIMELINE_CERTIFIED_MODULES,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
  getDecisionTimelineCertificationManifestContract,
} from "./decisionTimelinePlatformCertificationManifest.ts";
import { runDecisionTimelinePlatformRegression } from "./decisionTimelinePlatformRegression.ts";
import {
  getDecisionTimelineCertificationReport,
  resetDecisionTimelinePlatformCertificationReportForTests,
  runDecisionTimelinePlatformCertification,
} from "./decisionTimelinePlatformCertificationRunner.ts";

export type DecisionTimelinePlatformCertificationGroupKey =
  (typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export type DecisionTimelinePlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionTimelinePlatformCertificationGroup = Readonly<{
  groupKey: DecisionTimelinePlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly DecisionTimelinePlatformCertificationCheck[];
  readOnly: true;
}>;

export type DecisionTimelinePlatformLayerRegressionResult = Readonly<{
  layerId: string;
  certified: boolean;
  score: number;
  summary: string;
  readOnly: true;
}>;

export type DecisionTimelinePlatformValidationResult = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export type DecisionTimelinePlatformCertificationReport = Readonly<{
  platformIdentity: string;
  certificationVersion: typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certificationTimestamp: string;
  certificationScore: number;
  groups: readonly DecisionTimelinePlatformCertificationGroup[];
  regressionSummary: string;
  layerRegressionResults: readonly DecisionTimelinePlatformLayerRegressionResult[];
  certifiedModules: readonly Readonly<{ layerId: string; title: string; contractVersion: string; readOnly: true }>[];
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  certified: boolean;
  readyForFreeze: boolean;
  finalPlatformStatus: "CERTIFIED" | "NOT_CERTIFIED";
  readOnly: true;
}>;

export type DecisionTimelinePlatformCertificationResult = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationScore: number;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  failures: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  status: "PASS" | "FAIL";
  summary: string;
  report: DecisionTimelinePlatformCertificationReport;
  readOnly: true;
}>;

export type DecisionTimelineCertificationManifest = Readonly<{
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedModules: readonly Readonly<{ layerId: string; title: string; contractVersion: string; readOnly: true }>[];
  certificationGroups: readonly DecisionTimelinePlatformCertificationGroupKey[];
  stageManifest: import("../stage/stageArchitectureTypes.ts").StageManifest;
  readOnly: true;
}>;

export {
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_TIMELINE_CERTIFIED_MODULES,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
  getDecisionTimelineCertificationManifestContract,
  runDecisionTimelinePlatformRegression,
  runDecisionTimelinePlatformCertification,
  getDecisionTimelineCertificationReport,
  resetDecisionTimelinePlatformCertificationReportForTests,
};

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_VERSION =
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function getDecisionTimelineCertificationManifest(): DecisionTimelineCertificationManifest {
  return Object.freeze({
    contractVersion: DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedModules: Object.freeze(
      DECISION_TIMELINE_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          layerId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    certificationGroups: DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
    stageManifest: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
    readOnly: true as const,
  });
}

export function validateDecisionTimelinePlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): DecisionTimelinePlatformValidationResult {
  const issues: Readonly<{ code: string; message: string; readOnly: true }>[] = [];
  const foundation = validateDecisionTimelineFoundation(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(Object.freeze({ code: issue.code, message: issue.message, readOnly: true as const }));
    }
  }
  if (getDecisionTimelineCertificationManifest().certifiedModules.length !== 10) {
    issues.push(
      Object.freeze({
        code: "invalid_module_count",
        message: "Expected 10 certified modules.",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const DecisionTimelinePlatformCertification = Object.freeze({
  runDecisionTimelinePlatformCertification,
  runDecisionTimelinePlatformRegression,
  getDecisionTimelineCertificationManifest,
  validateDecisionTimelinePlatform,
  getDecisionTimelineCertificationReport,
  version: DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  tags: DECISION_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
});
