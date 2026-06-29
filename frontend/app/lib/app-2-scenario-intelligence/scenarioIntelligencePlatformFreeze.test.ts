import assert from "node:assert/strict";
import test from "node:test";

import { SCENARIO_INTELLIGENCE_FREEZE_RULES } from "./scenarioIntelligenceContract.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES } from "./executiveScenarioAssistantAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES } from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_RULES } from "./executiveScenarioPackageManifest.ts";
import {
  buildScenarioIntelligencePlatformFreezeManifest,
  SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST,
  SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
  SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
  SCENARIO_INTELLIGENCE_PLATFORM_STATUS,
} from "./scenarioIntelligencePlatformFreezeManifest.ts";
import {
  runScenarioIntelligencePlatformFinalCertification,
  SCENARIO_INTELLIGENCE_PLATFORM_FINAL_TAGS,
} from "./scenarioIntelligencePlatformFinalCertification.ts";
import {
  runScenarioIntelligencePlatformCertificationSuite,
  runScenarioIntelligencePlatformRegressionOnly,
  ScenarioIntelligencePlatformFreezeRunner,
} from "./scenarioIntelligencePlatformFreezeRunner.ts";
import { runScenarioIntelligencePlatformFreezeRegression } from "./scenarioIntelligencePlatformFreezeRegression.ts";

test("builds immutable freeze manifest", () => {
  const manifest = buildScenarioIntelligencePlatformFreezeManifest(new Date().toISOString());

  assert.equal(manifest.freezeVersion, "APP-2/14");
  assert.equal(manifest.platformStatus, SCENARIO_INTELLIGENCE_PLATFORM_STATUS);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.frozenComponents), true);
  assert.ok(manifest.architectureHash.startsWith("arch-"));
  assert.ok(manifest.frozenPublicApis.includes("ExecutiveScenarioPackageExport"));
  assert.equal(manifest.frozenLayers.integration.length, 3);
});

test("runs complete APP-2:1 through APP-2:13 freeze regression", () => {
  const regression = runScenarioIntelligencePlatformFreezeRegression();

  assert.equal(regression.certified, true);
  assert.equal(regression.phaseCount, 14);
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-2/13"));
});

test("runs regression-only helper", () => {
  const regression = runScenarioIntelligencePlatformRegressionOnly();
  assert.equal(regression.status, "PASS");
});

test("declares compatibility manifest without implementation", () => {
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST.executiveMemory.compatible, true);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST.layArchitecture.mustUseAdapterBoundaries, true);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST.governance.runtimeBehaviorChanged, false);
});

test("lists forbidden consumer engine imports", () => {
  assert.ok(SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.includes("scenarioStateEngine"));
  assert.ok(SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.includes("executiveRecommendationEngine"));
});

test("validates frozen adapter and package rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.noMutation, true);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
});

test("certification suite returns freeze manifest", () => {
  const suite = runScenarioIntelligencePlatformCertificationSuite();

  assert.equal(suite.freezeVersion, SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION);
  assert.equal(suite.freezeManifest.platformStatus, "FROZEN");
  assert.equal(suite.regressionStatus, "PASS");
});

test("freeze runner exposes official release entry point", () => {
  assert.equal(ScenarioIntelligencePlatformFreezeRunner.version, "APP-2/14");
  assert.equal(typeof ScenarioIntelligencePlatformFreezeRunner.runScenarioIntelligencePlatformFinalCertification, "function");
});

test("APP-2:14 final certification passes all gates", () => {
  const result = runScenarioIntelligencePlatformFinalCertification();

  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.deepEqual([...result.tags], [...SCENARIO_INTELLIGENCE_PLATFORM_FINAL_TAGS]);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 26);
  assert.equal(result.regression.certified, true);
  assert.equal(result.platformCertification.certified, true);
  assert.equal(result.publicApiValidation.packageExportOnly, true);
  assert.equal(SCENARIO_INTELLIGENCE_FREEZE_RULES.breakingChangesForbidden, true);
});
