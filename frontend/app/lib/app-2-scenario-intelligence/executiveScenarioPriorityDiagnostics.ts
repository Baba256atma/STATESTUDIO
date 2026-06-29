/**
 * APP-2:4 — Executive Scenario Priority diagnostics.
 * Priority-specific diagnostic vocabulary — no runtime remediation logic.
 */

export const EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTICS_VERSION = "APP-2/4" as const;

export type ExecutiveScenarioPriorityDiagnosticCode =
  | "missing_context"
  | "missing_state"
  | "missing_executive_time"
  | "missing_timeline"
  | "missing_kpi"
  | "missing_risk"
  | "missing_evidence"
  | "incomplete_context"
  | "invalid_priority";

export type ExecutiveScenarioPriorityDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioPriorityDiagnostic = Readonly<{
  code: ExecutiveScenarioPriorityDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioPriorityDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTIC_CODES = Object.freeze([
  "missing_context",
  "missing_state",
  "missing_executive_time",
  "missing_timeline",
  "missing_kpi",
  "missing_risk",
  "missing_evidence",
  "incomplete_context",
  "invalid_priority",
] as const satisfies readonly ExecutiveScenarioPriorityDiagnosticCode[]);

export const EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTIC_DEFINITIONS = Object.freeze([
  Object.freeze({ code: "missing_context" as const, severity: "error" as const }),
  Object.freeze({ code: "missing_state" as const, severity: "error" as const }),
  Object.freeze({ code: "missing_executive_time" as const, severity: "warning" as const }),
  Object.freeze({ code: "missing_timeline" as const, severity: "warning" as const }),
  Object.freeze({ code: "missing_kpi" as const, severity: "warning" as const }),
  Object.freeze({ code: "missing_risk" as const, severity: "warning" as const }),
  Object.freeze({ code: "missing_evidence" as const, severity: "warning" as const }),
  Object.freeze({ code: "incomplete_context" as const, severity: "warning" as const }),
  Object.freeze({ code: "invalid_priority" as const, severity: "error" as const }),
]);

export function createExecutiveScenarioPriorityDiagnostic(
  code: ExecutiveScenarioPriorityDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioPriorityDiagnostic {
  const definition = EXECUTIVE_SCENARIO_PRIORITY_DIAGNOSTIC_DEFINITIONS.find(
    (entry) => entry.code === code
  );
  return Object.freeze({
    code,
    message,
    severity: definition?.severity ?? "error",
    timestamp,
    metadata,
  });
}
