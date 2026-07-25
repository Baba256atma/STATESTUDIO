/** ASSISTANT-8:1 — Readonly metadata types for Executive Action Execution Foundation. */
export type ExecutiveActionExecutionFoundationStatus = "Foundation";
export type ExecutiveActionExecutionFoundationStage = "ReadyForRegistry";

export interface ExecutiveActionExecutionIdentityMetadata {
  readonly id: "ASSISTANT-8:1/ExecutiveActionExecutionFoundation";
  readonly name: "Assistant Executive Action Execution Foundation";
  readonly phaseId: "ASSISTANT-8:1";
  readonly version: "1.0.0";
  readonly status: ExecutiveActionExecutionFoundationStatus;
  readonly stage: ExecutiveActionExecutionFoundationStage;
  readonly layer: "Assistant";
  readonly domain: "Executive Action Execution";
  readonly canonical: true;
  readonly mutable: false;
  readonly sourceExecutiveActionPlanning:
    "ASSISTANT-7:9/ExecutiveActionPlanningPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionLifecycleMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionStateMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionClassificationMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveActionExecutionPolicyMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly enforceableAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
