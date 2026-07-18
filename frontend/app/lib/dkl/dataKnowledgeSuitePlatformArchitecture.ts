/**
 * DKL-9:6 — Data Knowledge Suite Platform Architecture.
 *
 * Phase chain and upstream surfaces reached exclusively through
 * DataKnowledgeSuiteManifestPlatform by canonical reference.
 *
 * Ownership: owned exclusively by DKL-9:6.
 */

import { DataKnowledgeSuiteManifestPlatform } from "./dataKnowledgeSuiteManifest.ts";
import type { DataKnowledgeSuitePlatformPhaseReference } from "./dataKnowledgeSuitePlatformTypes.ts";

/** Sole upstream surface. */
const manifest = DataKnowledgeSuiteManifestPlatform;
const validation = manifest.upstreamValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phase = (
  phaseId: string,
  phaseName: string,
  stage: string,
  version: string,
  status: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  role: string,
  completed: boolean,
  order: number,
): DataKnowledgeSuitePlatformPhaseReference =>
  Object.freeze({
    phaseId,
    phaseName,
    stage,
    version,
    status,
    directPredecessor: predecessor,
    directSuccessor: successor,
    canonicalReferencePath: path,
    architectureRole: role,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/**
 * Nine DKL-9 phases: six completed through Platform, three future.
 * Upstream identities derived from Manifest-chain references.
 */
export const DataKnowledgeSuitePlatformPhases: readonly DataKnowledgeSuitePlatformPhaseReference[] =
  Object.freeze([
    phase(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      "Foundation",
      foundation.identity.foundationVersion,
      foundation.status,
      null,
      registry.identity.registryId,
      "Platform.manifest.upstreamValidation.model.registry.foundation",
      "Foundation",
      true,
      1,
    ),
    phase(
      registry.identity.registryId,
      registry.identity.registryName,
      "Registry",
      registry.identity.registryVersion,
      registry.status,
      foundation.identity.foundationId,
      model.identity.modelId,
      "Platform.manifest.upstreamValidation.model.registry",
      "Registry",
      true,
      2,
    ),
    phase(
      model.identity.modelId,
      model.identity.modelName,
      "Model",
      model.identity.modelVersion,
      model.status,
      registry.identity.registryId,
      validation.identity.validationId,
      "Platform.manifest.upstreamValidation.model",
      "Model",
      true,
      3,
    ),
    phase(
      validation.identity.validationId,
      validation.identity.validationName,
      "Validation",
      validation.identity.validationVersion,
      validation.status,
      model.identity.modelId,
      manifest.identity.manifestId,
      "Platform.manifest.upstreamValidation",
      "Validation",
      true,
      4,
    ),
    phase(
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      "Manifest",
      manifest.identity.manifestVersion,
      manifest.status,
      validation.identity.validationId,
      "DKL-9:6/DataKnowledgeSuitePlatform",
      "Platform.manifest",
      "Manifest",
      true,
      5,
    ),
    phase(
      "DKL-9:6/DataKnowledgeSuitePlatform",
      "Data Knowledge Suite Platform",
      "Platform",
      "1.0.0",
      "PlatformDefined",
      manifest.identity.manifestId,
      "DKL-9:7/DataKnowledgeSuiteCertification",
      "Platform",
      "Platform",
      true,
      6,
    ),
    phase(
      "DKL-9:7/DataKnowledgeSuiteCertification",
      "Data Knowledge Suite Certification",
      "Certification",
      "1.0.0",
      "Pending",
      "DKL-9:6/DataKnowledgeSuitePlatform",
      "DKL-9:8/DataKnowledgeSuiteFreeze",
      "Future",
      "Certification",
      false,
      7,
    ),
    phase(
      "DKL-9:8/DataKnowledgeSuiteFreeze",
      "Data Knowledge Suite Freeze",
      "Freeze",
      "1.0.0",
      "Pending",
      "DKL-9:7/DataKnowledgeSuiteCertification",
      "DKL-9:9/DataKnowledgeSuitePublicIndex",
      "Future",
      "Freeze",
      false,
      8,
    ),
    phase(
      "DKL-9:9/DataKnowledgeSuitePublicIndex",
      "Data Knowledge Suite Public Index",
      "PublicIndex",
      "1.0.0",
      "Pending",
      "DKL-9:8/DataKnowledgeSuiteFreeze",
      null,
      "Future",
      "PublicIndex",
      false,
      9,
    ),
  ]);

const completedPhaseCount = DataKnowledgeSuitePlatformPhases.filter(
  (item) => item.completed,
).length;
const futurePhaseCount = DataKnowledgeSuitePlatformPhases.filter(
  (item) => !item.completed,
).length;

/** Chain IDs derived through Manifest references. */
export const DataKnowledgeSuitePlatformChainIds = Object.freeze({
  foundationId: foundation.identity.foundationId,
  registryId: registry.identity.registryId,
  modelId: model.identity.modelId,
  validationId: validation.identity.validationId,
  manifestId: manifest.identity.manifestId,
  platformId: "DKL-9:6/DataKnowledgeSuitePlatform" as const,
  preservedByReference: true as const,
});

/**
 * Upstream surfaces preserved by Manifest-chain reference.
 * Foundation/Registry/Model/Validation/Manifest are not reconstructed.
 */
export const DataKnowledgeSuitePlatformUpstreamSurfaces = Object.freeze({
  manifest,
  validation,
  model,
  registry,
  foundation,
  capabilityCatalog: model.capabilities,
  ownership: model.ownershipReferences[0]!.ownership,
  boundaries: model.boundaryReferences[0]!.boundaries,
  contracts: registry.contracts,
  integrationContracts: registry.integrationContracts,
  lifecycle: registry.lifecycle.foundationLifecycle,
  manifestInventory: manifest.inventory,
  manifestCounts: manifest.counts,
  preservedByReference: true as const,
});

/**
 * Observed counts derived only through Manifest inventory / collections.
 * No hardcoded upstream inventory values.
 */
export const DataKnowledgeSuitePlatformObservedCounts = Object.freeze({
  completedPhaseCount,
  futurePhaseCount,
  totalDkl9PhaseCount: DataKnowledgeSuitePlatformPhases.length,
  manifestTotalEntryCount: manifest.inventory.totalEntryCount,
  capabilityCount: manifest.inventory.capabilityCount,
  publicPlatformReferenceCount:
    manifest.inventory.publicPlatformReferenceCount,
  publicApiRegistryReferenceCount:
    manifest.inventory.publicApiRegistryReferenceCount,
  publicApiInventoryTotal: manifest.inventory.publicApiInventoryTotal,
  dependencyCount: manifest.inventory.dependencyCount,
  ownershipReferenceCount: manifest.inventory.ownershipReferenceCount,
  boundaryReferenceCount: manifest.inventory.boundaryReferenceCount,
  modelKindCount: manifest.inventory.modelKindCount,
  validationRuleCount: manifest.inventory.validationRuleCount,
  validationGateCount: manifest.inventory.validationGateCount,
  validationCategoryCount: manifest.inventory.validationCategoryCount,
  registryTotalEntryCount: manifest.inventory.registryTotalEntryCount,
  sourcedThroughManifest: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
