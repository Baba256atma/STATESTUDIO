/**
 * PHASE-9 / OKR-INT-1 — Executive OKR Integration types.
 * Architecture definition only — no calculation, scoring, or runtime behavior.
 */

export type ExecutiveOkrWorkspaceId = string;

export type ExecutiveObjectiveCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "organizational"
  | "transformation"
  | "innovation"
  | "compliance"
  | "custom";

export type ExecutiveOkrLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveOkrRegistryState = "draft" | "validated" | "active";

export type ExecutiveOkrReferenceRole = "primary" | "secondary" | "context" | "custom";

export type ExecutiveOkrObjectReference = Readonly<{
  executiveObjectId: string;
  referenceRole: ExecutiveOkrReferenceRole;
}>;

export type ExecutiveOkrRelationshipReference = Readonly<{
  executiveRelationshipId: string;
  referenceRole: ExecutiveOkrReferenceRole;
}>;

export type ExecutiveOkrKpiReference = Readonly<{
  executiveKpiId: string;
  referenceRole: ExecutiveOkrReferenceRole;
}>;

export type ExecutiveOkrRiskReference = Readonly<{
  executiveRiskId: string;
  referenceRole: ExecutiveOkrReferenceRole;
}>;

export type ExecutiveOkrScenarioReference = Readonly<{
  executiveScenarioId: string;
  referenceRole: ExecutiveOkrReferenceRole;
}>;

export type DeclaredKeyResultStub = Readonly<{
  executiveKeyResultId: string;
  displayName: string;
  targetDescription: string;
  objectReferences: readonly ExecutiveOkrObjectReference[];
  relationshipReferences: readonly ExecutiveOkrRelationshipReference[];
  kpiReferences: readonly ExecutiveOkrKpiReference[];
  riskReferences: readonly ExecutiveOkrRiskReference[];
  scenarioReferences: readonly ExecutiveOkrScenarioReference[];
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type DeclaredObjectiveStub = Readonly<{
  executiveObjectiveId: string;
  displayName: string;
  objectiveCategory: ExecutiveObjectiveCategory;
  keyResults: readonly DeclaredKeyResultStub[];
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type ExecutiveOkrExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveOkrMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveOkrExtensionPoint;
}>;

export type ExecutiveObjective = Readonly<{
  contractVersion: string;
  executiveObjectiveId: string;
  workspaceId: ExecutiveOkrWorkspaceId;
  executiveModelId: string;
  displayName: string;
  objectiveCategory: ExecutiveObjectiveCategory;
  metadata: ExecutiveOkrMetadata;
  lifecycleState: ExecutiveOkrLifecycleState;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  scenarioRegistryId: string;
  hostObjectId: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-9-executive-okr-integration";
}>;

export type ExecutiveKeyResult = Readonly<{
  contractVersion: string;
  executiveKeyResultId: string;
  executiveObjectiveId: string;
  workspaceId: ExecutiveOkrWorkspaceId;
  executiveModelId: string;
  displayName: string;
  targetDescription: string;
  objectReferences: readonly ExecutiveOkrObjectReference[];
  relationshipReferences: readonly ExecutiveOkrRelationshipReference[];
  kpiReferences: readonly ExecutiveOkrKpiReference[];
  riskReferences: readonly ExecutiveOkrRiskReference[];
  scenarioReferences: readonly ExecutiveOkrScenarioReference[];
  metadata: ExecutiveOkrMetadata;
  lifecycleState: ExecutiveOkrLifecycleState;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  scenarioRegistryId: string;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-9-executive-okr-integration";
}>;

export type ExecutiveOkrRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveOkrWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  scenarioRegistryId: string;
  integrationSessionId: string;
  objectives: readonly ExecutiveObjective[];
  keyResults: readonly ExecutiveKeyResult[];
  objectiveCount: number;
  keyResultCount: number;
  registryState: ExecutiveOkrRegistryState;
  source: "phase-9-executive-okr-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveOkrOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveOkrWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  scenarioRegistryId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-8-executive-scenario-integration";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveOkrValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveOkrValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveOkrValidationIssue[];
}>;

export type ExecutiveOkrIntegrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  kpiRegistry: import("../executiveKpi/executiveKpiTypes.ts").ExecutiveKpiRegistry;
  riskRegistry: import("../executiveRisk/executiveRiskTypes.ts").ExecutiveRiskRegistry;
  scenarioRegistry: import("../executiveScenario/executiveScenarioTypes.ts").ExecutiveScenarioRegistry;
  integrationSessionId?: string;
}>;

export type ExecutiveOkrIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveOkrRegistry | null;
  objectives: readonly ExecutiveObjective[];
  keyResults: readonly ExecutiveKeyResult[];
  issues: readonly ExecutiveOkrValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveOkrScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveOkrScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveOkrScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveOkrCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveOkrAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  registryBoundaryIntegrity: number;
  objectiveIntegrity: number;
  keyResultIntegrity: number;
  identityReferenceIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveOkrAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveOkrAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveOkrFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  objectiveCategoriesCount: number;
  lifecycleStatesCount: number;
  keyResultMandatoryFieldsCount: number;
  generatedAt: string;
}>;

export type ExecutiveOkrCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveOkrCertificationCheck[];
  scoreReport: ExecutiveOkrScoreReport;
  analysisScoreReport: ExecutiveOkrAnalysisScoreReport | null;
  freezeReport: ExecutiveOkrFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveOkrDiagnosticEventType =
  | "ObjectiveDeclared"
  | "KeyResultDeclared"
  | "ObjectiveValidated"
  | "KeyResultValidated"
  | "OkrRegistered"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveOkrDiagnosticEvent = Readonly<{
  type: ExecutiveOkrDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveOkrWorkspaceId | null;
  executiveObjectiveId: string | null;
  executiveKeyResultId: string | null;
  timestamp: string;
}>;

export type ExecutiveOkrDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveOkrWorkspaceId | null;
  executiveObjectiveId: string | null;
  executiveKeyResultId: string | null;
  event: ExecutiveOkrDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
