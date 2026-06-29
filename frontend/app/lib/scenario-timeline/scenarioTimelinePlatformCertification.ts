/**
 * APP-5:9 — Scenario Timeline Platform Certification.
 * Official read-only platform-wide certification entry point.
 */

import {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
} from "./scenarioTimelinePlatformCertificationConstants.ts";
import {
  getScenarioTimelinePlatformCertificationContract,
  ScenarioTimelinePlatformCertificationContract,
} from "./scenarioTimelinePlatformCertificationContracts.ts";
import {
  certifyScenarioTimelinePlatform,
  getScenarioTimelinePlatformCertificationReport,
  getScenarioTimelinePlatformHealth,
  resetScenarioTimelinePlatformCertificationReportForTests,
  runScenarioTimelinePlatformCertification,
} from "./scenarioTimelinePlatformCertificationRunner.ts";
import { runScenarioTimelineEndToEndCertification } from "./scenarioTimelinePlatformEndToEndCertification.ts";
import { runScenarioTimelinePlatformRegression } from "./scenarioTimelinePlatformRegression.ts";

export {
  runScenarioTimelinePlatformCertification,
  runScenarioTimelinePlatformRegression,
  runScenarioTimelineEndToEndCertification,
  getScenarioTimelinePlatformCertificationReport,
  getScenarioTimelinePlatformHealth,
  certifyScenarioTimelinePlatform,
  resetScenarioTimelinePlatformCertificationReportForTests,
  getScenarioTimelinePlatformCertificationContract,
};

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_VERSION =
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
export { SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS };

export const ScenarioTimelinePlatformCertification = Object.freeze({
  runScenarioTimelinePlatformCertification,
  runScenarioTimelinePlatformRegression,
  runScenarioTimelineEndToEndCertification,
  getScenarioTimelinePlatformCertificationReport,
  getScenarioTimelinePlatformHealth,
  certifyScenarioTimelinePlatform,
  getScenarioTimelinePlatformCertificationContract,
  version: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});

export type {
  ScenarioTimelinePlatformCertificationReport,
  ScenarioTimelinePlatformCertificationResult,
  ScenarioTimelinePlatformHealth,
  ScenarioTimelinePlatformEndToEndResult,
  ScenarioTimelinePlatformRegressionResult,
} from "./scenarioTimelinePlatformCertificationTypes.ts";

export { ScenarioTimelinePlatformCertificationContract };
