/**
 * APP-3:6 — Executive Intent classification diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_CLASSIFICATION_DIAGNOSTICS_VERSION = "APP-3/6";
export const INTENT_CLASSIFICATION_DIAGNOSTIC_CODES = Object.freeze([
    "classification_success",
    "no_primary_class",
    "multiple_primary_classes",
    "unknown_business_dimension",
    "unsupported_action_type",
    "custom_class_required",
    "classification_incomplete",
    "invalid_semantic_model",
    "multi_label_classification",
    "composite_intent_detected",
    "hybrid_intent_detected",
    "classification_requires_review",
    "reserved_future_diagnostic",
]);
const DEFAULT_SEVERITY = Object.freeze({
    classification_success: "info",
    no_primary_class: "error",
    multiple_primary_classes: "warning",
    unknown_business_dimension: "warning",
    unsupported_action_type: "warning",
    custom_class_required: "warning",
    classification_incomplete: "error",
    invalid_semantic_model: "error",
    multi_label_classification: "info",
    composite_intent_detected: "info",
    hybrid_intent_detected: "info",
    classification_requires_review: "warning",
    reserved_future_diagnostic: "info",
});
export function isIntentClassificationDiagnosticCode(value) {
    return INTENT_CLASSIFICATION_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentClassificationDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
