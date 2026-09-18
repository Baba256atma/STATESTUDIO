/**
 * NPA-T NMI:5 — Management Navigation & Attention tests.
 * Queue remains STAGE-PROD:1. Does not start NMI:6.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";

import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import {
  executiveStageQueueFoundationIdentity,
  resolveExecutiveQueueEntries,
  verifyExecutiveStageQueueFoundation,
} from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT, type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import { NMI_DECISION_ROADMAP_CONTRACT } from "./nmiDecisionRoadmapContract.ts";
import { verifyNmiDecisionRoadmap } from "./nmiDecisionRoadmapFoundation.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { explainNmiAttentionItem } from "./nmiAttentionCompose.ts";
import {
  composeNmiManagementNavigation,
  filterNmiMapSection,
  rejectSealedRmsNavigationFact,
  selectNmiNavigationItem,
} from "./nmiManagementNavigationCompose.ts";
import {
  NMI_ATTENTION_PROMOTION_RULE,
  NMI_MANAGEMENT_NAVIGATION_CONTRACT,
  NMI_MANAGEMENT_NAVIGATION_GATE_FLOW,
} from "./nmiManagementNavigationContract.ts";
import { verifyNmiManagementNavigation } from "./nmiManagementNavigationFoundation.ts";
import { nmiManagementNavigationIdentity } from "./nmiManagementNavigationIdentity.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus: "DECLARED",
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function plantMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi5-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("risk:overtime", "RISK", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
      ref("sc:temp", "SCENARIO", "CC:9"),
      ref("dec:hold", "DECISION", "CC:10"),
      ref("ex:watch", "EXECUTION", "CC:11"),
      ref("out:otd", "OUTCOME", "CORE-OUT"),
      ref("learn:otd", "LEARNING", "CORE-OUT:2"),
      ref("proc:disconnected", "PROCESS", "BCA:4"),
    ],
    relationships: [
      rel("rel:kpi", "kpi:otd", "goal:otd", "measures"),
      rel("rel:ev", "kpi:otd", "data:otd", "evidenced_by"),
      rel("rel:threat", "problem:capacity", "goal:otd", "threatens"),
    ],
  });
  return composeNmiManagementMap({
    mapId: "map-nmi5",
    model,
    annotations: [{ id: "problem:capacity", title: "Capacity Gap" }, { id: "data:otd", knownStatus: "UNRESOLVED" }],
  });
}

const queueSubjects = [
  { subjectId: "problem:capacity", workKind: "problem", objectKind: "problem", attention: "normal", status: "active" },
  { subjectId: "sc:temp", workKind: "scenario", objectKind: "scenario" },
  { subjectId: "dec:hold", workKind: "decision", objectKind: "decision" },
  { subjectId: "ex:watch", workKind: "execution", objectKind: "execution", status: "active" },
];

test("NMI:5 verifies on NMI:1–4 without a second Queue or NMI:6", () => {
  assert.equal(verifyNmiDecisionRoadmap().ok, true);
  assert.equal(verifyNmiManagementNavigation().ok, true);
  assert.equal(verifyExecutiveStageQueueFoundation().ok, true);
  assert.equal(NMI_DECISION_ROADMAP_CONTRACT.startsNmi5, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.startsNmi6, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.secondQueue, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.queueAuthority, executiveStageQueueFoundationIdentity);
  assert.equal(nmiManagementNavigationIdentity, "NPA-T NMI:5/ManagementNavigationExecutiveAttention");
  assert.equal(NMI_FOUNDATION_CONTRACT.attentionImplemented, false);
});

test("existing Queue items survive as Attention with correct counts", () => {
  const queue = resolveExecutiveQueueEntries({ subjects: queueSubjects });
  const nav = composeNmiManagementNavigation({
    queueEntries: queue.map((entry) => ({
      category: entry.category,
      count: entry.count,
      objectIds: entry.objectIds,
    })),
    subjects: queueSubjects,
    map: plantMap(),
  });
  assert.equal(queue.find((entry) => entry.category === "problem")?.objectIds.includes("problem:capacity"), true);
  assert.equal(nav.attentionItems.some((item) => item.itemId === "problem:capacity" && item.itemType === "problem"), true);
  assert.equal(nav.attentionItems.some((item) => item.itemId === "sc:temp" && item.itemType === "scenario"), true);
  assert.equal(nav.attentionItems.some((item) => item.itemId === "dec:hold" && item.itemType === "decision"), true);
  assert.equal(nav.attentionItems.some((item) => item.itemId === "ex:watch" && item.itemType === "execution"), true);
  assert.equal(nav.queueEntries.find((entry) => entry.category === "problem")?.count, 1);
  assert.equal(nav.attentionCount, nav.attentionItems.length);
  assert.equal(nav.attentionCount, 4);
  assert.ok(nav.attentionItems.every((item) => item.attentionReasons.includes("EXISTING_QUEUE_ITEM")));
  assert.ok(nav.attentionItems.every((item) => item.priority === "UNKNOWN" && item.numericPriority === null));
  assert.ok(nav.attentionItems.every((item) => item.urgencyInvented === false));
});

test("Management Map navigation covers sections and contexts", () => {
  const map = plantMap();
  const nav = composeNmiManagementNavigation({
    queueEntries: [],
    map,
    mode: "MANAGEMENT_MAP",
  });
  assert.equal(filterNmiMapSection(nav, "GOALS").nodeIds.includes("goal:otd"), true);
  assert.equal(filterNmiMapSection(nav, "OPERATIONS").nodeIds.includes("proc:production"), true);
  assert.equal(filterNmiMapSection(nav, "KPI_DATA").nodeIds.includes("kpi:otd"), true);
  assert.equal(filterNmiMapSection(nav, "PROBLEMS_RISKS").nodeIds.includes("problem:capacity"), true);
  assert.equal(filterNmiMapSection(nav, "PROBLEMS_RISKS").nodeIds.includes("risk:overtime"), true);
  assert.equal(filterNmiMapSection(nav, "VARIABLES").nodeIds.includes("vai:capacity"), true);
  assert.equal(filterNmiMapSection(nav, "SCENARIOS").nodeIds.includes("sc:temp"), true);
  assert.equal(filterNmiMapSection(nav, "DECISIONS").nodeIds.includes("dec:hold"), true);
  assert.equal(filterNmiMapSection(nav, "EXECUTIONS").nodeIds.includes("ex:watch"), true);
  assert.equal(filterNmiMapSection(nav, "OUTCOMES_LEARNING").nodeIds.includes("out:otd"), true);
  assert.equal(nav.contextKind, "BUSINESS");
  const project = composeNmiManagementNavigation({
    queueEntries: [],
    map: composeNmiManagementMap({
      mapId: "map-project",
      model: composeNmiUnifiedManagementModel({
        modelId: "nmi5-project",
        contextId: "bca:ctx:rollout",
        contextKind: "PROJECT",
        businessProjectRef: ref("project:rollout", "BUSINESS_PROJECT", "BCA:1"),
      }),
    }),
  });
  assert.equal(project.contextKind, "PROJECT");
  const hybrid = composeNmiManagementNavigation({
    queueEntries: [],
    map: composeNmiManagementMap({
      mapId: "map-hybrid",
      model: composeNmiUnifiedManagementModel({
        modelId: "nmi5-hybrid",
        contextId: "bca:ctx:hybrid",
        contextKind: "HYBRID",
        nodes: [ref("goal:otd", "GOAL", "MO:1"), ref("goal:cutover", "GOAL", "MO:1")],
      }),
      annotations: [
        { id: "goal:otd", contextKind: "BUSINESS" },
        { id: "goal:cutover", contextKind: "PROJECT" },
      ],
    }),
  });
  assert.equal(hybrid.hybridLanes?.flattened, false);
  assert.deepEqual(hybrid.hybridLanes?.businessNodeIds, ["goal:otd"]);
  assert.deepEqual(hybrid.hybridLanes?.projectNodeIds, ["goal:cutover"]);
  const unknown = composeNmiManagementNavigation({ queueEntries: [] });
  assert.equal(unknown.contextKind, "UNKNOWN");
});

test("Attention is distinct from the map; gaps and NOT_REACHED do not auto-promote", () => {
  const map = plantMap();
  const nav = composeNmiManagementNavigation({
    queueEntries: [
      { category: "problem", count: 1, objectIds: ["problem:capacity"] },
    ],
    map,
  });
  assert.equal(nav.attentionItems.some((item) => item.itemId === "proc:disconnected"), false);
  assert.equal(nav.attentionItems.some((item) => item.itemId === "risk:overtime"), false);
  assert.equal(NMI_ATTENTION_PROMOTION_RULE.mapNodeWithoutQueue, false);
  assert.equal(NMI_ATTENTION_PROMOTION_RULE.relationshipGapWithoutQueue, false);
  assert.equal(NMI_ATTENTION_PROMOTION_RULE.roadmapNotReachedWithoutQueue, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.mapNodeImpliesAttention, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.notReachedImpliesAttention, false);
  const capacity = nav.attentionItems.find((item) => item.itemId === "problem:capacity");
  assert.equal(capacity?.relatedGoalId, "goal:otd");
  assert.equal(capacity?.relatedRoadmapId, "nmi5:roadmap:problem:capacity");
  assert.equal(capacity?.canonicalRef.id, "problem:capacity");
  const selected = selectNmiNavigationItem(nav, "problem:capacity", "QUEUE", map);
  assert.equal(selected.selected?.canonicalId, "problem:capacity");
  assert.equal(selected.selected?.substitutesSubject, false);
  assert.notEqual(selected.selected?.canonicalId, "risk:overtime");
});

test("Attention reasons, explanation, RMS/Gate/Stage/Advisor isolation", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const nav = composeNmiManagementNavigation({
    queueEntries: [
      { category: "problem", count: 1, objectIds: ["problem:capacity"] },
      { category: "decision", count: 1, objectIds: ["dec:hold"] },
      { category: "execution", count: 1, objectIds: ["ex:watch"] },
    ],
    subjects: [
      { subjectId: "problem:capacity", title: "Capacity Gap", attention: "critical" },
      { subjectId: "dec:hold", workKind: "decision" },
      { subjectId: "ex:watch", workKind: "execution", status: "active" },
    ],
    map: plantMap(),
  });
  const problem = nav.attentionItems.find((item) => item.itemId === "problem:capacity")!;
  assert.ok(problem.attentionReasons.includes("EXISTING_QUEUE_ITEM"));
  assert.ok(problem.attentionReasons.includes("CRITICAL_PROBLEM"));
  assert.ok(nav.attentionItems.find((item) => item.itemId === "dec:hold")?.attentionReasons.includes("DECISION_PENDING"));
  assert.ok(nav.attentionItems.find((item) => item.itemId === "ex:watch")?.attentionReasons.includes("EXECUTION_ACTIVE"));
  const explained = explainNmiAttentionItem(problem);
  assert.match(explained.explanation, /Capacity Gap/);
  assert.match(explained.explanation, /existing Queue problem/);
  assert.equal(explained.inventsRelationships, false);
  const sealed = rejectSealedRmsNavigationFact("rms:ground-truth:hidden");
  assert.equal(sealed.known, false);
  assert.equal(nav.readsSealedRmsGroundTruth, false);
  assert.equal(nav.projectsOntoStage, false);
  assert.equal(nav.mutatesObjects, false);
  assert.equal(nav.mutatesDecisions, false);
  assert.equal(nav.mutatesExecutions, false);
  assert.equal(nav.bypassesGate, false);
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_GATE_FLOW[5], "STAGE_PROD_1_QUEUE");
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(VAI_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(verifyRmsFoundation().ok, true);
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const selected = selectNexoraMVPInteractionSubject(initial, "obj-revenue");
  assert.ok(selected);
  const opened = openNexoraMVPExecutiveQueueCollection(initial, "problem");
  assert.ok(opened);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});

test("Queue overlay evolves into NMI navigation without a second Queue", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      entries: [
        {
          category: "problem",
          count: 1,
          objectIds: ["problem:capacity"],
          isSemanticObject: false,
          isActive: false,
        },
        {
          category: "scenario",
          count: 1,
          objectIds: ["sc:temp"],
          isSemanticObject: false,
          isActive: false,
        },
      ],
      onSelectCategory: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-executive-queue"/);
  assert.match(html, /data-nmi="6"/);
  assert.match(html, /data-nmi-attention-count="2"/);
  assert.match(html, /data-testid="nmi-mode-attention"/);
  assert.match(html, /data-testid="nmi-mode-map"/);
  assert.match(html, /data-testid="nexora-executive-queue-row-problem"/);
  assert.match(html, /data-queue-compact="true"/);
  assert.doesNotMatch(html, /data-testid="nexora-executive-queue-2"/);
});
