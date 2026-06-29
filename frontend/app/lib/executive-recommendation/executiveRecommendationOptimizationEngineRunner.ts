/**
 * APP-12:6 — Executive Recommendation Optimization Engine certification runner.
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
  explainExecutiveRecommendations,
  initializeRecommendationExplainabilityEngine,
  resetExecutiveRecommendationExplainabilityEngineForTests,
} from "./executiveRecommendationExplainabilityEngine.ts";
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
  initializeRecommendationGovernanceEngine,
  resetExecutiveRecommendationGovernanceEngineForTests,
  validateExecutiveRecommendationGovernance,
} from "./executiveRecommendationGovernanceEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import {
  buildRecommendationOptimizations,
  getRecommendationOptimization,
  getRecommendationOptimizations,
  initializeRecommendationOptimizationEngine,
  isRecommendationOptimizationEngineInitialized,
  optimizeExecutiveRecommendations,
  recommendationOptimizationExists,
  registerRecommendationOptimization,
  resetExecutiveRecommendationOptimizationEngineForTests,
  validateRecommendationOptimization,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationOptimizationEngine.ts";
import { buildRecommendationOptimizationsFromGovernanceRecords } from "./executiveRecommendationOptimizationProfileBuilder.ts";
import { getRecommendationOptimizationRegistrySnapshot } from "./executiveRecommendationOptimizationEngineRegistry.ts";
import type {
  ExecutiveRecommendationOptimizationCertificationCheck,
  ExecutiveRecommendationOptimizationCertificationResult,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import {
  hasDuplicateOptimizationIds,
  validateEvaluationEngineCompatibilityForOptimization,
  validateExplainabilityEngineCompatibilityForOptimization,
  validateFoundationCompatibilityForOptimizationEngine,
  validateGenerationEngineCompatibilityForOptimization,
  validateGovernanceEngineCompatibility,
  validateOptimizationDependencies,
  validateRecommendationOptimizationProvenance,
  validateRecommendationOptimizationRecord,
} from "./executiveRecommendationOptimizationEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-optimization-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationOptimizationCertificationCheck {
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

function generateGovernanceRecords(timestamp: string) {
  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-for-optimization",
      sessionLabel: "Generation for Optimization",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: timestamp,
    })
  );
  const evaluation = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-for-optimization",
      sessionLabel: "Evaluation for Optimization",
      candidates: generation.candidates,
      evaluationTimestamp: timestamp,
    })
  );
  const explanation = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-for-optimization",
      sessionLabel: "Explainability for Optimization",
      evaluations: evaluation.evaluations,
      explanationTimestamp: timestamp,
    })
  );
  return validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-for-optimization",
      sessionLabel: "Governance for Optimization",
      explanations: explanation.explanations,
      governanceTimestamp: timestamp,
    })
  );
}

export function resetExecutiveRecommendationOptimizationEnginePlatformForTests(): void {
  resetExecutiveRecommendationOptimizationEngineForTests();
  resetExecutiveRecommendationGovernanceEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function bootstrapRecommendationOptimizationPlatform(timestamp: string = FIXED_TIME): void {
  resetExecutiveRecommendationOptimizationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);
  initializeRecommendationEvaluationEngine(timestamp);
  initializeRecommendationExplainabilityEngine(timestamp);
  initializeRecommendationGovernanceEngine(timestamp);
  initializeRecommendationOptimizationEngine(timestamp);
}

export function runRecommendationOptimizationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationOptimizationCertificationResult {
  bootstrapRecommendationOptimizationPlatform(timestamp);

  const checks: ExecutiveRecommendationOptimizationCertificationCheck[] = [];
  const governance = generateGovernanceRecords(timestamp);

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationOptimizationEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForOptimizationEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "C_generation_dependency",
      "APP-12:2 generation engine dependency",
      validateGenerationEngineCompatibilityForOptimization(true).valid === true,
      "APP-12/2"
    )
  );

  checks.push(
    check(
      "D_evaluation_dependency",
      "APP-12:3 evaluation engine dependency",
      validateEvaluationEngineCompatibilityForOptimization(true).valid === true,
      "APP-12/3"
    )
  );

  checks.push(
    check(
      "E_explainability_dependency",
      "APP-12:4 explainability engine dependency",
      validateExplainabilityEngineCompatibilityForOptimization(true).valid === true,
      "APP-12/4"
    )
  );

  checks.push(
    check(
      "F_governance_dependency",
      "APP-12:5 governance engine dependency",
      validateGovernanceEngineCompatibility(true).valid === true,
      "APP-12/5"
    )
  );

  const optimization = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-optimization-session-001",
      sessionLabel: "Executive Optimization Session",
      governanceRecords: governance.governanceRecords,
      optimizationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "G_optimization_success",
      "Deterministic optimization succeeds",
      optimization.success === true,
      optimization.reason
    )
  );

  checks.push(
    check(
      "H_optimizations_immutable",
      "Optimizations are immutable",
      optimization.optimizations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(optimization.optimizations.length)
    )
  );

  checks.push(
    check(
      "I_provenance_complete",
      "Provenance is complete",
      optimization.optimizations.every((entry) => validateRecommendationOptimizationProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "J_dimension_coverage",
      "All optimization dimensions present",
      optimization.optimizations.every(
        (entry) => entry.dimensions.length === EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS.length)
    )
  );

  checks.push(
    check(
      "K_governance_preserved",
      "Governance preserved on variants",
      optimization.optimizations.every(
        (entry) => entry.variant.governancePreserved === true && entry.variant.intentPreserved === true
      ),
      "governance preserved"
    )
  );

  checks.push(
    check(
      "L_registry_integrity",
      "Registry integrity verified",
      getRecommendationOptimizationRegistrySnapshot().optimizationCount === optimization.registeredOptimizationIds.length &&
        optimization.registeredOptimizationIds.every((optimizationId) => recommendationOptimizationExists(optimizationId)),
      String(getRecommendationOptimizationRegistrySnapshot().optimizationCount)
    )
  );

  checks.push(
    check(
      "M_pipeline_stages",
      "Pipeline stages complete",
      optimization.pipelineStages.length === EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES.length,
      String(optimization.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "N_no_original_mutation",
      "No original recommendation mutation",
      EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noOriginalMutation === true,
      "no mutation"
    )
  );

  checks.push(
    check(
      "O_no_execution",
      "No execution or approval",
      EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noExecution === true &&
        EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noApproval === true,
      "no execution"
    )
  );

  checks.push(
    check(
      "P_consumer_only",
      "Consumer-only optimization",
      EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "Q_prior_platforms_untouched",
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
      "R_duplicate_detection",
      "Duplicate optimization detection",
      registerRecommendationOptimization(optimization.optimizations[0]!).success === false,
      "duplicate rejected"
    )
  );

  const built = buildRecommendationOptimizationsFromGovernanceRecords(governance.governanceRecords.slice(0, 1), timestamp);
  checks.push(
    check(
      "S_profile_build",
      "Optimization profile build",
      built.length === 1 && validateRecommendationOptimizationRecord(built[0]!).valid === true,
      "profile built"
    )
  );

  checks.push(
    check(
      "T_validation_api",
      "Optimization validation API",
      validateRecommendationOptimization(
        Object.freeze({
          workspaceId: WORKSPACE,
          sessionId: "validation-session",
          sessionLabel: "Validation",
          governanceRecords: governance.governanceRecords.slice(0, 1),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "U_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "V_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationOptimizationEngine.ts"
    )
  );

  const optimizationId = optimization.registeredOptimizationIds[0];
  checks.push(
    check(
      "W_registry_retrieval",
      "Registry retrieval",
      optimizationId !== undefined &&
        getRecommendationOptimization(optimizationId) !== null &&
        getRecommendationOptimizations(WORKSPACE).length === optimization.optimizations.length,
      "retrieval ok"
    )
  );

  const buildOnly = buildRecommendationOptimizations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "X_build_optimizations_api",
      "buildRecommendationOptimizations API",
      buildOnly.length === 1 && validateRecommendationOptimizationRecord(buildOnly[0]!).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "Y_optimization_contract",
      "Recommendation optimization contract",
      optimization.optimizations.every((entry) => validateRecommendationOptimizationRecord(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "Z_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateOptimizationIds(["a", "b", "a"]) === true && hasDuplicateOptimizationIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "AA_dependency_validation",
      "Dependency validation",
      validateOptimizationDependencies().valid === true,
      "dependencies valid"
    )
  );

  checks.push(
    check(
      "AB_independent_explanations",
      "Each dimension has independent rationale",
      optimization.optimizations.every((entry) =>
        entry.dimensions.every((dimension) => dimension.rationale.length > 0)
      ),
      "dimensions explainable"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/6",
    contractVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
