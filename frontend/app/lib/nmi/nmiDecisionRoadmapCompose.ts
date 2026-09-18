/**
 * NPA-T NMI:4 — compose a read-only Decision Roadmap from NMI:1–3 state.
 * Descriptive journey only. Does not approve Decisions or start Executions.
 */

import type { ManagementMap, ManagementMapNode } from "./nmiManagementMapContract.ts";
import type { NmiCanonicalRef, NmiNodeKind } from "./nmiContract.ts";
import { extractNmiRelationshipChain } from "./nmiRelationshipIntelligenceChain.ts";
import { interpretNmiRelationships } from "./nmiRelationshipIntelligenceInterpret.ts";
import { composeNmiRelationshipGapReport } from "./nmiRelationshipIntelligenceQuery.ts";
import type { ManagementRelationshipIntelligence, NmiVaiCausalOverlay } from "./nmiRelationshipIntelligenceContract.ts";
import {
  NMI_ROADMAP_STAGES,
  type NmiComparisonRef,
  type NmiDecisionRoadmap,
  type NmiRoadmapBranch,
  type NmiRoadmapConvergence,
  type NmiRoadmapElement,
  type NmiRoadmapGap,
  type NmiRoadmapKnowledgeKind,
  type NmiRoadmapPossibleNext,
  type NmiRoadmapPosition,
  type NmiRoadmapStage,
  type NmiRoadmapStageStatus,
  type NmiRoadmapStageView,
} from "./nmiDecisionRoadmapContract.ts";
import { nmiDecisionRoadmapIdentity } from "./nmiDecisionRoadmapIdentity.ts";

export type NmiDecisionRoadmapComposeInput = {
  readonly roadmapId: string;
  readonly map: ManagementMap;
  readonly anchorNodeId: string;
  readonly vaiOverlays?: readonly NmiVaiCausalOverlay[];
  readonly comparisonRefs?: readonly NmiComparisonRef[];
  readonly compositionProvenance?: readonly string[];
};

const STAGE_KINDS: Readonly<Record<NmiRoadmapStage, readonly NmiNodeKind[]>> = Object.freeze({
  CONTEXT: Object.freeze(["BUSINESS_PROJECT", "MANAGER_ROLE"] as const),
  GOAL: Object.freeze(["GOAL"] as const),
  OPERATION: Object.freeze(["PROCESS"] as const),
  KPI_DATA: Object.freeze(["KPI", "DATA_EVIDENCE"] as const),
  ISSUE: Object.freeze(["PROBLEM", "RISK"] as const),
  ANALYSIS: Object.freeze(["VARIABLE"] as const),
  SCENARIO: Object.freeze(["SCENARIO"] as const),
  COMPARISON: Object.freeze([] as const),
  DECISION: Object.freeze(["DECISION"] as const),
  EXECUTION: Object.freeze(["EXECUTION"] as const),
  OUTCOME: Object.freeze(["OUTCOME"] as const),
  LEARNING_REASSESSMENT: Object.freeze(["LEARNING"] as const),
});

const JOURNEY_AFTER_ISSUE: readonly NmiRoadmapStage[] = Object.freeze([
  "SCENARIO",
  "COMPARISON",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "LEARNING_REASSESSMENT",
]);

function knowledgeKind(node: ManagementMapNode, interpretations: readonly ManagementRelationshipIntelligence[]): NmiRoadmapKnowledgeKind {
  if (node.kind === "KPI") return "CALCULATED_METRIC";
  if (node.kind === "DATA_EVIDENCE") {
    if (node.knownStatus === "UNRESOLVED") return "UNKNOWN";
    return "OBSERVED_EVIDENCE";
  }
  if (node.kind === "DECISION") return "DECISION";
  if (node.kind === "EXECUTION") return "EXECUTION";
  if (node.kind === "OUTCOME") return "OBSERVED_OUTCOME";
  if (node.kind === "VARIABLE") {
    const rel = interpretations.find((item) => item.sourceId === node.nodeId || item.targetId === node.nodeId);
    if (rel?.causalCommunication === "CONFIRMED_CAUSAL_RELATIONSHIP") return "SUPPORTED_CAUSAL_RELATIONSHIP";
    if (rel?.causalCommunication === "SUPPORTED_CAUSAL_HYPOTHESIS") return "HYPOTHESIS";
    return "ANALYTICAL_RELATIONSHIP";
  }
  if (node.knownStatus === "MANAGER_CONFIRMED") return "MANAGER_CONFIRMED";
  if (node.kind === "GOAL" || node.kind === "PROBLEM" || node.kind === "PROCESS") return "KNOWN_FACT";
  return "UNKNOWN";
}

