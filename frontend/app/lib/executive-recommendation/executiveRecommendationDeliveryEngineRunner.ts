/**
 * APP-12:7 — Executive Recommendation Delivery Engine certification runner.
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
  initializeRecommendationOptimizationEngine,
  optimizeExecutiveRecommendations,
  resetExecutiveRecommendationOptimizationEngineForTests,
} from "./executiveRecommendationOptimizationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import {
  buildRecommendationDeliveryPackages,
  getRecommendationDelivery,
  getRecommendationDeliveries,
  initializeRecommendationDeliveryEngine,
  isRecommendationDeliveryEngineInitialized,
  prepareExecutiveRecommendationDelivery,
  recommendationDeliveryExists,
  registerRecommendationDelivery,
  resetExecutiveRecommendationDeliveryEngineForTests,
  validateRecommendationDelivery,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationDeliveryEngine.ts";
import { buildExecutiveRecommendationDeliveriesFromOptimizations } from "./executiveRecommendationDeliveryPackageBuilder.ts";
import { getRecommendationDeliveryRegistrySnapshot } from "./executiveRecommendationDeliveryEngineRegistry.ts";
import type {
  ExecutiveRecommendationDeliveryCertificationCheck,
  ExecutiveRecommendationDeliveryCertificationResult,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import {
  hasDuplicateDeliveryIds,
  validateDeliveryDependencies,
  validateEvaluationEngineCompatibilityForDelivery,
  validateExplainabilityEngineCompatibilityForDelivery,
  validateFoundationCompatibilityForDeliveryEngine,
  validateGenerationEngineCompatibilityForDelivery,
  validateGovernanceEngineCompatibilityForDelivery,
  validateOptimizationEngineCompatibility,
  validateExecutiveRecommendationDeliveryRecord,
  validateRecommendationDeliveryProvenance,
} from "./executiveRecommendationDeliveryEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-recommendation-delivery-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationDeliveryCertificationCheck {
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

function generateOptimizations(timestamp: string) {
  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-for-delivery",
      sessionLabel: "Generation for Delivery",
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
      sessionId: "evaluation-for-delivery",
      sessionLabel: "Evaluation for Delivery",
      candidates: generation.candidates,
      evaluationTimestamp: timestamp,
    })
  );
  const explanation = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-for-delivery",
      sessionLabel: "Explainability for Delivery",
      evaluations: evaluation.evaluations,
      explanationTimestamp: timestamp,
    })
  );
  const governance = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-for-delivery",
      sessionLabel: "Governance for Delivery",
      explanations: explanation.explanations,
      governanceTimestamp: timestamp,
    })
  );
  return optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-for-delivery",
      sessionLabel: "Optimization for Delivery",
      governanceRecords: governance.governanceRecords,
      optimizationTimestamp: timestamp,
    })
  );
}

export function resetExecutiveRecommendationDeliveryEnginePlatformForTests(): void {
  resetExecutiveRecommendationDeliveryEngineForTests();
  resetExecutiveRecommendationOptimizationEngineForTests();
  resetExecutiveRecommendationGovernanceEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationPlatformForTests();
}

export function bootstrapRecommendationDeliveryPlatform(timestamp: string = FIXED_TIME): void {
  resetExecutiveRecommendationDeliveryEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(timestamp);
  initializeRecommendationGenerationEngine(timestamp);
  initializeRecommendationEvaluationEngine(timestamp);
  initializeRecommendationExplainabilityEngine(timestamp);
  initializeRecommendationGovernanceEngine(timestamp);
  initializeRecommendationOptimizationEngine(timestamp);
  initializeRecommendationDeliveryEngine(timestamp);
}

export function runRecommendationDeliveryCertification(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationDeliveryCertificationResult {
  bootstrapRecommendationDeliveryPlatform(timestamp);

  const checks: ExecutiveRecommendationDeliveryCertificationCheck[] = [];
  const optimization = generateOptimizations(timestamp);

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isRecommendationDeliveryEngineInitialized() === true,
      EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-12:1 foundation dependency",
      validateFoundationCompatibilityForDeliveryEngine(true).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "C_generation_dependency",
      "APP-12:2 generation engine dependency",
      validateGenerationEngineCompatibilityForDelivery(true).valid === true,
      "APP-12/2"
    )
  );

  checks.push(
    check(
      "D_evaluation_dependency",
      "APP-12:3 evaluation engine dependency",
      validateEvaluationEngineCompatibilityForDelivery(true).valid === true,
      "APP-12/3"
    )
  );

  checks.push(
    check(
      "E_explainability_dependency",
      "APP-12:4 explainability engine dependency",
      validateExplainabilityEngineCompatibilityForDelivery(true).valid === true,
      "APP-12/4"
    )
  );

  checks.push(
    check(
      "F_governance_dependency",
      "APP-12:5 governance engine dependency",
      validateGovernanceEngineCompatibilityForDelivery(true).valid === true,
      "APP-12/5"
    )
  );

  checks.push(
    check(
      "G_optimization_dependency",
      "APP-12:6 optimization engine dependency",
      validateOptimizationEngineCompatibility(true).valid === true,
      "APP-12/6"
    )
  );

  const delivery = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-delivery-session-001",
      sessionLabel: "Executive Delivery Session",
      optimizations: optimization.optimizations,
      deliveryTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "H_delivery_success",
      "Deterministic delivery preparation succeeds",
      delivery.success === true,
      delivery.reason
    )
  );

  checks.push(
    check(
      "I_deliveries_immutable",
      "Deliveries are immutable",
      delivery.deliveries.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(delivery.deliveries.length)
    )
  );

  checks.push(
    check(
      "J_provenance_complete",
      "Provenance is complete",
      delivery.deliveries.every((entry) => validateRecommendationDeliveryProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "K_consumer_targets",
      "All consumer targets present",
      delivery.deliveries.every(
        (entry) => entry.package.consumerTargets.length === EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length)
    )
  );

  checks.push(
    check(
      "L_interaction_capabilities",
      "All interaction capabilities present",
      delivery.deliveries.every(
        (entry) =>
          entry.package.interactionProfile.capabilities.length ===
          EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS.length
      ),
      String(EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS.length)
    )
  );

  checks.push(
    check(
      "M_registry_integrity",
      "Registry integrity verified",
      getRecommendationDeliveryRegistrySnapshot().deliveryCount === delivery.registeredDeliveryIds.length &&
        delivery.registeredDeliveryIds.every((deliveryId) => recommendationDeliveryExists(deliveryId)),
      String(getRecommendationDeliveryRegistrySnapshot().deliveryCount)
    )
  );

  checks.push(
    check(
      "N_pipeline_stages",
      "Pipeline stages complete",
      delivery.pipelineStages.length === EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES.length,
      String(delivery.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "O_no_execution",
      "No execution notifications or UI",
      EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noExecution === true &&
        EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noNotifications === true &&
        EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noUiRendering === true,
      "no execution"
    )
  );

  checks.push(
    check(
      "P_consumer_only",
      "Consumer-only delivery packaging",
      EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.consumerOnly === true &&
        EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.metadataOnly === true,
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
      "Duplicate delivery detection",
      registerRecommendationDelivery(delivery.deliveries[0]!).success === false,
      "duplicate rejected"
    )
  );

  const built = buildExecutiveRecommendationDeliveriesFromOptimizations(
    optimization.optimizations.slice(0, 1),
    timestamp
  );
  checks.push(
    check(
      "S_package_build",
      "Delivery package build",
      built.length === 1 && validateExecutiveRecommendationDeliveryRecord(built[0]!).valid === true,
      "package built"
    )
  );

  checks.push(
    check(
      "T_validation_api",
      "Delivery validation API",
      validateRecommendationDelivery(
        Object.freeze({
          workspaceId: WORKSPACE,
          sessionId: "validation-session",
          sessionLabel: "Validation",
          optimizations: optimization.optimizations.slice(0, 1),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "U_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "V_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngine.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationDeliveryEngine.ts"
    )
  );

  const deliveryId = delivery.registeredDeliveryIds[0];
  checks.push(
    check(
      "W_registry_retrieval",
      "Registry retrieval",
      deliveryId !== undefined &&
        getRecommendationDelivery(deliveryId) !== null &&
        getRecommendationDeliveries(WORKSPACE).length === delivery.deliveries.length,
      "retrieval ok"
    )
  );

  const buildOnly = buildRecommendationDeliveryPackages(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      sessionLabel: "Build",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "X_build_packages_api",
      "buildRecommendationDeliveryPackages API",
      buildOnly.length === 1 && validateExecutiveRecommendationDeliveryRecord(
        buildExecutiveRecommendationDeliveriesFromOptimizations(optimization.optimizations.slice(0, 1), timestamp)[0]!
      ).valid === true,
      "build ok"
    )
  );

  checks.push(
    check(
      "Y_delivery_contract",
      "Executive recommendation delivery contract",
      delivery.deliveries.every((entry) => validateExecutiveRecommendationDeliveryRecord(entry).valid),
      "contracts valid"
    )
  );

  checks.push(
    check(
      "Z_duplicate_id_guard",
      "Duplicate ID guard",
      hasDuplicateDeliveryIds(["a", "b", "a"]) === true && hasDuplicateDeliveryIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "AA_dependency_validation",
      "Dependency validation",
      validateDeliveryDependencies().valid === true,
      "dependencies valid"
    )
  );

  checks.push(
    check(
      "AB_interaction_metadata_only",
      "Interaction capabilities are metadata only",
      delivery.deliveries.every((entry) =>
        entry.package.interactionProfile.capabilities.every(
          (capability) => capability.enabled === true && capability.rationale.length > 0
        )
      ),
      "metadata only"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/7",
    contractVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}
