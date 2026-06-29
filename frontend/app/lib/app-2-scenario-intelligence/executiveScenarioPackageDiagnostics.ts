/**
 * APP-2:9.5 — Executive Scenario Package diagnostics.
 * Export-layer diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTICS_VERSION = "APP-2/9.5" as const;

export type ExecutiveScenarioPackageDiagnosticCode =
  | "missing_snapshot"
  | "missing_summary"
  | "missing_recommendation_portfolio"
  | "version_mismatch"
  | "incomplete_package"
  | "invalid_metadata"
  | "certification_missing";

export type ExecutiveScenarioPackageDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioPackageDiagnostic = Readonly<{
  code: ExecutiveScenarioPackageDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioPackageDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTIC_CODES = Object.freeze([
  "missing_snapshot",
  "missing_summary",
  "missing_recommendation_portfolio",
  "version_mismatch",
  "incomplete_package",
  "invalid_metadata",
  "certification_missing",
] as const satisfies readonly ExecutiveScenarioPackageDiagnosticCode[]);

export function createExecutiveScenarioPackageDiagnostic(
  code: ExecutiveScenarioPackageDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioPackageDiagnostic {
  const severity: ExecutiveScenarioPackageDiagnosticSeverity =
    code === "missing_snapshot" ||
    code === "missing_summary" ||
    code === "missing_recommendation_portfolio" ||
    code === "version_mismatch" ||
    code === "invalid_metadata" ||
    code === "certification_missing"
      ? "error"
      : code === "incomplete_package"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
