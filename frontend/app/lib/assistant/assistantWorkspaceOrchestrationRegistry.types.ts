/** ASSISTANT-5:2 — Readonly metadata types for Workspace Orchestration Registry. */
export type AssistantWorkspaceOrchestrationRegistryStatus = "Registry";
export type AssistantWorkspaceOrchestrationRegistryReadiness = "ReadyForModel";

export interface AssistantWorkspaceOrchestrationRegistryEntry {
  readonly identifier: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: "1.0.0";
  readonly lifecycle: "Active";
  readonly status: "Registered";
  readonly tags: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationRegistryIdentityMetadata {
  readonly id: "ASSISTANT-5:2/WorkspaceOrchestrationRegistry";
  readonly name: "Assistant Workspace Orchestration Registry";
  readonly phaseId: "ASSISTANT-5:2";
  readonly namespace: "nexora.assistant.workspace-orchestration.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantWorkspaceOrchestrationRegistryStatus;
  readonly readiness: AssistantWorkspaceOrchestrationRegistryReadiness;
  readonly sourceFoundation: "ASSISTANT-5:1/WorkspaceOrchestrationFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
