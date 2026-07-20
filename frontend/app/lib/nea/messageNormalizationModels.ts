/**
 * NEA-6:3 — Message Normalization Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No normalization execution. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:3.
 */

import {
  MessageNormalizationRegistryId,
  MessageNormalizationRegistryPlatform,
} from "./messageNormalizationRegistry.ts";
import type {
  MessageIdentityModel,
  MessageNormalizationModelKindDescriptor,
} from "./messageNormalizationModelTypes.ts";

const registry = MessageNormalizationRegistryPlatform;

const kind = (
  modelKind: MessageNormalizationModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: MessageNormalizationModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: MessageNormalizationModelKindDescriptor["composesModels"],
  order: number,
): MessageNormalizationModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Message Normalization domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const MessageNormalizationDomainModels: readonly MessageNormalizationModelKindDescriptor[] =
  Object.freeze([
    kind(
      "ExecutiveMessage",
      "Executive Message Model",
      "Canonical Executive Message structure composed from Registry references.",
      Object.freeze([
        "messageIdentities",
        "contracts",
        "contexts",
        "attachmentKinds",
        "metadataFields",
        "mappings",
      ]),
      15,
      Object.freeze([
        "MessageIdentity",
        "Sender",
        "Recipient",
        "Payload",
        "Metadata",
        "Context",
        "Attachment",
        "Correlation",
        "DeliveryMetadata",
        "SessionReference",
        "ConversationReference",
        "NormalizationResult",
      ]),
      1,
    ),
    kind(
      "MessageIdentity",
      "Message Identity Model",
      "Immutable message identity structure.",
      Object.freeze(["messageIdentities", "statuses"]),
      4,
      Object.freeze([]),
      2,
    ),
    kind(
      "Sender",
      "Sender Model",
      "Immutable sender structure — no authentication.",
      Object.freeze(["contracts"]),
      3,
      Object.freeze([]),
      3,
    ),
    kind(
      "Recipient",
      "Recipient Model",
      "Immutable recipient structure — no delivery execution.",
      Object.freeze(["contracts"]),
      3,
      Object.freeze([]),
      4,
    ),
    kind(
      "Payload",
      "Payload Model",
      "Immutable payload structure — no payload parsing.",
      Object.freeze(["payloads", "mappings"]),
      4,
      Object.freeze(["PayloadType"]),
      5,
    ),
    kind(
      "PayloadType",
      "Payload Type Model",
      "Canonical payload classification metadata.",
      Object.freeze(["payloads"]),
      3,
      Object.freeze([]),
      6,
    ),
    kind(
      "Metadata",
      "Metadata Model",
      "Immutable message metadata structure.",
      Object.freeze(["metadataFields"]),
      5,
      Object.freeze([]),
      7,
    ),
    kind(
      "Context",
      "Context Model",
      "Immutable normalization context composed from Registry references.",
      Object.freeze(["contexts"]),
      5,
      Object.freeze([
        "WorkspaceReference",
        "TenantReference",
        "ChannelReference",
        "ConnectorReference",
      ]),
      8,
    ),
    kind(
      "Attachment",
      "Attachment Model",
      "Immutable attachment reference structure — no file storage.",
      Object.freeze(["attachmentKinds"]),
      4,
      Object.freeze([]),
      9,
    ),
    kind(
      "Correlation",
      "Correlation Model",
      "Immutable correlation structure — no correlation runtime.",
      Object.freeze(["contracts", "mappings"]),
      3,
      Object.freeze(["Trace"]),
      10,
    ),
    kind(
      "Trace",
      "Trace Model",
      "Immutable tracing metadata — no distributed tracing runtime.",
      Object.freeze(["contracts"]),
      3,
      Object.freeze([]),
      11,
    ),
    kind(
      "DeliveryMetadata",
      "Delivery Metadata Model",
      "Immutable delivery metadata — no delivery execution.",
      Object.freeze(["metadataFields", "contracts"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "SessionReference",
      "Session Reference Model",
      "Opaque session reference — no session runtime.",
      Object.freeze(["contracts"]),
      3,
      Object.freeze([]),
      13,
    ),
    kind(
      "ConversationReference",
      "Conversation Reference Model",
      "Opaque conversation reference — no conversation management.",
      Object.freeze(["contracts"]),
      3,
      Object.freeze([]),
      14,
    ),
    kind(
      "WorkspaceReference",
      "Workspace Reference Model",
      "Immutable workspace context reference.",
      Object.freeze(["contexts"]),
      2,
      Object.freeze([]),
      15,
    ),
    kind(
      "TenantReference",
      "Tenant Reference Model",
      "Immutable tenant context reference.",
      Object.freeze(["contexts"]),
      2,
      Object.freeze([]),
      16,
    ),
    kind(
      "ChannelReference",
      "Channel Reference Model",
      "Immutable channel context reference.",
      Object.freeze(["contexts"]),
      2,
      Object.freeze([]),
      17,
    ),
    kind(
      "ConnectorReference",
      "Connector Reference Model",
      "Immutable connector context reference.",
      Object.freeze(["contexts"]),
      2,
      Object.freeze([]),
      18,
    ),
    kind(
      "NormalizationResult",
      "Normalization Result Model",
      "Declarative normalization result metadata — no runtime processing.",
      Object.freeze(["statuses", "contracts"]),
      3,
      Object.freeze([]),
      19,
    ),
    kind(
      "MessageSummary",
      "Message Summary Model",
      "Immutable aggregate metadata for a normalized message exchange.",
      Object.freeze(["messageIdentities", "statuses", "contracts"]),
      5,
      Object.freeze(["ExecutiveMessage", "NormalizationResult"]),
      20,
    ),
  ]);

/**
 * Message identity model instances derived from Registry message identities.
 * Structure only — no runtime normalization.
 */
export const MessageIdentityModels: readonly MessageIdentityModel[] =
  Object.freeze(
    registry.collections.messageIdentities.map((item) =>
      Object.freeze({
        modelKind: "MessageIdentity" as const,
        messageId: item.messageId,
        version: item.version,
        status: item.status,
        category: item.category,
        registryIdentityRef: item.messageId,
        normalizesAtRuntime: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const MessageNormalizationModelRegistryAnchors = Object.freeze({
  registryId: MessageNormalizationRegistryId,
  sourcePhase: "NEA-6:3" as const,
  messageIdentityCount: registry.collections.messageIdentityCount,
  payloadCount: registry.collections.payloadCount,
  metadataFieldCount: registry.collections.metadataFieldCount,
  mappingCount: registry.collections.mappingCount,
  normalizationPolicyCount: registry.collections.normalizationPolicyCount,
  statusCount: registry.collections.statusCount,
  contractCount: registry.collections.contractCount,
  contextCount: registry.collections.contextCount,
  attachmentKindCount: registry.collections.attachmentKindCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  ownershipEntryCount: registry.collections.ownershipEntryCount,
  boundaryEntryCount: registry.collections.boundaryEntryCount,
  capabilityCount: registry.capabilities.capabilityCount,
  registryPolicyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const MessageNormalizationDomainModelCatalog = Object.freeze({
  catalogId: "NEA-6:3/DomainModelCatalog",
  sourcePhase: "NEA-6:3" as const,
  models: MessageNormalizationDomainModels,
  modelCount: MessageNormalizationDomainModels.length,
  messageIdentityModels: MessageIdentityModels,
  messageIdentityModelCount: MessageIdentityModels.length,
  registryAnchors: MessageNormalizationModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
