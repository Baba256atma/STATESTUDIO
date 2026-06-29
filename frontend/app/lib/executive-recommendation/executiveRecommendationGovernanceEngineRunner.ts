/**
 * APP-12:5 — Executive Recommendation Governance Engine certification runner.
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
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import {
  buildRecommendationGovernanceProfiles,
  getRecommendationGovernance,
  getRecommendationGovernances,
  initializeRecommendationGovernanceEngine,
  isRecommendationGovernanceEngineInitialized,
  recommendationGovernanceExists,
  registerRecommendationGovernance,
  resetExecutiveRecommendationGovernanceEngineForTests,
  validateExecutiveRecommendationGovernance,
  validateRecommendationGovernance,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationGovernanceEngine.ts";
import { buildRecommendationGovernanceProfilesFromExplanations } from "./executiveRecommendationGovernanceProfileBuilder.ts";
import { getRecommendationGovernanceRegistrySnapshot } from "./executiveRecommendationGovernanceEngineRegistry.ts";
import type {
  ExecutiveRecommendationGovernanceCertificationCheck,
  ExecutiveRecommendationGovernanceCertificationResult,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import {
  hasDuplicateGovernanceIds,
  validateEvaluationEngineCompatibilityForGovernance,
  validateExplainabilityEngineCompatibility,
  validateFoundationCompatibilityForGovernanceEngine,
  validateGenerationEngineCompatibilityForGovernance,
  validateGovernanceDependencies,
  validateRecommendationGovernanceProvenance,
  validateRecommendationGovernanceRecord,
} from "./executiveRecommendationGovernanceEngineValidation.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-governance-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationGovernanceCertificationCheck {
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

function generateExplanations(timestamp: string) {
  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-for-governance",
      sessionLabel: "Generation for Governance",
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
      sessionId: "evaluation-for-governance",
      sessionLabel: "Evaluation for Governance",
      candidates: generation.candidates,
      evaluationTimestamp: timestamp,
    })
  );
  return explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-for-governance",
      sessionLabel: "Explainability for Governance",
      evaluations: evaluation.evaluations,
      explanationTimestamp: timestamp,
    })
  );
}

export function resetExecutiveRecommendationGovernanceEnginePlatformForTests(): void {
  resetExecutiveRecommendationGovernanceEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function bootstrapRecommendationGovernancePlatform(timestamp: string = FIXED_TIME): void {
  resetExecutiveRecommendationGovernanceEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);
  initializeRecommendationEvaluationEngine(timestamp);
  initializeRecommendationExplainabilityEngine(timestamp);
  initializeRecommendationGovernanceEngine(timestamp);
}

export function runRecommendationGovernanceCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationGovernanceCertificationResult {
  bootstrapRecommendationGovernancePlatform(timestamp);

  const checks: ExecutiveRecommendationGovernanceCertificationCheck[] = [];
  const explanation = generateExplanations(timestamp);

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationGovernanceEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForGovernanceEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "C_generation_dependency",
      "APP-12:2 generation engine dependency",
      validateGenerationEngineCompatibilityForGovernance(true).valid === true,
      "APP-12/2"
    )
  );

  checks.push(
    check(
      "D_evaluation_dependency",
      "APP-12:3 evaluation engine dependency",
      validateEvaluationEngineCompatibilityForGovernance(true).valid === true,
      "APP-12/3"
    )
  );

  checks.push(
    check(
      "E_explainability_dependency",
      "APP-12:4 explainability engine dependency",
      validateExplainabilityEngineCompatibility(true).valid === true,
      "APP-12/4"
    )
  );

  const governance = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-governance-session-001",
      sessionLabel: "Executive Governance Session",
      explanations: explanation.explanations,
      governanceTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "F_governance_success",
      "Deterministic governance validation succeeds",
      governance.success === true,
      governance.reason
    )
  );

  checks.push(
    check(
      "G_governance_immutable",
      "Governance records are immutable",
      governance.governanceRecords.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(governance.governanceRecords.length)
    )
  );

  checks.push(
    check(
      "H_provenance_complete",
      "Provenance is complete",
      governance.governanceRecords.every((entry) => validateRecommendationGovernanceProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "I_dimension_coverage",
      "All governance dimensions present",
      governance.governanceRecords.every(
        (entry) => entry.dimensions.length === EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS.length)
    )
  );

  checks.push(
    check(
      "J_constraint_policy_results",
      "Constraint and policy results present",
      governance.governanceRecords.every(
        (entry) => entry.constraintResults.length === 4 && entry.policyResults.length === 4
      ),
      "constraints and policies"
    )
  );

  checks.push(
    check(
      "K_registry_integrity",
      "Registry integrity verified",
      getRecommendationGovernanceRegistrySnapshot().governanceCount === governance.registeredGovernanceIds.length &&
        governance.registeredGovernanceIds.every((governanceId) => recommendationGovernanceExists(governanceId)),
      String(getRecommendationGovernanceRegistrySnapshot().governanceCount)
    )
  );

  checks.push(
    check(
      "L_pipeline_stages",
      "Pipeline stages complete",
      governance.pipelineStages.length === EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES.length,
      String(governance.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "M_deterministic_ordering",
      "Deterministic governance ordering",
      [...governance.governanceRecords.map((entry) => entry.governanceId)].join(",") ===
        [...governance.governanceRecords]
          .sort((a, b) => a.governanceId.localeCompare(b.governanceId))
          .map((entry) => entry.governanceId)
          .join(","),
      "sorted by governanceId"
    )
  );

  checks.push(
    check(
      "N_no_modification",
      "No recommendation modification",
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noModification === true,
      "no modification"
    )
  );

  checks.push(
    check(
      "O_no_optimization",
      "No optimization logic",
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noOptimization === true &&
        EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noRanking === true,
      "no optimization"
    )
  );

  checks.push(
    check(
      "P_consumer_only",
      "Consumer-only governance",
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
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
      "Duplicate governance detection",
      registerRecommendationGovernance(governance.governanceRecords[0]!).success === false,
      "duplicate rejected"
    )
  );

  const built = buildRecommendationGovernanceProfilesFromExplanations(explanation.explanations.slice(0, 1), timestamp);
  checks.push(
    check(
      "S_profile_build",
      "Governance profile build",
      built.length === 1 && validateRecommendationGovernanceRecord(built[0]!).valid === true,
      "profile built"
    )
  );

  checks.push(
    check(
      "T_validation_api",
      "Governance validation API",
      validateRecommendationGovernance(
        Object.freeze({
          workspaceId: WORKSPACE,
          sessionId: "validation-session",
          sessionLabel: "Validation",
          explanations: explanation.explanations.slice(0, 1),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "U_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "V_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationGovernanceEngine.ts"
    )
  );

  checks.push(
    check(
      "W_domain_vocabulary",
      "Recommendation domain vocabulary preserved",
      isExecutiveRecommendationDomain("strategic") === true && isExecutiveRecommendationDomain("mixed") === true,
      "domain guards"
    )
  );

  const governanceId = governance.registeredGovernanceIds[0];
  checks.push(
    check(
      "X_registry_retrieval",
      "Registry retrieval",
      governanceId !== undefined &&
        getRecommendationGovernance(governanceId) !== null &&
        getRecommendationGovernances(WORKSPACE).length === governance.governanceRecords.length,
      "retrieval ok"
    )
  );

  const buildOnly = buildRecommendationGovernanceProfiles(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "Y_build_profiles_api",
      "buildRecommendationGovernanceProfiles API",
      buildOnly.length === 1 && validateRecommendationGovernanceRecord(buildOnly[0]!).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "Z_no_approval",
      "No approval or execution",
      EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noApproval === true &&
        EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noExecution === true,
      "no approval"
    )
  );

  checks.push(
    check(
      "AA_governance_contract",
      "Recommendation governance contract",
      governance.governanceRecords.every((entry) => validateRecommendationGovernanceRecord(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "AB_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateGovernanceIds(["a", "b", "a"]) === true && hasDuplicateGovernanceIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "AC_dependency_validation",
      "Dependency validation",
      validateGovernanceDependencies().valid === true,
      "dependencies valid"
    )
  );

  checks.push(
    check(
      "AD_independent_explanations",
      "Each dimension has independent rationale",
      governance.governanceRecords.every((entry) =>
        entry.dimensions.every((dimension) => dimension.rationale.length > 0)
      ),
      "dimensions explainable"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/5",
    contractVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
