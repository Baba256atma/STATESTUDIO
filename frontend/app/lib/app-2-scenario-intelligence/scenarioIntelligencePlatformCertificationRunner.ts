/**
 * APP-2:13 — Scenario Intelligence Platform certification runner.
 * Canonical APP-2 platform certification entry point.
 */

import {
  SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_TAG,
  SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST,
  type ScenarioIntelligencePlatformCertificationResult,
  type ScenarioIntelligencePlatformRegressionResult,
} from "./scenarioIntelligencePlatformCertificationContract.ts";
import {
  buildScenarioIntelligencePlatformCertificationChecks,
  runScenarioIntelligencePlatformCertification,
} from "./scenarioIntelligencePlatformCertification.ts";
import { runScenarioIntelligencePlatformRegression } from "./scenarioIntelligencePlatformRegression.ts";

export {
  SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_TAG,
  SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST,
  buildScenarioIntelligencePlatformCertificationChecks,
  runScenarioIntelligencePlatformCertification,
  runScenarioIntelligencePlatformRegression,
};
export type {
  ScenarioIntelligencePlatformCertificationResult,
  ScenarioIntelligencePlatformRegressionResult,
};

export const ScenarioIntelligencePlatformCertificationRunner = Object.freeze({
  runScenarioIntelligencePlatformCertification,
  runScenarioIntelligencePlatformRegression,
  buildScenarioIntelligencePlatformCertificationChecks,
  version: SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  manifest: SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST,
  tag: SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_TAG,
});
