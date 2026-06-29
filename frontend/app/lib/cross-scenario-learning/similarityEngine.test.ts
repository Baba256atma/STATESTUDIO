import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { buildCrossScenarioLearningFoundation } from "./crossScenarioLearningFoundation.ts";
import { resetCrossScenarioLearningPlatformForTests } from "./crossScenarioLearningRunner.ts";
import {
  extractExecutivePatterns,
  initializePatternExtractionEngine,
  resetPatternExtractionEngineForTests,
} from "./patternExtractionEngine.ts";
import type { CertifiedCompletedScenarioInput } from "./patternExtractionEngineTypes.ts";
import {
  SIMILARITY_DIMENSION_WEIGHTS,
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";
import {
  compareScenarioSimilarity,
  compareScenarioToPatterns,
  getSimilarityResults,
  initializeSimilarityEngine,
  registerSimilarityResult,
  resetSimilarityEngineForTests,
  SIMILARITY_ENGINE_SELF_MANIFEST,
  similarityResultExists,
  validateSimilarityResult,
} from "./similarityEngine.ts";
import { scoreScenarioProfiles } from "./similarityEngineScoring.ts";
import { runSimilarityEngineCertification, resetSimilarityEnginePlatformForTests } from "./similarityEngineRunner.ts";
import type { ScenarioSimilarityProfile } from "./similarityEngineTypes.ts";
import { validateScenarioSimilarityInput } from "./similarityEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function marketingCertScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-${suffix}`,
    workspaceId: WORKSPACE,
    scenarioTitle: `Marketing Expansion ${suffix}`,
    patternCategory: "growth",
    patternType: "strategy_outcome",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Increased",
      "Profit Increased",
      "Risk Stable",
    ]),
    decisionIds: Object.freeze([`decision-${suffix}`]),
    outcomeSummary: "Profit Increased with stable risk profile.",
    timelineReferences: Object.freeze([`timeline-${suffix}`]),
    journalReferences: Object.freeze([`journal-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

function profile(suffix: string, scenarioId?: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: scenarioId ?? `scenario-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand market share",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Increased",
      "Profit Increased",
      "Risk Stable",
    ]),
    objectTypes: Object.freeze(["campaign", "budget"]),
    kpiDirection: "increase",
    riskProfile: "stable",
    decisionType: "executive",
    timelinePhase: "execution",
    outcomeType: "Profit Increased with stable risk profile.",
    patternCategory: "growth",
    workspaceDomain: "marketing",
    readOnly: true as const,
  });
}

test.beforeEach(() => {
  resetSimilarityEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
  initializeSimilarityEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SIMILARITY_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/similarityEngine.ts",
    allowedFiles: SIMILARITY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SIMILARITY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("scores identical scenarios at 100 with full explanation", () => {
  const query = profile("query", "scenario-query");
  const historical = profile("hist", "scenario-hist");
  const comparison = compareScenarioSimilarity(
    Object.freeze({
      query,
      historicalScenarios: Object.freeze([historical]),
      comparedAt: FIXED_TIME,
    })
  );
  assert.equal(comparison.success, true, comparison.reason);
  assert.equal(comparison.scenarioResults.length, 1);
  const result = comparison.scenarioResults[0];
  assert.ok(result);
  assert.equal(result.score, 100);
  assert.equal(result.explanation.scoringMethod, SIMILARITY_SCORING_METHOD);
  assert.ok(result.explanation.matchedDimensions.length >= 5);
  assert.equal(result.explanation.finalScore, 100);
  assert.equal(Object.isFrozen(result), true);
});

test("explains partial matches deterministically", () => {
  const query = profile("query", "scenario-query");
  const historical = Object.freeze({
    ...profile("hist", "scenario-hist"),
    businessGoal: "Reduce operating cost",
    kpiDirection: "decrease" as const,
  });
  const breakdown = scoreScenarioProfiles(query, historical);
  assert.ok(breakdown.totalScore < 100);
  assert.ok(breakdown.totalScore >= SIMILARITY_DIMENSION_WEIGHTS.strategy_chain);
  const unmatched = breakdown.dimensions.filter((dimension) => !dimension.matched && dimension.weight > 0);
  assert.ok(unmatched.length >= 2);
});

test("compares scenario to extracted patterns", () => {
  const patterns = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingCertScenario("001"), marketingCertScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      patternNamePrefix: "Marketing Expansion",
      minOccurrences: 2,
    })
  ).extractedPatterns;

  const comparison = compareScenarioToPatterns(
    Object.freeze({
      query: profile("query", "scenario-query"),
      historicalScenarios: Object.freeze([]),
      patterns,
      comparedAt: FIXED_TIME,
    })
  );
  assert.equal(comparison.success, true, comparison.reason);
  assert.equal(comparison.patternResults.length, 1);
  assert.ok(comparison.patternResults[0]!.score >= SIMILARITY_DIMENSION_WEIGHTS.strategy_chain);
  assert.ok(comparison.patternResults[0]!.explanation.contributingPatternIds.length === 1);
});

test("registers similarity results in immutable registry", () => {
  compareScenarioSimilarity(
    Object.freeze({
      query: profile("query", "scenario-query"),
      historicalScenarios: Object.freeze([profile("hist", "scenario-hist")]),
      comparedAt: FIXED_TIME,
    })
  );
  const results = getSimilarityResults(WORKSPACE);
  assert.equal(results.length, 1);
  assert.equal(similarityResultExists(results[0]!.similarityResultId), true);
  assert.equal(validateSimilarityResult(results[0]!).valid, true);
});

test("rejects duplicate similarity result registration", () => {
  const comparison = compareScenarioSimilarity(
    Object.freeze({
      query: profile("query", "scenario-query"),
      historicalScenarios: Object.freeze([profile("hist", "scenario-hist")]),
      comparedAt: FIXED_TIME,
    })
  );
  const result = comparison.scenarioResults[0];
  assert.ok(result);
  const duplicate = registerSimilarityResult(result);
  assert.equal(duplicate.success, false);
});

test("rejects invalid similarity input", () => {
  const validation = validateScenarioSimilarityInput(
    Object.freeze({
      query: profile("query", "scenario-query"),
      historicalScenarios: Object.freeze([profile("query", "scenario-query")]),
    })
  );
  assert.equal(validation.valid, false);
});

test("requires APP-10:1 and APP-10:2 before comparison", () => {
  resetCrossScenarioLearningPlatformForTests();
  resetPatternExtractionEngineForTests();
  resetSimilarityEngineForTests();
  initializeSimilarityEngine(FIXED_TIME);
  const comparison = compareScenarioSimilarity(
    Object.freeze({
      query: profile("query", "scenario-query"),
      historicalScenarios: Object.freeze([profile("hist", "scenario-hist")]),
      comparedAt: FIXED_TIME,
    })
  );
  assert.equal(comparison.success, false);
});

test("exports scoring weights that sum to 100", () => {
  const total = Object.values(SIMILARITY_DIMENSION_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  assert.equal(total, 100);
  assert.equal(SIMILARITY_ENGINE_CONTRACT_VERSION, "APP-10/3");
});

test("runs similarity engine certification", () => {
  const result = runSimilarityEngineCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 15);
  assert.equal(result.phase, "APP-10/3");
});
