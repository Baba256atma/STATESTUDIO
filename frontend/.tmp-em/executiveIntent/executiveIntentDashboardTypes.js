/**
 * APP-3:13 — Executive Intent dashboard types.
 * Presentation metadata only — consumes APP-3:11 reasoning model.
 */
export const EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_VERSION = "APP-3/13";
export const DASHBOARD_FUTURE_EXTENSION = Object.freeze({
    platformCertificationBindings: null,
    layoutRenderingBindings: null,
});
export function createDashboardIntentModel(input) {
    return Object.freeze({ ...input, readOnly: true });
}
