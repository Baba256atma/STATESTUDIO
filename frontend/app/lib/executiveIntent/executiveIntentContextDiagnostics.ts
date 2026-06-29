/**
 * APP-3.3.1 — Executive Intent context diagnostics vocabulary.
 * Diagnostic codes only — no context construction logic.
 */

export const EXECUTIVE_INTENT_CONTEXT_DIAGNOSTICS_VERSION = "APP-3.3.1" as const;

export type IntentContextDiagnosticCode =
  | "context_ready"
  | "workspace_context_ready"
  | "business_context_ready"
  | "object_context_ready"
  | "relationship_context_ready"
  | "stakeholder_context_ready"
  | "constraint_context_ready"
  | "evidence_context_ready"
  | "missing_context"
  | "unknown_context"
  | "context_incomplete"
  | "context_intent_missing"
  | "context_semantic_missing"
  | "context_state_missing"
  | "context_scope_unknown"
  | "context_future_reserved";

export type IntentContextDiagnosticSeverity = "info" | "warning" | "error";

export type IntentContextDiagnostic = Readonly<{
  code: IntentContextDiagnosticCode;
  severity: IntentContextDiagnosticSeverity;
  message: string;
  explanation: string;
  timestamp: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export const INTENT_CONTEXT_DIAGNOSTIC_CODES = Object.freeze([
  "context_ready",
  "workspace_context_ready",
  "business_context_ready",
  "object_context_ready",
  "relationship_context_ready",
  "stakeholder_context_ready",
  "constraint_context_ready",
  "evidence_context_ready",
  "missing_context",
  "unknown_context",
  "context_incomplete",
  "context_intent_missing",
  "context_semantic_missing",
  "context_state_missing",
  "context_scope_unknown",
  "context_future_reserved",
] as const satisfies readonly IntentContextDiagnosticCode[]);

const DEFAULT_SEVERITY: Readonly<Record<IntentContextDiagnosticCode, IntentContextDiagnosticSeverity>> =
  Object.freeze({
    context_ready: "info",
    workspace_context_ready: "info",
    business_context_ready: "info",
    object_context_ready: "info",
    relationship_context_ready: "info",
    stakeholder_context_ready: "info",
    constraint_context_ready: "info",
    evidence_context_ready: "info",
    missing_context: "warning",
    unknown_context: "warning",
    context_incomplete: "warning",
    context_intent_missing: "error",
    context_semantic_missing: "warning",
    context_state_missing: "info",
    context_scope_unknown: "warning",
    context_future_reserved: "info",
  });

export function isIntentContextDiagnosticCode(value: string): value is IntentContextDiagnosticCode {
  return (INTENT_CONTEXT_DIAGNOSTIC_CODES as readonly string[]).includes(value);
}

export function createIntentContextDiagnostic(
  code: IntentContextDiagnosticCode,
  message: string,
  timestamp: string,
  options: Readonly<{
    explanation?: string;
    metadata?: Readonly<Record<string, unknown>>;
  }> = Object.freeze({})
): IntentContextDiagnostic {
  return Object.freeze({
    code,
    severity: DEFAULT_SEVERITY[code],
    message,
    explanation: options.explanation ?? message,
    timestamp,
    metadata: options.metadata ?? Object.freeze({}),
  });
}
