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
  compareScenarioSimilarity,
  initializeSimilarityEngine,
  resetSimilarityEngineForTests,
} from "./similarityEngine.ts";
import type { ScenarioSimilarityProfile } from "./similarityEngineTypes.ts";
import {
  initializeOutcomeLearningEngine,
  learnHistoricalOutcomes,
  resetOutcomeLearningEngineForTests,
} from "./outcomeLearningEngine.ts";
import type { HistoricalOutcomeRecordInput } from "./outcomeLearningEngineTypes.ts";
import {
  initializeFailureLearningEngine,
  learnHistoricalFailures,
  resetFailureLearningEngineForTests,
} from "./failureLearningEngine.ts";
import type { HistoricalFailureRecordInput } from "./failureLearningEngineTypes.ts";
import {
  initializeStrategyLearningEngine,
  learnHistoricalStrategies,
  resetStrategyLearningEngineForTests,
} from "./strategyLearningEngine.ts";
import type { HistoricalStrategyRecordInput } from "./strategyLearningEngineTypes.ts";
import {
  RECOMMENDATION_CATEGORY_KEYS,
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LIFECYCLE_STATE_KEYS,
} from "./recommendationLearningEngineConstants.ts";
import {
  getRecommendationProfiles,
  initializeRecommendationLearningEngine,
  learnHistoricalRecommendations,
  recommendationProfileExists,
  registerRecommendationProfile,
  resetRecommendationLearningEngineForTests,
  RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST,
  validateExecutiveRecommendationHistory,
} from "./recommendationLearningEngine.ts";
import {
  resetRecommendationLearningEnginePlatformForTests,
  runRecommendationLearningCertification,
} from "./recommendationLearningEngineRunner.ts";
import type { HistoricalRecommendationRecordInput } from "./recommendationLearningEngineTypes.ts";
import { validateHistoricalRecommendationRecordInput } from "./recommendationLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-recommendation-001";

function certScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    scenarioTitle: `Market Expansion Recommendation ${suffix}`,
    patternCategory: "growth",
    patternType: "strategy_outcome",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Declined",
      "Profit Decreased",
      "Risk Increased",
    ]),
    decisionIds: Object.freeze([`decision-rec-${suffix}`]),
    outcomeSummary: "Profit decreased with elevated risk profile.",
    timelineReferences: Object.freeze([`timeline-rec-${suffix}`]),
    journalReferences: Object.freeze([`journal-rec-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-rec-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

function profile(suffix: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand into new market",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Declined",
      "Profit Decreased",
      "Risk Increased",
    ]),
    objectTypes: Object.freeze(["campaign"]),
    kpiDirection: "decrease",
    riskProfile: "high",
    decisionType: "executive",
    timelinePhase: "execution",
    outcomeType: "Profit decreased with elevated risk profile.",
    patternCategory: "growth",
    workspaceDomain: "marketing",
    readOnly: true as const,
  });
}

function setupFullStack() {
  const patterns = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([certScenario("001"), certScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      patternNamePrefix: "Market Expansion Recommendation",
      minOccurrences: 2,
    })
  ).extractedPatterns;
  const patternId = patterns[0]!.patternId;
  const similarity = compareScenarioSimilarity(
    Object.freeze({
      query: profile("query"),
      historicalScenarios: Object.freeze([profile("001")]),
      patterns,
      comparedAt: FIXED_TIME,
    })
  );
  const similarityResultId =
    similarity.patternResults[0]?.similarityResultId ??
    similarity.scenarioResults[0]?.similarityResultId ??
    "";
  const outcomeLearning = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const outcomeId = outcomeLearning.learnedOutcomes[0]!.outcome.outcomeId;
  const failureLearning = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const failureId = failureLearning.learnedFailures[0]!.failure.failureId;
  const strategyLearning = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const strategyId = strategyLearning.learnedStrategies[0]!.strategy.strategyId;
  return { patternId, similarityResultId, outcomeId, failureId, strategyId };
}

function outcomeRecord(suffix: string, patternId: string, similarityResultId: string): HistoricalOutcomeRecordInput {
  return Object.freeze({
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand into new market",
    finalOutcomeCategory: "critical_failure",
    kpiChangeSummary: "Revenue declined 22% with margin compression.",
    riskChangeSummary: "Risk profile escalated to elevated.",
    decisionSummary: "Market expansion budget approved but underperformed.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    decisionIds: Object.freeze([`decision-rec-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-rec-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-rec-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-7", "APP-8", "APP-9", "APP-10/2", "APP-10/3"]),
    recordedAt: FIXED_TIME,
  });
}

function failureRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string,
  outcomeId: string
): HistoricalFailureRecordInput {
  return Object.freeze({
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand into new market",
    failureCategory: "strategic_failure",
    failureFactorKeys: Object.freeze(["execution_delays", "kpi_deterioration"]),
    failureCauses: Object.freeze([
      Object.freeze({
        label: "Incorrect market assumptions",
        description: "Market demand was overestimated based on preliminary research.",
      }),
    ]),
    kpiImpactSummary: "Revenue declined 22% with margin compression.",
    riskImpactSummary: "Risk profile escalated to elevated.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    relatedOutcomeIds: Object.freeze([outcomeId]),
    decisionIds: Object.freeze([`decision-rec-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-rec-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-rec-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-7", "APP-8", "APP-9", "APP-10/2", "APP-10/3", "APP-10/4"]),
    recordedAt: FIXED_TIME,
  });
}

function strategyRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string,
  outcomeId: string,
  failureId: string
): HistoricalStrategyRecordInput {
  return Object.freeze({
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    strategyName: "Increase Marketing Budget",
    strategyCategory: "growth_strategy",
    businessGoal: "Expand into new market",
    workspaceDomain: "marketing",
    timelinePhase: "execution",
    kpiDirection: "decrease",
    riskProfile: "high",
    outcomeSummary: "Strategy underperformed with critical failure outcome.",
    failureSummary: "Strategic failure due to incorrect market assumptions.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    relatedOutcomeIds: Object.freeze([outcomeId]),
    relatedFailureIds: Object.freeze([failureId]),
    decisionIds: Object.freeze([`decision-rec-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-rec-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-rec-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze([
      "APP-5",
      "APP-6",
      "APP-7",
      "APP-8",
      "APP-9",
      "APP-10/2",
      "APP-10/3",
      "APP-10/4",
      "APP-10/5",
    ]),
    recordedAt: FIXED_TIME,
  });
}

function recommendationRecord(
  suffix: string,
  strategyId: string,
  similarityResultId: string,
  outcomeId: string,
  failureId: string
): HistoricalRecommendationRecordInput {
  return Object.freeze({
    recommendationRecordId: `rec-record-${suffix}`,
    scenarioId: `scenario-rec-${suffix}`,
    workspaceId: WORKSPACE,
    recommendationSummary: "Proceed with market expansion budget increase",
    recommendationCategory: "growth_recommendation",
    lifecycleState: suffix === "001" ? "completed" : "implemented",
    outcomeSummary: "Recommendation led to critical failure outcome.",
    failureSummary: "Recommendation associated with strategic failure.",
    relatedStrategyIds: Object.freeze([strategyId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    relatedOutcomeIds: Object.freeze([outcomeId]),
    relatedFailureIds: Object.freeze([failureId]),
    decisionIds: Object.freeze([`decision-rec-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-rec-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-rec-${suffix}`]),
    acceptanceEvents: Object.freeze([
      Object.freeze({ state: "accepted" as const, recordedAt: FIXED_TIME }),
    ]),
    implementationEvents: Object.freeze([
      Object.freeze({
        implementedAt: FIXED_TIME,
        summary: "Recommendation implemented in market expansion scenario.",
      }),
    ]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze([
      "APP-6",
      "APP-7",
      "APP-8",
      "APP-9",
      "APP-10/3",
      "APP-10/4",
      "APP-10/5",
      "APP-10/6",
    ]),
    recordedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetRecommendationLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
  initializeSimilarityEngine(FIXED_TIME);
  initializeOutcomeLearningEngine(FIXED_TIME);
  initializeFailureLearningEngine(FIXED_TIME);
  initializeStrategyLearningEngine(FIXED_TIME);
  initializeRecommendationLearningEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/recommendationLearningEngine.ts",
    allowedFiles: RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("learns historical recommendations from certified records", () => {
  const { similarityResultId, outcomeId, failureId, strategyId } = setupFullStack();
  const result = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", strategyId, similarityResultId, outcomeId, failureId),
        recommendationRecord("002", strategyId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.learnedRecommendations.length, 1);
  const learned = result.learnedRecommendations[0];
  assert.ok(learned);
  assert.equal(learned.profile.recommendationCategory, "growth_recommendation");
  assert.equal(learned.profile.relatedScenarioIds.length, 2);
  assert.equal(validateExecutiveRecommendationHistory(learned).valid, true);
  assert.equal(Object.isFrozen(learned), true);
});

test("links outcomes failures and tracks lifecycle metrics", () => {
  const { similarityResultId, outcomeId, failureId, strategyId } = setupFullStack();
  const result = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", strategyId, similarityResultId, outcomeId, failureId),
        recommendationRecord("002", strategyId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedRecommendations[0];
  assert.ok(learned);
  assert.ok(learned.outcomeLinks.length >= 2);
  assert.ok(learned.failureLinks.length >= 2);
  assert.equal(learned.profile.provenance.strategyIds.includes(strategyId), true);
  assert.equal(learned.profile.historicalMetrics.acceptanceCount, 2);
  assert.equal(learned.profile.historicalMetrics.implementationCount, 2);
  assert.equal(learned.profile.historicalMetrics.completionCount, 1);
});

test("registers recommendation profiles in immutable registry", () => {
  const { similarityResultId, outcomeId, failureId, strategyId } = setupFullStack();
  learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", strategyId, similarityResultId, outcomeId, failureId),
        recommendationRecord("002", strategyId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const profiles = getRecommendationProfiles(WORKSPACE);
  assert.equal(profiles.length, 1);
  assert.equal(recommendationProfileExists(profiles[0]!.profile.recommendationId), true);
});

test("rejects duplicate recommendation registration", () => {
  const { similarityResultId, outcomeId, failureId, strategyId } = setupFullStack();
  const result = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", strategyId, similarityResultId, outcomeId, failureId),
        recommendationRecord("002", strategyId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedRecommendations[0];
  assert.ok(learned);
  assert.equal(registerRecommendationProfile(learned).success, false);
});

test("rejects broken strategy references", () => {
  const { similarityResultId, outcomeId, failureId } = setupFullStack();
  const result = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", "missing-strategy", similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-10:1 through APP-10:6 before learning", () => {
  resetRecommendationLearningEnginePlatformForTests();
  resetStrategyLearningEngineForTests();
  resetFailureLearningEngineForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
  initializeRecommendationLearningEngine(FIXED_TIME);
  const result = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("validates historical recommendation record input", () => {
  assert.equal(
    validateHistoricalRecommendationRecordInput(
      Object.freeze({
        recommendationRecordId: "rec-record-001",
        scenarioId: "scenario-rec-001",
        workspaceId: WORKSPACE,
        recommendationSummary: "Proceed with market expansion",
        recommendationCategory: "growth_recommendation",
        lifecycleState: "proposed",
        outcomeSummary: "Failed",
        failureSummary: "Failed",
        relatedStrategyIds: Object.freeze([]),
        relatedSimilarityResultIds: Object.freeze([]),
        relatedOutcomeIds: Object.freeze([]),
        relatedFailureIds: Object.freeze([]),
        decisionIds: Object.freeze(["decision-rec-001"]),
        journalEntryIds: Object.freeze(["journal-rec-001"]),
        timelineReferences: Object.freeze(["timeline-rec-001"]),
        acceptanceEvents: Object.freeze([]),
        implementationEvents: Object.freeze([]),
        sourceApps: Object.freeze(["APP-6"]),
      })
    ).valid,
    false
  );
});

test("exports recommendation categories lifecycle states and contract version", () => {
  assert.equal(RECOMMENDATION_CATEGORY_KEYS.length, 10);
  assert.equal(RECOMMENDATION_LIFECYCLE_STATE_KEYS.length, 7);
  assert.equal(RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION, "APP-10/7");
});

test("runs recommendation learning engine certification", () => {
  const result = runRecommendationLearningCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 16);
  assert.equal(result.phase, "APP-10/7");
});
