/**
 * NEA-6:1 — Message Normalization Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Message Normalization.
 * Metadata-only. No runtime normalization, parsing, or AI.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

/** Foundation status for NEA-6:1. */
export type MessageNormalizationFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type MessageNormalizationFoundationReadiness = "ReadyForRegistry";

/** Immutable normalization lifecycle states. */
export type MessageNormalizationLifecycleState =
  | "Received"
  | "Identified"
  | "Mapped"
  | "Normalized"
  | "Verified"
  | "Published";

/** Declarative normalization result identifiers. */
export type MessageNormalizationResultId =
  | "Success"
  | "Warning"
  | "Failed";

/** Declarative context dimension identifiers. */
export type MessageNormalizationContextDimensionId =
  | "Tenant"
  | "Workspace"
  | "Channel"
  | "Connector"
  | "Locale"
  | "Organization"
  | "Timezone";

/** Declarative attachment kind identifiers — references only. */
export type MessageNormalizationAttachmentKindId =
  | "File"
  | "Image"
  | "Video"
  | "Audio"
  | "Document"
  | "Link";

/** Declarative message normalization capability identifiers. */
export type MessageNormalizationCapabilityId =
  | "ChannelMapping"
  | "ContextMapping"
  | "IdentityMapping"
  | "MetadataMapping"
  | "AttachmentMapping"
  | "CorrelationMapping"
  | "TraceMapping"
  | "CanonicalMessageDeclaration";

/** Contract declaration for a message normalization foundation surface. */
export interface MessageNormalizationContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly isCanonicalExecutiveMessage: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Context dimension declaration. */
export interface MessageNormalizationContextDimensionDeclaration {
  readonly dimensionId: MessageNormalizationContextDimensionId;
  readonly dimensionName: string;
  readonly description: string;
  readonly resolvesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Attachment kind declaration — references only. */
export interface MessageNormalizationAttachmentKindDeclaration {
  readonly attachmentKindId: MessageNormalizationAttachmentKindId;
  readonly attachmentKindName: string;
  readonly description: string;
  readonly storesFiles: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Normalization result declaration. */
export interface MessageNormalizationResultDeclaration {
  readonly resultId: MessageNormalizationResultId;
  readonly resultName: string;
  readonly description: string;
  readonly processesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface MessageNormalizationCapabilityDeclaration {
  readonly capabilityId: MessageNormalizationCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface MessageNormalizationFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-6:1";
  readonly owner: string;
  readonly status: MessageNormalizationFoundationStatus;
  readonly readiness: MessageNormalizationFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface MessageNormalizationFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:1";
  readonly status: MessageNormalizationFoundationStatus;
  readonly readiness: MessageNormalizationFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly canonicalExecutiveMessageCount: number;
  readonly contextDimensionCount: number;
  readonly attachmentKindCount: number;
  readonly resultCount: number;
  readonly capabilityCount: number;
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
