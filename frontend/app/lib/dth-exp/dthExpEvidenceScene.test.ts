/**
 * NPA-T DTH-EXP:6 — Evidence in Scene tests.
 * Theatre projection only. No Evidence store, UI, or DTH-EXP:7.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  composeNexoraDirectorSceneContext,
  DTH_EXP_EVIDENCE_SCENE_BOUNDARY,
  DTH_EXP_EVIDENCE_SCENE_ENGINE,
  dthExpEvidenceSceneIdentity,
  dthExpSceneTransitionIdentity,
  planDthExpSceneTransition,
  projectDthExpEvidenceScene,
  projectDthExpSpatialLayout,
  projectDthExpTheatreScene,
  selectNexoraDirectorNexoFamily,
  verifyDthExpEvidenceSceneBoundary,
  verifyDthExpSceneTransitionBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";

function dirPlan() {
  return directNexoraPresentation({
    owner: "WORKSPACE_STATE",
    presentationRequest: "NONE",
    primaryReference: null,
    references: Object.freeze([]),
    collectionKind: null,
    collectionScope: null,
    collectionMembers: Object.freeze([]),
    currentStage: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
  });
}

function hint(
  id: string,
  extras: Partial<DthExpDirectorSceneGraph["objects"][number]> & { readonly kind?: string; readonly authority?: string } = {},
) {
  return Object.freeze({
    object: Object.freeze({
      id,
      kind: extras.kind ?? "object",
      label: id,
      authority: extras.authority ?? "NEX-MVP:4/catalog",
    }),
    familyRelevance: extras.familyRelevance,
    participationHint: extras.participationHint ?? null,
    groupingHint: extras.groupingHint ?? null,
    sceneRelevanceReason: extras.sceneRelevanceReason ?? null,
    vaiRoleRef: extras.vaiRoleRef ?? null,
    timeBucket: extras.timeBucket ?? null,
    bottleneck: extras.bottleneck ?? false,
    collectionMember: extras.collectionMember ?? false,
  });
}

function rel(id: string, fromId: string, toId: string, semanticRelation: string) {
  return Object.freeze({
    relationshipId: id,
    fromId,
    toId,
    semanticRelation,
    sourceAuthority: "NMI:1/relationship",
    sourceRef: `nmi:src:${id}`,
  });
}

function graph(): DthExpDirectorSceneGraph {
  return Object.freeze({
    objects: Object.freeze([
      hint("obj-supplier-a", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-production", { familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"], bottleneck: true }),
      hint("obj-product-line-a", { familyRelevance: "all" }),
      hint("obj-market", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-cost", { kind: "kpi", familyRelevance: ["NEXO_BARS", "NEXO_CAUSE"] }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-risk-gap", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"] }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-goal-1", { kind: "goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-cost-history", { kind: "kpi", familyRelevance: ["NEXO_TIME"], timeBucket: "historical" }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-line-market", "obj-product-line-a", "obj-market", "serves"),
      rel("rel-cost-line", "obj-cost", "obj-product-line-a", "associated"),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceRef: "cc8:ev-capacity-17",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-maintenance",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-rel-feed",
        attachedToKind: "relationship" as const,
        attachedToId: "rel-supplier-production",
        familyRelevance: ["NEXO_FLOW"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:evidence:cost-rise",
        attachedToKind: "object" as const,
        attachedToId: "obj-cost",
        familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-staffing-corr",
        attachedToKind: "object" as const,
        attachedToId: "obj-staffing",
        familyRelevance: ["NEXO_CAUSE", "NEXO_IMPACT"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-no-provenance",
        attachedToKind: "scene" as const,
        attachedToId: "scene",
        familyRelevance: "all" as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-under-review",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-historical",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-bkl",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW"] as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-unrelated",
        attachedToKind: "object" as const,
        attachedToId: "obj-project-alpha",
        familyRelevance: ["NEXO_BUBBLE"] as const,
        relevantToQuestion: false,
      }),
    ]),
    bindings: Object.freeze([
      Object.freeze({
        bindingId: "vai-lever",
        canonicalObjectId: "obj-staffing",
        dimension: "vai-role" as const,
        authority: "VAI:1–8",
        valueRef: "vai:staffing:lever",
      }),
      Object.freeze({
        bindingId: "risk-severity",
        canonicalObjectId: "obj-risk-gap",
        dimension: "risk" as const,
        authority: "MO:1 risk",
        valueRef: "risk:gap:severity",
      }),
      Object.freeze({
        bindingId: "time-now",
        canonicalObjectId: "obj-product-line-a",
        dimension: "time" as const,
        authority: "existing KPI observation owners",
        valueRef: "time:line:now",
      }),
      Object.freeze({
        bindingId: "exec-progress",
        canonicalObjectId: "obj-execution-1",
        dimension: "execution-progress" as const,
        authority: "CC:11",
        valueRef: "exec:plan:progress",
      }),
      Object.freeze({
        bindingId: "outcome-vs-goal",
        canonicalObjectId: "obj-outcome-1",
        dimension: "outcome-vs-goal" as const,
        authority: "CORE-OUT",
        valueRef: "out:delivery:variance",
      }),
      Object.freeze({
        bindingId: "cost-value",
        canonicalObjectId: "obj-cost",
        dimension: "cost" as const,
        authority: "existing KPI observation owners",
        valueRef: "kpi:line:cost",
      }),
    ]),
    bottleneckCanonicalObjectId: "obj-production",
    collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta", "obj-product-line-a"]),
  });
}

function record(partial: DthExpCanonicalEvidenceRecord): DthExpCanonicalEvidenceRecord {
  return Object.freeze(partial);
}

const records: readonly DthExpCanonicalEvidenceRecord[] = Object.freeze([
  record({
    evidenceRef: "cc8:ev-capacity-17",
    authority: "CC:8",
    provenanceRef: "csv:capacity-ops.csv",
    provenanceKind: "csv-source",
    dataRealityAcceptance: "accepted",
    supportState: "authoritative",
    semanticConfirmationState: "AUTHORITATIVE",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-production",
    sceneRelevance: "high",
  }),
  record({
    evidenceRef: "cc8:ev-maintenance",
    authority: "CC:8",
    provenanceRef: "source:maintenance-log",
    provenanceKind: "observed-result",
    dataRealityAcceptance: "accepted",
    supportState: "likely",
    semanticConfirmationState: "LIKELY",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "association",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-production",
    sceneRelevance: "medium",
  }),
  record({
    evidenceRef: "cc8:ev-rel-feed",
    authority: "CC:8",
    provenanceRef: "nmi:src:rel-supplier-production",
    provenanceKind: "authoritative-source",
    dataRealityAcceptance: "accepted",
    supportState: "authoritative",
    semanticConfirmationState: "AUTHORITATIVE",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "relationship",
    attachedToId: "rel-supplier-production",
    sceneRelevance: "medium",
  }),
  record({
    evidenceRef: "cc8:evidence:cost-rise",
    authority: "CC:8",
    provenanceRef: "kpi:line:cost",
    provenanceKind: "data-object",
    dataRealityAcceptance: "accepted",
    supportState: "manager-confirmed",
    semanticConfirmationState: "MANAGER_CONFIRMED",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "candidate",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-cost",
    sceneRelevance: "high",
  }),
  record({
    evidenceRef: "cc8:ev-staffing-corr",
    authority: "CC:8",
    provenanceRef: "obs:staffing-delay",
    provenanceKind: "observed-result",
    dataRealityAcceptance: "accepted",
    supportState: "insufficient",
    semanticConfirmationState: "AMBIGUOUS",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "insufficient",
    relevantToQuestion: true,
    attachedToKind: "investigation",
    attachedToId: "obj-staffing",
    sceneRelevance: "high",
  }),
  record({
    evidenceRef: "cc8:ev-unrelated",
    authority: "CC:8",
    provenanceRef: "csv:other.csv",
    provenanceKind: "csv-source",
    dataRealityAcceptance: "accepted",
    supportState: "authoritative",
    semanticConfirmationState: "AUTHORITATIVE",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "none",
    relevantToQuestion: false,
    attachedToKind: "object",
    attachedToId: "obj-project-alpha",
    sceneRelevance: "low",
  }),
  record({
    evidenceRef: "cc8:ev-no-provenance",
    authority: "CC:8",
    provenanceRef: null,
    provenanceKind: null,
    dataRealityAcceptance: "accepted",
    supportState: "unknown",
    semanticConfirmationState: "UNKNOWN",
    semanticFieldLabel: null,
    freshness: "unknown",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "scene",
    attachedToId: "scene",
    sceneRelevance: "low",
  }),
  record({
    evidenceRef: "cc8:ev-under-review",
    authority: "CC:8",
    provenanceRef: "csv:draft.csv",
    provenanceKind: "csv-source",
    dataRealityAcceptance: "under-review",
    supportState: "unknown",
    semanticConfirmationState: "UNKNOWN",
    semanticFieldLabel: null,
    freshness: "current",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-production",
    sceneRelevance: "medium",
  }),
  record({
    evidenceRef: "cc8:ev-historical",
    authority: "CC:8",
    provenanceRef: "csv:old-capacity.csv",
    provenanceKind: "csv-source",
    dataRealityAcceptance: "historical",
    supportState: "authoritative",
    semanticConfirmationState: "AUTHORITATIVE",
    semanticFieldLabel: null,
    freshness: "historical",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-production",
    sceneRelevance: "low",
  }),
  record({
    evidenceRef: "cc8:ev-bkl",
    authority: "CC:8",
    provenanceRef: "csv:ops.csv#BKL",
    provenanceKind: "csv-source",
    dataRealityAcceptance: "accepted",
    supportState: "ambiguous",
    semanticConfirmationState: "unresolved",
    semanticFieldLabel: "BKL",
    freshness: "current",
    causalSupport: "none",
    relevantToQuestion: true,
    attachedToKind: "object",
    attachedToId: "obj-production",
    sceneRelevance: "medium",
  }),
]);

function sceneFor(need: DthExpDirectorManagementNeed, bottleneck: string | null = null) {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: need,
  });
  const composed = composeNexoraDirectorSceneContext({ selection, directorPlan: dirPlan(), graph: graph() });
  const scene = composed.recipeResolution?.scene;
  if (!scene || !selection.selectedFamily) throw new Error(`missing scene for ${need}`);
  const spatial = projectDthExpSpatialLayout({
    scene,
    family: selection.selectedFamily,
    bottleneckFocusCanonicalObjectId: bottleneck,
  });
  return { composed, scene, spatial, family: selection.selectedFamily };
}

function evidence(need: DthExpDirectorManagementNeed, bottleneck: string | null = null, extra?: { readonly missing?: Parameters<typeof projectDthExpEvidenceScene>[0]["missing"]; readonly transition?: Parameters<typeof projectDthExpEvidenceScene>[0]["transition"] }) {
  const ctx = sceneFor(need, bottleneck);
  const projection = projectDthExpEvidenceScene({
    family: ctx.family,
    scene: ctx.scene,
    spatial: ctx.spatial,
    records,
    missing: extra?.missing,
    transition: extra?.transition,
  });
  return { ...ctx, projection };
}

function participant(need: DthExpDirectorManagementNeed, ref: string) {
  return evidence(need).projection.participants.find((item) => item.evidenceRef === ref);
}

test("DTH-EXP:6 identity and boundary", () => {
  assert.equal(dthExpEvidenceSceneIdentity, "NPA-T DTH-EXP:6/EvidenceInScene");
  assert.equal(verifyDthExpEvidenceSceneBoundary().ok, true);
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.startsDthExp7, false);
  assert.equal(DTH_EXP_EVIDENCE_SCENE_ENGINE, "DTH-EXP:6/SharedEvidenceProjection");
});

test("1 — Existing Evidence can project into a Theatre Scene", () => {
  const result = evidence("OPERATIONAL_FLOW");
  assert.ok(result.projection.participants.some((item) => item.evidenceRef === "cc8:ev-capacity-17"));
});

test("2 — Evidence projection does not create canonical Evidence", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17");
  assert.equal(item?.copiesEvidence, false);
});

test("3 — Evidence does not become MO Object", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17");
  assert.equal(item?.isMoCatalogMember, false);
  assert.equal(item?.isCanonicalManagementObject, false);
  assert.equal(item?.isTheatreActor, false);
});

test("4 — Evidence retains canonical/reference identity", () => {
  assert.equal(participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17")?.evidenceRef, "cc8:ev-capacity-17");
  assert.equal(participant("CAUSE_INVESTIGATION", "cc8:ev-capacity-17")?.evidenceRef, "cc8:ev-capacity-17");
});

test("5 — Actor-attached Evidence works", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17");
  assert.equal(item?.attachmentTarget, "actor");
  assert.equal(item?.attachedToId, "obj-production");
});

test("6 — Relationship-attached Evidence works", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-rel-feed");
  assert.equal(item?.attachmentTarget, "relationship");
  assert.equal(item?.attachedToId, "rel-supplier-production");
});

test("7 — Investigation Evidence works without causal promotion", () => {
  const item = participant("CAUSE_INVESTIGATION", "cc8:ev-staffing-corr");
  assert.equal(item?.attachmentTarget, "investigation");
  assert.equal(item?.causalSupport, "insufficient");
  assert.equal(evidence("CAUSE_INVESTIGATION").projection.upgradesCausality, false);
});

test("8 — Scene-level Evidence is used only when appropriate", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-no-provenance");
  assert.equal(item?.attachmentTarget, "scene");
  assert.notEqual(participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17")?.attachmentTarget, "scene");
});

test("9 — Evidence provenance is preserved", () => {
  assert.equal(participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17")?.provenanceRef, "csv:capacity-ops.csv");
  assert.equal(participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17")?.provenanceKind, "csv-source");
});

test("10 — Missing provenance is not invented", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-no-provenance");
  assert.equal(item?.provenanceRef, null);
  assert.equal(item?.provenanceInvented, false);
});

test("11 — Existing support/confirmation state is preserved", () => {
  assert.equal(participant("CAUSE_INVESTIGATION", "cc8:evidence:cost-rise")?.supportState, "manager-confirmed");
  assert.equal(participant("CAUSE_INVESTIGATION", "cc8:evidence:cost-rise")?.semanticConfirmationState, "MANAGER_CONFIRMED");
});

test("12 — Scene relevance is distinct from Evidence strength", () => {
  const weak = participant("CAUSE_INVESTIGATION", "cc8:ev-staffing-corr");
  assert.equal(weak?.sceneRelevance, "high");
  assert.equal(weak?.supportState, "insufficient");
});

test("13 — Visual prominence does not create confidence", () => {
  assert.equal(evidence("CAUSE_INVESTIGATION").projection.visualProminenceCreatesConfidence, false);
  assert.equal(participant("CAUSE_INVESTIGATION", "cc8:ev-capacity-17")?.visualProminenceCreatesConfidence, false);
});

test("14 — Evidence count does not create confidence", () => {
  assert.equal(evidence("OPERATIONAL_FLOW").projection.evidenceCountCreatesConfidence, false);
});

test("15 — Missing Evidence can be represented safely", () => {
  const result = evidence("CAUSE_INVESTIGATION", null, {
    missing: Object.freeze([
      Object.freeze({
        missingState: "insufficient" as const,
        attachedToKind: "investigation" as const,
        attachedToId: "obj-staffing",
        reason: "correlation-without-causal-authority",
      }),
    ]),
  });
  assert.equal(result.projection.missing[0]?.missingState, "insufficient");
  assert.equal(result.projection.participants.some((item) => item.evidenceRef === "invented-cause"), false);
});

test("16 — Insufficient causal Evidence remains insufficient", () => {
  assert.equal(participant("CAUSE_INVESTIGATION", "cc8:ev-staffing-corr")?.causalSupport, "insufficient");
});

test("17 — Unrelated Evidence is omitted", () => {
  assert.equal(evidence("OPERATIONAL_FLOW").projection.participants.some((item) => item.evidenceRef === "cc8:ev-unrelated"), false);
});

test("18 — Disclosure states are presentation-only", () => {
  const flow = participant("OPERATIONAL_FLOW", "cc8:ev-capacity-17");
  const cause = participant("CAUSE_INVESTIGATION", "cc8:ev-capacity-17");
  assert.equal(flow?.disclosure, "summary");
  assert.equal(cause?.disclosure, "expanded");
  assert.equal(flow?.evidenceRef, cause?.evidenceRef);
});

test("19 — Evidence clusters preserve individual identities", () => {
  const cluster = evidence("OPERATIONAL_FLOW").projection.clusters.find((item) => item.attachedToId === "obj-production");
  assert.ok(cluster);
  assert.equal(cluster?.mergesIntoCanonicalEvidence, false);
  assert.ok(cluster?.memberEvidenceRefs.includes("cc8:ev-capacity-17"));
  assert.ok(cluster?.memberEvidenceRefs.includes("cc8:ev-maintenance"));
});

test("20 — NexoBubble consumes Evidence without ranking", () => {
  assert.equal(evidence("PORTFOLIO_COMPARISON").projection.ranksBubbleCandidates, false);
});

test("21 — NexoBars consumes Evidence without recalculation", () => {
  assert.equal(evidence("MAGNITUDE_COMPARISON").projection.recalculatesBars, false);
});

test("22 — NexoFlow attaches Evidence to flow context", () => {
  const result = evidence("OPERATIONAL_FLOW");
  assert.ok(result.projection.participants.some((item) => item.attachedToId === "obj-production"));
  assert.ok(result.projection.participants.some((item) => item.attachmentTarget === "relationship"));
});

test("23 — NexoImpact preserves VAI authority", () => {
  const result = evidence("VARIABLE_LEVER");
  assert.equal(result.projection.assignsVaiRoles, false);
  assert.equal(result.scene.actors.find((item) => item.canonicalObjectId === "obj-staffing")?.vaiRoleRef, "LEVER");
});

test("24 — NexoRisk preserves Risk authority", () => {
  const result = evidence("RISK_FOCUS");
  assert.equal(result.projection.calculatesRisk, false);
  assert.equal(result.scene.actors.find((item) => item.canonicalObjectId === "obj-risk-gap")?.objectAuthority, "MO:1");
});

test("25 — NexoTime creates no Timeline authority", () => {
  assert.equal(evidence("TEMPORAL_DEVELOPMENT").projection.parallelTimelineAuthority, false);
});

test("26 — NexoCause preserves causal safety", () => {
  const result = evidence("CAUSE_INVESTIGATION");
  assert.equal(result.projection.upgradesCausality, false);
  assert.equal(result.scene.relationships.find((item) => item.relationshipId === "rel-cost-line")?.semanticRelation, "associated");
});

test("27 — NexoExecution preserves CC:11 authority", () => {
  const result = evidence("EXECUTION_STATUS");
  assert.equal(result.projection.writesExecution, false);
  assert.equal(result.scene.writes.executionState, false);
});

test("28 — NexoOutcome preserves Outcome/Learning authority", () => {
  const result = evidence("OUTCOME_ASSESSMENT");
  assert.equal(result.projection.writesOutcome, false);
  assert.equal(result.scene.writes.outcome, false);
});

test("29 — 5A placement semantics are reused", () => {
  const result = evidence("OPERATIONAL_FLOW");
  const item = result.projection.participants.find((entry) => entry.evidenceRef === "cc8:ev-capacity-17");
  const hint = result.spatial.evidenceHints.find((entry) => entry.evidenceRef === "cc8:ev-capacity-17");
  assert.equal(item?.placementHintReusedFrom5A, true);
  assert.deepEqual(item?.position, hint?.position);
});

test("30 — 5B transition semantics can preserve Evidence identity", () => {
  const flow = sceneFor("OPERATIONAL_FLOW");
  const cause = sceneFor("CAUSE_INVESTIGATION");
  const plan = planDthExpSceneTransition({
    source: flow.spatial,
    target: cause.spatial,
    sourceScene: flow.scene,
    targetScene: cause.scene,
  });
  const projected = projectDthExpEvidenceScene({
    family: "NEXO_CAUSE",
    scene: cause.scene,
    spatial: cause.spatial,
    records,
    transition: plan,
  });
  assert.equal(plan.identity, dthExpSceneTransitionIdentity);
  assert.equal(projected.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17")?.evidenceRef, "cc8:ev-capacity-17");
  assert.ok(projected.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17")?.evidenceReason.startsWith("5b-identity-preserved"));
});

test("31 — Reduced-motion preserves Evidence meaning", () => {
  const result = evidence("CAUSE_INVESTIGATION");
  assert.equal(result.projection.reducedMotion.movement, false);
  assert.equal(result.projection.reducedMotion.managementMeaningPreserved, true);
  assert.ok(result.projection.reducedMotion.attachments.length > 0);
  assert.ok(result.projection.reducedMotion.supportStates.includes("insufficient"));
});

test("32 — Under-review Data Reality is not promoted to accepted Evidence", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-under-review");
  assert.equal(item?.dataRealityAcceptance, "under-review");
  assert.equal(item?.suppliesCurrentReality, false);
});

test("33 — Historical/removed source does not supply current reality", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-historical");
  assert.equal(item?.dataRealityAcceptance, "historical");
  assert.equal(item?.suppliesCurrentReality, false);
});

test("34 — Ambiguous semantic field remains unresolved", () => {
  const item = participant("OPERATIONAL_FLOW", "cc8:ev-bkl");
  assert.equal(item?.semanticFieldLabel, "BKL");
  assert.equal(item?.semanticConfirmationState, "unresolved");
  assert.equal(item?.inventedSemanticMeaning, false);
});

test("35 — No Decision write occurs", () => {
  assert.equal(evidence("CAUSE_INVESTIGATION").projection.writesDecision, false);
});

test("36 — No Execution write occurs", () => {
  assert.equal(evidence("EXECUTION_STATUS").projection.writesExecution, false);
});

test("37 — No Outcome/Learning write occurs", () => {
  assert.equal(evidence("OUTCOME_ASSESSMENT").projection.writesOutcome, false);
});

test("38 — Same input produces deterministic Evidence projection", () => {
  const first = evidence("OPERATIONAL_FLOW");
  const second = evidence("OPERATIONAL_FLOW");
  assert.deepEqual(first.projection.participants, second.projection.participants);
  assert.deepEqual(first.projection.clusters, second.projection.clusters);
});

test("39 — Stage authority remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("40 — Director authority remains DIR:1", () => {
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("41 — No second Evidence/Data Reality authority is created", () => {
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.parallelEvidenceStore, false);
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.parallelDataReality, false);
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.evidenceAuthority, "CC:8");
});

test("42 — No live /executive wiring is introduced", () => {
  assert.equal(evidence("OPERATIONAL_FLOW").projection.liveStageWiring, false);
  assert.equal(DTH_EXP_EVIDENCE_SCENE_BOUNDARY.liveEvidenceUi, false);
});

test("43 — DTH-EXP:1–5B gates remain green", () => {
  assert.equal(verifyDthExpSceneTransitionBoundary().ok, true);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: selectNexoraMVPInteractionSubject(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "obj-revenue",
      catalog,
    ),
    catalog,
  });
  const scene = projectDthExpTheatreScene({
    theatre,
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
});

test("certification journey: Product Line A Evidence across perspectives", () => {
  const flow = evidence("OPERATIONAL_FLOW");
  assert.ok(flow.projection.participants.filter((item) => item.disclosure === "expanded").length < flow.projection.participants.length);
  const bottleneck = evidence("OPERATIONAL_FLOW", "obj-production");
  assert.equal(bottleneck.projection.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17")?.supportState, "authoritative");
  const cause = evidence("CAUSE_INVESTIGATION");
  assert.equal(cause.projection.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17")?.disclosure, "expanded");
  assert.equal(cause.projection.upgradesCausality, false);
  const challenge = evidence("CAUSE_INVESTIGATION", null, {
    missing: Object.freeze([
      Object.freeze({
        missingState: "insufficient" as const,
        attachedToKind: "investigation" as const,
        attachedToId: "obj-staffing",
        reason: "staffing-correlation-is-not-confirmed-cause",
      }),
    ]),
  });
  assert.equal(challenge.projection.missing[0]?.missingState, "insufficient");
  assert.equal(challenge.projection.participants.find((item) => item.evidenceRef === "cc8:ev-staffing-corr")?.causalSupport, "insufficient");
  assert.equal(flow.projection.participants.find((item) => item.evidenceRef === "cc8:ev-bkl")?.semanticConfirmationState, "unresolved");
  const impact = evidence("VARIABLE_LEVER");
  assert.equal(impact.projection.participants.find((item) => item.evidenceRef === "cc8:ev-staffing-corr")?.evidenceRef, "cc8:ev-staffing-corr");
  assert.equal(impact.projection.assignsVaiRoles, false);
  assert.equal(cause.projection.reducedMotion.managementMeaningPreserved, true);
});
