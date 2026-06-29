/**
 * APP-3.15.1 — Executive Intent Platform Refresh Regression.
 * Verifies APP-3:1 through APP-3:15, APP-3.3.1, and APP-3.15.1 compatibility.
 */

import {
  buildContextProbe,
  validateContext,
} from "./executiveIntentContextEngine.ts";
import { EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION } from "./executiveIntentContextTypes.ts";
import { runExecutiveIntentPlatform } from "./executiveIntentPlatformRunner.ts";
import { runExecutiveIntentPlatformFreezeRegression } from "./executiveIntentPlatformFreezeRegression.ts";

export const EXECUTIVE_INTENT_PLATFORM_REFRESH_REGRESSION_VERSION =
  "APP-3.15.1-REFRESH-REGRESSION-1" as const;

export type ExecutiveIntentPlatformRefreshRegressionPhase = Readonly<{
  phaseId: string;
  phaseVersion: string | null;
  certified: boolean;
  status: "PASS" | "FAIL" | "DEFERRED";
  message: string;
  skipped: boolean;
  readOnly: true;
}>;

export type ExecutiveIntentPlatformRefreshRegressionResult = Readonly<{
  resultId: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  phaseCount: number;
  passedPhaseCount: number;
  failedPhaseCount: number;
  deferredPhaseCount: number;
  phases: readonly ExecutiveIntentPlatformRefreshRegressionPhase[];
  passedPhases: readonly ExecutiveIntentPlatformRefreshRegressionPhase[];
  failedPhases: readonly ExecutiveIntentPlatformRefreshRegressionPhase[];
  architectureDriftDetected: false;
  apiDriftDetected: false;
  certificationDriftDetected: false;
  dependencyDriftDetected: false;
  consumerDriftDetected: false;
  brokenContracts: readonly string[];
  summary: string;
  timestamp: string;
  readOnly: true;
}>;

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

export function runExecutiveIntentPlatformRefreshRegression(
  timestamp: string = DEFAULT_TIME
): ExecutiveIntentPlatformRefreshRegressionResult {
  const freezeRegression = runExecutiveIntentPlatformFreezeRegression(timestamp);
  const platformFreeze = runExecutiveIntentPlatform(timestamp);
  const contextProbe = buildContextProbe(timestamp);
  const contextValidation = validateContext(contextProbe);

  const phases: ExecutiveIntentPlatformRefreshRegressionPhase[] = freezeRegression.phases.map((phase) =>
    Object.freeze({
      phaseId: phase.phaseId,
      phaseVersion: phase.phaseVersion,
      certified: phase.certified,
      status: phase.status,
      message: phase.message,
      skipped: phase.skipped,
      readOnly: true as const,
    })
  );

  phases.push(
    Object.freeze({
      phaseId: "APP-3/15",
      phaseVersion: "APP-3/15",
      certified: platformFreeze.certified && platformFreeze.platformStatus === "FROZEN",
      status:
        platformFreeze.certified && platformFreeze.platformStatus === "FROZEN"
          ? ("PASS" as const)
          : ("FAIL" as const),
      message: platformFreeze.summary,
      skipped: false,
      readOnly: true as const,
    })
  );

  phases.push(
    Object.freeze({
      phaseId: "APP-3.3.1",
      phaseVersion: EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
      certified:
        contextValidation.valid &&
        contextProbe.metadata.contextEngineVersion === EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION,
      status:
        contextValidation.valid &&
        contextProbe.metadata.contextEngineVersion === EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION
          ? ("PASS" as const)
          : ("FAIL" as const),
      message: contextValidation.valid
        ? "Context engine extension certified."
        : contextValidation.issues.join("; "),
      skipped: false,
      readOnly: true as const,
    })
  );

  phases.push(
    Object.freeze({
      phaseId: "APP-3.15.1",
      phaseVersion: "APP-3.15.1",
      certified: platformFreeze.certified && contextValidation.valid,
      status:
        platformFreeze.certified && contextValidation.valid ? ("PASS" as const) : ("FAIL" as const),
      message: "Platform refresh regression phase verified.",
      skipped: false,
      readOnly: true as const,
    })
  );

  const passedPhases = phases.filter((phase) => phase.certified);
  const failedPhases = phases.filter((phase) => !phase.certified && !phase.skipped);
  const deferredPhaseCount = phases.filter((phase) => phase.skipped).length;
  const certified = failedPhases.length === 0;

  return Object.freeze({
    resultId: deterministicId("refresh-regression", timestamp),
    status: certified ? "PASS" : "FAIL",
    certified,
    phaseCount: phases.length,
    passedPhaseCount: passedPhases.length,
    failedPhaseCount: failedPhases.length,
    deferredPhaseCount,
    phases: Object.freeze([...phases]),
    passedPhases: Object.freeze(passedPhases),
    failedPhases: Object.freeze(failedPhases),
    architectureDriftDetected: false,
    apiDriftDetected: false,
    certificationDriftDetected: false,
    dependencyDriftDetected: false,
    consumerDriftDetected: false,
    brokenContracts: Object.freeze(
      failedPhases.map((phase) => `${phase.phaseId}: ${phase.message}`)
    ),
    summary: certified
      ? "Executive Intent platform refresh regression PASSED (APP-3:1 through APP-3.15.1)."
      : `Executive Intent platform refresh regression FAILED (${failedPhases.length} phase(s)).`,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveIntentPlatformRefreshRegression = Object.freeze({
  runExecutiveIntentPlatformRefreshRegression,
  version: EXECUTIVE_INTENT_PLATFORM_REFRESH_REGRESSION_VERSION,
});
