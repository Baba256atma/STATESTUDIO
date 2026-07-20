/**
 * NEA-8:5 — Executive Gateway Suite Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-8:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-8:5.
 */

import {
  ExecutiveGatewaySuiteValidationId,
  ExecutiveGatewaySuiteValidationPlatform,
} from "./executiveGatewaySuiteValidation.ts";
import type {
  ExecutiveGatewaySuiteManifestInventoryEntry,
  ExecutiveGatewaySuiteManifestPhaseReference,
} from "./executiveGatewaySuiteManifestTypes.ts";

const validation = ExecutiveGatewaySuiteValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const phaseRef = (
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): ExecutiveGatewaySuiteManifestPhaseReference =>
  Object.freeze({
    phaseId,
    phaseName,
    version,
    namespace,
    status,
    module,
    ownership: "Referenced" as const,
    reconstructsPhase: false as const,
    duplicatesInventory: false as const,
    deterministicOrder: order,
  });

/** Canonical phase references — NEA-8:1 through NEA-8:4 only. */
export const ExecutiveGatewaySuiteManifestPhaseReferences: readonly ExecutiveGatewaySuiteManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "executiveGatewaySuiteFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "executiveGatewaySuiteRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "executiveGatewaySuiteModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "executiveGatewaySuiteValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: ExecutiveGatewaySuiteManifestInventoryEntry["sourcePhase"],
  order: number,
): ExecutiveGatewaySuiteManifestInventoryEntry =>
  Object.freeze({
    inventoryKey,
    label,
    count,
    sourcePhase,
    ownership: "Referenced" as const,
    hardcoded: false as const,
    reconstructed: false as const,
    deterministicOrder: order,
  });

/**
 * Architecture inventory — every count derived from canonical upstream collections.
 * Exactly twenty inventory entries.
 */
export const ExecutiveGatewaySuiteManifestArchitectureInventory: readonly ExecutiveGatewaySuiteManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "suiteComponents",
      "Suite Components",
      foundation.composition.componentCount,
      "NEA-8:1",
      1,
    ),
    inventory(
      "foundationContracts",
      "Contracts",
      foundation.contracts.contractCount,
      "NEA-8:1",
      2,
    ),
    inventory(
      "foundationCapabilities",
      "Capabilities",
      foundation.capabilities.capabilityCount,
      "NEA-8:1",
      3,
    ),
    inventory(
      "foundationLifecycle",
      "Lifecycle States",
      foundation.lifecycle.stateCount,
      "NEA-8:1",
      4,
    ),
    inventory(
      "componentIdentities",
      "Component Identities",
      registry.collections.componentIdentityCount,
      "NEA-8:2",
      5,
    ),
    inventory(
      "registryDependencies",
      "Dependencies",
      registry.collections.dependencyCount,
      "NEA-8:2",
      6,
    ),
    inventory(
      "registryStatuses",
      "Statuses",
      registry.collections.statusCount,
      "NEA-8:2",
      7,
    ),
    inventory(
      "registryPolicies",
      "Registry Policies",
      registry.policies.policyCount,
      "NEA-8:2",
      8,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-8:3",
      9,
    ),
    inventory(
      "suiteComponentModels",
      "Suite Component Models",
      model.domainModels.suiteComponentModelCount,
      "NEA-8:3",
      10,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-8:3",
      11,
    ),
    inventory(
      "modelLifecycle",
      "Model Lifecycle",
      model.lifecycle.stateCount,
      "NEA-8:3",
      12,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.rules.domainCategoryCount,
      "NEA-8:4",
      13,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-8:4",
      14,
    ),
    inventory(
      "validationPolicies",
      "Validation Policies",
      validation.policies.policyCount,
      "NEA-8:4",
      15,
    ),
    inventory(
      "validationRelationships",
      "Validation Relationships",
      validation.relationships.relationshipCount,
      "NEA-8:4",
      16,
    ),
    inventory(
      "ownership",
      "Ownership Collections",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-8:1",
      17,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-8:1",
      18,
    ),
    inventory(
      "phaseReferences",
      "Phase References",
      ExecutiveGatewaySuiteManifestPhaseReferences.length,
      "NEA-8:4",
      19,
    ),
    inventory(
      "publicApiInventory",
      "Public API Inventory",
      validation.metadata.publicApiInventoryTotal,
      "NEA-8:4",
      20,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const ExecutiveGatewaySuiteManifestTotalArchitectureCount =
  ExecutiveGatewaySuiteManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const ExecutiveGatewaySuiteManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-8:5/ManifestInventory",
  sourcePhase: "NEA-8:5" as const,
  validationId: ExecutiveGatewaySuiteValidationId,
  phaseReferences: ExecutiveGatewaySuiteManifestPhaseReferences,
  phaseReferenceCount: ExecutiveGatewaySuiteManifestPhaseReferences.length,
  inventory: ExecutiveGatewaySuiteManifestArchitectureInventory,
  inventoryEntryCount:
    ExecutiveGatewaySuiteManifestArchitectureInventory.length,
  totalArchitectureCount: ExecutiveGatewaySuiteManifestTotalArchitectureCount,
  publicApiInventoryTotal: validation.metadata.publicApiInventoryTotal,
  countingRule:
    "NEA-8:5 → NEA-8:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
