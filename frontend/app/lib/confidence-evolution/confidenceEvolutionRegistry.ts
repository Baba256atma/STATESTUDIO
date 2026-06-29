/**
 * APP-9:1 — Confidence Evolution registry.
 */

import {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_DEFAULT_LIMITS,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import type {
  ConfidenceChangeReasonRegistration,
  ConfidenceEvolutionFutureExtensionRegistration,
  ConfidenceEvolutionId,
  ConfidenceEvolutionMetadataExtensionRegistration,
  ConfidenceEvolutionPlatformResult,
  ConfidenceEvolutionRegistration,
  ConfidenceEvolutionRegistrationInput,
  ConfidenceEvolutionRegistrySnapshot,
  ConfidenceLevelRegistration,
  ConfidenceSourceRegistration,
} from "./confidenceEvolutionTypes.ts";
import {
  validateConfidenceEvolutionRegistration,
  validateMetadataExtensionRegistration,
} from "./confidenceEvolutionValidation.ts";

export const CONFIDENCE_EVOLUTION_REGISTRY_VERSION = "APP-9/1-REGISTRY-1" as const;

const evolutionRegistry = new Map<ConfidenceEvolutionId, ConfidenceEvolutionRegistration>();
const confidenceLevelRegistry = new Map<string, ConfidenceLevelRegistration>();
const sourceRegistry = new Map<string, ConfidenceSourceRegistration>();
const changeReasonRegistry = new Map<string, ConfidenceChangeReasonRegistration>();
const metadataExtensionRegistry = new Map<string, ConfidenceEvolutionMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, ConfidenceEvolutionFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): ConfidenceEvolutionPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetConfidenceEvolutionRegistryForTests(): void {
  evolutionRegistry.clear();
  confidenceLevelRegistry.clear();
  sourceRegistry.clear();
  changeReasonRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerConfidenceEvolution(
  input: ConfidenceEvolutionRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): ConfidenceEvolutionPlatformResult<ConfidenceEvolutionRegistration> {
  const validation = validateConfidenceEvolutionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (evolutionRegistry.has(input.evolutionId)) {
    return createResult(false, `Confidence evolution already registered: ${input.evolutionId}.`, null);
  }
  if (evolutionRegistry.size >= CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxRegisteredEvolutions) {
    return createResult(false, "Confidence evolution registry limit reached.", null);
  }
  const entry = Object.freeze({
    evolutionId: input.evolutionId,
    workspaceId: input.workspaceId,
    label: input.label.trim(),
    description: input.description.trim(),
    registeredAt,
    readOnly: true as const,
  });
  evolutionRegistry.set(entry.evolutionId, entry);
  return createResult(true, "Confidence evolution registered.", entry);
}

export function registerConfidenceLevel(
  input: ConfidenceLevelRegistration
): ConfidenceEvolutionPlatformResult<ConfidenceLevelRegistration> {
  if (!input.levelId || !input.label.trim()) {
    return createResult(false, "levelId and label are required.", null);
  }
  if (confidenceLevelRegistry.has(input.levelId)) {
    return createResult(false, `Confidence level already registered: ${input.levelId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  confidenceLevelRegistry.set(entry.levelId, entry);
  return createResult(true, "Confidence level registered.", entry);
}

export function registerConfidenceSourceType(
  input: ConfidenceSourceRegistration
): ConfidenceEvolutionPlatformResult<ConfidenceSourceRegistration> {
  if (!input.sourceId || !input.label.trim()) {
    return createResult(false, "sourceId and label are required.", null);
  }
  if (sourceRegistry.has(input.sourceId)) {
    return createResult(false, `Confidence source already registered: ${input.sourceId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  sourceRegistry.set(entry.sourceId, entry);
  return createResult(true, "Confidence source registered.", entry);
}

export function registerConfidenceChangeReason(
  input: ConfidenceChangeReasonRegistration
): ConfidenceEvolutionPlatformResult<ConfidenceChangeReasonRegistration> {
  if (!input.reasonId || !input.label.trim()) {
    return createResult(false, "reasonId and label are required.", null);
  }
  if (changeReasonRegistry.has(input.reasonId)) {
    return createResult(false, `Change reason already registered: ${input.reasonId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  changeReasonRegistry.set(entry.reasonId, entry);
  return createResult(true, "Change reason registered.", entry);
}

export function registerMetadataExtension(
  input: ConfidenceEvolutionMetadataExtensionRegistration
): ConfidenceEvolutionPlatformResult<ConfidenceEvolutionMetadataExtensionRegistration> {
  const validation = validateMetadataExtensionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Metadata extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  metadataExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Metadata extension registered.", entry);
}

export function registerFutureExtension(
  input: ConfidenceEvolutionFutureExtensionRegistration
): ConfidenceEvolutionPlatformResult<ConfidenceEvolutionFutureExtensionRegistration> {
  if (!input.extensionId.trim() || !input.phaseKey.trim()) {
    return createResult(false, "extensionId and phaseKey are required.", null);
  }
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

export function getConfidenceEvolutionById(
  evolutionId: ConfidenceEvolutionId
): ConfidenceEvolutionRegistration | null {
  return evolutionRegistry.get(evolutionId) ?? null;
}

export function listConfidenceEvolutionIds(): readonly ConfidenceEvolutionId[] {
  return Object.freeze([...evolutionRegistry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getConfidenceEvolutionRegistry(): Readonly<{
  evolutions: readonly ConfidenceEvolutionRegistration[];
  confidenceLevels: readonly ConfidenceLevelRegistration[];
  sources: readonly ConfidenceSourceRegistration[];
  changeReasons: readonly ConfidenceChangeReasonRegistration[];
  metadataExtensions: readonly ConfidenceEvolutionMetadataExtensionRegistration[];
  futureExtensions: readonly ConfidenceEvolutionFutureExtensionRegistration[];
  readOnly: true;
}> {
  return Object.freeze({
    evolutions: Object.freeze(
      [...evolutionRegistry.values()].sort((a, b) => a.evolutionId.localeCompare(b.evolutionId))
    ),
    confidenceLevels: Object.freeze(
      [...confidenceLevelRegistry.values()].sort((a, b) => a.rank - b.rank)
    ),
    sources: Object.freeze([...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))),
    changeReasons: Object.freeze(
      [...changeReasonRegistry.values()].sort((a, b) => a.reasonId.localeCompare(b.reasonId))
    ),
    metadataExtensions: Object.freeze(
      [...metadataExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    futureExtensions: Object.freeze(
      [...futureExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    readOnly: true as const,
  });
}

export function getConfidenceEvolutionRegistrySnapshot(): ConfidenceEvolutionRegistrySnapshot {
  return Object.freeze({
    registryVersion: CONFIDENCE_EVOLUTION_REGISTRY_VERSION,
    evolutionCount: evolutionRegistry.size,
    evolutionIds: listConfidenceEvolutionIds(),
    confidenceLevelCount: confidenceLevelRegistry.size,
    sourceCount: sourceRegistry.size,
    changeReasonCount: changeReasonRegistry.size,
    metadataExtensionCount: metadataExtensionRegistry.size,
    futureExtensionCount: futureExtensionRegistry.size,
    readOnly: true as const,
  });
}

export function seedDefaultConfidenceEvolutionRegistry(): void {
  if (confidenceLevelRegistry.size === 0) {
    const ranks: Record<(typeof CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS)[number], number> = {
      very_low: 1,
      low: 2,
      medium: 3,
      high: 4,
      very_high: 5,
    };
    for (const levelId of CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS) {
      registerConfidenceLevel(
        Object.freeze({
          levelId,
          label: levelId.replace(/_/g, " "),
          description: `Canonical ${levelId} confidence level.`,
          rank: ranks[levelId],
        })
      );
    }
  }
  if (sourceRegistry.size === 0) {
    for (const sourceId of CONFIDENCE_EVOLUTION_SOURCE_KEYS) {
      registerConfidenceSourceType(
        Object.freeze({
          sourceId,
          label: sourceId.replace(/_/g, " "),
          description: `Canonical ${sourceId} confidence source.`,
        })
      );
    }
  }
  if (changeReasonRegistry.size === 0) {
    for (const reasonId of CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS) {
      registerConfidenceChangeReason(
        Object.freeze({
          reasonId,
          label: reasonId.replace(/_/g, " "),
          description: `Canonical ${reasonId} confidence change reason.`,
        })
      );
    }
  }
}

export const ConfidenceEvolutionRegistry = Object.freeze({
  registerConfidenceEvolution,
  registerConfidenceLevel,
  registerConfidenceSourceType,
  registerConfidenceChangeReason,
  registerMetadataExtension,
  registerFutureExtension,
  getConfidenceEvolutionById,
  getConfidenceEvolutionRegistry,
  getConfidenceEvolutionRegistrySnapshot,
  listConfidenceEvolutionIds,
  seedDefaultConfidenceEvolutionRegistry,
  resetConfidenceEvolutionRegistryForTests,
  version: CONFIDENCE_EVOLUTION_REGISTRY_VERSION,
});
