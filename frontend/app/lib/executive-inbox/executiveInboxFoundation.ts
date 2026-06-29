/**
 * APP-11:1 — Executive Inbox Platform foundation.
 */

import {
  EXECUTIVE_INBOX_ITEM_STATUS_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SESSION_STATUS_KEYS,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import {
  getExecutiveInboxRegistrySnapshot,
  listExecutiveInboxSessionIds,
  seedDefaultExecutiveInboxRegistry,
} from "./executiveInboxRegistry.ts";
import type {
  ExecutiveInboxPlatformResult,
  ExecutiveInboxPlatformState,
} from "./executiveInboxTypes.ts";

export const EXECUTIVE_INBOX_FOUNDATION_VERSION = "APP-11/1" as const;
export const EXECUTIVE_INBOX_FOUNDATION_OWNER = "executive-inbox-platform-foundation" as const;

export const EXECUTIVE_INBOX_FOUNDATION_TAGS = Object.freeze([
  "[APP11_1]",
  "[EXECUTIVE_INBOX_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_AGGREGATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveInboxPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveInboxFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isExecutiveInboxReady(): boolean {
  return platformInitialized;
}

export function isExecutiveInboxPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getExecutiveInboxPlatformState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveInboxPlatformState {
  const snapshot = getExecutiveInboxRegistrySnapshot();
  return Object.freeze({
    platformId: "executive-inbox-platform",
    foundationVersion: EXECUTIVE_INBOX_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    sessionCount: snapshot.sessionCount,
    registeredSessionIds: listExecutiveInboxSessionIds(),
    supportedSourceTypes: EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
    supportedSessionStatuses: EXECUTIVE_INBOX_SESSION_STATUS_KEYS,
    supportedItemStatuses: EXECUTIVE_INBOX_ITEM_STATUS_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function getExecutiveInbox(timestamp: string = new Date(0).toISOString()): ExecutiveInboxPlatformState {
  return getExecutiveInboxPlatformState(timestamp);
}

export function buildExecutiveInboxFoundation(
  timestamp: string = new Date(0).toISOString()
): ExecutiveInboxPlatformResult<ExecutiveInboxPlatformState> {
  seedDefaultExecutiveInboxRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Executive Inbox platform foundation created.", getExecutiveInboxPlatformState(timestamp));
}

export function createExecutiveInboxFoundation(
  timestamp: string = new Date(0).toISOString()
): ExecutiveInboxPlatformResult<ExecutiveInboxPlatformState> {
  return buildExecutiveInboxFoundation(timestamp);
}

export function getExecutiveInboxFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof EXECUTIVE_INBOX_FOUNDATION_VERSION;
  contractVersion: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_INBOX_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: EXECUTIVE_INBOX_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    owner: EXECUTIVE_INBOX_FOUNDATION_OWNER,
  });
}

export const ExecutiveInboxFoundation = Object.freeze({
  buildExecutiveInboxFoundation,
  createExecutiveInboxFoundation,
  getExecutiveInbox,
  getExecutiveInboxPlatformState,
  isExecutiveInboxReady,
  isExecutiveInboxPlatformInitialized,
  getExecutiveInboxFoundationVersionMetadata,
  resetExecutiveInboxFoundationForTests,
  version: EXECUTIVE_INBOX_FOUNDATION_VERSION,
  tags: EXECUTIVE_INBOX_FOUNDATION_TAGS,
});
