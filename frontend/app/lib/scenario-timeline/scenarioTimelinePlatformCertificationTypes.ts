/**
 * APP-5:9 — Scenario Timeline Platform Certification domain types.
 */

import type {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS,
} from "./scenarioTimelinePlatformCertificationConstants.ts";

export type ScenarioTimelinePlatformValidationGateKey =
  (typeof SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS)[number];

export type ScenarioTimelinePlatformCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformValidationGate = Readonly<{
  gateKey: ScenarioTimelinePlatformValidationGateKey;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformLayerCompatibilityReport = Readonly<{
  layerId: string;
  certified: boolean;
  passedChecks: number;
  totalChecks: number;
  summary: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformEndToEndResult = Readonly<{
  success: boolean;
  stagesExecuted: readonly string[];
  failureStage: string | null;
  summary: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformRegressionResult = Readonly<{
  success: boolean;
  checksPassed: number;
  checksTotal: number;
  summary: string;
  checks: readonly ScenarioTimelinePlatformCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelinePlatformHealth = Readonly<{
  healthy: boolean;
  platformVersion: typeof SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  apiLayerReady: boolean;
  allEnginesReady: boolean;
  assistantIntegrationReady: boolean;
  dashboardIntegrationReady: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformCertificationReport = Readonly<{
  platformIdentity: string;
  certificationVersion: typeof SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certificationTimestamp: string;
  certificationScore: number;
  validationGates: readonly ScenarioTimelinePlatformValidationGate[];
  regressionResult: ScenarioTimelinePlatformRegressionResult;
  endToEndResult: ScenarioTimelinePlatformEndToEndResult;
  architectureCompliance: boolean;
  compatibilitySummary: readonly ScenarioTimelinePlatformLayerCompatibilityReport[];
  publicApiSummary: string;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  finalPlatformStatus: "CERTIFIED" | "NOT_CERTIFIED";
  overallQualityScore: number;
  readyForFreeze: boolean;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  report: ScenarioTimelinePlatformCertificationReport;
  readOnly: true;
}>;
