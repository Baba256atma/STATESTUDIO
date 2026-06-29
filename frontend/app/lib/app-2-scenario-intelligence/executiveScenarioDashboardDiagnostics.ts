/**
 * APP-2:12 — Executive Scenario Dashboard diagnostics.
 * Dashboard integration diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTICS_VERSION = "APP-2/12" as const;

export type ExecutiveScenarioDashboardDiagnosticCode =
  | "missing_workspace_view"
  | "missing_summary"
  | "missing_recommendation_portfolio"
  | "missing_card"
  | "invalid_indicator"
  | "invalid_alert"
  | "adapter_failure";

export type ExecutiveScenarioDashboardDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioDashboardDiagnostic = Readonly<{
  code: ExecutiveScenarioDashboardDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioDashboardDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTIC_CODES = Object.freeze([
  "missing_workspace_view",
  "missing_summary",
  "missing_recommendation_portfolio",
  "missing_card",
  "invalid_indicator",
  "invalid_alert",
  "adapter_failure",
] as const satisfies readonly ExecutiveScenarioDashboardDiagnosticCode[]);

export function createExecutiveScenarioDashboardDiagnostic(
  code: ExecutiveScenarioDashboardDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioDashboardDiagnostic {
  const severity: ExecutiveScenarioDashboardDiagnosticSeverity =
    code === "missing_workspace_view" ||
    code === "missing_summary" ||
    code === "missing_recommendation_portfolio" ||
    code === "adapter_failure"
      ? "error"
      : code === "missing_card" || code === "invalid_indicator" || code === "invalid_alert"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
