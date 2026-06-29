/**
 * APP-5:4 — Scenario Timeline History compatibility validator.
 */

import { SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import { mapTimelineEventToFoundationContract, validateTimelineEvent } from "./scenarioTimelineEventValidator.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineLifecycleConstants.ts";
import type { ScenarioTimelineLifecycle } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult } from "./scenarioTimelineHistoryTypes.ts";
import { SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import { validateTimelineEventContractShape } from "./scenarioTimelinePlatformValidation.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateHistoryEventCompatibility(events: readonly ScenarioTimelineEvent[]): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  for (const event of events) {
    if (event.platformVersion !== SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION) {
      issues.push(
        issue(
          "app5_2_incompatible",
          `Event ${event.eventId} platformVersion must be ${SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION}.`,
          "platformVersion"
        )
      );
    }

    const eventValidation = validateTimelineEvent(event);
    if (!eventValidation.valid) {
      issues.push(...eventValidation.issues);
    }

    const foundationContract = mapTimelineEventToFoundationContract(event);
    const foundationValidation = validateTimelineEventContractShape(foundationContract);
    if (!foundationValidation.valid) {
      issues.push(...foundationValidation.issues.map((entry) => issue(`app5_1_${entry.code}`, entry.message, entry.field)));
    }
    if (foundationContract.contractVersion !== SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION) {
      issues.push(
        issue(
          "app5_1_incompatible",
          `Event ${event.eventId} foundation contractVersion must be ${SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION}.`,
          "contractVersion"
        )
      );
    }
  }

  return result(issues);
}

export function validateHistoryLifecycleCompatibility(
  events: readonly ScenarioTimelineEvent[],
  lifecycle: ScenarioTimelineLifecycle | undefined
): ScenarioTimelineValidationResult {
  if (!lifecycle) {
    return result([]);
  }

  const issues: ScenarioTimelineValidationIssue[] = [];

  if (lifecycle.platformVersion !== SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(
      issue(
        "app5_3_incompatible",
        `Lifecycle platformVersion must be ${SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION}.`,
        "platformVersion"
      )
    );
  }

  if (lifecycle.readOnly !== true) {
    issues.push(issue("app5_3_incompatible", "Lifecycle must be read-only.", "readOnly"));
  }

  const firstEvent = events[0];
  if (firstEvent && firstEvent.scenarioId !== lifecycle.scenarioId) {
    issues.push(issue("lifecycle_mismatch", "Lifecycle scenarioId does not match events.", "scenarioId"));
  }
  if (firstEvent && firstEvent.workspaceId !== lifecycle.workspaceId) {
    issues.push(issue("lifecycle_mismatch", "Lifecycle workspaceId does not match events.", "workspaceId"));
  }

  const lastEvent = events.at(-1);
  if (lastEvent && lifecycle.lastEventId && lifecycle.lastEventId !== lastEvent.eventId) {
    issues.push(issue("lifecycle_mismatch", "Lifecycle lastEventId does not match latest history event.", "lastEventId"));
  }

  if (lifecycle.currentStage && lastEvent && lifecycle.currentStage !== lastEvent.stage && lifecycle.validationResult.valid) {
    issues.push(
      issue(
        "stage_inconsistency",
        `Lifecycle currentStage ${lifecycle.currentStage} differs from latest event stage ${lastEvent.stage}.`,
        "currentStage"
      )
    );
  }

  return result(issues);
}

export const ScenarioTimelineHistoryCompatibility = Object.freeze({
  validateHistoryEventCompatibility,
  validateHistoryLifecycleCompatibility,
});
