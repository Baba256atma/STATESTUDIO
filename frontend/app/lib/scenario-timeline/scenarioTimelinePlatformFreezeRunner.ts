/**
 * APP-5:10 — Scenario Timeline Platform Freeze runner.
 * Official metadata-only platform freeze entry point.
 */

import {
  SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
  SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
} from "./scenarioTimelinePlatformFreezeContracts.ts";
import {
  runScenarioTimelinePlatformFreezeCertification,
  type ScenarioTimelinePlatformFreezeCertificationResult,
} from "./scenarioTimelinePlatformFreezeCertification.ts";
import { getScenarioTimelinePlatformCompatibility } from "./scenarioTimelinePlatformFreezeCompatibility.ts";
import {
  buildScenarioTimelinePlatformFreezeManifest,
  buildScenarioTimelinePlatformRelease,
  getScenarioTimelinePlatformExtensionPolicy,
  getScenarioTimelinePlatformFreezeManifest,
  getScenarioTimelinePlatformRelease,
  type ScenarioTimelinePlatformFreezeManifest,
  type ScenarioTimelinePlatformRelease,
} from "./scenarioTimelinePlatformFreezeManifest.ts";

export type ScenarioTimelinePlatformFreezeRunResult = Readonly<{
  freezeVersion: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  productionReady: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: typeof SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG;
  manifest: ScenarioTimelinePlatformFreezeManifest;
  release: ScenarioTimelinePlatformRelease;
  certification: ScenarioTimelinePlatformFreezeCertificationResult;
  readOnly: true;
}>;

let lastFreezeResult: ScenarioTimelinePlatformFreezeRunResult | null = null;

export function runScenarioTimelinePlatformFreeze(
  timestamp: string = new Date().toISOString()
): ScenarioTimelinePlatformFreezeRunResult {
  const certification = runScenarioTimelinePlatformFreezeCertification(timestamp);
  const release = buildScenarioTimelinePlatformRelease(timestamp);

  const result = Object.freeze({
    freezeVersion: SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: certification.certified,
    frozen: certification.frozen,
    released: certification.released,
    productionReady: certification.productionReady,
    status: certification.status,
    summary: certification.summary,
    releaseTag: SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
    manifest: certification.manifest,
    release,
    certification,
    readOnly: true as const,
  });

  lastFreezeResult = result;
  return result;
}

export function getScenarioTimelinePlatformFreezeReport(): ScenarioTimelinePlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetScenarioTimelinePlatformFreezeForTests(): void {
  lastFreezeResult = null;
}

export {
  runScenarioTimelinePlatformFreezeCertification,
  getScenarioTimelinePlatformFreezeManifest,
  getScenarioTimelinePlatformRelease,
  getScenarioTimelinePlatformCompatibility,
  getScenarioTimelinePlatformExtensionPolicy,
  buildScenarioTimelinePlatformFreezeManifest,
  buildScenarioTimelinePlatformRelease,
};

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_VERSION = SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
export { SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS };

export const ScenarioTimelinePlatformFreeze = Object.freeze({
  runScenarioTimelinePlatformFreeze,
  runScenarioTimelinePlatformFreezeCertification,
  getScenarioTimelinePlatformFreezeManifest,
  getScenarioTimelinePlatformRelease,
  getScenarioTimelinePlatformCompatibility,
  getScenarioTimelinePlatformExtensionPolicy,
  getScenarioTimelinePlatformFreezeReport,
  version: SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
});

export type { ScenarioTimelinePlatformFreezeManifest, ScenarioTimelinePlatformRelease };
