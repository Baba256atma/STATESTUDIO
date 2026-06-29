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
import { OUTCOME_CATEGORY_KEYS, OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION } from "./outcomeLearningEngineConstants.ts";
import {
  getOutcomes,
  initializeOutcomeLearningEngine,
  learnHistoricalOutcomes,
  outcomeExists,
  OUTCOME_LEARNING_ENGINE_SELF_MANIFEST,
  registerOutcome,
  resetOutcomeLearningEngineForTests,
  validateExecutiveOutcome,
} from "./outcomeLearningEngine.ts";
import { runOutcomeLearningCertification, resetOutcomeLearningEnginePlatformForTests } from "./outcomeLearningEngineRunner.ts";
import type { HistoricalOutcomeRecordInput } from "./outcomeLearningEngineTypes.ts";
import { validateHistoricalOutcomeRecordInput } from "./outcomeLearningEngineValidation.ts";

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

function profile(suffix: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: `scenario-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand market share",
    strategyChain: Object.freeze([
      "Increase Marketing Budget",
      "Sales Increased",
      "Profit Increased",
      "Risk Stable",
    ]),
    objectTypes: Object.freeze(["campaign"]),
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

function setupPatternAndSimilarity() {
  const patterns = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingCertScenario("001"), marketingCertScenario("002")]),
      extractionTimestamp: FIXED_TIME,
      patternNamePrefix: "Marketing Expansion",
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
  return { patternId, similarityResultId };
}

function outcomeRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string
): HistoricalOutcomeRecordInput {
  return Object.freeze({
    scenarioId: `scenario-${suffix}`,
    workspaceId: WORKSPACE,
    businessGoal: "Expand market share",
    finalOutcomeCategory: "strong_success",
    kpiChangeSummary: "Revenue increased 18% with stable margins.",
    riskChangeSummary: "Risk profile remained stable.",
    decisionSummary: "Approved marketing expansion budget.",
    relatedPatternIds: Object.freeze([patternId]),
    relatedSimilarityResultIds: Object.freeze([similarityResultId]),
    decisionIds: Object.freeze([`decision-${suffix}`]),
    journalEntryIds: Object.freeze([`journal-${suffix}`]),
    timelineReferences: Object.freeze([`timeline-${suffix}`]),
    confidenceVersion: "APP-9/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-7", "APP-8", "APP-9", "APP-10/2", "APP-10/3"]),
    recordedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetOutcomeLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(FIXED_TIME);
  initializePatternExtractionEngine(FIXED_TIME);
  initializeSimilarityEngine(FIXED_TIME);
  initializeOutcomeLearningEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(OUTCOME_LEARNING_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/outcomeLearningEngine.ts",
    allowedFiles: OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("learns historical outcomes from certified records", () => {
  const { patternId, similarityResultId } = setupPatternAndSimilarity();
  const result = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.learnedOutcomes.length, 1);
  const learned = result.learnedOutcomes[0];
  assert.ok(learned);
  assert.equal(learned.outcome.finalOutcomeCategory, "strong_success");
  assert.equal(learned.outcome.relatedScenarioIds.length, 2);
  assert.equal(validateExecutiveOutcome(learned).valid, true);
  assert.equal(Object.isFrozen(learned), true);
});

test("aggregates evidence with complete provenance", () => {
  const { patternId, similarityResultId } = setupPatternAndSimilarity();
  const result = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedOutcomes[0];
  assert.ok(learned);
  assert.ok(learned.evidence.length >= 2);
  assert.equal(learned.outcome.provenance.patternIds.includes(patternId), true);
  assert.equal(learned.outcome.provenance.similarityResultIds.includes(similarityResultId), true);
  assert.equal(learned.statistics.totalScenarios, 2);
});

test("registers outcomes in immutable registry", () => {
  const { patternId, similarityResultId } = setupPatternAndSimilarity();
  learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const outcomes = getOutcomes(WORKSPACE);
  assert.equal(outcomes.length, 1);
  assert.equal(outcomeExists(outcomes[0]!.outcome.outcomeId), true);
});

test("rejects duplicate outcome registration", () => {
  const { patternId, similarityResultId } = setupPatternAndSimilarity();
  const result = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: FIXED_TIME,
    })
  );
  const learned = result.learnedOutcomes[0];
  assert.ok(learned);
  assert.equal(registerOutcome(learned).success, false);
});

test("rejects broken pattern references", () => {
  const { similarityResultId } = setupPatternAndSimilarity();
  const result = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([outcomeRecord("001", "missing-pattern", similarityResultId)]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-10:1 through APP-10:3 before learning", () => {
  resetCrossScenarioLearningPlatformForTests();
  resetPatternExtractionEngineForTests();
  resetSimilarityEngineForTests();
  resetOutcomeLearningEngineForTests();
  initializeOutcomeLearningEngine(FIXED_TIME);
  const result = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([]),
      learningTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("validates historical outcome record input", () => {
  assert.equal(
    validateHistoricalOutcomeRecordInput(
      Object.freeze({
        scenarioId: "scenario-001",
        workspaceId: WORKSPACE,
        businessGoal: "Expand market share",
        finalOutcomeCategory: "strong_success",
        kpiChangeSummary: "Revenue up",
        riskChangeSummary: "Stable",
        decisionSummary: "Approved",
        relatedPatternIds: Object.freeze([]),
        relatedSimilarityResultIds: Object.freeze([]),
        decisionIds: Object.freeze(["decision-001"]),
        journalEntryIds: Object.freeze(["journal-001"]),
        timelineReferences: Object.freeze(["timeline-001"]),
        sourceApps: Object.freeze(["APP-5"]),
      })
    ).valid,
    false
  );
});

test("exports outcome categories and contract version", () => {
  assert.equal(OUTCOME_CATEGORY_KEYS.length, 6);
  assert.equal(OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION, "APP-10/4");
});

test("runs outcome learning engine certification", () => {
  const result = runOutcomeLearningCertification(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 13);
  assert.equal(result.phase, "APP-10/4");
});
