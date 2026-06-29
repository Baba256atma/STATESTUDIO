/**
 * APP-3:4 — Executive Intent extraction diagnostics vocabulary.
 * Diagnostic codes only — no business logic.
 */
export const EXECUTIVE_INTENT_EXTRACTION_DIAGNOSTICS_VERSION = "APP-3/4";
export const INTENT_EXTRACTION_DIAGNOSTIC_CODES = Object.freeze([
    "intent_not_found",
    "multiple_intents_found",
    "target_not_specified",
    "no_action_verb",
    "ambiguous_time_reference",
    "unsupported_pattern",
    "incomplete_sentence",
    "empty_input",
    "successful_extraction",
    "conflicting_statements",
    "nested_intent_detected",
    "priority_not_explicit",
    "scope_not_explicit",
    "category_not_explicit",
    "missing_required_field",
    "language_adapter_fallback",
]);
const DEFAULT_SEVERITY = Object.freeze({
    intent_not_found: "error",
    multiple_intents_found: "warning",
    target_not_specified: "error",
    no_action_verb: "error",
    ambiguous_time_reference: "warning",
    unsupported_pattern: "warning",
    incomplete_sentence: "warning",
    empty_input: "error",
    successful_extraction: "info",
    conflicting_statements: "warning",
    nested_intent_detected: "warning",
    priority_not_explicit: "warning",
    scope_not_explicit: "warning",
    category_not_explicit: "warning",
    missing_required_field: "error",
    language_adapter_fallback: "info",
});
const DEFAULT_BLOCKING = Object.freeze({
    intent_not_found: true,
    multiple_intents_found: false,
    target_not_specified: true,
    no_action_verb: true,
    ambiguous_time_reference: false,
    unsupported_pattern: false,
    incomplete_sentence: false,
    empty_input: true,
    successful_extraction: false,
    conflicting_statements: false,
    nested_intent_detected: false,
    priority_not_explicit: false,
    scope_not_explicit: false,
    category_not_explicit: false,
    missing_required_field: true,
    language_adapter_fallback: false,
});
export function isIntentExtractionDiagnosticCode(value) {
    return INTENT_EXTRACTION_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentExtractionDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    const severity = options.blocking === true ? "error" : DEFAULT_SEVERITY[code];
    return Object.freeze({
        code,
        severity,
        message,
        explanation: options.explanation ?? message,
        blocking: options.blocking ?? DEFAULT_BLOCKING[code],
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
