/**
 * APP-5:4 — Scenario Timeline History builder.
 */

import { SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineHistoryConstants.ts";
import { createScenarioHistoryId, calculateHistoryBounds } from "./scenarioTimelineHistoryCalculator.ts";
import {
  buildHistoryStageGroups,
  groupHistoryEvents,
  orderTimelineEventsForHistory,
} from "./scenarioTimelineHistoryGrouping.ts";
import { detectHistoryMilestones } from "./scenarioTimelineHistoryMilestones.ts";
import { buildScenarioHistorySummary } from "./scenarioTimelineHistorySummary.ts";
import {
  validateScenarioHistoryEvents,
  validateScenarioHistoryShape,
} from "./scenarioTimelineHistoryValidator.ts";
import type {
  BuildScenarioHistoryInput,
  ScenarioTimelineHistory,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelineHistoryTypes.ts";

export function buildScenarioHistory(input: BuildScenarioHistoryInput): ScenarioTimelineHistory {
  const orderedEvents = orderTimelineEventsForHistory(input.events);
  const validationResult = validateScenarioHistoryEvents(input.events, input.lifecycle);
  const bounds = calculateHistoryBounds(orderedEvents);
  const milestones = detectHistoryMilestones(orderedEvents);
  const stageGroups = buildHistoryStageGroups(orderedEvents);
  const groups = groupHistoryEvents(orderedEvents);

  const scenarioId = orderedEvents[0]?.scenarioId ?? input.events[0]?.scenarioId ?? "unknown-scenario";
  const workspaceId = orderedEvents[0]?.workspaceId ?? input.events[0]?.workspaceId ?? "unknown-workspace";
  const historyId = createScenarioHistoryId(scenarioId, workspaceId);

  const historySummary = buildScenarioHistorySummary({
    historyId,
    scenarioId,
    workspaceId,
    orderedEvents,
    milestones,
    latestStage: bounds.latestStage,
    latestEventId: bounds.latestEventId,
    historyStart: bounds.historyStart,
    historyEnd: bounds.historyEnd,
  });

  const history = Object.freeze({
    scenarioId,
    workspaceId,
    historyId,
    events: Object.freeze([...input.events]),
    orderedEvents,
    milestones,
    historySummary,
    historyStart: bounds.historyStart,
    historyEnd: bounds.historyEnd,
    duration: bounds.duration,
    eventCount: orderedEvents.length,
    stageGroups,
    groups,
    latestStage: bounds.latestStage,
    latestEventId: bounds.latestEventId,
    timelineVersion: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
    validationResult,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    readOnly: true as const,
  });

  return history;
}

export function validateScenarioHistory(history: ScenarioTimelineHistory): ScenarioTimelineValidationResult {
  const shapeValidation = validateScenarioHistoryShape(history);
  const eventValidation = validateScenarioHistoryEvents(history.events);
  const issues = [...shapeValidation.issues, ...eventValidation.issues];

  if (history.timelineVersion !== SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_platform_version",
        message: "Invalid timelineVersion.",
        field: "timelineVersion",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const ScenarioTimelineHistoryBuilder = Object.freeze({
  buildScenarioHistory,
  validateScenarioHistory,
});
