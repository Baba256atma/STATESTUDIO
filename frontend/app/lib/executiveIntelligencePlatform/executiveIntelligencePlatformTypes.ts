/**
 * PHASE-10 / EIP-1 — Executive Intelligence Platform types.
 * Architecture definition only — no reasoning, calculation, or runtime behavior.
 */

export type ExecutiveIntelligenceWorkspaceId = string;

export type ExecutiveIntelligenceRequestType =
  | "summary"
  | "explanation"
  | "comparison"
  | "recommendation_context"
  | "executive_overview"
  | "custom";

export type ExecutiveIntelligencePlatformLifecycleState =
  | "initialized"
  | "prepared"
  | "validated"
  | "available"
  | "deprecated"
  | "archived";

export type ExecutiveIntelligenceReferenceRole = "primary" | "secondary" | "context" | "custom";

export type ExecutiveIntelligenceConsumedRegistries = Readonly<{
  objectRegistryId: string;
  relationshipRegistryId: string;
  kpiRegistryId: string;
  riskRegistryId: string;
  scenarioRegistryId: string;
  okrRegistryId: string;
}>;

export type ExecutiveIntelligenceObjectReference = Readonly<{
  executiveObjectId: string;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceRelationshipReference = Readonly<{
  executiveRelationshipId: string;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceKpiReference = Readonly<{
  executiveKpiId: string;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceRiskReference = Readonly<{
  executiveRiskId: string;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceScenarioReference = Readonly<{
  executiveScenarioId: string;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceOkrReference = Readonly<{
  executiveObjectiveId: string | null;
  executiveKeyResultId: string | null;
  referenceRole: ExecutiveIntelligenceReferenceRole;
}>;

export type ExecutiveIntelligenceExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveIntelligenceMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveIntelligenceExtensionPoint;
}>;

export type ExecutiveIntelligenceContext = Readonly<{
  contextId: string;
  intelligenceSessionId: string;
  workspaceId: ExecutiveIntelligenceWorkspaceId;
  executiveModelId: string;
  consumedRegistries: ExecutiveIntelligenceConsumedRegistries;
  requestType: ExecutiveIntelligenceRequestType;
  metadata: ExecutiveIntelligenceMetadata;
  createdAt: string;
  updatedAt: string;
  source: "phase-10-executive-intelligence-platform";
}>;

export type ExecutiveIntelligenceRequest = Readonly<{
  contractVersion: string;
  requestId: string;
  intelligenceSessionId: string;
  workspaceId: ExecutiveIntelligenceWorkspaceId;
  executiveModelId: string;
  requestType: ExecutiveIntelligenceRequestType;
  consumedRegistries: ExecutiveIntelligenceConsumedRegistries;
  metadata: ExecutiveIntelligenceMetadata;
  lifecycleState: ExecutiveIntelligencePlatformLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-10-executive-intelligence-platform";
}>;

export type ExecutiveIntelligenceResponse = Readonly<{
  contractVersion: string;
  responseId: string;
  requestId: string;
  intelligenceSessionId: string;
  workspaceId: ExecutiveIntelligenceWorkspaceId;
  executiveModelId: string;
  executiveSummary: string;
  referencedObjects: readonly ExecutiveIntelligenceObjectReference[];
  referencedRelationships: readonly ExecutiveIntelligenceRelationshipReference[];
  referencedKpis: readonly ExecutiveIntelligenceKpiReference[];
  referencedRisks: readonly ExecutiveIntelligenceRiskReference[];
  referencedScenarios: readonly ExecutiveIntelligenceScenarioReference[];
  referencedOkrs: readonly ExecutiveIntelligenceOkrReference[];
  metadata: ExecutiveIntelligenceMetadata;
  lifecycleState: ExecutiveIntelligencePlatformLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-10-executive-intelligence-platform";
}>;

export type ExecutiveIntelligenceSession = Readonly<{
  contractVersion: string;
  intelligenceSessionId: string;
  workspaceId: ExecutiveIntelligenceWorkspaceId;
  executiveModelId: string;
  requestId: string;
  requestType: ExecutiveIntelligenceRequestType;
  consumedRegistries: ExecutiveIntelligenceConsumedRegistries;
  responseSummary: string;
  metadata: ExecutiveIntelligenceMetadata;
  lifecycleState: ExecutiveIntelligencePlatformLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-10-executive-intelligence-platform";
}>;

export type ExecutiveIntelligencePlatformRegistryInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  kpiRegistry: import("../executiveKpi/executiveKpiTypes.ts").ExecutiveKpiRegistry;
  riskRegistry: import("../executiveRisk/executiveRiskTypes.ts").ExecutiveRiskRegistry;
  scenarioRegistry: import("../executiveScenario/executiveScenarioTypes.ts").ExecutiveScenarioRegistry;
  okrRegistry: import("../executiveOkr/executiveOkrTypes.ts").ExecutiveOkrRegistry;
  intelligenceSessionId?: string;
}>;

export type ExecutiveIntelligenceOrchestrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  relationshipRegistry: import("../executiveRelationship/executiveRelationshipTypes.ts").ExecutiveRelationshipRegistry;
  kpiRegistry: import("../executiveKpi/executiveKpiTypes.ts").ExecutiveKpiRegistry;
  riskRegistry: import("../executiveRisk/executiveRiskTypes.ts").ExecutiveRiskRegistry;
  scenarioRegistry: import("../executiveScenario/executiveScenarioTypes.ts").ExecutiveScenarioRegistry;
  okrRegistry: import("../executiveOkr/executiveOkrTypes.ts").ExecutiveOkrRegistry;
  requestType: ExecutiveIntelligenceRequestType;
  intelligenceSessionId?: string;
}>;

export type ExecutiveIntelligencePlatformOwnershipContract = Readonly<{
  intelligenceSessionId: string;
  workspaceId: ExecutiveIntelligenceWorkspaceId;
  executiveModelId: string;
  consumedRegistries: ExecutiveIntelligenceConsumedRegistries;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-9-executive-okr-integration";
  mutationPolicy: "read-only-orchestration-snapshot";
}>;

export type ExecutiveIntelligenceValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveIntelligenceValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveIntelligenceValidationIssue[];
}>;

export type ExecutiveIntelligenceOrchestrationResult = Readonly<{
  success: boolean;
  session: ExecutiveIntelligenceSession | null;
  request: ExecutiveIntelligenceRequest | null;
  response: ExecutiveIntelligenceResponse | null;
  context: ExecutiveIntelligenceContext | null;
  issues: readonly ExecutiveIntelligenceValidationIssue[];
  intelligenceSessionId: string;
}>;

export type ExecutiveIntelligenceScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveIntelligenceScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveIntelligenceScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveIntelligenceAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  registryBoundaryIntegrity: number;
  orchestrationIntegrity: number;
  referenceIntegrity: number;
  businessOwnershipIsolation: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveIntelligenceAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveIntelligenceAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveIntelligenceFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  requestTypesCount: number;
  lifecycleStatesCount: number;
  orchestrationStagesCount: number;
  generatedAt: string;
}>;

export type ExecutiveIntelligenceCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveIntelligenceCertificationCheck[];
  scoreReport: ExecutiveIntelligenceScoreReport;
  analysisScoreReport: ExecutiveIntelligenceAnalysisScoreReport | null;
  freezeReport: ExecutiveIntelligenceFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveIntelligenceDiagnosticEventType =
  | "IntelligenceSessionCreated"
  | "IntelligenceRequestAccepted"
  | "IntelligenceContextPrepared"
  | "RegistriesCorrelated"
  | "ResponseComposed"
  | "ResponseValidated"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveIntelligenceDiagnosticEvent = Readonly<{
  type: ExecutiveIntelligenceDiagnosticEventType;
  intelligenceSessionId: string | null;
  workspaceId: ExecutiveIntelligenceWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  timestamp: string;
}>;

export type ExecutiveIntelligenceDiagnosticLogEntry = Readonly<{
  intelligenceSessionId: string | null;
  workspaceId: ExecutiveIntelligenceWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  event: ExecutiveIntelligenceDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
