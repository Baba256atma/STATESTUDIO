/**
 * APP-5:8 — Scenario Timeline Dashboard compatibility manager.
 */

import { getScenarioTimelineAssistantIntegrationContract } from "./scenarioTimelineAssistantIntegration.ts";
import {
  fetchDashboardScenarioTimelineVersion,
  readScenarioTimelineDashboardDiagnostics,
} from "./scenarioTimelineDashboardAdapter.ts";
import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineAssistantConstants.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineDashboardConstants.ts";
import type { ScenarioTimelineDashboardDiagnostics } from "./scenarioTimelineDashboardTypes.ts";

export type ScenarioTimelineDashboardCompatibilityReport = Readonly<{
  compatible: boolean;
  app5_1: boolean;
  app5_2: boolean;
  app5_3: boolean;
  app5_4: boolean;
  app5_5: boolean;
  app5_6: boolean;
  app5_7: boolean;
  warnings: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

export function validateScenarioTimelineDashboardCompatibility(): ScenarioTimelineDashboardCompatibilityReport {
  const diagnostics = readScenarioTimelineDashboardDiagnostics();
  const version = fetchDashboardScenarioTimelineVersion();
  const warnings: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  const app5_6 = diagnostics.apiLayerReady && version.apiLayerVersion !== undefined;
  const app5_1 = version.foundationVersion !== undefined;
  const app5_2 = version.eventEngineVersion !== undefined;
  const app5_3 = version.lifecycleEngineVersion !== undefined;
  const app5_4 = version.historyEngineVersion !== undefined;
  const app5_5 = version.queryEngineVersion !== undefined;

  const assistantContract = getScenarioTimelineAssistantIntegrationContract();
  const app5_7 =
    assistantContract.contractVersion === SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION &&
    assistantContract.consumesApiLayerOnly === true;

  if (!app5_6) {
    warnings.push(
      Object.freeze({
        code: "app5_6_not_ready",
        message: "APP-5:6 API layer is not ready for dashboard integration.",
        readOnly: true as const,
      })
    );
  }

  if (!diagnostics.timelineHealthy) {
    warnings.push(
      Object.freeze({
        code: "timeline_health_warning",
        message: "Scenario timeline health check reported issues.",
        readOnly: true as const,
      })
    );
  }

  const compatible = app5_1 && app5_2 && app5_3 && app5_4 && app5_5 && app5_6 && app5_7;

  return Object.freeze({
    compatible,
    app5_1,
    app5_2,
    app5_3,
    app5_4,
    app5_5,
    app5_6,
    app5_7,
    warnings: Object.freeze(warnings),
    readOnly: true as const,
  });
}

export function readScenarioTimelineDashboardCompatibilityDiagnostics(): ScenarioTimelineDashboardDiagnostics {
  return readScenarioTimelineDashboardDiagnostics();
}

export const ScenarioTimelineDashboardCompatibility = Object.freeze({
  validateScenarioTimelineDashboardCompatibility,
  contractVersion: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
});
