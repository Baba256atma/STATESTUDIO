/**
 * PHASE-2 / DS1:6 — Data Source Status types.
 * Observation and snapshot shapes only — no polling, sync, or runtime logic.
 */

export type DataSourceStatusWorkspaceId = string;

export type DataSourceExecutiveStatus =
  | "draft"
  | "waiting"
  | "registered"
  | "upload_pending"
  | "connected"
  | "import_pending"
  | "validating"
  | "active"
  | "warning"
  | "failed"
  | "archived";

export type DataSourceHealthState = "healthy" | "degraded" | "unhealthy" | "unknown";

export type DataSourceProgressPhase =
  | "registration"
  | "upload"
  | "connection"
  | "import"
  | "validation"
  | "activation"
  | "complete";

export type DataSourceStatusSignalSource = "DS1:1" | "DS1:2" | "DS1:4" | "DS1:5" | "bridge";

export type DataSourceAggregationPolicy = "most_restrictive";

export type DataSourceStatusErrorSeverity = "critical" | "error";

export type DataSourceStatusWarningSeverity = "low" | "medium" | "high";

export type DataSourceStatusExtensionPoint = Readonly<{
  statusProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type DataSourceStatusMetadata = Readonly<{
  displayName?: string | null;
  connectorTypeHint?: string | null;
  executiveCategoryHint?: string | null;
  adapterLinkId?: string | null;
  wizardSessionId?: string | null;
  requestIds?: readonly string[];
  tags?: readonly string[];
  extension?: DataSourceStatusExtensionPoint;
}>;

export type DataSourceHealthIndicator = Readonly<{
  healthState: DataSourceHealthState;
  healthScoreHint: number | null;
  lastHealthCheckAt: string | null;
  healthSource: "observed";
}>;

export type DataSourceProgressIndicator = Readonly<{
  progressPhase: DataSourceProgressPhase;
  progressPercentHint: number | null;
  activeRequestId: string | null;
  progressLabel: string | null;
}>;

export type DataSourceStatusError = Readonly<{
  errorId: string;
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  errorCode: string;
  errorMessage: string;
  relatedRequestId: string | null;
  observedAt: string;
  severity: DataSourceStatusErrorSeverity;
  source: "phase-2-data-source-status";
}>;

export type DataSourceStatusWarning = Readonly<{
  warningId: string;
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  warningCode: string;
  warningMessage: string;
  relatedRequestId: string | null;
  observedAt: string;
  severity: DataSourceStatusWarningSeverity;
  source: "phase-2-data-source-status";
}>;

export type DataSourceStatusHistoryEntry = Readonly<{
  historyEntryId: string;
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  previousStatus: DataSourceExecutiveStatus | null;
  newStatus: DataSourceExecutiveStatus;
  triggerSource: DataSourceStatusSignalSource;
  triggerReferenceId: string | null;
  observedAt: string;
  source: "phase-2-data-source-status";
}>;

export type DataSourceStatusSignal = Readonly<{
  signalSource: DataSourceStatusSignalSource;
  referenceId: string;
  observedValue: string;
  observedAt: string;
}>;

export type DataSourceStatusAggregationContract = Readonly<{
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  businessDataSourceId: string;
  primaryStatus: DataSourceExecutiveStatus;
  contributingSignals: readonly DataSourceStatusSignal[];
  aggregatedAt: string;
  aggregationPolicy: DataSourceAggregationPolicy;
}>;

export type DataSourceStatusSnapshot = Readonly<{
  contractVersion: string;
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  businessDataSourceId: string;
  observedAt: string;
  status: DataSourceExecutiveStatus;
  health: DataSourceHealthIndicator;
  progress: DataSourceProgressIndicator;
  errors: readonly DataSourceStatusError[];
  warnings: readonly DataSourceStatusWarning[];
  history: readonly DataSourceStatusHistoryEntry[];
  observedFrom: readonly DataSourceStatusSignalSource[];
  metadata: DataSourceStatusMetadata;
  aggregation: DataSourceStatusAggregationContract;
  source: "phase-2-data-source-status";
}>;

export type DataSourceStatusOwnershipContract = Readonly<{
  statusSnapshotId: string;
  workspaceId: DataSourceStatusWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type DataSourceStatusValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type DataSourceStatusValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DataSourceStatusValidationIssue[];
}>;

export type DataSourceStatusScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type DataSourceStatusScoreReport = Readonly<{
  contractVersion: string;
  dimensions: DataSourceStatusScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type DataSourceStatusCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type DataSourceStatusCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly DataSourceStatusCertificationCheck[];
  scoreReport: DataSourceStatusScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type DataSourceStatusEventType =
  | "StatusSnapshotCreated"
  | "StatusObserved"
  | "StatusUpdated"
  | "HealthChanged"
  | "ProgressUpdated"
  | "WarningObserved"
  | "ErrorObserved"
  | "HistoryEntryAdded"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type DataSourceStatusEvent = Readonly<{
  type: DataSourceStatusEventType;
  statusSnapshotId: string | null;
  workspaceId: DataSourceStatusWorkspaceId | null;
  timestamp: string;
}>;

export type DataSourceStatusDiagnosticEntry = Readonly<{
  statusSnapshotId: string | null;
  workspaceId: DataSourceStatusWorkspaceId | null;
  event: DataSourceStatusEventType;
  message: string;
  generatedAt: string;
}>;
