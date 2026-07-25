/** ASSISTANT-5:4 — Readonly metadata types for Workspace Orchestration Validation. */
export type AssistantWorkspaceOrchestrationValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface AssistantWorkspaceOrchestrationValidationRuleMetadata {
  readonly ruleId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: AssistantWorkspaceOrchestrationValidationSeverity;
  readonly validationTarget: string;
  readonly expectedResult: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationValidationGateMetadata {
  readonly gateId: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationValidationResultMetadata {
  readonly validationStatus: "Passed";
  readonly ruleCount: number;
  readonly gateCount: number;
  readonly passed: number;
  readonly failed: 0;
  readonly warnings: 0;
  readonly readiness: "ReadyForManifest";
  readonly manifestEligibility: "Eligible";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationValidationIdentityMetadata {
  readonly id: "ASSISTANT-5:4/WorkspaceOrchestrationValidation";
  readonly name: "Assistant Workspace Orchestration Validation";
  readonly phaseId: "ASSISTANT-5:4";
  readonly namespace: "nexora.assistant.workspace-orchestration.validation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly sourceModel: "ASSISTANT-5:3/WorkspaceOrchestrationModel";
  readonly metadataOnly: true;
  readonly immutable: true;
}
