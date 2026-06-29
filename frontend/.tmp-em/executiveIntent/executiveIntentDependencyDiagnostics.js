/**
 * APP-3:8 — Executive Intent dependency diagnostics vocabulary.
 */
export const EXECUTIVE_INTENT_DEPENDENCY_DIAGNOSTICS_VERSION = "APP-3/8";
export const INTENT_DEPENDENCY_DIAGNOSTIC_CODES = Object.freeze([
    "no_dependency",
    "direct_dependency",
    "indirect_dependency",
    "shared_prerequisite",
    "blocking_dependency",
    "enabling_dependency",
    "optional_dependency",
    "circular_dependency",
    "unknown_dependency",
    "dependency_graph_ready",
    "sequential_dependency",
    "parallel_dependency",
    "multiple_dependencies",
    "dependency_detection_incomplete",
    "dependency_detection_success",
    "reserved_future_diagnostic",
]);
const DEFAULT_SEVERITY = Object.freeze({
    no_dependency: "info",
    direct_dependency: "info",
    indirect_dependency: "info",
    shared_prerequisite: "info",
    blocking_dependency: "warning",
    enabling_dependency: "info",
    optional_dependency: "info",
    circular_dependency: "error",
    unknown_dependency: "warning",
    dependency_graph_ready: "info",
    sequential_dependency: "info",
    parallel_dependency: "info",
    multiple_dependencies: "info",
    dependency_detection_incomplete: "warning",
    dependency_detection_success: "info",
    reserved_future_diagnostic: "info",
});
export function isIntentDependencyDiagnosticCode(value) {
    return INTENT_DEPENDENCY_DIAGNOSTIC_CODES.includes(value);
}
export function createIntentDependencyDiagnostic(code, message, timestamp, options = Object.freeze({})) {
    return Object.freeze({
        code,
        severity: DEFAULT_SEVERITY[code],
        message,
        explanation: options.explanation ?? message,
        timestamp,
        metadata: options.metadata ?? Object.freeze({}),
    });
}
