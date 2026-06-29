/**
 * APP-5:5 — Scenario Timeline Query compatibility validator.
 */

import { getTimelineEventContract } from "./scenarioTimelineEventEngine.ts";
import { getScenarioLifecycleContract } from "./scenarioTimelineLifecycleEngine.ts";
import { getScenarioHistoryContract } from "./scenarioTimelineHistoryEngine.ts";
import type { ScenarioTimelineQuerySourceContext } from "./scenarioTimelineQuerySources.ts";
import type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult } from "./scenarioTimelineQueryTypes.ts";
import { SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import { getScenarioTimelineContractVersionMetadata } from "./scenarioTimelinePlatformContracts.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateTimelineQueryCompatibility(
  context: ScenarioTimelineQuerySourceContext
): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  const foundation = getScenarioTimelineContractVersionMetadata();
  if (foundation.contractVersion !== SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("app5_1_incompatible", "APP-5:1 contract version mismatch.", "contractVersion"));
  }

  const eventContract = getTimelineEventContract();
  if (eventContract.contractVersion !== "APP-5/2") {
    issues.push(issue("app5_2_incompatible", "APP-5:2 event contract unavailable.", "eventContract"));
  }

  const lifecycleContract = getScenarioLifecycleContract();
  if (lifecycleContract.contractVersion !== "APP-5/3") {
    issues.push(issue("app5_3_incompatible", "APP-5:3 lifecycle contract unavailable.", "lifecycleContract"));
  }

  const historyContract = getScenarioHistoryContract();
  if (historyContract.contractVersion !== "APP-5/4") {
    issues.push(issue("app5_4_incompatible", "APP-5:4 history contract unavailable.", "historyContract"));
  }

  if (context.history && context.lifecycle) {
    if (context.history.scenarioId !== context.lifecycle.scenarioId) {
      issues.push(issue("history_lifecycle_mismatch", "History and lifecycle scenarioId mismatch.", "scenarioId"));
    }
    if (context.history.workspaceId !== context.lifecycle.workspaceId) {
      issues.push(issue("history_lifecycle_mismatch", "History and lifecycle workspaceId mismatch.", "workspaceId"));
    }
  }

  return result(issues);
}

export const ScenarioTimelineQueryCompatibility = Object.freeze({
  validateTimelineQueryCompatibility,
});
