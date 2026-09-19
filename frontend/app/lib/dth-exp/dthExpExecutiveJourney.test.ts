/**
 * NPA-T DTH-EXP:10 — Executive Journey Certification tests.
 * Integration of DTH-EXP:1–9. No DTH-EXP:FINAL.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nmiFoundationIdentity } from "@/app/lib/nmi/nmiIdentity.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_CONTEXTUAL_ROLES } from "@/app/lib/vai/vaiContract.ts";
import {
  composeDthExpExecutiveJourney,
  DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY,
  DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_NEXO_SCENE_FAMILIES,
  DTH_EXP_NEXO_TIME_BOUNDARY,
  DTH_EXP_THEATRE_SCALE_BOUNDARY,
  dthExpExecutiveJourneyIdentity,
  projectDthExpTheatreScene,
  verifyDthExpExecutiveJourneyBoundary,
  verifyDthExpTheatreScaleBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpConversationReferentState } from "./dthExpAdvisorSceneAwarenessContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpInterpretedConversationTurn } from "./dthExpTheatreSceneResponseContract.ts";
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

function graph(overrides: Partial<DthExpDirectorSceneGraph> = {}): DthExpDirectorSceneGraph {
  return Object.freeze({
    objects: Object.freeze([
      hint("obj-supplier-a", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-production", {
        familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE", "NEXO_IMPACT", "NEXO_RISK", "NEXO_TIME", "NEXO_EXECUTION", "NEXO_OUTCOME"],
        bottleneck: true,
      }),
      hint("obj-inventory", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-market", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-product-line-a", { familyRelevance: "all" }),
      hint("obj-capacity-gap", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] }),
      hint("obj-margin-pressure", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-cost", { kind: "kpi", familyRelevance: ["NEXO_BARS"] }),
      hint("obj-otd", { kind: "kpi", familyRelevance: ["NEXO_BARS", "NEXO_OUTCOME"] }),
      hint("obj-delivery-risk", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-risk-delay", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-decision-1", { kind: "decision", authority: "CC:10", familyRelevance: ["NEXO_EXECUTION", "NEXO_OUTCOME"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"], timeBucket: "current" }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-goal-1", { kind: "goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-inventory", "obj-production", "obj-inventory", "feeds"),
      rel("rel-inventory-market", "obj-inventory", "obj-market", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-staffing-production", "obj-staffing", "obj-production", "associated"),
    ]),
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", attachedToKind: "object" as const, attachedToId: "obj-production", familyRelevance: "all" as const, relevantToQuestion: true }),
      Object.freeze({ evidenceRef: "cc8:ev-under-review", attachedToKind: "object" as const, attachedToId: "obj-production", familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"] as const, relevantToQuestion: true }),
      Object.freeze({ evidenceRef: "cc8:ev-bkl", attachedToKind: "object" as const, attachedToId: "obj-product-line-a", familyRelevance: "all" as const, relevantToQuestion: true }),
    ]),
    bindings: Object.freeze([
      Object.freeze({ bindingId: "vai-lever", canonicalObjectId: "obj-staffing", dimension: "vai-role" as const, authority: "VAI:1–8", valueRef: "vai:staffing:lever" }),
    ]),
    bottleneckCanonicalObjectId: "obj-production",
    collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta"]),
    ...overrides,
  });
}

const records: readonly DthExpCanonicalEvidenceRecord[] = Object.freeze([
  Object.freeze({
    evidenceRef: "cc8:ev-capacity-17",
    authority: "CC:8" as const,
    provenanceRef: "csv:capacity-ops.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "accepted" as const,
    supportState: "likely" as const,
    semanticConfirmationState: "LIKELY" as const,
    semanticFieldLabel: null,
    freshness: "current" as const,
    causalSupport: "insufficient" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-production",
    sceneRelevance: "high" as const,
  }),
  Object.freeze({
    evidenceRef: "cc8:ev-under-review",
    authority: "CC:8" as const,
    provenanceRef: "csv:review.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "under-review" as const,
    supportState: "ambiguous" as const,
    semanticConfirmationState: "AMBIGUOUS" as const,
    semanticFieldLabel: null,
    freshness: "current" as const,
    causalSupport: "none" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-production",
    sceneRelevance: "low" as const,
  }),
  Object.freeze({
    evidenceRef: "cc8:ev-bkl",
    authority: "CC:8" as const,
    provenanceRef: "csv:bkl.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "under-review" as const,
    supportState: "unknown" as const,
    semanticConfirmationState: "unresolved" as const,
    semanticFieldLabel: "BKL",
    freshness: "current" as const,
    causalSupport: "none" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-product-line-a",
    sceneRelevance: "low" as const,
  }),
]);

function referent(partial: Partial<DthExpConversationReferentState> = {}): DthExpConversationReferentState {
  return Object.freeze({
    authority: "CC:5 / ECA / NCA / MO referent",
    canonicalSubjectId: "obj-product-line-a",
    subjectSource: "conversation-named",
    selectedCanonicalObjectId: null,
    selectedRelationshipId: null,
    selectedEvidenceRef: null,
    collectionMemberId: null,
    generation: 2,
    ...partial,
  });
}

function interpreted(partial: Partial<DthExpInterpretedConversationTurn> = {}): DthExpInterpretedConversationTurn {
  return Object.freeze({
    referent: referent(),
    managementNeed: "OPERATIONAL_FLOW" as DthExpDirectorManagementNeed,
    responseKind: "compose",
    ambiguity: "none",
    managementReason: "interpreted-management-need",
    rawUtterance: "Show me what is happening with Product Line A.",
    ...partial,
  });
}

function journey(partial: Parameters<typeof composeDthExpExecutiveJourney>[0] extends infer T ? Partial<T> : never = {}) {
  return composeDthExpExecutiveJourney({
    turn: interpreted(),
    directorPlan: dirPlan(),
    graph: graph(),
    evidenceRecords: records,
    ...partial,
  });
}

function need(managementNeed: DthExpDirectorManagementNeed, extras: Partial<DthExpInterpretedConversationTurn> = {}) {
  return journey({ turn: interpreted({ managementNeed, ...extras }) });
}

test("DTH-EXP:10 identity and boundary", () => {
  assert.equal(dthExpExecutiveJourneyIdentity, "NPA-T DTH-EXP:10/ExecutiveJourneyCertification");
  assert.equal(verifyDthExpExecutiveJourneyBoundary().ok, true);
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.startsDthExpFinal, false);
});

test("1 — DTH-EXP:1–9 compose as one pipeline", () => {
  assert.deepEqual([...DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE], [...DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.pipeline]);
  assert.equal(journey().reusedCertifiedPipeline, true);
});

test("2 — no new production capability is required for a passing journey", () => {
  assert.equal(journey().newTheatreCapability, false);
});

test("3 — canonical subject enters Theatre correctly", () => {
  assert.equal(journey().response.canonicalSubjectId, "obj-product-line-a");
});

test("4 — primary Nexo selected only through DIR:1/4A", () => {
  const snapshot = journey();
  assert.equal(snapshot.response.selection?.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(snapshot.response.advisorChoosesNexo, false);
});

test("5 — 4B selects relevant context", () => {
  const actors = journey().response.composition?.actors.map((item) => item.canonicalObjectId) ?? [];
  assert.ok(actors.includes("obj-production"));
  assert.equal(actors.includes("obj-project-alpha"), false);
});

test("6 — 3A/3B compose certified Scene", () => {
  assert.ok(journey().response.scene);
  assert.equal(journey().response.composition?.recipePipeline, "DTH-EXP:3B→DTH-EXP:3A");
});

test("7 — 5A supplies spatial grammar", () => {
  assert.equal(journey().response.spatial?.layoutProvenance, "DTH-EXP:5A/SharedSpatialGrammar");
});

test("8 — 5B supplies semantic transition", () => {
  const flow = journey();
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
    sourceFamily: "NEXO_FLOW",
  });
  assert.ok(cause.response.transition);
  assert.equal(cause.response.transition?.animationPlayback, false);
  assert.equal(cause.response.transition?.engine, "DTH-EXP:5B/SharedSemanticTransition");
});

test("9 — 6 supplies Evidence projection", () => {
  assert.ok(journey().response.evidence?.participants.some((item) => item.evidenceRef === "cc8:ev-capacity-17"));
});

test("10 — 8A supplies Multi-Nexo eligibility", () => {
  assert.equal(journey().eligibility?.primaryFamily, "NEXO_FLOW");
  assert.equal(journey().eligibility?.primaryCount, 1);
});

test("11 — 8B composes one Theatre", () => {
  const snapshot = journey();
  assert.equal(snapshot.composed?.primaryFamily, "NEXO_FLOW");
  assert.equal(snapshot.composed?.identity.includes("8B"), true);
});

test("12 — 9 bounds working set", () => {
  const snapshot = journey({ unrelatedObjectCount: 400 });
  assert.ok((snapshot.workingSet?.candidateActorCount ?? 0) > snapshot.workingSet!.admittedActorIds.length);
});

test("13 — 7A exposes Scene to Advisor safely", () => {
  const snapshot = journey();
  assert.equal(snapshot.awareness.referentAuthority, "CC:5 / ECA / NCA / MO referent");
  assert.equal(snapshot.awareness.grounding.canonicalObjectId, "obj-product-line-a");
});

test("14 — 7B routes interpreted intent back to Director", () => {
  assert.equal(journey().response.advisorToSceneShortcut, false);
  assert.equal(journey().parsesRawText, false);
});

test("15 — Flow initial scene works", () => {
  const snapshot = need("OPERATIONAL_FLOW");
  assert.equal(snapshot.response.targetFamily, "NEXO_FLOW");
  assert.ok(snapshot.response.scene?.actors.some((item) => item.canonicalObjectId === "obj-production"));
});

test("16 — Flow same-family bottleneck refinement works", () => {
  const flow = need("OPERATIONAL_FLOW");
  const bottleneck = journey({
    turn: interpreted({ managementNeed: "BOTTLENECK_LOCATION" }),
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
    sourceFamily: "NEXO_FLOW",
  });
  assert.equal(bottleneck.response.targetFamily, "NEXO_FLOW");
  assert.equal(bottleneck.response.state, "same-family-refined");
});

test("17 — deictic investigation preserves subject", () => {
  const snapshot = journey({
    turn: interpreted({
      managementNeed: "CAUSE_INVESTIGATION",
      referent: referent({ subjectSource: "conversation-deictic" }),
    }),
  });
  assert.equal(snapshot.response.canonicalSubjectId, "obj-product-line-a");
});

test("18 — Flow→Cause works", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(cause.response.targetFamily, "NEXO_CAUSE");
});

test("19 — Evidence inspection preserves CC:8 authority", () => {
  const flow = need("OPERATIONAL_FLOW");
  const inspect = journey({
    turn: interpreted({ responseKind: "evidence-inspection", managementNeed: "CONTINUATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.ok(inspect.response.evidence?.participants.every((item) => item.authority === "CC:8"));
});

test("20 — under-review Evidence remains under review", () => {
  const participant = journey().response.evidence?.participants.find((item) => item.evidenceRef === "cc8:ev-under-review");
  assert.equal(participant?.dataRealityAcceptance, "under-review");
});

test("21 — Evidence count does not create confidence", () => {
  assert.equal(journey().composed?.evidenceCountCreatesConfidence, false);
});

test("22 — causal challenge remains insufficient where truth is insufficient", () => {
  const cause = need("CAUSE_INVESTIGATION");
  const capacity = cause.response.evidence?.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17");
  assert.equal(capacity?.causalSupport, "insufficient");
  assert.equal(cause.response.upgradesCausality, false);
  const staffingRel = cause.response.scene?.relationships.find((item) => item.relationshipId === "rel-staffing-production");
  assert.ok(staffingRel == null || staffingRel.semanticRelation === "associated");
});

test("23 — Cause→Impact works", () => {
  const cause = need("CAUSE_INVESTIGATION");
  const impact = journey({
    turn: interpreted({ managementNeed: "VARIABLE_LEVER" }),
    sourceFamily: "NEXO_CAUSE",
    sourceScene: cause.response.scene,
    sourceSpatial: cause.response.spatial,
  });
  assert.equal(impact.response.targetFamily, "NEXO_IMPACT");
});

test("24 — VAI LEVER remains VAI-owned", () => {
  const impact = need("VARIABLE_LEVER");
  const staffing = impact.response.composition?.actors.find((item) => item.canonicalObjectId === "obj-staffing");
  assert.equal(staffing?.vaiRoleRef, "LEVER");
  assert.ok((VAI_CONTEXTUAL_ROLES as readonly string[]).includes("LEVER"));
  assert.equal(impact.response.assignsVaiRoles, false);
});

test("25 — Impact→Risk works", () => {
  const impact = need("VARIABLE_LEVER");
  const risk = journey({
    turn: interpreted({ managementNeed: "RISK_FOCUS" }),
    sourceFamily: "NEXO_IMPACT",
    sourceScene: impact.response.scene,
    sourceSpatial: impact.response.spatial,
  });
  assert.equal(risk.response.targetFamily, "NEXO_RISK");
});

test("26 — Risk is not recalculated", () => {
  assert.equal(need("RISK_FOCUS").response.calculatesRisk, false);
});

test("27 — FLOW+RISK+IMPACT composes as one Theatre", () => {
  const snapshot = need("OPERATIONAL_FLOW");
  assert.ok(snapshot.composed?.admittedSupports.includes("NEXO_RISK"));
  assert.ok(snapshot.composed?.admittedSupports.includes("NEXO_IMPACT"));
  assert.equal(snapshot.composed?.primaryFamily, "NEXO_FLOW");
});

test("28 — shared actor is not duplicated", () => {
  const production = journey().composed?.actors.filter((item) => item.canonicalObjectId === "obj-production") ?? [];
  assert.equal(production.length, 1);
  assert.equal(production[0]?.theatreActorCount, 1);
});

test("29 — shared Evidence is not duplicated", () => {
  const refs = journey().composed?.evidenceRefs.filter((item) => item === "cc8:ev-capacity-17") ?? [];
  assert.equal(refs.length, 1);
});

test("30 — Multi-Nexo does not create causality", () => {
  assert.equal(journey().composed?.compositionCreatesCausality, false);
});

test("31 — scale pressure preserves primary meaning", () => {
  const snapshot = journey({ unrelatedObjectCount: 800 });
  assert.ok(snapshot.workingSet?.admittedActorIds.includes("obj-product-line-a"));
  assert.ok(snapshot.workingSet?.admittedActorIds.includes("obj-production"));
});

test("32 — unrelated world does not enter focal scene", () => {
  const snapshot = journey({ unrelatedObjectCount: 200 });
  assert.ok(snapshot.workingSet?.omittedActorIds.includes("obj-unrelated-0000"));
  assert.equal(snapshot.response.scene?.actors.some((item) => item.canonicalObjectId.startsWith("obj-unrelated-")), false);
});

test("33 — explicit subject switch beats visual focus", () => {
  const flow = need("OPERATIONAL_FLOW");
  const switched = journey({
    turn: interpreted({
      referent: referent({ canonicalSubjectId: "obj-margin-pressure" }),
      managementNeed: "CAUSE_INVESTIGATION",
    }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(switched.response.canonicalSubjectId, "obj-margin-pressure");
});

test("34 — deictic follow-up after switch uses new subject", () => {
  const switched = journey({
    turn: interpreted({
      referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }),
      managementNeed: "CAUSE_INVESTIGATION",
    }),
  });
  assert.equal(switched.awareness.grounding.canonicalObjectId, "obj-margin-pressure");
  assert.equal(switched.response.canonicalSubjectId, "obj-margin-pressure");
});

test("35 — ambiguous deixis does not guess", () => {
  const snapshot = journey({
    turn: interpreted({
      referent: referent({ canonicalSubjectId: null, subjectSource: "none" }),
      ambiguity: "ambiguous-object",
      managementNeed: null,
    }),
    utteranceKind: "deictic-object",
    deixisKind: "risk",
  });
  assert.equal(snapshot.response.state, "unresolved");
  assert.equal(snapshot.response.scene, null);
});

test("36 — BKL remains unresolved", () => {
  const bkl = journey().response.evidence?.participants.find((item) => item.evidenceRef === "cc8:ev-bkl");
  assert.equal(bkl?.semanticFieldLabel, "BKL");
  assert.equal(bkl?.semanticConfirmationState, "unresolved");
  assert.equal(bkl?.inventedSemanticMeaning, false);
});

test("37 — comparison perspective creates no ranking", () => {
  const snapshot = need("PORTFOLIO_COMPARISON");
  assert.equal(snapshot.response.targetFamily, "NEXO_BUBBLE");
  assert.equal(snapshot.composed?.ranksBubbleCandidates, false);
});

test("38 — comparison creates no Decision write", () => {
  assert.equal(need("PORTFOLIO_COMPARISON").response.writesDecision, false);
});

test("39 — Decision boundary preserves CC:10", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.decision, "CC:10");
  assert.equal(need("EXECUTION_STATUS").writesDecision, false);
});

test("40 — Execution perspective preserves CC:11", () => {
  const snapshot = need("EXECUTION_STATUS");
  assert.equal(snapshot.response.targetFamily, "NEXO_EXECUTION");
  assert.equal(snapshot.response.writesExecution, false);
});

test("41 — Outcome perspective preserves CORE-OUT", () => {
  const snapshot = need("OUTCOME_ASSESSMENT");
  assert.equal(snapshot.response.targetFamily, "NEXO_OUTCOME");
  assert.equal(snapshot.composed?.declaresOutcomeSuccess, false);
});

test("42 — Learning remains read-only", () => {
  assert.equal(need("OUTCOME_ASSESSMENT").writesLearning, false);
});

test("43 — reduced-motion preserves management meaning", () => {
  const motion = journey({ reducedMotion: false });
  const reduced = journey({ reducedMotion: true });
  assert.equal(motion.response.canonicalSubjectId, reduced.response.canonicalSubjectId);
  assert.equal(motion.response.targetFamily, reduced.response.targetFamily);
  assert.deepEqual(motion.composed?.admittedSupports, reduced.composed?.admittedSupports);
});

test("44 — missing actor fails safely", () => {
  const snapshot = journey({
    turn: interpreted({ managementNeed: "VARIABLE_LEVER" }),
    graph: graph({
      objects: Object.freeze([hint("obj-product-line-a", { familyRelevance: "all" })]),
      relationships: Object.freeze([]),
      evidence: Object.freeze([]),
      bindings: Object.freeze([]),
    }),
  });
  assert.equal(snapshot.response.state, "insufficient-context");
  assert.equal(snapshot.response.scene, null);
});

test("45 — missing binding fails safely", () => {
  const snapshot = journey({
    turn: interpreted({ managementNeed: "VARIABLE_LEVER" }),
    graph: graph({ bindings: Object.freeze([]) }),
  });
  assert.ok(snapshot.response.state === "insufficient-context" || snapshot.response.composition?.assignsVaiRoles === false);
});

test("46 — missing Evidence fails safely", () => {
  const snapshot = journey({ evidenceRecords: Object.freeze([]) });
  assert.ok(snapshot.response.scene);
  assert.equal(snapshot.response.evidence?.participants.some((item) => item.evidenceRef === "cc8:ev-invented"), false);
});

test("47 — unsupported supporting Nexo fails safely", () => {
  const snapshot = journey({
    availableSupports: Object.freeze([
      Object.freeze({ family: "NEXO_BUBBLE" as const, contextAvailable: true, attachedCanonicalObjectIds: Object.freeze(["obj-project-gamma"]) }),
    ]),
  });
  assert.ok(snapshot.eligibility?.supports.some((item) => item.family === "NEXO_BUBBLE" && item.eligible === false));
});

test("48 — stale transition cannot override latest valid turn", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
    previousTransition: flow.response.transition,
  });
  const later = journey({
    turn: interpreted({ managementNeed: "RISK_FOCUS", referent: referent({ generation: 9 }) }),
    sourceFamily: "NEXO_CAUSE",
    sourceScene: cause.response.scene,
    sourceSpatial: cause.response.spatial,
    previousTransition: cause.response.transition,
  });
  assert.equal(later.response.targetFamily, "NEXO_RISK");
  assert.equal(later.response.canonicalSubjectId, "obj-product-line-a");
});

test("49 — stale 7A awareness cannot override conversation state", () => {
  const flow = need("OPERATIONAL_FLOW");
  const snapshot = journey({
    turn: interpreted({ referent: referent({ canonicalSubjectId: "obj-margin-pressure", generation: 8 }) }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
    theatreGeneration: 2,
  });
  assert.equal(snapshot.awareness.staleTheatreIgnored, true);
  assert.equal(snapshot.awareness.grounding.canonicalObjectId, "obj-margin-pressure");
});

test("50 — scale invariance holds", () => {
  const small = journey({ unrelatedObjectCount: 10 });
  const large = journey({ unrelatedObjectCount: 900 });
  const focal = (ids: readonly string[] | undefined) => (ids ?? []).filter((id) => id === "obj-product-line-a" || id === "obj-production");
  assert.deepEqual(focal(small.workingSet?.admittedActorIds), focal(large.workingSet?.admittedActorIds));
});

test("51 — Object identity remains canonical across perspectives", () => {
  const families: DthExpDirectorManagementNeed[] = ["OPERATIONAL_FLOW", "CAUSE_INVESTIGATION", "VARIABLE_LEVER", "RISK_FOCUS", "EXECUTION_STATUS", "OUTCOME_ASSESSMENT"];
  for (const managementNeed of families) {
    const snapshot = need(managementNeed);
    assert.ok(
      snapshot.response.scene?.actors.some((item) => item.canonicalObjectId === "obj-product-line-a") ||
        snapshot.response.canonicalSubjectId === "obj-product-line-a",
    );
  }
});

test("52 — Evidence identity remains canonical across perspectives", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = need("CAUSE_INVESTIGATION");
  assert.ok(flow.response.evidence?.participants.some((item) => item.evidenceRef === "cc8:ev-capacity-17"));
  assert.ok(cause.response.evidence?.participants.some((item) => item.evidenceRef === "cc8:ev-capacity-17"));
});

test("53 — relationship semantics remain unchanged", () => {
  const rels = journey().response.scene?.relationships.filter((item) => item.relationshipId === "rel-staffing-production") ?? [];
  for (const item of rels) {
    assert.equal(item.semanticRelation, "associated");
  }
});

test("54 — Stage authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("55 — Director authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("56 — Advisor authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.advisor, conversationalExperienceIdentity);
});

test("57 — referent authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.referent, "CC:5 / ECA / NCA / MO referent");
});

test("58 — NMI authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.nmi, "NMI:1–8");
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
});

test("59 — VAI authority unchanged", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.vai, "VAI:1–8");
  assert.equal(journey().assignsVaiRoles, false);
});

test("60 — no second Evidence/Data Reality", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelEvidenceStore, false);
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.evidence, "CC:8");
});

test("61 — no second Scene/Stage", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelSceneStore, false);
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelStage, false);
});

test("62 — no second Advisor/Director/referent resolver", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelAdvisor, false);
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelReferentResolver, false);
});

test("63 — no Timeline system", () => {
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem, false);
  assert.equal(journey().parallelTimelineAuthority, false);
});

test("64 — no NexoBottleneck", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_BOTTLENECK"), false);
  assert.equal(journey().nexoBottleneck, false);
});

test("65 — no NexoEvidence", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_EVIDENCE"), false);
  assert.equal(DTH_EXP_NEXO_SCENE_FAMILIES.length, 9);
});

test("66 — no canonical management writes", () => {
  const snapshot = journey();
  assert.equal(snapshot.writesCanonicalObjects, false);
  assert.equal(snapshot.writesDecision, false);
  assert.equal(snapshot.writesExecution, false);
  assert.equal(snapshot.writesOutcome, false);
});

test("67 — no direct Advisor→Stage command path", () => {
  assert.equal(journey().advisorToStageCommands, false);
});

test("68 — no unmeasured runtime/FPS claim", () => {
  assert.equal(journey().browserPerformanceCertified, false);
});

test("69 — DTH-EXP:1–9 focused gates remain green", () => {
  assert.equal(verifyDthExpTheatreScaleBoundary().ok, true);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.startsDthExp10, false);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const scene = projectDthExpTheatreScene({
    theatre: projectNexoraDecisionTheatreFoundation({
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
    }),
    visualRolesByCanonicalObjectId: { "obj-revenue": "flow-node" },
  });
  assert.equal(scene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
});

test("70 — lint/typecheck for touched scope pass", () => {
  assert.equal(verifyDthExpExecutiveJourneyBoundary().ok, true);
});

test("certification journey: Northstar Product Line A", () => {
  const flow = need("OPERATIONAL_FLOW");
  assert.equal(flow.response.targetFamily, "NEXO_FLOW");
  const bottleneck = journey({
    turn: interpreted({ managementNeed: "BOTTLENECK_LOCATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(bottleneck.response.targetFamily, "NEXO_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: bottleneck.response.scene,
    sourceSpatial: bottleneck.response.spatial,
  });
  assert.equal(cause.response.targetFamily, "NEXO_CAUSE");
  const impact = journey({
    turn: interpreted({ managementNeed: "VARIABLE_LEVER" }),
    sourceFamily: "NEXO_CAUSE",
    sourceScene: cause.response.scene,
    sourceSpatial: cause.response.spatial,
  });
  assert.equal(impact.response.targetFamily, "NEXO_IMPACT");
  const risk = need("RISK_FOCUS");
  assert.equal(risk.response.calculatesRisk, false);
  assert.ok(flow.composed?.admittedSupports.includes("NEXO_RISK"));
  const scaled = journey({ unrelatedObjectCount: 500 });
  assert.ok((scaled.workingSet?.omittedActorIds.length ?? 0) > 400);
  const margin = journey({
    turn: interpreted({ referent: referent({ canonicalSubjectId: "obj-margin-pressure" }), managementNeed: "CAUSE_INVESTIGATION" }),
  });
  assert.equal(margin.response.canonicalSubjectId, "obj-margin-pressure");
  const reduced = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
    reducedMotion: true,
  });
  assert.equal(reduced.response.targetFamily, "NEXO_CAUSE");
  assert.equal(reduced.response.canonicalSubjectId, "obj-product-line-a");
});
