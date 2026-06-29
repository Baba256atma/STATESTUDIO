/**
 * APP-5:3 — Scenario Timeline Lifecycle calculator.
 */

import {
  SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS,
  SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE,
} from "./scenarioTimelineLifecycleConstants.ts";
import type { ScenarioTimelineLifecycleEventAnalysis } from "./scenarioTimelineLifecycleValidator.ts";
import { getLifecycleStageIndex, isTerminalLifecycleStage } from "./scenarioTimelineLifecycleTransitions.ts";
import type { ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export function computeCompletedStages(
  stageOccurrences: Readonly<Record<string, number>>,
  highestStageIndex: number
): readonly ScenarioTimelineLifecycleStage[] {
  if (highestStageIndex < 0) {
    return Object.freeze([]);
  }

  const completed: ScenarioTimelineLifecycleStage[] = [];
  for (let index = 0; index <= highestStageIndex; index += 1) {
    const stage = SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS[index] as ScenarioTimelineLifecycleStage;
    if ((stageOccurrences[stage] ?? 0) > 0) {
      completed.push(stage);
    }
  }
  return Object.freeze(completed);
}

export function computeRemainingStages(currentStage: ScenarioTimelineLifecycleStage | null): readonly ScenarioTimelineLifecycleStage[] {
  if (currentStage === null) {
    return Object.freeze([...(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[])]);
  }

  const currentIndex = getLifecycleStageIndex(currentStage);
  if (currentIndex < 0) {
    return Object.freeze([...(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[])]);
  }

  return Object.freeze(
    SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.slice(currentIndex + 1) as ScenarioTimelineLifecycleStage[]
  );
}

export function computeLifecycleProgress(completedStages: readonly ScenarioTimelineLifecycleStage[]): number {
  const total = SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length;
  if (total === 0) {
    return 0;
  }
  return Math.round((completedStages.length / total) * 100);
}

export function computeLifecycleStatus(input: {
  currentStage: ScenarioTimelineLifecycleStage | null;
  validationValid: boolean;
  eventCount: number;
}): ScenarioTimelineLifecycleStatus {
  if (input.eventCount === 0) {
    return "not_started";
  }
  if (!input.validationValid) {
    return "blocked";
  }
  if (input.currentStage !== null && isTerminalLifecycleStage(input.currentStage)) {
    return "completed";
  }
  return "in_progress";
}

export function deriveLifecycleMetrics(analysis: ScenarioTimelineLifecycleEventAnalysis): Readonly<{
  currentStage: ScenarioTimelineLifecycleStage | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  progressPercentage: number;
  status: ScenarioTimelineLifecycleStatus;
  lastEventId: string | null;
  lastTimestamp: string | null;
  isCompleted: boolean;
  isBlocked: boolean;
  readOnly: true;
}> {
  const lastEvent = analysis.sortedEvents.at(-1) ?? null;
  const currentStage = analysis.effectiveCurrentStage;
  const completedStages = computeCompletedStages(analysis.stageOccurrences, analysis.highestStageIndex);
  const remainingStages = computeRemainingStages(currentStage);
  const progressPercentage = computeLifecycleProgress(completedStages);
  const validationValid = analysis.validationResult.valid;
  const status = computeLifecycleStatus({
    currentStage,
    validationValid,
    eventCount: analysis.sortedEvents.length,
  });

  return Object.freeze({
    currentStage,
    completedStages,
    remainingStages,
    progressPercentage,
    status,
    lastEventId: lastEvent?.eventId ?? null,
    lastTimestamp: lastEvent?.timestamp ?? null,
    isCompleted: currentStage === SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE && validationValid,
    isBlocked: status === "blocked",
    readOnly: true as const,
  });
}

export const ScenarioTimelineLifecycleCalculator = Object.freeze({
  computeCompletedStages,
  computeRemainingStages,
  computeLifecycleProgress,
  computeLifecycleStatus,
  deriveLifecycleMetrics,
  supportedStatuses: SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS,
});
