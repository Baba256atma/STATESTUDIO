export type ExecutionModelCategory =
  | "Task"
  | "Workflow"
  | "Project"
  | "Resource"
  | "Schedule"
  | "Monitoring"
  | "Automation";

export type ExecutionModelStatus = "Draft" | "Modeled" | "Defined";

export interface ExecutionModelMetadata {
  readonly phaseId: "OPS-1:3";
  readonly platformId: string;
  readonly compatibilityVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly registryCapabilityId: string;
  readonly domainId: string;
}

export interface ExecutionTask {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Task";
  readonly status: ExecutionModelStatus;
  readonly taskType: string;
  readonly priority: string;
  readonly ownerReference: string;
  readonly dependencyReferences: readonly string[];
  readonly estimatedEffort: string;
  readonly executionState: string;
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionWorkflow {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Workflow";
  readonly status: ExecutionModelStatus;
  readonly stages: readonly string[];
  readonly transitions: readonly string[];
  readonly dependencies: readonly string[];
  readonly lifecycleMetadata: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionProject {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Project";
  readonly status: ExecutionModelStatus;
  readonly projectIdentity: string;
  readonly milestones: readonly string[];
  readonly deliverables: readonly string[];
  readonly executionScope: readonly string[];
  readonly objectives: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionResource {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Resource";
  readonly status: ExecutionModelStatus;
  readonly resourceIdentity: string;
  readonly resourceCategory: string;
  readonly capacityMetadata: readonly string[];
  readonly allocationMetadata: readonly string[];
  readonly availabilityMetadata: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionSchedule {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Schedule";
  readonly status: ExecutionModelStatus;
  readonly scheduleIdentity: string;
  readonly timelineMetadata: readonly string[];
  readonly milestones: readonly string[];
  readonly deadlines: readonly string[];
  readonly executionWindows: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionMonitoring {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Monitoring";
  readonly status: ExecutionModelStatus;
  readonly monitoringTargets: readonly string[];
  readonly healthIndicators: readonly string[];
  readonly progressIndicators: readonly string[];
  readonly alertCategories: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}

export interface ExecutionAutomation {
  readonly identifier: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: "Automation";
  readonly status: ExecutionModelStatus;
  readonly triggerMetadata: readonly string[];
  readonly ruleMetadata: readonly string[];
  readonly actionMetadata: readonly string[];
  readonly executionScope: readonly string[];
  readonly metadata: ExecutionModelMetadata;
}
