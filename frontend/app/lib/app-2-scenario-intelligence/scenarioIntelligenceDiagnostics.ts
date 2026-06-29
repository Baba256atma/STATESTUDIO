/**
 * APP-2:1 — Scenario Intelligence diagnostics contract.
 * Diagnostic vocabulary only — no runtime detection or remediation logic.
 */

import type {
  ScenarioDiagnostic,
  ScenarioDiagnosticCode,
  ScenarioDiagnosticDefinition,
} from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_INTELLIGENCE_DIAGNOSTICS_VERSION = "APP-2/1" as const;

export const SCENARIO_DIAGNOSTIC_CODES = Object.freeze([
  "missing_scenario",
  "missing_context",
  "invalid_workspace",
  "invalid_timeline",
  "contract_violation",
  "lifecycle_error",
  "dependency_error",
] as const satisfies readonly ScenarioDiagnosticCode[]);

export const SCENARIO_DIAGNOSTIC_DEFINITIONS: readonly ScenarioDiagnosticDefinition[] = Object.freeze([
  Object.freeze({
    code: "missing_scenario",
    label: "Missing Scenario",
    description: "Requested scenario identity does not exist in the contract boundary.",
    severity: "error",
  }),
  Object.freeze({
    code: "missing_context",
    label: "Missing Context",
    description: "Required scenario context snapshot is absent or incomplete.",
    severity: "error",
  }),
  Object.freeze({
    code: "invalid_workspace",
    label: "Invalid Workspace",
    description: "Workspace reference is missing, malformed, or outside contract scope.",
    severity: "error",
  }),
  Object.freeze({
    code: "invalid_timeline",
    label: "Invalid Timeline",
    description: "Timeline reference is missing, malformed, or not read-only compliant.",
    severity: "error",
  }),
  Object.freeze({
    code: "contract_violation",
    label: "Contract Violation",
    description: "Input or dependency violates APP-2 contract boundaries.",
    severity: "error",
  }),
  Object.freeze({
    code: "lifecycle_error",
    label: "Lifecycle Error",
    description: "Scenario lifecycle stage is unknown or transition metadata is invalid.",
    severity: "warning",
  }),
  Object.freeze({
    code: "dependency_error",
    label: "Dependency Error",
    description: "Required executive reference dependency is unavailable or invalid.",
    severity: "warning",
  }),
]);

export function isScenarioDiagnosticCode(value: string): value is ScenarioDiagnosticCode {
  return (SCENARIO_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function getScenarioDiagnosticDefinition(
  code: ScenarioDiagnosticCode
): ScenarioDiagnosticDefinition | null {
  return SCENARIO_DIAGNOSTIC_DEFINITIONS.find((entry) => entry.code === code) ?? null;
}

export function createScenarioDiagnostic(
  code: ScenarioDiagnosticCode,
  message: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ScenarioDiagnostic {
  const definition = getScenarioDiagnosticDefinition(code);
  return Object.freeze({
    code,
    message,
    severity: definition?.severity ?? "error",
    timestamp: new Date(0).toISOString(),
    metadata,
  });
}
