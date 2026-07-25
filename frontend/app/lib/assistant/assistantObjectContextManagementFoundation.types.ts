/** ASSISTANT-6:1 — Readonly metadata types for Object & Context Management Foundation. */
export type AssistantObjectContextManagementFoundationStatus = "Foundation";
export type AssistantObjectContextManagementFoundationReadiness =
  "ReadyForRegistry";

export interface AssistantObjectContextManagementIdentityMetadata {
  readonly id: "ASSISTANT-6:1/ObjectContextManagementFoundation";
  readonly name: "Assistant Object & Context Management Foundation";
  readonly phaseId: "ASSISTANT-6:1";
  readonly namespace: "nexora.assistant.object-context-management.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantObjectContextManagementFoundationStatus;
  readonly readiness: AssistantObjectContextManagementFoundationReadiness;
  readonly sourceWorkspaceOrchestration:
    "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementConceptMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
