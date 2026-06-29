/**
 * APP-3:15 — Executive Intent Platform Runner.
 * Official platform entry point for downstream consumers.
 */
import { ExecutiveIntentAssistantIntegration } from "./executiveIntentAssistantIntegration.ts";
import { ExecutiveIntentDashboardIntegration } from "./executiveIntentDashboardIntegration.ts";
import { runExecutiveIntentPlatformCertification as runCertification, } from "./executiveIntentPlatformCertification.ts";
import { runExecutiveIntentPlatformFinalCertification, ExecutiveIntentPlatformFinalCertification, } from "./executiveIntentPlatformFinalCertification.ts";
import { buildExecutiveIntentPlatformFreezeManifest, EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION, EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS, EXECUTIVE_INTENT_PLATFORM_STATUS, } from "./executiveIntentPlatformFreezeManifest.ts";
import { runExecutiveIntentPlatformFreezeRegression, ExecutiveIntentPlatformFreezeRegression, } from "./executiveIntentPlatformFreezeRegression.ts";
import { ExecutiveIntentReasoningEngine } from "./executiveIntentReasoningEngine.ts";
export { ExecutiveIntentReasoningEngine as ExecutiveIntentReasoning } from "./executiveIntentReasoningEngine.ts";
export { ExecutiveIntentAssistantIntegration } from "./executiveIntentAssistantIntegration.ts";
export { ExecutiveIntentDashboardIntegration } from "./executiveIntentDashboardIntegration.ts";
const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";
export function getExecutiveIntentPlatformManifest(certificationDate = DEFAULT_TIME) {
    return buildExecutiveIntentPlatformFreezeManifest(certificationDate);
}
export function runExecutiveIntentPlatformRegression(timestamp = DEFAULT_TIME) {
    return runExecutiveIntentPlatformFreezeRegression(timestamp);
}
export function runExecutiveIntentPlatformCertification(timestamp = DEFAULT_TIME) {
    return runCertification(timestamp);
}
export function runExecutiveIntentPlatform(timestamp = DEFAULT_TIME) {
    const finalCertification = runExecutiveIntentPlatformFinalCertification(timestamp);
    return Object.freeze({
        freezeVersion: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
        certified: finalCertification.certified,
        released: finalCertification.released,
        status: finalCertification.status,
        platformStatus: EXECUTIVE_INTENT_PLATFORM_STATUS,
        regressionStatus: finalCertification.regression.status,
        summary: finalCertification.summary,
        tags: EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
        freezeManifest: finalCertification.freezeManifest,
        finalCertification,
        readOnly: true,
    });
}
export const ExecutiveIntentPlatformRunner = Object.freeze({
    runExecutiveIntentPlatform,
    runExecutiveIntentPlatformCertification,
    runExecutiveIntentPlatformRegression,
    getExecutiveIntentPlatformManifest,
    runExecutiveIntentPlatformFinalCertification,
    version: EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
    platformStatus: EXECUTIVE_INTENT_PLATFORM_STATUS,
    tags: EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
    publicSurface: Object.freeze({
        ExecutiveIntentReasoning: ExecutiveIntentReasoningEngine,
        ExecutiveIntentAssistantIntegration,
        ExecutiveIntentDashboardIntegration,
    }),
});
export { buildExecutiveIntentPlatformFreezeManifest, runExecutiveIntentPlatformFinalCertification, runExecutiveIntentPlatformFreezeRegression, ExecutiveIntentPlatformFinalCertification, ExecutiveIntentPlatformFreezeRegression, };
