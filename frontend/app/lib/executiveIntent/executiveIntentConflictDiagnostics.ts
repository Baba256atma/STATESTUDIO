/**
 * APP-3:7 — Executive Intent conflict diagnostics vocabulary.
 */

export const EXECUTIVE_INTENT_CONFLICT_DIAGNOSTICS_VERSION = "APP-3/7" as const;

export type IntentConflictDiagnosticCode =
  | "no_conflict"
  | "resource_conflict"
  | "target_conflict"
  | "time_conflict"
  | "classification_conflict"
  | "duplicate_intent"
  | "goal_contradiction"
  | "constraint_conflict"
  | "assumption_conflict"
  | "unknown_conflict"
  | "multiple_conflicts"
  | "shared_target_detected"
  | "shared_resource_detected"
  | "timeline_overlap_detected"
  | "conflict_detection_success"
  | "conflict_detection_incomplete"
  | "reserved_future_diagnostic";

export type IntentConflictDiagnosticSeverity = "info" | "warning" | "error";

export type IntentConflictDiagnostic = Readonly<{
  code: IntentConflictDiagnosticCode;
  severity: IntentConflictDiagnosticSeverity;
  message: string;
  explanation: string;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const INTENT_CONFLICT_DIAGNOSTIC_CODES = Object.freeze([
  "no_conflict",
  "resource_conflict",
  "target_conflict",
  "time_conflict",
  "classification_conflict",
  "duplicate_intent",
  "goal_contradiction",
  "constraint_conflict",
  "assumption_conflict",
  "unknown_conflict",
  "multiple_conflicts",
  "shared_target_detected",
  "shared_resource_detected",
  "timeline_overlap_detected",
  "conflict_detection_success",
  "conflict_detection_incomplete",
  "reserved_future_diagnostic",
] as const satisfies readonly IntentConflictDiagnosticCode[]);

const DEFAULT_SEVERITY: Readonly<
  Record<IntentConflictDiagnosticCode, IntentConflictDiagnosticSeverity>
> = Object.freeze({
  no_conflict: "info",
  resource_conflict: "warning",
  target_conflict: "warning",
  time_conflict: "warning",
  classification_conflict: "warning",
  duplicate_intent: "warning",
  goal_contradiction: "error",
  constraint_conflict: "warning",
  assumption_conflict: "warning",
  unknown_conflict: "info",
  multiple_conflicts: "warning",
  shared_target_detected: "info",
  shared_resource_detected: "info",
  timeline_overlap_detected: "info",
  conflict_detection_success: "info",
  conflict_detection_incomplete: "warning",
  reserved_future_diagnostic: "info",
});

export function isIntentConflictDiagnosticCode(
  value: string
): value is IntentConflictDiagnosticCode {
  return (INTENT_CONFLICT_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createIntentConflictDiagnostic(
  code: IntentConflictDiagnosticCode,
  message: string,
  timestamp: string,
  options: Readonly<{
    explanation?: string;
    metadata?: Readonly<Record<string, unknown>>;
  }> = Object.freeze({})
): IntentConflictDiagnostic {
  return Object.freeze({
    code,
    severity: DEFAULT_SEVERITY[code],
    message,
    explanation: options.explanation ?? message,
    timestamp,
    metadata: options.metadata ?? Object.freeze({}),
  });
}
