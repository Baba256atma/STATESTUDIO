/**
 * PHASE-7 / DS5-INT-1 — Executive Risk Model Integration types.
 * Architecture definition only — no scoring, calculation, or runtime behavior.
 */

export type ExecutiveRiskWorkspaceId = string;

export type ExecutiveRiskCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "compliance"
  | "technical"
  | "resource"
  | "market"
  | "custom";

export type ExecutiveRiskSeverityHint = "low" | "medium" | "high" | "critical";

export type ExecutiveRiskLikelihoodHint =
  | "rare"
  | "unlikely"
  | "possible"
  | "likely"
  | "almost_certain";

export type ExecutiveRiskLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveRiskRegistryState = "draft" | "validated" | "active";

export type ExecutiveRiskBindingRole = "primary" | "secondary" | "context" | "custom";

export type ExecutiveRiskObjectBinding = Readonly<{
  executiveObjectId: string;
  bindingRole: ExecutiveRiskBindingRole;
}>;

export type ExecutiveRiskRelationshipBinding = Readonly<{
  executiveRelationshipId: string;
  bindingRole: ExecutiveRiskBindingRole;
}>;

export type ExecutiveRiskKpiBinding = Readonly<{
  executiveKpiId: string;
  bindingRole: ExecutiveRiskBindingRole;
}>;

export type DeclaredRiskStub = Readonly<{
  executiveRiskId: string;
  displayName: string;
  riskCategory: ExecutiveRiskCategory;
  severityHint: ExecutiveRiskSeverityHint;
  likelihoodHint: ExecutiveRiskLikelihoodHint;
  objectBindings: readonly ExecutiveRiskObjectBinding[];
  relationshipBindings: readonly ExecutiveRiskRelationshipBinding[];
  kpiBindings: readonly ExecutiveRiskKpiBinding[];
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type ExecutiveRiskExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveRiskMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveRiskExtensionPoint;
}>;

export type ExecutiveRisk = Readonly<{
  contractVersion: string;
  executiveRiskId: string;
  workspaceId: ExecutiveRiskWorkspaceId;
  executiveModelId: string;
  displayName: string;
  riskCategory: ExecutiveRiskCategory;
  severityHint: ExecutiveRiskSeverityHint;
  likelihoodHint: ExecutiveRiskLikelihoodHint;
  objectBindings: readonly ExecutiveRiskObjectBinding[];
  relationshipBindings: readonly ExecutiveRiskRelationshipBinding[];
  kpiBindings: readonly ExecutiveRiskKpiBinding[];
  metadata: ExecutiveRiskMetadata;
  lifecycleState: ExecutiveRiskLifecycleState;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  hostObjectId: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-7-executive-risk-integration";
}>;

export type ExecutiveRiskRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveRiskWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  integrationSessionId: string;
  risks: readonly ExecutiveRisk[];
  riskCount: number;
  registryState: ExecutiveRiskRegistryState;
  source: "phase-7-executive-risk-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveRiskOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveRiskWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-6-executive-kpi-integration";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveRiskValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveRiskValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveRiskValidationIssue[];
}>;

export type ExecutiveRiskIntegrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  kpiRegistry: import("../executiveKpi/executiveKpiTypes.ts").ExecutiveKpiRegistry;
  integrationSessionId?: string;
}>;

export type ExecutiveRiskIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveRiskRegistry | null;
  risks: readonly ExecutiveRisk[];
  issues: readonly ExecutiveRiskValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveRiskScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveRiskScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveRiskScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveRiskCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveRiskAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  registryBoundaryIntegrity: number;
  riskModelIntegrity: number;
  bindingIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveRiskAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveRiskAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveRiskFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  riskCategoriesCount: number;
  severityHintsCount: number;
  likelihoodHintsCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveRiskCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveRiskCertificationCheck[];
  scoreReport: ExecutiveRiskScoreReport;
  analysisScoreReport: ExecutiveRiskAnalysisScoreReport | null;
  freezeReport: ExecutiveRiskFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveRiskDiagnosticEventType =
  | "RiskDeclared"
  | "RiskValidated"
  | "RiskRegistered"
  | "RiskDeprecated"
  | "RiskArchived"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveRiskDiagnosticEvent = Readonly<{
  type: ExecutiveRiskDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveRiskWorkspaceId | null;
  executiveRiskId: string | null;
  timestamp: string;
}>;

export type ExecutiveRiskDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveRiskWorkspaceId | null;
  executiveRiskId: string | null;
  event: ExecutiveRiskDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
