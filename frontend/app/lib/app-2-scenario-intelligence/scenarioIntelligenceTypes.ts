/**
 * APP-2:1 — Scenario Intelligence types.
 * Architecture contract vocabulary — no intelligence, scoring, or AI reasoning.
 */

export type ScenarioIntelligenceWorkspaceId = string;
export type ScenarioIntelligenceScenarioId = string;

export type ScenarioIntelligenceCertificationStatus = "pending" | "pass" | "fail";
export type ScenarioIntelligenceFreezeState = "open" | "frozen";
export type ScenarioIntelligenceArchitectureStatus = "build" | "certified";

export type ScenarioIntelligenceIdentity = Readonly<{
  appId: "APP-2";
  title: "Scenario Intelligence";
  version: string;
  status: ScenarioIntelligenceArchitectureStatus;
  certificationStatus: ScenarioIntelligenceCertificationStatus;
  freezeState: ScenarioIntelligenceFreezeState;
  architectureVersion: string;
}>;

export type ScenarioType =
  | "baseline"
  | "what_if"
  | "stress_test"
  | "comparison"
  | "simulation"
  | "authoring"
  | "manual";

export type ScenarioSource =
  | "scenario_authoring"
  | "scenario_simulation"
  | "compare_engine"
  | "workspace"
  | "manual"
  | "import";

export type ScenarioStatus =
  | "created"
  | "draft"
  | "analyzing"
  | "waiting"
  | "active"
  | "monitoring"
  | "completed"
  | "archived";

export type ScenarioHealthState =
  | "unknown"
  | "healthy"
  | "attention"
  | "warning"
  | "critical"
  | "blocked";

export type ScenarioIdentity = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  scenarioType: ScenarioType;
  createdAt: string;
  updatedAt: string;
  owner: string;
  source: ScenarioSource;
  executiveTimeReference: ScenarioExecutiveTimeReference | null;
  timelineReference: ScenarioTimelineReference | null;
  status: ScenarioStatus;
}>;

export type ScenarioExecutiveTimeReference = Readonly<{
  contextKey: string;
  eventId: string | null;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineReference = Readonly<{
  timelineId: string;
  anchorTimestamp: string;
  readOnly: true;
}>;

export type ScenarioWorkspaceReference = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  readOnly: true;
}>;

export type ScenarioObjectReference = Readonly<{
  objectId: string;
  label: string;
  readOnly: true;
}>;

export type ScenarioKpiReference = Readonly<{
  kpiId: string;
  label: string;
  readOnly: true;
}>;

export type ScenarioRiskReference = Readonly<{
  riskId: string;
  label: string;
  readOnly: true;
}>;

export type ScenarioRelationshipReference = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  readOnly: true;
}>;

export type ScenarioDecisionJournalReference = Readonly<{
  journalEntryId: string;
  decisionId: string | null;
  readOnly: true;
}>;

export type ScenarioExecutiveReferences = Readonly<{
  executiveTime: ScenarioExecutiveTimeReference | null;
  timeline: ScenarioTimelineReference | null;
  workspace: ScenarioWorkspaceReference;
  objects: readonly ScenarioObjectReference[];
  kpis: readonly ScenarioKpiReference[];
  risks: readonly ScenarioRiskReference[];
  relationships: readonly ScenarioRelationshipReference[];
  decisionJournal: readonly ScenarioDecisionJournalReference[];
}>;

export type ScenarioLifecycleStageKey = ScenarioStatus;

export type ScenarioLifecycleStageDefinition = Readonly<{
  key: ScenarioLifecycleStageKey;
  order: number;
  label: string;
  description: string;
}>;

export type ScenarioStateDefinition = Readonly<{
  key: ScenarioHealthState;
  label: string;
  description: string;
  severityRank: number;
}>;

export type ScenarioDiagnosticCode =
  | "missing_scenario"
  | "missing_context"
  | "invalid_workspace"
  | "invalid_timeline"
  | "contract_violation"
  | "lifecycle_error"
  | "dependency_error";

export type ScenarioDiagnosticSeverity = "info" | "warning" | "error";

export type ScenarioDiagnosticDefinition = Readonly<{
  code: ScenarioDiagnosticCode;
  label: string;
  description: string;
  severity: ScenarioDiagnosticSeverity;
}>;

export type ScenarioDiagnostic = Readonly<{
  code: ScenarioDiagnosticCode;
  message: string;
  severity: ScenarioDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ScenarioMetadataPlatform = "nexora-type-c";

export type ScenarioMetadataSource = ScenarioSource | "app-2-scenario-intelligence" | "app-2-scenario-intelligence-contract";

export type ScenarioMetadataRecord = Readonly<{
  version: string;
  createdAt: string;
  updatedAt: string;
  architecture: string;
  certification: ScenarioIntelligenceCertificationStatus;
  freeze: ScenarioIntelligenceFreezeState;
  source: ScenarioMetadataSource;
  build: string;
  platform: ScenarioMetadataPlatform;
}>;

export type ScenarioArchitectureEventType =
  | "scenario_created"
  | "scenario_updated"
  | "scenario_archived"
  | "scenario_activated"
  | "scenario_completed"
  | "scenario_deleted";

export type ScenarioArchitectureEvent = Readonly<{
  eventType: ScenarioArchitectureEventType;
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  timestamp: string;
  actor: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ScenarioContextSnapshot = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  status: ScenarioStatus;
  healthState: ScenarioHealthState;
  references: ScenarioExecutiveReferences;
  metadata: ScenarioMetadataRecord;
}>;

export type ScenarioIntelligenceInitRequest = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  actor: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ScenarioIntelligenceInitResult = Readonly<{
  initialized: boolean;
  identity: ScenarioIntelligenceIdentity;
  metadata: ScenarioMetadataRecord;
}>;

export type ScenarioAnalyzeRequest = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  actor: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ScenarioAnalyzeResult = Readonly<{
  accepted: boolean;
  scenarioId: ScenarioIntelligenceScenarioId;
  status: ScenarioStatus;
  healthState: ScenarioHealthState;
  diagnostics: readonly ScenarioDiagnostic[];
}>;

export type ScenarioIntelligenceValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ScenarioIntelligenceValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ScenarioIntelligenceValidationIssue[];
}>;

export type ScenarioIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ScenarioIntelligenceCertificationScope =
  | "architecture"
  | "lifecycle"
  | "interfaces"
  | "diagnostics"
  | "regression"
  | "read_only_compliance"
  | "freeze";

export type ScenarioIntelligenceCertificationGate = Readonly<{
  scope: ScenarioIntelligenceCertificationScope;
  checkId: string;
  title: string;
  required: boolean;
}>;

export type ScenarioIntelligenceCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;

export type ScenarioIntelligenceFutureCompatibility = Readonly<{
  app3Ready: boolean;
  app4Ready: boolean;
  layReady: boolean;
  governanceReady: boolean;
  memoryReady: boolean;
  executiveTimeConsumerOnly: true;
  readOnly: true;
}>;
