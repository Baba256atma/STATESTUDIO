/**
 * APP-7:1 — Business Timeline Platform foundation.
 */

import {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_SOURCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";
import {
  getBusinessTimelineRegistrySnapshot,
  listBusinessTimelineIds,
  seedDefaultBusinessRegistry,
} from "./businessTimelineRegistry.ts";
import type { BusinessPlatformResult, BusinessPlatformState } from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_FOUNDATION_VERSION = "APP-7/1" as const;
export const BUSINESS_TIMELINE_FOUNDATION_OWNER = "business-timeline-platform-foundation" as const;

export const BUSINESS_TIMELINE_FOUNDATION_TAGS = Object.freeze([
  "[APP7_1]",
  "[BUSINESS_TIMELINE_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): BusinessPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetBusinessTimelineFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isBusinessTimelineReady(): boolean {
  return platformInitialized;
}

export function isBusinessTimelinePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getBusinessTimelinePlatformState(
  timestamp: string = new Date(0).toISOString()
): BusinessPlatformState {
  const snapshot = getBusinessTimelineRegistrySnapshot();
  return Object.freeze({
    platformId: "business-timeline-platform",
    foundationVersion: BUSINESS_TIMELINE_FOUNDATION_VERSION,
    contractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    timelineCount: snapshot.timelineCount,
    registeredTimelineIds: listBusinessTimelineIds(),
    eventTypeCount: snapshot.eventTypeCount,
    supportedCategories: BUSINESS_TIMELINE_CATEGORY_KEYS,
    supportedEventTypes: BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
    supportedImportanceLevels: BUSINESS_TIMELINE_IMPORTANCE_KEYS,
    supportedStatuses: BUSINESS_TIMELINE_STATUS_KEYS,
    supportedSources: BUSINESS_TIMELINE_SOURCE_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function getBusinessTimeline(
  timestamp: string = new Date(0).toISOString()
): BusinessPlatformState {
  return getBusinessTimelinePlatformState(timestamp);
}

export function createBusinessTimelineFoundation(
  timestamp: string = new Date(0).toISOString()
): BusinessPlatformResult<BusinessPlatformState> {
  seedDefaultBusinessRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Business Timeline platform foundation created.", getBusinessTimelinePlatformState(timestamp));
}

export function createBusinessTimeline(
  timestamp: string = new Date(0).toISOString()
): BusinessPlatformResult<BusinessPlatformState> {
  return createBusinessTimelineFoundation(timestamp);
}

export function getBusinessTimelineFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof BUSINESS_TIMELINE_FOUNDATION_VERSION;
  contractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  owner: typeof BUSINESS_TIMELINE_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: BUSINESS_TIMELINE_FOUNDATION_VERSION,
    contractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    owner: BUSINESS_TIMELINE_FOUNDATION_OWNER,
  });
}

export const BusinessTimelineFoundation = Object.freeze({
  createBusinessTimeline,
  createBusinessTimelineFoundation,
  getBusinessTimeline,
  getBusinessTimelinePlatformState,
  isBusinessTimelineReady,
  isBusinessTimelinePlatformInitialized,
  getBusinessTimelineFoundationVersionMetadata,
  resetBusinessTimelineFoundationForTests,
  version: BUSINESS_TIMELINE_FOUNDATION_VERSION,
  tags: BUSINESS_TIMELINE_FOUNDATION_TAGS,
});
