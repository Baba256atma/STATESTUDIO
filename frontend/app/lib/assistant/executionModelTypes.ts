/** ASSISTANT-8:3 — Readonly metadata types for Executive Action Execution Model. */
export type ExecutiveActionExecutionModelStatus = "Model";
export type ExecutiveActionExecutionModelReadiness = "ReadyForValidation";

export type ExecutionModelCategory =
  | "Execution"
  | "Planning"
  | "Monitoring"
  | "Progress"
  | "Feedback"
  | "Exception"
  | "Health"
  | "Summary"
  | "Governance"
  | "Ownership";

export interface ExecutionModelCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly order: number;
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutionDomainModelMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutionModelCategory;
  readonly attributes: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly registryReference: string;
  readonly sourceRegistry: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry";
  readonly namespace: "nexora.assistant.executive-action-execution.model";
  readonly ownership: "Nexora Assistant";
  readonly lifecycle: "ASSISTANT-8:3/Lifecycle";
  readonly compatibility: "ASSISTANT-8 Registry Compatible";
  readonly readiness: ExecutiveActionExecutionModelReadiness;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly order: number;
  readonly immutableIdentity: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutionRelationshipMetadata {
  readonly id: string;
  readonly source: string;
  readonly relationshipType: string;
  readonly target: string;
  readonly description: string;
  readonly registryReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionModelIdentityMetadata {
  readonly id: "ASSISTANT-8:3/ExecutiveActionExecutionModel";
  readonly name: "Assistant Executive Action Execution Model";
  readonly phaseId: "ASSISTANT-8:3";
  readonly namespace: "nexora.assistant.executive-action-execution.model";
  readonly version: "1.0.0";
  readonly status: ExecutiveActionExecutionModelStatus;
  readonly stage: ExecutiveActionExecutionModelReadiness;
  readonly readiness: ExecutiveActionExecutionModelReadiness;
  readonly canonical: true;
  readonly mutable: false;
  readonly sourceRegistry: "ASSISTANT-8:2/ExecutiveActionExecutionRegistry";
  readonly ownership: "Nexora Assistant";
  readonly metadataOnly: true;
  readonly immutable: true;
}
