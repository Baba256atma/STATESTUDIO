/**
 * APP-3:7 — Executive Intent conflict diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_CONFLICT_DIAGNOSTICS_VERSION = "APP-3/7";
export const INTENT_CONFLICT_DIAGNOSTIC_CODES = Object.freeze([
    "no_conflict",
    "resource_conflict",
    "target_conflict",
    "time_conflict",
    "classification_conflict",
    "duplicate_intent",
    "goal_contradiction",
    "constraint_conflict",
    "assumption_conflict",
    "unknown_conflict",
    "multiple_conflicts",
    "shared_target_detected",
    "shared_resource_detected",
    "timeline_overlap_detected",
    "conflict_detection_success",
    "conflict_detection_incomplete",
    "reserved_future_diagnostic",
]);
const DEFAULT_SEVERITY = Object.freeze({
    no_conflict: "info",
    resource_conflict: "warning",
    target_conflict: "warning",
    time_conflict: "warning",
    classification_conflict: "warning",
    duplicate_intent: "warning",
    goal_contradiction: "error",
    constraint_conflict: "warning",
    assumption_conflict: "warning",
    unknown_conflict: "info",
    multiple_conflicts: "warning",
    shared_target_detected: "info",
    shared_resource_detected: "info",
    timeline_overlap_detected: "info",
    conflict_detection_success: "info",
    conflict_detection_incomplete: "warning",
    reserved_future_diagnostic: "info",
});
export function isIntentConflictDiagnosticCode(value) {
    return INTENT_CONFLICT_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentConflictDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
