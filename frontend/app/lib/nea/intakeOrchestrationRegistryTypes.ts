/**
 * NEA-7:2 — Intake Orchestration Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Intake Orchestration Registry.
 * Metadata-only. No runtime orchestration, assembly, or AI.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

/** Registry status for NEA-7:2. */
export type IntakeOrchestrationRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type IntakeOrchestrationRegistryReadiness = "ReadyForModel";

/** Registry-owned intake identity identifiers. */
export type IntakeIdentityId =
  | "ExecutiveRequest"
  | "ExecutiveCommand"
  | "ExecutiveQuestion"
  | "ExecutiveReport"
  | "ExecutiveNotification"
  | "ExecutiveEvent"
  | "ExecutiveWorkflow"
  | "ExecutiveSystem";

/** Registry-owned intake category identifiers. */
export type IntakeCategoryId =
  | "Request"
  | "Command"
  | "Question"
  | "Report"
  | "Notification"
  | "Event"
  | "Workflow"
  | "System";

/** Registry-owned intake priority identifiers. */
export type IntakePriorityId =
  | "Critical"
  | "High"
  | "Normal"
  | "Low"
  | "Deferred";

/** Registry-owned intake status identifiers. */
export type IntakeStatusId =
  | "Registered"
  | "Pending"
  | "Ready"
  | "Verified"
  | "Published"
  | "Archived";

/** Registry-owned intake reference type identifiers. */
export type IntakeReferenceTypeId =
  | "Message"
  | "Session"
  | "Conversation"
  | "Authentication"
  | "Routing"
  | "Connector"
  | "Workspace"
  | "Tenant"
  | "Correlation"
  | "Trace";

/** Registry-owned metadata field identifiers. */
export type IntakeMetadataFieldId =
  | "SourcePhase"
  | "AssembledAt"
  | "ArchitectureVersion"
  | "Completeness"
  | "ContextId"
  | "WorkspaceRef"
  | "TenantRef"
  | "ChannelRef"
  | "OriginPhase"
  | "OriginPublicIndex";

/** Base registry entry shape. */
export interface IntakeOrchestrationRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-7:1" | "NEA-7:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Declarative intake identity registry entry.
 * Registry only — no executable package assembly.
 */
export interface IntakeIdentityDeclaration {
  readonly intakeId: string;
  readonly version: string;
  readonly category: IntakeCategoryId;
  readonly status: IntakeStatusId;
  readonly priority: IntakePriorityId;
  readonly assemblesRuntimePackage: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface IntakeOrchestrationRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-7:2";
  readonly owner: string;
  readonly status: IntakeOrchestrationRegistryStatus;
  readonly readiness: IntakeOrchestrationRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface IntakeOrchestrationRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:2";
  readonly status: IntakeOrchestrationRegistryStatus;
  readonly readiness: IntakeOrchestrationRegistryReadiness;
  readonly foundationId: string;
  readonly intakeIdentityCount: number;
  readonly categoryCount: number;
  readonly priorityCount: number;
  readonly statusCount: number;
  readonly referenceTypeCount: number;
  readonly metadataFieldCount: number;
  readonly registryPolicyCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly lifecycleEntryCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
