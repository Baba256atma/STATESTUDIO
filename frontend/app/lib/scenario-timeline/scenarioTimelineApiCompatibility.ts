/**
 * APP-5:6 — Scenario Timeline API compatibility manager.
 */

import { ScenarioTimelineApiSources } from "./scenarioTimelineApiSources.ts";
import type { ScenarioTimelineApiError, ScenarioTimelineApiWarning } from "./scenarioTimelineApiTypes.ts";

export type ScenarioTimelineApiCompatibilityReport = Readonly<{
  compatible: boolean;
  errors: readonly ScenarioTimelineApiError[];
  warnings: readonly ScenarioTimelineApiWarning[];
  readOnly: true;
}>;

export function validateScenarioTimelineApiCompatibility(): ScenarioTimelineApiCompatibilityReport {
  const errors: ScenarioTimelineApiError[] = [];
  const warnings: ScenarioTimelineApiWarning[] = [];

  const diagnostics = ScenarioTimelineApiSources.readScenarioTimelineApiDiagnostics();
  if (!diagnostics.foundationReady) {
    errors.push(Object.freeze({ code: "app5_1_not_ready", message: "APP-5:1 foundation is not initialized.", readOnly: true as const }));
  }
  if (!diagnostics.eventEngineReady) {
    errors.push(Object.freeze({ code: "app5_2_not_ready", message: "APP-5:2 event engine is not initialized.", readOnly: true as const }));
  }
  if (!diagnostics.lifecycleEngineReady) {
    errors.push(Object.freeze({ code: "app5_3_not_ready", message: "APP-5:3 lifecycle engine is not initialized.", readOnly: true as const }));
  }
  if (!diagnostics.historyEngineReady) {
    errors.push(Object.freeze({ code: "app5_4_not_ready", message: "APP-5:4 history engine is not initialized.", readOnly: true as const }));
  }
  if (!diagnostics.queryEngineReady) {
    errors.push(Object.freeze({ code: "app5_5_not_ready", message: "APP-5:5 query engine is not initialized.", readOnly: true as const }));
  }

  const foundationContract = ScenarioTimelineApiSources.getScenarioTimelineFoundationVersionMetadata();
  if (foundationContract.contractVersion !== ScenarioTimelineApiSources.versions.foundation) {
    errors.push(Object.freeze({ code: "app5_1_incompatible", message: "APP-5:1 contract version mismatch.", readOnly: true as const }));
  }
  if (ScenarioTimelineApiSources.getTimelineEventContract().contractVersion !== ScenarioTimelineApiSources.versions.eventEngine) {
    errors.push(Object.freeze({ code: "app5_2_incompatible", message: "APP-5:2 contract version mismatch.", readOnly: true as const }));
  }
  if (ScenarioTimelineApiSources.getScenarioLifecycleContract().contractVersion !== ScenarioTimelineApiSources.versions.lifecycleEngine) {
    errors.push(Object.freeze({ code: "app5_3_incompatible", message: "APP-5:3 contract version mismatch.", readOnly: true as const }));
  }
  if (ScenarioTimelineApiSources.getScenarioHistoryContract().contractVersion !== ScenarioTimelineApiSources.versions.historyEngine) {
    errors.push(Object.freeze({ code: "app5_4_incompatible", message: "APP-5:4 contract version mismatch.", readOnly: true as const }));
  }
  if (ScenarioTimelineApiSources.getTimelineQueryContract().contractVersion !== ScenarioTimelineApiSources.versions.queryEngine) {
    errors.push(Object.freeze({ code: "app5_5_incompatible", message: "APP-5:5 contract version mismatch.", readOnly: true as const }));
  }

  if (ScenarioTimelineApiSources.areScenarioTimelineApiEnginesReady()) {
    const platformValidation = ScenarioTimelineApiSources.validateScenarioTimelinePlatform();
    if (!platformValidation.valid) {
      warnings.push(
        Object.freeze({
          code: "platform_validation_warning",
          message: "APP-5:1 platform validation reported issues.",
          readOnly: true as const,
        })
      );
    }
  }

  return Object.freeze({
    compatible: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    readOnly: true as const,
  });
}

export const ScenarioTimelineApiCompatibility = Object.freeze({
  validateScenarioTimelineApiCompatibility,
});
