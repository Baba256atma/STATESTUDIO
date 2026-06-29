/**
 * APP-5:3 — Scenario Timeline Lifecycle registry.
 * In-memory derived lifecycle cache — no persistence.
 */

import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_LIMITS,
} from "./scenarioTimelineLifecycleConstants.ts";
import { scenarioTimelineLifecycleEngineErrorFromCode } from "./scenarioTimelineLifecycleErrors.ts";
import type {
  ScenarioTimelineLifecycle,
  ScenarioTimelineLifecycleRegistrySnapshot,
  ScenarioTimelineLifecycleResult,
  ScenarioTimelineLifecycleSummary,
} from "./scenarioTimelineLifecycleTypes.ts";
import { buildScenarioLifecycleSummary } from "./scenarioTimelineLifecycleBuilder.ts";
import type { ScenarioTimelineScenarioId } from "./scenarioTimelinePlatformTypes.ts";

const lifecycleRegistry = new Map<ScenarioTimelineScenarioId, ScenarioTimelineLifecycle>();
const lifecycleEventCounts = new Map<ScenarioTimelineScenarioId, number>();

export function resetScenarioTimelineLifecycleRegistryForTests(): void {
  lifecycleRegistry.clear();
  lifecycleEventCounts.clear();
}

export function registerScenarioLifecycle(
  lifecycle: ScenarioTimelineLifecycle,
  eventCount: number
): ScenarioTimelineLifecycleResult<ScenarioTimelineLifecycle> {
  if (lifecycleRegistry.size >= SCENARIO_TIMELINE_LIFECYCLE_ENGINE_LIMITS.maxRegisteredLifecycles) {
    return Object.freeze({
      success: false,
      reason: "Lifecycle registry is full.",
      data: null,
      readOnly: true as const,
    });
  }

  lifecycleRegistry.set(lifecycle.scenarioId, lifecycle);
  lifecycleEventCounts.set(lifecycle.scenarioId, eventCount);
  return Object.freeze({
    success: true,
    reason: "Scenario lifecycle registered.",
    data: lifecycle,
    readOnly: true as const,
  });
}

export function getRegisteredScenarioLifecycle(
  scenarioId: ScenarioTimelineScenarioId
): ScenarioTimelineLifecycle | null {
  return lifecycleRegistry.get(scenarioId) ?? null;
}

export function getScenarioLifecycleSummary(
  scenarioId: ScenarioTimelineScenarioId
): ScenarioTimelineLifecycleSummary | null {
  const lifecycle = lifecycleRegistry.get(scenarioId);
  if (!lifecycle) {
    return null;
  }
  return buildScenarioLifecycleSummary(lifecycle, lifecycleEventCounts.get(scenarioId) ?? 0);
}

export function getLifecycleRegistry(): ScenarioTimelineLifecycleRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    registeredLifecycleCount: lifecycleRegistry.size,
    scenarioIds: Object.freeze([...lifecycleRegistry.keys()]),
    readOnly: true as const,
  });
}

export function getScenarioCurrentStage(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineLifecycle["currentStage"] {
  return lifecycleRegistry.get(scenarioId)?.currentStage ?? null;
}

export function getScenarioProgress(scenarioId: ScenarioTimelineScenarioId): number {
  return lifecycleRegistry.get(scenarioId)?.progressPercentage ?? 0;
}

export function getScenarioStatus(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineLifecycle["status"] {
  return lifecycleRegistry.get(scenarioId)?.status ?? "not_started";
}

export function requireRegisteredLifecycle(
  scenarioId: ScenarioTimelineScenarioId
): ScenarioTimelineLifecycleResult<ScenarioTimelineLifecycle> {
  const lifecycle = lifecycleRegistry.get(scenarioId);
  if (!lifecycle) {
    return Object.freeze({
      success: false,
      reason: `Lifecycle not found for scenario: ${scenarioId}.`,
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Lifecycle found.",
    data: lifecycle,
    readOnly: true as const,
  });
}

export { scenarioTimelineLifecycleEngineErrorFromCode };
