/** ASSISTANT-5:6 — Readonly metadata types for Workspace Orchestration Platform. */
export interface AssistantWorkspaceOrchestrationPlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-5:5/WorkspaceOrchestrationManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationPlatformIdentityMetadata {
  readonly id: "ASSISTANT-5:6/WorkspaceOrchestrationPlatform";
  readonly name: "Assistant Workspace Orchestration Platform";
  readonly phaseId: "ASSISTANT-5:6";
  readonly namespace: "nexora.assistant.workspace-orchestration.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-5:5/WorkspaceOrchestrationManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
