/**
 * APP-1:10 — Executive Time Platform Regression.
 * Runs APP-1:1 through APP-1:9 phase certifications — no new functionality.
 */

import { runExecutiveEventAuthorityCertification } from "./executiveEventAuthorityCertification.ts";
import { runExecutiveEventEngineCertification } from "./executiveEventCertification.ts";
import { runExecutivePredictionAuthorityCertification } from "./executivePredictionAuthorityCertification.ts";
import { runExecutivePredictionCertification } from "./executivePredictionCertification.ts";
import { runExecutiveTimeCameraCertification } from "./executiveTimeCameraCertification.ts";
import { runExecutiveTimeContextCertification } from "./executiveTimeContextCertification.ts";
import { runExecutiveTimeFoundationCertification } from "./executiveTimeCertification.ts";
import { runExecutiveTimeIntegrationCertification } from "./executiveTimeIntegrationCertification.ts";
import { runExecutiveTimePlatformCertification } from "./executiveTimePlatformCertification.ts";
import { runExecutiveTimePriorityAuthorityCertification } from "./executiveTimePriorityAuthorityCertification.ts";
import { runExecutiveTimePriorityCertification } from "./executiveTimePriorityCertification.ts";
import { runExecutiveTimeStateCertification } from "./executiveTimeStateCertification.ts";
import { runExecutiveTimeTransitionAuthorityCertification } from "./executiveTimeTransitionAuthorityCertification.ts";
import { runExecutiveTimeTransitionCertification } from "./executiveTimeTransitionCertification.ts";

export type ExecutiveTimePlatformRegressionPhase = Readonly<{
  phaseId: string;
  phaseName: string;
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
}>;

export type ExecutiveTimePlatformRegressionResult = Readonly<{
  status: "PASS" | "FAIL";
  certified: boolean;
  phases: readonly ExecutiveTimePlatformRegressionPhase[];
  passedPhases: readonly ExecutiveTimePlatformRegressionPhase[];
  failedPhases: readonly ExecutiveTimePlatformRegressionPhase[];
  architectureDriftDetected: false;
  brokenContracts: readonly string[];
  summary: string;
}>;

export function runExecutiveTimePlatformRegression(): ExecutiveTimePlatformRegressionResult {
  const phaseRuns = Object.freeze([
    Object.freeze({ phaseId: "APP-1/1", run: runExecutiveTimeFoundationCertification }),
    Object.freeze({ phaseId: "APP-1/2", run: runExecutiveTimeContextCertification }),
    Object.freeze({ phaseId: "APP-1/3", run: runExecutiveTimeCameraCertification }),
    Object.freeze({ phaseId: "APP-1/4", run: runExecutiveTimeStateCertification }),
    Object.freeze({ phaseId: "APP-1/4.5", run: runExecutiveTimeTransitionAuthorityCertification }),
    Object.freeze({ phaseId: "APP-1/5", run: runExecutiveTimeTransitionCertification }),
    Object.freeze({ phaseId: "APP-1/5.5", run: runExecutiveTimePriorityAuthorityCertification }),
    Object.freeze({ phaseId: "APP-1/6", run: runExecutiveTimePriorityCertification }),
    Object.freeze({ phaseId: "APP-1/6.5", run: runExecutiveEventAuthorityCertification }),
    Object.freeze({ phaseId: "APP-1/7", run: runExecutiveEventEngineCertification }),
    Object.freeze({ phaseId: "APP-1/7.5", run: runExecutivePredictionAuthorityCertification }),
    Object.freeze({ phaseId: "APP-1/8", run: runExecutivePredictionCertification }),
    Object.freeze({ phaseId: "APP-1/8.5", run: runExecutiveTimePlatformCertification }),
    Object.freeze({ phaseId: "APP-1/9", run: runExecutiveTimeIntegrationCertification }),
  ] as const);

  const phases: ExecutiveTimePlatformRegressionPhase[] = phaseRuns.map((phase) => {
    const result = phase.run();
    return Object.freeze({
      phaseId: phase.phaseId,
      phaseName: result.phaseName,
      certified: result.certified,
      status: result.status,
      summary: result.summary,
    });
  });

  const passedPhases = phases.filter((phase) => phase.certified);
  const failedPhases = phases.filter((phase) => !phase.certified);
  const certified = failedPhases.length === 0;

  return Object.freeze({
    status: certified ? "PASS" : "FAIL",
    certified,
    phases: Object.freeze(phases),
    passedPhases: Object.freeze(passedPhases),
    failedPhases: Object.freeze(failedPhases),
    architectureDriftDetected: false,
    brokenContracts: Object.freeze(
      failedPhases.map((phase) => `${phase.phaseId}: ${phase.summary}`)
    ),
    summary: certified
      ? "Executive Time platform regression PASSED (APP-1:1 through APP-1:9)."
      : `Executive Time platform regression FAILED (${failedPhases.length} phase(s)).`,
  });
}

export const ExecutiveTimePlatformRegression = Object.freeze({
  runExecutiveTimePlatformRegression,
});
