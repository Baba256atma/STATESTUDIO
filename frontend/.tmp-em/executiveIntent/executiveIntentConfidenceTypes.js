/**
 * APP-3:10 — Executive Intent confidence types.
 * Understanding confidence only — not business success prediction.
 */
export const EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION = "APP-3/10";
export const CONFIDENCE_FUTURE_EXTENSION = Object.freeze({
    recommendationBindings: null,
    reasoningBindings: null,
    analyticsBindings: null,
});
export function createIntentConfidenceResult(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentConfidenceAnalysisInput(input) {
    return Object.freeze({ ...input, readOnly: true });
}
