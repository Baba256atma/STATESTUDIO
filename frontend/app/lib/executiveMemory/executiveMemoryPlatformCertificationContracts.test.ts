import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import {
  resolveExecutiveIntentExample,
  validateExecutiveIntentShape,
} from "../executiveIntent/executiveIntentContract.ts";
import { runExecutiveIntentPlatformRefresh } from "../executiveIntent/executiveIntentPlatformRefresh.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
  EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
} from "./executiveMemoryPlatformCertificationConstants.ts";
import {
  buildExecutiveMemoryPlatformCertificationManifest,
  certifyExecutiveMemoryPlatformEndToEnd,
  initializeExecutiveMemoryPlatformCertificationEngine,
  resetExecutiveMemoryPlatformCertificationEngineForTests,
  runExecutiveMemoryPlatformCertification,
  runExecutiveMemoryPlatformCertificationSuite,
  runExecutiveMemoryPlatformRegression,
  runExecutiveMemoryPlatformRegressionOnly,
  validateExecutiveMemoryPlatformArchitectureBoundaries,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_IDENTITY,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  ExecutiveMemoryPlatformCertificationContracts,
} from "./executiveMemoryPlatformCertificationContracts.ts";

const REPO_ROOT = join(process.cwd(), "..");

test.beforeEach(() => {
  resetExecutiveMemoryPlatformCertificationEngineForTests();
});

test("exports APP-4:13 certification identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_IDENTITY.phaseId, "APP-4/13");
  assert.equal(EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-4/13");
  assert.equal(ExecutiveMemoryPlatformCertificationContracts.version, "APP-4/13");
  assert.equal(EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.length, 12);
});

test("builds immutable certification manifest", () => {
  const manifest = buildExecutiveMemoryPlatformCertificationManifest(new Date().toISOString());
  assert.equal(manifest.certificationVersion, "APP-4/13");
  assert.equal(manifest.platformStatus, "CERTIFIED");
  assert.equal(manifest.readinessStatus, "READY_FOR_FREEZE");
  assert.equal(Object.isFrozen(manifest), true);
  assert.ok(manifest.architectureHash.startsWith("arch-"));
  assert.equal(manifest.certifiedPhases.length, 12);
});

test("runs complete APP-4:1 through APP-4:12 regression", () => {
  const regression = runExecutiveMemoryPlatformRegression();
  assert.equal(regression.certified, true);
  assert.equal(regression.phases.length, 12);
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
  assert.ok(regression.executionTimeMs >= 0);
});

test("runs regression-only helper", () => {
  const regression = runExecutiveMemoryPlatformRegressionOnly();
  assert.equal(regression.status, "PASS");
});

test("certifies end-to-end platform integration", () => {
  const endToEnd = certifyExecutiveMemoryPlatformEndToEnd();
  assert.equal(endToEnd.certified, true);
  assert.equal(endToEnd.status, "PASS");
});

test("validates cross-platform APP-2 scenario compatibility", () => {
  assert.equal(validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid, true);
});

test("validates cross-platform APP-3 intent compatibility", () => {
  assert.equal(validateExecutiveIntentShape(resolveExecutiveIntentExample()).valid, true);
  assert.equal(runExecutiveIntentPlatformRefresh().certified, true);
});

test("certification suite returns manifest and release readiness", () => {
  initializeExecutiveMemoryPlatformCertificationEngine("2026-01-01T00:00:00.000Z");
  const suite = runExecutiveMemoryPlatformCertificationSuite();
  assert.equal(suite.certificationVersion, "APP-4/13");
  assert.equal(suite.regressionStatus, "PASS");
  assert.equal(suite.manifest.readinessStatus, "READY_FOR_FREEZE");
});

test("APP-4:13 platform certification passes all gates", () => {
  const result = runExecutiveMemoryPlatformCertification();
  assert.equal(result.certified, true);
  assert.equal(result.releaseReady, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS]);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.regression.certified, true);
  assert.equal(result.checks.length, 23);
  assert.equal(result.compatibility.app2ScenarioCompatible, true);
  assert.equal(result.compatibility.app3IntentCompatible, true);
});

test("validates deterministic dashboard output during certification", () => {
  const result = runExecutiveMemoryPlatformCertification();
  const deterministicGate = result.checks.find((entry) => entry.id === "N");
  assert.equal(deterministicGate?.passed, true);
});

test("validates architecture boundaries", () => {
  assert.equal(validateExecutiveMemoryPlatformArchitectureBoundaries(), true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    false
  );
});

test("validates APP-4:13 stage manifest", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
});

test("validates documentation completeness registry", () => {
  for (const filePath of EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES) {
    assert.equal(existsSync(join(REPO_ROOT, filePath)), true, filePath);
  }
});

test("tracks certification performance metadata", () => {
  const result = runExecutiveMemoryPlatformCertification();
  assert.ok(result.performance.certificationExecutionTimeMs >= 0);
  assert.ok(result.performance.regressionExecutionTimeMs >= 0);
  assert.equal(result.performance.totalCertifiedModules, 12);
  assert.equal(result.performance.totalCertificationTestFiles, EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES.length);
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample()).valid, true);
});

test("regression integrity preserves phase registry", () => {
  const phases = EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.map((entry) => entry.phaseId);
  assert.deepEqual(phases, [
    "APP-4/1",
    "APP-4/2",
    "APP-4/3",
    "APP-4/4",
    "APP-4/5",
    "APP-4/6",
    "APP-4/7",
    "APP-4/8",
    "APP-4/9",
    "APP-4/10",
    "APP-4/11",
    "APP-4/12",
  ]);
});
