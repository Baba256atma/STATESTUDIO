/** ASSISTANT-5:5 — Readonly metadata types for Workspace Orchestration Manifest. */
export interface AssistantWorkspaceOrchestrationManifestIdentityMetadata {
  readonly id: "ASSISTANT-5:5/WorkspaceOrchestrationManifest";
  readonly name: "Assistant Workspace Orchestration Manifest";
  readonly phaseId: "ASSISTANT-5:5";
  readonly namespace: "nexora.assistant.workspace-orchestration.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly sourceValidation: "ASSISTANT-5:4/WorkspaceOrchestrationValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantWorkspaceOrchestrationManifestSummaryMetadata {
  readonly manifestId: string;
  readonly validationStatus: "Passed";
  readonly readiness: "ReadyForPlatform";
  readonly architectureCompleteness: "Complete";
  readonly inventoryCompleteness: "Complete";
  readonly validationCompleteness: "Complete";
  readonly consumerReadiness: "Ready";
  readonly platformEligibility: "Eligible";
  readonly publishedInventoryCount: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly canonicalInventoryRuleSatisfied: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
