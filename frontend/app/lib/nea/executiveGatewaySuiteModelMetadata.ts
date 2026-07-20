/**
 * NEA-8:3 — Executive Gateway Suite Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections and Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:3.
 */

import { ExecutiveGatewaySuiteRegistryVersion } from "./executiveGatewaySuiteRegistry.ts";
import { ExecutiveGatewaySuiteModelLifecycle } from "./executiveGatewaySuiteModelLifecycle.ts";
import {
  ExecutiveGatewaySuiteModelBoundaries,
  ExecutiveGatewaySuiteModelOwnership,
} from "./executiveGatewaySuiteModelOwnership.ts";
import {
  ExecutiveGatewaySuiteDomainModelCatalog,
  ExecutiveGatewaySuiteModelRegistryAnchors,
} from "./executiveGatewaySuiteModels.ts";
import { ExecutiveGatewaySuiteModelRelationshipCatalog } from "./executiveGatewaySuiteRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ExecutiveGatewaySuiteModelInventory = Object.freeze({
  inventoryId: "NEA-8:3/ModelInventory",
  sourcePhase: "NEA-8:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: ExecutiveGatewaySuiteDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "suiteComponentModels",
      count: ExecutiveGatewaySuiteDomainModelCatalog.suiteComponentModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "suiteComponentIdentityModels",
      count:
        ExecutiveGatewaySuiteDomainModelCatalog.suiteComponentIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "suitePlatformReferenceModels",
      count:
        ExecutiveGatewaySuiteDomainModelCatalog.suitePlatformReferenceModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: ExecutiveGatewaySuiteModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: ExecutiveGatewaySuiteModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "components",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.componentCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "componentIdentities",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.componentIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "dependencies",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.dependencyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.statusCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contracts",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.contractCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.lifecycleEntryCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: ExecutiveGatewaySuiteModelRegistryAnchors.registryPolicyCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const ExecutiveGatewaySuiteModelMetadata = Object.freeze({
  metadataId: "NEA-8:3/ExecutiveGatewaySuiteModelMetadata",
  sourcePhase: "NEA-8:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  architectureVersion: ExecutiveGatewaySuiteRegistryVersion,
  registryVersion: ExecutiveGatewaySuiteRegistryVersion,
  readiness: "ReadyForValidation" as const,
  canonicalReferenceMode: "RegistryCollectionsOnly" as const,
  nextPhase: "NEA-8:4 — Executive Gateway Suite Validation",
  domainModelCount: ExecutiveGatewaySuiteDomainModelCatalog.modelCount,
  suiteComponentModelCount:
    ExecutiveGatewaySuiteDomainModelCatalog.suiteComponentModelCount,
  relationshipCount:
    ExecutiveGatewaySuiteModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: ExecutiveGatewaySuiteModelLifecycle.stateCount,
  ownershipCount: ExecutiveGatewaySuiteModelOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewaySuiteModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewaySuiteModelBoundaries.prohibitedSurfaceCount,
  publicApiInventoryTotal:
    ExecutiveGatewaySuiteModelRegistryAnchors.publicApiInventoryTotal,
  inventory: ExecutiveGatewaySuiteModelInventory,
  registryAnchors: ExecutiveGatewaySuiteModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
