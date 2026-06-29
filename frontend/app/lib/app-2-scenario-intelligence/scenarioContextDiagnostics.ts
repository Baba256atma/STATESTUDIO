/**
 * APP-2:3 — Scenario Context diagnostics.
 * Context-specific diagnostic vocabulary — no runtime remediation logic.
 */

export const SCENARIO_CONTEXT_DIAGNOSTICS_VERSION = "APP-2/3" as const;

export type ScenarioContextDiagnosticCode =
  | "missing_workspace"
  | "missing_scenario"
  | "missing_state"
  | "missing_timeline"
  | "missing_executive_time"
  | "missing_object"
  | "missing_kpi"
  | "missing_risk"
  | "missing_relationship"
  | "missing_decision_reference"
  | "missing_simulation_reference"
  | "missing_compare_reference"
  | "missing_data_source"
  | "invalid_context"
  | "incomplete_context";

export type ScenarioContextDiagnosticSeverity = "info" | "warning" | "error";

export type ScenarioContextDiagnostic = Readonly<{
  code: ScenarioContextDiagnosticCode;
  message: string;
  severity: ScenarioContextDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const SCENARIO_CONTEXT_DIAGNOSTIC_CODES = Object.freeze([
  "missing_workspace",
  "missing_scenario",
  "missing_state",
  "missing_timeline",
  "missing_executive_time",
  "missing_object",
  "missing_kpi",
  "missing_risk",
  "missing_relationship",
  "missing_decision_reference",
  "missing_simulation_reference",
  "missing_compare_reference",
  "missing_data_source",
  "invalid_context",
  "incomplete_context",
] as const satisfies readonly ScenarioContextDiagnosticCode[]);

export const SCENARIO_CONTEXT_DIAGNOSTIC_DEFINITIONS = Object.freeze([
  Object.freeze({
    code: "missing_workspace" as const,
    label: "Missing Workspace",
    severity: "error" as const,
  }),
  Object.freeze({
    code: "missing_scenario" as const,
    label: "Missing Scenario",
    severity: "error" as const,
  }),
  Object.freeze({
    code: "missing_state" as const,
    label: "Missing State",
    severity: "error" as const,
  }),
  Object.freeze({
    code: "missing_timeline" as const,
    label: "Missing Timeline",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_executive_time" as const,
    label: "Missing Executive Time",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_object" as const,
    label: "Missing Object",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_kpi" as const,
    label: "Missing KPI",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_risk" as const,
    label: "Missing Risk",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_relationship" as const,
    label: "Missing Relationship",
    severity: "warning" as const,
  }),
  Object.freeze({
    code: "missing_decision_reference" as const,
    label: "Missing Decision Reference",
    severity: "info" as const,
  }),
  Object.freeze({
    code: "missing_simulation_reference" as const,
    label: "Missing Simulation Reference",
    severity: "info" as const,
  }),
  Object.freeze({
    code: "missing_compare_reference" as const,
    label: "Missing Compare Reference",
    severity: "info" as const,
  }),
  Object.freeze({
    code: "missing_data_source" as const,
    label: "Missing Data Source",
    severity: "info" as const,
  }),
  Object.freeze({
    code: "invalid_context" as const,
    label: "Invalid Context",
    severity: "error" as const,
  }),
  Object.freeze({
    code: "incomplete_context" as const,
    label: "Incomplete Context",
    severity: "warning" as const,
  }),
]);

export function isScenarioContextDiagnosticCode(
  value: string
): value is ScenarioContextDiagnosticCode {
  return (SCENARIO_CONTEXT_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createScenarioContextDiagnostic(
  code: ScenarioContextDiagnosticCode,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ScenarioContextDiagnostic {
  const definition = SCENARIO_CONTEXT_DIAGNOSTIC_DEFINITIONS.find((entry) => entry.code === code);
  return Object.freeze({
    code,
    message,
    severity: definition?.severity ?? "error",
    timestamp,
    metadata,
  });
}

export function mapContractDiagnosticToContextDiagnostic(
  input: Readonly<{
    code: string;
    message: string;
    severity: ScenarioContextDiagnosticSeverity;
    timestamp: string;
    metadata: Readonly<Record<string, unknown>>;
  }>
): ScenarioContextDiagnostic {
  const mappedCode: ScenarioContextDiagnosticCode = isScenarioContextDiagnosticCode(input.code)
    ? input.code
    : input.code === "missing_context"
      ? "incomplete_context"
      : input.code === "invalid_workspace"
        ? "missing_workspace"
        : input.code === "dependency_error"
          ? "missing_executive_time"
          : input.code === "missing_scenario"
            ? "missing_scenario"
            : input.code === "invalid_timeline"
              ? "missing_timeline"
              : input.code === "contract_violation"
                ? "invalid_context"
                : "incomplete_context";

  return createScenarioContextDiagnostic(mappedCode, input.message, input.timestamp, input.metadata);
}
