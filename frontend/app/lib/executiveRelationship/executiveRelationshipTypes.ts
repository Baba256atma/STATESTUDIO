/**
 * PHASE-5 / DS3-INT-1 — Executive Relationship Model Integration types.
 * Relationship definition and registry shapes only — no discovery logic.
 */

export type ExecutiveRelationshipWorkspaceId = string;

export type ExecutiveRelationshipType =
  | "depends_on"
  | "reports_to"
  | "owns"
  | "supports"
  | "controls"
  | "influences"
  | "uses"
  | "custom";

export type ExecutiveRelationshipDirection = "forward" | "reverse" | "bidirectional";

export type ExecutiveRelationshipLifecycleState =
  | "draft"
  | "defined"
  | "validated"
  | "active"
  | "deprecated"
  | "archived";

export type ExecutiveRelationshipRegistryState = "draft" | "validated" | "active";

export type DeclaredRelationshipStub = Readonly<{
  executiveRelationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: ExecutiveRelationshipType;
  direction: ExecutiveRelationshipDirection;
  strengthHint: string | null;
  metadata?: Readonly<{ tags?: readonly string[] }>;
}>;

export type ExecutiveRelationshipExtensionPoint = Readonly<{
  classificationOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveRelationshipMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  classificationOverride: string | null;
  extension: ExecutiveRelationshipExtensionPoint;
}>;

export type ExecutiveRelationship = Readonly<{
  contractVersion: string;
  executiveRelationshipId: string;
  workspaceId: ExecutiveRelationshipWorkspaceId;
  executiveModelId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: ExecutiveRelationshipType;
  direction: ExecutiveRelationshipDirection;
  strengthHint: string | null;
  metadata: ExecutiveRelationshipMetadata;
  lifecycleState: ExecutiveRelationshipLifecycleState;
  objectRegistryId: string;
  hostObjectId: string | null;
  integrationSessionId: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
  source: "phase-5-executive-relationship-integration";
}>;

export type ExecutiveRelationshipRegistry = Readonly<{
  contractVersion: string;
  registryId: string;
  workspaceId: ExecutiveRelationshipWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  integrationSessionId: string;
  relationships: readonly ExecutiveRelationship[];
  relationshipCount: number;
  registryState: ExecutiveRelationshipRegistryState;
  source: "phase-5-executive-relationship-integration";
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutiveRelationshipOwnershipContract = Readonly<{
  registryId: string;
  workspaceId: ExecutiveRelationshipWorkspaceId;
  executiveModelId: string;
  objectRegistryId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-4-executive-object-integration";
  mutationPolicy: "integration-derived-immutable-snapshot";
}>;

export type ExecutiveRelationshipValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveRelationshipValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveRelationshipValidationIssue[];
}>;

export type ExecutiveRelationshipIntegrationInput = Readonly<{
  objectRegistry: import("../executiveObject/executiveObjectTypes.ts").ExecutiveObjectRegistry;
  integrationSessionId?: string;
  allowSelfReferentialRelationships?: boolean;
}>;

export type ExecutiveRelationshipIntegrationResult = Readonly<{
  success: boolean;
  registry: ExecutiveRelationshipRegistry | null;
  relationships: readonly ExecutiveRelationship[];
  issues: readonly ExecutiveRelationshipValidationIssue[];
  integrationSessionId: string;
}>;

export type ExecutiveRelationshipScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveRelationshipScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveRelationshipScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveRelationshipCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveRelationshipAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  objectRegistryInputBoundaryIntegrity: number;
  relationshipModelIntegrity: number;
  noInferenceIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveRelationshipAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveRelationshipAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveRelationshipFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  relationshipTypesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveRelationshipCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveRelationshipCertificationCheck[];
  scoreReport: ExecutiveRelationshipScoreReport;
  analysisScoreReport: ExecutiveRelationshipAnalysisScoreReport | null;
  freezeReport: ExecutiveRelationshipFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveRelationshipDiagnosticEventType =
  | "RelationshipDeclared"
  | "RelationshipValidated"
  | "RelationshipRegistered"
  | "RelationshipDeprecated"
  | "RelationshipArchived"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveRelationshipDiagnosticEvent = Readonly<{
  type: ExecutiveRelationshipDiagnosticEventType;
  integrationSessionId: string | null;
  workspaceId: ExecutiveRelationshipWorkspaceId | null;
  executiveRelationshipId: string | null;
  timestamp: string;
}>;

export type ExecutiveRelationshipDiagnosticLogEntry = Readonly<{
  integrationSessionId: string | null;
  workspaceId: ExecutiveRelationshipWorkspaceId | null;
  executiveRelationshipId: string | null;
  event: ExecutiveRelationshipDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
