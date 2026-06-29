/**
 * APP-5:4 — Scenario Timeline History registry.
 * In-memory derived history cache — no persistence.
 */

import { SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION, SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS } from "./scenarioTimelineHistoryConstants.ts";
import { historyFailure, historySuccess } from "./scenarioTimelineHistoryErrors.ts";
import type {
  ScenarioTimelineHistory,
  ScenarioTimelineHistoryRegistrySnapshot,
  ScenarioTimelineHistoryResult,
  ScenarioTimelineHistorySummary,
} from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineScenarioId } from "./scenarioTimelinePlatformTypes.ts";

const historyRegistry = new Map<string, ScenarioTimelineHistory>();

export function resetScenarioTimelineHistoryRegistryForTests(): void {
  historyRegistry.clear();
}

export function registerScenarioHistory(history: ScenarioTimelineHistory): ScenarioTimelineHistoryResult<ScenarioTimelineHistory> {
  if (historyRegistry.size >= SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS.maxRegisteredHistories) {
    return historyFailure("History registry is full.");
  }

  historyRegistry.set(history.historyId, history);
  historyRegistry.set(history.scenarioId, history);
  return historySuccess("Scenario history registered.", history);
}

export function getScenarioHistory(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineHistory | null {
  return historyRegistry.get(scenarioId) ?? null;
}

export function getScenarioHistoryById(historyId: string): ScenarioTimelineHistory | null {
  return historyRegistry.get(historyId) ?? null;
}

export function getScenarioHistorySummary(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineHistorySummary | null {
  return historyRegistry.get(scenarioId)?.historySummary ?? null;
}

export function getScenarioHistoryMilestones(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineHistory["milestones"] {
  return historyRegistry.get(scenarioId)?.milestones ?? Object.freeze([]);
}

export function getScenarioHistoryDuration(scenarioId: ScenarioTimelineScenarioId): number {
  return historyRegistry.get(scenarioId)?.duration ?? 0;
}

export function getScenarioHistoryRegistry(): ScenarioTimelineHistoryRegistrySnapshot {
  const histories = [...new Set(historyRegistry.values())];
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
    registeredHistoryCount: histories.length,
    historyIds: Object.freeze(histories.map((entry) => entry.historyId)),
    scenarioIds: Object.freeze(histories.map((entry) => entry.scenarioId)),
    readOnly: true as const,
  });
}

export const ScenarioTimelineHistoryRegistry = Object.freeze({
  registerScenarioHistory,
  getScenarioHistory,
  getScenarioHistorySummary,
  getScenarioHistoryMilestones,
  getScenarioHistoryDuration,
  getScenarioHistoryRegistry,
});
