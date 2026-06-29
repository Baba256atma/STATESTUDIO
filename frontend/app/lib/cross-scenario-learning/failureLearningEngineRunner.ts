/**
 * APP-10:5 — Failure Learning Engine certification runner.
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
  FAILURE_CATEGORY_KEYS,
  FAILURE_FACTOR_KEYS,
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES,
} from "./failureLearningEngineConstants.ts";
import {
  failureExists,
  getFailures,
  initializeFailureLearningEngine,
  isFailureLearningEngineInitialized,
  learnHistoricalFailures,
  FAILURE_LEARNING_ENGINE_SELF_MANIFEST,
  registerFailure,
  resetFailureLearningEngineForTests,
} from "./failureLearningEngine.ts";
import { getFailureRegistrySnapshot } from "./failureLearningEngineRegistry.ts";
import type {
  FailureLearningCertificationCheck,
  FailureLearningCertificationResult,
  HistoricalFailureRecordInput,
} from "./failureLearningEngineTypes.ts";
import { validateExecutiveFailure } from "./failureLearningEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-failure-learning-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): FailureLearningCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function failedCertScenario(suffix: string): CertifiedCompletedScenarioInput {
  return Object.freeze({
    scenarioId: `scenario-failed-${suffix}`,
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
    scenarioId: `scenario-failed-${suffix}`,
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
    scenarioId: `scenario-failed-${suffix}`,
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
    scenarioId: `scenario-failed-${suffix}`,
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

export function resetFailureLearningEnginePlatformForTests(): void {
  resetFailureLearningEngineForTests();
  resetOutcomeLearningEngineForTests();
  resetSimilarityEngineForTests();
  resetPatternExtractionEngineForTests();
  resetCrossScenarioLearningPlatformForTests();
}

export function runFailureLearningCertification(timestamp: string = FIXED_TIME): FailureLearningCertificationResult {
  resetFailureLearningEnginePlatformForTests();
  buildCrossScenarioLearningFoundation(timestamp);
  initializePatternExtractionEngine(timestamp);
  initializeSimilarityEngine(timestamp);
  initializeOutcomeLearningEngine(timestamp);
  initializeFailureLearningEngine(timestamp);

  const checks: FailureLearningCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Failure learning engine initialized",
      isFailureLearningEngineInitialized() === true,
      FAILURE_LEARNING_ENGINE_CONTRACT_VERSION
    )
  );

  const patternExtraction = extractExecutivePatterns(
    Object.freeze({
      workspaceId: WORKSPACE,
      scenarios: Object.freeze([failedCertScenario("001"), failedCertScenario("002")]),
      extractionTimestamp: timestamp,
      patternNamePrefix: "Market Expansion Failure",
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

  const learning = learnHistoricalFailures(
    Object.freeze({
      workspaceId: WORKSPACE,
      records: Object.freeze([
        failureRecord("001", patternId, similarityResultId, outcomeId),
        failureRecord("002", patternId, similarityResultId, outcomeId),
      ]),
      learningTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "B_failure_learning",
      "Historical failure learning",
      learning.success === true && learning.learnedFailures.length === 1,
      learning.reason
    )
  );

  const learned = learning.learnedFailures[0];
  checks.push(
    check(
      "C_failure_contract",
      "Executive failure contract valid",
      learned !== undefined && validateExecutiveFailure(learned).valid === true,
      learned?.failure.failureId ?? "missing"
    )
  );

  checks.push(
    check(
      "D_provenance_complete",
      "Provenance complete",
      learned !== undefined &&
        learned.failure.provenance.scenarioIds.length === 2 &&
        learned.failure.provenance.outcomeIds.includes(outcomeId),
      String(learned?.failure.provenance.scenarioIds.length ?? 0)
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
      "F_failure_factors",
      "Failure factors captured",
      learned !== undefined && learned.failure.failureFactors.length >= 2,
      String(learned?.failure.failureFactors.length ?? 0)
    )
  );

  checks.push(
    check(
      "G_registry_register",
      "Failure registry registration",
      learned !== undefined && failureExists(learned.failure.failureId) === true,
      learned?.failure.failureId ?? "missing"
    )
  );

  if (learned) {
    checks.push(
      check(
        "H_duplicate_prevention",
        "Duplicate failure prevention",
        registerFailure(learned).success === false,
        "duplicate rejected"
      )
    );
  }

  checks.push(
    check(
      "I_failure_categories",
      "Failure categories declared",
      FAILURE_CATEGORY_KEYS.length === 9,
      String(FAILURE_CATEGORY_KEYS.length)
    )
  );

  checks.push(
    check(
      "J_failure_factors_declared",
      "Failure factor keys declared",
      FAILURE_FACTOR_KEYS.length === 8,
      String(FAILURE_FACTOR_KEYS.length)
    )
  );

  checks.push(
    check(
      "K_no_prediction_forbidden",
      "No prediction or mitigation scope",
      FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES.noForecasting === true &&
        FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES.noMitigationAdvice === true &&
        FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES.historicalEvidenceOnly === true,
      "forbidden scope"
    )
  );

  checks.push(
    check(
      "L_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(FAILURE_LEARNING_ENGINE_SELF_MANIFEST).valid === true,
      FAILURE_LEARNING_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "M_architecture_boundary",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/failureLearningEngine.ts",
        allowedFiles: FAILURE_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: FAILURE_LEARNING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "failureLearningEngine.ts"
    )
  );

  checks.push(
    check(
      "N_registry_list",
      "Failure registry listing",
      getFailures(WORKSPACE).length === 1,
      String(getFailures(WORKSPACE).length)
    )
  );

  checks.push(
    check(
      "O_immutable_outputs",
      "Immutable failure outputs",
      learned !== undefined && Object.isFrozen(learned) && learned.readOnly === true,
      "immutable"
    )
  );

  checks.push(
    check(
      "P_registry_snapshot",
      "Registry snapshot",
      getFailureRegistrySnapshot().failureCount >= 1,
      String(getFailureRegistrySnapshot().failureCount)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/5",
    contractVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const FailureLearningEngineRunner = Object.freeze({
  runFailureLearningCertification,
  resetFailureLearningEnginePlatformForTests,
});
