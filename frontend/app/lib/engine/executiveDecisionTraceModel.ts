import { ExecutiveDecisionOutputRegistry } from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionModelDescriptor } from "./executiveDecisionModelTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Model" as const;

/**
 * Decision trace structural model — lineage metadata only.
 * Does not inspect source, execute phases, reconstruct reasoning, or generate explanations.
 */
export const ExecutiveDecisionTraceModel = Object.freeze({
  id: "eng-7-model-executive-decision-trace",
  name: "ExecutiveDecisionTrace",
  description:
    "Canonical structural model describing executive decision lineage across prior Engine phases.",
  namespace: NAMESPACE,
  owner: "ENG-7",
  sourcePhase: "ENG-7:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "traceId",
    "decisionReference",
    "requestReference",
    "intentReference",
    "resolvedIntentReference",
    "contextReference",
    "planReference",
    "reasoningOutcomeReferences",
    "evidenceReferences",
    "assumptionReferences",
    "constraintReferences",
    "alternativeReferences",
    "selectionRationaleReference",
    "rejectionRationaleReferences",
    "confidenceReference",
    "riskReference",
    "tradeoffReference",
    "approvalReference",
    "publicationReference",
    "phaseLineage",
    "modelVersions",
    "registryVersions",
    "owner",
    "metadataOnly",
  ] as const),
  registryDependencies: Object.freeze([
    ExecutiveDecisionOutputRegistry.find(({ name }) => name === "DecisionTrace")!.id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-7-model-executive-decision",
    "eng-7-model-executive-decision-alternative",
    "eng-7-model-executive-decision-confidence",
    "eng-7-model-executive-decision-risk-profile",
    "eng-7-model-executive-decision-tradeoff-profile",
    "eng-7-model-executive-decision-publication-metadata",
  ] as const),
  phaseLineage: Object.freeze([
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
    "ENG-7",
  ] as const),
  relationshipChain: Object.freeze([
    "Request Reference",
    "Intent Reference",
    "Resolved Intent Reference",
    "Context Reference",
    "Plan Reference",
    "Reasoning Outcome References",
    "Alternative Set",
    "Executive Decision",
  ] as const),
  decisionAttachments: Object.freeze([
    "Confidence",
    "Risk Profile",
    "Trade-off Profile",
    "Impact Profile",
    "Decision Trace",
    "Recommendation Package",
    "Publication Metadata",
  ] as const),
  prohibitedBehaviors: Object.freeze([
    "source code inspection",
    "phase execution",
    "reasoning reconstruction",
    "explanation generation",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionModelDescriptor & {
  readonly version: "1.0.0";
  readonly phaseLineage: readonly string[];
  readonly relationshipChain: readonly string[];
  readonly decisionAttachments: readonly string[];
  readonly prohibitedBehaviors: readonly string[];
  readonly aiFree: true;
});
