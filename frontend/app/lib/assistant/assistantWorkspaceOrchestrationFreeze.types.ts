/** ASSISTANT-5:8 — Readonly metadata types for Workspace Orchestration Freeze. */
export interface AssistantWorkspaceOrchestrationFreezeBaselineMetadata {
  readonly baselineId: string;
  readonly name: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification:
    "ASSISTANT-5:7/WorkspaceOrchestrationCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationFreezeArchitecturalLockMetadata {
  readonly lockId: string;
  readonly name: string;
  readonly description: string;
  readonly protectedTarget: string;
  readonly lockStatus: "Locked";
  readonly version: "1.0.0";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationFreezeRegistryEntryMetadata {
  readonly entryId: string;
  readonly name: string;
  readonly canonicalIdentity: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationFreezeIdentityMetadata {
  readonly id: "ASSISTANT-5:8/WorkspaceOrchestrationFreeze";
  readonly name: "Assistant Workspace Orchestration Freeze";
  readonly phaseId: "ASSISTANT-5:8";
  readonly namespace: "nexora.assistant.workspace-orchestration.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification:
    "ASSISTANT-5:7/WorkspaceOrchestrationCertification";
  readonly lockIdentifier: "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
