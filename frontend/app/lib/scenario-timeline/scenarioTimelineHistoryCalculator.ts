/**
 * APP-5:4 — Scenario Timeline History calculator.
 */

import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import { calculateHistoryDurationMs } from "./scenarioTimelineHistorySummary.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export function createScenarioHistoryId(scenarioId: string, workspaceId: string): string {
  return `history-${workspaceId}-${scenarioId}`;
}

export function calculateHistoryBounds(orderedEvents: readonly ScenarioTimelineEvent[]): Readonly<{
  historyStart: string | null;
  historyEnd: string | null;
  duration: number;
  latestStage: ScenarioTimelineLifecycleStage | null;
  latestEventId: string | null;
  readOnly: true;
}> {
  const first = orderedEvents[0] ?? null;
  const last = orderedEvents.at(-1) ?? null;
  const historyStart = first?.timestamp ?? null;
  const historyEnd = last?.timestamp ?? null;

  return Object.freeze({
    historyStart,
    historyEnd,
    duration: calculateHistoryDurationMs(historyStart, historyEnd),
    latestStage: last?.stage ?? null,
    latestEventId: last?.eventId ?? null,
    readOnly: true as const,
  });
}

export const ScenarioTimelineHistoryCalculator = Object.freeze({
  createScenarioHistoryId,
  calculateHistoryBounds,
});
