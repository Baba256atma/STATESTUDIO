/**
 * APP-5:3 — Scenario Timeline Lifecycle builder and summary builder.
 */

import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineLifecycleConstants.ts";
import { deriveLifecycleMetrics } from "./scenarioTimelineLifecycleCalculator.ts";
import type {
  BuildScenarioLifecycleInput,
  ScenarioTimelineLifecycle,
  ScenarioTimelineLifecycleSummary,
} from "./scenarioTimelineLifecycleTypes.ts";
import { analyzeTimelineEventsForLifecycle } from "./scenarioTimelineLifecycleValidator.ts";

export function buildScenarioLifecycleSummary(
  lifecycle: ScenarioTimelineLifecycle,
  eventCount: number
): ScenarioTimelineLifecycleSummary {
  return Object.freeze({
    scenarioId: lifecycle.scenarioId,
    workspaceId: lifecycle.workspaceId,
    currentStage: lifecycle.currentStage,
    progressPercentage: lifecycle.progressPercentage,
    status: lifecycle.status,
    isCompleted: lifecycle.isCompleted,
    isBlocked: lifecycle.isBlocked,
    eventCount,
    readOnly: true as const,
  });
}

export function buildScenarioLifecycle(input: BuildScenarioLifecycleInput): ScenarioTimelineLifecycle {
  const analysis = analyzeTimelineEventsForLifecycle(input.events);
  const firstEvent = analysis.sortedEvents[0] ?? null;
  const metrics = deriveLifecycleMetrics(analysis);

  return Object.freeze({
    scenarioId: firstEvent?.scenarioId ?? input.events[0]?.scenarioId ?? "unknown-scenario",
    workspaceId: firstEvent?.workspaceId ?? input.events[0]?.workspaceId ?? "unknown-workspace",
    currentStage: metrics.currentStage,
    completedStages: metrics.completedStages,
    remainingStages: metrics.remainingStages,
    progressPercentage: metrics.progressPercentage,
    status: metrics.status,
    lastEventId: metrics.lastEventId,
    lastTimestamp: metrics.lastTimestamp,
    transitionHistory: analysis.transitionHistory,
    isCompleted: metrics.isCompleted,
    isBlocked: metrics.isBlocked,
    validationResult: analysis.validationResult,
    platformVersion: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    readOnly: true as const,
  });
}

export function validateScenarioLifecycle(lifecycle: ScenarioTimelineLifecycle): Readonly<{
  valid: boolean;
  issues: readonly { code: string; message: string; field?: string; readOnly: true }[];
  readOnly: true;
}> {
  const issues: { code: string; message: string; field?: string; readOnly: true }[] = [];

  if (lifecycle.readOnly !== true) {
    issues.push(Object.freeze({ code: "contract_violation", message: "Lifecycle must be read-only.", readOnly: true as const }));
  }
  if (lifecycle.platformVersion !== SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(Object.freeze({ code: "invalid_platform_version", message: "Invalid platformVersion.", field: "platformVersion", readOnly: true as const }));
  }
  if (lifecycle.progressPercentage < 0 || lifecycle.progressPercentage > 100) {
    issues.push(Object.freeze({ code: "invalid_progress", message: "progressPercentage must be between 0 and 100.", field: "progressPercentage", readOnly: true as const }));
  }
  if (lifecycle.isCompleted && lifecycle.currentStage !== "lessons_learned") {
    issues.push(Object.freeze({ code: "completion_mismatch", message: "Completed lifecycle must end at lessons_learned.", field: "isCompleted", readOnly: true as const }));
  }
  if (lifecycle.isBlocked && lifecycle.validationResult.valid) {
    issues.push(Object.freeze({ code: "blocked_mismatch", message: "Blocked lifecycle must have validation issues.", field: "isBlocked", readOnly: true as const }));
  }

  return Object.freeze({
    valid: issues.length === 0 && lifecycle.validationResult.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const ScenarioTimelineLifecycleBuilder = Object.freeze({
  buildScenarioLifecycle,
  buildScenarioLifecycleSummary,
  validateScenarioLifecycle,
});
