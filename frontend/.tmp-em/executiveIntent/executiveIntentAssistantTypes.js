/**
 * APP-3:12 — Executive Intent assistant types.
 * Presentation layer only — consumes APP-3:11 reasoning model.
 */
export const EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION = "APP-3/12";
export const ASSISTANT_FUTURE_EXTENSION = Object.freeze({
    dashboardBindings: null,
    layoutBindings: null,
});
export function createAssistantIntentResponse(input) {
    return Object.freeze({ ...input, readOnly: true });
}
