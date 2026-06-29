/**
 * APP-5:6 — Scenario Timeline API canonical source adapter.
 * Imports only APP-5:1 through APP-5:5 public engine entry points.
 */

import {
  getScenarioTimelineFoundationVersionMetadata,
  initializeScenarioTimelinePlatform,
  isScenarioTimelinePlatformInitialized,
  validateScenarioTimelinePlatform,
} from "./scenarioTimelinePlatform.ts";
import {
  createTimelineEvent,
  getTimelineEventContract,
  getTimelineEventRegistry,
  initializeScenarioTimelineEventEngine,
  isScenarioTimelineEventEngineInitialized,
  validateTimelineEvent,
} from "./scenarioTimelineEventEngine.ts";
import {
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  getLifecycleRegistry,
  getScenarioCurrentStage,
  getScenarioLifecycleContract,
  getScenarioProgress,
  getScenarioStatus,
  initializeScenarioTimelineLifecycleEngine,
  isScenarioTimelineLifecycleEngineInitialized,
  validateScenarioLifecycle,
} from "./scenarioTimelineLifecycleEngine.ts";
import {
  calculateScenarioHistory,
  getScenarioHistory,
  getScenarioHistoryContract,
  getScenarioHistoryDuration,
  getScenarioHistoryMilestones,
  getScenarioHistoryRegistry,
  getScenarioHistorySummary,
  initializeScenarioTimelineHistoryEngine,
  isScenarioTimelineHistoryEngineInitialized,
  validateScenarioHistory,
} from "./scenarioTimelineHistoryEngine.ts";
import {
  getTimelineQueryContract,
  getTimelineQueryRegistry,
  initializeScenarioTimelineQueryEngine,
  isScenarioTimelineQueryEngineInitialized,
  queryScenarioTimeline,
  queryTimelineEvents,
  queryTimelineHistory,
  queryTimelineLifecycle,
  queryTimelineMilestones,
  queryTimelineProgress,
  queryTimelineStatus,
  queryTimelineSummary,
  validateTimelineQuery,
} from "./scenarioTimelineQueryEngine.ts";
import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
} from "./scenarioTimelineEventConstants.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
} from "./scenarioTimelineLifecycleConstants.ts";
import {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
} from "./scenarioTimelineHistoryConstants.ts";
import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
} from "./scenarioTimelineQueryConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineApiDiagnostics } from "./scenarioTimelineApiTypes.ts";

export function readScenarioTimelineApiDiagnostics(): ScenarioTimelineApiDiagnostics {
  return Object.freeze({
    foundationReady: isScenarioTimelinePlatformInitialized(),
    eventEngineReady: isScenarioTimelineEventEngineInitialized(),
    lifecycleEngineReady: isScenarioTimelineLifecycleEngineInitialized(),
    historyEngineReady: isScenarioTimelineHistoryEngineInitialized(),
    queryEngineReady: isScenarioTimelineQueryEngineInitialized(),
    readOnly: true as const,
  });
}

export function areScenarioTimelineApiEnginesReady(): boolean {
  const diagnostics = readScenarioTimelineApiDiagnostics();
  return (
    diagnostics.foundationReady &&
    diagnostics.eventEngineReady &&
    diagnostics.lifecycleEngineReady &&
    diagnostics.historyEngineReady &&
    diagnostics.queryEngineReady
  );
}

export function initializeScenarioTimelineApiEngines(timestamp: string): ScenarioTimelineApiDiagnostics {
  initializeScenarioTimelinePlatform(timestamp);
  initializeScenarioTimelineEventEngine(timestamp);
  initializeScenarioTimelineLifecycleEngine(timestamp);
  initializeScenarioTimelineHistoryEngine(timestamp);
  initializeScenarioTimelineQueryEngine(timestamp);
  return readScenarioTimelineApiDiagnostics();
}

export const ScenarioTimelineApiSources = Object.freeze({
  initializeScenarioTimelinePlatform,
  initializeScenarioTimelineEventEngine,
  initializeScenarioTimelineLifecycleEngine,
  initializeScenarioTimelineHistoryEngine,
  initializeScenarioTimelineQueryEngine,
  readScenarioTimelineApiDiagnostics,
  areScenarioTimelineApiEnginesReady,
  initializeScenarioTimelineApiEngines,
  createTimelineEvent,
  validateTimelineEvent,
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  validateScenarioLifecycle,
  calculateScenarioHistory,
  validateScenarioHistory,
  getScenarioHistory,
  getScenarioHistorySummary,
  getScenarioHistoryMilestones,
  getScenarioHistoryDuration,
  queryScenarioTimeline,
  queryTimelineEvents,
  queryTimelineHistory,
  queryTimelineLifecycle,
  queryTimelineMilestones,
  queryTimelineSummary,
  queryTimelineProgress,
  queryTimelineStatus,
  validateTimelineQuery,
  validateScenarioTimelinePlatform,
  getScenarioCurrentStage,
  getScenarioProgress,
  getScenarioStatus,
  getTimelineEventContract,
  getScenarioLifecycleContract,
  getScenarioHistoryContract,
  getTimelineQueryContract,
  getTimelineEventRegistry,
  getLifecycleRegistry,
  getScenarioHistoryRegistry,
  getTimelineQueryRegistry,
  getScenarioTimelineFoundationVersionMetadata,
  versions: Object.freeze({
    foundation: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    eventEngine: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
    lifecycleEngine: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    historyEngine: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
    queryEngine: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  }),
});

export {
  createTimelineEvent,
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  calculateScenarioHistory,
  getScenarioHistory,
  queryScenarioTimeline,
  validateScenarioTimelinePlatform,
};
