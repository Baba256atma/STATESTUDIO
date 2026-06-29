/**
 * APP-9:8 — Confidence Evolution Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import {
  buildConfidenceEvolutionPlatformManifest,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES,
  validateConfidenceEvolutionPlatformManifest,
  type ConfidenceEvolutionPlatformManifest,
} from "./confidenceEvolutionPlatformCertificationManifest.ts";
import { runConfidenceEvolutionPlatformRegression } from "./confidenceEvolutionPlatformRegression.ts";
import { buildConfidenceEvolutionPlatformReadinessReport } from "./confidenceEvolutionPlatformReadiness.ts";
import {
  getConfidenceEvolutionPlatformCertificationReport,
  getConfidenceEvolutionPlatformManifest,
  getConfidenceEvolutionPlatformReadinessReportFromLastRun,
  resetConfidenceEvolutionPlatformCertificationReportForTests,
  runConfidenceEvolutionPlatformCertification,
} from "./confidenceEvolutionPlatformCertificationRunner.ts";

export type {
  ConfidenceEvolutionPlatformCertificationCheck,
  ConfidenceEvolutionPlatformCertificationGroup,
  ConfidenceEvolutionPlatformCertificationReport,
  ConfidenceEvolutionPlatformCertificationResult,
  ConfidenceEvolutionPlatformLayerRegressionResult,
  ConfidenceEvolutionPlatformReadinessGate,
  ConfidenceEvolutionPlatformReadinessReport,
  ConfidenceEvolutionPlatformRegressionResult,
} from "./confidenceEvolutionPlatformCertificationTypes.ts";

export type { ConfidenceEvolutionPlatformManifest };
export type ConfidenceEvolutionPlatformCertificationGroupKey =
  (typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES,
  buildConfidenceEvolutionPlatformManifest,
  validateConfidenceEvolutionPlatformManifest,
  runConfidenceEvolutionPlatformRegression,
  runConfidenceEvolutionPlatformCertification,
  getConfidenceEvolutionPlatformCertificationReport,
  resetConfidenceEvolutionPlatformCertificationReportForTests,
  getConfidenceEvolutionPlatformManifest,
  getConfidenceEvolutionPlatformReadinessReportFromLastRun,
  buildConfidenceEvolutionPlatformReadinessReport,
};

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_VERSION =
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateConfidenceEvolutionPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateConfidenceEvolution(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES.length !== 7) {
    issues.push("Expected seven certified modules.");
  }
  const manifest = buildConfidenceEvolutionPlatformManifest(timestamp, false);
  const manifestValidation = validateConfidenceEvolutionPlatformManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const ConfidenceEvolutionPlatformCertification = Object.freeze({
  runConfidenceEvolutionPlatformCertification,
  runConfidenceEvolutionPlatformRegression,
  getConfidenceEvolutionPlatformManifest,
  getConfidenceEvolutionPlatformCertificationReport,
  getConfidenceEvolutionPlatformReadinessReport: getConfidenceEvolutionPlatformReadinessReportFromLastRun,
  validateConfidenceEvolutionPlatform,
  buildConfidenceEvolutionPlatformManifest,
  version: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
