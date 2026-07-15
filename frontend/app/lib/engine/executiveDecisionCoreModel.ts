import {
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionTypeRegistry,
} from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Canonical ExecutiveDecision structural model — record shape only.
 * Does not select, approve, reject, score, or transition lifecycle.
 */
export const ExecutiveDecisionCoreModel = Object.freeze({
  id: "eng-7-model-executive-decision",
  name: "ExecutiveDecision",
  description:
    "Canonical structural model for an executive decision record built from validated reasoning outcomes.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "decisionId",
    "decisionType",
    "decisionDomain",
    "title",
    "description",
    "objectiveReference",
    "intentReference",
    "contextReference",
    "planReference",
    "reasoningOutcomeReference",
    "selectedAlternativeReference",
    "decisionStatus",
    "lifecycleState",
    "confidenceReference",
    "riskProfileReference",
    "tradeoffProfileReference",
    "traceReference",
    "recommendationPackageReference",
    "publicationMetadataReference",
    "owner",
    "createdByPhase",
    "version",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionTypeRegistry[0].id,
    ExecutiveDecisionDomainRegistry[0].id,
    ExecutiveDecisionLifecycleRegistry[0].id,
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "ExecutiveDecision")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision-alternative",
    "eng-7-model-executive-decision-confidence",
    "eng-7-model-executive-decision-risk-profile",
    "eng-7-model-executive-decision-tradeoff-profile",
    "eng-7-model-executive-decision-trace",
    "eng-7-model-executive-recommendation-package",
    "eng-7-model-executive-decision-publication-metadata",
  ] as const),
  compatibleDecisionTypes: Object.freeze(ExecutiveDecisionTypeRegistry.map(({ id }) => id)),
  compatibleDomains: Object.freeze(ExecutiveDecisionDomainRegistry.map(({ id }) => id)),
  compatibleLifecycleStates: Object.freeze(ExecutiveDecisionLifecycleRegistry.map(({ id }) => id)),
  phaseLineage: Object.freeze([
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
    "ENG-7:1",
    "ENG-7:2",
    "ENG-7:3",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly compatibleDecisionTypes: readonly string[];
  readonly compatibleDomains: readonly string[];
  readonly compatibleLifecycleStates: readonly string[];
  readonly phaseLineage: readonly string[];
  readonly aiFree: true;
});
