/**
 * NEA-2:3 — Channel Connector Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:3.
 */

import { ChannelConnectorModelLifecycle } from "./channelConnectorModelLifecycle.ts";
import {
  ChannelConnectorModelBoundaries,
  ChannelConnectorModelOwnership,
} from "./channelConnectorModelOwnership.ts";
import {
  ChannelConnectorDomainModelCatalog,
  ChannelConnectorModelRegistryAnchors,
} from "./channelConnectorModels.ts";
import { ChannelConnectorModelRelationshipCatalog } from "./channelConnectorRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const ChannelConnectorModelInventory = Object.freeze({
  inventoryId: "NEA-2:3/ModelInventory",
  sourcePhase: "NEA-2:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: ChannelConnectorDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "identityModels",
      count: ChannelConnectorDomainModelCatalog.identityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: ChannelConnectorModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: ChannelConnectorModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "families",
      count: ChannelConnectorModelRegistryAnchors.familyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "types",
      count: ChannelConnectorModelRegistryAnchors.typeCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "identities",
      count: ChannelConnectorModelRegistryAnchors.identityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "protocols",
      count: ChannelConnectorModelRegistryAnchors.protocolCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: ChannelConnectorModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: ChannelConnectorModelRegistryAnchors.policyCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const ChannelConnectorModelMetadata = Object.freeze({
  metadataId: "NEA-2:3/ChannelConnectorModelMetadata",
  sourcePhase: "NEA-2:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-2:4 — Channel Connectors Validation",
  domainModelCount: ChannelConnectorDomainModelCatalog.modelCount,
  identityModelCount: ChannelConnectorDomainModelCatalog.identityModelCount,
  relationshipCount: ChannelConnectorModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: ChannelConnectorModelLifecycle.stateCount,
  ownershipCount: ChannelConnectorModelOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorModelBoundaries.prohibitedSurfaceCount,
  inventory: ChannelConnectorModelInventory,
  registryAnchors: ChannelConnectorModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
