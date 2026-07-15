import { ExecutiveDecisionAlternativeModels } from "./executiveDecisionAlternativeModel.ts";
import { ExecutiveDecisionConfidenceRiskModels } from "./executiveDecisionConfidenceRiskModel.ts";
import { ExecutiveDecisionCoreModel } from "./executiveDecisionCoreModel.ts";
import {
  ExecutiveDecisionFoundation,
} from "./executiveDecisionPublicApi.ts";
import {
  ExecutiveDecisionRegistryMetadata,
  ExecutiveDecisionRegistryPlatform,
} from "./executiveDecisionRegistryPlatform.ts";
import { ExecutiveDecisionRecommendationPublicationModels } from "./executiveDecisionRecommendationPublicationModel.ts";
import { ExecutiveDecisionTradeoffImpactModels } from "./executiveDecisionTradeoffImpactModel.ts";
import { ExecutiveDecisionTraceModel } from "./executiveDecisionTraceModel.ts";
import type {
  ExecutiveDecisionModelDescriptor,
  ExecutiveDecisionModelMetadata as ExecutiveDecisionModelMetadataDescriptor,
  ExecutiveDecisionModelSummary,
} from "./executiveDecisionModelTypes.ts";

const allModels = Object.freeze([
  ExecutiveDecisionCoreModel,
  ...ExecutiveDecisionAlternativeModels.models,
  ...ExecutiveDecisionConfidenceRiskModels.models,
  ...ExecutiveDecisionTradeoffImpactModels.models,
  ExecutiveDecisionTraceModel,
  ...ExecutiveDecisionRecommendationPublicationModels.models,
] as const);

