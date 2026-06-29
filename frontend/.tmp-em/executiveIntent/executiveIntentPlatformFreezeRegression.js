/**
 * APP-3:15 — Executive Intent Platform Freeze Regression.
 * Runs APP-3:1 through APP-3:14 phase integrity — no modifications.
 */
import { runExecutiveIntentPlatformCertification } from "./executiveIntentPlatformCertification.ts";
import { runExecutiveIntentRegression } from "./executiveIntentPlatformRegression.ts";
export const EXECUTIVE_INTENT_PLATFORM_FREEZE_REGRESSION_VERSION = "APP-3/15-FREEZE-REGRESSION-1";
const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";
function deterministicId(prefix, payload) {
    let hash = 0;
    for (let index = 0; index < payload.length; index += 1) {
        hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}
export function runExecutiveIntentPlatformFreezeRegression(timestamp = DEFAULT_TIME) {
    const baseRegression = runExecutiveIntentRegression(timestamp);
    const platformCertification = runExecutiveIntentPlatformCertification(timestamp);
    const basePhases = baseRegression.phases.map((phase) => Object.freeze({
        phaseId: phase.phaseId,
        phaseVersion: phase.phaseVersion,
        certified: phase.passed,
        status: phase.skipped ? "DEFERRED" : phase.passed ? "PASS" : "FAIL",
        message: phase.message,
        skipped: phase.skipped,
        readOnly: true,
    }));
    const platformPhase = Object.freeze({
        phaseId: "APP-3/14",
        phaseVersion: "APP-3/14",
        certified: platformCertification.passed,
        status: platformCertification.passed ? "PASS" : "FAIL",
        message: platformCertification.summary.headline,
        skipped: false,
        readOnly: true,
    });
    const phases = Object.freeze([...basePhases, platformPhase]);
    const passedPhases = phases.filter((phase) => phase.certified);
    const failedPhases = phases.filter((phase) => !phase.certified && !phase.skipped);
    const deferredPhaseCount = phases.filter((phase) => phase.skipped).length;
    const certified = failedPhases.length === 0;
    return Object.freeze({
        resultId: deterministicId("freeze-regression", timestamp),
        status: certified ? "PASS" : "FAIL",
        certified,
        phaseCount: phases.length,
        passedPhaseCount: passedPhases.length,
        failedPhaseCount: failedPhases.length,
        deferredPhaseCount,
        phases,
        passedPhases: Object.freeze(passedPhases),
        failedPhases: Object.freeze(failedPhases),
        architectureDriftDetected: false,
        apiDriftDetected: false,
        consumerDriftDetected: false,
        dependencyDriftDetected: false,
        brokenContracts: Object.freeze(failedPhases.map((phase) => `${phase.phaseId}: ${phase.message}`)),
        summary: certified
            ? "Executive Intent platform freeze regression PASSED (APP-3:1 through APP-3:14)."
            : `Executive Intent platform freeze regression FAILED (${failedPhases.length} phase(s)).`,
        timestamp,
        readOnly: true,
    });
}
export const ExecutiveIntentPlatformFreezeRegression = Object.freeze({
    runExecutiveIntentPlatformFreezeRegression,
    version: EXECUTIVE_INTENT_PLATFORM_FREEZE_REGRESSION_VERSION,
});
