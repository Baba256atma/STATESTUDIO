/**
 * NEA-7:1 — Intake Orchestration Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Intake Orchestration.
 * Metadata-only. No runtime orchestration, execution, or AI.
 *
 * Ownership: owned exclusively by NEA-7:1.
 */

/** Foundation status for NEA-7:1. */
export type IntakeOrchestrationFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type IntakeOrchestrationFoundationReadiness = "ReadyForRegistry";

/** Immutable intake orchestration lifecycle states. */
export type IntakeOrchestrationLifecycleState =
  | "Collected"
  | "Referenced"
  | "Assembled"
  | "Verified"
  | "ReadyForDKL"
  | "Published";

/** Declarative intake result identifiers. */
export type IntakeOrchestrationResultId =
  | "Complete"
  | "Incomplete"
  | "Failed";

/** Declarative intake reference group identifiers — exactly ten. */
export type IntakeOrchestrationReferenceGroupId =
  | "MessageReference"
  | "SessionReference"
  | "ConversationReference"
  | "AuthenticationReference"
  | "RoutingReference"
  | "ConnectorReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "CorrelationReference"
  | "TraceReference";

/** Declarative attachment reference kind identifiers. */
export type IntakeOrchestrationAttachmentKindId =
  | "File"
  | "Image"
  | "Document"
  | "Link";

/** Declarative intake orchestration capability identifiers. */
export type IntakeOrchestrationCapabilityId =
  | "IntakeAssemblyDeclaration"
  | "IntakeReferenceAggregation"
  | "IntakeCompletenessDeclaration"
  | "IntakeMetadataDeclaration"
  | "IntakeCorrelationDeclaration"
  | "IntakePublicationDeclaration"
  | "IntakeSummaryDeclaration"
  | "IntakeBoundaryDeclaration";

/** Contract declaration for an intake orchestration foundation surface. */
export interface IntakeOrchestrationContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly isCanonicalExecutiveIntakePackage: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Reference group declaration. */
export interface IntakeOrchestrationReferenceGroupDeclaration {
  readonly referenceGroupId: IntakeOrchestrationReferenceGroupId;
  readonly referenceGroupName: string;
  readonly description: string;
  readonly resolvesAtRuntime: false;
  readonly duplicatesUpstreamContent: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Attachment kind declaration — references only. */
export interface IntakeOrchestrationAttachmentKindDeclaration {
  readonly attachmentKindId: IntakeOrchestrationAttachmentKindId;
  readonly attachmentKindName: string;
  readonly description: string;
  readonly storesFiles: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Intake result declaration. */
export interface IntakeOrchestrationResultDeclaration {
  readonly resultId: IntakeOrchestrationResultId;
  readonly resultName: string;
  readonly description: string;
  readonly processesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface IntakeOrchestrationCapabilityDeclaration {
  readonly capabilityId: IntakeOrchestrationCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface IntakeOrchestrationFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-7:1";
  readonly owner: string;
  readonly status: IntakeOrchestrationFoundationStatus;
  readonly readiness: IntakeOrchestrationFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface IntakeOrchestrationFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:1";
  readonly status: IntakeOrchestrationFoundationStatus;
  readonly readiness: IntakeOrchestrationFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly canonicalExecutiveIntakePackageCount: number;
  readonly referenceGroupCount: number;
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
