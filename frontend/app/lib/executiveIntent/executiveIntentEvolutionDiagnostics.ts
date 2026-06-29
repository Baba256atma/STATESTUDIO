/**
 * APP-3:9 — Executive Intent evolution diagnostics vocabulary.
 */

export const EXECUTIVE_INTENT_EVOLUTION_DIAGNOSTICS_VERSION = "APP-3/9" as const;

export type IntentEvolutionDiagnosticCode =
  | "no_evolution"
  | "new_version"
  | "replaced"
  | "merged"
  | "split"
  | "superseded"
  | "active_version"
  | "root_intent"
  | "lineage_complete"
  | "broken_lineage"
  | "multiple_parents"
  | "unknown_history"
  | "archived_branch"
  | "parallel_branch"
  | "evolution_timeline_ready"
  | "evolution_detection_success"
  | "reserved_future_diagnostic";

export type IntentEvolutionDiagnosticSeverity = "info" | "warning" | "error";

export type IntentEvolutionDiagnostic = Readonly<{
  code: IntentEvolutionDiagnosticCode;
  severity: IntentEvolutionDiagnosticSeverity;
  message: string;
  explanation: string;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const INTENT_EVOLUTION_DIAGNOSTIC_CODES = Object.freeze([
  "no_evolution",
  "new_version",
  "replaced",
  "merged",
  "split",
  "superseded",
  "active_version",
  "root_intent",
  "lineage_complete",
  "broken_lineage",
  "multiple_parents",
  "unknown_history",
  "archived_branch",
  "parallel_branch",
  "evolution_timeline_ready",
  "evolution_detection_success",
  "reserved_future_diagnostic",
] as const satisfies readonly IntentEvolutionDiagnosticCode[]);

const DEFAULT_SEVERITY: Readonly<
  Record<IntentEvolutionDiagnosticCode, IntentEvolutionDiagnosticSeverity>
> = Object.freeze({
  no_evolution: "info",
  new_version: "info",
  replaced: "info",
  merged: "info",
  split: "info",
  superseded: "info",
  active_version: "info",
  root_intent: "info",
  lineage_complete: "info",
  broken_lineage: "error",
  multiple_parents: "warning",
  unknown_history: "warning",
  archived_branch: "info",
  parallel_branch: "info",
  evolution_timeline_ready: "info",
  evolution_detection_success: "info",
  reserved_future_diagnostic: "info",
});

export function isIntentEvolutionDiagnosticCode(
  value: string
): value is IntentEvolutionDiagnosticCode {
  return (INTENT_EVOLUTION_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createIntentEvolutionDiagnostic(
  code: IntentEvolutionDiagnosticCode,
  message: string,
  timestamp: string,
  options: Readonly<{
    explanation?: string;
    metadata?: Readonly<Record<string, unknown>>;
  }> = Object.freeze({})
): IntentEvolutionDiagnostic {
  return Object.freeze({
    code,
    severity: DEFAULT_SEVERITY[code],
    message,
    explanation: options.explanation ?? message,
    timestamp,
    metadata: options.metadata ?? Object.freeze({}),
  });
}
