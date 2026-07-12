export interface WorkflowModelMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly sourceDependencies: readonly ["OPS-1:9", "OPS-2:9", "OPS-3:1", "OPS-3:2"];
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface WorkflowReadinessDescriptor {
  readonly readinessCategory: string;
  readonly requiredTaskModelCompatibility: readonly string[];
  readonly requiredDependencyMetadata: readonly string[];
  readonly requiredOwnershipMetadata: readonly string[];
  readonly readinessConfidenceMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowTaskLinkDescriptor {
  readonly linkedTaskCategories: readonly string[];
  readonly linkedTaskReferences: readonly string[];
  readonly taskCompatibilityMetadata: readonly string[];
  readonly coordinationNotesMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowModelIdentity {
  readonly workflowIdPattern: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: string;
  readonly sourcePlatform: string;
  readonly taskIntelligenceDependencyMetadata: readonly string[];
  readonly decisionReferenceMetadata: readonly string[];
  readonly workflowClassification: readonly string[];
  readonly readinessMetadata: readonly WorkflowReadinessDescriptor[];
  readonly taskLinkMetadata: readonly WorkflowTaskLinkDescriptor[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowStageDescriptor {
  readonly stageId: string;
  readonly stageName: string;
  readonly stageCategory: string;
  readonly expectedTaskReferences: readonly string[];
  readonly entryCriteriaMetadata: readonly string[];
  readonly exitCriteriaMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowTransitionDescriptor {
  readonly transitionId: string;
  readonly fromStage: string;
  readonly toStage: string;
  readonly transitionCategory: string;
  readonly transitionConditionMetadata: readonly string[];
  readonly transitionConfidenceMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowDependencyDescriptor {
  readonly prerequisiteWorkflows: readonly string[];
  readonly blockingWorkflows: readonly string[];
  readonly taskDependencyReferences: readonly string[];
  readonly downstreamImpactMetadata: readonly string[];
  readonly dependencyConfidence: string;
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowTriggerDescriptor {
  readonly triggerId: string;
  readonly triggerCategory: string;
  readonly triggerSource: string;
  readonly triggerConditionMetadata: readonly string[];
  readonly triggerScopeMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}

export interface WorkflowApprovalDescriptor {
  readonly approvalStage: string;
  readonly approverRoleMetadata: readonly string[];
  readonly reviewRoleMetadata: readonly string[];
  readonly approvalConditionMetadata: readonly string[];
  readonly escalationMetadata: readonly string[];
  readonly metadata: WorkflowModelMetadata;
}
