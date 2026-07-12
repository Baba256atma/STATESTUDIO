export type ProjectIdentity = string;

export type ProjectCategory =
  | "Executive"
  | "Operational"
  | "Strategic"
  | "Transformation"
  | "Program"
  | "Portfolio"
  | "ContinuousImprovement";

export type ProjectLifecycle =
  | "Defined"
  | "Structured"
  | "Sequenced"
  | "Ready"
  | "Cataloged";

export type ProjectPhase =
  | "Initiation"
  | "Planning"
  | "ExecutionDesign"
  | "Readiness"
  | "ClosureDefinition";

export type ProjectMilestone = string;

export type ProjectDependency = string;

export type ProjectWorkflowReference = string;

export type ProjectTaskReference = string;

export type ProjectExecutionReadiness =
  | "ConceptReady"
  | "WorkflowReady"
  | "TaskReady"
  | "GovernanceReady";

export interface ProjectMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly sourceDependencies: readonly ["OPS-1:9", "OPS-2:9", "OPS-3:9"];
  readonly tags: readonly string[];
}

export interface ProjectCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ProjectCategory;
  readonly lifecycle: ProjectLifecycle;
  readonly phase: ProjectPhase;
  readonly readiness: ProjectExecutionReadiness;
  readonly workflowReference: ProjectWorkflowReference;
  readonly taskReference: ProjectTaskReference;
  readonly metadata: ProjectMetadata;
}

export interface ProjectPublicApi {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}

