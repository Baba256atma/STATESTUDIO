/**
 * APP-3:2 — Executive Intent State Engine result types.
 * Immutable state resolution output — no UI or execution artifacts.
 */
export const EXECUTIVE_INTENT_STATE_ENGINE_VERSION = "APP-3/2";
export function createExecutiveIntentState(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentStateSummary(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentResolutionResult(input) {
    return Object.freeze({
        ...input,
        engineVersion: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
        compatibilityMetadata: Object.freeze({
            contextEngineReady: true,
            extractionReady: false,
            readOnly: true,
        }),
        readOnly: true,
    });
}
export const INTENT_STATE_FUTURE_EXTENSION_PLACEHOLDER = Object.freeze({
    contextBindings: null,
    timelineAnchors: null,
    evolutionTrail: null,
});
