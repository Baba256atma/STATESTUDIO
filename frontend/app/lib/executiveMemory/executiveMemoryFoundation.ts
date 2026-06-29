/**
 * APP-4:1 — Executive Memory foundation.
 * Platform initialization and state — metadata only.
 */

import { EXECUTIVE_MEMORY_CATEGORY_KEYS, EXECUTIVE_MEMORY_CONTRACT_VERSION } from "./executiveMemoryConstants.ts";
import {
  getExecutiveMemoryProviders,
  listExecutiveMemoryProviderIds,
} from "./executiveMemoryRegistry.ts";
import type {
  ExecutiveMemoryPlatformState,
  ExecutiveMemoryResult,
} from "./executiveMemoryTypes.ts";

export const EXECUTIVE_MEMORY_FOUNDATION_VERSION = "APP-4/1" as const;
export const EXECUTIVE_MEMORY_FOUNDATION_OWNER = "executive-memory-foundation" as const;

export const EXECUTIVE_MEMORY_FOUNDATION_TAGS = Object.freeze([
  "[APP4_1]",
  "[EXECUTIVE_MEMORY_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NOT_CHAT_MEMORY]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveMemoryResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveMemoryFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isExecutiveMemoryPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getExecutiveMemoryPlatformState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveMemoryPlatformState {
  return Object.freeze({
    platformId: "executive-memory-platform",
    foundationVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
    initialized: platformInitialized,
    providerCount: getExecutiveMemoryProviders().length,
    registeredProviderIds: listExecutiveMemoryProviderIds(),
    supportedCategories: EXECUTIVE_MEMORY_CATEGORY_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeExecutiveMemoryPlatform(
  timestamp: string = new Date(0).toISOString()
): ExecutiveMemoryResult<ExecutiveMemoryPlatformState> {
  platformInitialized = true;
  lastInitializedAt = timestamp;
  const state = getExecutiveMemoryPlatformState(timestamp);
  return createResult(true, "Executive Memory platform initialized.", state);
}

export function getExecutiveMemoryFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof EXECUTIVE_MEMORY_FOUNDATION_VERSION;
  contractVersion: typeof EXECUTIVE_MEMORY_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_MEMORY_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
    owner: EXECUTIVE_MEMORY_FOUNDATION_OWNER,
  });
}

export const ExecutiveMemoryFoundation = Object.freeze({
  initializeExecutiveMemoryPlatform,
  getExecutiveMemoryPlatformState,
  isExecutiveMemoryPlatformInitialized,
  getExecutiveMemoryFoundationVersionMetadata,
  resetExecutiveMemoryFoundationForTests,
  version: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  tags: EXECUTIVE_MEMORY_FOUNDATION_TAGS,
});
