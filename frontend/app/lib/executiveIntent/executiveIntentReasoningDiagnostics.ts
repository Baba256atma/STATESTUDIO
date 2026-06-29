/**
 * APP-3:11 — Executive Intent reasoning diagnostics vocabulary.
 */

export const EXECUTIVE_INTENT_REASONING_DIAGNOSTICS_VERSION = "APP-3/11" as const;

export type IntentReasoningDiagnosticCode =
  | "reasoning_ready"
  | "reasoning_incomplete"
  | "state_unavailable"
  | "semantic_unavailable"
  | "classification_unavailable"
  | "conflict_present"
  | "dependency_complex"
  | "low_confidence"
  | "multiple_unknowns"
  | "ready_for_assistant"
  | "ready_for_dashboard"
  | "evolution_unavailable"
  | "confidence_unavailable"
  | "reasoning_synthesis_success"
  | "reserved_future_diagnostic";

export type IntentReasoningDiagnosticSeverity = "info" | "warning" | "error";

export type IntentReasoningDiagnostic = Readonly<{
  code: IntentReasoningDiagnosticCode;
  severity: IntentReasoningDiagnosticSeverity;
  message: string;
  explanation: string;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const INTENT_REASONING_DIAGNOSTIC_CODES = Object.freeze([
  "reasoning_ready",
  "reasoning_incomplete",
  "state_unavailable",
  "semantic_unavailable",
  "classification_unavailable",
  "conflict_present",
  "dependency_complex",
  "low_confidence",
  "multiple_unknowns",
  "ready_for_assistant",
  "ready_for_dashboard",
  "evolution_unavailable",
  "confidence_unavailable",
  "reasoning_synthesis_success",
  "reserved_future_diagnostic",
] as const satisfies readonly IntentReasoningDiagnosticCode[]);

const DEFAULT_SEVERITY: Readonly<
  Record<IntentReasoningDiagnosticCode, IntentReasoningDiagnosticSeverity>
> = Object.freeze({
  reasoning_ready: "info",
  reasoning_incomplete: "warning",
  state_unavailable: "warning",
  semantic_unavailable: "warning",
  classification_unavailable: "warning",
  conflict_present: "warning",
  dependency_complex: "warning",
  low_confidence: "warning",
  multiple_unknowns: "warning",
  ready_for_assistant: "info",
  ready_for_dashboard: "info",
  evolution_unavailable: "info",
  confidence_unavailable: "warning",
  reasoning_synthesis_success: "info",
  reserved_future_diagnostic: "info",
});

export function isIntentReasoningDiagnosticCode(
  value: string
): value is IntentReasoningDiagnosticCode {
  return (INTENT_REASONING_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createIntentReasoningDiagnostic(
  code: IntentReasoningDiagnosticCode,
  message: string,
  timestamp: string,
  options: Readonly<{
    explanation?: string;
    metadata?: Readonly<Record<string, unknown>>;
  }> = Object.freeze({})
): IntentReasoningDiagnostic {
  return Object.freeze({
    code,
    severity: DEFAULT_SEVERITY[code],
    message,
    explanation: options.explanation ?? message,
    timestamp,
    metadata: options.metadata ?? Object.freeze({}),
  });
}
