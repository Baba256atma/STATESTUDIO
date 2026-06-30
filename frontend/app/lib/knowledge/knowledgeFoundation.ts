/**
 * KNL-1 — Knowledge Platform foundation.
 */

import {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
} from "./knowledgeConstants.ts";
import {
  getKnowledgeRegistry,
  getKnowledgeRegistrySnapshot,
  registerKnowledgeCapability,
  registerKnowledgeDomain,
  registerKnowledgeProvider,
  resetKnowledgeRegistryForTests,
  seedDefaultKnowledgeRegistry,
} from "./knowledgeRegistry.ts";
import type { KnowledgePlatformResult, KnowledgePlatformState } from "./knowledgeTypes.ts";

export const KNOWLEDGE_FOUNDATION_VERSION = "KNL/1" as const;
export const KNOWLEDGE_FOUNDATION_OWNER = "knowledge-platform-foundation" as const;

export const KNOWLEDGE_FOUNDATION_TAGS = Object.freeze([
  "[KNL_1]",
  "[KNOWLEDGE_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_AI]",
  "[NO_RETRIEVAL]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgePlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetKnowledgeFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
  resetKnowledgeRegistryForTests();
}

export function isKnowledgePlatformReady(): boolean {
  return platformInitialized;
}

export function isKnowledgePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgePlatformState(timestamp: string = new Date(0).toISOString()): KnowledgePlatformState {
  const snapshot = getKnowledgeRegistrySnapshot();
  return Object.freeze({
    platformId: "knowledge-platform",
    foundationVersion: KNOWLEDGE_FOUNDATION_VERSION,
    contractVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    domainCount: snapshot.domainCount,
    providerCount: snapshot.providerCount,
    capabilityCount: snapshot.capabilityCount,
    supportedDomains: KNOWLEDGE_DOMAIN_KEYS,
    supportedCapabilities: KNOWLEDGE_CAPABILITY_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildKnowledgeFoundation(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgePlatformState> {
  seedDefaultKnowledgeRegistry(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Knowledge platform foundation created.", getKnowledgePlatformState(timestamp));
}

export function createKnowledgeFoundation(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformResult<KnowledgePlatformState> {
  return buildKnowledgeFoundation(timestamp);
}

export function getKnowledgeFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof KNOWLEDGE_FOUNDATION_VERSION;
  contractVersion: typeof KNOWLEDGE_PLATFORM_CONTRACT_VERSION;
  owner: typeof KNOWLEDGE_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: KNOWLEDGE_FOUNDATION_VERSION,
    contractVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    owner: KNOWLEDGE_FOUNDATION_OWNER,
  });
}

export {
  registerKnowledgeDomain,
  registerKnowledgeProvider,
  registerKnowledgeCapability,
  getKnowledgeRegistry,
};

export const KnowledgeFoundation = Object.freeze({
  buildKnowledgeFoundation,
  createKnowledgeFoundation,
  getKnowledgePlatformState,
  isKnowledgePlatformReady,
  isKnowledgePlatformInitialized,
  getKnowledgeFoundationVersionMetadata,
  registerKnowledgeDomain,
  registerKnowledgeProvider,
  registerKnowledgeCapability,
  getKnowledgeRegistry,
  resetKnowledgeFoundationForTests,
  version: KNOWLEDGE_FOUNDATION_VERSION,
  tags: KNOWLEDGE_FOUNDATION_TAGS,
});