const registryEntry = (
  model: ExecutiveDecisionModelDescriptor,
  category: string,
) => Object.freeze({
  id: model.id,
  name: model.name,
  category,
  description: model.description,
  namespace: model.namespace,
  owner: model.owner,
  sourcePhase: model.sourcePhase,
  registryDependencies: model.registryDependencies,
  modelDependencies: model.modelDependencies,
  status: model.status,
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveDecisionModelRegistry = Object.freeze({
  id: "eng-7-model-registry",
  name: "Executive Decision Model Registry",
  owner: "ENG-7",
  version: "1.0.0",
  namespace: "Nexora.Engine.ExecutiveDecision.Model",
  entries: Object.freeze([
    registryEntry(ExecutiveDecisionCoreModel, "CoreDecision"),
    registryEntry(ExecutiveDecisionAlternativeModels.alternative, "Alternative"),
    registryEntry(ExecutiveDecisionAlternativeModels.alternativeSet, "AlternativeSet"),
    registryEntry(ExecutiveDecisionConfidenceRiskModels.confidence, "Confidence"),
    registryEntry(ExecutiveDecisionConfidenceRiskModels.riskProfile, "RiskProfile"),
    registryEntry(ExecutiveDecisionTradeoffImpactModels.tradeoffProfile, "TradeoffProfile"),
    registryEntry(ExecutiveDecisionTradeoffImpactModels.impactProfile, "ImpactProfile"),
    registryEntry(ExecutiveDecisionTraceModel, "Trace"),
    registryEntry(ExecutiveDecisionRecommendationPublicationModels.recommendationPackage, "RecommendationPackage"),
    registryEntry(ExecutiveDecisionRecommendationPublicationModels.publicationMetadata, "PublicationMetadata"),
  ] as const),
  relationshipChain: ExecutiveDecisionTraceModel.relationshipChain,
  decisionAttachments: ExecutiveDecisionTraceModel.decisionAttachments,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const ExecutiveDecisionModelMetadata = Object.freeze({
  id: "ENG-7:3",
  name: "Executive Decision Model Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Model",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:2",
  nextPhase: "ENG-7:4",
  readiness: "ReadyForDecisionValidation",
  foundationId: ExecutiveDecisionFoundation.id,
  registryId: ExecutiveDecisionRegistryMetadata.id,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionModelMetadataDescriptor & {
  readonly foundationId: string;
  readonly registryId: string;
});

const summary = Object.freeze({
  modelPlatformId: "ENG-7:3",
  phase: "ENG-7:3",
  namespace: "Nexora.Engine.ExecutiveDecision.Model",
  owner: "ENG-7",
  modelCount: allModels.length,
  registryEntryCount: ExecutiveDecisionModelRegistry.entries.length,
  relationshipStepCount: ExecutiveDecisionTraceModel.relationshipChain.length,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  ownershipStatus: "OwnershipProtected",
  dependencyStatus: "DependencySafe",
  antiDuplicationStatus: "AntiDuplicationCompliant",
  readiness: "ReadyForDecisionValidation",
  nextPhase: "ENG-7:4",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionModelSummary);

export const ExecutiveDecisionModelPlatform = Object.freeze({
  metadata: ExecutiveDecisionModelMetadata,
  registry: ExecutiveDecisionModelRegistry,
  coreDecisionModel: ExecutiveDecisionCoreModel,
  alternativeModels: ExecutiveDecisionAlternativeModels,
  confidenceRiskModels: ExecutiveDecisionConfidenceRiskModels,
  tradeoffImpactModels: ExecutiveDecisionTradeoffImpactModels,
  traceModel: ExecutiveDecisionTraceModel,
  recommendationPublicationModels: ExecutiveDecisionRecommendationPublicationModels,
  models: allModels,
  summary,
  ownership: Object.freeze({
    owner: "ENG-7",
    owns: Object.freeze([
      "executive decision model contracts",
      "decision alternative model contracts",
      "decision confidence model contracts",
      "decision risk model contracts",
      "decision trade-off model contracts",
      "decision impact model contracts",
      "decision trace model contracts",
      "recommendation package model contracts",
      "decision publication model contracts",
    ] as const),
    neverOwns: Object.freeze([
      "request interpretation",
      "intent resolution",
      "context generation",
      "planning",
      "reasoning",
      "evidence generation",
      "alternative generation",
      "alternative ranking",
      "confidence calculation",
      "risk calculation",
      "impact calculation",
      "orchestration",
      "execution",
      "human-facing communication",
      "visualization",
      "persistence",
    ] as const),
  } as const),
  guarantees: Object.freeze({
    status: "Stable",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    ownershipStatus: "OwnershipProtected",
    dependencyStatus: "DependencySafe",
    antiDuplicationStatus: "AntiDuplicationCompliant",
    readiness: "ReadyForDecisionValidation",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    foundationId: ExecutiveDecisionFoundation.id,
    registryPlatformId: ExecutiveDecisionRegistryPlatform.metadata.id,
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const modelIndex = Object.freeze(
  Object.fromEntries(allModels.map((model) => [model.id, model])) as Readonly<
    Record<string, (typeof allModels)[number] | undefined>
  >,
);

export const getExecutiveDecisionModelPlatform = () => ExecutiveDecisionModelPlatform;
export const getExecutiveDecisionModelMetadata = () => ExecutiveDecisionModelMetadata;
export const getExecutiveDecisionModelById = (
  id: string,
): (typeof allModels)[number] | undefined => modelIndex[id];
export const getExecutiveDecisionModelRegistry = () => ExecutiveDecisionModelRegistry;
export const getExecutiveDecisionModelSummary = () => summary;
export const isExecutiveDecisionModelId = (id: string): boolean => modelIndex[id] !== undefined;

export {
  ExecutiveDecisionAlternativeModels,
  ExecutiveDecisionConfidenceRiskModels,
  ExecutiveDecisionCoreModel,
  ExecutiveDecisionRecommendationPublicationModels,
  ExecutiveDecisionTraceModel,
  ExecutiveDecisionTradeoffImpactModels,
};
