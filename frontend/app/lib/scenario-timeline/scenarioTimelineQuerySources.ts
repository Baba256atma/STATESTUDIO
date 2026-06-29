/**
 * APP-5:5 — Scenario Timeline Query canonical source adapter.
 * Read-only facade over APP-5:2, APP-5:3, and APP-5:4 public APIs only.
 */

import {
  getTimelineEventRegistry,
  isScenarioTimelineEventEngineInitialized,
} from "./scenarioTimelineEventEngine.ts";
import {
  buildScenarioLifecycle,
  getLifecycleRegistry,
  getScenarioCurrentStage,
  getScenarioProgress,
  getScenarioStatus,
  isScenarioTimelineLifecycleEngineInitialized,
} from "./scenarioTimelineLifecycleEngine.ts";
import {
  getScenarioHistory,
  getScenarioHistoryDuration,
  getScenarioHistoryMilestones,
  getScenarioHistoryRegistry,
  getScenarioHistorySummary,
  isScenarioTimelineHistoryEngineInitialized,
} from "./scenarioTimelineHistoryEngine.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistory } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycle } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineScenarioId, ScenarioTimelineWorkspaceId } from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineQuerySourceContext = Readonly<{
  history: ScenarioTimelineHistory | null;
  lifecycle: ScenarioTimelineLifecycle | null;
  events: readonly ScenarioTimelineEvent[];
  eventRegistrySnapshot: ReturnType<typeof getTimelineEventRegistry>;
  lifecycleRegistrySnapshot: ReturnType<typeof getLifecycleRegistry>;
  historyRegistrySnapshot: ReturnType<typeof getScenarioHistoryRegistry>;
  readOnly: true;
}>;

export function areTimelineQuerySourcesReady(): boolean {
  return (
    isScenarioTimelineEventEngineInitialized() &&
    isScenarioTimelineLifecycleEngineInitialized() &&
    isScenarioTimelineHistoryEngineInitialized()
  );
}

export function resolveLifecycleForScenario(
  scenarioId: ScenarioTimelineScenarioId,
  events: readonly ScenarioTimelineEvent[]
): ScenarioTimelineLifecycle | null {
  if (events.length === 0) {
    return null;
  }
  return buildScenarioLifecycle({ events });
}

export function resolveHistoryForScenario(scenarioId: ScenarioTimelineScenarioId): ScenarioTimelineHistory | null {
  return getScenarioHistory(scenarioId);
}

export function resolveHistoryByHistoryId(historyId: string): ScenarioTimelineHistory | null {
  for (const scenarioId of getScenarioHistoryRegistry().scenarioIds) {
    const history = getScenarioHistory(scenarioId);
    if (history?.historyId === historyId) {
      return history;
    }
  }
  return null;
}

export function resolveEventById(eventId: string): ScenarioTimelineEvent | null {
  for (const scenarioId of getScenarioHistoryRegistry().scenarioIds) {
    const history = getScenarioHistory(scenarioId);
    const match = history?.orderedEvents.find((event) => event.eventId === eventId);
    if (match) {
      return match;
    }
  }
  return null;
}

export function resolveScenarioIdsForWorkspace(workspaceId: ScenarioTimelineWorkspaceId): readonly ScenarioTimelineScenarioId[] {
  return Object.freeze(
    getScenarioHistoryRegistry().scenarioIds.filter((scenarioId) => getScenarioHistory(scenarioId)?.workspaceId === workspaceId)
  );
}

export function resolveQuerySourceContext(input: {
  scenarioId?: ScenarioTimelineScenarioId;
  historyId?: string;
  eventId?: string;
}): ScenarioTimelineQuerySourceContext {
  let history: ScenarioTimelineHistory | null = null;

  if (input.historyId) {
    history = resolveHistoryByHistoryId(input.historyId);
  } else if (input.eventId) {
    const event = resolveEventById(input.eventId);
    history = event ? getScenarioHistory(event.scenarioId) : null;
  } else if (input.scenarioId) {
    history = resolveHistoryForScenario(input.scenarioId);
  }

  const events = history?.orderedEvents ?? Object.freeze([]);
  const scenarioId = history?.scenarioId ?? input.scenarioId ?? null;
  const lifecycle = scenarioId ? resolveLifecycleForScenario(scenarioId, events) : null;

  return Object.freeze({
    history,
    lifecycle,
    events,
    eventRegistrySnapshot: getTimelineEventRegistry(),
    lifecycleRegistrySnapshot: getLifecycleRegistry(),
    historyRegistrySnapshot: getScenarioHistoryRegistry(),
    readOnly: true as const,
  });
}

export const ScenarioTimelineQuerySources = Object.freeze({
  areTimelineQuerySourcesReady,
  resolveHistoryForScenario,
  resolveHistoryByHistoryId,
  resolveEventById,
  resolveScenarioIdsForWorkspace,
  resolveQuerySourceContext,
  resolveLifecycleForScenario,
  readScenarioProgress: getScenarioProgress,
  readScenarioStatus: getScenarioStatus,
  readScenarioCurrentStage: getScenarioCurrentStage,
  readScenarioHistorySummary: getScenarioHistorySummary,
  readScenarioHistoryMilestones: getScenarioHistoryMilestones,
  readScenarioHistoryDuration: getScenarioHistoryDuration,
});
