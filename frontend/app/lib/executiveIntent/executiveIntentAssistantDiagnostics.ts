/**
 * APP-3:12 — Executive Intent assistant diagnostics vocabulary.
 */

export const EXECUTIVE_INTENT_ASSISTANT_DIAGNOSTICS_VERSION = "APP-3/12" as const;

export type AssistantIntentDiagnosticCode =
  | "assistant_ready"
  | "reasoning_unavailable"
  | "intent_ready"
  | "intent_incomplete"
  | "clarification_required"
  | "low_confidence"
  | "conflict_present"
  | "dependency_present"
  | "no_executive_intent"
  | "assistant_response_success"
  | "archived_intent"
  | "blocked_intent"
  | "multiple_intents_context"
  | "reserved_future_diagnostic";

export type AssistantIntentDiagnosticSeverity = "info" | "warning" | "error";

export type AssistantIntentDiagnostic = Readonly<{
  code: AssistantIntentDiagnosticCode;
  severity: AssistantIntentDiagnosticSeverity;
  message: string;
  explanation: string;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const ASSISTANT_INTENT_DIAGNOSTIC_CODES = Object.freeze([
  "assistant_ready",
  "reasoning_unavailable",
  "intent_ready",
  "intent_incomplete",
  "clarification_required",
  "low_confidence",
  "conflict_present",
  "dependency_present",
  "no_executive_intent",
  "assistant_response_success",
  "archived_intent",
  "blocked_intent",
  "multiple_intents_context",
  "reserved_future_diagnostic",
] as const satisfies readonly AssistantIntentDiagnosticCode[]);

const DEFAULT_SEVERITY: Readonly<
  Record<AssistantIntentDiagnosticCode, AssistantIntentDiagnosticSeverity>
> = Object.freeze({
  assistant_ready: "info",
  reasoning_unavailable: "error",
  intent_ready: "info",
  intent_incomplete: "warning",
  clarification_required: "warning",
  low_confidence: "warning",
  conflict_present: "warning",
  dependency_present: "info",
  no_executive_intent: "error",
  assistant_response_success: "info",
  archived_intent: "info",
  blocked_intent: "warning",
  multiple_intents_context: "info",
  reserved_future_diagnostic: "info",
});

export function isAssistantIntentDiagnosticCode(
  value: string
): value is AssistantIntentDiagnosticCode {
  return (ASSISTANT_INTENT_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createAssistantIntentDiagnostic(
  code: AssistantIntentDiagnosticCode,
  message: string,
  timestamp: string,
  options: Readonly<{
    explanation?: string;
    metadata?: Readonly<Record<string, unknown>>;
  }> = Object.freeze({})
): AssistantIntentDiagnostic {
  return Object.freeze({
    code,
    severity: DEFAULT_SEVERITY[code],
    message,
    explanation: options.explanation ?? message,
    timestamp,
    metadata: options.metadata ?? Object.freeze({}),
  });
}
