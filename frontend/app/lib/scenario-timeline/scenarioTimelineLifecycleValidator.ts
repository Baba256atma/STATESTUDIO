/**
 * APP-5:3 — Scenario Timeline Lifecycle event sequence validator.
 */

import { SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP } from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import { validateTimelineEvent } from "./scenarioTimelineEventValidator.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_INITIAL_STAGE,
  SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE,
} from "./scenarioTimelineLifecycleConstants.ts";
import {
  getLifecycleStageIndex,
  isTerminalLifecycleStage,
  validateScenarioTransition,
} from "./scenarioTimelineLifecycleTransitions.ts";
import type {
  ScenarioTimelineLifecycleTransitionRecord,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelineLifecycleTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export type ScenarioTimelineLifecycleEventAnalysis = Readonly<{
  sortedEvents: readonly ScenarioTimelineEvent[];
  transitionHistory: readonly ScenarioTimelineLifecycleTransitionRecord[];
  validationResult: ScenarioTimelineValidationResult;
  highestStageIndex: number;
  effectiveCurrentStage: ScenarioTimelineLifecycleStage | null;
  stageOccurrences: Readonly<Record<string, number>>;
  readOnly: true;
}>;

function sortTimelineEvents(events: readonly ScenarioTimelineEvent[]): ScenarioTimelineEvent[] {
  return [...events].sort((left, right) => {
    if (left.sequenceOrder !== right.sequenceOrder) {
      return left.sequenceOrder - right.sequenceOrder;
    }
    return Date.parse(left.timestamp) - Date.parse(right.timestamp);
  });
}

export function analyzeTimelineEventsForLifecycle(
  events: readonly ScenarioTimelineEvent[]
): ScenarioTimelineLifecycleEventAnalysis {
  const issues: ScenarioTimelineValidationIssue[] = [];
  const transitionHistory: ScenarioTimelineLifecycleTransitionRecord[] = [];
  const stageOccurrences: Record<string, number> = {};

  if (events.length === 0) {
    return Object.freeze({
      sortedEvents: Object.freeze([]),
      transitionHistory: Object.freeze([]),
      validationResult: result([issue("empty_events", "At least one timeline event is required.", "events")]),
      highestStageIndex: -1,
      effectiveCurrentStage: null,
      stageOccurrences: Object.freeze({}),
      readOnly: true as const,
    });
  }

  const scenarioId = events[0]?.scenarioId;
  const workspaceId = events[0]?.workspaceId;

  for (const event of events) {
    const eventValidation = validateTimelineEvent(event);
    if (!eventValidation.valid) {
      issues.push(...eventValidation.issues.map((entry) => issue(entry.code, entry.message, entry.field)));
    }
    if (event.scenarioId !== scenarioId) {
      issues.push(issue("identity_mismatch", "All events must share the same scenarioId.", "scenarioId"));
    }
    if (event.workspaceId !== workspaceId) {
      issues.push(issue("identity_mismatch", "All events must share the same workspaceId.", "workspaceId"));
    }

    const expectedEventType =
      SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP[event.stage as keyof typeof SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP];
    if (event.eventType !== expectedEventType && event.eventType !== "metadata_annotation" && event.eventType !== "custom") {
      issues.push(
        issue(
          "event_compatibility",
          `Event type ${event.eventType} is incompatible with stage ${event.stage}.`,
          "eventType"
        )
      );
    }
  }

  const sortedEvents = sortTimelineEvents(events);
  let currentStage: ScenarioTimelineLifecycleStage | null = null;
  let highestStageIndex = -1;

  for (const event of sortedEvents) {
    const transition = validateScenarioTransition(currentStage, event.stage, {
      stageOccurrences: Object.freeze({ ...stageOccurrences }),
    });

    transitionHistory.push(
      Object.freeze({
        fromStage: currentStage,
        toStage: event.stage,
        eventId: event.eventId,
        timestamp: event.timestamp,
        sequenceOrder: event.sequenceOrder,
        valid: transition.valid,
        readOnly: true as const,
      })
    );

    if (!transition.valid) {
      issues.push(issue("invalid_transition", transition.reason, "stage"));
    } else {
      currentStage = event.stage;
      const stageIndex = getLifecycleStageIndex(event.stage);
      highestStageIndex = Math.max(highestStageIndex, stageIndex);
      stageOccurrences[event.stage] = (stageOccurrences[event.stage] ?? 0) + 1;
    }
  }

  if (sortedEvents[0]?.stage !== SCENARIO_TIMELINE_LIFECYCLE_INITIAL_STAGE) {
    issues.push(
      issue(
        "missing_initial_stage",
        "Lifecycle must begin with scenario_created.",
        "stage"
      )
    );
  }

  if (highestStageIndex >= 0) {
    for (let index = 0; index < highestStageIndex; index += 1) {
      const requiredStage = SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS[index] as ScenarioTimelineLifecycleStage;
      if ((stageOccurrences[requiredStage] ?? 0) === 0) {
        issues.push(
          issue(
            "missing_required_stage",
            `Missing required lifecycle stage: ${requiredStage}.`,
            "stage"
          )
        );
      }
    }
  }

  const terminalReached = currentStage !== null && isTerminalLifecycleStage(currentStage);
  if (terminalReached && currentStage !== SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE) {
    issues.push(issue("terminal_stage_violation", "Terminal stage rules violated.", "stage"));
  }

  return Object.freeze({
    sortedEvents: Object.freeze(sortedEvents),
    transitionHistory: Object.freeze(transitionHistory),
    validationResult: result(issues),
    highestStageIndex,
    effectiveCurrentStage: currentStage,
    stageOccurrences: Object.freeze({ ...stageOccurrences }),
    readOnly: true as const,
  });
}

export function validateScenarioLifecycleEvents(events: readonly ScenarioTimelineEvent[]): ScenarioTimelineValidationResult {
  return analyzeTimelineEventsForLifecycle(events).validationResult;
}

export const ScenarioTimelineLifecycleValidator = Object.freeze({
  analyzeTimelineEventsForLifecycle,
  validateScenarioLifecycleEvents,
});
