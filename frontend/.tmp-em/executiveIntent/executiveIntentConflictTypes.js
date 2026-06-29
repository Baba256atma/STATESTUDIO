/**
 * APP-3:7 — Executive Intent conflict types.
 * Conflict detection output — no resolution or recommendations.
 */
export const EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION = "APP-3/7";
export const CONFLICT_FUTURE_EXTENSION = Object.freeze({
    resolutionBindings: null,
    recommendationBindings: null,
    priorityBindings: null,
});
export function createIntentConflictResult(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentConflictAnalysisInput(input) {
    return Object.freeze({ ...input, readOnly: true });
}
