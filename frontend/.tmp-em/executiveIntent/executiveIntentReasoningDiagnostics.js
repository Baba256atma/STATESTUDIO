/**
 * APP-3:11 — Executive Intent reasoning diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_REASONING_DIAGNOSTICS_VERSION = "APP-3/11";
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
]);
const DEFAULT_SEVERITY = Object.freeze({
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
export function isIntentReasoningDiagnosticCode(value) {
    return INTENT_REASONING_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentReasoningDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
