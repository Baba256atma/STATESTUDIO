/**
 * NEA-6:2 — Message Normalization Registry Metadata.
 *
 * Immutable registry metadata and inventory descriptors.
 * Counts are derived exclusively from canonical registry collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:2.
 */

import { MessageNormalizationCapabilityRegistry } from "./messageNormalizationRegistryCapabilities.ts";
import {
  MappingRegistry,
  MessageAttachmentKindRegistry,
  MessageBoundariesRegistry,
  MessageContractRegistry,
  MessageContextRegistry,
  MessageIdentityRegistry,
  MessageLifecycleRegistry,
  MessageOwnershipRegistry,
  MessageStatusRegistry,
  MetadataFieldRegistry,
  NormalizationPolicyVocabularyRegistry,
  PayloadRegistry,
} from "./messageNormalizationRegistryCollections.ts";
import { MessageNormalizationRegistryPolicyRegistry } from "./messageNormalizationRegistryPolicies.ts";

/** Named collection inventory for reporting created vs inherited items. */
export const MessageNormalizationRegistryInventory = Object.freeze({
  inventoryId: "NEA-6:2/RegistryInventory",
  sourcePhase: "NEA-6:2" as const,
  inheritedFromFoundation: Object.freeze([
    Object.freeze({
      collection: "contracts",
      count: MessageContractRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "contexts",
      count: MessageContextRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "attachmentKinds",
      count: MessageAttachmentKindRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "capabilities",
      count: MessageNormalizationCapabilityRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "lifecycleEntries",
      count: MessageLifecycleRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "ownershipEntries",
      count: MessageOwnershipRegistry.length,
      ownership: "Referenced" as const,
    }),
    Object.freeze({
      collection: "boundaryEntries",
      count: MessageBoundariesRegistry.length,
      ownership: "Referenced" as const,
    }),
  ]),
  createdByRegistry: Object.freeze([
    Object.freeze({
      collection: "messageIdentities",
      count: MessageIdentityRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "payloads",
      count: PayloadRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "metadataFields",
      count: MetadataFieldRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "mappings",
      count: MappingRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "normalizationPolicies",
      count: NormalizationPolicyVocabularyRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "statuses",
      count: MessageStatusRegistry.length,
      ownership: "Created" as const,
    }),
    Object.freeze({
      collection: "registryPolicies",
      count: MessageNormalizationRegistryPolicyRegistry.length,
      ownership: "Created" as const,
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inheritedEntryCount =
  MessageNormalizationRegistryInventory.inheritedFromFoundation.reduce(
    (sum, item) => sum + item.count,
    0,
  );

const createdEntryCount =
  MessageNormalizationRegistryInventory.createdByRegistry.reduce(
    (sum, item) => sum + item.count,
    0,
  );

/** Canonical immutable registry metadata. */
export const MessageNormalizationRegistryMetadata = Object.freeze({
  metadataId: "NEA-6:2/MessageNormalizationRegistryMetadata",
  sourcePhase: "NEA-6:2" as const,
  registryStatus: "Registry" as const,
  registryVersion: "1.0.0" as const,
  readiness: "ReadyForModel" as const,
  nextPhase: "NEA-6:3 — Message Normalization Model",
  messageIdentityCount: MessageIdentityRegistry.length,
  payloadCount: PayloadRegistry.length,
  metadataFieldCount: MetadataFieldRegistry.length,
  mappingCount: MappingRegistry.length,
  normalizationPolicyCount: NormalizationPolicyVocabularyRegistry.length,
  statusCount: MessageStatusRegistry.length,
  contractCount: MessageContractRegistry.length,
  contextCount: MessageContextRegistry.length,
  attachmentKindCount: MessageAttachmentKindRegistry.length,
  capabilityCount: MessageNormalizationCapabilityRegistry.length,
  lifecycleEntryCount: MessageLifecycleRegistry.length,
  ownershipEntryCount: MessageOwnershipRegistry.length,
  boundaryEntryCount: MessageBoundariesRegistry.length,
  registryPolicyCount: MessageNormalizationRegistryPolicyRegistry.length,
  inheritedEntryCount,
  createdEntryCount,
  totalEntryCount: inheritedEntryCount + createdEntryCount,
  inventory: MessageNormalizationRegistryInventory,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
