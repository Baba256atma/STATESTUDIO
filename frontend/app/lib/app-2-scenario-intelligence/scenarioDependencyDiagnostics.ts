/**
 * APP-2:5 — Scenario Dependency diagnostics.
 * Dependency-specific diagnostic vocabulary — no remediation logic.
 */

export const SCENARIO_DEPENDENCY_DIAGNOSTICS_VERSION = "APP-2/5" as const;

export type ScenarioDependencyDiagnosticCode =
  | "missing_context"
  | "missing_priority"
  | "missing_state"
  | "missing_workspace"
  | "circular_dependency"
  | "broken_reference"
  | "invalid_node"
  | "invalid_edge"
  | "incomplete_graph"
  | "missing_dependency";

export type ScenarioDependencyDiagnosticSeverity = "info" | "warning" | "error";

export type ScenarioDependencyDiagnostic = Readonly<{
  code: ScenarioDependencyDiagnosticCode;
  message: string;
  severity: ScenarioDependencyDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const SCENARIO_DEPENDENCY_DIAGNOSTIC_CODES = Object.freeze([
  "missing_context",
  "missing_priority",
  "missing_state",
  "missing_workspace",
  "circular_dependency",
  "broken_reference",
  "invalid_node",
  "invalid_edge",
  "incomplete_graph",
  "missing_dependency",
] as const satisfies readonly ScenarioDependencyDiagnosticCode[]);

export function createScenarioDependencyDiagnostic(
  code: ScenarioDependencyDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ScenarioDependencyDiagnostic {
  const severity: ScenarioDependencyDiagnosticSeverity =
    code === "missing_context" ||
    code === "missing_priority" ||
    code === "missing_state" ||
    code === "missing_workspace" ||
    code === "invalid_node" ||
    code === "invalid_edge"
      ? "error"
      : code === "circular_dependency" || code === "broken_reference" || code === "incomplete_graph"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
