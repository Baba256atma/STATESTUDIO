/**
 * APP-2:14 — Scenario Intelligence Platform Freeze Runner.
 * Official APP-2 release entry point — orchestrates regression, final certification, and freeze manifest.
 */

import {
  buildScenarioIntelligencePlatformFreezeManifest,
  SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
  SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
} from "./scenarioIntelligencePlatformFreezeManifest.ts";
import {
  runScenarioIntelligencePlatformFinalCertification,
  ScenarioIntelligencePlatformFinalCertification,
} from "./scenarioIntelligencePlatformFinalCertification.ts";
import {
  runScenarioIntelligencePlatformFreezeRegression,
  ScenarioIntelligencePlatformFreezeRegression,
} from "./scenarioIntelligencePlatformFreezeRegression.ts";

export type ScenarioIntelligencePlatformFreezeRunResult = Readonly<{
  freezeVersion: typeof SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION;
  certified: boolean;
  released: boolean;
  status: "PASS" | "FAIL";
  regressionStatus: "PASS" | "FAIL";
  summary: string;
  tags: readonly string[];
  freezeManifest: ReturnType<typeof buildScenarioIntelligencePlatformFreezeManifest>;
  finalCertification: ReturnType<typeof runScenarioIntelligencePlatformFinalCertification>;
}>;

export function runScenarioIntelligencePlatformCertificationSuite(): ScenarioIntelligencePlatformFreezeRunResult {
  const finalCertification = runScenarioIntelligencePlatformFinalCertification();
  return Object.freeze({
    freezeVersion: SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
    certified: finalCertification.certified,
    released: finalCertification.released,
    status: finalCertification.status,
    regressionStatus: finalCertification.regression.status,
    summary: finalCertification.summary,
    tags: SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
    freezeManifest: finalCertification.freezeManifest,
    finalCertification,
  });
}

export function runScenarioIntelligencePlatformRegressionOnly() {
  return runScenarioIntelligencePlatformFreezeRegression();
}

export const ScenarioIntelligencePlatformFreezeRunner = Object.freeze({
  runScenarioIntelligencePlatformCertificationSuite,
  runScenarioIntelligencePlatformFinalCertification,
  runScenarioIntelligencePlatformRegressionOnly,
  buildScenarioIntelligencePlatformFreezeManifest,
  version: SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
});

export {
  buildScenarioIntelligencePlatformFreezeManifest,
  runScenarioIntelligencePlatformFinalCertification,
  runScenarioIntelligencePlatformFreezeRegression,
};
