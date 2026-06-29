/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY } from "./crossScenarioLearningConstants.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-10/9" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-10/9-platform-freeze-arch" as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_VERSION = "APP-10" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG =
  "app-10-cross-scenario-learning-v1.0.0-frozen" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_STATUS = "released" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_VERSION = "APP-10-compat-v1" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_BY = "APP-10:8 Platform Certification" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SOURCE = "APP-10/8" as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_CERTIFIED = true as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_FROZEN = true as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_RELEASED = true as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP10_9]",
  "[PLATFORM_FROZEN]",
  "[CROSS_SCENARIO_LEARNING_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-10-1-cross-scenario-learning-foundation.md",
  "docs/app-10-2-pattern-extraction-engine.md",
  "docs/app-10-3-similarity-engine.md",
  "docs/app-10-4-outcome-learning-engine.md",
  "docs/app-10-5-failure-learning-engine.md",
  "docs/app-10-6-strategy-learning-engine.md",
  "docs/app-10-7-recommendation-learning-engine.md",
  "docs/app-10-8-cross-scenario-learning-platform-certification.md",
  "docs/app-10-9-cross-scenario-learning-platform-freeze.md",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app10_addon_modules",
  "lay_learning_adapter_modules",
  "workspace_consumer_integration",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "report_export_modules",
  "learning_query_api_facade",
  "learning_facade_api",
  "persistence_adapter",
  "app5_app6_app7_app8_app9_reference_adapters_facade_only",
  "audit_governance_integration",
  "external_learning_import_export_adapter",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_learning_session_identity",
  "changing_immutable_learning_artifact_rules",
  "changing_deterministic_learning_semantics",
  "bypassing_future_app10_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app10_1_through_10_8_contracts",
  "direct_app5_app6_app7_app8_app9_internal_coupling",
  "adding_ml_embeddings_or_vector_search_inside_frozen_core",
  "adding_recommendation_generation_inside_frozen_core",
  "adding_ui_dashboard_assistant_behavior_inside_frozen_core",
  "changing_pattern_similarity_outcome_failure_strategy_recommendation_semantics",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-10-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-10 through consumer bindings and adapters without modifying certified APP-10:1 through APP-10:8 contracts.",
  allowedFutureExtensions: CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  layCompatibilityRequired: true,
  readOnly: true as const,
} as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-10-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noPatternExtractionChanges: true,
  noSimilarityChanges: true,
  noOutcomeLearningChanges: true,
  noFailureLearningChanges: true,
  noStrategyLearningChanges: true,
  noRecommendationLearningChanges: true,
  readOnly: true as const,
} as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", title: "Cross-Scenario Learning Foundation", contractVersion: "APP-10/1" }),
  Object.freeze({ phaseId: "APP-10/2", title: "Pattern Extraction Engine", contractVersion: "APP-10/2" }),
  Object.freeze({ phaseId: "APP-10/3", title: "Similarity Engine", contractVersion: "APP-10/3" }),
  Object.freeze({ phaseId: "APP-10/4", title: "Outcome Learning Engine", contractVersion: "APP-10/4" }),
  Object.freeze({ phaseId: "APP-10/5", title: "Failure Learning Engine", contractVersion: "APP-10/5" }),
  Object.freeze({ phaseId: "APP-10/6", title: "Strategy Learning Engine", contractVersion: "APP-10/6" }),
  Object.freeze({ phaseId: "APP-10/7", title: "Recommendation Learning Engine", contractVersion: "APP-10/7" }),
  Object.freeze({ phaseId: "APP-10/8", title: "Platform Certification", contractVersion: "APP-10/8" }),
  Object.freeze({ phaseId: "APP-10/9", title: "Platform Freeze", contractVersion: "APP-10/9" }),
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "buildCrossScenarioLearningFoundation",
  "createCrossScenarioLearningFoundation",
  "getCrossScenarioLearning",
  "runCrossScenarioLearningFoundation",
  "validateCrossScenarioLearningFoundation",
  "extractExecutivePatterns",
  "registerPattern",
  "getPatterns",
  "runPatternExtractionEngine",
  "compareScenarioSimilarity",
  "compareScenarioToPatterns",
  "runSimilarityEngineCertification",
  "learnHistoricalOutcomes",
  "registerOutcome",
  "runOutcomeLearningCertification",
  "learnHistoricalFailures",
  "registerFailure",
  "runFailureLearningCertification",
  "learnHistoricalStrategies",
  "registerStrategy",
  "runStrategyLearningCertification",
  "learnHistoricalRecommendations",
  "registerRecommendationProfile",
  "runRecommendationLearningCertification",
  "certifyCrossScenarioLearningPlatform",
  "validateCrossScenarioLearningPlatform",
  "runCrossScenarioLearningPlatformCertification",
  "getCrossScenarioLearningCertificationManifest",
  "runCrossScenarioLearningPlatformRegression",
  "freezeCrossScenarioLearningPlatform",
  "validateCrossScenarioLearningPlatformFreeze",
  "runCrossScenarioLearningPlatformFreeze",
  "getCrossScenarioLearningPlatformFreezeManifest",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-10/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/2", label: "Pattern Extraction Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/3", label: "Similarity Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/4", label: "Outcome Learning Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/5", label: "Failure Learning Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/6", label: "Strategy Learning Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/7", label: "Recommendation Learning Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/8", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-10/9", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest: import("./crossScenarioLearningPlatformFreezeManifest.ts").CrossScenarioLearningPlatformFreezeManifest | null =
  null;

export function resetCrossScenarioLearningPlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerCrossScenarioLearningPlatformFreezeManifest(
  manifest: import("./crossScenarioLearningPlatformFreezeManifest.ts").CrossScenarioLearningPlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedCrossScenarioLearningFreezeManifest():
  | import("./crossScenarioLearningPlatformFreezeManifest.ts").CrossScenarioLearningPlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getCrossScenarioLearningConsumerRegistry() {
  return CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.map((entry) =>
    Object.freeze({
      consumerId: entry.consumerId,
      label: entry.label,
      integrationPath: entry.integrationPath,
      status: entry.status,
      readOnly: true as const,
    })
  );
}

export function getCrossScenarioLearningPlatformRegistry(): import("./crossScenarioLearningPlatformFreezeTypes.ts").CrossScenarioLearningPlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "cross-scenario-learning-platform",
    platformName: manifest?.platformName ?? "Cross-Scenario Learning",
    releaseVersion: manifest?.releaseVersion ?? CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getCrossScenarioLearningConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const CrossScenarioLearningPlatformFreezeRegistry = Object.freeze({
  resetCrossScenarioLearningPlatformFreezeRegistryForTests,
  registerCrossScenarioLearningPlatformFreezeManifest,
  getPublishedCrossScenarioLearningFreezeManifest,
  getCrossScenarioLearningPlatformRegistry,
  getCrossScenarioLearningConsumerRegistry,
});
