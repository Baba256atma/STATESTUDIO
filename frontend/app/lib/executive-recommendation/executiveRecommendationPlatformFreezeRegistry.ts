/**
 * APP-12:9 — Executive Recommendation Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY } from "./executiveRecommendationConstants.ts";

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-12/9" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-12/9-platform-freeze-arch" as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_VERSION = "APP-12" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG =
  "app-12-executive-recommendation-v1.0.0-frozen" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_STATUS = "released" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_VERSION = "APP-12-compat-v1" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_BY = "APP-12:8 Platform Certification" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SOURCE = "APP-12/8" as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_CERTIFIED = true as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_FROZEN = true as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_RELEASED = true as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP12_9]",
  "[PLATFORM_FROZEN]",
  "[EXECUTIVE_RECOMMENDATION_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-12-1-executive-recommendation-foundation.md",
  "docs/app-12-2-recommendation-generation-engine.md",
  "docs/app-12-3-recommendation-evaluation-engine.md",
  "docs/app-12-4-recommendation-explainability-engine.md",
  "docs/app-12-5-recommendation-governance-engine.md",
  "docs/app-12-6-recommendation-optimization-engine.md",
  "docs/app-12-7-recommendation-delivery-engine.md",
  "docs/app-12-8-executive-recommendation-platform-certification.md",
  "docs/app-12-9-executive-recommendation-platform-freeze.md",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app12_addon_modules",
  "lay_recommendation_adapter_modules",
  "workspace_consumer_integration",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "report_export_modules",
  "recommendation_query_api_facade",
  "recommendation_facade_api",
  "persistence_adapter",
  "app1_app2_app3_app4_reference_adapters_facade_only",
  "app5_app6_app7_app8_app9_app10_app11_source_adapters_facade_only",
  "audit_governance_integration",
  "external_recommendation_import_export_adapter",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_recommendation_session_identity",
  "changing_immutable_recommendation_artifact_rules",
  "changing_deterministic_recommendation_semantics",
  "bypassing_future_app12_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app12_1_through_12_8_contracts",
  "direct_app1_through_app11_internal_coupling",
  "adding_ml_embeddings_or_vector_search_inside_frozen_core",
  "adding_recommendation_execution_inside_frozen_core",
  "adding_recommendation_approval_inside_frozen_core",
  "adding_notification_delivery_inside_frozen_core",
  "adding_ui_dashboard_assistant_behavior_inside_frozen_core",
  "changing_generation_evaluation_explainability_governance_optimization_delivery_semantics",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-12-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-12 through consumer bindings and adapters without modifying certified APP-12:1 through APP-12:8 contracts.",
  allowedFutureExtensions: EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  layCompatibilityRequired: true,
  readOnly: true as const,
} as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-12-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noGenerationChanges: true,
  noEvaluationChanges: true,
  noExplainabilityChanges: true,
  noGovernanceChanges: true,
  noOptimizationChanges: true,
  noDeliveryChanges: true,
  readOnly: true as const,
} as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-12/1", title: "Executive Recommendation Foundation", contractVersion: "APP-12/1" }),
  Object.freeze({ phaseId: "APP-12/2", title: "Recommendation Generation Engine", contractVersion: "APP-12/2" }),
  Object.freeze({ phaseId: "APP-12/3", title: "Recommendation Evaluation Engine", contractVersion: "APP-12/3" }),
  Object.freeze({ phaseId: "APP-12/4", title: "Recommendation Explainability Engine", contractVersion: "APP-12/4" }),
  Object.freeze({ phaseId: "APP-12/5", title: "Recommendation Constraint & Governance Engine", contractVersion: "APP-12/5" }),
  Object.freeze({ phaseId: "APP-12/6", title: "Recommendation Optimization Engine", contractVersion: "APP-12/6" }),
  Object.freeze({ phaseId: "APP-12/7", title: "Recommendation Delivery & Interaction Engine", contractVersion: "APP-12/7" }),
  Object.freeze({ phaseId: "APP-12/8", title: "Platform Certification", contractVersion: "APP-12/8" }),
  Object.freeze({ phaseId: "APP-12/9", title: "Platform Freeze", contractVersion: "APP-12/9" }),
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "buildExecutiveRecommendationFoundation",
  "createExecutiveRecommendationFoundation",
  "validateExecutiveRecommendationFoundation",
  "getExecutiveRecommendationManifest",
  "runExecutiveRecommendationFoundation",
  "generateExecutiveRecommendations",
  "buildRecommendationCandidates",
  "validateRecommendationGeneration",
  "registerRecommendationCandidate",
  "getRecommendationCandidates",
  "runRecommendationGenerationCertification",
  "evaluateExecutiveRecommendations",
  "buildRecommendationEvaluations",
  "validateRecommendationEvaluation",
  "registerRecommendationEvaluation",
  "getRecommendationEvaluations",
  "runRecommendationEvaluationCertification",
  "explainExecutiveRecommendations",
  "buildRecommendationExplanations",
  "validateRecommendationExplanation",
  "registerRecommendationExplanation",
  "getRecommendationExplanations",
  "runRecommendationExplainabilityCertification",
  "validateExecutiveRecommendationGovernance",
  "buildRecommendationGovernanceProfiles",
  "validateRecommendationGovernance",
  "registerRecommendationGovernance",
  "getRecommendationGovernances",
  "runRecommendationGovernanceCertification",
  "optimizeExecutiveRecommendations",
  "buildRecommendationOptimizations",
  "validateRecommendationOptimization",
  "registerRecommendationOptimization",
  "getRecommendationOptimizations",
  "runRecommendationOptimizationCertification",
  "prepareExecutiveRecommendationDelivery",
  "buildRecommendationDeliveryPackages",
  "validateRecommendationDelivery",
  "registerRecommendationDelivery",
  "getRecommendationDeliveries",
  "runRecommendationDeliveryCertification",
  "certifyExecutiveRecommendationPlatform",
  "validateExecutiveRecommendationPlatform",
  "runExecutiveRecommendationPlatformCertification",
  "getExecutiveRecommendationCertificationManifest",
  "runExecutiveRecommendationPlatformRegression",
  "freezeExecutiveRecommendationPlatform",
  "validateExecutiveRecommendationPlatformFreeze",
  "runExecutiveRecommendationPlatformFreeze",
  "getExecutiveRecommendationPlatformFreezeManifest",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-12/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/2", label: "Generation Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/3", label: "Evaluation Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/4", label: "Explainability Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/5", label: "Governance Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/6", label: "Optimization Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/7", label: "Delivery Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/8", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-12/9", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest:
  | import("./executiveRecommendationPlatformFreezeManifest.ts").ExecutiveRecommendationPlatformFreezeManifest
  | null = null;

export function resetExecutiveRecommendationPlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerExecutiveRecommendationPlatformFreezeManifest(
  manifest: import("./executiveRecommendationPlatformFreezeManifest.ts").ExecutiveRecommendationPlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedExecutiveRecommendationFreezeManifest():
  | import("./executiveRecommendationPlatformFreezeManifest.ts").ExecutiveRecommendationPlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getExecutiveRecommendationConsumerRegistry() {
  return EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.map((entry) =>
    Object.freeze({
      consumerId: entry.consumerId,
      label: entry.label,
      integrationPath: entry.integrationPath,
      status: entry.status,
      readOnly: true as const,
    })
  );
}

export function getExecutiveRecommendationPlatformRegistry(): import("./executiveRecommendationPlatformFreezeTypes.ts").ExecutiveRecommendationPlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "executive-recommendation-platform",
    platformName: manifest?.platformName ?? "Executive Recommendation",
    releaseVersion: manifest?.releaseVersion ?? EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getExecutiveRecommendationConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationPlatformFreezeRegistry = Object.freeze({
  resetExecutiveRecommendationPlatformFreezeRegistryForTests,
  registerExecutiveRecommendationPlatformFreezeManifest,
  getPublishedExecutiveRecommendationFreezeManifest,
  getExecutiveRecommendationPlatformRegistry,
  getExecutiveRecommendationConsumerRegistry,
});
