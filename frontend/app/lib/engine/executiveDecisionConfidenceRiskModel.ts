import { ExecutiveDecisionOutputRegistry } from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Confidence and risk structural models — all values are supplied metadata.
 * No confidence, probability, exposure, severity, or residual-risk calculation.
 */
export const ExecutiveDecisionConfidenceModel = Object.freeze({
  id: "eng-7-model-executive-decision-confidence",
  name: "ExecutiveDecisionConfidence",
  description:
    "Canonical structural model for published decision confidence metadata.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "confidenceId",
    "decisionReference",
    "confidenceClassification",
    "confidenceValueDescriptor",
    "evidenceCoverageDescriptor",
    "reasoningCompletenessDescriptor",
    "contextCompletenessDescriptor",
    "uncertaintyReferences",
    "assumptionReferences",
    "sourceReferences",
    "publicationStatus",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "DecisionConfidence")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
  ] as const),
  prohibitedCalculations: Object.freeze([
    "confidence score computation",
    "probability estimation",
    "evidence scoring",
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

export const ExecutiveDecisionRiskProfileModel = Object.freeze({
  id: "eng-7-model-executive-decision-risk-profile",
  name: "ExecutiveDecisionRiskProfile",
  description:
    "Canonical structural model for published decision risk-profile metadata.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "riskProfileId",
    "decisionReference",
    "riskReferences",
    "riskCategories",
    "severityDescriptors",
    "likelihoodDescriptors",
    "exposureDescriptors",
    "mitigationReferences",
    "residualRiskDescriptor",
    "acceptedRiskReferences",
    "escalationReferences",
    "publicationStatus",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "DecisionRiskProfile")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
  ] as const),
  prohibitedCalculations: Object.freeze([
    "severity scoring",
    "likelihood computation",
    "exposure calculation",
    "residual risk calculation",
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

export const ExecutiveDecisionConfidenceRiskModels = Object.freeze({
  confidence: ExecutiveDecisionConfidenceModel,
  riskProfile: ExecutiveDecisionRiskProfileModel,
  models: Object.freeze([
    ExecutiveDecisionConfidenceModel,
    ExecutiveDecisionRiskProfileModel,
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);
