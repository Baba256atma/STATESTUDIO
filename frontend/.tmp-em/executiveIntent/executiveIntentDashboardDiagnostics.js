/**
 * APP-3:13 — Executive Intent dashboard diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_DASHBOARD_DIAGNOSTICS_VERSION = "APP-3/13";
export const DASHBOARD_INTENT_DIAGNOSTIC_CODES = Object.freeze([
    "dashboard_ready",
    "reasoning_unavailable",
    "ready_for_dashboard",
    "low_confidence",
    "conflict_present",
    "dependency_present",
    "unknown_information",
    "incomplete_intent",
    "archived_intent",
    "blocked_intent",
    "dashboard_model_success",
    "reserved_future_diagnostic",
]);
const DEFAULT_SEVERITY = Object.freeze({
    dashboard_ready: "info",
    reasoning_unavailable: "error",
    ready_for_dashboard: "info",
    low_confidence: "warning",
    conflict_present: "warning",
    dependency_present: "info",
    unknown_information: "warning",
    incomplete_intent: "warning",
    archived_intent: "info",
    blocked_intent: "warning",
    dashboard_model_success: "info",
    reserved_future_diagnostic: "info",
});
export function isDashboardIntentDiagnosticCode(value) {
    return DASHBOARD_INTENT_DIAGNOSTIC_CODES.includes(value);
}
export function createDashboardIntentDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
