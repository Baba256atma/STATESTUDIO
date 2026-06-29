/**
 * APP-3.3.1 — Executive Intent context types.
 * Deterministic context model vocabulary — no reasoning or recommendations.
 */
export const EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION = "APP-3.3.1";
export const INTENT_CONTEXT_FUTURE_EXTENSION = Object.freeze({
    reasoningBindings: null,
    platformRunnerBindings: null,
});
export function createExecutiveIntentContextAnalysisInput(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveIntentContext(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentContextSummary(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createIntentContextFlags(input) {
    return Object.freeze({ ...input, futureCompatible: true, readOnly: true });
}
export function createIntentContextMetadata(input) {
    return Object.freeze({ ...input, readOnly: true });
}
