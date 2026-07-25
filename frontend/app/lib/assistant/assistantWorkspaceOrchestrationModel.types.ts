/** ASSISTANT-5:3 — Readonly metadata types for Workspace Orchestration Model. */
export type AssistantWorkspaceOrchestrationModelStatus = "Model";
export type AssistantWorkspaceOrchestrationModelReadiness =
  "ReadyForValidation";

export interface AssistantWorkspaceOrchestrationDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Workspace Orchestration Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-5:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationRelationshipMetadata {
  readonly identifier: string;
  readonly source: string;
  readonly target: string;
  readonly relationshipType: string;
  readonly registryReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationModelIdentityMetadata {
  readonly id: "ASSISTANT-5:3/WorkspaceOrchestrationModel";
  readonly name: "Assistant Workspace Orchestration Model";
  readonly phaseId: "ASSISTANT-5:3";
  readonly namespace: "nexora.assistant.workspace-orchestration.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantWorkspaceOrchestrationModelStatus;
  readonly readiness: AssistantWorkspaceOrchestrationModelReadiness;
  readonly sourceRegistry: "ASSISTANT-5:2/WorkspaceOrchestrationRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
