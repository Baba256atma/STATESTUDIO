/**
 * PHASE-8 / DS6-INT-1 — Executive Scenario Model Integration types.
 * Architecture definition only — no simulation, prediction, or runtime behavior.
 */

export type ExecutiveScenarioWorkspaceId = string;

export type ExecutiveScenarioCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "organizational"
  | "market"
  | "contingency"
  | "optimization"
  | "custom";

export type ExecutiveScenarioStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "active"
  | "archived";

export type ExecutiveScenarioLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveScenarioRegistryState = "draft" | "validated" | "active";

export type ExecutiveScenarioReferenceRole = "primary" | "secondary" | "context" | "custom";

export type ExecutiveScenarioObjectReference = Readonly<{
  executiveObjectId: string;
  referenceRole: ExecutiveScenarioReferenceRole;
}>;

export type ExecutiveScenarioRelationshipReference = Readonly<{
  executiveRelationshipId: string;
  referenceRole: ExecutiveScenarioReferenceRole;
}>;

export type ExecutiveScenarioKpiReference = Readonly<{
  executiveKpiId: string;
  referenceRole: ExecutiveScenarioReferenceRole;
}>;

export type ExecutiveScenarioRiskReference = Readonly<{
  executiveRiskId: string;
  referenceRole: ExecutiveScenarioReferenceRole;
}>;

export type ExecutiveScenarioAssumption = Readonly<{
  assumptionId: string;
  description: string;
}>;

export type ExecutiveScenarioConstraint = Readonly<{
  constraintId: string;
  description: string;
}>;

export type DeclaredScenarioStub = Readonly<{
  executiveScenarioId: string;
  displayName: string;
  scenarioCategory: ExecutiveScenarioCategory;
  scenarioStatus: ExecutiveScenarioStatus;
  objectReferences: readonly ExecutiveScenarioObjectReference[];
  relationshipReferences: readonly ExecutiveScenarioRelationshipReference[];
  kpiReferences: readonly ExecutiveScenarioKpiReference[];
  riskReferences: readonly ExecutiveScenarioRiskReference[];
  assumptions: readonly ExecutiveScenarioAssumption[];
  constraints: readonly ExecutiveScenarioConstraint[];
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type ExecutiveScenarioExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveScenarioMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveScenarioExtensionPoint;
}>;

export type ExecutiveScenario = Readonly<{
  contractVersion: string;
  executiveScenarioId: string;
  workspaceId: ExecutiveScenarioWorkspaceId;
  executiveModelId: string;
  displayName: string;
  scenarioCategory: ExecutiveScenarioCategory;
  scenarioStatus: ExecutiveScenarioStatus;
  objectReferences: readonly ExecutiveScenarioObjectReference[];
  relationshipReferences: readonly ExecutiveScenarioRelationshipReference[];
  kpiReferences: readonly ExecutiveScenarioKpiReference[];
  riskReferences: readonly ExecutiveScenarioRiskReference[];
  assumptions: readonly ExecutiveScenarioAssumption[];
  constraints: readonly ExecutiveScenarioConstraint[];
  metadata: ExecutiveScenarioMetadata;
  lifecycleState: ExecutiveScenarioLifecycleState;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  hostObjectId: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-8-executive-scenario-integration";
}>;

export type ExecutiveScenarioRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveScenarioWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  integrationSessionId: string;
  scenarios: readonly ExecutiveScenario[];
  scenarioCount: number;
  registryState: ExecutiveScenarioRegistryState;
  source: "phase-8-executive-scenario-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveScenarioOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveScenarioWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-7-executive-risk-integration";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveScenarioValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveScenarioValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveScenarioValidationIssue[];
}>;

export type ExecutiveScenarioIntegrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  kpiRegistry: import("../executiveKpi/executiveKpiTypes.ts").ExecutiveKpiRegistry;
  riskRegistry: import("../executiveRisk/executiveRiskTypes.ts").ExecutiveRiskRegistry;
  integrationSessionId?: string;
}>;

export type ExecutiveScenarioIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveScenarioRegistry | null;
  scenarios: readonly ExecutiveScenario[];
  issues: readonly ExecutiveScenarioValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveScenarioScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveScenarioScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveScenarioScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveScenarioCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveScenarioAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  registryBoundaryIntegrity: number;
  scenarioModelIntegrity: number;
  referenceIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveScenarioAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveScenarioAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveScenarioFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  scenarioCategoriesCount: number;
  scenarioStatusesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveScenarioCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveScenarioCertificationCheck[];
  scoreReport: ExecutiveScenarioScoreReport;
  analysisScoreReport: ExecutiveScenarioAnalysisScoreReport | null;
  freezeReport: ExecutiveScenarioFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveScenarioDiagnosticEventType =
  | "ScenarioDeclared"
  | "ScenarioValidated"
  | "ScenarioRegistered"
  | "ScenarioDeprecated"
  | "ScenarioArchived"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveScenarioDiagnosticEvent = Readonly<{
  type: ExecutiveScenarioDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveScenarioWorkspaceId | null;
  executiveScenarioId: string | null;
  timestamp: string;
}>;

export type ExecutiveScenarioDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveScenarioWorkspaceId | null;
  executiveScenarioId: string | null;
  event: ExecutiveScenarioDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
