/**
 * APP-3:4 — Executive Intent extraction types.
 * Structured extraction vocabulary — no classification, ranking, or recommendations.
 */
export const EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION = "APP-3/4";
export const INTENT_EXTRACTION_FUTURE_EXTENSION = Object.freeze({
    classificationLabels: null,
    confidenceScores: null,
    rankingHints: null,
});
export function createIntentExtractionResult(input) {
    return Object.freeze({
        ...input,
        engineVersion: EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
        readOnly: true,
    });
}
