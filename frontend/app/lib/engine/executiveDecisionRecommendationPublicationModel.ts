import { ExecutiveDecisionOutputRegistry } from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Recommendation and publication structural models.
 * Do not generate Advisor messages, Scene objects, workflows, or execution commands.
 */
export const ExecutiveRecommendationPackageModel = Object.freeze({
  id: "eng-7-model-executive-recommendation-package",
  name: "ExecutiveRecommendationPackage",
  description:
    "Canonical structural model for publishing executive recommendation packages.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "packageId",
    "decisionReference",
    "recommendationTitle",
    "recommendationSummary",
    "selectedAlternativeReference",
    "supportingRationaleReferences",
    "confidenceReference",
    "riskReference",
    "tradeoffReference",
    "impactReference",
    "implementationPlanReference",
    "executionReadinessDescriptor",
    "approvalRequirementReferences",
    "escalationRequirementReferences",
    "advisorConsumptionMetadata",
    "eng8ConsumptionMetadata",
    "publicationStatus",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "ExecutiveRecommendationPackage")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
    "eng-7-model-executive-decision-alternative",
    "eng-7-model-executive-decision-confidence",
    "eng-7-model-executive-decision-risk-profile",
    "eng-7-model-executive-decision-tradeoff-profile",
    "eng-7-model-executive-decision-impact-profile",
  ] as const),
  targetConsumers: Object.freeze(["ENG-8", "Advisor"] as const),
  prohibitedBehaviors: Object.freeze([
    "Advisor message generation",
    "Scene object generation",
    "workflow generation",
    "execution command generation",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly targetConsumers: readonly string[];
  readonly prohibitedBehaviors: readonly string[];
  readonly aiFree: true;
});

export const ExecutiveDecisionPublicationMetadataModel = Object.freeze({
  id: "eng-7-model-executive-decision-publication-metadata",
  name: "ExecutiveDecisionPublicationMetadata",
  description:
    "Canonical structural model for decision publication metadata.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "publicationId",
    "decisionReference",
    "publicationVersion",
    "publicationStatus",
    "publishedOutputTypes",
    "targetConsumers",
    "visibilityDescriptor",
    "approvalStatus",
    "supersessionReference",
    "archiveReference",
    "publicContractVersion",
    "registryVersion",
    "modelVersion",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "DecisionPublicationMetadata")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
  ] as const),
  targetConsumers: Object.freeze(["ENG-8", "Advisor"] as const),
  publishedOutputTypes: Object.freeze(
    ExecutiveDecisionOutputRegistry.map(({ name }) => name),
  ),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly targetConsumers: readonly string[];
  readonly publishedOutputTypes: readonly string[];
  readonly aiFree: true;
});

export const ExecutiveDecisionRecommendationPublicationModels = Object.freeze({
  recommendationPackage: ExecutiveRecommendationPackageModel,
  publicationMetadata: ExecutiveDecisionPublicationMetadataModel,
  models: Object.freeze([
    ExecutiveRecommendationPackageModel,
    ExecutiveDecisionPublicationMetadataModel,
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);
