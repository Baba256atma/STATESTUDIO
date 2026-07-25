/** ASSISTANT-5:1 — Readonly metadata types for Workspace Orchestration Foundation. */
export type AssistantWorkspaceOrchestrationFoundationStatus = "Foundation";
export type AssistantWorkspaceOrchestrationFoundationReadiness =
  "ReadyForRegistry";

export interface AssistantWorkspaceOrchestrationIdentityMetadata {
  readonly id: "ASSISTANT-5:1/WorkspaceOrchestrationFoundation";
  readonly name: "Assistant Workspace Orchestration Foundation";
  readonly phaseId: "ASSISTANT-5:1";
  readonly namespace: "nexora.assistant.workspace-orchestration.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantWorkspaceOrchestrationFoundationStatus;
  readonly readiness: AssistantWorkspaceOrchestrationFoundationReadiness;
  readonly sourceExecutiveGuidance:
    "ASSISTANT-4:9/ExecutiveGuidancePublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationConceptMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
