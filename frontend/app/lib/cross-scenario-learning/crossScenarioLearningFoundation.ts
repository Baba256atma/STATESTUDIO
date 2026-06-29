/**
 * APP-10:1 — Cross-Scenario Learning Platform foundation.
 */

import {
  CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import {
  getCrossScenarioLearningRegistrySnapshot,
  listLearningSessionIds,
  seedDefaultCrossScenarioLearningRegistry,
} from "./crossScenarioLearningRegistry.ts";
import type {
  CrossScenarioLearningPlatformResult,
  CrossScenarioLearningPlatformState,
} from "./crossScenarioLearningTypes.ts";

export const CROSS_SCENARIO_LEARNING_FOUNDATION_VERSION = "APP-10/1" as const;
export const CROSS_SCENARIO_LEARNING_FOUNDATION_OWNER = "cross-scenario-learning-platform-foundation" as const;

export const CROSS_SCENARIO_LEARNING_FOUNDATION_TAGS = Object.freeze([
  "[APP10_1]",
  "[CROSS_SCENARIO_LEARNING_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_ML]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): CrossScenarioLearningPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetCrossScenarioLearningFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isCrossScenarioLearningReady(): boolean {
  return platformInitialized;
}

export function isCrossScenarioLearningPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getCrossScenarioLearningPlatformState(
  timestamp: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformState {
  const snapshot = getCrossScenarioLearningRegistrySnapshot();
  return Object.freeze({
    platformId: "cross-scenario-learning-platform",
    foundationVersion: CROSS_SCENARIO_LEARNING_FOUNDATION_VERSION,
    contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    sessionCount: snapshot.sessionCount,
    registeredSessionIds: listLearningSessionIds(),
    supportedSourceTypes: CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
    supportedSessionStatuses: CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS,
    supportedCandidateStatuses: CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function getCrossScenarioLearning(
  timestamp: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformState {
  return getCrossScenarioLearningPlatformState(timestamp);
}

export function buildCrossScenarioLearningFoundation(
  timestamp: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformResult<CrossScenarioLearningPlatformState> {
  seedDefaultCrossScenarioLearningRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(
    true,
    "Cross-Scenario Learning platform foundation created.",
    getCrossScenarioLearningPlatformState(timestamp)
  );
}

export function createCrossScenarioLearningFoundation(
  timestamp: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformResult<CrossScenarioLearningPlatformState> {
  return buildCrossScenarioLearningFoundation(timestamp);
}

export function getCrossScenarioLearningFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof CROSS_SCENARIO_LEARNING_FOUNDATION_VERSION;
  contractVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  owner: typeof CROSS_SCENARIO_LEARNING_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: CROSS_SCENARIO_LEARNING_FOUNDATION_VERSION,
    contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    owner: CROSS_SCENARIO_LEARNING_FOUNDATION_OWNER,
  });
}

export const CrossScenarioLearningFoundation = Object.freeze({
  buildCrossScenarioLearningFoundation,
  createCrossScenarioLearningFoundation,
  getCrossScenarioLearning,
  getCrossScenarioLearningPlatformState,
  isCrossScenarioLearningReady,
  isCrossScenarioLearningPlatformInitialized,
  getCrossScenarioLearningFoundationVersionMetadata,
  resetCrossScenarioLearningFoundationForTests,
  version: CROSS_SCENARIO_LEARNING_FOUNDATION_VERSION,
  tags: CROSS_SCENARIO_LEARNING_FOUNDATION_TAGS,
});
