/**
 * NEA-5:3 — Gateway Routing Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:3.
 */

import { GatewayRoutingModelLifecycle } from "./gatewayRoutingModelLifecycle.ts";
import {
  GatewayRoutingModelBoundaries,
  GatewayRoutingModelOwnership,
} from "./gatewayRoutingModelOwnership.ts";
import {
  GatewayRoutingDomainModelCatalog,
  GatewayRoutingModelRegistryAnchors,
} from "./gatewayRoutingModels.ts";
import { GatewayRoutingModelRelationshipCatalog } from "./gatewayRoutingRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const GatewayRoutingModelInventory = Object.freeze({
  inventoryId: "NEA-5:3/ModelInventory",
  sourcePhase: "NEA-5:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: GatewayRoutingDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "routeIdentityModels",
      count: GatewayRoutingDomainModelCatalog.routeIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: GatewayRoutingModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: GatewayRoutingModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "routeIdentities",
      count: GatewayRoutingModelRegistryAnchors.routeIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "destinations",
      count: GatewayRoutingModelRegistryAnchors.destinationCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "decisions",
      count: GatewayRoutingModelRegistryAnchors.decisionCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "strategies",
      count: GatewayRoutingModelRegistryAnchors.strategyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "priorities",
      count: GatewayRoutingModelRegistryAnchors.priorityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: GatewayRoutingModelRegistryAnchors.statusCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "results",
      count: GatewayRoutingModelRegistryAnchors.resultCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contexts",
      count: GatewayRoutingModelRegistryAnchors.contextCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "routingPolicies",
      count: GatewayRoutingModelRegistryAnchors.routingPolicyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: GatewayRoutingModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: GatewayRoutingModelRegistryAnchors.lifecycleEntryCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const GatewayRoutingModelMetadata = Object.freeze({
  metadataId: "NEA-5:3/GatewayRoutingModelMetadata",
  sourcePhase: "NEA-5:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-5:4 — Gateway Routing Validation",
  domainModelCount: GatewayRoutingDomainModelCatalog.modelCount,
  routeIdentityModelCount:
    GatewayRoutingDomainModelCatalog.routeIdentityModelCount,
  relationshipCount: GatewayRoutingModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: GatewayRoutingModelLifecycle.stateCount,
  ownershipCount: GatewayRoutingModelOwnership.ownsCount,
  nonOwnershipCount: GatewayRoutingModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount: GatewayRoutingModelBoundaries.prohibitedSurfaceCount,
  inventory: GatewayRoutingModelInventory,
  registryAnchors: GatewayRoutingModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
