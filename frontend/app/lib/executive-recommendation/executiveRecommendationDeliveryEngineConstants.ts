/**
 * APP-12:7 — Executive Recommendation Delivery Engine constants.
 */

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION = "APP-12/7" as const;
export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/7-delivery-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_OWNER =
  "executive-recommendation-delivery-engine" as const;

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_TAGS = Object.freeze([
  "[APP12_7]",
  "[RECOMMENDATION_DELIVERY_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_EXECUTION]",
  "[NO_NOTIFICATIONS]",
  "[NO_UI]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "generateExecutiveRecommendations",
  "evaluateExecutiveRecommendations",
  "explainExecutiveRecommendations",
  "validateExecutiveRecommendationGovernance",
  "optimizeExecutiveRecommendations",
  "executeRecommendation",
  "approveRecommendation",
  "workflowEngine",
  "notificationDelivery",
  "sendNotification",
  "inboxLogic",
  "renderComponent",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "openai",
  "prompt(",
  "llm",
  "predict(",
  "forecast(",
  "autonomousDecision",
  "autonomousAction",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES = Object.freeze([
  "load_optimized_recommendations",
  "validate_dependencies",
  "build_presentation_profiles",
  "build_interaction_profiles",
  "build_delivery_packages",
  "attach_provenance",
  "validate_contracts",
  "register_delivery_packages",
  "produce_immutable_delivery_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS = Object.freeze([
  "workspace",
  "dashboard",
  "assistant",
  "report",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS)[number], string>
> = Object.freeze({
  workspace: "Workspace",
  dashboard: "Dashboard",
  assistant: "Assistant",
  report: "Report",
});

export const EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS = Object.freeze([
  "view_recommendation",
  "view_explanation",
  "view_evidence",
  "view_governance",
  "view_optimization_variant",
  "compare_variant",
  "export",
  "archive",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS)[number], string>
> = Object.freeze({
  view_recommendation: "View Recommendation",
  view_explanation: "View Explanation",
  view_evidence: "View Evidence",
  view_governance: "View Governance",
  view_optimization_variant: "View Optimization Variant",
  compare_variant: "Compare Variant",
  export: "Export",
  archive: "Archive",
});

export const EXECUTIVE_RECOMMENDATION_DELIVERY_MANDATORY_DELIVERY_FIELDS = Object.freeze([
  "deliveryId",
  "recommendationId",
  "optimizationId",
  "package",
  "summary",
  "deliveryEvidence",
  "provenance",
  "deliveryTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredDeliveries: 4096,
  maxOptimizationsPerRequest: 4096,
  maxCapabilitiesPerProfile: 8,
  maxConsumerTargetsPerPackage: 4,
  maxEvidenceReferencesPerPackage: 24,
} as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noGeneration: true,
  noEvaluation: true,
  noExplainability: true,
  noGovernance: true,
  noOptimization: true,
  noExecution: true,
  noApproval: true,
  noWorkflowExecution: true,
  noNotifications: true,
  noReminders: true,
  noInboxLogic: true,
  noUiRendering: true,
  noMachineLearning: true,
  noOriginalMutation: true,
  immutableDeliveries: true,
  deterministicOnly: true,
  consumerOnly: true,
  metadataOnly: true,
} as const);
