export interface TaskModelMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly sourceDependency: "OPS-1:9";
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface TaskModelIdentity {
  readonly taskIdPattern: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: string;
  readonly sourcePlatform: string;
  readonly decisionReferenceMetadata: readonly string[];
  readonly taskClassification: readonly string[];
  readonly executionReadinessMetadata: readonly TaskExecutionReadinessDescriptor[];
  readonly metadata: TaskModelMetadata;
}

export interface TaskLifecycleState {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly terminal: boolean;
  readonly metadata: TaskModelMetadata;
}

export interface TaskPriorityDescriptor {
  readonly priorityLevel: string;
  readonly urgency: string;
  readonly importance: string;
  readonly executiveImpact: string;
  readonly escalationSensitivity: string;
  readonly metadata: TaskModelMetadata;
}

export interface TaskOwnerDescriptor {
  readonly ownerReference: string;
  readonly accountableRole: string;
  readonly reviewerRole: string;
  readonly stakeholderReferences: readonly string[];
  readonly responsibilityMetadata: readonly string[];
  readonly metadata: TaskModelMetadata;
}

export interface TaskDependencyDescriptor {
  readonly prerequisiteTasks: readonly string[];
  readonly blockingRelationships: readonly string[];
  readonly downstreamImpact: readonly string[];
  readonly dependencyType: string;
  readonly dependencyConfidence: string;
  readonly metadata: TaskModelMetadata;
}

export interface TaskEffortDescriptor {
  readonly estimatedEffort: string;
  readonly complexity: string;
  readonly requiredCapacity: string;
  readonly effortConfidence: string;
  readonly planningNotesMetadata: readonly string[];
  readonly metadata: TaskModelMetadata;
}

export interface TaskRiskDescriptor {
  readonly riskLevel: string;
  readonly riskCategory: string;
  readonly failureImpact: string;
  readonly delaySensitivity: string;
  readonly mitigationReferenceMetadata: readonly string[];
  readonly metadata: TaskModelMetadata;
}

export interface TaskExecutionReadinessDescriptor {
  readonly readinessState: string;
  readonly gatingSignals: readonly string[];
  readonly missingInputs: readonly string[];
  readonly dependencyHealth: string;
  readonly metadata: TaskModelMetadata;
}
