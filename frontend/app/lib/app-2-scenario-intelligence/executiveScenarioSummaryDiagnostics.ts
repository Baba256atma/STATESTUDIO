/**
 * APP-2:8 — Executive Scenario Summary diagnostics.
 * Summary and snapshot diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTICS_VERSION = "APP-2/8" as const;

export type ExecutiveScenarioSnapshotDiagnosticCode =
  | "missing_context"
  | "missing_state"
  | "missing_priority"
  | "missing_dependency_graph"
  | "missing_conflict_graph"
  | "missing_opportunity_graph"
  | "broken_reference";

export type ExecutiveScenarioSummaryDiagnosticCode =
  | "missing_snapshot"
  | "missing_context"
  | "missing_state"
  | "missing_priority"
  | "missing_dependency_graph"
  | "missing_conflict_graph"
  | "missing_opportunity_graph"
  | "missing_evidence"
  | "invalid_summary"
  | "incomplete_summary";

export type ExecutiveScenarioSummaryDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioSnapshotDiagnostic = Readonly<{
  code: ExecutiveScenarioSnapshotDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioSummaryDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveScenarioSummaryDiagnostic = Readonly<{
  code: ExecutiveScenarioSummaryDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioSummaryDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_SNAPSHOT_DIAGNOSTIC_CODES = Object.freeze([
  "missing_context",
  "missing_state",
  "missing_priority",
  "missing_dependency_graph",
  "missing_conflict_graph",
  "missing_opportunity_graph",
  "broken_reference",
] as const satisfies readonly ExecutiveScenarioSnapshotDiagnosticCode[]);

export const EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTIC_CODES = Object.freeze([
  "missing_snapshot",
  "missing_context",
  "missing_state",
  "missing_priority",
  "missing_dependency_graph",
  "missing_conflict_graph",
  "missing_opportunity_graph",
  "missing_evidence",
  "invalid_summary",
  "incomplete_summary",
] as const satisfies readonly ExecutiveScenarioSummaryDiagnosticCode[]);

function snapshotSeverity(
  code: ExecutiveScenarioSnapshotDiagnosticCode
): ExecutiveScenarioSummaryDiagnosticSeverity {
  if (
    code === "missing_context" ||
    code === "missing_priority" ||
    code === "missing_dependency_graph" ||
    code === "missing_conflict_graph" ||
    code === "missing_opportunity_graph" ||
    code === "broken_reference"
  ) {
    return "error";
  }
  return "warning";
}

function summarySeverity(
  code: ExecutiveScenarioSummaryDiagnosticCode
): ExecutiveScenarioSummaryDiagnosticSeverity {
  if (
    code === "missing_snapshot" ||
    code === "missing_context" ||
    code === "missing_priority" ||
    code === "missing_dependency_graph" ||
    code === "missing_conflict_graph" ||
    code === "missing_opportunity_graph" ||
    code === "invalid_summary"
  ) {
    return "error";
  }
  return "warning";
}

export function createExecutiveScenarioSnapshotDiagnostic(
  code: ExecutiveScenarioSnapshotDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioSnapshotDiagnostic {
  return Object.freeze({
    code,
    message,
    severity: snapshotSeverity(code),
    timestamp,
    metadata,
  });
}

export function createExecutiveScenarioSummaryDiagnostic(
  code: ExecutiveScenarioSummaryDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioSummaryDiagnostic {
  return Object.freeze({
    code,
    message,
    severity: summarySeverity(code),
    timestamp,
    metadata,
  });
}
