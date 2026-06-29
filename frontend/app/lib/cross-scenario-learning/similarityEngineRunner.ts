/**
 * APP-10:3 — Similarity Engine certification runner.
 */

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
  SIMILARITY_ENGINE_PUBLIC_API_RULES,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";
import {
  compareScenarioSimilarity,
  initializeSimilarityEngine,
  isSimilarityEngineInitialized,
  registerSimilarityResult,
  resetSimilarityEngineForTests,
  SIMILARITY_ENGINE_SELF_MANIFEST,
  similarityResultExists,
} from "./similarityEngine.ts";
import { scoreScenarioProfiles } from "./similarityEngineScoring.ts";
import { getSimilarityRegistrySnapshot } from "./similarityEngineRegistry.ts";
import type {
  ScenarioSimilarityProfile,
  SimilarityCertificationCheck,
  SimilarityCertificationResult,
} from "./similarityEngineTypes.ts";
import { validateSimilarityResult } from "./similarityEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-similarity-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): SimilarityCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function marketingCertScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-marketing-${suffix}`,
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

function marketingProfile(suffix: string, scenarioId?: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: scenarioId ?? `scenario-query-${suffix}`,
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

export function resetSimilarityEnginePlatformForTests(): void {
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runSimilarityEngineCertification(timestamp: string = FIXED_TIME): SimilarityCertificationResult {
  resetSimilarityEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);
  initializeSimilarityEngine(timestamp);

  const checks: SimilarityCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Similarity engine initialized",
      isSimilarityEngineInitialized() === true,
      SIMILARITY_ENGINE_CONTRACT_VERSION
    )
  );

  const query = marketingProfile("query", "scenario-query-current");
  const historical = marketingProfile("hist-001", "scenario-marketing-hist-001");
  const comparison = compareScenarioSimilarity(
    Object.freeze({
      query,
      historicalScenarios: Object.freeze([historical]),
      comparedAt: timestamp,
      minScore: 0,
    })
  );

  checks.push(
    check(
      "B_scenario_similarity",
      "Scenario-to-scenario similarity",
      comparison.success === true && comparison.scenarioResults.length === 1,
      comparison.reason
    )
  );

  const scenarioResult = comparison.scenarioResults[0];
  checks.push(
    check(
      "C_weighted_scoring",
      "Deterministic weighted scoring",
      scenarioResult !== undefined &&
        scenarioResult.score === 100 &&
        scenarioResult.explanation.scoringMethod === SIMILARITY_SCORING_METHOD,
      String(scenarioResult?.score ?? 0)
    )
  );

  checks.push(
    check(
      "D_explanation_complete",
      "Similarity explanation complete",
      scenarioResult !== undefined &&
        scenarioResult.explanation.matchedDimensions.length >= 5 &&
        scenarioResult.explanation.finalScore === scenarioResult.score,
      String(scenarioResult?.explanation.matchedDimensions.length ?? 0)
    )
  );

  checks.push(
    check(
      "E_evidence_present",
      "Similarity evidence present",
      scenarioResult !== undefined && scenarioResult.evidence.length >= 2,
      String(scenarioResult?.evidence.length ?? 0)
    )
  );

  checks.push(
    check(
      "F_registry_register",
      "Similarity registry registration",
      scenarioResult !== undefined && similarityResultExists(scenarioResult.similarityResultId) === true,
      scenarioResult?.similarityResultId ?? "missing"
    )
  );

  if (scenarioResult) {
    checks.push(
      check(
        "G_validation",
        "Similarity result validation",
        validateSimilarityResult(scenarioResult).valid === true,
        "valid"
      )
    );
    checks.push(
      check(
        "H_duplicate_prevention",
        "Duplicate result prevention",
        registerSimilarityResult(scenarioResult).success === false,
        "duplicate rejected"
      )
    );
  }

  const patternExtraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingCertScenario("001"), marketingCertScenario("002")]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Marketing Expansion",
      minOccurrences: 2,
    })
  );
  const patternComparison = compareScenarioSimilarity(
    Object.freeze({
      query,
      historicalScenarios: Object.freeze([]),
      patterns: patternExtraction.extractedPatterns,
      comparedAt: timestamp,
      minScore: 0,
    })
  );
  checks.push(
    check(
      "I_pattern_similarity",
      "Scenario-to-pattern similarity",
      patternComparison.success === true && patternComparison.patternResults.length === 1,
      patternComparison.reason
    )
  );

  checks.push(
    check(
      "J_scoring_weights",
      "Scoring weights sum to 100",
      Object.values(SIMILARITY_DIMENSION_WEIGHTS).reduce((sum, weight) => sum + weight, 0) === 100,
      "100"
    )
  );

  checks.push(
    check(
      "K_no_ml_forbidden",
      "No ML, embeddings, or recommendations",
      SIMILARITY_ENGINE_PUBLIC_API_RULES.noMachineLearning === true &&
        SIMILARITY_ENGINE_PUBLIC_API_RULES.noEmbeddings === true &&
        SIMILARITY_ENGINE_PUBLIC_API_RULES.noRecommendationEngine === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "L_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(SIMILARITY_ENGINE_SELF_MANIFEST).valid === true,
      SIMILARITY_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "M_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/similarityEngine.ts",
        allowedFiles: SIMILARITY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: SIMILARITY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "similarityEngine.ts"
    )
  );

  const partialHistorical = Object.freeze({
    ...historical,
    businessGoal: "Different goal",
    kpiDirection: "decrease" as const,
  });
  const partialScore = scoreScenarioProfiles(query, partialHistorical);
  checks.push(
    check(
      "N_partial_match_scoring",
      "Partial match scoring deterministic",
      partialScore.totalScore < 100 && partialScore.totalScore >= 0,
      String(partialScore.totalScore)
    )
  );

  checks.push(
    check(
      "O_immutable_outputs",
      "Immutable similarity outputs",
      scenarioResult !== undefined && Object.isFrozen(scenarioResult) && scenarioResult.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "P_registry_snapshot",
      "Registry snapshot",
      getSimilarityRegistrySnapshot().resultCount >= 1,
      String(getSimilarityRegistrySnapshot().resultCount)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/3",
    contractVersion: SIMILARITY_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const SimilarityEngineRunner = Object.freeze({
  runSimilarityEngineCertification,
  resetSimilarityEnginePlatformForTests,
});
