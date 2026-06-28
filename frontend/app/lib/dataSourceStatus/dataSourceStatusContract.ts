/**
 * PHASE-2 / DS1:6 — Data Source Status contract.
 * Read-only observation vocabulary — no polling, sync, or runtime logic.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  DataSourceAggregationPolicy,
  DataSourceExecutiveStatus,
  DataSourceHealthIndicator,
  DataSourceHealthState,
  DataSourceProgressIndicator,
  DataSourceProgressPhase,
  DataSourceStatusAggregationContract,
  DataSourceStatusError,
  DataSourceStatusHistoryEntry,
  DataSourceStatusMetadata,
  DataSourceStatusOwnershipContract,
  DataSourceStatusScoreDimensions,
  DataSourceStatusSignal,
  DataSourceStatusSignalSource,
  DataSourceStatusSnapshot,
  DataSourceStatusValidationIssue,
  DataSourceStatusValidationResult,
  DataSourceStatusWarning,
  DataSourceStatusWorkspaceId,
} from "./dataSourceStatusTypes.ts";

export const DATA_SOURCE_STATUS_VERSION = "PHASE-2/DS1:6" as const;
export const DATA_SOURCE_STATUS_SOURCE = "phase-2-data-source-status" as const;
export const NEXORA_DATA_SOURCE_STATUS_LOG_PREFIX = "[NexoraDataSourceStatus]" as const;

export const DATA_SOURCE_STATUS_TAGS = Object.freeze([
  "[DS16_DATA_SOURCE_STATUS]",
  "[STATUS_OBSERVATION_LAYER]",
  "[WORKSPACE_STATUS_OWNED]",
  "[DS17_READY]",
] as const);

export const DATA_SOURCE_STATUS_FREEZE_TAGS = Object.freeze([
  "[DS1_6_CERTIFIED]",
  "[DATA_SOURCE_STATUS_FROZEN]",
  "[PHASE2_DS1_6_COMPLETE]",
] as const);

export const DATA_SOURCE_EXECUTIVE_STATUSES = Object.freeze([
  "draft",
  "waiting",
  "registered",
  "upload_pending",
  "connected",
  "import_pending",
  "validating",
  "active",
  "warning",
  "failed",
  "archived",
] as const satisfies readonly DataSourceExecutiveStatus[]);

export const DATA_SOURCE_HEALTH_STATES = Object.freeze([
  "healthy",
  "degraded",
  "unhealthy",
  "unknown",
] as const satisfies readonly DataSourceHealthState[]);

export const DATA_SOURCE_PROGRESS_PHASES = Object.freeze([
  "registration",
  "upload",
  "connection",
  "import",
  "validation",
  "activation",
  "complete",
] as const satisfies readonly DataSourceProgressPhase[]);

export const DATA_SOURCE_STATUS_SIGNAL_SOURCES = Object.freeze([
  "DS1:1",
  "DS1:2",
  "DS1:4",
  "DS1:5",
  "bridge",
] as const satisfies readonly DataSourceStatusSignalSource[]);

export const DATA_SOURCE_AGGREGATION_POLICIES = Object.freeze([
  "most_restrictive",
] as const satisfies readonly DataSourceAggregationPolicy[]);

export const DATA_SOURCE_STATUS_MUST_NOT_OWN = Object.freeze([
  "upload_execution",
  "import_execution",
  "validation_execution",
  "synchronization",
  "registry_runtime",
  "polling",
  "background_jobs",
  "business_knowledge",
  "ai_reasoning",
  "intelligence",
  "dashboard_rendering",
  "assistant_logic",
] as const);

export const EBDS_LIFECYCLE_TO_DSS_STATUS_HINTS = Object.freeze({
  defined: "draft",
  registered: "registered",
  connected: "connected",
  validated: "validating",
  active: "active",
  suspended: "failed",
  archived: "archived",
  removed: "archived",
} as const);

export const DATA_SOURCE_STATUS_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/",
  "dataSourceRegistryRuntime",
  "workspace/workspaceDataSourceRegistry.ts",
  "workspaceRegistryStore",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "RelationshipRenderer",
  "executiveBusinessDataSourceContract.ts",
  "workspaceDataSourceRegistryAdapterContract.ts",
  "inputDataSourceCenterContract.ts",
  "manageWizardIntegrationContract.ts",
  "ParserEngine",
  "ImportEngine",
  "ValidationEngine",
  "SynchronizationEngine",
  ".tsx",
] as const);

export const DATA_SOURCE_STATUS_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:6",
  title: "Data Source Status",
  goal: "Library-only read-only observation contract for business data source lifecycle and health.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/dataSourceStatus/dataSourceStatusTypes.ts",
    "frontend/app/lib/dataSourceStatus/dataSourceStatusContract.ts",
    "frontend/app/lib/dataSourceStatus/dataSourceStatusDiagnostics.ts",
    "frontend/app/lib/dataSourceStatus/dataSourceStatusCertification.ts",
    "frontend/app/lib/dataSourceStatus/dataSourceStatusCertification.test.ts",
    "docs/ds1-6-build-report.md",
    "docs/ds1-6-analysis-report.md",
    "docs/ds1-6-freeze-report.md",
  ]),
  forbiddenPatterns: DATA_SOURCE_STATUS_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS1:1", "DS1:2", "DS1:4", "DS1:5", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: DATA_SOURCE_STATUS_TAGS,
} satisfies StageManifest);

export const DATA_SOURCE_STATUS_MODULE_PATHS = Object.freeze(
  DATA_SOURCE_STATUS_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const STATUS_SET = new Set<string>(DATA_SOURCE_EXECUTIVE_STATUSES);
const HEALTH_SET = new Set<string>(DATA_SOURCE_HEALTH_STATES);
const PHASE_SET = new Set<string>(DATA_SOURCE_PROGRESS_PHASES);
const SIGNAL_SET = new Set<string>(DATA_SOURCE_STATUS_SIGNAL_SOURCES);
const POLICY_SET = new Set<string>(DATA_SOURCE_AGGREGATION_POLICIES);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_BUSINESS_SOURCE = "ebds-example-operational";
const EXAMPLE_SNAPSHOT = "dss-snapshot-example-001";

function issue(code: string, message: string): DataSourceStatusValidationIssue {
  return Object.freeze({ code, message });
}

export function computeDataSourceStatusOverallScore(dimensions: DataSourceStatusScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsDataSourceStatusMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function buildDataSourceStatusOwnershipContract(
  record: Pick<DataSourceStatusSnapshot, "statusSnapshotId" | "workspaceId">
): DataSourceStatusOwnershipContract {
  return Object.freeze({
    statusSnapshotId: record.statusSnapshotId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

export function validateDataSourceHealthIndicator(
  input: Partial<DataSourceHealthIndicator>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.healthState || !HEALTH_SET.has(input.healthState)) {
    issues.push(issue("invalid_health_state", "health.healthState must be a supported value."));
  }
  if (input.healthSource !== "observed") {
    issues.push(issue("invalid_health_source", "health.healthSource must be observed."));
  }
  if (
    input.healthScoreHint !== null &&
    input.healthScoreHint !== undefined &&
    (input.healthScoreHint < 0 || input.healthScoreHint > 100)
  ) {
    issues.push(issue("invalid_health_score", "health.healthScoreHint must be between 0 and 100."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceProgressIndicator(
  input: Partial<DataSourceProgressIndicator>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.progressPhase || !PHASE_SET.has(input.progressPhase)) {
    issues.push(issue("invalid_progress_phase", "progress.progressPhase must be a supported value."));
  }
  if (
    input.progressPercentHint !== null &&
    input.progressPercentHint !== undefined &&
    (input.progressPercentHint < 0 || input.progressPercentHint > 100)
  ) {
    issues.push(issue("invalid_progress_percent", "progress.progressPercentHint must be between 0 and 100."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceStatusError(input: Partial<DataSourceStatusError>): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.errorId?.trim()) issues.push(issue("missing_error_id", "errorId is required."));
  if (!input.errorCode?.trim()) issues.push(issue("missing_error_code", "errorCode is required."));
  if (!input.errorMessage?.trim()) issues.push(issue("missing_error_message", "errorMessage is required."));
  if (input.source && input.source !== DATA_SOURCE_STATUS_SOURCE) {
    issues.push(issue("invalid_error_source", "source must be phase-2-data-source-status."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceStatusWarning(
  input: Partial<DataSourceStatusWarning>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.warningId?.trim()) issues.push(issue("missing_warning_id", "warningId is required."));
  if (!input.warningCode?.trim()) issues.push(issue("missing_warning_code", "warningCode is required."));
  if (!input.warningMessage?.trim()) issues.push(issue("missing_warning_message", "warningMessage is required."));
  if (input.source && input.source !== DATA_SOURCE_STATUS_SOURCE) {
    issues.push(issue("invalid_warning_source", "source must be phase-2-data-source-status."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceStatusHistoryEntry(
  input: Partial<DataSourceStatusHistoryEntry>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.historyEntryId?.trim()) issues.push(issue("missing_history_id", "historyEntryId is required."));
  if (!input.newStatus || !STATUS_SET.has(input.newStatus)) {
    issues.push(issue("invalid_new_status", "newStatus must be a supported executive status."));
  }
  if (input.triggerSource && !SIGNAL_SET.has(input.triggerSource)) {
    issues.push(issue("invalid_trigger_source", "triggerSource must be a supported signal source."));
  }
  if (input.source && input.source !== DATA_SOURCE_STATUS_SOURCE) {
    issues.push(issue("invalid_history_source", "source must be phase-2-data-source-status."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceStatusAggregationContract(
  input: Partial<DataSourceStatusAggregationContract>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.statusSnapshotId?.trim()) issues.push(issue("missing_snapshot_id", "statusSnapshotId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.businessDataSourceId?.trim()) {
    issues.push(issue("missing_business_source_id", "businessDataSourceId is required."));
  }
  if (!input.primaryStatus || !STATUS_SET.has(input.primaryStatus)) {
    issues.push(issue("invalid_primary_status", "primaryStatus must be a supported executive status."));
  }
  if (!input.aggregationPolicy || !POLICY_SET.has(input.aggregationPolicy)) {
    issues.push(issue("invalid_aggregation_policy", "aggregationPolicy must be most_restrictive."));
  }
  if (!input.aggregatedAt?.trim()) issues.push(issue("missing_aggregated_at", "aggregatedAt is required."));
  if (!Array.isArray(input.contributingSignals)) {
    issues.push(issue("missing_signals", "contributingSignals must be an array."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDataSourceStatusSnapshot(
  input: Partial<DataSourceStatusSnapshot>
): DataSourceStatusValidationResult {
  const issues: DataSourceStatusValidationIssue[] = [];
  if (!input.statusSnapshotId?.trim()) issues.push(issue("missing_snapshot_id", "statusSnapshotId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.businessDataSourceId?.trim()) {
    issues.push(issue("missing_business_source_id", "businessDataSourceId is required."));
  }
  if (!input.observedAt?.trim()) issues.push(issue("missing_observed_at", "observedAt is required."));
  if (!input.status || !STATUS_SET.has(input.status)) {
    issues.push(issue("invalid_status", "status must be a supported executive status."));
  }
  if (!input.health) issues.push(issue("missing_health", "health is required."));
  else issues.push(...validateDataSourceHealthIndicator(input.health).issues);
  if (!input.progress) issues.push(issue("missing_progress", "progress is required."));
  else issues.push(...validateDataSourceProgressIndicator(input.progress).issues);
  if (!Array.isArray(input.errors)) issues.push(issue("missing_errors", "errors must be an array."));
  else {
    for (const entry of input.errors) issues.push(...validateDataSourceStatusError(entry).issues);
  }
  if (!Array.isArray(input.warnings)) issues.push(issue("missing_warnings", "warnings must be an array."));
  else {
    for (const entry of input.warnings) issues.push(...validateDataSourceStatusWarning(entry).issues);
  }
  if (!Array.isArray(input.history)) issues.push(issue("missing_history", "history must be an array."));
  else {
    for (const entry of input.history) issues.push(...validateDataSourceStatusHistoryEntry(entry).issues);
  }
  if (!Array.isArray(input.observedFrom) || input.observedFrom.length === 0) {
    issues.push(issue("missing_observed_from", "observedFrom must be a non-empty array."));
  } else if (input.observedFrom.some((source) => !SIGNAL_SET.has(source))) {
    issues.push(issue("invalid_observed_from", "observedFrom contains unsupported signal source."));
  }
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  if (!input.aggregation) issues.push(issue("missing_aggregation", "aggregation is required."));
  else issues.push(...validateDataSourceStatusAggregationContract(input.aggregation).issues);
  if (input.source && input.source !== DATA_SOURCE_STATUS_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-data-source-status."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function exampleSignals(): readonly DataSourceStatusSignal[] {
  return Object.freeze([
    Object.freeze({
      signalSource: "DS1:1" as const,
      referenceId: EXAMPLE_BUSINESS_SOURCE,
      observedValue: "active",
      observedAt: EXAMPLE_TS,
    }),
    Object.freeze({
      signalSource: "DS1:4" as const,
      referenceId: "idsc-req-import-001",
      observedValue: "completed",
      observedAt: EXAMPLE_TS,
    }),
  ]);
}

function exampleHistory(): readonly DataSourceStatusHistoryEntry[] {
  return Object.freeze([
    Object.freeze({
      historyEntryId: "dss-history-001",
      statusSnapshotId: EXAMPLE_SNAPSHOT,
      workspaceId: EXAMPLE_WORKSPACE,
      previousStatus: "validating",
      newStatus: "active",
      triggerSource: "DS1:4",
      triggerReferenceId: "idsc-req-validate-001",
      observedAt: EXAMPLE_TS,
      source: DATA_SOURCE_STATUS_SOURCE,
    }),
  ]);
}

export function resolveDataSourceStatusSnapshotExample(): DataSourceStatusSnapshot {
  const health: DataSourceHealthIndicator = Object.freeze({
    healthState: "healthy",
    healthScoreHint: 95,
    lastHealthCheckAt: EXAMPLE_TS,
    healthSource: "observed",
  });
  const progress: DataSourceProgressIndicator = Object.freeze({
    progressPhase: "complete",
    progressPercentHint: 100,
    activeRequestId: null,
    progressLabel: "Source active",
  });
  const errors: readonly DataSourceStatusError[] = Object.freeze([]);
  const warnings: readonly DataSourceStatusWarning[] = Object.freeze([
    Object.freeze({
      warningId: "dss-warning-001",
      statusSnapshotId: EXAMPLE_SNAPSHOT,
      workspaceId: EXAMPLE_WORKSPACE,
      warningCode: "STALE_ESTIMATE",
      warningMessage: "Record count estimate is older than 24 hours.",
      relatedRequestId: null,
      observedAt: EXAMPLE_TS,
      severity: "low",
      source: DATA_SOURCE_STATUS_SOURCE,
    }),
  ]);
  const metadata: DataSourceStatusMetadata = Object.freeze({
    displayName: "Operational KPI Feed",
    connectorTypeHint: "csv",
    executiveCategoryHint: "operational",
    adapterLinkId: "wra-example-operational",
    wizardSessionId: "mwi-session-example-001",
    requestIds: Object.freeze(["idsc-req-register-csv", "idsc-req-import-001"]),
    tags: Object.freeze(["example", "ds1-6"]),
  });
  const aggregation: DataSourceStatusAggregationContract = Object.freeze({
    statusSnapshotId: EXAMPLE_SNAPSHOT,
    workspaceId: EXAMPLE_WORKSPACE,
    businessDataSourceId: EXAMPLE_BUSINESS_SOURCE,
    primaryStatus: "active",
    contributingSignals: exampleSignals(),
    aggregatedAt: EXAMPLE_TS,
    aggregationPolicy: "most_restrictive",
  });

  return Object.freeze({
    contractVersion: DATA_SOURCE_STATUS_VERSION,
    statusSnapshotId: EXAMPLE_SNAPSHOT,
    workspaceId: EXAMPLE_WORKSPACE,
    businessDataSourceId: EXAMPLE_BUSINESS_SOURCE,
    observedAt: EXAMPLE_TS,
    status: "active",
    health,
    progress,
    errors,
    warnings,
    history: exampleHistory(),
    observedFrom: Object.freeze(["DS1:1", "DS1:4"] as const),
    metadata,
    aggregation,
    source: DATA_SOURCE_STATUS_SOURCE,
  });
}

export function resolveDataSourceStatusSnapshotExampleForStatus(
  status: DataSourceExecutiveStatus
): DataSourceStatusSnapshot {
  const base = resolveDataSourceStatusSnapshotExample();
  return Object.freeze({
    ...base,
    status,
    aggregation: Object.freeze({
      ...base.aggregation,
      primaryStatus: status,
    }),
  });
}
