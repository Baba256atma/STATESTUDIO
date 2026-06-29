/**
 * APP-10:4 — Outcome Learning Engine certification runner.
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
import { OUTCOME_CATEGORY_KEYS, OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION, OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES } from "./outcomeLearningEngineConstants.ts";
import {
  getOutcomes,
  initializeOutcomeLearningEngine,
  isOutcomeLearningEngineInitialized,
  learnHistoricalOutcomes,
  outcomeExists,
  OUTCOME_LEARNING_ENGINE_SELF_MANIFEST,
  registerOutcome,
  resetOutcomeLearningEngineForTests,
} from "./outcomeLearningEngine.ts";
import { getOutcomeRegistrySnapshot } from "./outcomeLearningEngineRegistry.ts";
import type {
  HistoricalOutcomeRecordInput,
  OutcomeLearningCertificationCheck,
  OutcomeLearningCertificationResult,
} from "./outcomeLearningEngineTypes.ts";
import { validateExecutiveOutcome } from "./outcomeLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-outcome-learning-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): OutcomeLearningCertificationCheck {
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

function profile(suffix: string): ScenarioSimilarityProfile {
  return Object.freeze({
    scenarioId: `scenario-marketing-${suffix}`,
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

function outcomeRecord(
  suffix: string,
  patternId: string,
  similarityResultId: string
): HistoricalOutcomeRecordInput {
  return Object.freeze({
    scenarioId: `scenario-marketing-${suffix}`,
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

export function resetOutcomeLearningEnginePlatformForTests(): void {
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runOutcomeLearningCertification(timestamp: string = FIXED_TIME): OutcomeLearningCertificationResult {
  resetOutcomeLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);
  initializeSimilarityEngine(timestamp);
  initializeOutcomeLearningEngine(timestamp);

  const checks: OutcomeLearningCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Outcome learning engine initialized",
      isOutcomeLearningEngineInitialized() === true,
      OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION
    )
  );

  const patternExtraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([marketingCertScenario("001"), marketingCertScenario("002")]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Marketing Expansion",
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

  const learning = learnHistoricalOutcomes(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        outcomeRecord("001", patternId, similarityResultId),
        outcomeRecord("002", patternId, similarityResultId),
      ]),
      learningTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "B_outcome_learning",
      "Historical outcome learning",
      learning.success === true && learning.learnedOutcomes.length === 1,
      learning.reason
    )
  );

  const learned = learning.learnedOutcomes[0];
  checks.push(
    check(
      "C_outcome_contract",
      "Executive outcome contract valid",
      learned !== undefined && validateExecutiveOutcome(learned).valid === true,
      learned?.outcome.outcomeId ?? "missing"
    )
  );

  checks.push(
    check(
      "D_provenance_complete",
      "Provenance complete",
      learned !== undefined &&
        learned.outcome.provenance.scenarioIds.length === 2 &&
        learned.outcome.provenance.patternIds.includes(patternId),
      String(learned?.outcome.provenance.scenarioIds.length ?? 0)
    )
  );

  checks.push(
    check(
      "E_evidence_aggregation",
      "Evidence aggregation",
      learned !== undefined && learned.evidence.length >= 2,
      String(learned?.evidence.length ?? 0)
    )
  );

  checks.push(
    check(
      "F_registry_register",
      "Outcome registry registration",
      learned !== undefined && outcomeExists(learned.outcome.outcomeId) === true,
      learned?.outcome.outcomeId ?? "missing"
    )
  );

  if (learned) {
    checks.push(
      check(
        "G_duplicate_prevention",
        "Duplicate outcome prevention",
        registerOutcome(learned).success === false,
        "duplicate rejected"
      )
    );
  }

  checks.push(
    check(
      "H_outcome_categories",
      "Outcome categories declared",
      OUTCOME_CATEGORY_KEYS.length === 6,
      String(OUTCOME_CATEGORY_KEYS.length)
    )
  );

  checks.push(
    check(
      "I_no_prediction_forbidden",
      "No prediction or recommendation scope",
      OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES.noForecasting === true &&
        OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES.noRecommendationEngine === true &&
        OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES.historicalEvidenceOnly === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "J_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(OUTCOME_LEARNING_ENGINE_SELF_MANIFEST).valid === true,
      OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "K_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/outcomeLearningEngine.ts",
        allowedFiles: OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "outcomeLearningEngine.ts"
    )
  );

  checks.push(
    check(
      "L_registry_list",
      "Outcome registry listing",
      getOutcomes(WORKSPACE).length === 1,
      String(getOutcomes(WORKSPACE).length)
    )
  );

  checks.push(
    check(
      "M_immutable_outputs",
      "Immutable outcome outputs",
      learned !== undefined && Object.isFrozen(learned) && learned.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "N_registry_snapshot",
      "Registry snapshot",
      getOutcomeRegistrySnapshot().outcomeCount >= 1,
      String(getOutcomeRegistrySnapshot().outcomeCount)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/4",
    contractVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const OutcomeLearningEngineRunner = Object.freeze({
  runOutcomeLearningCertification,
  resetOutcomeLearningEnginePlatformForTests,
});
