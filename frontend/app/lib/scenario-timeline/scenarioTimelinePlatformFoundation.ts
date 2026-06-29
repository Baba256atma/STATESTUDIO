/**
 * APP-5:1 — Scenario Timeline Platform foundation.
 * Platform initialization and state — metadata only.
 */

import {
  SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import {
  getTimelineRegistry,
  listTimelineTypeIds,
} from "./scenarioTimelinePlatformRegistry.ts";
import type {
  ScenarioTimelinePlatformResult,
  ScenarioTimelinePlatformState,
} from "./scenarioTimelinePlatformTypes.ts";

export const SCENARIO_TIMELINE_FOUNDATION_VERSION = "APP-5/1" as const;
export const SCENARIO_TIMELINE_FOUNDATION_OWNER = "scenario-timeline-platform-foundation" as const;

export const SCENARIO_TIMELINE_FOUNDATION_TAGS = Object.freeze([
  "[APP5_1]",
  "[SCENARIO_TIMELINE_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ScenarioTimelinePlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetScenarioTimelineFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isScenarioTimelinePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getScenarioTimelinePlatformState(
  timestamp: string = new Date(0).toISOString()
): ScenarioTimelinePlatformState {
  return Object.freeze({
    platformId: "scenario-timeline-platform",
    foundationVersion: SCENARIO_TIMELINE_FOUNDATION_VERSION,
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    timelineTypeCount: getTimelineRegistry().length,
    registeredTimelineTypeIds: listTimelineTypeIds(),
    supportedLifecycleStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
    supportedEventTypes: SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeScenarioTimelinePlatform(
  timestamp: string = new Date(0).toISOString()
): ScenarioTimelinePlatformResult<ScenarioTimelinePlatformState> {
  platformInitialized = true;
  lastInitializedAt = timestamp;
  const state = getScenarioTimelinePlatformState(timestamp);
  return createResult(true, "Scenario Timeline platform initialized.", state);
}

export function getScenarioTimelineFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof SCENARIO_TIMELINE_FOUNDATION_VERSION;
  contractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  owner: typeof SCENARIO_TIMELINE_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: SCENARIO_TIMELINE_FOUNDATION_VERSION,
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    owner: SCENARIO_TIMELINE_FOUNDATION_OWNER,
  });
}

export const ScenarioTimelinePlatformFoundation = Object.freeze({
  initializeScenarioTimelinePlatform,
  getScenarioTimelinePlatformState,
  isScenarioTimelinePlatformInitialized,
  getScenarioTimelineFoundationVersionMetadata,
  resetScenarioTimelineFoundationForTests,
  version: SCENARIO_TIMELINE_FOUNDATION_VERSION,
  tags: SCENARIO_TIMELINE_FOUNDATION_TAGS,
});
