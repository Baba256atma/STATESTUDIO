/**
 * NPA-T NMI:6 — compose a bounded Management Context → Stage projection.
 * Reuses NMI:2 branch extraction, NMI:3 interpretations, NMI:4 roadmap.
 * Does not write Stage state, coordinates, or scene intents.
 */

import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";
import type { ManagementMap } from "./nmiManagementMapContract.ts";
import { extractNmiManagementBranch } from "./nmiManagementMapBranch.ts";
import { composeNmiDecisionRoadmap } from "./nmiDecisionRoadmapCompose.ts";
import type { NmiComparisonRef } from "./nmiDecisionRoadmapContract.ts";
import { interpretNmiRelationships } from "./nmiRelationshipIntelligenceInterpret.ts";
import { composeNmiRelationshipGapReport } from "./nmiRelationshipIntelligenceQuery.ts";
import type { NmiNodeKind } from "./nmiContract.ts";
import type { NmiVaiCausalOverlay } from "./nmiRelationshipIntelligenceContract.ts";
import {
  NMI_STAGE_PROJECTION_BUDGET,
  type NmiStageProjection,
  type NmiStageProjectionNodeRef,
  type NmiStageProjectionRelevanceTier,
  type NmiStageProjectionRelationshipRef,
  type NmiStageProjectionSource,
} from "./nmiStageProjectionContract.ts";
import { nmiStageProjectionIdentity } from "./nmiStageProjectionIdentity.ts";

export type NmiStageProjectionComposeInput = {
  readonly projectionId: string;
  readonly selectedCanonicalId: string;
  readonly source: NmiStageProjectionSource;
  readonly map: ManagementMap;
  readonly comparisonRefs?: readonly NmiComparisonRef[];
  readonly vaiOverlays?: readonly NmiVaiCausalOverlay[];
  readonly staleQueueSelectedId?: string | null;
  readonly staleStageFocusedId?: string | null;
  readonly staleAdvisorSubjectId?: string | null;
  readonly compositionProvenance?: readonly string[];
};

const SUPPORTING_KINDS: ReadonlySet<NmiNodeKind> = new Set([
  "DATA_EVIDENCE",
  "KPI",
  "LEARNING",
  "VARIABLE",
]);

function neighbors(map: ManagementMap, nodeId: string): readonly string[] {
  const ids = new Set<string>();
  for (const rel of map.relationships) {
    if (rel.fromId === nodeId) ids.add(rel.toId);
    if (rel.toId === nodeId) ids.add(rel.fromId);
  }
  return Object.freeze([...ids].sort((a, b) => a.localeCompare(b)));
}

function takeBudget(
  ids: readonly string[],
  limit: number,
): { readonly kept: readonly string[]; readonly omitted: readonly string[] } {
  const unique = [...new Set(ids)].sort((a, b) => a.localeCompare(b));
  return {
    kept: Object.freeze(unique.slice(0, limit)),
    omitted: Object.freeze(unique.slice(limit)),
  };
}

export function resolveNmiExplicitSelection(input: {
  readonly explicitCanonicalId: string;
  readonly staleQueueSelectedId?: string | null;
  readonly staleStageFocusedId?: string | null;
  readonly staleAdvisorSubjectId?: string | null;
  readonly staleComparisonId?: string | null;
}): string {
  void input.staleQueueSelectedId;
  void input.staleStageFocusedId;
  void input.staleAdvisorSubjectId;
  void input.staleComparisonId;
  return input.explicitCanonicalId;
}

export function nmiProjectionReferentForUtterance(
  _utterance: string,
  currentCanonicalId: string,
  projection: NmiStageProjection,
): string {
  void _utterance;
  void projection.contextCollectionIds;
  return currentCanonicalId;
}

