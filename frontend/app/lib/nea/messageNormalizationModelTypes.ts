/**
 * NEA-6:3 — Message Normalization Model Types.
 *
 * Strongly typed immutable domain model contracts for Message Normalization.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-6:3.
 */

/** Model status for NEA-6:3. */
export type MessageNormalizationModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type MessageNormalizationModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers — exactly twenty. */
export type MessageNormalizationModelKind =
  | "ExecutiveMessage"
  | "MessageIdentity"
  | "Sender"
  | "Recipient"
  | "Payload"
  | "PayloadType"
  | "Metadata"
  | "Context"
  | "Attachment"
  | "Correlation"
  | "Trace"
  | "DeliveryMetadata"
  | "SessionReference"
  | "ConversationReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "ChannelReference"
  | "ConnectorReference"
  | "NormalizationResult"
  | "MessageSummary";

/** Model-phase lifecycle states for domain model artifacts. */
export type MessageNormalizationModelLifecycleState =
  | "Declared"
  | "Composed"
  | "Verified"
  | "Published"
  | "Referenced"
  | "Retired";

/** Registry collection names referenced by models. */
export type MessageNormalizationRegistryCollectionName =
  | "messageIdentities"
  | "payloads"
  | "metadataFields"
  | "mappings"
  | "normalizationPolicies"
  | "statuses"
  | "contracts"
  | "contexts"
  | "attachmentKinds"
  | "lifecycleEntries"
  | "ownershipEntries"
  | "boundaryEntries"
  | "capabilities"
  | "registryPolicies";

/** Registry reference — never duplicates registry values. */
export interface MessageNormalizationRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection: MessageNormalizationRegistryCollectionName;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Domain model kind descriptor. */
export interface MessageNormalizationModelKindDescriptor {
  readonly modelKind: MessageNormalizationModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly MessageNormalizationRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly MessageNormalizationModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface MessageNormalizationModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: MessageNormalizationModelKind;
  readonly targetModelKind: MessageNormalizationModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Message Identity Model — structure only. */
export interface MessageIdentityModel {
  readonly modelKind: "MessageIdentity";
  readonly messageId: string;
  readonly version: string;
  readonly status: string;
  readonly category: string;
  readonly registryIdentityRef: string;
  readonly normalizesAtRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface MessageNormalizationModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-6:3";
  readonly owner: string;
  readonly status: MessageNormalizationModelStatus;
  readonly readiness: MessageNormalizationModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface MessageNormalizationModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:3";
  readonly status: MessageNormalizationModelStatus;
  readonly readiness: MessageNormalizationModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly messageIdentityModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
