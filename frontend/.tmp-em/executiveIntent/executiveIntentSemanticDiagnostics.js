/**
 * APP-3:5 — Executive Intent semantic diagnostics vocabulary.
 * Diagnostic codes only — no normalization logic.
 */
export const EXECUTIVE_INTENT_SEMANTIC_DIAGNOSTICS_VERSION = "APP-3/5";
export const INTENT_SEMANTIC_DIAGNOSTIC_CODES = Object.freeze([
    "semantic_model_ready",
    "semantic_target_unknown",
    "semantic_measure_unknown",
    "semantic_time_unknown",
    "semantic_business_dimension_unknown",
    "semantic_multiple_goals",
    "semantic_incomplete_model",
    "semantic_unsupported_structure",
    "semantic_normalization_success",
    "semantic_action_unknown",
    "semantic_outcome_unknown",
    "semantic_actor_unknown",
    "semantic_evidence_unknown",
    "semantic_constraint_unknown",
    "semantic_assumption_unknown",
]);
const DEFAULT_SEVERITY = Object.freeze({
    semantic_model_ready: "info",
    semantic_target_unknown: "warning",
    semantic_measure_unknown: "warning",
    semantic_time_unknown: "warning",
    semantic_business_dimension_unknown: "warning",
    semantic_multiple_goals: "warning",
    semantic_incomplete_model: "error",
    semantic_unsupported_structure: "warning",
    semantic_normalization_success: "info",
    semantic_action_unknown: "warning",
    semantic_outcome_unknown: "warning",
    semantic_actor_unknown: "info",
    semantic_evidence_unknown: "info",
    semantic_constraint_unknown: "info",
    semantic_assumption_unknown: "info",
});
export function isIntentSemanticDiagnosticCode(value) {
    return INTENT_SEMANTIC_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentSemanticDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