function collectConnectedIds(map: ManagementMap, anchorNodeId: string, overlays: readonly NmiVaiCausalOverlay[]): Set<string> {
  const chain = extractNmiRelationshipChain(map, { originNodeId: anchorNodeId, maxHops: 8 }, overlays);
  const ids = new Set<string>([anchorNodeId]);
  for (const hop of chain.hops) {
    ids.add(hop.fromNodeId);
    ids.add(hop.toNodeId);
    ids.add(hop.semanticSourceId);
    ids.add(hop.semanticTargetId);
  }
  return ids;
}

function toElement(
  node: ManagementMapNode,
  interpretations: readonly ManagementRelationshipIntelligence[],
): NmiRoadmapElement {
  const related = interpretations.filter((item) => item.sourceId === node.nodeId || item.targetId === node.nodeId);
  return Object.freeze({
    elementId: node.nodeId,
    canonicalRef: node.canonicalRef,
    comparisonId: null,
    authority: node.canonicalRef.authority,
    relationshipIds: Object.freeze(related.map((item) => item.relationshipId).sort()),
    provenance: node.provenance,
    knowledgeKind: knowledgeKind(node, interpretations),
    causalCommunication: related.find((item) => item.causalCommunication)?.causalCommunication ?? null,
    title: node.title,
    knownStatus: node.knownStatus,
  });
}

function comparisonElements(
  refs: readonly NmiComparisonRef[],
  scenarioIds: ReadonlySet<string>,
  provenance: readonly string[],
): readonly NmiRoadmapElement[] {
  return Object.freeze(
    refs
      .filter((item) => item.scenarioIds.some((id) => scenarioIds.has(id)))
      .map((item) =>
        Object.freeze({
          elementId: item.comparisonId,
          canonicalRef: null,
          comparisonId: item.comparisonId,
          authority: item.authority,
          relationshipIds: Object.freeze([]),
          provenance: Object.freeze([item.authority, item.sourceRef, ...provenance]),
          knowledgeKind: "KNOWN_FACT" as const,
          causalCommunication: null,
          title: null,
          knownStatus: null,
        }),
      ),
  );
}

function isReached(status: NmiRoadmapStageStatus): boolean {
  return status === "PRESENT" || status === "PARTIAL" || status === "UNRESOLVED";
}

type PendingStatus = NmiRoadmapStageStatus | "EMPTY_PENDING";

function resolveStatus(input: {
  readonly stage: NmiRoadmapStage;
  readonly elements: readonly NmiRoadmapElement[];
  readonly scenarioCount: number;
  readonly hasUnresolvedEvidence: boolean;
  readonly analysisPartial: boolean;
  readonly kpiWithoutData: boolean;
}): PendingStatus {
  const { stage, elements } = input;
  if (stage === "COMPARISON") {
    if (input.scenarioCount < 2) return "NOT_APPLICABLE";
    if (elements.length > 0) return "PRESENT";
    return "MISSING";
  }
  if (elements.length === 0) return "EMPTY_PENDING";
  if (stage === "KPI_DATA" && input.hasUnresolvedEvidence) return "UNRESOLVED";
  if (stage === "KPI_DATA" && input.kpiWithoutData) return "PARTIAL";
  if (stage === "ANALYSIS" && input.analysisPartial) return "PARTIAL";
  if (stage === "ISSUE" && elements.length > 0) return "PRESENT";
  return "PRESENT";
}

