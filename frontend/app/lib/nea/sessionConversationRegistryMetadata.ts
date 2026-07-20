/**
 * NEA-3:2 — Session & Conversation Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

import { SessionConversationCapabilityRegistry } from "./sessionConversationRegistryCapabilities.ts";
import {
  ConversationIdentityRegistry,
  ConversationStateRegistry,
  SessionConversationContextRegistry,
  SessionConversationCorrelationRegistry,
  SessionConversationLifecycleRegistry,
  SessionConversationMessageReferenceRegistry,
  SessionConversationParticipantRegistry,
  SessionConversationStatusRegistry,
  SessionConversationTraceRegistry,
  SessionConversationTypeRegistry,
  SessionIdentityRegistry,
  SessionStateRegistry,
} from "./sessionConversationRegistryCollections.ts";
import { SessionConversationPolicyRegistry } from "./sessionConversationRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const SessionConversationRegistryInventory = Object.freeze({
  inventoryId: "NEA-3:2/RegistryInventory",
  sourcePhase: "NEA-3:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "participants",
      count: SessionConversationParticipantRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "sessionStates",
      count: SessionStateRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "conversationStates",
      count: ConversationStateRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contextDimensions",
      count: SessionConversationContextRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: SessionConversationCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "sessionIdentities",
      count: SessionIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "conversationIdentities",
      count: ConversationIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "conversationTypes",
      count: SessionConversationTypeRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "messageReferenceTypes",
      count: SessionConversationMessageReferenceRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "correlationTypes",
      count: SessionConversationCorrelationRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "traceTypes",
      count: SessionConversationTraceRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: SessionConversationStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "policies",
      count: SessionConversationPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  SessionConversationRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  SessionConversationRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const SessionConversationRegistryMetadata = Object.freeze({
  metadataId: "NEA-3:2/SessionConversationRegistryMetadata",
  sourcePhase: "NEA-3:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-3:3 — Session & Conversation Model",
  sessionIdentityCount: SessionIdentityRegistry.length,
  conversationIdentityCount: ConversationIdentityRegistry.length,
  participantRoleCount: SessionConversationParticipantRegistry.length,
  conversationTypeCount: SessionConversationTypeRegistry.length,
  sessionStateCount: SessionStateRegistry.length,
  conversationStateCount: ConversationStateRegistry.length,
  contextDimensionCount: SessionConversationContextRegistry.length,
  messageReferenceTypeCount:
    SessionConversationMessageReferenceRegistry.length,
  correlationTypeCount: SessionConversationCorrelationRegistry.length,
  traceTypeCount: SessionConversationTraceRegistry.length,
  capabilityCount: SessionConversationCapabilityRegistry.length,
  lifecycleEntryCount: SessionConversationLifecycleRegistry.length,
  statusCount: SessionConversationStatusRegistry.length,
  policyCount: SessionConversationPolicyRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: SessionConversationRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
