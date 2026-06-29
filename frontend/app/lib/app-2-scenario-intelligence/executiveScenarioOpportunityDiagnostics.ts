/**
 * APP-2:7 — Executive Scenario Opportunity diagnostics.
 * Opportunity-specific diagnostic vocabulary — no remediation logic.
 */

export const EXECUTIVE_SCENARIO_OPPORTUNITY_DIAGNOSTICS_VERSION = "APP-2/7" as const;

export type ExecutiveScenarioOpportunityDiagnosticCode =
  | "missing_context"
  | "missing_priority"
  | "missing_dependency_graph"
  | "missing_conflict_graph"
  | "invalid_opportunity_node"
  | "invalid_opportunity_edge"
  | "missing_evidence"
  | "broken_reference"
  | "incomplete_graph";

export type ExecutiveScenarioOpportunityDiagnosticSeverity = "info" | "warning" | "error";

export type ExecutiveScenarioOpportunityDiagnostic = Readonly<{
  code: ExecutiveScenarioOpportunityDiagnosticCode;
  message: string;
  severity: ExecutiveScenarioOpportunityDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const EXECUTIVE_SCENARIO_OPPORTUNITY_DIAGNOSTIC_CODES = Object.freeze([
  "missing_context",
  "missing_priority",
  "missing_dependency_graph",
  "missing_conflict_graph",
  "invalid_opportunity_node",
  "invalid_opportunity_edge",
  "missing_evidence",
  "broken_reference",
  "incomplete_graph",
] as const satisfies readonly ExecutiveScenarioOpportunityDiagnosticCode[]);

export function createExecutiveScenarioOpportunityDiagnostic(
  code: ExecutiveScenarioOpportunityDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ExecutiveScenarioOpportunityDiagnostic {
  const severity: ExecutiveScenarioOpportunityDiagnosticSeverity =
    code === "missing_context" ||
    code === "missing_priority" ||
    code === "missing_dependency_graph" ||
    code === "missing_conflict_graph" ||
    code === "invalid_opportunity_node" ||
    code === "invalid_opportunity_edge"
      ? "error"
      : code === "broken_reference" ||
          code === "incomplete_graph" ||
          code === "missing_evidence"
        ? "warning"
        : "info";
  return Object.freeze({ code, message, severity, timestamp, metadata });
}