function finalizeEmptyStatus(
  stage: NmiRoadmapStage,
  reachedPrimary: NmiRoadmapStage | null,
): NmiRoadmapStageStatus {
  const order = NMI_ROADMAP_STAGES;
  if (!reachedPrimary) {
    if (stage === "CONTEXT") return "PRESENT";
    return "NOT_REACHED";
  }
  const currentIdx = order.indexOf(reachedPrimary);
  const stageIdx = order.indexOf(stage);
  if (stage === "KPI_DATA" || stage === "OPERATION" || stage === "ANALYSIS") {
    if (stageIdx <= currentIdx || reachedPrimary === "GOAL" || reachedPrimary === "ISSUE" || reachedPrimary === "ANALYSIS") {
      if (stageIdx < currentIdx || (reachedPrimary === "GOAL" && stage === "KPI_DATA")) return "MISSING";
      if (reachedPrimary === "ISSUE" && (stage === "KPI_DATA" || stage === "ANALYSIS")) return "MISSING";
    }
  }
  if (JOURNEY_AFTER_ISSUE.includes(stage) && stageIdx > currentIdx) return "NOT_REACHED";
  if (stageIdx > currentIdx) return "NOT_REACHED";
  return "MISSING";
}

function currentPosition(stages: readonly NmiRoadmapStageView[]): NmiRoadmapPosition {
  const reached = stages.filter((item) => isReached(item.status));
  const last = reached[reached.length - 1];
  const analysis = stages.find((item) => item.stage === "ANALYSIS");
  const comparison = stages.find((item) => item.stage === "COMPARISON");
  if (!last) {
    return Object.freeze({
      primary: "CONTEXT",
      secondary: null,
      descriptive: true as const,
      advancesCanonicalWorkflow: false as const,
    });
  }
  if (last.stage === "ISSUE" && analysis && (analysis.status === "PARTIAL" || analysis.status === "PRESENT")) {
    return Object.freeze({
      primary: "ISSUE",
      secondary: "ANALYSIS",
      descriptive: true as const,
      advancesCanonicalWorkflow: false as const,
    });
  }
  if (last.stage === "ANALYSIS") {
    return Object.freeze({
      primary: "ISSUE",
      secondary: "ANALYSIS",
      descriptive: true as const,
      advancesCanonicalWorkflow: false as const,
    });
  }
  if (last.stage === "COMPARISON" || (last.stage === "SCENARIO" && comparison?.status === "PRESENT")) {
    return Object.freeze({
      primary: "SCENARIO",
      secondary: comparison?.status === "PRESENT" ? "COMPARISON" : null,
      descriptive: true as const,
      advancesCanonicalWorkflow: false as const,
    });
  }
  return Object.freeze({
    primary: last.stage,
    secondary: null,
    descriptive: true as const,
    advancesCanonicalWorkflow: false as const,
  });
}

function possibleNext(position: NmiRoadmapPosition, stages: readonly NmiRoadmapStageView[]): readonly NmiRoadmapPossibleNext[] {
  const next: NmiRoadmapStage[] = [];
  if (position.primary === "ISSUE" || position.secondary === "ANALYSIS") {
    const analysis = stages.find((item) => item.stage === "ANALYSIS");
    const scenario = stages.find((item) => item.stage === "SCENARIO");
    if (analysis && (analysis.status === "MISSING" || analysis.status === "PARTIAL" || analysis.status === "NOT_REACHED")) {
      next.push("ANALYSIS");
    }
    if (scenario && (scenario.status === "NOT_REACHED" || scenario.status === "MISSING")) next.push("SCENARIO");
  } else if (position.primary === "SCENARIO") {
    const comparison = stages.find((item) => item.stage === "COMPARISON");
    const decision = stages.find((item) => item.stage === "DECISION");
    if (comparison && comparison.status === "MISSING") next.push("COMPARISON");
    if (decision && (decision.status === "NOT_REACHED" || decision.status === "MISSING")) next.push("DECISION");
  } else if (position.primary === "COMPARISON") {
    next.push("DECISION");
  } else if (position.primary === "DECISION") {
    next.push("EXECUTION");
  } else if (position.primary === "EXECUTION") {
    next.push("OUTCOME");
  } else if (position.primary === "OUTCOME") {
    next.push("LEARNING_REASSESSMENT");
  } else if (position.primary === "GOAL") {
    const kpi = stages.find((item) => item.stage === "KPI_DATA");
    if (kpi && (kpi.status === "MISSING" || kpi.status === "PARTIAL")) next.push("KPI_DATA");
  }
  const unique = [...new Set(next)].filter((stage) => {
    const view = stages.find((item) => item.stage === stage);
    return view && view.status !== "NOT_APPLICABLE" && view.status !== "PRESENT";
  });
  return Object.freeze(
    unique.map((stage) =>
      Object.freeze({ stage, descriptive: true as const, requiredAction: false as const }),
    ),
  );
}

