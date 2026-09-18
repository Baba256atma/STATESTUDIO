/**
 * NPA-T NMI:1 — compose a read-only UnifiedManagementModel from canonical references.
 * Does not infer missing structure or promote epistemic status.
 */

import type { BusinessProjectContextKind } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";
import { getNmiFoundationIdentity, nmiFoundationIdentity } from "./nmiIdentity.ts";
import {
  NMI_FOUNDATION_CONTRACT,
  type NmiCanonicalRef,
  type NmiContextKind,
  type NmiNodeKind,
  type UnifiedManagementModel,
} from "./nmiContract.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY, type NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";

export type NmiComposeInput = {
  readonly modelId: string;
  readonly contextId: string;
  readonly contextKind: NmiContextKind;
  readonly businessProjectRef?: NmiCanonicalRef | null;
  readonly managerRoleRef?: NmiCanonicalRef | null;
  readonly nodes?: readonly NmiCanonicalRef[];
  readonly relationships?: readonly NmiManagementRelationship[];
  readonly unresolvedRelationshipIds?: readonly string[];
  readonly simulationStateIds?: readonly string[];
  readonly observedRealityIds?: readonly string[];
  readonly compositionProvenance?: readonly string[];
};

const ALL_NODE_KINDS: readonly NmiNodeKind[] = Object.freeze([
  "BUSINESS_PROJECT",
  "MANAGER_ROLE",
  "GOAL",
  "PROCESS",
  "KPI",
  "DATA_EVIDENCE",
  "PROBLEM",
  "RISK",
  "VARIABLE",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "LEARNING",
]);

export function composeNmiUnifiedManagementModel(input: NmiComposeInput): UnifiedManagementModel {
  const nodes = Object.freeze([...(input.nodes ?? [])]);
  const present = new Set(nodes.map((node) => node.kind));
  if (input.businessProjectRef) present.add("BUSINESS_PROJECT");
  if (input.managerRoleRef) present.add("MANAGER_ROLE");
  const missingNodes = Object.freeze(ALL_NODE_KINDS.filter((kind) => !present.has(kind)));
  const relationships = Object.freeze(
    (input.relationships ?? []).map((item) =>
      Object.freeze({
        ...item,
        causal: false as const,
        convertsAssociationToCause: false as const,
        convertsAssumptionToFact: false as const,
      }),
    ),
  );
  const simulationStateIds = Object.freeze([...(input.simulationStateIds ?? [])]);
  const observedRealityIds = Object.freeze([...(input.observedRealityIds ?? [])]);
  return Object.freeze({
    identity: nmiFoundationIdentity,
    modelId: input.modelId,
    contextId: input.contextId,
    contextKind: input.contextKind,
    contextAuthority: "BCA:1/BusinessProjectContextFoundation",
    businessProjectRef: input.businessProjectRef ?? null,
    managerRoleRef: input.managerRoleRef ?? null,
    nodes,
    relationships,
    unresolvedRelationshipIds: Object.freeze([...(input.unresolvedRelationshipIds ?? [])]),
    missingNodes,
    compositionProvenance: Object.freeze([
      ...(input.compositionProvenance ?? [`nmi:compose:${input.modelId}`]),
    ]),
    simulationStateIds,
    observedRealityIds,
    mutatesStage: false,
    mutatesObjects: false,
    approvesDecisions: false,
    startsExecutions: false,
    writesOutcomes: false,
    writesLearning: false,
    writesDataReality: false,
    createsCausalCertainty: false,
    scenarioIsDecision: false,
    decisionIsExecution: false,
    executionIsOutcome: false,
    simulationIsObservedReality: false,
    decisionRoadmap: Object.freeze({
      implemented: false as const,
      allowsIncompletePaths: true as const,
      allowsMultiplePaths: true as const,
      allowsCompetingScenarios: true as const,
      allowsUnresolvedRelationships: true as const,
      allowsMissingEvidence: true as const,
      allowsNoDecision: true as const,
      allowsDecisionWithoutExecution: true as const,
      allowsExecutionWithoutOutcome: true as const,
      fabricatesMissingNodes: false as const,
    }),
    futureProjections: Object.freeze({
      managementMap: false as const,
      attention: false as const,
      queueUnchanged: true as const,
      stageRemainsCurrentBranch: true as const,
      advisorRemainsExplanation: true as const,
    }),
  });
}

export function verifyNmiFoundation(): { readonly ok: true; readonly identity: typeof nmiFoundationIdentity } {
  verifyNmiAuthorityBoundary();
  if (getNmiFoundationIdentity().id !== nmiFoundationIdentity) {
    throw new Error("NMI:1 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.startsNmi2 || NMI_FOUNDATION_CONTRACT.startsRms2) {
    throw new Error("NMI:1 must not start NMI:2 or RMS:2");
  }
  if (NMI_FOUNDATION_CONTRACT.managementMapImplemented || NMI_FOUNDATION_CONTRACT.attentionImplemented) {
    throw new Error("NMI:1 must not implement Management Map or Attention");
  }
  if (NMI_FOUNDATION_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:1 must not implement a Decision Roadmap engine");
  }
  if (NMI_FOUNDATION_CONTRACT.parallelContextClassifier) {
    throw new Error("NMI:1 must reuse BCA context kinds");
  }
  if (NMI_GATE_BOUNDARY.nmiGate || NMI_GATE_BOUNDARY.secondIngestionGateway) {
    throw new Error("NMI:1 must reuse the existing Gate API");
  }
  if (NMI_RMS_BOUNDARY.nmiIsSimulationEngine || NMI_RMS_BOUNDARY.rmsWritesNmiTruth) {
    throw new Error("NMI:1 must remain separate from RMS Ground Truth");
  }
  if (NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation) {
    throw new Error("NMI:1 must not convert correlation to causation");
  }
  if (NMI_AUTHORITY_BOUNDARY.queue !== "existing executive Queue (unchanged)") {
    throw new Error("NMI:1 must not redesign Queue");
  }
  return Object.freeze({ ok: true as const, identity: nmiFoundationIdentity });
}

export function isKnownNmiContextKind(kind: BusinessProjectContextKind): kind is Exclude<BusinessProjectContextKind, "UNKNOWN"> {
  return kind === "BUSINESS" || kind === "PROJECT" || kind === "HYBRID";
}
