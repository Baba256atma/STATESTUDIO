import {
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionOutputRegistry,
} from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Trade-off and impact structural models — no comparison or impact calculation.
 */
export const ExecutiveDecisionTradeoffProfileModel = Object.freeze({
  id: "eng-7-model-executive-decision-tradeoff-profile",
  name: "ExecutiveDecisionTradeoffProfile",
  description:
    "Canonical structural model for published decision trade-off profile metadata.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "tradeoffProfileId",
    "decisionReference",
    "comparedAlternatives",
    "benefitReferences",
    "costReferences",
    "opportunityReferences",
    "constraintReferences",
    "sacrificeReferences",
    "dependencyReferences",
    "temporalTradeoffReferences",
    "strategicTradeoffReferences",
    "operationalTradeoffReferences",
    "financialTradeoffReferences",
    "publicationStatus",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "DecisionTradeoffProfile")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
    "eng-7-model-executive-decision-alternative",
  ] as const),
  prohibitedCalculations: Object.freeze([
    "tradeoff comparison",
    "benefit scoring",
    "cost scoring",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly prohibitedCalculations: readonly string[];
  readonly aiFree: true;
});

export const ExecutiveDecisionImpactProfileModel = Object.freeze({
  id: "eng-7-model-executive-decision-impact-profile",
  name: "ExecutiveDecisionImpactProfile",
  description:
    "Canonical structural model for published decision impact profile metadata.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "impactProfileId",
    "decisionReference",
    "affectedDomains",
    "affectedCapabilities",
    "affectedProjects",
    "affectedResources",
    "affectedWorkflows",
    "affectedStakeholders",
    "directImpactReferences",
    "indirectImpactReferences",
    "downstreamImpactReferences",
    "reversibilityDescriptor",
    "timeHorizonDescriptor",
    "publicationStatus",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionDomainRegistry[0].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
  ] as const),
  prohibitedCalculations: Object.freeze([
    "impact propagation",
    "downstream impact computation",
    "reversibility scoring",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly prohibitedCalculations: readonly string[];
  readonly aiFree: true;
});

export const ExecutiveDecisionTradeoffImpactModels = Object.freeze({
  tradeoffProfile: ExecutiveDecisionTradeoffProfileModel,
  impactProfile: ExecutiveDecisionImpactProfileModel,
  models: Object.freeze([
    ExecutiveDecisionTradeoffProfileModel,
    ExecutiveDecisionImpactProfileModel,
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);
