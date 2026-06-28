import assert from "node:assert/strict";
import test from "node:test";

import {
  STAGE_ARCHITECTURE_TAGS,
  STAGE_ARCHITECTURE_VERSION,
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_LIFECYCLE_PHASES,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_ARCHITECTURE_SELF_MANIFEST,
  computeStageOverallScore,
  meetsStageMinimumScore,
} from "./stageArchitectureContract.ts";
import {
  isStageArchitectureFrozen,
  resetStageArchitectureFreezeForTests,
  runStageArchitectureAnalysis,
  runStageArchitectureCertification,
} from "./stageArchitectureCertification.ts";
import { STAGE_ARCHITECTURE_FREEZE_TAGS } from "./stageArchitectureContract.ts";
import {
  getStageArchitectureDiagnosticsLog,
  resetStageArchitectureDiagnosticsForTests,
} from "./stageArchitectureDiagnostics.ts";
import {
  evaluateStageFileBoundary,
  validateStageManifest,
} from "./stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetStageArchitectureDiagnosticsForTests();
  resetStageArchitectureFreezeForTests();
});

test("exports stage architecture version, lifecycle, and tags", () => {
  assert.equal(STAGE_ARCHITECTURE_VERSION, "PHASE-1/STAGE-ARCH-2");
  assert.deepEqual(STAGE_LIFECYCLE_PHASES, ["understand", "build", "analyze", "certified"]);
  assert.ok(STAGE_ARCHITECTURE_TAGS.includes("[STAGE_ARCH_COMPLETE]"));
  assert.equal(STAGE_MINIMUM_OVERALL_SCORE, 95);
});

test("validates self manifest and rejects forbidden gateway paths", () => {
  const validation = validateStageManifest(STAGE_ARCHITECTURE_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  const gatewayDecision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/dashboardIntelligence/singleIntelligenceSourceGateway.ts",
    allowedFiles: STAGE_ARCHITECTURE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  });
  assert.equal(gatewayDecision.allowed, false);
  assert.equal(gatewayDecision.reason, "forbidden_pattern");
});

test("rejects forbidden presentation paths", () => {
  const decision = evaluateStageFileBoundary({
    filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
    allowedFiles: STAGE_ARCHITECTURE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, "forbidden_pattern");
});

test("computeStageOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeStageOverallScore({
    architecture: 96,
    maintainability: 96,
    regressionSafety: 97,
    scalability: 94,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsStageMinimumScore(overall), true);
});

test("stage architecture certification passes all gates", () => {
  const result = runStageArchitectureCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getStageArchitectureDiagnosticsLog().length > 0);
});

test("stage architecture analysis freezes foundation on pass", () => {
  const result = runStageArchitectureAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isStageArchitectureFrozen(), true);
  for (const tag of STAGE_ARCHITECTURE_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
