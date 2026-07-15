import {
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionTypeRegistry,
} from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Canonical alternative models — classification and structure only.
 * Rank position is descriptive metadata; no ranking logic.
 */
export const ExecutiveDecisionAlternativeModel = Object.freeze({
  id: "eng-7-model-executive-decision-alternative",
  name: "ExecutiveDecisionAlternative",
  description:
    "Canonical structural model for one executive decision alternative.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "alternativeId",
    "name",
    "description",
    "sourceReasoningReference",
    "associatedPlanReference",
    "applicableDomains",
    "compatibleDecisionTypes",
    "evidenceReferences",
    "constraintReferences",
    "impactReferences",
    "riskReferences",
    "tradeoffReferences",
    "rankPositionMetadata",
    "eligibilityStatus",
    "lifecycleState",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionDomainRegistry[0].id,
    ExecutiveDecisionTypeRegistry[0].id,
    ExecutiveDecisionLifecycleRegistry[0].id,
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "RankedAlternativeSet")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision-alternative-set",
    "eng-7-model-executive-decision-risk-profile",
    "eng-7-model-executive-decision-tradeoff-profile",
    "eng-7-model-executive-decision-impact-profile",
  ] as const),
  compatibleDomains: Object.freeze(ExecutiveDecisionDomainRegistry.map(({ id }) => id)),
  compatibleDecisionTypes: Object.freeze(ExecutiveDecisionTypeRegistry.map(({ id }) => id)),
  compatibleLifecycleStates: Object.freeze(ExecutiveDecisionLifecycleRegistry.map(({ id }) => id)),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly compatibleDomains: readonly string[];
  readonly compatibleDecisionTypes: readonly string[];
  readonly compatibleLifecycleStates: readonly string[];
  readonly aiFree: true;
});

export const ExecutiveDecisionAlternativeSetModel = Object.freeze({
  id: "eng-7-model-executive-decision-alternative-set",
  name: "ExecutiveDecisionAlternativeSet",
  description:
    "Canonical structural model for a set of executive decision alternatives.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "setId",
    "decisionReference",
    "alternativeReferences",
    "selectedAlternativeReference",
    "rejectedAlternativeReferences",
    "deferredAlternativeReferences",
    "supersededAlternativeReferences",
    "registryVersion",
    "modelVersion",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "RankedAlternativeSet")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
    "eng-7-model-executive-decision-alternative",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly aiFree: true;
});

export const ExecutiveDecisionAlternativeModels = Object.freeze({
  alternative: ExecutiveDecisionAlternativeModel,
  alternativeSet: ExecutiveDecisionAlternativeSetModel,
  models: Object.freeze([
    ExecutiveDecisionAlternativeModel,
    ExecutiveDecisionAlternativeSetModel,
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);
