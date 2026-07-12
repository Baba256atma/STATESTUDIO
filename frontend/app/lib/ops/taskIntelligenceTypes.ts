export type TaskIdentity = string;

export type TaskCategory =
  | "Executive"
  | "Operational"
  | "Strategic"
  | "Approval"
  | "Review"
  | "Automated"
  | "Manual";

export type TaskPriority = "Critical" | "High" | "Normal" | "Low";

export type TaskStatus = "Draft" | "Defined" | "Cataloged";

export type TaskOwnerReference = string;

export type TaskDependencyReference = string;

export type TaskEffort = "Minimal" | "Moderate" | "Significant";

export type TaskRiskLevel = "Low" | "Moderate" | "High";

export interface TaskMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly sourceDependency: "OPS-1:9";
  readonly tags: readonly string[];
}

export interface TaskCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TaskCategory;
  readonly status: TaskStatus;
  readonly metadata: TaskMetadata;
}

export interface TaskPublicApi {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}
