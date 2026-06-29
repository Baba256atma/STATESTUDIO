/**
 * APP-10:8 — Cross-Scenario Learning Platform Certification.
 * Official read-only full-platform certification entry point.
 */

import { validateCrossScenarioLearningFoundation } from "./crossScenarioLearningContracts.ts";
import {
  buildCrossScenarioLearningPlatformCertificationManifest,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES,
  validateCrossScenarioLearningPlatformCertificationManifest,
  type CrossScenarioLearningPlatformCertificationManifest,
} from "./crossScenarioLearningPlatformCertificationManifest.ts";
import { runCrossScenarioLearningPlatformRegression } from "./crossScenarioLearningPlatformRegression.ts";
import {
  getCrossScenarioLearningCertificationManifest,
  getCrossScenarioLearningPlatformCertificationReport,
  resetCrossScenarioLearningPlatformCertificationForTests,
  runCrossScenarioLearningPlatformCertification,
} from "./crossScenarioLearningPlatformCertificationRunner.ts";

export type {
  CrossScenarioLearningPlatformCertificationCheck,
  CrossScenarioLearningPlatformCertificationGroup,
  CrossScenarioLearningPlatformCertificationReport,
  CrossScenarioLearningPlatformCertificationResult,
  CrossScenarioLearningPlatformCertificationStatus,
  CrossScenarioLearningPlatformLayerRegressionResult,
  CrossScenarioLearningPlatformRegressionResult,
} from "./crossScenarioLearningPlatformCertificationTypes.ts";

export type { CrossScenarioLearningPlatformCertificationManifest };
export type CrossScenarioLearningPlatformCertificationGroupKey =
  (typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export {
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES,
  buildCrossScenarioLearningPlatformCertificationManifest,
  validateCrossScenarioLearningPlatformCertificationManifest,
  runCrossScenarioLearningPlatformRegression,
  runCrossScenarioLearningPlatformCertification,
  getCrossScenarioLearningPlatformCertificationReport,
  resetCrossScenarioLearningPlatformCertificationForTests,
  getCrossScenarioLearningCertificationManifest,
};

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_VERSION =
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;

export function validateCrossScenarioLearningPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  const foundation = validateCrossScenarioLearningFoundation(timestamp);
  if (!foundation.valid) {
    for (const issue of foundation.issues) {
      issues.push(issue.message);
    }
  }
  if (CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.length !== 7) {
    issues.push("Expected seven certified modules.");
  }
  const regression = runCrossScenarioLearningPlatformRegression(timestamp);
  if (!regression.success) {
    issues.push(regression.summary);
  }
  const manifest = buildCrossScenarioLearningPlatformCertificationManifest(
    timestamp,
    regression.success,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    })
  );
  const manifestValidation = validateCrossScenarioLearningPlatformCertificationManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function certifyCrossScenarioLearningPlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  report: ReturnType<typeof runCrossScenarioLearningPlatformCertification>["report"];
  manifest: CrossScenarioLearningPlatformCertificationManifest;
  readOnly: true;
}> {
  const result = runCrossScenarioLearningPlatformCertification(timestamp);
  const manifest = getCrossScenarioLearningCertificationManifest(timestamp);
  return Object.freeze({
    certified: result.certified,
    readyForFreeze: result.certified,
    report: result.report,
    manifest,
    readOnly: true as const,
  });
}

export const CrossScenarioLearningPlatformCertification = Object.freeze({
  runCrossScenarioLearningPlatformCertification,
  runCrossScenarioLearningPlatformRegression,
  getCrossScenarioLearningCertificationManifest,
  getCrossScenarioLearningPlatformCertificationReport,
  validateCrossScenarioLearningPlatform,
  certifyCrossScenarioLearningPlatform,
  buildCrossScenarioLearningPlatformCertificationManifest,
  version: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
