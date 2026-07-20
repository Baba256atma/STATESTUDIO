/**
 * NEA-6:3 — Message Normalization Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:3.
 */

import { MessageNormalizationModelLifecycle } from "./messageNormalizationModelLifecycle.ts";
import {
  MessageNormalizationModelBoundaries,
  MessageNormalizationModelOwnership,
} from "./messageNormalizationModelOwnership.ts";
import {
  MessageNormalizationDomainModelCatalog,
  MessageNormalizationModelRegistryAnchors,
} from "./messageNormalizationModels.ts";
import { MessageNormalizationModelRelationshipCatalog } from "./messageNormalizationRelationships.ts";
import { MessageNormalizationRegistryVersion } from "./messageNormalizationRegistry.ts";

/** Named inventory distinguishing created vs referenced items. */
export const MessageNormalizationModelInventory = Object.freeze({
  inventoryId: "NEA-6:3/ModelInventory",
  sourcePhase: "NEA-6:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: MessageNormalizationDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "messageIdentityModels",
      count: MessageNormalizationDomainModelCatalog.messageIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: MessageNormalizationModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: MessageNormalizationModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "messageIdentities",
      count: MessageNormalizationModelRegistryAnchors.messageIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "payloads",
      count: MessageNormalizationModelRegistryAnchors.payloadCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "metadataFields",
      count: MessageNormalizationModelRegistryAnchors.metadataFieldCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "mappings",
      count: MessageNormalizationModelRegistryAnchors.mappingCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "normalizationPolicies",
      count: MessageNormalizationModelRegistryAnchors.normalizationPolicyCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: MessageNormalizationModelRegistryAnchors.statusCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contracts",
      count: MessageNormalizationModelRegistryAnchors.contractCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contexts",
      count: MessageNormalizationModelRegistryAnchors.contextCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "attachmentKinds",
      count: MessageNormalizationModelRegistryAnchors.attachmentKindCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: MessageNormalizationModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: MessageNormalizationModelRegistryAnchors.lifecycleEntryCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const MessageNormalizationModelMetadata = Object.freeze({
  metadataId: "NEA-6:3/MessageNormalizationModelMetadata",
  sourcePhase: "NEA-6:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  registryVersion: MessageNormalizationRegistryVersion,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-6:4 — Message Normalization Validation",
  domainModelCount: MessageNormalizationDomainModelCatalog.modelCount,
  messageIdentityModelCount:
    MessageNormalizationDomainModelCatalog.messageIdentityModelCount,
  relationshipCount: MessageNormalizationModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: MessageNormalizationModelLifecycle.stateCount,
  ownershipCount: MessageNormalizationModelOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationModelBoundaries.prohibitedSurfaceCount,
  relationshipSummary: Object.freeze({
    relationshipCount:
      MessageNormalizationModelRelationshipCatalog.relationshipCount,
    executesRuntime: false as const,
  }),
  modelSummary: Object.freeze({
    domainModelCount: MessageNormalizationDomainModelCatalog.modelCount,
    messageIdentityModelCount:
      MessageNormalizationDomainModelCatalog.messageIdentityModelCount,
  }),
  lifecycleSummary: Object.freeze({
    stateCount: MessageNormalizationModelLifecycle.stateCount,
    currentState: MessageNormalizationModelLifecycle.currentState,
    runtimeStateMachine: false as const,
  }),
  inventory: MessageNormalizationModelInventory,
  registryAnchors: MessageNormalizationModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
