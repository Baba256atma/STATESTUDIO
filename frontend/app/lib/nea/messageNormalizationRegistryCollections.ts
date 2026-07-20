/**
 * NEA-6:2 — Message Normalization Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation contracts, contexts, attachments, lifecycle, ownership, and
 * boundaries are referenced — not duplicated.
 * Registry-owned vocabularies and message identities are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:2.
 */

import {
  MessageNormalizationFoundationId,
  MessageNormalizationFoundationPlatform,
} from "./messageNormalizationFoundation.ts";
import type {
  MappingDeclaration,
  MappingRegistryId,
  MessageIdentityCategoryId,
  MessageIdentityDeclaration,
  MessageNormalizationRegistryEntry,
  MessageNormalizationStatusId,
  MetadataFieldId,
  NormalizationPolicyVocabularyId,
  PayloadClassificationId,
} from "./messageNormalizationRegistryTypes.ts";

const foundation = MessageNormalizationFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-6:1" | "NEA-6:2",
  foundationReference: string | null,
  order: number,
): MessageNormalizationRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Contract registry — Foundation canonical references preserved. */
export const MessageContractRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contracts.map((item) =>
      entry(
        item.contractId.split("/").at(-1) ?? item.contractId,
        item.contractName,
        item.description,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/contracts/${item.contractId.split("/").at(-1)}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Context registry — Foundation canonical references preserved. */
export const MessageContextRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.contexts.contextDimensions.map((item) =>
      entry(
        item.dimensionId,
        item.dimensionName,
        item.description,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/contexts/${item.dimensionId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Attachment kind registry — Foundation canonical references preserved. */
export const MessageAttachmentKindRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.attachments.attachmentKinds.map((item) =>
      entry(
        item.attachmentKindId,
        item.attachmentKindName,
        item.description,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/attachments/${item.attachmentKindId}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const MessageLifecycleRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation normalization lifecycle state ${state}.`,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

/** Ownership registry — Foundation canonical references preserved. */
export const MessageOwnershipRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.ownership.owns.map((item, index) =>
      entry(
        item,
        item,
        `Foundation ownership surface ${item}.`,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/ownership/${encodeURIComponent(item)}`,
        index + 1,
      ),
    ),
  );

/** Boundaries registry — Foundation canonical references preserved. */
export const MessageBoundariesRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.boundaries.prohibitedSurfaces.map((item, index) =>
      entry(
        item,
        item,
        `Foundation prohibited surface ${item}.`,
        "NEA-6:1",
        `${MessageNormalizationFoundationId}/boundaries/${encodeURIComponent(item)}`,
        index + 1,
      ),
    ),
  );

const messageIdentity = (
  category: MessageIdentityCategoryId,
  statusId: MessageNormalizationStatusId,
  order: number,
): MessageIdentityDeclaration =>
  Object.freeze({
    messageId: `NEA-6:2/MessageIdentity/${category}`,
    version: "1.0.0" as const,
    status: statusId,
    category,
    executesRuntime: false as const,
    normalizesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Message identity registry — declarative identities only.
 * No executable normalization or payload parsing.
 */
export const MessageIdentityRegistry: readonly MessageIdentityDeclaration[] =
  Object.freeze([
    messageIdentity("TextMessage", "Registered", 1),
    messageIdentity("StructuredMessage", "Registered", 2),
    messageIdentity("FileMessage", "Registered", 3),
    messageIdentity("AudioMessage", "Registered", 4),
    messageIdentity("ImageMessage", "Registered", 5),
    messageIdentity("VideoMessage", "Registered", 6),
    messageIdentity("EventMessage", "Registered", 7),
    messageIdentity("SystemMessage", "Registered", 8),
  ]);

const payload = (
  id: PayloadClassificationId,
  description: string,
  order: number,
): MessageNormalizationRegistryEntry =>
  entry(id, id, description, "NEA-6:2", null, order);

/** Payload registry — Registry-owned. Declarations only. */
export const PayloadRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze([
    payload("PlainText", "Plain text payload classification declaration.", 1),
    payload("Markdown", "Markdown payload classification declaration.", 2),
    payload("JSON", "JSON payload classification declaration.", 3),
    payload("XML", "XML payload classification declaration.", 4),
    payload(
      "BinaryReference",
      "Binary reference payload classification declaration.",
      5,
    ),
    payload("FormData", "Form data payload classification declaration.", 6),
    payload(
      "StructuredObject",
      "Structured object payload classification declaration.",
      7,
    ),
    payload(
      "UnknownPayload",
      "Unknown payload classification declaration.",
      8,
    ),
  ]);

const metadataField = (
  id: MetadataFieldId,
  description: string,
  order: number,
): MessageNormalizationRegistryEntry =>
  entry(id, id, description, "NEA-6:2", null, order);

/** Metadata field registry — Registry-owned. Declarations only. */
export const MetadataFieldRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze([
    metadataField("Source", "Canonical source metadata field declaration.", 1),
    metadataField(
      "OriginalChannel",
      "Canonical original channel metadata field declaration.",
      2,
    ),
    metadataField(
      "OriginalConnector",
      "Canonical original connector metadata field declaration.",
      3,
    ),
    metadataField(
      "ReceivedTimestamp",
      "Canonical received timestamp metadata field declaration.",
      4,
    ),
    metadataField(
      "DeliveryTimestamp",
      "Canonical delivery timestamp metadata field declaration.",
      5,
    ),
    metadataField("Locale", "Canonical locale metadata field declaration.", 6),
    metadataField(
      "Encoding",
      "Canonical encoding metadata field declaration.",
      7,
    ),
    metadataField(
      "ContentType",
      "Canonical content type metadata field declaration.",
      8,
    ),
    metadataField(
      "Priority",
      "Canonical priority metadata field declaration.",
      9,
    ),
    metadataField(
      "MessageSize",
      "Canonical message size metadata field declaration.",
      10,
    ),
  ]);

const mapping = (
  key: MappingRegistryId,
  source: string,
  target: string,
  order: number,
): MappingDeclaration =>
  Object.freeze({
    mappingId: `NEA-6:2/Mapping/${key}`,
    mappingKey: key,
    source,
    target,
    mapsAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Mapping registry — structural mappings only. No runtime mapping. */
export const MappingRegistry: readonly MappingDeclaration[] = Object.freeze([
  mapping(
    "ChannelToCanonicalChannel",
    "Channel",
    "Canonical Channel",
    1,
  ),
  mapping(
    "ConnectorToConnectorIdentity",
    "Connector",
    "Connector Identity",
    2,
  ),
  mapping(
    "AttachmentToAttachmentReference",
    "Attachment",
    "Attachment Reference",
    3,
  ),
  mapping("PayloadToPayloadType", "Payload", "Payload Type", 4),
  mapping("MetadataToMetadataModel", "Metadata", "Metadata Model", 5),
]);

const normalizationPolicy = (
  id: NormalizationPolicyVocabularyId,
  label: string,
  description: string,
  order: number,
): MessageNormalizationRegistryEntry =>
  entry(id, label, description, "NEA-6:2", null, order);

/** Normalization policy vocabulary registry — declarations only. */
export const NormalizationPolicyVocabularyRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze([
    normalizationPolicy(
      "PreserveOriginalMeaning",
      "Preserve Original Meaning",
      "Preserve-original-meaning architectural policy declaration.",
      1,
    ),
    normalizationPolicy(
      "PreserveOriginalMetadata",
      "Preserve Original Metadata",
      "Preserve-original-metadata architectural policy declaration.",
      2,
    ),
    normalizationPolicy(
      "PreserveOrdering",
      "Preserve Ordering",
      "Preserve-ordering architectural policy declaration.",
      3,
    ),
    normalizationPolicy(
      "PreserveCorrelation",
      "Preserve Correlation",
      "Preserve-correlation architectural policy declaration.",
      4,
    ),
    normalizationPolicy(
      "PreserveAttachments",
      "Preserve Attachments",
      "Preserve-attachments architectural policy declaration.",
      5,
    ),
    normalizationPolicy(
      "PreserveTrace",
      "Preserve Trace",
      "Preserve-trace architectural policy declaration.",
      6,
    ),
    normalizationPolicy(
      "CanonicalStructureOnly",
      "Canonical Structure Only",
      "Canonical-structure-only architectural policy declaration.",
      7,
    ),
    normalizationPolicy(
      "NoBusinessInterpretation",
      "No Business Interpretation",
      "No-business-interpretation architectural policy declaration.",
      8,
    ),
  ]);

const status = (
  id: MessageNormalizationStatusId,
  description: string,
  order: number,
): MessageNormalizationRegistryEntry =>
  entry(id, id, description, "NEA-6:2", null, order);

/** Status registry — Registry-owned. Declarations only. */
export const MessageStatusRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze([
    status("Declared", "Architecture declared normalization status.", 1),
    status("Registered", "Architecture registered normalization status.", 2),
    status("Certified", "Architecture certified normalization status.", 3),
    status("Frozen", "Architecture frozen normalization status.", 4),
    status("Deprecated", "Architecture deprecated normalization status.", 5),
  ]);

/** Aggregate collections object for platform composition. */
export const MessageNormalizationRegistryCollections = Object.freeze({
  collectionsId: "NEA-6:2/RegistryCollections",
  sourcePhase: "NEA-6:2" as const,
  messageIdentities: MessageIdentityRegistry,
  payloads: PayloadRegistry,
  metadataFields: MetadataFieldRegistry,
  mappings: MappingRegistry,
  normalizationPolicies: NormalizationPolicyVocabularyRegistry,
  statuses: MessageStatusRegistry,
  contracts: MessageContractRegistry,
  contexts: MessageContextRegistry,
  attachmentKinds: MessageAttachmentKindRegistry,
  lifecycleEntries: MessageLifecycleRegistry,
  ownershipEntries: MessageOwnershipRegistry,
  boundaryEntries: MessageBoundariesRegistry,
  messageIdentityCount: MessageIdentityRegistry.length,
  payloadCount: PayloadRegistry.length,
  metadataFieldCount: MetadataFieldRegistry.length,
  mappingCount: MappingRegistry.length,
  normalizationPolicyCount: NormalizationPolicyVocabularyRegistry.length,
  statusCount: MessageStatusRegistry.length,
  contractCount: MessageContractRegistry.length,
  contextCount: MessageContextRegistry.length,
  attachmentKindCount: MessageAttachmentKindRegistry.length,
  lifecycleEntryCount: MessageLifecycleRegistry.length,
  ownershipEntryCount: MessageOwnershipRegistry.length,
  boundaryEntryCount: MessageBoundariesRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
