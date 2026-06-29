/**
 * APP-5:3 — Scenario Timeline Lifecycle transition rules.
 */

import {
  SCENARIO_TIMELINE_LIFECYCLE_INITIAL_STAGE,
  SCENARIO_TIMELINE_LIFECYCLE_REPEATABLE_STAGES,
  SCENARIO_TIMELINE_LIFECYCLE_SINGLE_OCCURRENCE_STAGES,
  SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE,
} from "./scenarioTimelineLifecycleConstants.ts";
import type { ScenarioLifecycleTransitionValidation } from "./scenarioTimelineLifecycleTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";
import { isScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformValidation.ts";

export function getLifecycleStageIndex(stage: ScenarioTimelineLifecycleStage): number {
  return (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).indexOf(stage);
}

export function getNextLifecycleStage(
  stage: ScenarioTimelineLifecycleStage
): ScenarioTimelineLifecycleStage | null {
  const index = getLifecycleStageIndex(stage);
  if (index < 0 || index >= SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length - 1) {
    return null;
  }
  return SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS[index + 1] as ScenarioTimelineLifecycleStage;
}

export function isRepeatableLifecycleStage(stage: ScenarioTimelineLifecycleStage): boolean {
  return (SCENARIO_TIMELINE_LIFECYCLE_REPEATABLE_STAGES as readonly string[]).includes(stage);
}

export function isSingleOccurrenceLifecycleStage(stage: ScenarioTimelineLifecycleStage): boolean {
  return (SCENARIO_TIMELINE_LIFECYCLE_SINGLE_OCCURRENCE_STAGES as readonly string[]).includes(stage);
}

export function isTerminalLifecycleStage(stage: ScenarioTimelineLifecycleStage): boolean {
  return stage === SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE;
}

export function validateScenarioTransition(
  fromStage: ScenarioTimelineLifecycleStage | null,
  toStage: ScenarioTimelineLifecycleStage,
  options?: Readonly<{ stageOccurrences?: Readonly<Record<string, number>> }>
): ScenarioLifecycleTransitionValidation {
  if (!isScenarioTimelineLifecycleStage(toStage)) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: "Target stage is not in the frozen lifecycle vocabulary.",
      readOnly: true as const,
    });
  }

  if (fromStage === null) {
    const valid = toStage === SCENARIO_TIMELINE_LIFECYCLE_INITIAL_STAGE;
    return Object.freeze({
      valid,
      fromStage,
      toStage,
      reason: valid
        ? "Initial lifecycle transition is valid."
        : "Lifecycle must begin with scenario_created.",
      readOnly: true as const,
    });
  }

  if (!isScenarioTimelineLifecycleStage(fromStage)) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: "Source stage is not in the frozen lifecycle vocabulary.",
      readOnly: true as const,
    });
  }

  if (isTerminalLifecycleStage(fromStage) && toStage !== fromStage) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: "Terminal stage lessons_learned cannot transition forward.",
      readOnly: true as const,
    });
  }

  const fromIndex = getLifecycleStageIndex(fromStage);
  const toIndex = getLifecycleStageIndex(toStage);

  if (toIndex < fromIndex) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: "Lifecycle cannot transition backwards.",
      readOnly: true as const,
    });
  }

  if (toIndex > fromIndex + 1) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: "Lifecycle cannot skip required stages.",
      readOnly: true as const,
    });
  }

  if (toIndex === fromIndex && !isRepeatableLifecycleStage(toStage)) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: `Stage ${toStage} does not allow duplicate transitions.`,
      readOnly: true as const,
    });
  }

  const occurrences = options?.stageOccurrences?.[toStage] ?? 0;
  if (isSingleOccurrenceLifecycleStage(toStage) && occurrences > 0 && toIndex === fromIndex) {
    return Object.freeze({
      valid: false,
      fromStage,
      toStage,
      reason: `Duplicate stage ${toStage} is not allowed.`,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    valid: true,
    fromStage,
    toStage,
    reason: "Lifecycle transition is valid.",
    readOnly: true as const,
  });
}

export const ScenarioTimelineLifecycleTransitions = Object.freeze({
  getLifecycleStageIndex,
  getNextLifecycleStage,
  isRepeatableLifecycleStage,
  isSingleOccurrenceLifecycleStage,
  isTerminalLifecycleStage,
  validateScenarioTransition,
});
