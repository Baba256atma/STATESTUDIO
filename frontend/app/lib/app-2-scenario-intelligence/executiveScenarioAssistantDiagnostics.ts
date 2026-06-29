/**
 * APP-2:11 — Executive Scenario Assistant diagnostics.
 * Assistant integration diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTICS_VERSION = "APP-2/11" as const;

export type ExecutiveScenarioAssistantDiagnosticCode =
  | "missing_workspace_view"
  | "missing_summary"
  | "missing_recommendation_portfolio"
  | "invalid_conversation_context"
  | "missing_evidence"
  | "invalid_topic"
  | "adapter_failure";

export type ExecutiveScenarioAssistantDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioAssistantDiagnostic = Readonly<{
  code: ExecutiveScenarioAssistantDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioAssistantDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTIC_CODES = Object.freeze([
  "missing_workspace_view",
  "missing_summary",
  "missing_recommendation_portfolio",
  "invalid_conversation_context",
  "missing_evidence",
  "invalid_topic",
  "adapter_failure",
] as const satisfies readonly ExecutiveScenarioAssistantDiagnosticCode[]);

export function createExecutiveScenarioAssistantDiagnostic(
  code: ExecutiveScenarioAssistantDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioAssistantDiagnostic {
  const severity: ExecutiveScenarioAssistantDiagnosticSeverity =
    code === "missing_workspace_view" ||
    code === "missing_summary" ||
    code === "missing_recommendation_portfolio" ||
    code === "invalid_conversation_context" ||
    code === "adapter_failure"
      ? "error"
      : code === "missing_evidence" || code === "invalid_topic"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
