/**
 * APP-12:1 — Executive Recommendation Platform foundation.
 */

import {
  EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS,
} from "./executiveRecommendationConstants.ts";
import {
  getExecutiveRecommendationRegistrySnapshot,
  listExecutiveRecommendationSessionIds,
  seedDefaultExecutiveRecommendationRegistry,
} from "./executiveRecommendationRegistry.ts";
import type {
  ExecutiveRecommendationPlatformResult,
  ExecutiveRecommendationPlatformState,
} from "./executiveRecommendationTypes.ts";

export const EXECUTIVE_RECOMMENDATION_FOUNDATION_VERSION = "APP-12/1" as const;
export const EXECUTIVE_RECOMMENDATION_FOUNDATION_OWNER = "executive-recommendation-platform-foundation" as const;

export const EXECUTIVE_RECOMMENDATION_FOUNDATION_TAGS = Object.freeze([
  "[APP12_1]",
  "[EXECUTIVE_RECOMMENDATION_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_GENERATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveRecommendationPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveRecommendationFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isExecutiveRecommendationReady(): boolean {
  return platformInitialized;
}

export function isExecutiveRecommendationPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getExecutiveRecommendationPlatformState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveRecommendationPlatformState {
  const snapshot = getExecutiveRecommendationRegistrySnapshot();
  return Object.freeze({
    platformId: "executive-recommendation-platform",
    foundationVersion: EXECUTIVE_RECOMMENDATION_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    sessionCount: snapshot.sessionCount,
    registeredSessionIds: listExecutiveRecommendationSessionIds(),
    supportedDomains: EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
    supportedSessionStatuses: EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS,
    supportedCandidateStatuses: EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveRecommendationFoundation(
  timestamp: string = new Date(0).toISOString()
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationPlatformState> {
  seedDefaultExecutiveRecommendationRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(
    true,
    "Executive Recommendation platform foundation created.",
    getExecutiveRecommendationPlatformState(timestamp)
  );
}

export function createExecutiveRecommendationFoundation(
  timestamp: string = new Date(0).toISOString()
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationPlatformState> {
  return buildExecutiveRecommendationFoundation(timestamp);
}

export function getExecutiveRecommendationFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof EXECUTIVE_RECOMMENDATION_FOUNDATION_VERSION;
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_RECOMMENDATION_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: EXECUTIVE_RECOMMENDATION_FOUNDATION_VERSION,
    contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    owner: EXECUTIVE_RECOMMENDATION_FOUNDATION_OWNER,
  });
}

export const ExecutiveRecommendationFoundation = Object.freeze({
  buildExecutiveRecommendationFoundation,
  createExecutiveRecommendationFoundation,
  getExecutiveRecommendationPlatformState,
  isExecutiveRecommendationReady,
  isExecutiveRecommendationPlatformInitialized,
  getExecutiveRecommendationFoundationVersionMetadata,
  resetExecutiveRecommendationFoundationForTests,
  version: EXECUTIVE_RECOMMENDATION_FOUNDATION_VERSION,
  tags: EXECUTIVE_RECOMMENDATION_FOUNDATION_TAGS,
});
