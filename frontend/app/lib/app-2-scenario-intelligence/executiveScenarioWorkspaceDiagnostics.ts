/**
 * APP-2:10 — Executive Scenario Workspace diagnostics.
 * Workspace integration diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTICS_VERSION = "APP-2/10" as const;

export type ExecutiveScenarioWorkspaceDiagnosticCode =
  | "missing_package"
  | "invalid_workspace"
  | "invalid_scenario"
  | "version_mismatch"
  | "stale_package"
  | "workspace_isolation_failure"
  | "refresh_failure"
  | "invalid_selection";

export type ExecutiveScenarioWorkspaceDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioWorkspaceDiagnostic = Readonly<{
  code: ExecutiveScenarioWorkspaceDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioWorkspaceDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTIC_CODES = Object.freeze([
  "missing_package",
  "invalid_workspace",
  "invalid_scenario",
  "version_mismatch",
  "stale_package",
  "workspace_isolation_failure",
  "refresh_failure",
  "invalid_selection",
] as const satisfies readonly ExecutiveScenarioWorkspaceDiagnosticCode[]);

export function createExecutiveScenarioWorkspaceDiagnostic(
  code: ExecutiveScenarioWorkspaceDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioWorkspaceDiagnostic {
  const severity: ExecutiveScenarioWorkspaceDiagnosticSeverity =
    code === "missing_package" ||
    code === "invalid_workspace" ||
    code === "version_mismatch" ||
    code === "workspace_isolation_failure" ||
    code === "refresh_failure"
      ? "error"
      : code === "invalid_scenario" ||
          code === "stale_package" ||
          code === "invalid_selection"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
