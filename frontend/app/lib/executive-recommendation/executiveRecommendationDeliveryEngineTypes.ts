/**
 * APP-12:7 — Executive Recommendation Delivery Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import type { EvaluationId } from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { ExplanationId } from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { GovernanceId } from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationId, RecommendationWorkspaceId } from "./executiveRecommendationGenerationEngineTypes.ts";
import type { OptimizationId, RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";

export type DeliveryId = string;
export type RecommendationDeliverySessionId = string;
export type RecommendationDeliveryPipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES)[number];
export type DeliveryConsumerTarget = (typeof EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS)[number];
export type InteractionCapabilityKey =
  (typeof EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS)[number];
export type DeliveryPriorityLevel = "critical" | "high" | "medium" | "standard";
export type DeliveryVisibilityScope = "executive" | "leadership" | "operational";

export type DeliveryEvidence = Readonly<{
  evidenceId: string;
  referenceType: "optimization" | "governance" | "explanation" | "evaluation" | "delivery";
  referenceId: string;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type DeliverySummary = Readonly<{
  summaryId: string;
  consumerTargetCount: number;
  capabilityCount: number;
  evidenceReferenceCount: number;
  narrative: string;
  readOnly: true;
}>;

export type RecommendationPresentationProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  optimizationId: OptimizationId;
  displayTitle: string;
  displaySummary: string;
  priorityLevel: DeliveryPriorityLevel;
  visibilityScope: DeliveryVisibilityScope;
  consumerPresentationHints: Readonly<Record<DeliveryConsumerTarget, string>>;
  readOnly: true;
}>;

export type RecommendationInteractionCapability = Readonly<{
  capabilityKey: InteractionCapabilityKey;
  label: string;
  enabled: true;
  rationale: string;
  readOnly: true;
}>;

export type RecommendationInteractionProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  optimizationId: OptimizationId;
  capabilities: readonly RecommendationInteractionCapability[];
  readOnly: true;
}>;

export type RecommendationDeliveryProvenance = Readonly<{
  recommendationId: RecommendationId;
  optimizationId: OptimizationId;
  governanceId: GovernanceId;
  evaluationId: EvaluationId;
  explanationId: ExplanationId;
  workspaceId: RecommendationWorkspaceId;
  sourcePlatforms: readonly string[];
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: "APP-12/2";
  evaluationVersion: "APP-12/3";
  explanationVersion: "APP-12/4";
  governanceVersion: "APP-12/5";
  optimizationVersion: "APP-12/6";
  deliveryVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type RecommendationDeliveryPackage = Readonly<{
  packageId: string;
  deliveryId: DeliveryId;
  recommendationId: RecommendationId;
  optimizationId: OptimizationId;
  presentationProfile: RecommendationPresentationProfile;
  interactionProfile: RecommendationInteractionProfile;
  consumerTargets: readonly DeliveryConsumerTarget[];
  executiveSummary: string;
  evidenceReferences: readonly string[];
  provenance: RecommendationDeliveryProvenance;
  deliveryTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendationDelivery = Readonly<{
  deliveryId: DeliveryId;
  recommendationId: RecommendationId;
  optimizationId: OptimizationId;
  package: RecommendationDeliveryPackage;
  summary: DeliverySummary;
  deliveryEvidence: readonly DeliveryEvidence[];
  provenance: RecommendationDeliveryProvenance;
  deliveryTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationDeliveryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationDeliveryValidation = Readonly<{
  valid: boolean;
  issues: readonly RecommendationDeliveryValidationIssue[];
  readOnly: true;
}>;

export type RecommendationDeliveryResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationDeliverySessionId;
  deliveries: readonly ExecutiveRecommendationDelivery[];
  packages: readonly RecommendationDeliveryPackage[];
  registeredDeliveryIds: readonly DeliveryId[];
  skippedOptimizations: number;
  pipelineStages: readonly RecommendationDeliveryPipelineStage[];
  deliveryTimestamp: string;
  readOnly: true;
}>;

export type RecommendationDeliveryRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  deliveryCount: number;
  deliveryIds: readonly DeliveryId[];
  readOnly: true;
}>;

export type RecommendationDeliveryEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationDeliveryEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationDeliveryEngineError | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationDeliveryRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationDeliverySessionId;
  sessionLabel: string;
  optimizations: readonly RecommendationOptimization[];
  deliveryTimestamp?: string;
}>;

export type ExecutiveRecommendationDeliveryEngineState = Readonly<{
  engineId: "executive-recommendation-delivery-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredDeliveryCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationDeliveryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationDeliveryCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/7";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationDeliveryCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationDeliveryEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationDeliveryEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export type {
  RecommendationOptimization,
  RecommendationId,
  RecommendationWorkspaceId,
  OptimizationId,
  GovernanceId,
  EvaluationId,
  ExplanationId,
};
