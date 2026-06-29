/**
 * APP-3:12 — Executive Intent assistant diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_ASSISTANT_DIAGNOSTICS_VERSION = "APP-3/12";
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
]);
const DEFAULT_SEVERITY = Object.freeze({
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
export function isAssistantIntentDiagnosticCode(value) {
    return ASSISTANT_INTENT_DIAGNOSTIC_CODES.includes(value);
}
export function createAssistantIntentDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
