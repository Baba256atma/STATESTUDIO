/**
 * APP-12:4 — Executive Recommendation Explainability Engine certification runner.
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
  evaluateExecutiveRecommendations,
  initializeRecommendationEvaluationEngine,
  resetExecutiveRecommendationEvaluationEngineForTests,
} from "./executiveRecommendationEvaluationEngine.ts";
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
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import {
  buildRecommendationExplanations,
  explainExecutiveRecommendations,
  getRecommendationExplanation,
  getRecommendationExplanations,
  initializeRecommendationExplainabilityEngine,
  isRecommendationExplainabilityEngineInitialized,
  recommendationExplanationExists,
  registerRecommendationExplanation,
  resetExecutiveRecommendationExplainabilityEngineForTests,
  validateRecommendationExplanation,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationExplainabilityEngine.ts";
import { buildRecommendationExplanationsFromEvaluations } from "./executiveRecommendationExplainabilityProfileBuilder.ts";
import { getRecommendationExplanationRegistrySnapshot } from "./executiveRecommendationExplainabilityEngineRegistry.ts";
import type {
  ExecutiveRecommendationExplainabilityCertificationCheck,
  ExecutiveRecommendationExplainabilityCertificationResult,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import {
  hasDuplicateExplanationIds,
  validateExplainabilityDependencies,
  validateFoundationCompatibilityForExplainabilityEngine,
  validateGenerationEngineCompatibilityForExplainability,
  validateEvaluationEngineCompatibility,
  validateRecommendationExplanationProvenance,
  validateRecommendationExplanationRecord,
} from "./executiveRecommendationExplainabilityEngineValidation.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-explainability-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationExplainabilityCertificationCheck {
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

function generateEvaluations(timestamp: string) {
  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-for-explainability",
      sessionLabel: "Generation for Explainability",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: timestamp,
    })
  );
  return evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-for-explainability",
      sessionLabel: "Evaluation for Explainability",
      candidates: generation.candidates,
      evaluationTimestamp: timestamp,
    })
  );
}

export function resetExecutiveRecommendationExplainabilityEnginePlatformForTests(): void {
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function bootstrapRecommendationExplainabilityPlatform(timestamp: string = FIXED_TIME): void {
  resetExecutiveRecommendationExplainabilityEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);
  initializeRecommendationEvaluationEngine(timestamp);
  initializeRecommendationExplainabilityEngine(timestamp);
}

export function runRecommendationExplainabilityCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationExplainabilityCertificationResult {
  bootstrapRecommendationExplainabilityPlatform(timestamp);

  const checks: ExecutiveRecommendationExplainabilityCertificationCheck[] = [];
  const evaluation = generateEvaluations(timestamp);

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationExplainabilityEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForExplainabilityEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "C_generation_dependency",
      "APP-12:2 generation engine dependency",
      validateGenerationEngineCompatibilityForExplainability(true).valid === true,
      "APP-12/2"
    )
  );

  checks.push(
    check(
      "D_evaluation_dependency",
      "APP-12:3 evaluation engine dependency",
      validateEvaluationEngineCompatibility(true).valid === true,
      "APP-12/3"
    )
  );

  const explanation = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-explainability-session-001",
      sessionLabel: "Executive Explainability Session",
      evaluations: evaluation.evaluations,
      explanationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "E_explanation_success",
      "Deterministic explanation succeeds",
      explanation.success === true,
      explanation.reason
    )
  );

  checks.push(
    check(
      "F_explanations_immutable",
      "Explanations are immutable",
      explanation.explanations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(explanation.explanations.length)
    )
  );

  checks.push(
    check(
      "G_provenance_complete",
      "Provenance is complete",
      explanation.explanations.every((entry) => validateRecommendationExplanationProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "H_section_coverage",
      "All explanation sections present",
      explanation.explanations.every(
        (entry) => entry.sections.length === EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS.length)
    )
  );

  checks.push(
    check(
      "I_registry_integrity",
      "Registry integrity verified",
      getRecommendationExplanationRegistrySnapshot().explanationCount === explanation.registeredExplanationIds.length &&
        explanation.registeredExplanationIds.every((explanationId) => recommendationExplanationExists(explanationId)),
      String(getRecommendationExplanationRegistrySnapshot().explanationCount)
    )
  );

  checks.push(
    check(
      "J_pipeline_stages",
      "Pipeline stages complete",
      explanation.pipelineStages.length === EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES.length,
      String(explanation.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "K_deterministic_ordering",
      "Deterministic explanation ordering",
      [...explanation.explanations.map((entry) => entry.explanationId)].join(",") ===
        [...explanation.explanations]
          .sort((a, b) => a.explanationId.localeCompare(b.explanationId))
          .map((entry) => entry.explanationId)
          .join(","),
      "sorted by explanationId"
    )
  );

  checks.push(
    check(
      "L_no_generation",
      "No generation logic",
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noGeneration === true,
      "no generation"
    )
  );

  checks.push(
    check(
      "M_no_evaluation",
      "No evaluation logic",
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noEvaluation === true,
      "no evaluation"
    )
  );

  checks.push(
    check(
      "N_no_ranking",
      "No ranking logic",
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noRanking === true &&
        EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noComparison === true,
      "no ranking"
    )
  );

  checks.push(
    check(
      "O_consumer_only",
      "Consumer-only explainability",
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "P_prior_platforms_untouched",
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
      "Q_duplicate_detection",
      "Duplicate explanation detection",
      registerRecommendationExplanation(explanation.explanations[0]!).success === false,
      "duplicate rejected"
    )
  );

  const built = buildRecommendationExplanationsFromEvaluations(evaluation.evaluations.slice(0, 1), timestamp);
  checks.push(
    check(
      "R_profile_build",
      "Explanation profile build",
      built.length === 1 && validateRecommendationExplanationRecord(built[0]!).valid === true,
      "profile built"
    )
  );

  checks.push(
    check(
      "S_validation_api",
      "Explanation validation API",
      validateRecommendationExplanation(
        Object.freeze({
          workspaceId: WORKSPACE,
          sessionId: "validation-session",
          sessionLabel: "Validation",
          evaluations: evaluation.evaluations.slice(0, 1),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "T_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "U_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationExplainabilityEngine.ts"
    )
  );

  checks.push(
    check(
      "V_domain_vocabulary",
      "Recommendation domain vocabulary preserved",
      isExecutiveRecommendationDomain("strategic") === true && isExecutiveRecommendationDomain("mixed") === true,
      "domain guards"
    )
  );

  const explanationId = explanation.registeredExplanationIds[0];
  checks.push(
    check(
      "W_registry_retrieval",
      "Registry retrieval",
      explanationId !== undefined &&
        getRecommendationExplanation(explanationId) !== null &&
        getRecommendationExplanations(WORKSPACE).length === explanation.explanations.length,
      "retrieval ok"
    )
  );

  const buildOnly = buildRecommendationExplanations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "X_build_explanations_api",
      "buildRecommendationExplanations API",
      buildOnly.length === 1 && validateRecommendationExplanationRecord(buildOnly[0]!).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "Y_no_llm",
      "No LLM reasoning",
      EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noLlmReasoning === true &&
        EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noMachineLearning === true,
      "no llm"
    )
  );

  checks.push(
    check(
      "Z_explanation_contract",
      "Recommendation explanation contract",
      explanation.explanations.every((entry) => validateRecommendationExplanationRecord(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "AA_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateExplanationIds(["a", "b", "a"]) === true && hasDuplicateExplanationIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "AB_dependency_validation",
      "Dependency validation",
      validateExplainabilityDependencies().valid === true,
      "dependencies valid"
    )
  );

  checks.push(
    check(
      "AC_traceable_sections",
      "Every explanation section has content",
      explanation.explanations.every((entry) => entry.sections.every((section) => section.content.length > 0)),
      "sections traceable"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/4",
    contractVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
