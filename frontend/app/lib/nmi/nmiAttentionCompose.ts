/**
 * NPA-T NMI:5 — Attention projection from STAGE-PROD:1 Queue entries.
 * Does not mint Attention from map-only nodes or roadmap incompleteness.
 */

import type { ManagementMap } from "./nmiManagementMapContract.ts";
import type { NmiCanonicalRef, NmiContextKind, NmiNodeKind } from "./nmiContract.ts";
import { composeNmiDecisionRoadmap } from "./nmiDecisionRoadmapCompose.ts";
import { answerNmiManagementQuestion } from "./nmiRelationshipIntelligenceQuery.ts";
import type {
  NmiAttentionItem,
  NmiAttentionItemType,
  NmiAttentionReason,
  NmiQueueEntryInput,
  NmiQueueSubjectInput,
} from "./nmiManagementNavigationContract.ts";
import { NMI_ATTENTION_PROMOTION_RULE } from "./nmiManagementNavigationContract.ts";

const QUEUE_TO_NMI_KIND: Readonly<Partial<Record<NmiAttentionItemType, NmiNodeKind>>> = Object.freeze({
  problem: "PROBLEM",
  risk: "RISK",
  scenario: "SCENARIO",
  decision: "DECISION",
  execution: "EXECUTION",
  goal: "GOAL",
});

function subjectById(subjects: readonly NmiQueueSubjectInput[] | undefined): ReadonlyMap<string, NmiQueueSubjectInput> {
  return new Map((subjects ?? []).map((item) => [item.subjectId, item]));
}

function relatedGoalId(map: ManagementMap | null, itemId: string, itemType: NmiAttentionItemType): string | null {
  if (!map) return null;
  if (itemType === "problem" || itemType === "risk") {
    const goals = answerNmiManagementQuestion(map, "GOAL_THREATENED_BY_PROBLEM", itemId);
    return goals.relatedIds[0] ?? null;
  }
  if (itemType === "goal") return itemId;
  return null;
}

function enrichReasons(
  type: NmiAttentionItemType,
  subject: NmiQueueSubjectInput | undefined,
  map: ManagementMap | null,
  itemId: string,
): readonly NmiAttentionReason[] {
  const reasons: NmiAttentionReason[] = ["EXISTING_QUEUE_ITEM"];
  const attention = (subject?.attention ?? "").toLowerCase();
  const status = (subject?.status ?? "").toLowerCase();
  if (type === "problem" && attention === "critical") reasons.push("CRITICAL_PROBLEM");
  if (type === "risk") reasons.push("ACTIVE_RISK");
  if (type === "decision") reasons.push("DECISION_PENDING");
  if (type === "execution") {
    if (status === "blocked") reasons.push("EXECUTION_BLOCKED");
    else reasons.push("EXECUTION_ACTIVE");
  }
  if (NMI_ATTENTION_PROMOTION_RULE.enrichExistingQueueItem && map) {
    const node = map.nodes.find((item) => item.nodeId === itemId);
    if (node?.knownStatus === "UNRESOLVED" || node?.kind === "DATA_EVIDENCE" && node.knownStatus === "UNRESOLVED") {
      reasons.push("EVIDENCE_GAP");
    }
    const data = map.nodes.find((item) => item.kind === "DATA_EVIDENCE" && item.knownStatus === "UNRESOLVED");
    if (type === "problem" && data) {
      const kpi = answerNmiManagementQuestion(map, "KPI_MEASURING_GOAL", relatedGoalId(map, itemId, type) ?? "");
      const supports = kpi.relatedIds.some((kpiId) =>
        map.relationships.some(
          (rel) => rel.kind === "evidenced_by" && rel.fromId === kpiId && rel.toId === data.nodeId,
        ),
      );
      if (supports && !reasons.includes("EVIDENCE_GAP")) reasons.push("EVIDENCE_GAP");
    }
  }
  return Object.freeze(reasons);
}

