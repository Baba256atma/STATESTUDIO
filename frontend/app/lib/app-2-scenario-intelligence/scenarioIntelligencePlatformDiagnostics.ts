/**
 * APP-2:13 — Scenario Intelligence Platform diagnostics.
 * Platform certification diagnostic vocabulary — no remediation logic.
 */

export const SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTICS_VERSION = "APP-2/13" as const;

export type ScenarioIntelligencePlatformDiagnosticCode =
  | "architecture_violation"
  | "regression_failure"
  | "isolation_failure"
  | "serialization_failure"
  | "package_failure"
  | "adapter_failure"
  | "workspace_failure"
  | "read_only_violation"
  | "certification_failure"
  | "version_mismatch";

export type ScenarioIntelligencePlatformDiagnosticCategory =
  | "architecture"
  | "regression"
  | "isolation"
  | "serialization"
  | "package"
  | "adapters"
  | "workspace"
  | "read_only"
  | "certification"
  | "version";

export type ScenarioIntelligencePlatformDiagnosticSeverity = "info" | "warning" | "error";

export type ScenarioIntelligencePlatformDiagnostic = Readonly<{
  code: ScenarioIntelligencePlatformDiagnosticCode;
  category: ScenarioIntelligencePlatformDiagnosticCategory;
  message: string;
  severity: ScenarioIntelligencePlatformDiagnosticSeverity;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CODES = Object.freeze([
  "architecture_violation",
  "regression_failure",
  "isolation_failure",
  "serialization_failure",
  "package_failure",
  "adapter_failure",
  "workspace_failure",
  "read_only_violation",
  "certification_failure",
  "version_mismatch",
] as const satisfies readonly ScenarioIntelligencePlatformDiagnosticCode[]);

export const SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CATEGORIES = Object.freeze([
  "architecture",
  "regression",
  "isolation",
  "serialization",
  "package",
  "adapters",
  "workspace",
  "read_only",
  "certification",
  "version",
] as const satisfies readonly ScenarioIntelligencePlatformDiagnosticCategory[]);

export function createScenarioIntelligencePlatformDiagnostic(
  code: ScenarioIntelligencePlatformDiagnosticCode,
  category: ScenarioIntelligencePlatformDiagnosticCategory,
  message: string,
  timestamp: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): ScenarioIntelligencePlatformDiagnostic {
  const severity: ScenarioIntelligencePlatformDiagnosticSeverity =
    code === "architecture_violation" ||
    code === "regression_failure" ||
    code === "isolation_failure" ||
    code === "package_failure" ||
    code === "adapter_failure" ||
    code === "read_only_violation" ||
    code === "certification_failure" ||
    code === "version_mismatch"
      ? "error"
      : code === "serialization_failure" || code === "workspace_failure"
        ? "warning"
        : "info";
  return Object.freeze({ code, category, message, severity, timestamp, metadata });
}
