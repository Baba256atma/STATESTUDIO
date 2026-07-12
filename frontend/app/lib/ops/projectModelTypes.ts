export interface ProjectModelMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly compatibilityVersion: string;
  readonly sourceDependencies: readonly [
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ];
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ProjectLifecycleDescriptor {
  readonly lifecycleStages: readonly string[];
  readonly entryCriteriaMetadata: readonly string[];
  readonly exitCriteriaMetadata: readonly string[];
  readonly lifecycleStatusMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectPhaseDescriptor {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseCategory: string;
  readonly expectedWorkflows: readonly string[];
  readonly expectedMilestones: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectMilestoneDescriptor {
  readonly milestoneId: string;
  readonly milestoneCategory: string;
  readonly successCriteria: readonly string[];
  readonly completionMetadata: readonly string[];
  readonly dependencyMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectDependencyDescriptor {
  readonly prerequisiteProjects: readonly string[];
  readonly blockingProjects: readonly string[];
  readonly workflowDependencies: readonly string[];
  readonly taskDependencies: readonly string[];
  readonly downstreamImpact: readonly string[];
  readonly dependencyConfidence: string;
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectWorkflowReferenceDescriptor {
  readonly linkedWorkflows: readonly string[];
  readonly workflowGroups: readonly string[];
  readonly workflowCategories: readonly string[];
  readonly workflowCompatibilityMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectTaskReferenceDescriptor {
  readonly linkedTasks: readonly string[];
  readonly taskGroups: readonly string[];
  readonly taskCompatibility: readonly string[];
  readonly executionDependencyMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectGovernanceDescriptor {
  readonly governanceLevel: string;
  readonly approvalMetadata: readonly string[];
  readonly reportingMetadata: readonly string[];
  readonly auditMetadata: readonly string[];
  readonly ownershipMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectReadinessDescriptor {
  readonly readinessCategory: string;
  readonly workflowCompatibility: readonly string[];
  readonly taskCompatibility: readonly string[];
  readonly governanceReadiness: readonly string[];
  readonly readinessConfidence: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectPortfolioDescriptor {
  readonly portfolioIdentifier: string;
  readonly programIdentifier: string;
  readonly strategicAlignmentMetadata: readonly string[];
  readonly parentProjectMetadata: readonly string[];
  readonly childProjectMetadata: readonly string[];
  readonly metadata: ProjectModelMetadata;
}

export interface ProjectModelIdentity {
  readonly projectIdPattern: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: string;
  readonly sourcePlatform: string;
  readonly workflowDependencyMetadata: readonly string[];
  readonly taskDependencyMetadata: readonly string[];
  readonly projectClassification: readonly string[];
  readonly governanceMetadata: readonly ProjectGovernanceDescriptor[];
  readonly readinessMetadata: readonly ProjectReadinessDescriptor[];
  readonly portfolioLinkageMetadata: readonly ProjectPortfolioDescriptor[];
  readonly metadata: ProjectModelMetadata;
}

