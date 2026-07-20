/**
 * NEA-1:3 — Executive Gateway Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:3.
 */

import { ExecutiveGatewayModelLifecycle } from "./executiveGatewayModelLifecycle.ts";
import {
  ExecutiveGatewayModelBoundaries,
  ExecutiveGatewayModelOwnership,
} from "./executiveGatewayModelOwnership.ts";
import {
  ExecutiveGatewayDomainModelCatalog,
  ExecutiveGatewayModelRegistryAnchors,
} from "./executiveGatewayModels.ts";
import { ExecutiveGatewayModelRelationshipCatalog } from "./executiveGatewayRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ExecutiveGatewayModelInventory = Object.freeze({
  inventoryId: "NEA-1:3/ModelInventory",
  sourcePhase: "NEA-1:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: ExecutiveGatewayDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: ExecutiveGatewayModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: ExecutiveGatewayModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "sourceFamilies",
      count: ExecutiveGatewayModelRegistryAnchors.sourceFamilyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "channels",
      count: ExecutiveGatewayModelRegistryAnchors.channelCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "modalities",
      count: ExecutiveGatewayModelRegistryAnchors.modalityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "senders",
      count: ExecutiveGatewayModelRegistryAnchors.senderCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "routingDestinations",
      count: ExecutiveGatewayModelRegistryAnchors.routingDestinationCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "validationStatuses",
      count: ExecutiveGatewayModelRegistryAnchors.validationStatusCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "diagnosticCategories",
      count: ExecutiveGatewayModelRegistryAnchors.diagnosticCategoryCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable model metadata envelope. */
export const ExecutiveGatewayModelMetadata = Object.freeze({
  metadataId: "NEA-1:3/ExecutiveGatewayModelMetadata",
  sourcePhase: "NEA-1:3" as const,
  inventory: ExecutiveGatewayModelInventory,
  domainModelCount: ExecutiveGatewayDomainModelCatalog.modelCount,
  relationshipCount: ExecutiveGatewayModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: ExecutiveGatewayModelLifecycle.stateCount,
  ownershipCount: ExecutiveGatewayModelOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewayModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewayModelBoundaries.prohibitedSurfaceCount,
  registryAnchors: ExecutiveGatewayModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
