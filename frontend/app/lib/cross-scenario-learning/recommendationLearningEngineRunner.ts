/**
 * APP-10:7 — Recommendation Learning Engine certification runner.
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
  RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES,
  RECOMMENDATION_LIFECYCLE_STATE_KEYS,
} from "./recommendationLearningEngineConstants.ts";
import {
  getRecommendationProfiles,
  initializeRecommendationLearningEngine,
  isRecommendationLearningEngineInitialized,
  learnHistoricalRecommendations,
  recommendationProfileExists,
  registerRecommendationProfile,
  resetRecommendationLearningEngineForTests,
  RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST,
} from "./recommendationLearningEngine.ts";
import { getRecommendationRegistrySnapshot } from "./recommendationLearningEngineRegistry.ts";
import type {
  HistoricalRecommendationRecordInput,
  RecommendationLearningCertificationCheck,
  RecommendationLearningCertificationResult,
} from "./recommendationLearningEngineTypes.ts";
import { validateExecutiveRecommendationHistory } from "./recommendationLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-learning-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): RecommendationLearningCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

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

export function resetRecommendationLearningEnginePlatformForTests(): void {
  resetRecommendationLearningEngineForTests();
  resetStrategyLearningEngineForTests();
  resetFailureLearningEngineForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runRecommendationLearningCertification(
  timestamp: string = FIXED_TIME
): RecommendationLearningCertificationResult {
  resetRecommendationLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);
  initializeSimilarityEngine(timestamp);
  initializeOutcomeLearningEngine(timestamp);
  initializeFailureLearningEngine(timestamp);
  initializeStrategyLearningEngine(timestamp);
  initializeRecommendationLearningEngine(timestamp);

  const checks: RecommendationLearningCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Recommendation learning engine initialized",
      isRecommendationLearningEngineInitialized() === true,
      RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION
    )
  );

  const patternExtraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([certScenario("001"), certScenario("002")]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Market Expansion Recommendation",
      minOccurrences: 2,
    })
  );
  const patternId = patternExtraction.extractedPatterns[0]?.patternId ?? "";

  const similarity = compareScenarioSimilarity(
    Object.freeze({
      query: profile("query"),
      historicalScenarios: Object.freeze([profile("001")]),
      patterns: patternExtraction.extractedPatterns,
      comparedAt: timestamp,
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
      learningTimestamp: timestamp,
    })
  );
  const outcomeId = outcomeLearning.learnedOutcomes[0]?.outcome.outcomeId ?? "";

  const failureLearning = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: timestamp,
    })
  );
  const failureId = failureLearning.learnedFailures[0]?.failure.failureId ?? "";

  const strategyLearning = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: timestamp,
    })
  );
  const strategyId = strategyLearning.learnedStrategies[0]?.strategy.strategyId ?? "";

  const learning = learnHistoricalRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        recommendationRecord("001", strategyId, similarityResultId, outcomeId, failureId),
        recommendationRecord("002", strategyId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "B_recommendation_learning",
      "Historical recommendation learning",
      learning.success === true && learning.learnedRecommendations.length === 1,
      learning.reason
    )
  );

  const learned = learning.learnedRecommendations[0];
  checks.push(
    check(
      "C_recommendation_contract",
      "Executive recommendation history contract valid",
      learned !== undefined && validateExecutiveRecommendationHistory(learned).valid === true,
      learned?.profile.recommendationId ?? "missing"
    )
  );

  checks.push(
    check(
      "D_provenance_complete",
      "Provenance complete",
      learned !== undefined &&
        learned.profile.provenance.scenarioIds.length === 2 &&
        learned.profile.provenance.strategyIds.includes(strategyId),
      String(learned?.profile.provenance.scenarioIds.length ?? 0)
    )
  );

  checks.push(
    check(
      "E_outcome_linkage",
      "Outcome linkage",
      learned !== undefined && learned.outcomeLinks.length >= 2,
      String(learned?.outcomeLinks.length ?? 0)
    )
  );

  checks.push(
    check(
      "F_failure_linkage",
      "Failure linkage",
      learned !== undefined && learned.failureLinks.length >= 2,
      String(learned?.failureLinks.length ?? 0)
    )
  );

  checks.push(
    check(
      "G_lifecycle_tracking",
      "Lifecycle tracking",
      learned !== undefined &&
        learned.lifecycleHistory.length >= 2 &&
        learned.profile.historicalMetrics.acceptanceCount >= 2,
      String(learned?.profile.historicalMetrics.acceptanceCount ?? 0)
    )
  );

  checks.push(
    check(
      "H_registry_register",
      "Recommendation registry registration",
      learned !== undefined && recommendationProfileExists(learned.profile.recommendationId) === true,
      learned?.profile.recommendationId ?? "missing"
    )
  );

  if (learned) {
    checks.push(
      check(
        "I_duplicate_prevention",
        "Duplicate recommendation prevention",
        registerRecommendationProfile(learned).success === false,
        "duplicate rejected"
      )
    );
  }

  checks.push(
    check(
      "J_recommendation_categories",
      "Recommendation categories declared",
      RECOMMENDATION_CATEGORY_KEYS.length === 10,
      String(RECOMMENDATION_CATEGORY_KEYS.length)
    )
  );

  checks.push(
    check(
      "K_lifecycle_states",
      "Lifecycle states declared",
      RECOMMENDATION_LIFECYCLE_STATE_KEYS.length === 7,
      String(RECOMMENDATION_LIFECYCLE_STATE_KEYS.length)
    )
  );

  checks.push(
    check(
      "L_no_generation_forbidden",
      "No generation or ranking scope",
      RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES.noRecommendationGeneration === true &&
        RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES.noRecommendationRanking === true &&
        RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES.historicalEvidenceOnly === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "M_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST).valid === true,
      RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "N_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/recommendationLearningEngine.ts",
        allowedFiles: RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "recommendationLearningEngine.ts"
    )
  );

  checks.push(
    check(
      "O_registry_list",
      "Recommendation registry listing",
      getRecommendationProfiles(WORKSPACE).length === 1,
      String(getRecommendationProfiles(WORKSPACE).length)
    )
  );

  checks.push(
    check(
      "P_immutable_outputs",
      "Immutable recommendation outputs",
      learned !== undefined && Object.isFrozen(learned) && learned.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "Q_registry_snapshot",
      "Registry snapshot",
      getRecommendationRegistrySnapshot().profileCount >= 1,
      String(getRecommendationRegistrySnapshot().profileCount)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/7",
    contractVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const RecommendationLearningEngineRunner = Object.freeze({
  runRecommendationLearningCertification,
  resetRecommendationLearningEnginePlatformForTests,
});
