/**
 * NPA-T NMI:7 — bounded read helpers over certified NMI:1–6.
 * Compose existing intelligence. Do not create parallel truth.
 */

import type { ManagementMap } from "./nmiManagementMapContract.ts";
import { extractNmiManagementBranch } from "./nmiManagementMapBranch.ts";
import { interpretNmiRelationships } from "./nmiRelationshipIntelligenceInterpret.ts";
import { composeNmiRelationshipGapReport } from "./nmiRelationshipIntelligenceQuery.ts";
import { composeNmiDecisionRoadmap } from "./nmiDecisionRoadmapCompose.ts";
import { explainNmiDecisionRoadmap } from "./nmiDecisionRoadmapExplain.ts";
import { composeNmiAttentionItems, explainNmiAttentionItem } from "./nmiAttentionCompose.ts";
import type { NmiAttentionItem, NmiQueueEntryInput, NmiQueueSubjectInput } from "./nmiManagementNavigationContract.ts";
import type { ManagementRelationshipIntelligence } from "./nmiRelationshipIntelligenceContract.ts";
import type { NmiAdvisorGapNote } from "./nmiAdvisorContract.ts";

export function locateSubjectInManagementMap(map: ManagementMap, canonicalId: string) {
  const node = map.nodes.find((item) => item.nodeId === canonicalId) ?? null;
  const branch = extractNmiManagementBranch(map, { originNodeId: canonicalId, maxDepth: 3 });
  return Object.freeze({
    present: node != null,
    nodeId: canonicalId,
    kind: node?.kind ?? null,
    title: node?.title ?? canonicalId,
    section: node?.section ?? null,
    contextKind: map.contextKind,
    branchNodeIds: branch.nodes.map((item) => item.nodeId),
    inventedRelationships: false as const,
  });
}

export function getRelatedManagementContext(map: ManagementMap, canonicalId: string): {
  readonly relatedIds: readonly string[];
  readonly interpretations: readonly ManagementRelationshipIntelligence[];
  readonly inventedRelationships: false;
} {
  const interpretations = interpretNmiRelationships(map).filter(
    (item) => item.sourceId === canonicalId || item.targetId === canonicalId,
  );
  const relatedIds = Object.freeze(
    [...new Set(interpretations.flatMap((item) => [item.sourceId, item.targetId]).filter((id) => id !== canonicalId))].sort(
      (a, b) => a.localeCompare(b),
    ),
  );
  return Object.freeze({
    relatedIds,
    interpretations,
    inventedRelationships: false as const,
  });
}

export function explainManagementRelationship(
  map: ManagementMap,
  fromId: string,
  toId: string,
): {
  readonly interpretation: ManagementRelationshipIntelligence | null;
  readonly causal: false;
  readonly convertsAssociationToCause: false;
} {
  const interpretation =
    interpretNmiRelationships(map).find(
      (item) =>
        (item.sourceId === fromId && item.targetId === toId) || (item.sourceId === toId && item.targetId === fromId),
    ) ?? null;
  return Object.freeze({
    interpretation,
    causal: false as const,
    convertsAssociationToCause: false as const,
  });
}

export function explainAttentionReason(
  queueEntries: readonly NmiQueueEntryInput[],
  subjects: readonly NmiQueueSubjectInput[] | undefined,
  map: ManagementMap,
  canonicalId: string,
): ReturnType<typeof explainNmiAttentionItem> | null {
  const items = composeNmiAttentionItems({ queueEntries, subjects, map });
  const item = items.find((entry) => entry.itemId === canonicalId) ?? null;
  return item ? explainNmiAttentionItem(item) : null;
}

export function summarizeDecisionRoadmap(map: ManagementMap, canonicalId: string) {
  const node = map.nodes.find((item) => item.nodeId === canonicalId);
  if (!node) {
    return Object.freeze({
      present: false as const,
      roadmapId: null,
      position: null,
      possibleNextStages: Object.freeze([]),
      requiredAction: false as const,
      unknown: Object.freeze([] as const),
      stageStatuses: Object.freeze({}),
    });
  }
  const roadmap = composeNmiDecisionRoadmap({
    roadmapId: `nmi7:roadmap:${canonicalId}`,
    map,
    anchorNodeId: canonicalId,
  });
  const explanation = explainNmiDecisionRoadmap(roadmap);
  const stageStatuses = Object.freeze(
    Object.fromEntries(roadmap.stages.map((stage) => [stage.stage, stage.status])),
  );
  return Object.freeze({
    present: true as const,
    roadmapId: roadmap.roadmapId,
    position: roadmap.currentPosition,
    possibleNextStages: roadmap.possibleNextStages,
    requiredAction: false as const,
    unknown: explanation.unknown,
    stageStatuses,
  });
}

export function identifyManagementGaps(map: ManagementMap, canonicalId: string): readonly NmiAdvisorGapNote[] {
  const report = composeNmiRelationshipGapReport(map, canonicalId);
  const notes: NmiAdvisorGapNote[] = report.gaps.map((gap) =>
    Object.freeze({
      label: gap.detail,
      status: gap.reason === "MISSING_EVIDENCE" ? ("UNRESOLVED" as const) : ("MISSING" as const),
    }),
  );
  const roadmap = summarizeDecisionRoadmap(map, canonicalId);
  for (const [stage, status] of Object.entries(roadmap.stageStatuses)) {
    if (status === "MISSING" || status === "UNRESOLVED" || status === "NOT_REACHED" || status === "NOT_APPLICABLE") {
      notes.push(Object.freeze({ label: stage, status }));
    }
  }
  return Object.freeze(notes);
}

export function findNmiAttentionItem(
  queueEntries: readonly NmiQueueEntryInput[],
  subjects: readonly NmiQueueSubjectInput[] | undefined,
  map: ManagementMap,
  canonicalId: string,
): NmiAttentionItem | null {
  return composeNmiAttentionItems({ queueEntries, subjects, map }).find((item) => item.itemId === canonicalId) ?? null;
}
