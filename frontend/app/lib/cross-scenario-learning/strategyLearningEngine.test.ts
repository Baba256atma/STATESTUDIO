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
  STRATEGY_CATEGORY_KEYS,
  STRATEGY_CONDITION_KEYS,
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
} from "./strategyLearningEngineConstants.ts";
import {
  getStrategies,
  initializeStrategyLearningEngine,
  learnHistoricalStrategies,
  registerStrategy,
  resetStrategyLearningEngineForTests,
  strategyExists,
  STRATEGY_LEARNING_ENGINE_SELF_MANIFEST,
  validateExecutiveStrategy,
} from "./strategyLearningEngine.ts";
import {
  resetStrategyLearningEnginePlatformForTests,
  runStrategyLearningCertification,
} from "./strategyLearningEngineRunner.ts";
import type { HistoricalStrategyRecordInput } from "./strategyLearningEngineTypes.ts";
import { validateHistoricalStrategyRecordInput } from "./strategyLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-strategy-001";

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

function setupFullStack() {
  const patterns = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([failedCertScenario("001"), failedCertScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      patternNamePrefix: "Market Expansion Strategy",
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
  return { patternId, similarityResultId, outcomeId, failureId };
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

test.beforeEach(() => {
  resetStrategyLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
  initializeSimilarityEngine(FIXED_TIME);
  initializeOutcomeLearningEngine(FIXED_TIME);
  initializeFailureLearningEngine(FIXED_TIME);
  initializeStrategyLearningEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(STRATEGY_LEARNING_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/strategyLearningEngine.ts",
    allowedFiles: STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("learns historical strategies from certified records", () => {
  const { patternId, similarityResultId, outcomeId, failureId } = setupFullStack();
  const result = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.learnedStrategies.length, 1);
  const learned = result.learnedStrategies[0];
  assert.ok(learned);
  assert.equal(learned.strategy.strategyCategory, "growth_strategy");
  assert.equal(learned.strategy.relatedScenarioIds.length, 2);
  assert.equal(validateExecutiveStrategy(learned).valid, true);
  assert.equal(Object.isFrozen(learned), true);
});

test("links outcomes and failures with business conditions", () => {
  const { patternId, similarityResultId, outcomeId, failureId } = setupFullStack();
  const result = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedStrategies[0];
  assert.ok(learned);
  assert.ok(learned.outcomeLinks.length >= 2);
  assert.ok(learned.failureLinks.length >= 2);
  assert.equal(learned.strategy.provenance.outcomeIds.includes(outcomeId), true);
  assert.equal(learned.strategy.provenance.failureIds.includes(failureId), true);
  assert.ok(learned.strategy.businessConditions.length >= STRATEGY_CONDITION_KEYS.length);
  assert.ok(learned.strategy.riskEvidence.length >= 1);
});

test("registers strategies in immutable registry", () => {
  const { patternId, similarityResultId, outcomeId, failureId } = setupFullStack();
  learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const strategies = getStrategies(WORKSPACE);
  assert.equal(strategies.length, 1);
  assert.equal(strategyExists(strategies[0]!.strategy.strategyId), true);
});

test("rejects duplicate strategy registration", () => {
  const { patternId, similarityResultId, outcomeId, failureId } = setupFullStack();
  const result = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, failureId),
        strategyRecord("002", patternId, similarityResultId, outcomeId, failureId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedStrategies[0];
  assert.ok(learned);
  assert.equal(registerStrategy(learned).success, false);
});

test("rejects broken failure references", () => {
  const { patternId, similarityResultId, outcomeId } = setupFullStack();
  const result = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        strategyRecord("001", patternId, similarityResultId, outcomeId, "missing-failure"),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-10:1 through APP-10:5 before learning", () => {
  resetStrategyLearningEnginePlatformForTests();
  resetFailureLearningEngineForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
  initializeStrategyLearningEngine(FIXED_TIME);
  const result = learnHistoricalStrategies(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("validates historical strategy record input", () => {
  assert.equal(
    validateHistoricalStrategyRecordInput(
      Object.freeze({
        scenarioId: "scenario-strategy-001",
        workspaceId: WORKSPACE,
        strategyName: "Increase Marketing Budget",
        strategyCategory: "growth_strategy",
        businessGoal: "Expand into new market",
        workspaceDomain: "marketing",
        timelinePhase: "execution",
        kpiDirection: "decrease",
        riskProfile: "high",
        outcomeSummary: "Underperformed",
        failureSummary: "Failed",
        relatedPatternIds: Object.freeze([]),
        relatedSimilarityResultIds: Object.freeze([]),
        relatedOutcomeIds: Object.freeze([]),
        relatedFailureIds: Object.freeze([]),
        decisionIds: Object.freeze(["decision-strategy-001"]),
        journalEntryIds: Object.freeze(["journal-strategy-001"]),
        timelineReferences: Object.freeze(["timeline-strategy-001"]),
        sourceApps: Object.freeze(["APP-5"]),
      })
    ).valid,
    false
  );
});

test("exports strategy categories and contract version", () => {
  assert.equal(STRATEGY_CATEGORY_KEYS.length, 10);
  assert.equal(STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION, "APP-10/6");
});

test("runs strategy learning engine certification", () => {
  const result = runStrategyLearningCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 15);
  assert.equal(result.phase, "APP-10/6");
});
