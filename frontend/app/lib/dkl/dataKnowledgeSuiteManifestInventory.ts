/**
 * DKL-9:5 — Data Knowledge Suite Manifest Inventory.
 *
 * Canonical inventories aggregated exclusively through
 * DataKnowledgeSuiteValidationPlatform by canonical reference.
 * No reconstruction. No hardcoded counts.
 *
 * Ownership: owned exclusively by DKL-9:5.
 */

import { DataKnowledgeSuiteValidationPlatform } from "./dataKnowledgeSuiteValidation.ts";

/** Sole upstream surface — preserved by canonical reference. */
const validation = DataKnowledgeSuiteValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

/** Capability inventory — Model capability collections by reference. */
export const DataKnowledgeSuiteManifestCapabilityInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Capabilities",
  capabilities: model.capabilities,
  capabilityReferences: model.capabilityReferences,
  capabilityOrdering: model.capabilityOrdering,
  capabilityDependencies: model.capabilityDependencies,
  capabilityVersions: model.capabilityVersions,
  capabilityStatuses: model.capabilityStatuses,
  capabilityReadiness: model.capabilityReadiness,
  capabilityCount: model.inventory.capabilityModelCount,
  accessPath: "Validation.model.capabilities",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Platform inventory — public platform references by reference. */
export const DataKnowledgeSuiteManifestPlatformInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Platforms",
  publicPlatformReferences: model.publicPlatformReferences,
  platformReferenceCount: model.inventory.publicPlatformReferenceCount,
  accessPath: "Validation.model.publicPlatformReferences",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** API inventory — public API registry refs and counts by reference. */
export const DataKnowledgeSuiteManifestApiInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Apis",
  publicApiRegistryReferences: model.publicApiRegistryReferences,
  apiRegistryReferenceCount: model.inventory.publicApiRegistryReferenceCount,
  publicApiInventoryTotal: model.inventory.publicApiInventoryTotal,
  accessPath: "Validation.model.publicApiRegistryReferences",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Dependency inventory — capability dependency graph by reference. */
export const DataKnowledgeSuiteManifestDependencyInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Dependencies",
  capabilityDependencies: model.capabilityDependencies,
  dependencyCount: model.inventory.dependencyModelCount,
  relationships: model.relationships,
  relationshipKindCount: model.inventory.relationshipKindCount,
  accessPath: "Validation.model.capabilityDependencies",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Ownership inventory — ownership reference by reference. */
export const DataKnowledgeSuiteManifestOwnershipInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Ownership",
  ownershipReferences: model.ownershipReferences,
  ownershipReferenceCount: model.inventory.ownershipReferenceCount,
  foundationOwnership: registry.ownership.foundationOwnership,
  accessPath: "Validation.model.ownershipReferences",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Boundary inventory — boundary reference by reference. */
export const DataKnowledgeSuiteManifestBoundaryInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Boundaries",
  boundaryReferences: model.boundaryReferences,
  boundaryReferenceCount: model.inventory.boundaryReferenceCount,
  foundationBoundaries: registry.boundaries.foundationBoundaries,
  accessPath: "Validation.model.boundaryReferences",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Validation inventory — Validation collections by reference. */
export const DataKnowledgeSuiteManifestValidationInventory = Object.freeze({
  inventoryId: "DKL-9:5/Inventory/Validation",
  rules: validation.rules,
  gates: validation.gates,
  categories: validation.categories,
  severities: validation.severities,
  outcomes: validation.outcomes,
  findings: validation.findings,
  reports: validation.reports,
  validationInventory: validation.inventory,
  ruleCount: validation.inventory.ruleCount,
  gateCount: validation.inventory.gateCount,
  categoryCount: validation.inventory.categoryCount,
  accessPath: "Validation",
  preservedByReference: true as const,
  reconstructed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Upstream phase surfaces preserved by Validation-chain reference. */
export const DataKnowledgeSuiteManifestUpstreamSurfaces = Object.freeze({
  validation,
  model,
  registry,
  foundation,
  contracts: registry.contracts,
  integrationContracts: registry.integrationContracts,
  lifecycle: registry.lifecycle.foundationLifecycle,
  suite: model.suite,
  releases: model.releases,
  snapshots: model.snapshots,
  results: model.results,
  preservedByReference: true as const,
});

/** Chain identity anchors from Validation → Model → Registry → Foundation. */
export const DataKnowledgeSuiteManifestChainIds = Object.freeze({
  foundationId: foundation.identity.foundationId,
  registryId: registry.identity.registryId,
  modelId: model.identity.modelId,
  validationId: validation.identity.validationId,
  manifestId: "DKL-9:5/DataKnowledgeSuiteManifest" as const,
  preservedByReference: true as const,
});
