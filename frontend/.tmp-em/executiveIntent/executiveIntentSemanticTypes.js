/**
 * APP-3:5 — Executive Intent semantic model types.
 * Canonical semantic vocabulary — normalization only, no classification or recommendations.
 */
export const EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION = "APP-3/5";
export const SEMANTIC_MODEL_FUTURE_EXTENSION = Object.freeze({
    classificationBindings: null,
    confidenceBindings: null,
    dependencyBindings: null,
});
export function createExecutiveIntentSemanticModel(input) {
    return Object.freeze({ ...input, readOnly: true });
}
