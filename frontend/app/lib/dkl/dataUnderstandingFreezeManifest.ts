/**
 * DKL-3:8 — Data Understanding Freeze Manifest.
 *
 * Immutable freeze manifest: identity, counts, and readiness.
 * Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import { DataUnderstandingFreezeRegistry } from "./dataUnderstandingFreezeRegistry.ts";
import { DataUnderstandingFreezeCompatibility } from "./dataUnderstandingFreezeCompatibility.ts";
import { DataUnderstandingFreezeLocks } from "./dataUnderstandingFreezeLocks.ts";
import { DataUnderstandingPlatformDependencies } from "./dataUnderstandingPlatform.ts";
import type { FreezeCounts, FreezeReadinessDescriptor } from "./dataUnderstandingFreezeTypes.ts";
import {
  DATA_UNDERSTANDING_FREEZE_IDENTITY,
  DATA_UNDERSTANDING_FREEZE_VERSION,
} from "./dataUnderstandingFreezeRegistry.ts";

const COUNTS: FreezeCounts = Object.freeze({
  frozenPhaseCount: DataUnderstandingFreezeRegistry.frozenPhaseCount,
  frozenPublicApiCount: DataUnderstandingFreezeRegistry.frozenPublicApiCount,
  lockCount: DataUnderstandingFreezeLocks.lockCount,
  lockedLockCount: DataUnderstandingFreezeLocks.lockedLockCount,
  compatibilityCount: DataUnderstandingFreezeCompatibility.entryCount,
  componentCount: DataUnderstandingFreezeRegistry.componentCount,
  dependencyCount: DataUnderstandingPlatformDependencies.entryCount,
  publicApiCount: 8 as const,
});

const READINESS: FreezeReadinessDescriptor = Object.freeze({
  FoundationFrozen: true,
  RegistryFrozen: true,
  ModelFrozen: true,
  ValidationFrozen: true,
  ManifestFrozen: true,
  PlatformFrozen: true,
  CertificationFrozen: true,
  DependenciesFrozen: true,
  CompatibilityFrozen: true,
  OwnershipFrozen: true,
  BoundariesFrozen: true,
  PublicApisFrozen: true,
  ExtensionsFrozen: true,
  VersionFrozen: true,
  ReleaseFrozen: true,
  ReadyForPublicIndex: true,
  Frozen: true,
  Stable: true,
  MetadataOnly: true,
  FreezeOnly: true,
  UnderstandingForbidden: true,
  ValidationExecutionForbidden: true,
  CertificationExecutionForbidden: true,
  BusinessObjectCreationForbidden: true,
  KnowledgeGraphForbidden: true,
  PersistenceForbidden: true,
  AIFree: true,
  EngineFree: true,
});

/** Canonical immutable freeze manifest. */
export const DataUnderstandingFreezeManifest = Object.freeze({
  manifestId: "DKL-3:8/FreezeManifest",
  identity: DATA_UNDERSTANDING_FREEZE_IDENTITY,
  version: DATA_UNDERSTANDING_FREEZE_VERSION,
  sourcePhase: "DKL-3:8",
  counts: COUNTS,
  readiness: READINESS,
  freezeStatus: "Frozen" as const,
  stability: "Stable" as const,
  nextPhase: "DKL-3:9",
  metadata: Object.freeze({
    metadataOnly: true,
    freezeOnly: true,
    deterministic: true,
    immutable: true,
    semanticUnderstandingPerformed: false,
    validationExecuted: false,
    certificationExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
  deterministic: true,
});
