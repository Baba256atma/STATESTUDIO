/**
 * APP-3:10 — Executive Intent confidence diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_CONFIDENCE_DIAGNOSTICS_VERSION = "APP-3/10";
export const INTENT_CONFIDENCE_DIAGNOSTIC_CODES = Object.freeze([
    "confidence_high",
    "confidence_medium",
    "confidence_low",
    "missing_information",
    "semantic_incomplete",
    "classification_uncertain",
    "dependency_complex",
    "conflict_present",
    "unstable_evolution",
    "ready_for_reasoning",
    "state_integrity_warning",
    "extraction_incomplete",
    "unknown_confidence",
    "confidence_calculation_success",
    "requires_clarification",
    "reserved_future_diagnostic",
]);
const DEFAULT_SEVERITY = Object.freeze({
    confidence_high: "info",
    confidence_medium: "info",
    confidence_low: "warning",
    missing_information: "warning",
    semantic_incomplete: "warning",
    classification_uncertain: "warning",
    dependency_complex: "warning",
    conflict_present: "warning",
    unstable_evolution: "warning",
    ready_for_reasoning: "info",
    state_integrity_warning: "warning",
    extraction_incomplete: "warning",
    unknown_confidence: "error",
    confidence_calculation_success: "info",
    requires_clarification: "warning",
    reserved_future_diagnostic: "info",
});
export function isIntentConfidenceDiagnosticCode(value) {
    return INTENT_CONFIDENCE_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentConfidenceDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
