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
  FAILURE_CATEGORY_KEYS,
  FAILURE_FACTOR_KEYS,
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
} from "./failureLearningEngineConstants.ts";
import {
  failureExists,
  getFailures,
  initializeFailureLearningEngine,
  learnHistoricalFailures,
  FAILURE_LEARNING_ENGINE_SELF_MANIFEST,
  registerFailure,
  resetFailureLearningEngineForTests,
  validateExecutiveFailure,
} from "./failureLearningEngine.ts";
import {
  resetFailureLearningEnginePlatformForTests,
  runFailureLearningCertification,
} from "./failureLearningEngineRunner.ts";
import type { HistoricalFailureRecordInput } from "./failureLearningEngineTypes.ts";
import { validateHistoricalFailureRecordInput } from "./failureLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-failure-001";

function failedCertScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-fail-${suffix}`,
    workspaceId: WORKSPACE,
    scenarioTitle: `Market Expansion Failure ${suffix}`,
    patternCategory: "growth",
    patternType: "strategy_outcome",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Declined",
      "Profit Decreased",
      "Risk Increased",
    ]),
    decisionIds: Object.freeze([`decision-fail-${suffix}`]),
    outcomeSummary: "Profit decreased with elevated risk profile.",
    timelineReferences: Object.freeze([`timeline-fail-${suffix}`]),
    journalReferences: Object.freeze([`journal-fail-${suffix}`]),
    confidenceReferences: Object.freeze([`confidence-fail-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9"]),
  });
}

function profile(suffix: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: `scenario-fail-${suffix}`,
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
      patternNamePrefix: "Market Expansion Failure",
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
  return { patternId, similarityResultId, outcomeId };
}

function outcomeRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string
): HistoricalOutcomeRecordInput {
  return Object.freeze({
    scenarioId: `scenario-fail-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand into new market",
    finalOutcomeCategory: "critical_failure",
    kpiChangeSummary: "Revenue declined 22% with margin compression.",
    riskChangeSummary: "Risk profile escalated to elevated.",
    decisionSummary: "Market expansion budget approved but underperformed.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    decisionIds: Object.freeze([`decision-fail-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-fail-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-fail-${suffix}`]),
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
    scenarioId: `scenario-fail-${suffix}`,
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
    decisionIds: Object.freeze([`decision-fail-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-fail-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-fail-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-7", "APP-8", "APP-9", "APP-10/2", "APP-10/3", "APP-10/4"]),
    recordedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetFailureLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
  initializeSimilarityEngine(FIXED_TIME);
  initializeOutcomeLearningEngine(FIXED_TIME);
  initializeFailureLearningEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(FAILURE_LEARNING_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/failureLearningEngine.ts",
    allowedFiles: FAILURE_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: FAILURE_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("learns historical failures from certified records", () => {
  const { patternId, similarityResultId, outcomeId } = setupFullStack();
  const result = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.learnedFailures.length, 1);
  const learned = result.learnedFailures[0];
  assert.ok(learned);
  assert.equal(learned.failure.failureCategory, "strategic_failure");
  assert.equal(learned.failure.relatedScenarioIds.length, 2);
  assert.equal(validateExecutiveFailure(learned).valid, true);
  assert.equal(Object.isFrozen(learned), true);
});

test("aggregates evidence with complete provenance", () => {
  const { patternId, similarityResultId, outcomeId } = setupFullStack();
  const result = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedFailures[0];
  assert.ok(learned);
  assert.ok(learned.evidence.length >= 2);
  assert.equal(learned.failure.provenance.patternIds.includes(patternId), true);
  assert.equal(learned.failure.provenance.outcomeIds.includes(outcomeId), true);
  assert.equal(learned.failure.failureFactors.length, 2);
});

test("registers failures in immutable registry", () => {
  const { patternId, similarityResultId, outcomeId } = setupFullStack();
  learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const failures = getFailures(WORKSPACE);
  assert.equal(failures.length, 1);
  assert.equal(failureExists(failures[0]!.failure.failureId), true);
});

test("rejects duplicate failure registration", () => {
  const { patternId, similarityResultId, outcomeId } = setupFullStack();
  const result = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedFailures[0];
  assert.ok(learned);
  assert.equal(registerFailure(learned).success, false);
});

test("rejects broken outcome references", () => {
  const { patternId, similarityResultId } = setupFullStack();
  const result = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([failureRecord("001", patternId, similarityResultId, "missing-outcome")]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-10:1 through APP-10:4 before learning", () => {
  resetFailureLearningEnginePlatformForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
  initializeFailureLearningEngine(FIXED_TIME);
  const result = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("validates historical failure record input", () => {
  assert.equal(
    validateHistoricalFailureRecordInput(
      Object.freeze({
        scenarioId: "scenario-fail-001",
        workspaceId: WORKSPACE,
        businessGoal: "Expand into new market",
        failureCategory: "strategic_failure",
        failureFactorKeys: Object.freeze([]),
        failureCauses: Object.freeze([]),
        kpiImpactSummary: "Revenue down",
        riskImpactSummary: "Risk up",
        relatedPatternIds: Object.freeze([]),
        relatedSimilarityResultIds: Object.freeze([]),
        relatedOutcomeIds: Object.freeze([]),
        decisionIds: Object.freeze(["decision-fail-001"]),
        journalEntryIds: Object.freeze(["journal-fail-001"]),
        timelineReferences: Object.freeze(["timeline-fail-001"]),
        sourceApps: Object.freeze(["APP-5"]),
      })
    ).valid,
    false
  );
});

test("exports failure categories and contract version", () => {
  assert.equal(FAILURE_CATEGORY_KEYS.length, 9);
  assert.equal(FAILURE_FACTOR_KEYS.length, 8);
  assert.equal(FAILURE_LEARNING_ENGINE_CONTRACT_VERSION, "APP-10/5");
});

test("runs failure learning engine certification", () => {
  const result = runFailureLearningCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 15);
  assert.equal(result.phase, "APP-10/5");
});
