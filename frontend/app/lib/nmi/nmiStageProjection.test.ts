/**
 * NPA-T NMI:6 — Management Context → Stage Projection tests.
 * Does not start NMI:7 or DTH-EXP. Does not create an NMI Stage.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";
import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { composeNpsProblemSolvingPath } from "@/app/lib/nexora-problem-solving/npsProblemSolvingPath.ts";
import { composeNpsProblemUnderstanding } from "@/app/lib/nexora-problem-solving/npsProblemUnderstanding.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import {
  executiveStageQueueFoundationIdentity,
  resolveExecutiveQueueEntries,
  verifyExecutiveStageQueueFoundation,
} from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { verifyVaiFoundation } from "@/app/lib/vai/vaiFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT, type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import { NMI_MANAGEMENT_NAVIGATION_CONTRACT } from "./nmiManagementNavigationContract.ts";
import { verifyNmiManagementNavigation } from "./nmiManagementNavigationFoundation.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import {
  composeNmiStageProjection,
  nmiProjectionReferentForUtterance,
  rejectSealedRmsProjectionFact,
  resolveNmiExplicitSelection,
} from "./nmiStageProjectionCompose.ts";
import {
  NMI_STAGE_PROJECTION_BUDGET,
  NMI_STAGE_PROJECTION_CONTRACT,
  NMI_STAGE_PROJECTION_GATE_FLOW,
} from "./nmiStageProjectionContract.ts";
import { verifyNmiStageProjection } from "./nmiStageProjectionFoundation.ts";
import { handoffNmiStageProjectionToExistingStage } from "./nmiStageProjectionHandoff.ts";
import { nmiStageProjectionIdentity } from "./nmiStageProjectionIdentity.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
  epistemicStatus: NmiManagementRelationship["epistemicStatus"] = "DECLARED",
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus,
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function plant(extraRels: readonly NmiManagementRelationship[] = [], extraNodes: readonly NmiCanonicalRef[] = []) {
  const extraVars = extraNodes.filter((node) => node.kind === "VARIABLE");
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi6-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("proc:unrelated", "PROCESS", "BCA:4"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("ctx-problem-capacity", "PROBLEM", "MO:1"),
      ref("ctx-problem-margin", "PROBLEM", "MO:1"),
      ref("risk:overtime", "RISK", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
      ref("ctx-scenario-capacity", "SCENARIO", "CC:9"),
      ref("ctx-scenario-demand", "SCENARIO", "CC:9"),
      ref("ctx-decision-capacity", "DECISION", "CC:10"),
      ref("ctx-execution-capacity", "EXECUTION", "CC:11"),
      ref("out:otd", "OUTCOME", "CORE-OUT"),
      ref("learn:otd", "LEARNING", "CORE-OUT:2"),
      ...extraVars,
    ],
    relationships: [
      rel("rel:kpi", "kpi:otd", "goal:otd", "measures"),
      rel("rel:ev", "kpi:otd", "data:otd", "evidenced_by", "UNKNOWN"),
      rel("rel:threat", "ctx-problem-capacity", "goal:otd", "threatens"),
      rel("rel:ops", "proc:production", "ctx-problem-capacity", "supports"),
      rel("rel:affects", "vai:capacity", "ctx-problem-capacity", "affects", "ASSOCIATION"),
      rel("rel:risk", "risk:overtime", "goal:otd", "threatens"),
      rel("rel:addr", "ctx-scenario-capacity", "ctx-problem-capacity", "addresses"),
      rel("rel:sel", "ctx-decision-capacity", "ctx-scenario-capacity", "selected_as"),
      rel("rel:ex", "ctx-execution-capacity", "ctx-decision-capacity", "executed_by"),
      rel("rel:out", "out:otd", "ctx-execution-capacity", "observed_by"),
      rel("rel:learn", "learn:otd", "out:otd", "reassesses"),
      ...extraRels,
    ],
    unresolvedRelationshipIds: ["rel:ev"],
  });
  return composeNmiManagementMap({
    mapId: "map-nmi6",
    model,
    annotations: [
      { id: "ctx-problem-capacity", title: "Capacity Gap" },
      { id: "ctx-scenario-demand", title: "Demand Surge" },
      { id: "data:otd", knownStatus: "UNRESOLVED" },
    ],
  });
}

function project(
  selectedCanonicalId: string,
  source: "MANAGEMENT_MAP" | "ATTENTION" | "DECISION_ROADMAP" = "MANAGEMENT_MAP",
  map = plant(),
) {
  return composeNmiStageProjection({
    projectionId: `proj:${selectedCanonicalId}`,
    selectedCanonicalId,
    source,
    map,
    comparisonRefs: [
      {
        comparisonId: "cmp:capacity",
        authority: "CC:9",
        scenarioIds: Object.freeze(["ctx-scenario-capacity", "ctx-scenario-demand"]),
        sourceRef: "cmp:capacity",
      },
    ],
    staleQueueSelectedId: "ctx-problem-margin",
    staleStageFocusedId: "ctx-scenario-demand",
    staleAdvisorSubjectId: "goal:otd",
  });
}

function idsOf(projection: ReturnType<typeof project>) {
  return projection.mapNodeRefs.map((item) => item.nodeId);
}

function nca(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: Object.freeze([
      ...projectManagerObjectConversationalSubjects(catalog),
      freezeConversationalSubjectRecord({
        subjectId: "obj-profit-nca",
        subjectKind: "object",
        canonicalName: "Profit",
        aliases: Object.freeze(["Profit"]),
        businessKey: "obj-profit-nca",
      }),
    ]),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nmi6-${utterance}`,
  });
}

test("NMI:6 verifies on NMI:1–5 without a second Stage, Director, NMI:7, or DTH-EXP", () => {
  assert.equal(verifyNmiManagementNavigation().ok, true);
  assert.equal(verifyNmiStageProjection().ok, true);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.startsNmi6, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.startsNmi7, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.startsDthExp, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.createsNmiStage, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.secondDirector, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.secondStage, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.secondFocusRegistry, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.presentationAuthority, DirectorFoundationId);
  assert.equal(nmiStageProjectionIdentity, "NPA-T NMI:6/ManagementContextStageProjection");
  assert.equal(NMI_FOUNDATION_CONTRACT.attentionImplemented, false);
  assert.equal(NMI_STAGE_PROJECTION_GATE_FLOW.at(-1), "EXISTING_DIRECTOR_STAGE_WRITER");
});

test("Management Map Problem and Attention Problem project Capacity Gap onto existing Stage", () => {
  const mapProjection = project("ctx-problem-capacity", "MANAGEMENT_MAP");
  const attentionProjection = project("ctx-problem-capacity", "ATTENTION");
  assert.equal(mapProjection.selectedCanonicalId, "ctx-problem-capacity");
  assert.equal(mapProjection.projectionAnchorId, "ctx-problem-capacity");
  assert.equal(mapProjection.selectedNodeKind, "PROBLEM");
  assert.equal(mapProjection.source, "MANAGEMENT_MAP");
  assert.equal(attentionProjection.source, "ATTENTION");
  assert.equal(mapProjection.selectedCanonicalId, mapProjection.projectionAnchorId);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const handed = handoffNmiStageProjectionToExistingStage({
    projection: mapProjection,
    interactionState: initial,
    catalog,
  });
  assert.equal(handed.focusedSubjectId, "ctx-problem-capacity");
  assert.equal(handed.nextState.selectedSubject?.id, "ctx-problem-capacity");
  assert.equal(handed.stageWriter, "selectNexoraMVPInteractionSubject");
  assert.equal(handed.nmiWroteStage, false);
  assert.equal(handed.secondStageStore, false);
  const presentation = deriveNexoraMVPStageInteractionPresentation(handed.nextState, catalog);
  assert.equal(presentation.selectedSubjectId, "ctx-problem-capacity");
});

test("Goal, Problem, Risk, Scenario, Decision, Execution, and Outcome project relevant bounded branches", () => {
  const kinds = [
    ["goal:otd", "GOAL", ["kpi:otd", "ctx-problem-capacity"]],
    ["ctx-problem-capacity", "PROBLEM", ["goal:otd", "vai:capacity", "ctx-scenario-capacity"]],
    ["risk:overtime", "RISK", ["goal:otd"]],
    ["ctx-scenario-capacity", "SCENARIO", ["ctx-problem-capacity", "ctx-decision-capacity"]],
    ["ctx-decision-capacity", "DECISION", ["ctx-scenario-capacity", "ctx-execution-capacity"]],
    ["ctx-execution-capacity", "EXECUTION", ["ctx-decision-capacity", "out:otd"]],
    ["out:otd", "OUTCOME", ["ctx-execution-capacity", "learn:otd"]],
  ] as const;
  for (const [id, kind, expected] of kinds) {
    const projection = project(id, kind === "SCENARIO" ? "DECISION_ROADMAP" : "MANAGEMENT_MAP");
    assert.equal(projection.selectedNodeKind, kind);
    assert.equal(projection.selectedCanonicalId, id);
    const ids = idsOf(projection);
    assert.equal(ids.includes(id), true);
    for (const related of expected) {
      assert.equal(ids.includes(related), true, `${id} should include ${related}`);
    }
    assert.equal(ids.includes("proc:unrelated"), false);
    assert.equal(ids.includes("ctx-problem-margin"), false);
  }
});

test("anchor identity, Capacity Gap, and Demand Surge are preserved", () => {
  const capacity = project("ctx-problem-capacity");
  const demand = project("ctx-scenario-demand");
  assert.equal(capacity.projectionAnchorId, "ctx-problem-capacity");
  assert.equal(capacity.mapNodeRefs.find((item) => item.relevance === "PRIMARY")?.title, "Capacity Gap");
  assert.equal(demand.projectionAnchorId, "ctx-scenario-demand");
  assert.equal(demand.mapNodeRefs.find((item) => item.relevance === "PRIMARY")?.title, "Demand Surge");
  assert.notEqual(capacity.projectionAnchorId, demand.projectionAnchorId);
  assert.equal(resolveNmiExplicitSelection({
    explicitCanonicalId: "ctx-problem-capacity",
    staleQueueSelectedId: "ctx-problem-margin",
    staleStageFocusedId: "ctx-scenario-demand",
    staleAdvisorSubjectId: "goal:otd",
    staleComparisonId: "cmp:capacity",
  }), "ctx-problem-capacity");
});

test("unrelated company nodes are excluded; missing edges are not invented", () => {
  const projection = project("ctx-problem-capacity");
  const ids = idsOf(projection);
  assert.equal(ids.includes("proc:unrelated"), false);
  assert.equal(ids.includes("ctx-problem-margin"), false);
  assert.equal(ids.includes("ctx-scenario-demand"), false);
  assert.equal(projection.relationshipRefs.some((item) => item.fromId === "ctx-scenario-demand"), false);
  assert.ok(projection.relationshipGaps.some((item) => item.reason === "MISSING_RELATIONSHIP" || item.inventedRelationship === false));
  assert.ok(projection.relationshipGaps.every((item) => item.inventedRelationship === false));
});

test("bounded projection budget truncates deterministically and records omitted refs", () => {
  const extras: NmiCanonicalRef[] = [];
  const extraRels: NmiManagementRelationship[] = [];
  for (let index = 0; index < 12; index += 1) {
    const id = `vai:extra:${String(index).padStart(2, "0")}`;
    extras.push(ref(id, "VARIABLE", "VAI:1"));
    extraRels.push(rel(`rel:extra:${id}`, id, "ctx-problem-capacity", "affects", "ASSOCIATION"));
  }
  const crowded = plant(extraRels, extras);
  const first = composeNmiStageProjection({
    projectionId: "proj:budget-a",
    selectedCanonicalId: "ctx-problem-capacity",
    source: "MANAGEMENT_MAP",
    map: crowded,
  });
  const second = composeNmiStageProjection({
    projectionId: "proj:budget-b",
    selectedCanonicalId: "ctx-problem-capacity",
    source: "MANAGEMENT_MAP",
    map: crowded,
  });
  assert.equal(first.mapNodeRefs.filter((item) => item.relevance === "PRIMARY").length, 1);
  assert.ok(first.mapNodeRefs.filter((item) => item.relevance === "DIRECT").length <= NMI_STAGE_PROJECTION_BUDGET.direct);
  assert.ok(first.mapNodeRefs.length <= NMI_STAGE_PROJECTION_BUDGET.maxNodes);
  assert.equal(first.truncated, true);
  assert.ok(first.omittedCount > 0);
  assert.equal(first.omittedNodeIds.length, first.omittedCount);
  assert.deepEqual(first.omittedNodeIds, second.omittedNodeIds);
  assert.deepEqual(
    first.mapNodeRefs.map((item) => item.nodeId),
    second.mapNodeRefs.map((item) => item.nodeId),
  );
  assert.equal(first.projectionAnchorId, "ctx-problem-capacity");
  assert.equal(first.omittedNodeIds.includes("ctx-problem-capacity"), false);
});

test("direct relationships and roadmap context are preserved without causal upgrade", () => {
  const projection = project("ctx-problem-capacity");
  const direct = projection.relationshipRefs.find((item) => item.relationshipId === "rel:threat");
  const association = projection.relationshipRefs.find((item) => item.relationshipId === "rel:affects");
  const unresolved = projection.relationshipRefs.find((item) => item.relationshipId === "rel:ev");
  assert.equal(direct?.kind, "threatens");
  assert.equal(association?.epistemicStatus, "ASSOCIATION");
  assert.equal(association?.causal, false);
  assert.equal(association?.convertsAssociationToCause, false);
  assert.notEqual(association?.causalCommunication, "CONFIRMED_CAUSAL_RELATIONSHIP");
  assert.equal(projection.unresolvedRelationshipIds.includes("rel:ev"), true);
  assert.ok(unresolved == null || unresolved.causalCommunication !== "CONFIRMED_CAUSAL_RELATIONSHIP");
  assert.equal(projection.decisionRoadmapRef, "nmi6:roadmap:ctx-problem-capacity");
  assert.equal(idsOf(projection).includes("ctx-decision-capacity") || idsOf(projection).includes("ctx-scenario-capacity"), true);
});

test("scenario collection and comparison state cannot steal the Problem referent", () => {
  const projection = project("ctx-problem-capacity");
  assert.ok(projection.contextCollectionIds.includes("ctx-scenario-capacity"));
  assert.equal(projection.collectionOwnsReferent, false);
  assert.equal(projection.comparisonOwnsAnchor, false);
  assert.equal(projection.comparisonRefs[0]?.comparisonId, "cmp:capacity");
  assert.equal(
    nmiProjectionReferentForUtterance("Explain it.", "ctx-problem-capacity", projection),
    "ctx-problem-capacity",
  );
  assert.equal(
    nmiProjectionReferentForUtterance("Investigate it.", "ctx-problem-capacity", projection),
    "ctx-problem-capacity",
  );
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-demand", catalog);
  const handed = handoffNmiStageProjectionToExistingStage({
    projection,
    interactionState: state,
    catalog,
  });
  assert.equal(handed.focusedSubjectId, "ctx-problem-capacity");
  assert.notEqual(handed.focusedSubjectId, "ctx-scenario-demand");
});

test("Explain it, Tell me more about it, and Investigate it retain the selected subject", () => {
  let previous = nca("What Capacity Gap?");
  previous = nca("Explain it.", previous);
  assert.equal(previous.ncaTurn.reference.resolvedName, "Capacity Gap");
  previous = nca("Tell me more about it.", previous);
  assert.equal(previous.ncaTurn.reference.resolvedName, "Capacity Gap");
  previous = nca("Investigate it.", previous);
  assert.equal(previous.ncaTurn.reference.resolvedName, "Capacity Gap");
  let demand = nca("What Demand Surge?");
  demand = nca("Tell me more about it.", demand);
  assert.match(demand.ncaTurn.reference.resolvedName ?? "", /Demand Surge/i);
});

test("Queue category, collection, CENTER, back/forward, and escape remain existing Stage behavior", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const queue = resolveExecutiveQueueEntries({
    subjects: catalog.contextSubjects.map((item) => ({
      subjectId: item.id,
      workKind: item.kind,
      objectKind: item.kind,
      attention: item.attention,
      status: item.status,
    })),
  });
  assert.ok(queue.some((entry) => entry.category === "problem" && entry.count > 0));
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.collectionContext?.category, "problem");
  state = selectNexoraMVPInteractionSubject(state, "ctx-problem-capacity", catalog);
  assert.equal(state.collectionContext, null);
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  const presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.focusedSubjectId, "ctx-problem-capacity");
  state = selectNexoraMVPInteractionSubject(state, "ctx-decision-capacity", catalog);
  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  const forward = stepForwardNexoraMVPObjectInteraction(back, catalog);
  assert.ok(back);
  assert.ok(forward);
  const escaped = resetNexoraMVPObjectInteractionOverview(forward);
  assert.equal(escaped.mode, "overview");
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      entries: [
        {
          category: "problem",
          count: 1,
          objectIds: ["ctx-problem-capacity"],
          isSemanticObject: false,
          isActive: false,
        },
      ],
      onSelectCategory: () => undefined,
      projectionAnchorId: "ctx-problem-capacity",
      mapNodes: [
        { section: "PROBLEMS_RISKS", nodeId: "ctx-problem-capacity", title: "Capacity Gap" },
      ],
      onSelectCanonicalId: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-executive-queue"/);
  assert.match(html, /data-nmi="6"/);
  assert.match(html, /data-nmi-projection-anchor="ctx-problem-capacity"/);
  assert.match(html, /data-testid="nexora-executive-queue-row-problem"/);
  assert.match(html, /data-testid="nmi-map-node-ctx-problem-capacity"/);
  assert.match(html, /data-testid="nexora-executive-queue-count-problem"/);
});

test("Gate, Data Reality, RMS, Advisor, NPS, and VAI authorities remain intact", () => {
  const map = plant();
  const before = map.relationships.length;
  const projection = project("ctx-problem-capacity", "MANAGEMENT_MAP", map);
  assert.equal(map.relationships.length, before);
  assert.equal(projection.mutatesUnifiedManagementModel, false);
  assert.equal(projection.writesDataReality, false);
  assert.equal(projection.bypassesGate, false);
  assert.equal(projection.replacesAdvisor, false);
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_STAGE_PROJECTION_GATE_FLOW[1], "GATE_API_RDI_1");
  const sealed = rejectSealedRmsProjectionFact("rms:ground-truth:hidden-failure");
  assert.equal(sealed.known, false);
  assert.equal(sealed.displayed, false);
  assert.equal(projection.readsSealedRmsGroundTruth, false);
  assert.equal(idsOf(projection).includes("rms:ground-truth:hidden-failure"), false);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(verifyRmsFoundation().ok, true);
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.parallelAdvisor, false);
  assert.equal(VAI_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
  assert.equal(verifyVaiFoundation().ok, true);
  assert.equal(verifyExecutiveStageQueueFoundation().ok, true);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.queueAuthority, executiveStageQueueFoundationIdentity);
  const pathFacts = Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH" as const,
      observedFrom: "MO Context associatedProblem",
    }),
    investigationPresent: false,
    evidenceState: "NONE" as const,
    causeHypothesesAvailable: false,
    scenarioIds: Object.freeze(["ctx-scenario-demand"]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: Object.freeze({ present: false, executionId: null, status: "NONE" as const }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    stageFocusId: "ctx-scenario-demand",
    conversationSubjectId: "ctx-problem-margin",
  });
  const nps = composeNpsProblemUnderstanding({
    path: composeNpsProblemSolvingPath(pathFacts),
    pathFacts,
    understanding: {
      knownFacts: Object.freeze([
        { text: "Available capacity is below required demand.", epistemic: "FACT" as const, observedFrom: "MO" },
      ]),
      knownSymptoms: Object.freeze([]),
      knownConstraints: Object.freeze([]),
      unknowns: Object.freeze([]),
      assumptions: Object.freeze([]),
      unresolvedQuestions: Object.freeze([]),
      availableEvidence: Object.freeze([]),
      missingEvidence: Object.freeze([]),
      managerKnowledgeRequired: false,
      trustedEvidenceAvailable: false,
      requiredEvidenceUnavailable: false,
      investigationActive: false,
      investigationCompleted: false,
      usableEvidenceForReview: false,
      nextInvestigationNeed: "Review recent capacity and demand history.",
      usefulQuestion: null,
      causalObservations: Object.freeze([]),
    },
  });
  assert.equal(nps.problemId, "ctx-problem-capacity");
});
