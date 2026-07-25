/** ASSISTANT-5:7 — Readonly metadata types for Workspace Orchestration Certification. */
export interface AssistantWorkspaceOrchestrationCertificationCriterionMetadata {
  readonly criterionId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: "Certified";
  readonly validationTarget: "ASSISTANT-5:6/WorkspaceOrchestrationPlatform";
  readonly expectedResult: "Certified";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCertificationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCertificationResultMetadata {
  readonly certificationStatus: "Certified";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly passed: number;
  readonly failed: 0;
  readonly warnings: 0;
  readonly readiness: "ReadyForFreeze";
  readonly freezeEligibility: "Eligible";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCertificationIdentityMetadata {
  readonly id: "ASSISTANT-5:7/WorkspaceOrchestrationCertification";
  readonly name: "Assistant Workspace Orchestration Certification";
  readonly phaseId: "ASSISTANT-5:7";
  readonly namespace: "nexora.assistant.workspace-orchestration.certification";
  readonly version: "1.0.0";
  readonly status: "Certification";
  readonly readiness: "ReadyForFreeze";
  readonly sourcePlatform: "ASSISTANT-5:6/WorkspaceOrchestrationPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
