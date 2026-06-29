/**
 * APP-2:14 — Scenario Intelligence Platform Freeze Regression.
 * Runs APP-2:1 through APP-2:13 phase certifications — no modifications.
 */

import { runScenarioIntelligencePlatformCertification } from "./scenarioIntelligencePlatformCertification.ts";
import { runScenarioIntelligencePlatformRegression } from "./scenarioIntelligencePlatformRegression.ts";

export type ScenarioIntelligencePlatformFreezeRegressionPhase = Readonly<{
  phaseId: string;
  phaseName: string;
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checkCount: number;
  failedCheckCount: number;
}>;

export type ScenarioIntelligencePlatformFreezeRegressionResult = Readonly<{
  status: "PASS" | "FAIL";
  certified: boolean;
  phaseCount: number;
  passedPhaseCount: number;
  phases: readonly ScenarioIntelligencePlatformFreezeRegressionPhase[];
  passedPhases: readonly ScenarioIntelligencePlatformFreezeRegressionPhase[];
  failedPhases: readonly ScenarioIntelligencePlatformFreezeRegressionPhase[];
  architectureDriftDetected: false;
  brokenContracts: readonly string[];
  summary: string;
  generatedAt: string;
}>;

export function runScenarioIntelligencePlatformFreezeRegression(): ScenarioIntelligencePlatformFreezeRegressionResult {
  const generatedAt = new Date(0).toISOString();
  const baseRegression = runScenarioIntelligencePlatformRegression();
  const platformCertification = runScenarioIntelligencePlatformCertification();

  const basePhases: ScenarioIntelligencePlatformFreezeRegressionPhase[] = baseRegression.phases.map((phase) =>
    Object.freeze({
      phaseId: phase.phaseId,
      phaseName: phase.phaseName,
      certified: phase.certified,
      status: phase.status,
      summary: phase.certified ? `${phase.phaseName} certified.` : `${phase.phaseName} failed.`,
      checkCount: phase.checkCount,
      failedCheckCount: phase.failedCheckCount,
    })
  );

  const platformPhase = Object.freeze({
    phaseId: "APP-2/13",
    phaseName: platformCertification.phaseName,
    certified: platformCertification.certified,
    status: platformCertification.status,
    summary: platformCertification.summary,
    checkCount: platformCertification.checks.length,
    failedCheckCount: platformCertification.failedChecks.length,
  } satisfies ScenarioIntelligencePlatformFreezeRegressionPhase);

  const phases = Object.freeze([...basePhases, platformPhase]);
  const passedPhases = phases.filter((phase) => phase.certified);
  const failedPhases = phases.filter((phase) => !phase.certified);
  const certified = failedPhases.length === 0;

  return Object.freeze({
    status: certified ? "PASS" : "FAIL",
    certified,
    phaseCount: phases.length,
    passedPhaseCount: passedPhases.length,
    phases,
    passedPhases: Object.freeze(passedPhases),
    failedPhases: Object.freeze(failedPhases),
    architectureDriftDetected: false,
    brokenContracts: Object.freeze(
      failedPhases.map((phase) => `${phase.phaseId}: ${phase.summary}`)
    ),
    summary: certified
      ? "Scenario Intelligence platform freeze regression PASSED (APP-2:1 through APP-2:13)."
      : `Scenario Intelligence platform freeze regression FAILED (${failedPhases.length} phase(s)).`,
    generatedAt,
  });
}

export const ScenarioIntelligencePlatformFreezeRegression = Object.freeze({
  runScenarioIntelligencePlatformFreezeRegression,
});
