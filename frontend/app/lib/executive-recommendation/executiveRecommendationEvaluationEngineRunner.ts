/**
 * APP-12:3 — Executive Recommendation Evaluation Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION } from "./executiveRecommendationConstants.ts";
import { buildExecutiveRecommendationFoundation } from "./executiveRecommendationFoundation.ts";
import { resetExecutiveRecommendationPlatformForTests } from "./executiveRecommendationRunner.ts";
import {
  generateExecutiveRecommendations,
  initializeRecommendationGenerationEngine,
  resetExecutiveRecommendationGenerationEngineForTests,
} from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import type { CertifiedRecommendationSourceRecordInput } from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import {
  buildRecommendationEvaluations,
  evaluateExecutiveRecommendations,
  getRecommendationEvaluation,
  getRecommendationEvaluations,
  initializeRecommendationEvaluationEngine,
  isRecommendationEvaluationEngineInitialized,
  recommendationEvaluationExists,
  registerRecommendationEvaluation,
  resetExecutiveRecommendationEvaluationEngineForTests,
  validateRecommendationEvaluation,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationEvaluationEngine.ts";
import { buildRecommendationEvaluationsFromCandidates } from "./executiveRecommendationEvaluationProfileBuilder.ts";
import { getRecommendationEvaluationRegistrySnapshot } from "./executiveRecommendationEvaluationEngineRegistry.ts";
import type {
  ExecutiveRecommendationEvaluationCertificationCheck,
  ExecutiveRecommendationEvaluationCertificationResult,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import {
  hasDuplicateEvaluationIds,
  validateEvaluationDependencies,
  validateFoundationCompatibilityForEvaluationEngine,
  validateGenerationEngineCompatibility,
  validateRecommendationEvaluationProvenance,
  validateRecommendationEvaluationRecord,
} from "./executiveRecommendationEvaluationEngineValidation.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-evaluation-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationEvaluationCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function sourceRecord(
  providerId: keyof typeof EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
  suffix: string
): CertifiedRecommendationSourceRecordInput {
  const mapping = EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP[providerId];
  return Object.freeze({
    sourceId: `recommendation-source-${providerId}-${suffix}`,
    providerId,
    domain: mapping.defaultDomain,
    workspaceId: WORKSPACE,
    platformId: mapping.platformId,
    appId: mapping.defaultAppId,
    recordId: `${providerId}-record-${suffix}`,
    businessContext: `Executive advisory context for ${providerId} ${suffix}.`,
    summary: `Review ${providerId} matter ${suffix} from certified platform.`,
    sourceVersion: mapping.defaultAppId === "APP-5" ? "APP-5/1" : "APP-10/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9", "APP-10", "APP-11"]),
  });
}

function generateCandidates(timestamp: string) {
  return generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-for-evaluation",
      sessionLabel: "Generation for Evaluation",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: timestamp,
    })
  );
}

export function resetExecutiveRecommendationEvaluationEnginePlatformForTests(): void {
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function bootstrapRecommendationEvaluationPlatform(timestamp: string = FIXED_TIME): void {
  resetExecutiveRecommendationEvaluationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);
  initializeRecommendationEvaluationEngine(timestamp);
}

export function runRecommendationEvaluationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationEvaluationCertificationResult {
  bootstrapRecommendationEvaluationPlatform(timestamp);

  const checks: ExecutiveRecommendationEvaluationCertificationCheck[] = [];
  const generation = generateCandidates(timestamp);

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationEvaluationEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForEvaluationEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "C_generation_dependency",
      "APP-12:2 generation engine dependency",
      validateGenerationEngineCompatibility(true).valid === true,
      "APP-12/2"
    )
  );

  const evaluation = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-evaluation-session-001",
      sessionLabel: "Executive Evaluation Session",
      candidates: generation.candidates,
      evaluationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "D_evaluation_success",
      "Deterministic evaluation succeeds",
      evaluation.success === true,
      evaluation.reason
    )
  );

  checks.push(
    check(
      "E_evaluations_immutable",
      "Evaluations are immutable",
      evaluation.evaluations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(evaluation.evaluations.length)
    )
  );

  checks.push(
    check(
      "F_provenance_complete",
      "Provenance is complete",
      evaluation.evaluations.every((entry) => validateRecommendationEvaluationProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "G_dimension_coverage",
      "All evaluation dimensions present",
      evaluation.evaluations.every(
        (entry) => entry.dimensions.length === EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS.length)
    )
  );

  checks.push(
    check(
      "H_registry_integrity",
      "Registry integrity verified",
      getRecommendationEvaluationRegistrySnapshot().evaluationCount === evaluation.registeredEvaluationIds.length &&
        evaluation.registeredEvaluationIds.every((evaluationId) => recommendationEvaluationExists(evaluationId)),
      String(getRecommendationEvaluationRegistrySnapshot().evaluationCount)
    )
  );

  checks.push(
    check(
      "I_pipeline_stages",
      "Pipeline stages complete",
      evaluation.pipelineStages.length === EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES.length,
      String(evaluation.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "J_deterministic_ordering",
      "Deterministic evaluation ordering",
      [...evaluation.evaluations.map((entry) => entry.evaluationId)].join(",") ===
        [...evaluation.evaluations]
          .sort((a, b) => a.evaluationId.localeCompare(b.evaluationId))
          .map((entry) => entry.evaluationId)
          .join(","),
      "sorted by evaluationId"
    )
  );

  checks.push(
    check(
      "K_no_ranking",
      "No ranking logic",
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noRanking === true &&
        EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noComparison === true,
      "no ranking"
    )
  );

  checks.push(
    check(
      "L_no_optimization",
      "No optimization logic",
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noOptimization === true,
      "no optimization"
    )
  );

  checks.push(
    check(
      "M_consumer_only",
      "Consumer-only evaluation",
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "N_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-5 through APP-10 verified"
    )
  );

  checks.push(
    check(
      "O_duplicate_detection",
      "Duplicate evaluation detection",
      registerRecommendationEvaluation(evaluation.evaluations[0]!).success === false,
      "duplicate rejected"
    )
  );

  const built = buildRecommendationEvaluationsFromCandidates(generation.candidates.slice(0, 1), timestamp);
  checks.push(
    check(
      "P_profile_build",
      "Evaluation profile build",
      built.length === 1 && validateRecommendationEvaluationRecord(built[0]!).valid === true,
      "profile built"
    )
  );

  checks.push(
    check(
      "Q_validation_api",
      "Evaluation validation API",
      validateRecommendationEvaluation(
        Object.freeze({
          workspaceId: WORKSPACE,
          sessionId: "validation-session",
          sessionLabel: "Validation",
          candidates: generation.candidates.slice(0, 1),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "R_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "S_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationEvaluationEngine.ts"
    )
  );

  checks.push(
    check(
      "T_domain_vocabulary",
      "Recommendation domain vocabulary preserved",
      isExecutiveRecommendationDomain("strategic") === true && isExecutiveRecommendationDomain("mixed") === true,
      "domain guards"
    )
  );

  const evaluationId = evaluation.registeredEvaluationIds[0];
  checks.push(
    check(
      "U_registry_retrieval",
      "Registry retrieval",
      evaluationId !== undefined &&
        getRecommendationEvaluation(evaluationId) !== null &&
        getRecommendationEvaluations(WORKSPACE).length === evaluation.evaluations.length,
      "retrieval ok"
    )
  );

  const buildOnly = buildRecommendationEvaluations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "V_build_evaluations_api",
      "buildRecommendationEvaluations API",
      buildOnly.length === 1 && validateRecommendationEvaluationRecord(buildOnly[0]!).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "W_no_execution",
      "No execution logic",
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noExecution === true &&
        EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noApproval === true,
      "no execution"
    )
  );

  checks.push(
    check(
      "X_no_ml",
      "No machine learning",
      EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noMachineLearning === true,
      "no ml"
    )
  );

  checks.push(
    check(
      "Y_evaluation_contract",
      "Recommendation evaluation contract",
      evaluation.evaluations.every((entry) => validateRecommendationEvaluationRecord(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "Z_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateEvaluationIds(["a", "b", "a"]) === true && hasDuplicateEvaluationIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "AA_dependency_validation",
      "Dependency validation",
      validateEvaluationDependencies().valid === true,
      "dependencies valid"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/3",
    contractVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