export function composeNmiDecisionRoadmap(input: NmiDecisionRoadmapComposeInput): NmiDecisionRoadmap {
  const overlays = input.vaiOverlays ?? [];
  const comparisons = input.comparisonRefs ?? [];
  const provenance = Object.freeze([
    ...(input.compositionProvenance ?? [`nmi:roadmap:compose:${input.roadmapId}`]),
    `nmi:map:${input.map.mapId}`,
  ]);
  const anchor = input.map.nodes.find((node) => node.nodeId === input.anchorNodeId);
  if (!anchor) {
    throw new Error(`NMI:4 anchor ${input.anchorNodeId} is not on the Management Map`);
  }
  const connected = collectConnectedIds(input.map, input.anchorNodeId, overlays);
  for (const node of input.map.nodes) {
    if (node.kind === "BUSINESS_PROJECT" || node.kind === "MANAGER_ROLE") connected.add(node.nodeId);
  }
  const connectedNodes = input.map.nodes.filter((node) => connected.has(node.nodeId));
  const interpretations = interpretNmiRelationships(input.map, overlays).filter(
    (item) => connected.has(item.sourceId) || connected.has(item.targetId),
  );
  const scenarioNodes = connectedNodes.filter((node) => node.kind === "SCENARIO");
  const scenarioIds = new Set(scenarioNodes.map((node) => node.nodeId));
  const kpiNodes = connectedNodes.filter((node) => node.kind === "KPI");
  const dataNodes = connectedNodes.filter((node) => node.kind === "DATA_EVIDENCE");
  const hasUnresolvedEvidence =
    dataNodes.some((node) => node.knownStatus === "UNRESOLVED") ||
    interpretations.some((item) => item.kind === "evidenced_by" && item.epistemicStatus === "UNKNOWN");
  const kpiWithoutData = kpiNodes.length > 0 && dataNodes.length === 0;
  const analysisRels = interpretations.filter((item) => item.managementClass === "ANALYTICAL");
  const analysisPartial =
    connectedNodes.some((node) => node.kind === "VARIABLE") &&
    !analysisRels.some((item) => item.causalCommunication === "CONFIRMED_CAUSAL_RELATIONSHIP");

  const pending = NMI_ROADMAP_STAGES.map((stage) => {
    const kinds = STAGE_KINDS[stage];
    const nodes = connectedNodes.filter((node) => kinds.includes(node.kind));
    const elements =
      stage === "COMPARISON"
        ? comparisonElements(comparisons, scenarioIds, provenance)
        : Object.freeze(nodes.map((node) => toElement(node, interpretations)));
    const status: PendingStatus = resolveStatus({
      stage,
      elements,
      scenarioCount: scenarioNodes.length,
      hasUnresolvedEvidence,
      analysisPartial,
      kpiWithoutData,
    });
    return { stage, elements, status, nodes };
  });

  const provisionalReached = pending
    .filter((item) => item.status !== "EMPTY_PENDING" && item.status !== "NOT_APPLICABLE" && item.status !== "MISSING")
    .map((item) => item.stage);
  const lastReached = provisionalReached[provisionalReached.length - 1] ?? null;

  const stages: NmiRoadmapStageView[] = pending.map((item) => {
    const status: NmiRoadmapStageStatus =
      item.status === "EMPTY_PENDING" ? finalizeEmptyStatus(item.stage, lastReached) : item.status;
    const relationshipIds = Object.freeze(
      interpretations
        .filter((rel) => item.elements.some((el) => el.elementId === rel.sourceId || el.elementId === rel.targetId))
        .map((rel) => rel.relationshipId)
        .sort()
        .filter((id, index, all) => all.indexOf(id) === index),
    );
    return Object.freeze({ stage: item.stage, status, elements: item.elements, relationshipIds });
  });

  const position = currentPosition(stages);
  const problemNode = connectedNodes.find((node) => node.kind === "PROBLEM");
  const nmi3Gaps = problemNode ? composeNmiRelationshipGapReport(input.map, problemNode.nodeId, overlays) : null;
  const gaps: NmiRoadmapGap[] = [];
  for (const view of stages) {
    if (view.status === "MISSING") {
      gaps.push(
        Object.freeze({
          gapId: `roadmap:${input.roadmapId}:${view.stage}:missing`,
          stage: view.stage,
          reason: view.stage === "COMPARISON" ? ("COMPARISON_MISSING" as const) : ("STAGE_MISSING" as const),
          detail: `${view.stage} missing`,
          requiresAttention: false as const,
          inventedRelationship: false as const,
        }),
      );
    }
    if (view.status === "NOT_REACHED") {
      gaps.push(
        Object.freeze({
          gapId: `roadmap:${input.roadmapId}:${view.stage}:not-reached`,
          stage: view.stage,
          reason: "STAGE_NOT_REACHED" as const,
          detail: `${view.stage} not reached`,
          requiresAttention: false as const,
          inventedRelationship: false as const,
        }),
      );
    }
    if (view.status === "UNRESOLVED") {
      gaps.push(
        Object.freeze({
          gapId: `roadmap:${input.roadmapId}:${view.stage}:unresolved`,
          stage: view.stage,
          reason: "MISSING_EVIDENCE" as const,
          detail: `${view.stage} unresolved`,
          requiresAttention: false as const,
          inventedRelationship: false as const,
        }),
      );
    }
  }
  if (nmi3Gaps) {
    for (const gap of nmi3Gaps.gaps) {
      gaps.push(
        Object.freeze({
          gapId: `nmi3:${gap.gapId}`,
          stage: "ISSUE" as const,
          reason: gap.reason,
          detail: gap.detail,
          requiresAttention: false as const,
          inventedRelationship: false as const,
        }),
      );
    }
  }

  const branches: NmiRoadmapBranch[] =
    scenarioNodes.length > 1
      ? [
          Object.freeze({
            fromStage: "SCENARIO" as const,
            elementIds: Object.freeze(scenarioNodes.map((node) => node.nodeId).sort()),
            prefersScenario: false as const,
          }),
        ]
      : [];

  const convergences: NmiRoadmapConvergence[] = [];
  const comparisonStage = stages.find((item) => item.stage === "COMPARISON");
  if (comparisonStage && comparisonStage.status === "PRESENT") {
    convergences.push(
      Object.freeze({
        fromElementIds: Object.freeze(scenarioNodes.map((node) => node.nodeId).sort()),
        toStage: "COMPARISON" as const,
        canonical: true as const,
      }),
    );
  }
  const selected = interpretations.filter((item) => item.kind === "selected_as");
  for (const rel of selected) {
    if (scenarioIds.has(rel.targetId)) {
      convergences.push(
        Object.freeze({
          fromElementIds: Object.freeze([rel.targetId]),
          toStage: "DECISION" as const,
          canonical: true as const,
        }),
      );
    }
  }

  const anchorRef: NmiCanonicalRef = anchor.canonicalRef;
  return Object.freeze({
    identity: nmiDecisionRoadmapIdentity,
    roadmapId: input.roadmapId,
    contextId: input.map.contextId,
    contextKind: input.map.contextKind,
    contextAuthority: "BCA:1/BusinessProjectContextFoundation",
    anchorRef,
    sourceMap: input.map,
    stages: Object.freeze(stages),
    currentPosition: position,
    possibleNextStages: possibleNext(position, stages),
    gaps: Object.freeze(gaps),
    branches: Object.freeze(branches),
    convergences: Object.freeze(convergences),
    compositionProvenance: provenance,
    mutatesStage: false,
    mutatesQueue: false,
    mutatesObjects: false,
    writesDataReality: false,
    bypassesGate: false,
    createsCausalCertainty: false,
    approvesDecisions: false,
    startsExecutions: false,
    decidesAttention: false,
    requiredAction: false,
    projectsOntoStage: false,
    startsNmi5: false,
    readsSealedRmsGroundTruth: false,
  });
}

export function rejectSealedRmsRoadmapFact(factId: string): {
  readonly factId: string;
  readonly known: false;
  readonly readsSealedRmsGroundTruth: false;
} {
  return Object.freeze({
    factId,
    known: false as const,
    readsSealedRmsGroundTruth: false as const,
  });
}
