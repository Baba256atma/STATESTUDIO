/**
 * PHASE-3 / EMG-1 — Executive Model Generation types.
 * Canonical model and pipeline shapes only — no runtime execution.
 */

export type ExecutiveModelWorkspaceId = string;

export type ExecutiveModelLifecycleState =
  | "draft"
  | "generating"
  | "generated"
  | "reviewed"
  | "approved"
  | "published"
  | "superseded"
  | "archived";

export type ExecutiveModelGenerationStage =
  | "intake"
  | "bind"
  | "normalize"
  | "compose"
  | "validate"
  | "emit";

export type ExecutiveObjectKind = "entity" | "process_node" | "resource_pool" | "outcome" | "control";

export type ExecutiveRelationshipKind =
  | "flows_to"
  | "depends_on"
  | "measures"
  | "governs"
  | "contains"
  | "part_of";

export type ExecutiveKpiDirectionality = "higher_is_better" | "lower_is_better" | "target_band";

export type ExecutiveResourceKind = "capacity" | "capability" | "asset" | "stakeholder";

export type ExecutiveConstraintKind = "policy" | "capacity_limit" | "regulatory" | "business_rule";

export type ExecutiveAssumptionScope = "model" | "scenario" | "domain";

export type ExecutiveModelExtensionPoint = Readonly<{
  modelProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveModelApprovalRecord = Readonly<{
  reviewedBy: string;
  reviewedAt: string;
  approvalNote: string | null;
}>;

export type ExecutiveModelMetadata = Readonly<{
  displayName: string;
  description: string | null;
  executiveCategoryHint: string | null;
  domainHint: string | null;
  tags: readonly string[];
  approvalRecord: ExecutiveModelApprovalRecord | null;
  extension: ExecutiveModelExtensionPoint;
}>;

export type ExecutiveObjectDefinition = Readonly<{
  executiveObjectId: string;
  displayName: string;
  objectKind: ExecutiveObjectKind;
  businessRole: string;
  knowledgeArtifactRef: string | null;
  businessDataSourceRef: string | null;
  metadata: Readonly<{ tags?: readonly string[] }>;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveRelationshipDefinition = Readonly<{
  executiveRelationshipId: string;
  fromExecutiveObjectId: string;
  toExecutiveObjectId: string;
  relationshipKind: ExecutiveRelationshipKind;
  strengthHint: string | null;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveKpiDefinition = Readonly<{
  executiveKpiId: string;
  displayName: string;
  definitionText: string;
  directionality: ExecutiveKpiDirectionality;
  linkedObjectIds: readonly string[];
  knowledgeArtifactRef: string | null;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveRiskDefinition = Readonly<{
  executiveRiskId: string;
  displayName: string;
  definitionText: string;
  severityHint: string | null;
  linkedObjectIds: readonly string[];
  knowledgeArtifactRef: string | null;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveResourceDefinition = Readonly<{
  executiveResourceId: string;
  displayName: string;
  resourceKind: ExecutiveResourceKind;
  linkedObjectIds: readonly string[];
  knowledgeArtifactRef: string | null;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveConstraintDefinition = Readonly<{
  executiveConstraintId: string;
  displayName: string;
  constraintKind: ExecutiveConstraintKind;
  constraintText: string;
  linkedObjectIds: readonly string[];
  knowledgeArtifactRef: string | null;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveAssumptionDefinition = Readonly<{
  executiveAssumptionId: string;
  displayName: string;
  assumptionText: string;
  assumptionScope: ExecutiveAssumptionScope;
  linkedElementIds: readonly string[];
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveModelFamilies = Readonly<{
  objects: readonly ExecutiveObjectDefinition[];
  relationships: readonly ExecutiveRelationshipDefinition[];
  kpis: readonly ExecutiveKpiDefinition[];
  risks: readonly ExecutiveRiskDefinition[];
  resources: readonly ExecutiveResourceDefinition[];
  constraints: readonly ExecutiveConstraintDefinition[];
  assumptions: readonly ExecutiveAssumptionDefinition[];
}>;

export type ExecutiveModelInputBindings = Readonly<{
  businessDataSourceIds: readonly string[];
  knowledgeArtifactIds: readonly string[];
  statusSnapshotId: string | null;
}>;

export type ExecutiveModelGenerationStageRecord = Readonly<{
  stage: ExecutiveModelGenerationStage;
  declaredAt: string;
  stageStatus: "declared";
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveModelGenerationPipeline = Readonly<{
  stages: readonly ExecutiveModelGenerationStageRecord[];
  inputBindings: ExecutiveModelInputBindings;
  currentStage: ExecutiveModelGenerationStage;
  pipelineStatus: "declared";
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveModelRecord = Readonly<{
  contractVersion: string;
  executiveModelId: string;
  workspaceId: ExecutiveModelWorkspaceId;
  sourceFoundationId: string;
  lifecycleState: ExecutiveModelLifecycleState;
  modelFamilies: ExecutiveModelFamilies;
  generationPipeline: ExecutiveModelGenerationPipeline;
  metadata: ExecutiveModelMetadata;
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
  source: "phase-3-executive-model-generation";
}>;

export type ExecutiveModelOwnershipContract = Readonly<{
  executiveModelId: string;
  workspaceId: ExecutiveModelWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type ExecutiveModelValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveModelValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveModelValidationIssue[];
}>;

export type ExecutiveModelScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveModelScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveModelScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveModelCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveModelAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  definitionBoundaryIntegrity: number;
  modelIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveModelAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveModelAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveModelFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  modelFamiliesCount: number;
  pipelineStagesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveModelCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveModelCertificationCheck[];
  scoreReport: ExecutiveModelScoreReport;
  analysisScoreReport: ExecutiveModelAnalysisScoreReport | null;
  freezeReport: ExecutiveModelFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveModelGenerationEventType =
  | "ExecutiveModelDraftCreated"
  | "GenerationStageDeclared"
  | "ModelFamilyDeclared"
  | "ModelValidated"
  | "ModelEmitted"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveModelGenerationEvent = Readonly<{
  type: ExecutiveModelGenerationEventType;
  executiveModelId: string | null;
  workspaceId: ExecutiveModelWorkspaceId | null;
  timestamp: string;
}>;

export type ExecutiveModelGenerationDiagnosticEntry = Readonly<{
  executiveModelId: string | null;
  workspaceId: ExecutiveModelWorkspaceId | null;
  event: ExecutiveModelGenerationEventType;
  message: string;
  generatedAt: string;
}>;
