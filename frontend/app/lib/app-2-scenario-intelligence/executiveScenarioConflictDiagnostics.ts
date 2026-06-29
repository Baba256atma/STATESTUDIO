/**
 * APP-2:6 — Executive Scenario Conflict diagnostics.
 * Conflict-specific diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_CONFLICT_DIAGNOSTICS_VERSION = "APP-2/6" as const;

export type ExecutiveScenarioConflictDiagnosticCode =
  | "missing_context"
  | "missing_priority"
  | "missing_dependency_graph"
  | "invalid_conflict_node"
  | "invalid_conflict_edge"
  | "circular_conflict"
  | "broken_reference"
  | "missing_evidence"
  | "incomplete_graph";

export type ExecutiveScenarioConflictDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioConflictDiagnostic = Readonly<{
  code: ExecutiveScenarioConflictDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioConflictDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_CONFLICT_DIAGNOSTIC_CODES = Object.freeze([
  "missing_context",
  "missing_priority",
  "missing_dependency_graph",
  "invalid_conflict_node",
  "invalid_conflict_edge",
  "circular_conflict",
  "broken_reference",
  "missing_evidence",
  "incomplete_graph",
] as const satisfies readonly ExecutiveScenarioConflictDiagnosticCode[]);

export function createExecutiveScenarioConflictDiagnostic(
  code: ExecutiveScenarioConflictDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioConflictDiagnostic {
  const severity: ExecutiveScenarioConflictDiagnosticSeverity =
    code === "missing_context" ||
    code === "missing_priority" ||
    code === "missing_dependency_graph" ||
    code === "invalid_conflict_node" ||
    code === "invalid_conflict_edge"
      ? "error"
      : code === "circular_conflict" ||
          code === "broken_reference" ||
          code === "incomplete_graph" ||
          code === "missing_evidence"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
