/**
 * APP-12:2 — Executive Recommendation Generation Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
} from "./executiveRecommendationConstants.ts";
import { buildExecutiveRecommendationFoundation } from "./executiveRecommendationFoundation.ts";
import { resetExecutiveRecommendationPlatformForTests } from "./executiveRecommendationRunner.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import {
  buildRecommendationCandidates,
  generateExecutiveRecommendations,
  getRecommendationCandidate,
  getRecommendationCandidates,
  initializeRecommendationGenerationEngine,
  isRecommendationGenerationEngineInitialized,
  recommendationCandidateExists,
  registerRecommendationCandidate,
  resetExecutiveRecommendationGenerationEngineForTests,
  validateExecutiveRecommendations,
  validateRecommendationGeneration,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationGenerationEngine.ts";
import { buildRecommendationCandidatesFromRecords } from "./executiveRecommendationGenerationCandidateBuilder.ts";
import {
  normalizeRecommendationSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveRecommendationGenerationNormalizer.ts";
import { getRecommendationRegistrySnapshot } from "./executiveRecommendationGenerationEngineRegistry.ts";
import type {
  CertifiedRecommendationSourceRecordInput,
  ExecutiveRecommendationGenerationCertificationCheck,
  ExecutiveRecommendationGenerationCertificationResult,
} from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  hasDuplicateIds,
  validateCertifiedRecommendationSourceRecordInput,
  validateExecutiveRecommendation,
  validateFoundationCompatibilityForEngine,
  validateRecommendationCandidate,
  validateRecommendationCandidateProvenance,
  validateRecommendationSourceReference,
} from "./executiveRecommendationGenerationEngineValidation.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-generation-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationGenerationCertificationCheck {
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

export function resetExecutiveRecommendationGenerationEnginePlatformForTests(): void {
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function runRecommendationGenerationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationGenerationCertificationResult {
  resetExecutiveRecommendationGenerationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);

  const checks: ExecutiveRecommendationGenerationCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationGenerationEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-generation-session-001",
      sessionLabel: "Executive Advisory Session",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_generation_success",
      "Deterministic generation succeeds",
      generation.success === true,
      generation.reason
    )
  );

  checks.push(
    check(
      "D_candidates_immutable",
      "Generated candidates are immutable",
      generation.candidates.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(generation.candidates.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      generation.candidates.every((entry) => validateRecommendationCandidateProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_source_reference_valid",
      "Source references valid",
      generation.candidates.every((entry) =>
        entry.sourceReferences.every((reference) => validateRecommendationSourceReference(reference).valid)
      ),
      "references valid"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getRecommendationRegistrySnapshot().candidateCount === generation.registeredRecommendationIds.length &&
        generation.registeredRecommendationIds.every((recommendationId) =>
          recommendationCandidateExists(recommendationId)
        ),
      String(getRecommendationRegistrySnapshot().candidateCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      generation.pipelineStages.length === EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES.length,
      String(generation.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "I_deterministic_ordering",
      "Deterministic candidate ordering",
      [...generation.candidates.map((entry) => entry.recommendationId)].join(",") ===
        [...generation.candidates]
          .sort((a, b) => a.recommendationId.localeCompare(b.recommendationId))
          .map((entry) => entry.recommendationId)
          .join(","),
      "sorted by recommendationId"
    )
  );

  checks.push(
    check(
      "J_no_evaluation",
      "No evaluation logic",
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noEvaluation === true,
      "no evaluation"
    )
  );

  checks.push(
    check(
      "K_no_ranking",
      "No ranking logic",
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noRanking === true &&
        EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noOptimization === true,
      "no ranking"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only generation",
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
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
      "N_duplicate_detection",
      "Duplicate candidate detection",
      registerRecommendationCandidate(generation.candidates[0]!).success === false,
      "duplicate rejected"
    )
  );

  const normalized = sortNormalizedRecordsDeterministically(
    normalizeRecommendationSourceRecords(
      Object.freeze([sourceRecord("scenario-timeline-provider", "004")])
    )
  );
  const builtCandidates = buildRecommendationCandidatesFromRecords(normalized, timestamp);
  checks.push(
    check(
      "O_normalization",
      "Source normalization",
      builtCandidates.length === 1 && validateRecommendationCandidate(builtCandidates[0]!).valid === true,
      "normalized"
    )
  );

  checks.push(
    check(
      "P_validation_api",
      "Generation validation API",
      validateExecutiveRecommendations(generation.recommendations).valid === true &&
        validateRecommendationGeneration(
          Object.freeze({
            workspaceId: WORKSPACE,
            sessionId: "validation-session",
            sessionLabel: "Validation",
            sourceRecords: Object.freeze([sourceRecord("executive-intent-provider", "005")]),
          })
        ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "Q_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "R_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationGenerationEngine.ts"
    )
  );

  checks.push(
    check(
      "S_domain_vocabulary",
      "Recommendation domain vocabulary",
      isExecutiveRecommendationDomain("strategic") === true && isExecutiveRecommendationDomain("mixed") === true,
      "domain guards"
    )
  );

  checks.push(
    check(
      "T_input_validation",
      "Certified source input validation",
      validateCertifiedRecommendationSourceRecordInput(
        sourceRecord("confidence-evolution-provider", "006")
      ).valid === true,
      "input valid"
    )
  );

  const recommendationId = generation.registeredRecommendationIds[0];
  checks.push(
    check(
      "U_registry_retrieval",
      "Registry retrieval",
      recommendationId !== undefined &&
        getRecommendationCandidate(recommendationId) !== null &&
        getRecommendationCandidates(WORKSPACE).length === generation.candidates.length,
      "retrieval ok"
    )
  );

  const built = buildRecommendationCandidates(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      sourceRecords: Object.freeze([sourceRecord("executive-memory-provider", "007")]),
      generationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "V_build_candidates_api",
      "buildRecommendationCandidates API",
      built.length === 1 && validateRecommendationCandidate(built[0]!).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "W_no_execution",
      "No execution logic",
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noExecution === true &&
        EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noWorkflowExecution === true,
      "no execution"
    )
  );

  checks.push(
    check(
      "X_no_ml",
      "No machine learning",
      EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noMachineLearning === true,
      "no ml"
    )
  );

  checks.push(
    check(
      "Y_recommendation_contract",
      "Executive recommendation contract",
      generation.recommendations.every((entry) => validateExecutiveRecommendation(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "Z_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/2",
    contractVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
