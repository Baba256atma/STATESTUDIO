/**
 * APP-10:6 — Strategy Learning Engine certification runner.
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
  STRATEGY_CATEGORY_KEYS,
  STRATEGY_CONDITION_KEYS,
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES,
} from "./strategyLearningEngineConstants.ts";
import {
  getStrategies,
  initializeStrategyLearningEngine,
  isStrategyLearningEngineInitialized,
  learnHistoricalStrategies,
  registerStrategy,
  resetStrategyLearningEngineForTests,
  STRATEGY_LEARNING_ENGINE_SELF_MANIFEST,
  strategyExists,
} from "./strategyLearningEngine.ts";
import { getStrategyRegistrySnapshot } from "./strategyLearningEngineRegistry.ts";
import type {
  HistoricalStrategyRecordInput,
  StrategyLearningCertificationCheck,
  StrategyLearningCertificationResult,
} from "./strategyLearningEngineTypes.ts";
import { validateExecutiveStrategy } from "./strategyLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-strategy-learning-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): StrategyLearningCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function failedCertScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-strategy-${suffix}`,
    workspaceId: WORKSPACE,
    scenarioTitle: `Market Expansion Strategy ${suffix}`,
    patternCategory: "growth",
    patternType: "strategy_outcome",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Declined",
      "Profit Decreased",
      "Risk Increased",
    ]),
    decisionIds: Object.freeze([`decision-strategy-${suffix}`]),
    outcomeSummary: "Profit decreased with elevated risk profile.",
    timelineReferences: Object.freeze([`timeline-strategy-${suffix}`]),
    journalReferences: Object.freeze([`journal-strategy-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-strategy-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

function profile(suffix: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: `scenario-strategy-${suffix}`,
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

function outcomeRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string
): HistoricalOutcomeRecordInput {
  return Object.freeze({
    scenarioId: `scenario-strategy-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand into new market",
    finalOutcomeCategory: "critical_failure",
    kpiChangeSummary: "Revenue declined 22% with margin compression.",
    riskChangeSummary: "Risk profile escalated to elevated.",
    decisionSummary: "Market expansion budget approved but underperformed.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    decisionIds: Object.freeze([`decision-strategy-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-strategy-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-strategy-${suffix}`]),
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
    scenarioId: `scenario-strategy-${suffix}`,
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
    decisionIds: Object.freeze([`decision-strategy-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-strategy-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-strategy-${suffix}`]),
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
    scenarioId: `scenario-strategy-${suffix}`,
    workspaceId: WORKSPACE,
    strategyName: "Increase Marketing Budget",
    strategyCategory: "growth_strategy",
    businessGoal: "Expand into new market",
    workspaceDomain: "marketing",
    timelinePhase: "execution",
    kpiDirection: "decrease",
    riskProfile: "high",
    resourceConstraints: "limited marketing budget",
    dependencyConstraints: "vendor delivery delays",
    executionConditions: "accelerated launch timeline",
    outcomeSummary: "Strategy underperformed with critical failure outcome.",
    failureSummary: "Strategic failure due to incorrect market assumptions.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    relatedOutcomeIds: Object.freeze([outcomeId]),
    relatedFailureIds: Object.freeze([failureId]),
    decisionIds: Object.freeze([`decision-strategy-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-strategy-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-strategy-${suffix}`]),
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

export function resetStrategyLearningEnginePlatformForTests(): void {
  resetStrategyLearningEngineForTests();
  resetFailureLearningEngineForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runStrategyLearningCertification(timestamp: string = FIXED_TIME): StrategyLearningCertificationResult {
  resetStrategyLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);
  initializeSimilarityEngine(timestamp);
  initializeOutcomeLearningEngine(timestamp);
  initializeFailureLearningEngine(timestamp);
  initializeStrategyLearningEngine(timestamp);

  const checks: StrategyLearningCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Strategy learning engine initialized",
      isStrategyLearningEngineInitialized() === true,
      STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION
    )
  );

  const patternExtraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([failedCertScenario("001"), failedCertScenario("002")]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Market Expansion Strategy",
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

  const learning = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "B_strategy_learning",
      "Historical strategy learning",
      learning.success === true && learning.learnedStrategies.length === 1,
      learning.reason
    )
  );

  const learned = learning.learnedStrategies[0];
  checks.push(
    check(
      "C_strategy_contract",
      "Executive strategy contract valid",
      learned !== undefined && validateExecutiveStrategy(learned).valid === true,
      learned?.strategy.strategyId ?? "missing"
    )
  );

  checks.push(
    check(
      "D_provenance_complete",
      "Provenance complete",
      learned !== undefined &&
        learned.strategy.provenance.scenarioIds.length === 2 &&
        learned.strategy.provenance.outcomeIds.includes(outcomeId) &&
        learned.strategy.provenance.failureIds.includes(failureId),
      String(learned?.strategy.provenance.scenarioIds.length ?? 0)
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
      "G_business_conditions",
      "Business conditions tracked",
      learned !== undefined && learned.strategy.businessConditions.length >= STRATEGY_CONDITION_KEYS.length,
      String(learned?.strategy.businessConditions.length ?? 0)
    )
  );

  checks.push(
    check(
      "H_registry_register",
      "Strategy registry registration",
      learned !== undefined && strategyExists(learned.strategy.strategyId) === true,
      learned?.strategy.strategyId ?? "missing"
    )
  );

  if (learned) {
    checks.push(
      check(
        "I_duplicate_prevention",
        "Duplicate strategy prevention",
        registerStrategy(learned).success === false,
        "duplicate rejected"
      )
    );
  }

  checks.push(
    check(
      "J_strategy_categories",
      "Strategy categories declared",
      STRATEGY_CATEGORY_KEYS.length === 10,
      String(STRATEGY_CATEGORY_KEYS.length)
    )
  );

  checks.push(
    check(
      "K_no_recommendation_forbidden",
      "No recommendation or ranking scope",
      STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES.noForecasting === true &&
        STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES.noStrategyRanking === true &&
        STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES.historicalEvidenceOnly === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "L_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(STRATEGY_LEARNING_ENGINE_SELF_MANIFEST).valid === true,
      STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "M_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/strategyLearningEngine.ts",
        allowedFiles: STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "strategyLearningEngine.ts"
    )
  );

  checks.push(
    check(
      "N_registry_list",
      "Strategy registry listing",
      getStrategies(WORKSPACE).length === 1,
      String(getStrategies(WORKSPACE).length)
    )
  );

  checks.push(
    check(
      "O_immutable_outputs",
      "Immutable strategy outputs",
      learned !== undefined && Object.isFrozen(learned) && learned.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "P_registry_snapshot",
      "Registry snapshot",
      getStrategyRegistrySnapshot().strategyCount >= 1,
      String(getStrategyRegistrySnapshot().strategyCount)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/6",
    contractVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const StrategyLearningEngineRunner = Object.freeze({
  runStrategyLearningCertification,
  resetStrategyLearningEnginePlatformForTests,
});
