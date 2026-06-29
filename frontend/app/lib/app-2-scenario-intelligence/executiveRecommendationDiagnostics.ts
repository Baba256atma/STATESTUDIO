/**
 * APP-2:9 — Executive Recommendation diagnostics.
 * Portfolio-specific diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_RECOMMENDATION_DIAGNOSTICS_VERSION = "APP-2/9" as const;

export type ExecutiveRecommendationDiagnosticCode =
  | "missing_snapshot"
  | "missing_summary"
  | "missing_evidence"
  | "missing_constraints"
  | "invalid_recommendation"
  | "empty_portfolio"
  | "invalid_confidence"
  | "incomplete_recommendation";

export type ExecutiveRecommendationDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveRecommendationDiagnostic = Readonly<{
  code: ExecutiveRecommendationDiagnosticCode;
  message: string;
  severity: ExecutiveRecommendationDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_RECOMMENDATION_DIAGNOSTIC_CODES = Object.freeze([
  "missing_snapshot",
  "missing_summary",
  "missing_evidence",
  "missing_constraints",
  "invalid_recommendation",
  "empty_portfolio",
  "invalid_confidence",
  "incomplete_recommendation",
] as const satisfies readonly ExecutiveRecommendationDiagnosticCode[]);

export function createExecutiveRecommendationDiagnostic(
  code: ExecutiveRecommendationDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveRecommendationDiagnostic {
  const severity: ExecutiveRecommendationDiagnosticSeverity =
    code === "missing_snapshot" ||
    code === "missing_summary" ||
    code === "invalid_recommendation" ||
    code === "empty_portfolio" ||
    code === "invalid_confidence"
      ? "error"
      : code === "missing_evidence" ||
          code === "missing_constraints" ||
          code === "incomplete_recommendation"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
