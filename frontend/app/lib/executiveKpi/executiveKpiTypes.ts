/**
 * PHASE-6 / DS4-INT-1 — Executive KPI Model Integration types.
 * KPI definition and registry shapes only — no calculation logic.
 */

export type ExecutiveKpiWorkspaceId = string;

export type ExecutiveKpiCategory =
  | "financial"
  | "operational"
  | "strategic"
  | "quality"
  | "resource"
  | "customer"
  | "compliance"
  | "custom";

export type ExecutiveKpiMeasurementType =
  | "percentage"
  | "currency"
  | "duration"
  | "count"
  | "ratio"
  | "score"
  | "boolean"
  | "custom";

export type ExecutiveKpiLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveKpiRegistryState = "draft" | "validated" | "active";

export type ExecutiveKpiBindingRole = "primary" | "secondary" | "context" | "custom";

export type ExecutiveKpiTargetDefinition = Readonly<{
  description: string;
  unitHint: string | null;
  directionHint: "higher_is_better" | "lower_is_better" | "neutral" | null;
  targetValueHint: string | null;
}>;

export type ExecutiveKpiObjectBinding = Readonly<{
  executiveObjectId: string;
  bindingRole: ExecutiveKpiBindingRole;
}>;

export type ExecutiveKpiRelationshipBinding = Readonly<{
  executiveRelationshipId: string;
  bindingRole: ExecutiveKpiBindingRole;
}>;

export type DeclaredKpiStub = Readonly<{
  executiveKpiId: string;
  displayName: string;
  kpiCategory: ExecutiveKpiCategory;
  measurementType: ExecutiveKpiMeasurementType;
  targetDefinition: ExecutiveKpiTargetDefinition;
  objectBindings: readonly ExecutiveKpiObjectBinding[];
  relationshipBindings: readonly ExecutiveKpiRelationshipBinding[];
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type ExecutiveKpiExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveKpiMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveKpiExtensionPoint;
}>;

export type ExecutiveKpi = Readonly<{
  contractVersion: string;
  executiveKpiId: string;
  workspaceId: ExecutiveKpiWorkspaceId;
  executiveModelId: string;
  displayName: string;
  kpiCategory: ExecutiveKpiCategory;
  measurementType: ExecutiveKpiMeasurementType;
  targetDefinition: ExecutiveKpiTargetDefinition;
  objectBindings: readonly ExecutiveKpiObjectBinding[];
  relationshipBindings: readonly ExecutiveKpiRelationshipBinding[];
  metadata: ExecutiveKpiMetadata;
  lifecycleState: ExecutiveKpiLifecycleState;
  objectRegistryId: string;
  relationshipRegistryId: string;
  hostObjectId: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-6-executive-kpi-integration";
}>;

export type ExecutiveKpiRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveKpiWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  integrationSessionId: string;
  kpis: readonly ExecutiveKpi[];
  kpiCount: number;
  registryState: ExecutiveKpiRegistryState;
  source: "phase-6-executive-kpi-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveKpiOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveKpiWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-5-executive-relationship-integration";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveKpiValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveKpiValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveKpiValidationIssue[];
}>;

export type ExecutiveKpiIntegrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  integrationSessionId?: string;
}>;

export type ExecutiveKpiIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveKpiRegistry | null;
  kpis: readonly ExecutiveKpi[];
  issues: readonly ExecutiveKpiValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveKpiScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveKpiScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveKpiScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveKpiCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveKpiAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  registryBoundaryIntegrity: number;
  kpiModelIntegrity: number;
  bindingIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveKpiAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveKpiAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveKpiFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  kpiCategoriesCount: number;
  measurementTypesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveKpiCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveKpiCertificationCheck[];
  scoreReport: ExecutiveKpiScoreReport;
  analysisScoreReport: ExecutiveKpiAnalysisScoreReport | null;
  freezeReport: ExecutiveKpiFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveKpiDiagnosticEventType =
  | "KpiDeclared"
  | "KpiValidated"
  | "KpiRegistered"
  | "KpiDeprecated"
  | "KpiArchived"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveKpiDiagnosticEvent = Readonly<{
  type: ExecutiveKpiDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveKpiWorkspaceId | null;
  executiveKpiId: string | null;
  timestamp: string;
}>;

export type ExecutiveKpiDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveKpiWorkspaceId | null;
  executiveKpiId: string | null;
  event: ExecutiveKpiDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
