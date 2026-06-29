/**
 * APP-10:8 — Cross-Scenario Learning Platform Certification types.
 */

import type { CrossScenarioLearningPlatformCertificationGroupKey } from "./crossScenarioLearningPlatformCertificationManifest.ts";

export type CrossScenarioLearningPlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformCertificationGroup = Readonly<{
  groupKey: CrossScenarioLearningPlatformCertificationGroupKey;
  title: string;
  passed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: readonly CrossScenarioLearningPlatformCertificationCheck[];
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformLayerRegressionResult = Readonly<{
  layerId: string;
  title: string;
  contractVersion: string;
  certified: boolean;
  passedCount: number;
  checkCount: number;
  summary: string;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformRegressionResult = Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly CrossScenarioLearningPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformCertificationStatus = Readonly<{
  certified: boolean;
  readyForFreeze: boolean;
  certificationTimestamp: string | null;
  contractVersion: typeof import("./crossScenarioLearningPlatformCertificationManifest.ts").CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformCertificationReport = Readonly<{
  certified: boolean;
  phase: "APP-10/8";
  contractVersion: typeof import("./crossScenarioLearningPlatformCertificationManifest.ts").CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  platformVersion: typeof import("./crossScenarioLearningPlatformCertificationManifest.ts").CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  groups: readonly CrossScenarioLearningPlatformCertificationGroup[];
  groupCount: number;
  groupsPassed: number;
  groupsFailed: number;
  checkCount: number;
  passedCount: number;
  failedCount: number;
  regression: CrossScenarioLearningPlatformRegressionResult;
  status: CrossScenarioLearningPlatformCertificationStatus;
  timestamp: string;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformCertificationResult = Readonly<{
  certified: boolean;
  report: CrossScenarioLearningPlatformCertificationReport;
  readOnly: true;
}>;
