/**
 * NEA-6:2 — Message Normalization Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Message Normalization Registry.
 * Metadata-only. No runtime normalization, parsing, or AI.
 *
 * Ownership: owned exclusively by NEA-6:2.
 */

/** Registry status for NEA-6:2. */
export type MessageNormalizationRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type MessageNormalizationRegistryReadiness = "ReadyForModel";

/** Registry-owned message identity category identifiers. */
export type MessageIdentityCategoryId =
  | "TextMessage"
  | "StructuredMessage"
  | "FileMessage"
  | "AudioMessage"
  | "ImageMessage"
  | "VideoMessage"
  | "EventMessage"
  | "SystemMessage";

/** Registry-owned payload classification identifiers. */
export type PayloadClassificationId =
  | "PlainText"
  | "Markdown"
  | "JSON"
  | "XML"
  | "BinaryReference"
  | "FormData"
  | "StructuredObject"
  | "UnknownPayload";

/** Registry-owned metadata field identifiers. */
export type MetadataFieldId =
  | "Source"
  | "OriginalChannel"
  | "OriginalConnector"
  | "ReceivedTimestamp"
  | "DeliveryTimestamp"
  | "Locale"
  | "Encoding"
  | "ContentType"
  | "Priority"
  | "MessageSize";

/** Registry-owned structural mapping identifiers. */
export type MappingRegistryId =
  | "ChannelToCanonicalChannel"
  | "ConnectorToConnectorIdentity"
  | "AttachmentToAttachmentReference"
  | "PayloadToPayloadType"
  | "MetadataToMetadataModel";

/** Registry-owned normalization policy vocabulary identifiers. */
export type NormalizationPolicyVocabularyId =
  | "PreserveOriginalMeaning"
  | "PreserveOriginalMetadata"
  | "PreserveOrdering"
  | "PreserveCorrelation"
  | "PreserveAttachments"
  | "PreserveTrace"
  | "CanonicalStructureOnly"
  | "NoBusinessInterpretation";

/** Registry-owned status identifiers. */
export type MessageNormalizationStatusId =
  | "Declared"
  | "Registered"
  | "Certified"
  | "Frozen"
  | "Deprecated";

/** Base registry entry shape. */
export interface MessageNormalizationRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-6:1" | "NEA-6:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Declarative message identity registry entry.
 * Registry only — no executable normalization.
 */
export interface MessageIdentityDeclaration {
  readonly messageId: string;
  readonly version: string;
  readonly status: MessageNormalizationStatusId;
  readonly category: MessageIdentityCategoryId;
  readonly executesRuntime: false;
  readonly normalizesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Declarative structural mapping registry entry.
 * Registry only — no runtime mapping.
 */
export interface MappingDeclaration {
  readonly mappingId: string;
  readonly mappingKey: MappingRegistryId;
  readonly source: string;
  readonly target: string;
  readonly mapsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface MessageNormalizationRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-6:2";
  readonly owner: string;
  readonly status: MessageNormalizationRegistryStatus;
  readonly readiness: MessageNormalizationRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface MessageNormalizationRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:2";
  readonly status: MessageNormalizationRegistryStatus;
  readonly readiness: MessageNormalizationRegistryReadiness;
  readonly foundationId: string;
  readonly messageIdentityCount: number;
  readonly payloadCount: number;
  readonly metadataFieldCount: number;
  readonly mappingCount: number;
  readonly normalizationPolicyCount: number;
  readonly statusCount: number;
  readonly contractCount: number;
  readonly contextCount: number;
  readonly attachmentKindCount: number;
  readonly capabilityCount: number;
  readonly lifecycleEntryCount: number;
  readonly registryPolicyCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
