/**
 * APP-3:6 — Executive Intent classification types.
 * Canonical taxonomy classification — no quality scoring or recommendations.
 */
export const EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION = "APP-3/6";
export const CLASSIFICATION_FUTURE_EXTENSION = Object.freeze({
    confidenceBindings: null,
    recommendationBindings: null,
    conflictBindings: null,
});
export function createIntentClassificationResult(input) {
    return Object.freeze({ ...input, readOnly: true });
}
