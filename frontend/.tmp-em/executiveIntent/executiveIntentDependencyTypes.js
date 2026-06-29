/**
 * APP-3:8 — Executive Intent dependency types.
 * Dependency graph output — no resolution, scheduling, or recommendations.
 */
export const EXECUTIVE_INTENT_DEPENDENCY_ENGINE_VERSION = "APP-3/8";
export const DEPENDENCY_FUTURE_EXTENSION = Object.freeze({
    resolutionBindings: null,
    schedulingBindings: null,
    recommendationBindings: null,
});
export function createIntentDependencyResult(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentDependencyAnalysisInput(input) {
    return Object.freeze({ ...input, readOnly: true });
}