export function composeNmiStageProjection(input: NmiStageProjectionComposeInput): NmiStageProjection {
  const selectedCanonicalId = resolveNmiExplicitSelection({
    explicitCanonicalId: input.selectedCanonicalId,
    staleQueueSelectedId: input.staleQueueSelectedId,
    staleStageFocusedId: input.staleStageFocusedId,
    staleAdvisorSubjectId: input.staleAdvisorSubjectId,
  });
  const origin = input.map.nodes.find((node) => node.nodeId === selectedCanonicalId) ?? null;
  const branch = extractNmiManagementBranch(input.map, { originNodeId: selectedCanonicalId, maxDepth: 4 });
  const branchIds = new Set(branch.nodes.map((node) => node.nodeId));
  const directIds = new Set(neighbors(input.map, selectedCanonicalId).filter((id) => branchIds.has(id)));
  const interpretations = interpretNmiRelationships(input.map, input.vaiOverlays ?? []).filter(
    (item) => branchIds.has(item.sourceId) && branchIds.has(item.targetId),
  );
  let decisionRoadmapRef: string | null = null;
  const roadmapIds = new Set<string>();
  if (origin) {
    const roadmap = composeNmiDecisionRoadmap({
      roadmapId: `nmi6:roadmap:${selectedCanonicalId}`,
      map: input.map,
      anchorNodeId: selectedCanonicalId,
      vaiOverlays: input.vaiOverlays,
      comparisonRefs: input.comparisonRefs,
    });
    decisionRoadmapRef = roadmap.roadmapId;
    for (const stage of roadmap.stages) {
      if (stage.stage === "CONTEXT") continue;
      for (const element of stage.elements) {
        const id = element.canonicalRef?.id;
        if (id && branchIds.has(id) && id !== selectedCanonicalId && !directIds.has(id)) {
          roadmapIds.add(id);
        }
      }
    }
  }

  const remainingSupporting = branch.nodes
    .filter(
      (node) =>
        node.nodeId !== selectedCanonicalId &&
        !directIds.has(node.nodeId) &&
        !roadmapIds.has(node.nodeId) &&
        SUPPORTING_KINDS.has(node.kind),
    )
    .map((node) => node.nodeId);

  const primary = takeBudget(origin ? [selectedCanonicalId] : [], NMI_STAGE_PROJECTION_BUDGET.primary);
  const direct = takeBudget([...directIds], NMI_STAGE_PROJECTION_BUDGET.direct);
  const roadmap = takeBudget([...roadmapIds], NMI_STAGE_PROJECTION_BUDGET.roadmap);
  const supporting = takeBudget(remainingSupporting, NMI_STAGE_PROJECTION_BUDGET.supporting);

  const ordered: { readonly id: string; readonly relevance: NmiStageProjectionRelevanceTier }[] = [];
  const seen = new Set<string>();
  const push = (ids: readonly string[], relevance: NmiStageProjectionRelevanceTier) => {
    for (const id of ids) {
      if (seen.has(id)) continue;
      if (ordered.length >= NMI_STAGE_PROJECTION_BUDGET.maxNodes) return;
      seen.add(id);
      ordered.push({ id, relevance });
    }
  };
  push(primary.kept, "PRIMARY");
  push(direct.kept, "DIRECT");
  push(roadmap.kept, "ROADMAP");
  push(supporting.kept, "SUPPORTING");

  const keptIds = new Set(ordered.map((item) => item.id));
  const omittedNodeIds = Object.freeze(
    [
      ...primary.omitted,
      ...direct.omitted,
      ...roadmap.omitted,
      ...supporting.omitted,
      ...branch.nodes.map((node) => node.nodeId).filter((id) => !keptIds.has(id) && id !== selectedCanonicalId),
    ]
      .filter((id, index, all) => all.indexOf(id) === index && !keptIds.has(id))
      .sort((a, b) => a.localeCompare(b)),
  );

  const byId = new Map(input.map.nodes.map((node) => [node.nodeId, node]));
  const mapNodeRefs: readonly NmiStageProjectionNodeRef[] = Object.freeze(
    ordered
      .map((item) => {
        const node = byId.get(item.id);
        if (!node) return null;
        return Object.freeze({
          nodeId: node.nodeId,
          canonicalRef: node.canonicalRef,
          kind: node.kind,
          title: node.title,
          relevance: item.relevance,
        });
      })
      .filter((item): item is NmiStageProjectionNodeRef => item != null),
  );

  const relationshipRefs: readonly NmiStageProjectionRelationshipRef[] = Object.freeze(
    interpretations
      .filter((item) => keptIds.has(item.sourceId) && keptIds.has(item.targetId))
      .map((item) =>
        Object.freeze({
          relationshipId: item.relationshipId,
          fromId: item.sourceId,
          toId: item.targetId,
          kind: item.kind,
          epistemicStatus: item.epistemicStatus,
          causal: false as const,
          causalCommunication: item.causalCommunication,
          convertsAssociationToCause: false as const,
        }),
      ),
  );

  const gaps =
    origin?.kind === "PROBLEM" || origin?.kind === "RISK"
      ? composeNmiRelationshipGapReport(input.map, selectedCanonicalId, input.vaiOverlays ?? []).gaps
      : Object.freeze([]);

  const contextCollectionIds = Object.freeze(
    mapNodeRefs.filter((item) => item.kind === "SCENARIO" && item.relevance !== "PRIMARY").map((item) => item.nodeId),
  );
  const evidenceRefs = Object.freeze(
    [...new Set(interpretations.flatMap((item) => [...item.evidenceRefs]))].sort((a, b) => a.localeCompare(b)),
  );
  const provenanceRefs = Object.freeze(
    [...new Set([...input.map.compositionProvenance, ...interpretations.flatMap((item) => [...item.provenance])])].sort(
      (a, b) => a.localeCompare(b),
    ),
  );

  return Object.freeze({
    identity: nmiStageProjectionIdentity,
    projectionId: input.projectionId,
    selectedCanonicalId,
    projectionAnchorId: selectedCanonicalId,
    selectedNodeKind: origin?.kind ?? null,
    managementContext: input.map.contextKind,
    source: input.source,
    mapNodeRefs,
    relationshipRefs,
    decisionRoadmapRef,
    comparisonRefs: Object.freeze([...(input.comparisonRefs ?? [])]),
    evidenceRefs,
    provenanceRefs,
    unresolvedRelationshipIds: Object.freeze([
      ...new Set([
        ...branch.unresolvedRelationshipIds,
        ...interpretations.filter((item) => item.unresolvedReason != null).map((item) => item.relationshipId),
      ]),
    ]),
    relationshipGaps: gaps,
    omittedNodeIds,
    omittedCount: omittedNodeIds.length,
    truncated: omittedNodeIds.length > 0,
    suggestedManagementFocus: selectedCanonicalId,
    contextCollectionIds,
    collectionOwnsReferent: false,
    comparisonOwnsAnchor: false,
    projectionProvenance: Object.freeze([
      ...(input.compositionProvenance ?? [`nmi:stage-projection:${input.projectionId}`]),
      `nmi:map:${input.map.mapId}`,
      nmiStageProjectionIdentity,
      DirectorFoundationId,
    ]),
    presentationAuthority: DirectorFoundationId,
    stageWriter: "selectNexoraMVPInteractionSubject",
    nmiWroteStage: false,
    nmiWroteCoordinates: false,
    nmiOwnsLayout: false,
    nmiOwnsSceneIntent: false,
    secondDirector: false,
    secondStage: false,
    secondFocusRegistry: false,
    mutatesUnifiedManagementModel: false,
    writesDataReality: false,
    bypassesGate: false,
    readsSealedRmsGroundTruth: false,
    replacesAdvisor: false,
    startsNmi7: false,
    startsDthExp: false,
  });
}

export function rejectSealedRmsProjectionFact(factId: string): {
  readonly factId: string;
  readonly known: false;
  readonly displayed: false;
  readonly readsSealedRmsGroundTruth: false;
} {
  return Object.freeze({
    factId,
    known: false as const,
    displayed: false as const,
    readsSealedRmsGroundTruth: false as const,
  });
}
