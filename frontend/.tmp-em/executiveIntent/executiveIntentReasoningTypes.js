/**
 * APP-3:11 — Executive Intent reasoning types.
 * Unified reasoning model — orchestration only, no recommendations.
 */
export const EXECUTIVE_INTENT_REASONING_ENGINE_VERSION = "APP-3/11";
export const REASONING_FUTURE_EXTENSION = Object.freeze({
    assistantBindings: null,
    dashboardBindings: null,
    scenarioBindings: null,
});
export function createExecutiveIntentReasoning(input) {
    return Object.freeze({ ...input, readOnly: true });
}
export function createExecutiveIntentReasoningAnalysisInput(input) {
    return Object.freeze({ ...input, readOnly: true });
}
