/**
 * PHASE-4 / DS2-INT-1 — Executive Object Model Integration types.
 * Object definition and registry shapes only — no domain engine logic.
 */

export type ExecutiveObjectWorkspaceId = string;

export type ExecutiveObjectType =
  | "organization"
  | "process"
  | "department"
  | "person"
  | "resource"
  | "asset"
  | "system"
  | "custom";

export type ExecutiveObjectLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveObjectRegistryState = "draft" | "validated" | "active";

export type ExecutiveObjectSourceElementKind = "object" | "resource_projection";

export type ExecutiveObjectSourceReference = Readonly<{
  sourceLayer: "phase-3-executive-model-generation";
  elementKind: ExecutiveObjectSourceElementKind;
  elementId: string;
  executiveModelId: string;
}>;

export type ExecutiveObjectExtensionPoint = Readonly<{
  classificationOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveObjectMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  classificationOverride: string | null;
  extension: ExecutiveObjectExtensionPoint;
}>;

export type ExecutiveObject = Readonly<{
  contractVersion: string;
  executiveObjectId: string;
  executiveModelId: string;
  workspaceId: ExecutiveObjectWorkspaceId;
  objectType: ExecutiveObjectType;
  displayName: string;
  businessRole: string;
  metadata: ExecutiveObjectMetadata;
  lifecycleState: ExecutiveObjectLifecycleState;
  sourceReference: ExecutiveObjectSourceReference;
  emg1ObjectKind: string | null;
  knowledgeArtifactRef: string | null;
  businessDataSourceRef: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-4-executive-object-integration";
}>;

export type ExecutiveObjectRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveObjectWorkspaceId;
  executiveModelId: string;
  integrationSessionId: string;
  runtimeSessionId: string | null;
  objects: readonly ExecutiveObject[];
  objectCount: number;
  registryState: ExecutiveObjectRegistryState;
  source: "phase-4-executive-object-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveObjectOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveObjectWorkspaceId;
  executiveModelId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-3-executive-model-runtime";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveObjectValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveObjectValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveObjectValidationIssue[];
}>;

export type ExecutiveObjectIntegrationInput = Readonly<{
  executiveModelRecord: import("../executiveModel/executiveModelGenerationTypes.ts").ExecutiveModelRecord;
  integrationSessionId?: string;
  runtimeSessionId?: string | null;
  projectResourcesAsObjects?: boolean;
}>;

export type ExecutiveObjectIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveObjectRegistry | null;
  objects: readonly ExecutiveObject[];
  issues: readonly ExecutiveObjectValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveObjectScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveObjectScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveObjectScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveObjectCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveObjectAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  emg3InputBoundaryIntegrity: number;
  objectModelIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveObjectAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveObjectAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveObjectFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  objectTypesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveObjectCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveObjectCertificationCheck[];
  scoreReport: ExecutiveObjectScoreReport;
  analysisScoreReport: ExecutiveObjectAnalysisScoreReport | null;
  freezeReport: ExecutiveObjectFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveObjectDiagnosticEventType =
  | "ExecutiveObjectDeclared"
  | "ExecutiveObjectValidated"
  | "ExecutiveObjectRegistered"
  | "ExecutiveObjectDeprecated"
  | "ExecutiveObjectArchived"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveObjectDiagnosticEvent = Readonly<{
  type: ExecutiveObjectDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveObjectWorkspaceId | null;
  executiveObjectId: string | null;
  timestamp: string;
}>;

export type ExecutiveObjectDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveObjectWorkspaceId | null;
  executiveObjectId: string | null;
  event: ExecutiveObjectDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
