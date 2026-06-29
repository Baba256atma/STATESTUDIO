/**
 * APP-9:1 — Confidence Evolution Platform foundation.
 */

import {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import {
  getConfidenceEvolutionRegistrySnapshot,
  listConfidenceEvolutionIds,
  seedDefaultConfidenceEvolutionRegistry,
} from "./confidenceEvolutionRegistry.ts";
import type {
  ConfidenceEvolutionPlatformResult,
  ConfidenceEvolutionPlatformState,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_FOUNDATION_VERSION = "APP-9/1" as const;
export const CONFIDENCE_EVOLUTION_FOUNDATION_OWNER = "confidence-evolution-platform-foundation" as const;

export const CONFIDENCE_EVOLUTION_FOUNDATION_TAGS = Object.freeze([
  "[APP9_1]",
  "[CONFIDENCE_EVOLUTION_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): ConfidenceEvolutionPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetConfidenceEvolutionFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isConfidenceEvolutionReady(): boolean {
  return platformInitialized;
}

export function isConfidenceEvolutionPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getConfidenceEvolutionPlatformState(
  timestamp: string = new Date(0).toISOString()
): ConfidenceEvolutionPlatformState {
  const snapshot = getConfidenceEvolutionRegistrySnapshot();
  return Object.freeze({
    platformId: "confidence-evolution-platform",
    foundationVersion: CONFIDENCE_EVOLUTION_FOUNDATION_VERSION,
    contractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    evolutionCount: snapshot.evolutionCount,
    registeredEvolutionIds: listConfidenceEvolutionIds(),
    supportedConfidenceLevels: CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
    supportedSources: CONFIDENCE_EVOLUTION_SOURCE_KEYS,
    supportedChangeReasons: CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function getConfidenceEvolution(
  timestamp: string = new Date(0).toISOString()
): ConfidenceEvolutionPlatformState {
  return getConfidenceEvolutionPlatformState(timestamp);
}

export function createConfidenceEvolutionFoundation(
  timestamp: string = new Date(0).toISOString()
): ConfidenceEvolutionPlatformResult<ConfidenceEvolutionPlatformState> {
  seedDefaultConfidenceEvolutionRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(
    true,
    "Confidence Evolution platform foundation created.",
    getConfidenceEvolutionPlatformState(timestamp)
  );
}

export function createConfidenceEvolution(
  timestamp: string = new Date(0).toISOString()
): ConfidenceEvolutionPlatformResult<ConfidenceEvolutionPlatformState> {
  return createConfidenceEvolutionFoundation(timestamp);
}

export function getConfidenceEvolutionFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof CONFIDENCE_EVOLUTION_FOUNDATION_VERSION;
  contractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  owner: typeof CONFIDENCE_EVOLUTION_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: CONFIDENCE_EVOLUTION_FOUNDATION_VERSION,
    contractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    owner: CONFIDENCE_EVOLUTION_FOUNDATION_OWNER,
  });
}

export const ConfidenceEvolutionFoundation = Object.freeze({
  createConfidenceEvolution,
  createConfidenceEvolutionFoundation,
  getConfidenceEvolution,
  getConfidenceEvolutionPlatformState,
  isConfidenceEvolutionReady,
  isConfidenceEvolutionPlatformInitialized,
  getConfidenceEvolutionFoundationVersionMetadata,
  resetConfidenceEvolutionFoundationForTests,
  version: CONFIDENCE_EVOLUTION_FOUNDATION_VERSION,
  tags: CONFIDENCE_EVOLUTION_FOUNDATION_TAGS,
});
