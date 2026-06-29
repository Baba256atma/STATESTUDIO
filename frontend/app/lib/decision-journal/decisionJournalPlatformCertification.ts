/**
 * APP-8:8 — Decision Journal Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import {
  buildDecisionJournalPlatformManifest,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES,
  validateDecisionJournalPlatformManifest,
  type DecisionJournalPlatformManifest,
} from "./decisionJournalPlatformCertificationManifest.ts";
import { runDecisionJournalPlatformRegression } from "./decisionJournalPlatformRegression.ts";
import { buildDecisionJournalPlatformReadinessReport } from "./decisionJournalPlatformReadiness.ts";
import {
  getDecisionJournalPlatformCertificationReport,
  getDecisionJournalPlatformManifest,
  getDecisionJournalPlatformReadinessReportFromLastRun,
  resetDecisionJournalPlatformCertificationReportForTests,
  runDecisionJournalPlatformCertification,
} from "./decisionJournalPlatformCertificationRunner.ts";

export type {
  DecisionJournalPlatformCertificationCheck,
  DecisionJournalPlatformCertificationGroup,
  DecisionJournalPlatformCertificationReport,
  DecisionJournalPlatformCertificationResult,
  DecisionJournalPlatformLayerRegressionResult,
  DecisionJournalPlatformReadinessGate,
  DecisionJournalPlatformReadinessReport,
  DecisionJournalPlatformRegressionResult,
} from "./decisionJournalPlatformCertificationTypes.ts";

export type { DecisionJournalPlatformManifest };
export type DecisionJournalPlatformCertificationGroupKey =
  (typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES,
  buildDecisionJournalPlatformManifest,
  validateDecisionJournalPlatformManifest,
  runDecisionJournalPlatformRegression,
  runDecisionJournalPlatformCertification,
  getDecisionJournalPlatformCertificationReport,
  resetDecisionJournalPlatformCertificationReportForTests,
  getDecisionJournalPlatformManifest,
  getDecisionJournalPlatformReadinessReportFromLastRun,
  buildDecisionJournalPlatformReadinessReport,
};

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_VERSION =
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateDecisionJournalPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateDecisionJournal(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES.length !== 7) {
    issues.push("Expected seven certified modules.");
  }
  const manifest = buildDecisionJournalPlatformManifest(timestamp, false);
  const manifestValidation = validateDecisionJournalPlatformManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const DecisionJournalPlatformCertification = Object.freeze({
  runDecisionJournalPlatformCertification,
  runDecisionJournalPlatformRegression,
  getDecisionJournalPlatformManifest,
  getDecisionJournalPlatformCertificationReport,
  getDecisionJournalPlatformReadinessReport: getDecisionJournalPlatformReadinessReportFromLastRun,
  validateDecisionJournalPlatform,
  buildDecisionJournalPlatformManifest,
  version: DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
