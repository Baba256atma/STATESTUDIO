/** ASSISTANT-7:1 — Readonly metadata types for Executive Action Planning Foundation. */
export type AssistantExecutiveActionPlanningFoundationStatus = "Foundation";
export type AssistantExecutiveActionPlanningFoundationReadiness =
  "ReadyForRegistry";

export interface AssistantExecutiveActionPlanningIdentityMetadata {
  readonly id: "ASSISTANT-7:1/ExecutiveActionPlanningFoundation";
  readonly name: "Assistant Executive Action Planning Foundation";
  readonly phaseId: "ASSISTANT-7:1";
  readonly namespace: "nexora.assistant.executive-action-planning.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveActionPlanningFoundationStatus;
  readonly readiness: AssistantExecutiveActionPlanningFoundationReadiness;
  readonly sourceObjectContextManagement:
    "ASSISTANT-6:9/ObjectContextManagementPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly responsibility: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly invariants: readonly string[];
  readonly upstreamReferences: readonly string[];
  readonly downstreamCompatibility: readonly string[];
  readonly version: "1.0.0";
  readonly status: "Declared";
  readonly tags: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly architecturalResponsibility: string;
  readonly supportedConcepts: readonly string[];
  readonly boundaryReference: string;
  readonly lifecycleReference: "ASSISTANT-7:1/Lifecycle";
  readonly version: "1.0.0";
  readonly status: "Declared";
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningConceptMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningPolicyMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly enforceableAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningLifecycleMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningInvariantMetadata {
  readonly id: string;
  readonly statement: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly protectedDomain: string;
  readonly prohibitedResponsibility: string;
  readonly permittedMetadataReferences: readonly string[];
  readonly enforcementIntent: string;
  readonly version: "1.0.0";
  readonly status: "Declared";
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningProhibitedSurfaceMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
