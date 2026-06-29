/**
 * APP-5:3 — Scenario Timeline Lifecycle compatibility validator.
 */

import { SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import { mapTimelineEventToFoundationContract, validateTimelineEvent } from "./scenarioTimelineEventValidator.ts";
import type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult } from "./scenarioTimelineLifecycleTypes.ts";
import { SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import { validateTimelineEventContractShape } from "./scenarioTimelinePlatformValidation.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateLifecycleEventCompatibility(events: readonly ScenarioTimelineEvent[]): ScenarioTimelineValidationResult {
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

export const ScenarioTimelineLifecycleCompatibility = Object.freeze({
  validateLifecycleEventCompatibility,
});
