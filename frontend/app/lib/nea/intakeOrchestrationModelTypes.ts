/**
 * NEA-7:3 — Intake Orchestration Model Types.
 *
 * Strongly typed immutable domain model contracts for Intake Orchestration.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-7:3.
 */

/** Model status for NEA-7:3. */
export type IntakeOrchestrationModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type IntakeOrchestrationModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers — exactly twenty. */
export type IntakeOrchestrationModelKind =
  | "ExecutiveIntakePackage"
  | "IntakeIdentity"
  | "IntakeSource"
  | "IntakeContext"
  | "IntakeMetadata"
  | "MessageReference"
  | "SessionReference"
  | "ConversationReference"
  | "AuthenticationReference"
  | "RoutingReference"
  | "ConnectorReference"
  | "WorkspaceReference"
  | "TenantReference"
  | "CorrelationReference"
  | "TraceReference"
  | "AttachmentReference"
  | "IntakeConfiguration"
  | "IntakeDiagnostics"
  | "IntakeResult"
  | "IntakeSummary";

/** Model-phase lifecycle states for domain model artifacts. */
export type IntakeOrchestrationModelLifecycleState =
  | "Declared"
  | "Composed"
  | "Verified"
  | "Published"
  | "Referenced"
  | "Retired";

/** Registry collection names referenced by models. */
export type IntakeOrchestrationRegistryCollectionName =
  | "intakeIdentities"
  | "categories"
  | "priorities"
  | "statuses"
  | "referenceTypes"
  | "metadataFields"
  | "contracts"
  | "lifecycleEntries"
  | "capabilities"
  | "registryPolicies";

/** Domain model kind descriptor. */
export interface IntakeOrchestrationModelKindDescriptor {
  readonly modelKind: IntakeOrchestrationModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly IntakeOrchestrationRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly IntakeOrchestrationModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface IntakeOrchestrationModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: IntakeOrchestrationModelKind;
  readonly targetModelKind: IntakeOrchestrationModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Intake Identity Model — structure only. */
export interface IntakeIdentityModel {
  readonly modelKind: "IntakeIdentity";
  readonly intakeId: string;
  readonly version: string;
  readonly category: string;
  readonly priority: string;
  readonly status: string;
  readonly registryIdentityRef: string;
  readonly assemblesRuntimePackage: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface IntakeOrchestrationModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-7:3";
  readonly owner: string;
  readonly status: IntakeOrchestrationModelStatus;
  readonly readiness: IntakeOrchestrationModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface IntakeOrchestrationModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:3";
  readonly status: IntakeOrchestrationModelStatus;
  readonly readiness: IntakeOrchestrationModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly intakeIdentityModelCount: number;
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
