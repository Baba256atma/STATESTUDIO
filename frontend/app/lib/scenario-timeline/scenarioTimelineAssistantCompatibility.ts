/**
 * APP-5:7 — Scenario Timeline Assistant compatibility manager.
 */

import { fetchScenarioTimelineVersion, readScenarioTimelineAssistantDiagnostics } from "./scenarioTimelineAssistantAdapter.ts";
import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineAssistantConstants.ts";
import type { ScenarioTimelineAssistantWarning } from "./scenarioTimelineAssistantTypes.ts";

export type ScenarioTimelineAssistantCompatibilityReport = Readonly<{
  compatible: boolean;
  app5_1: boolean;
  app5_2: boolean;
  app5_3: boolean;
  app5_4: boolean;
  app5_5: boolean;
  app5_6: boolean;
  warnings: readonly ScenarioTimelineAssistantWarning[];
  readOnly: true;
}>;

export function validateScenarioTimelineAssistantCompatibility(): ScenarioTimelineAssistantCompatibilityReport {
  const diagnostics = readScenarioTimelineAssistantDiagnostics();
  const version = fetchScenarioTimelineVersion();
  const warnings: ScenarioTimelineAssistantWarning[] = [];

  const app5_6 = diagnostics.apiLayerReady && version.apiLayerVersion !== undefined;

  if (!app5_6) {
    warnings.push(
      Object.freeze({
        code: "app5_6_not_ready",
        message: "APP-5:6 API layer is not ready for assistant integration.",
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

  const app5_1 = version.foundationVersion !== undefined;
  const app5_2 = version.eventEngineVersion !== undefined;
  const app5_3 = version.lifecycleEngineVersion !== undefined;
  const app5_4 = version.historyEngineVersion !== undefined;
  const app5_5 = version.queryEngineVersion !== undefined;

  const compatible = app5_1 && app5_2 && app5_3 && app5_4 && app5_5 && app5_6;

  return Object.freeze({
    compatible,
    app5_1,
    app5_2,
    app5_3,
    app5_4,
    app5_5,
    app5_6,
    warnings: Object.freeze(warnings),
    readOnly: true as const,
  });
}

export const ScenarioTimelineAssistantCompatibility = Object.freeze({
  validateScenarioTimelineAssistantCompatibility,
  contractVersion: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
});
