/**
 * APP-6:1 — Decision Timeline Platform foundation.
 * Platform initialization and state — metadata only.
 */

import {
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_EVENT_TYPE_KEYS,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_SOURCE_KEYS,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";
import {
  getDecisionTimelineRegistrySnapshot,
  listDecisionTypeIds,
  seedDefaultDecisionRegistry,
} from "./decisionTimelineRegistry.ts";
import type { DecisionPlatformResult, DecisionPlatformState } from "./decisionTimelineTypes.ts";

export const DECISION_TIMELINE_FOUNDATION_VERSION = "APP-6/1" as const;
export const DECISION_TIMELINE_FOUNDATION_OWNER = "decision-timeline-platform-foundation" as const;

export const DECISION_TIMELINE_FOUNDATION_TAGS = Object.freeze([
  "[APP6_1]",
  "[DECISION_TIMELINE_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NO_ANALYTICS]",
  "[NO_REPLAY]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): DecisionPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetDecisionTimelineFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isDecisionTimelinePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getDecisionTimelinePlatformState(
  timestamp: string = new Date(0).toISOString()
): DecisionPlatformState {
  return Object.freeze({
    platformId: "decision-timeline-platform",
    foundationVersion: DECISION_TIMELINE_FOUNDATION_VERSION,
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    decisionTypeCount: getDecisionTimelineRegistrySnapshot().decisionTypeCount,
    registeredDecisionTypeIds: listDecisionTypeIds(),
    supportedStatuses: DECISION_TIMELINE_STATUS_KEYS,
    supportedSources: DECISION_TIMELINE_SOURCE_KEYS,
    supportedCategories: DECISION_TIMELINE_CATEGORY_KEYS,
    supportedEventTypes: DECISION_TIMELINE_EVENT_TYPE_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function createDecisionTimelineFoundation(
  timestamp: string = new Date(0).toISOString()
): DecisionPlatformResult<DecisionPlatformState> {
  seedDefaultDecisionRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  const state = getDecisionTimelinePlatformState(timestamp);
  return createResult(true, "Decision Timeline platform foundation created.", state);
}

export function getDecisionTimelineFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof DECISION_TIMELINE_FOUNDATION_VERSION;
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  owner: typeof DECISION_TIMELINE_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: DECISION_TIMELINE_FOUNDATION_VERSION,
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    owner: DECISION_TIMELINE_FOUNDATION_OWNER,
  });
}

export const DecisionTimelineFoundation = Object.freeze({
  createDecisionTimelineFoundation,
  getDecisionTimelinePlatformState,
  isDecisionTimelinePlatformInitialized,
  getDecisionTimelineFoundationVersionMetadata,
  resetDecisionTimelineFoundationForTests,
  version: DECISION_TIMELINE_FOUNDATION_VERSION,
  tags: DECISION_TIMELINE_FOUNDATION_TAGS,
});
