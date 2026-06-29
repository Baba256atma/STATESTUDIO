/**
 * APP-5:9 — Scenario Timeline Platform compatibility certification.
 */

import { certifyScenarioTimelineApiLayer } from "./scenarioTimelineApiCertification.ts";
import { certifyScenarioTimelineAssistantIntegration } from "./scenarioTimelineAssistantCertification.ts";
import { certifyScenarioTimelineDashboardIntegration } from "./scenarioTimelineDashboardCertification.ts";
import { certifyTimelineEventEngine } from "./scenarioTimelineEventCertification.ts";
import { certifyScenarioHistoryEngine } from "./scenarioTimelineHistoryCertification.ts";
import { certifyScenarioLifecycleEngine } from "./scenarioTimelineLifecycleCertification.ts";
import { certifyScenarioTimelineQueryEngine } from "./scenarioTimelineQueryCertification.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
} from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "./scenarioTimelinePlatformContracts.ts";
import { validateScenarioTimelinePlatform } from "./scenarioTimelinePlatform.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import type { ScenarioTimelinePlatformLayerCompatibilityReport } from "./scenarioTimelinePlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function layerReport(
  layerId: string,
  certified: boolean,
  passedChecks: number,
  totalChecks: number,
  summary: string
): ScenarioTimelinePlatformLayerCompatibilityReport {
  return Object.freeze({
    layerId,
    certified,
    passedChecks,
    totalChecks,
    summary,
    readOnly: true as const,
  });
}

function countPassed(checks: readonly { passed: boolean }[]): number {
  return checks.filter((entry) => entry.passed).length;
}

export function certifyScenarioTimelinePlatformFoundationLayer(): ScenarioTimelinePlatformLayerCompatibilityReport {
  initializeScenarioTimelinePlatform(FIXED_TIME);
  const validation = validateScenarioTimelinePlatform();
  const identityValid =
    SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
    SCENARIO_TIMELINE_PLATFORM_IDENTITY.version === SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  const vocabularyValid = SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length === 8;
  const passed = validation.valid && identityValid && vocabularyValid;
  return layerReport(
    "APP-5/1",
    passed,
    [validation.valid, identityValid, vocabularyValid].filter(Boolean).length,
    3,
    passed ? "APP-5:1 foundation compatible." : "APP-5:1 foundation compatibility failed."
  );
}

export function runScenarioTimelinePlatformCompatibilityCertification(): readonly ScenarioTimelinePlatformLayerCompatibilityReport[] {
  const event = certifyTimelineEventEngine();
  const lifecycle = certifyScenarioLifecycleEngine();
  const history = certifyScenarioHistoryEngine();
  const query = certifyScenarioTimelineQueryEngine();
  const api = certifyScenarioTimelineApiLayer();
  const assistant = certifyScenarioTimelineAssistantIntegration();
  const dashboard = certifyScenarioTimelineDashboardIntegration();
  const foundation = certifyScenarioTimelinePlatformFoundationLayer();

  return Object.freeze([
    foundation,
    layerReport("APP-5/2", event.certified, countPassed(event.checks), event.checks.length, event.summary),
    layerReport(
      "APP-5/3",
      lifecycle.certified,
      countPassed(lifecycle.checks),
      lifecycle.checks.length,
      lifecycle.summary
    ),
    layerReport("APP-5/4", history.certified, countPassed(history.checks), history.checks.length, history.summary),
    layerReport("APP-5/5", query.certified, countPassed(query.checks), query.checks.length, query.summary),
    layerReport("APP-5/6", api.certified, countPassed(api.checks), api.checks.length, api.summary),
    layerReport(
      "APP-5/7",
      assistant.certified,
      countPassed(assistant.checks),
      assistant.checks.length,
      assistant.summary
    ),
    layerReport(
      "APP-5/8",
      dashboard.certified,
      countPassed(dashboard.checks),
      dashboard.checks.length,
      dashboard.summary
    ),
  ]);
}