export function composeNmiAttentionItems(input: {
  readonly queueEntries: readonly NmiQueueEntryInput[];
  readonly subjects?: readonly NmiQueueSubjectInput[];
  readonly map?: ManagementMap | null;
  readonly contextKind?: NmiContextKind;
}): readonly NmiAttentionItem[] {
  const subjects = subjectById(input.subjects);
  const map = input.map ?? null;
  const seen = new Set<string>();
  const items: NmiAttentionItem[] = [];
  for (const entry of input.queueEntries) {
    for (const objectId of entry.objectIds) {
      if (seen.has(objectId)) continue;
      seen.add(objectId);
      const subject = subjects.get(objectId);
      const mapNode = map?.nodes.find((node) => node.nodeId === objectId);
      const kind = mapNode?.kind ?? QUEUE_TO_NMI_KIND[entry.category] ?? "PROBLEM";
      const canonicalRef: NmiCanonicalRef = mapNode?.canonicalRef ?? {
        id: objectId,
        kind,
        authority: "STAGE-PROD:1/ExecutiveStageQueueFoundation",
        sourceRef: `queue:${entry.category}:${objectId}`,
      };
      const goalId = relatedGoalId(map, objectId, entry.category);
      let relatedRoadmapId: string | null = null;
      let relatedRoadmapPosition: NmiAttentionItem["relatedRoadmapPosition"] = null;
      if (map && map.nodes.some((node) => node.nodeId === objectId)) {
        const roadmap = composeNmiDecisionRoadmap({
          roadmapId: `nmi5:roadmap:${objectId}`,
          map,
          anchorNodeId: objectId,
        });
        relatedRoadmapId = roadmap.roadmapId;
        relatedRoadmapPosition = roadmap.currentPosition.primary;
      }
      const contextKind = mapNode?.contextKind ?? input.contextKind ?? "UNKNOWN";
      items.push(
        Object.freeze({
          itemId: objectId,
          canonicalRef,
          itemType: entry.category,
          title: subject?.title ?? mapNode?.title ?? null,
          sourceAuthority: "STAGE-PROD:1/ExecutiveStageQueueFoundation",
          queueCategory: entry.category,
          queueObjectIds: entry.objectIds,
          managementContext: contextKind,
          relatedGoalId: goalId,
          relatedRoadmapId,
          relatedRoadmapPosition,
          attentionReasons: enrichReasons(entry.category, subject, map, objectId),
          evidenceRefs: Object.freeze(mapNode?.provenance ?? [`queue:${entry.category}`]),
          provenance: Object.freeze([
            "STAGE-PROD:1/ExecutiveStageQueueFoundation",
            `queue:${entry.category}:${objectId}`,
            ...(mapNode?.provenance ?? []),
          ]),
          unresolved: mapNode?.knownStatus === "UNRESOLVED" || (subject?.status ?? "").toLowerCase() === "unresolved",
          navigationTarget: objectId,
          priority: "UNKNOWN",
          numericPriority: null,
          urgencyInvented: false,
        }),
      );
    }
  }
  return Object.freeze(items);
}

export function explainNmiAttentionItem(item: NmiAttentionItem): {
  readonly itemId: string;
  readonly explanation: string;
  readonly reasons: readonly NmiAttentionReason[];
  readonly inventsRelationships: false;
} {
  const title = item.title ?? item.itemId;
  const parts = [
    `${title} appears in Attention because it is an existing Queue ${item.itemType}`,
  ];
  if (item.relatedGoalId) parts.push(`related to Goal ${item.relatedGoalId}`);
  if (item.relatedRoadmapId && item.relatedRoadmapPosition) {
    parts.push(`Decision Roadmap ${item.relatedRoadmapId} is at ${item.relatedRoadmapPosition}`);
  }
  if (item.attentionReasons.includes("EVIDENCE_GAP")) parts.push("with unresolved evidence");
  if (item.attentionReasons.includes("DECISION_PENDING")) parts.push("as a Queue Decision");
  if (item.attentionReasons.includes("EXECUTION_ACTIVE")) parts.push("as an active Queue Execution");
  return Object.freeze({
    itemId: item.itemId,
    explanation: `${parts.join(" ")}.`,
    reasons: item.attentionReasons,
    inventsRelationships: false,
  });
}
