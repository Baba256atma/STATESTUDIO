export type WorkflowIdentity = string;

export type WorkflowCategory =
  | "Executive"
  | "Operational"
  | "Approval"
  | "Review"
  | "Escalation"
  | "Automated"
  | "Manual";

export type WorkflowStage =
  | "Defined"
  | "Sequenced"
  | "Approved"
  | "Ready"
  | "Cataloged";

export type WorkflowTransition =
  | "Sequential"
  | "Conditional"
  | "Parallel"
  | "ApprovalGate"
  | "EscalationGate";

export type WorkflowDependency = string;

export type WorkflowTriggerMetadata =
  | "ManualTrigger"
  | "DecisionTrigger"
  | "ApprovalTrigger"
  | "ScheduleTrigger";

export type WorkflowApprovalMetadata =
  | "NoApproval"
  | "SingleApproval"
  | "MultiApproval";

export type WorkflowStatus = "Draft" | "Defined" | "Cataloged";

export interface WorkflowMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly sourceDependencies: readonly ["OPS-1:9", "OPS-2:9"];
  readonly tags: readonly string[];
}

export interface WorkflowCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: WorkflowCategory;
  readonly status: WorkflowStatus;
  readonly stage: WorkflowStage;
  readonly trigger: WorkflowTriggerMetadata;
  readonly approval: WorkflowApprovalMetadata;
  readonly metadata: WorkflowMetadata;
}

export interface WorkflowPublicApi {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}
