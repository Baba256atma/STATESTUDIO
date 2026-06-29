/**
 * APP-3.3.1 — Executive Intent context diagnostics vocabulary.
 * Diagnostic codes only — no context construction logic.
 */
export const EXECUTIVE_INTENT_CONTEXT_DIAGNOSTICS_VERSION = "APP-3.3.1";
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
]);
const DEFAULT_SEVERITY = Object.freeze({
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
export function isIntentContextDiagnosticCode(value) {
    return INTENT_CONTEXT_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentContextDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
