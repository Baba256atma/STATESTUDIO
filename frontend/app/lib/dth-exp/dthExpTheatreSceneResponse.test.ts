/**
 * NPA-T DTH-EXP:7B — Advisor → Theatre Scene Response tests.
 * Orchestration only. No parser, Stage commands, or DTH-EXP:8.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY,
  DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE,
  DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE,
  dthExpTheatreSceneResponseIdentity,
  orchestrateDthExpTheatreSceneResponse,
  projectDthExpAdvisorSceneAwareness,
  projectDthExpTheatreScene,
  verifyDthExpAdvisorSceneAwarenessBoundary,
  verifyDthExpTheatreSceneResponseBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpConversationReferentState } from "./dthExpAdvisorSceneAwarenessContract.ts";
import type { DthExpInterpretedConversationTurn } from "./dthExpTheatreSceneResponseContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
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
      hint("obj-production", { familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"], bottleneck: true }),
      hint("obj-product-line-a", { familyRelevance: "all" }),
      hint("obj-market", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-cost", { kind: "kpi", familyRelevance: ["NEXO_BARS", "NEXO_CAUSE"] }),
      hint("obj-margin-pressure", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-risk-supply", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-risk-delay", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"] }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-goal-1", { kind: "goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-cost-line", "obj-margin-pressure", "obj-product-line-a", "associated"),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceRef: "cc8:ev-line-ops",
        attachedToKind: "object" as const,
        attachedToId: "obj-product-line-a",
        familyRelevance: "all" as const,
        relevantToQuestion: true,
      }),
      Object.freeze({
        evidenceRef: "cc8:ev-capacity-17",
        attachedToKind: "object" as const,
        attachedToId: "obj-production",
        familyRelevance: ["NEXO_FLOW", "NEXO_CAUSE"] as const,
        relevantToQuestion: true,
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
    ]),
    bottleneckCanonicalObjectId: "obj-production",
    collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta"]),
    ...overrides,
  });
}

const records: readonly DthExpCanonicalEvidenceRecord[] = Object.freeze([
  Object.freeze({
    evidenceRef: "cc8:ev-line-ops",
    authority: "CC:8" as const,
    provenanceRef: "csv:line-ops.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "accepted" as const,
    supportState: "authoritative" as const,
    semanticConfirmationState: "AUTHORITATIVE" as const,
    semanticFieldLabel: null,
    freshness: "current" as const,
    causalSupport: "none" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-product-line-a",
    sceneRelevance: "high" as const,
  }),
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
    causalSupport: "association" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-production",
    sceneRelevance: "medium" as const,
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

function interpreted(partial: Partial<DthExpInterpretedConversationTurn> & { readonly managementNeed?: DthExpDirectorManagementNeed | null }): DthExpInterpretedConversationTurn {
  return Object.freeze({
    referent: referent(),
    managementNeed: "MAGNITUDE_COMPARISON",
    responseKind: "compose",
    ambiguity: "none",
    managementReason: "interpreted-management-need",
    rawUtterance: null,
    ...partial,
  });
}

function respond(turn: DthExpInterpretedConversationTurn, extras: Omit<Parameters<typeof orchestrateDthExpTheatreSceneResponse>[0], "turn" | "directorPlan" | "graph"> & { readonly graph?: DthExpDirectorSceneGraph } = {}) {
  return orchestrateDthExpTheatreSceneResponse({
    turn,
    directorPlan: dirPlan(),
    graph: extras.graph ?? graph(),
    evidenceRecords: records,
    ...extras,
  });
}

test("DTH-EXP:7B identity and boundary", () => {
  assert.equal(dthExpTheatreSceneResponseIdentity, "NPA-T DTH-EXP:7B/TheatreSceneResponse");
  assert.equal(verifyDthExpTheatreSceneResponseBoundary().ok, true);
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.startsDthExp8, false);
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE, "DTH-EXP:7B/CertifiedPipelineOrchestration");
});

test("1 — Existing interpreted Advisor/conversation turn can produce a Theatre response", () => {
  const result = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  assert.equal(result.state, "composed");
  assert.equal(result.targetFamily, "NEXO_BARS");
  assert.ok(result.scene);
});

test("2 — Raw text is not independently parsed by 7B", () => {
  const result = respond(interpreted({
    managementNeed: "MAGNITUDE_COMPARISON",
    rawUtterance: "Why is this high?",
  }));
  assert.equal(result.parsesRawText, false);
  assert.equal(result.ignoredRawUtterance, true);
  assert.equal(result.targetFamily, "NEXO_BARS");
  assert.notEqual(result.targetFamily, "NEXO_CAUSE");
});

test("3 — 7A grounded subject flows into 7B", () => {
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: referent({ subjectSource: "conversation-deictic" }),
    utteranceKind: "deictic-follow-up",
  });
  const result = respond(interpreted({
    referent: referent({ subjectSource: "conversation-deictic" }),
    managementNeed: "CAUSE_INVESTIGATION",
  }), { awareness });
  assert.equal(awareness.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(result.canonicalSubjectId, awareness.grounding.canonicalObjectId);
});

test("4 — Canonical subject survives the full downstream pipeline", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.canonicalSubjectId, "obj-product-line-a");
  assert.equal(result.selection?.canonicalSubjectId, "obj-product-line-a");
  assert.equal(result.composition?.canonicalSubjectId, "obj-product-line-a");
  assert.ok(result.scene?.focalCanonicalObjectIds.includes("obj-product-line-a"));
  assert.ok(result.spatial?.actors.some((item) => item.canonicalObjectId === "obj-product-line-a"));
});

test("5 — Advisor does not directly choose Nexo", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.advisorChoosesNexo, false);
});

test("6 — DIR:1/4A remains Nexo selector", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.selection?.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(result.targetFamily, "NEXO_CAUSE");
});

test("7 — Advisor does not directly select actors", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.advisorSelectsActors, false);
  assert.ok((result.composition?.actors.length ?? 0) > 0);
});

test("8 — 4B remains context selector", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.composition?.recipePipeline, "DTH-EXP:3B→DTH-EXP:3A");
  assert.equal(result.composition?.inventsActors, false);
});

test("9 — Advisor does not layout actors", () => {
  assert.equal(respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" })).advisorLayoutsActors, false);
});

test("10 — 5A remains spatial projection", () => {
  const result = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  assert.equal(result.spatial?.layoutProvenance, "DTH-EXP:5A/SharedSpatialGrammar");
});

test("11 — Advisor does not animate actors", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(cause.advisorAnimatesActors, false);
});

test("12 — 5B remains transition planner", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(cause.transition?.engine, "DTH-EXP:5B/SharedSemanticTransition");
});

test("13 — Advisor does not manufacture Evidence", () => {
  assert.equal(respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" })).advisorManufacturesEvidence, false);
});

test("14 — CC:8/Data Reality remains Evidence authority", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.ok((result.evidence?.participants ?? []).every((item) => item.authority === "CC:8"));
});

test("15 — Bars → Cause perspective change works", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION", managementReason: "investigation" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(bars.targetFamily, "NEXO_BARS");
  assert.equal(cause.targetFamily, "NEXO_CAUSE");
  assert.equal(cause.canonicalSubjectId, "obj-product-line-a");
  assert.equal(cause.state, "composed");
});

test("16 — Flow → bottleneck same-family response works", () => {
  const flow = respond(interpreted({ managementNeed: "OPERATIONAL_FLOW" }));
  const bottleneck = respond(interpreted({ managementNeed: "BOTTLENECK_LOCATION", managementReason: "focus-refinement" }), {
    sourceScene: flow.scene,
    sourceSpatial: flow.spatial,
    sourceFamily: flow.targetFamily,
  });
  assert.equal(flow.targetFamily, "NEXO_FLOW");
  assert.equal(bottleneck.targetFamily, "NEXO_FLOW");
  assert.equal(bottleneck.state, "same-family-refined");
});

test("17 — Valid no-change/preserve response works", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const preserved = respond(interpreted({
    managementNeed: "CONTINUATION",
    responseKind: "preserve",
    managementReason: "factual-clarification",
  }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(preserved.state, "preserved");
  assert.equal(preserved.targetFamily, "NEXO_BARS");
});

test("18 — Conversation does not automatically imply scene change", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const preserved = respond(interpreted({ responseKind: "preserve", managementReason: "advisor-text-without-perspective-change" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(preserved.scene, bars.scene);
  assert.equal(preserved.transition, null);
});

test("19 — Scene response has management reason", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION", managementReason: "investigation" }));
  assert.equal(result.managementReason, "investigation");
});

test("20 — Explicit subject switch outranks visual continuity", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const switched = respond(interpreted({
    referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named" }),
    managementNeed: "CAUSE_INVESTIGATION",
  }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(switched.canonicalSubjectId, "obj-margin-pressure");
  assert.notEqual(switched.canonicalSubjectId, "obj-product-line-a");
});

test("21 — Deictic grounding is reused, not re-resolved", () => {
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: referent({ subjectSource: "conversation-deictic" }),
    utteranceKind: "deictic-investigation",
  });
  const result = respond(interpreted({
    referent: referent({ subjectSource: "conversation-deictic" }),
    managementNeed: "CAUSE_INVESTIGATION",
    rawUtterance: "Why is this high?",
  }), { awareness });
  assert.equal(result.deicticReResolved, false);
  assert.equal(result.canonicalSubjectId, "obj-product-line-a");
});

test("22 — Ambiguous grounding does not produce guessed scene", () => {
  const result = respond(interpreted({
    referent: referent({ canonicalSubjectId: null, subjectSource: "none" }),
    managementNeed: "CAUSE_INVESTIGATION",
    ambiguity: "ambiguous-object",
  }));
  assert.equal(result.state, "unresolved");
  assert.equal(result.scene, null);
});

test("23 — Stale Theatre context does not override newer subject", () => {
  const flow = respond(interpreted({ managementNeed: "OPERATIONAL_FLOW" }));
  const result = respond(interpreted({
    referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named", generation: 9 }),
    managementNeed: "CAUSE_INVESTIGATION",
  }), {
    sourceScene: flow.scene,
    sourceSpatial: flow.spatial,
    sourceFamily: flow.targetFamily,
    theatreGeneration: 1,
  });
  assert.equal(result.canonicalSubjectId, "obj-margin-pressure");
});

test("24 — Stale collection does not override selected member", () => {
  const result = respond(interpreted({
    referent: referent({
      canonicalSubjectId: "obj-project-beta",
      collectionMemberId: "obj-project-beta",
      subjectSource: "conversation-named",
    }),
    managementNeed: "PORTFOLIO_COMPARISON",
  }));
  assert.equal(result.canonicalSubjectId, "obj-project-beta");
});

test("25 — Existing Scene is context, not next-intent authority", () => {
  const flow = respond(interpreted({ managementNeed: "OPERATIONAL_FLOW" }));
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: flow.scene,
    sourceSpatial: flow.spatial,
    sourceFamily: flow.targetFamily,
  });
  assert.equal(flow.targetFamily, "NEXO_FLOW");
  assert.equal(cause.targetFamily, "NEXO_CAUSE");
});

test("26 — Full certified pipeline is reused", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.deepEqual([...result.pipeline], [...DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE]);
  assert.equal(result.reusedCertifiedPipeline, true);
  assert.ok(result.selection && result.composition && result.scene && result.spatial && result.evidence);
});

test("27 — No Advisor→Scene shortcut exists", () => {
  assert.equal(respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" })).advisorToSceneShortcut, false);
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisorToSceneShortcut, false);
});

test("28 — Evidence inspection can preserve scene where appropriate", () => {
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  const supports = respond(interpreted({
    responseKind: "evidence-inspection",
    managementNeed: "CONTINUATION",
    managementReason: "evidence-inspection",
  }), {
    sourceScene: cause.scene,
    sourceSpatial: cause.spatial,
    sourceFamily: cause.targetFamily,
  });
  assert.equal(supports.state, "preserved");
  assert.equal(supports.targetFamily, "NEXO_CAUSE");
  assert.ok(supports.evidence?.participants.some((item) => item.evidenceRef.startsWith("cc8:")));
});

test("29 — Cause response preserves causal safety", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.upgradesCausality, false);
  assert.equal(result.scene?.relationships.find((item) => item.relationshipId === "rel-cost-line")?.semanticRelation, "associated");
});

test("30 — Impact response preserves VAI authority", () => {
  const result = respond(interpreted({ managementNeed: "VARIABLE_LEVER" }));
  assert.equal(result.targetFamily, "NEXO_IMPACT");
  assert.equal(result.assignsVaiRoles, false);
  assert.equal(result.scene?.actors.find((item) => item.canonicalObjectId === "obj-staffing")?.vaiRoleRef, "LEVER");
});

test("31 — Risk response preserves Risk authority", () => {
  const result = respond(interpreted({ managementNeed: "RISK_FOCUS" }));
  assert.equal(result.targetFamily, "NEXO_RISK");
  assert.equal(result.calculatesRisk, false);
});

test("32 — Execution response preserves CC:11 authority", () => {
  const result = respond(interpreted({ managementNeed: "EXECUTION_STATUS" }));
  assert.equal(result.targetFamily, "NEXO_EXECUTION");
  assert.equal(result.writesExecution, false);
  assert.equal(result.scene?.actors.find((item) => item.canonicalObjectId === "obj-execution-1")?.objectAuthority, "CC:11");
});

test("33 — Outcome response preserves CORE-OUT authority", () => {
  const result = respond(interpreted({ managementNeed: "OUTCOME_ASSESSMENT" }));
  assert.equal(result.targetFamily, "NEXO_OUTCOME");
  assert.equal(result.writesOutcome, false);
  assert.equal(result.scene?.actors.find((item) => item.canonicalObjectId === "obj-outcome-1")?.objectAuthority, "CORE-OUT");
});

test("34 — Persistent actors preserve canonical identity through transition", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const cause = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  const persistent = cause.transition?.actors.find((item) => item.canonicalObjectId === "obj-product-line-a");
  assert.equal(persistent?.classification, "persistent");
});

test("35 — Latest valid intent can supersede obsolete transition", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  const first = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  const next = respond(interpreted({ managementNeed: "RISK_FOCUS" }), {
    sourceScene: first.scene,
    sourceSpatial: first.spatial,
    sourceFamily: first.targetFamily,
    previousTransition: first.transition,
  });
  assert.equal(next.transition?.replacement.policy, "latest-valid-target-supersedes-incomplete-plan");
  assert.equal(next.transition?.replacement.supersedesPlanId, first.transition?.planId);
});

test("36 — Reduced-motion preserves scene-response meaning", () => {
  const motion = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), { reducedMotion: false });
  const reduced = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), { reducedMotion: true });
  assert.equal(motion.canonicalSubjectId, reduced.canonicalSubjectId);
  assert.equal(motion.targetFamily, reduced.targetFamily);
  assert.equal(reduced.reducedMotionEquivalent, true);
  assert.deepEqual(motion.composition?.actors.map((item) => item.canonicalObjectId), reduced.composition?.actors.map((item) => item.canonicalObjectId));
});

test("37 — Initial scene can be produced without previous Theatre", () => {
  const result = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" }));
  assert.equal(result.sourceFamily, null);
  assert.equal(result.transition, null);
  assert.ok(result.scene);
});

test("38 — Missing 4B context fails safely", () => {
  const result = respond(interpreted({ managementNeed: "VARIABLE_LEVER" }), {
    graph: graph({
      objects: Object.freeze([hint("obj-product-line-a", { familyRelevance: "all" })]),
      relationships: Object.freeze([]),
      evidence: Object.freeze([]),
      bindings: Object.freeze([]),
    }),
  });
  assert.equal(result.state, "insufficient-context");
  assert.equal(result.scene, null);
});

test("39 — No canonical management writes occur", () => {
  const result = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }));
  assert.equal(result.writesCanonicalObjects, false);
  assert.equal(result.writesDecision, false);
  assert.equal(result.writesExecution, false);
  assert.equal(result.writesOutcome, false);
});

test("40 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("41 — Advisor remains CC:5", () => {
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisor, conversationalExperienceIdentity);
});

test("42 — Director remains DIR:1", () => {
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("43 — No live /executive wiring is introduced", () => {
  assert.equal(respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON" })).liveStageWiring, false);
});

test("44 — DTH-EXP:1–7A gates remain green", () => {
  assert.equal(verifyDthExpAdvisorSceneAwarenessBoundary().ok, true);
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

test("certification journey: Advisor → DIR:1 → Theatre", () => {
  const bars = respond(interpreted({ managementNeed: "MAGNITUDE_COMPARISON", managementReason: "comparison" }));
  assert.equal(bars.targetFamily, "NEXO_BARS");
  assert.equal(bars.transition, null);
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: referent({ subjectSource: "conversation-deictic" }),
    utteranceKind: "deictic-investigation",
  });
  const cause = respond(interpreted({
    referent: referent({ subjectSource: "conversation-deictic" }),
    managementNeed: "CAUSE_INVESTIGATION",
    managementReason: "investigation",
  }), {
    awareness,
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
  });
  assert.equal(cause.canonicalSubjectId, "obj-product-line-a");
  assert.equal(cause.targetFamily, "NEXO_CAUSE");
  assert.equal(cause.upgradesCausality, false);
  const supports = respond(interpreted({
    responseKind: "evidence-inspection",
    managementReason: "evidence-inspection",
  }), {
    sourceScene: cause.scene,
    sourceSpatial: cause.spatial,
    sourceFamily: cause.targetFamily,
  });
  assert.equal(supports.targetFamily, "NEXO_CAUSE");
  const impact = respond(interpreted({ managementNeed: "VARIABLE_LEVER", managementReason: "variable-lever-analysis" }), {
    sourceScene: cause.scene,
    sourceSpatial: cause.spatial,
    sourceFamily: cause.targetFamily,
  });
  assert.equal(impact.targetFamily, "NEXO_IMPACT");
  assert.equal(impact.assignsVaiRoles, false);
  const risk = respond(interpreted({ managementNeed: "RISK_FOCUS", managementReason: "risk-examination" }), {
    sourceScene: impact.scene,
    sourceSpatial: impact.spatial,
    sourceFamily: impact.targetFamily,
  });
  assert.equal(risk.targetFamily, "NEXO_RISK");
  assert.equal(risk.canonicalSubjectId, "obj-product-line-a");
  const margin = respond(interpreted({
    referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named" }),
    managementNeed: "CAUSE_INVESTIGATION",
  }));
  assert.equal(margin.canonicalSubjectId, "obj-margin-pressure");
  const investigate = respond(interpreted({
    referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }),
    managementNeed: "CAUSE_INVESTIGATION",
    managementReason: "investigation",
  }), {
    sourceScene: risk.scene,
    sourceSpatial: risk.spatial,
    sourceFamily: risk.targetFamily,
  });
  assert.equal(investigate.canonicalSubjectId, "obj-margin-pressure");
  assert.equal(investigate.targetFamily, "NEXO_CAUSE");
  const flow = respond(interpreted({ managementNeed: "OPERATIONAL_FLOW" }));
  const bottleneck = respond(interpreted({ managementNeed: "BOTTLENECK_LOCATION" }), {
    sourceScene: flow.scene,
    sourceSpatial: flow.spatial,
    sourceFamily: flow.targetFamily,
  });
  assert.equal(bottleneck.state, "same-family-refined");
  const ambiguous = respond(interpreted({
    referent: referent({ canonicalSubjectId: null, subjectSource: "none" }),
    ambiguity: "ambiguous-object",
    managementNeed: "CAUSE_INVESTIGATION",
  }));
  assert.equal(ambiguous.state, "unresolved");
  const reduced = respond(interpreted({ managementNeed: "CAUSE_INVESTIGATION" }), {
    sourceScene: bars.scene,
    sourceSpatial: bars.spatial,
    sourceFamily: bars.targetFamily,
    reducedMotion: true,
  });
  assert.equal(reduced.canonicalSubjectId, "obj-product-line-a");
  assert.equal(reduced.targetFamily, "NEXO_CAUSE");
  assert.equal(reduced.reducedMotionEquivalent, true);
});
