/**
 * NEA-3:3 — Session & Conversation Model Metadata.
 *
 * Immutable model metadata and inventory descriptors.
 * Counts are derived exclusively from canonical model collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:3.
 */

import { SessionConversationModelLifecycle } from "./sessionConversationModelLifecycle.ts";
import {
  SessionConversationModelBoundaries,
  SessionConversationModelOwnership,
} from "./sessionConversationModelOwnership.ts";
import {
  SessionConversationDomainModelCatalog,
  SessionConversationModelRegistryAnchors,
} from "./sessionConversationModels.ts";
import { SessionConversationModelRelationshipCatalog } from "./sessionConversationRelationships.ts";

/** Named inventory distinguishing created vs referenced items. */
export const SessionConversationModelInventory = Object.freeze({
  inventoryId: "NEA-3:3/ModelInventory",
  sourcePhase: "NEA-3:3" as const,
  createdByModel: Object.freeze([
    Object.freeze({
      collection: "domainModels",
      count: SessionConversationDomainModelCatalog.modelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "sessionIdentityModels",
      count: SessionConversationDomainModelCatalog.sessionIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "conversationIdentityModels",
      count: SessionConversationDomainModelCatalog.conversationIdentityModelCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "relationships",
      count: SessionConversationModelRelationshipCatalog.relationshipCount,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "lifecycleStates",
      count: SessionConversationModelLifecycle.stateCount,
      ownership: "Created" as const,
    }),
  ]),
  referencedFromRegistry: Object.freeze([
    Object.freeze({
      collection: "sessionIdentities",
      count: SessionConversationModelRegistryAnchors.sessionIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "conversationIdentities",
      count: SessionConversationModelRegistryAnchors.conversationIdentityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "participants",
      count: SessionConversationModelRegistryAnchors.participantRoleCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "conversationTypes",
      count: SessionConversationModelRegistryAnchors.conversationTypeCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contextDimensions",
      count: SessionConversationModelRegistryAnchors.contextDimensionCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: SessionConversationModelRegistryAnchors.capabilityCount,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: SessionConversationModelRegistryAnchors.policyCount,
      ownership: "Referenced" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable model metadata. */
export const SessionConversationModelMetadata = Object.freeze({
  metadataId: "NEA-3:3/SessionConversationModelMetadata",
  sourcePhase: "NEA-3:3" as const,
  modelStatus: "Model" as const,
  modelVersion: "1.0.0" as const,
  readiness: "ReadyForValidation" as const,
  nextPhase: "NEA-3:4 — Session & Conversation Validation",
  domainModelCount: SessionConversationDomainModelCatalog.modelCount,
  sessionIdentityModelCount:
    SessionConversationDomainModelCatalog.sessionIdentityModelCount,
  conversationIdentityModelCount:
    SessionConversationDomainModelCatalog.conversationIdentityModelCount,
  relationshipCount: SessionConversationModelRelationshipCatalog.relationshipCount,
  lifecycleStateCount: SessionConversationModelLifecycle.stateCount,
  ownershipCount: SessionConversationModelOwnership.ownsCount,
  nonOwnershipCount: SessionConversationModelOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationModelBoundaries.prohibitedSurfaceCount,
  inventory: SessionConversationModelInventory,
  registryAnchors: SessionConversationModelRegistryAnchors,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
