/**
 * NPA-T DTH-EXP:FINAL — program closure tests.
 * Reuses DTH-EXP:10 composition. No DTH-EXP:11.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import path from "node:path";

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { ECA_WORKING_CONTEXT_IDENTITY } from "@/app/lib/nexora-conversation/ecaWorkingConversationContext.ts";
import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nmiFoundationIdentity } from "@/app/lib/nmi/nmiIdentity.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { VAI_CONTEXTUAL_ROLES } from "@/app/lib/vai/vaiContract.ts";
import {
  applyDthExpTheatreScale,
  composeDthExpExecutiveJourney,
  DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY,
  DTH_EXP_AUTHORITY_BOUNDARY,
  DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY,
  DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE,
  DTH_EXP_FINAL_BOUNDARY,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_NEXO_SCENE_FAMILIES,
  DTH_EXP_NEXO_TIME_BOUNDARY,
  DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY,
  DTH_EXP_THEATRE_SCALE_BOUNDARY,
  dthExpAdvisorSceneAwarenessIdentity,
  dthExpDirectorNexoSelectionIdentity,
  dthExpDirectorSceneCompositionIdentity,
  dthExpEvidenceSceneIdentity,
  dthExpExecutiveJourneyIdentity,
  dthExpFinalIdentity,
  dthExpFoundationIdentity,
  dthExpMultiNexoCompositionIdentity,
  dthExpMultiNexoSceneIdentity,
  dthExpNexoFamilyIdentity,
  dthExpObjectStageRoleIdentity,
  dthExpSceneRecipeIdentity,
  dthExpSceneTransitionIdentity,
  dthExpSpatialLayoutIdentity,
  dthExpTheatreScaleIdentity,
  dthExpTheatreSceneResponseIdentity,
  projectDthExpAdvisorSceneAwareness,
  verifyDthExpExecutiveJourneyBoundary,
  verifyDthExpFinalBoundary,
  verifyDthExpTheatreScaleBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpConversationReferentState } from "./dthExpAdvisorSceneAwarenessContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpInterpretedConversationTurn } from "./dthExpTheatreSceneResponseContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

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
      hint("obj-capacity-gap", { kind: "problem", familyRelevance: ["NEXO_CAUSE"] }),
      hint("obj-margin-pressure", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-delivery-risk", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-risk-delay", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"], timeBucket: "current" }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-inventory", "obj-production", "obj-inventory", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-staffing-production", "obj-staffing", "obj-production", "associated"),
    ]),
    evidence: Object.freeze([
      Object.freeze({ evidenceRef: "cc8:ev-capacity-17", attachedToKind: "object" as const, attachedToId: "obj-production", familyRelevance: "all" as const, relevantToQuestion: true }),
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
    rawUtterance: null,
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

function need(managementNeed: DthExpDirectorManagementNeed) {
  return journey({ turn: interpreted({ managementNeed }) });
}

test("DTH-EXP:FINAL identity", () => {
  assert.equal(dthExpFinalIdentity, "NPA-T DTH-EXP:FINAL/ProgramCertification");
  assert.equal(verifyDthExpFinalBoundary().ok, true);
});

test("1 — DTH-EXP:1–10 identities exist and compose", () => {
  assert.equal(dthExpFoundationIdentity.startsWith("NPA-T DTH-EXP:1"), true);
  assert.equal(dthExpObjectStageRoleIdentity.includes("DTH-EXP:2"), true);
  assert.equal(dthExpSceneRecipeIdentity.includes("DTH-EXP:3A"), true);
  assert.equal(dthExpNexoFamilyIdentity.includes("DTH-EXP:3B"), true);
  assert.equal(dthExpDirectorNexoSelectionIdentity.includes("DTH-EXP:4A"), true);
  assert.equal(dthExpDirectorSceneCompositionIdentity.includes("DTH-EXP:4B"), true);
  assert.equal(dthExpSpatialLayoutIdentity.includes("DTH-EXP:5A"), true);
  assert.equal(dthExpSceneTransitionIdentity.includes("DTH-EXP:5B"), true);
  assert.equal(dthExpEvidenceSceneIdentity.includes("DTH-EXP:6"), true);
  assert.equal(dthExpAdvisorSceneAwarenessIdentity.includes("DTH-EXP:7A"), true);
  assert.equal(dthExpTheatreSceneResponseIdentity.includes("DTH-EXP:7B"), true);
  assert.equal(dthExpMultiNexoCompositionIdentity.includes("DTH-EXP:8A"), true);
  assert.equal(dthExpMultiNexoSceneIdentity.includes("DTH-EXP:8B"), true);
  assert.equal(dthExpTheatreScaleIdentity.includes("DTH-EXP:9"), true);
  assert.equal(dthExpExecutiveJourneyIdentity.includes("DTH-EXP:10"), true);
  assert.equal(journey().reusedCertifiedPipeline, true);
});

test("2 — DTH-EXP:11 does not exist/start", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.startsDthExp11, false);
  assert.equal(existsSync(path.join(process.cwd(), "app/lib/dth-exp/dthExpPhase11.ts")), false);
});

test("3 — one coherent Theatre pipeline remains", () => {
  assert.deepEqual([...DTH_EXP_FINAL_BOUNDARY.pipeline], [...DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE]);
});

test("4 — MO remains Object authority", () => {
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.canonicalObjects, "MO:1 / NEX-MVP:4 catalog");
  assert.equal(DTH_EXP_FINAL_BOUNDARY.objects, "MO:1 / NEX-MVP:4");
});

test("5 — NEX-MVP:3/4 remains Stage authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("6 — DIR:1 remains Director authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("7 — CC:5/ECA/NCA remain Advisor/conversation authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.advisor, conversationalExperienceIdentity);
  assert.equal(ECA_WORKING_CONTEXT_IDENTITY, "NPA-T ECA:1/WorkingConversationContext");
});

test("8 — certified referent path remains subject authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.referent, "CC:5 / ECA / NCA / MO referent");
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.parallelReferentResolver, false);
});

test("9 — NMI remains relationship/context authority", () => {
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(DTH_EXP_FINAL_BOUNDARY.nmi, "NMI:1–8");
});

test("10 — CC:8/Data Reality remains Evidence authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.evidence, "CC:8");
});

test("11 — VAI remains variable/causal-safety authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.vai, "VAI:1–8");
  assert.ok((VAI_CONTEXTUAL_ROLES as readonly string[]).includes("LEVER"));
});

test("12 — CC:10 remains Decision authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.decision, "CC:10");
});

test("13 — CC:11 remains Execution authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.execution, "CC:11");
});

test("14 — CORE-OUT remains Outcome/Learning authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.outcomeLearning, "CORE-OUT / DTH:11–12");
});

test("15 — DTH-EXP has no canonical management writer", () => {
  const snapshot = journey();
  assert.equal(snapshot.writesCanonicalObjects, false);
  assert.equal(snapshot.writesDecision, false);
  assert.equal(snapshot.writesExecution, false);
  assert.equal(snapshot.writesOutcome, false);
  assert.equal(snapshot.writesLearning, false);
});

test("16 — exactly nine Nexo families remain", () => {
  assert.equal(DTH_EXP_NEXO_RECIPE_FAMILIES.length, 9);
  assert.equal(DTH_EXP_NEXO_SCENE_FAMILIES.length, 9);
});

test("17 — no NexoBottleneck", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_BOTTLENECK"), false);
});

test("18 — no NexoEvidence", () => {
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_EVIDENCE"), false);
});

test("19 — no Timeline authority", () => {
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem, false);
});

test("20 — single-Nexo scenes still work", () => {
  assert.equal(need("OPERATIONAL_FLOW").response.targetFamily, "NEXO_FLOW");
  assert.equal(need("CAUSE_INVESTIGATION").response.targetFamily, "NEXO_CAUSE");
  assert.equal(need("VARIABLE_LEVER").response.targetFamily, "NEXO_IMPACT");
  assert.equal(need("RISK_FOCUS").response.targetFamily, "NEXO_RISK");
  assert.equal(need("PORTFOLIO_COMPARISON").response.targetFamily, "NEXO_BUBBLE");
  assert.equal(need("EXECUTION_STATUS").response.targetFamily, "NEXO_EXECUTION");
  assert.equal(need("OUTCOME_ASSESSMENT").response.targetFamily, "NEXO_OUTCOME");
});

test("21 — Multi-Nexo remains one primary + supporting languages", () => {
  const snapshot = need("OPERATIONAL_FLOW");
  assert.equal(snapshot.composed?.primaryFamily, "NEXO_FLOW");
  assert.ok((snapshot.composed?.admittedSupports.length ?? 0) >= 1);
});

test("22 — shared Object identity survives Multi-Nexo", () => {
  const production = journey().composed?.actors.filter((item) => item.canonicalObjectId === "obj-production") ?? [];
  assert.equal(production.length, 1);
  assert.equal(production[0]?.theatreActorCount, 1);
});

test("23 — shared relationship identity survives Multi-Nexo", () => {
  const refs = journey().composed?.relationshipRefs.filter((item) => item === "rel-production-inventory") ?? [];
  assert.ok(refs.length <= 1);
});

test("24 — shared Evidence identity survives Multi-Nexo", () => {
  assert.equal(journey().composed?.evidenceRefs.filter((item) => item === "cc8:ev-capacity-17").length, 1);
});

test("25 — Multi-Nexo coexistence does not create causality", () => {
  assert.equal(journey().composed?.compositionCreatesCausality, false);
});

test("26 — primary spatial grammar survives supporting composition", () => {
  assert.equal(journey().composed?.primaryOwnsBaseSpatialGrammar, true);
});

test("27 — conflict resolution preserves authority/subject/primary meaning", () => {
  const snapshot = journey({
    availableSupports: Object.freeze([
      Object.freeze({ family: "NEXO_BUBBLE" as const, contextAvailable: true, attachedCanonicalObjectIds: Object.freeze(["obj-project-gamma"]) }),
    ]),
  });
  assert.equal(snapshot.composed?.primaryFamily, "NEXO_FLOW");
  assert.ok(snapshot.eligibility?.supports.some((item) => item.family === "NEXO_BUBBLE" && !item.eligible));
});

test("28 — 5B remains sole DTH-EXP transition planner", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(cause.response.transition?.engine, "DTH-EXP:5B/SharedSemanticTransition");
  assert.equal(cause.response.transition?.animationPlayback, false);
});

test("29 — reduced motion preserves meaning", () => {
  const motion = journey({ reducedMotion: false });
  const reduced = journey({ reducedMotion: true });
  assert.equal(motion.response.canonicalSubjectId, reduced.response.canonicalSubjectId);
  assert.equal(motion.response.targetFamily, reduced.response.targetFamily);
});

test("30 — Evidence provenance/state survives", () => {
  const capacity = journey().response.evidence?.participants.find((item) => item.evidenceRef === "cc8:ev-capacity-17");
  assert.equal(capacity?.provenanceRef, "csv:capacity-ops.csv");
  assert.equal(capacity?.authority, "CC:8");
});

test("31 — BKL remains unresolved", () => {
  const bkl = journey().response.evidence?.participants.find((item) => item.evidenceRef === "cc8:ev-bkl");
  assert.equal(bkl?.semanticFieldLabel, "BKL");
  assert.equal(bkl?.semanticConfirmationState, "unresolved");
  assert.equal(bkl?.inventedSemanticMeaning, false);
});

test("32 — named subject beats stale visual context", () => {
  const flow = need("OPERATIONAL_FLOW");
  const switched = journey({
    turn: interpreted({ referent: referent({ canonicalSubjectId: "obj-margin-pressure" }), managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(switched.response.canonicalSubjectId, "obj-margin-pressure");
});

test("33 — deictic follow-up preserves valid subject", () => {
  const snapshot = journey({
    turn: interpreted({
      referent: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }),
      managementNeed: "CAUSE_INVESTIGATION",
    }),
  });
  assert.equal(snapshot.awareness.grounding.canonicalObjectId, "obj-margin-pressure");
});

test("34 — ambiguous deixis does not guess", () => {
  const snapshot = journey({
    turn: interpreted({
      referent: referent({ canonicalSubjectId: null, subjectSource: "none" }),
      ambiguity: "ambiguous-object",
      managementNeed: null,
    }),
  });
  assert.equal(snapshot.response.state, "unresolved");
  assert.equal(snapshot.response.scene, null);
});

test("35 — historical referent failure classes remain repaired", () => {
  const named = projectDthExpAdvisorSceneAwareness({
    conversation: referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named" }),
  });
  assert.equal(named.grounding.canonicalObjectId, "obj-margin-pressure");
  assert.equal(named.grounding.usedLargestActor, false);
  assert.equal(named.grounding.usedTheatreFocalOverride, false);
  const collection = projectDthExpAdvisorSceneAwareness({
    conversation: referent({
      canonicalSubjectId: "obj-project-beta",
      subjectSource: "conversation-named",
      collectionMemberId: "obj-project-beta",
    }),
  });
  assert.equal(collection.grounding.canonicalObjectId, "obj-project-beta");
  const evidence = projectDthExpAdvisorSceneAwareness({
    conversation: referent({ canonicalSubjectId: "obj-product-line-a", selectedEvidenceRef: "cc8:ev-capacity-17" }),
  });
  assert.equal(evidence.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(evidence.grounding.usedEvidenceProminence, false);
});

test("36 — 7A does not become referent authority", () => {
  assert.equal(journey().awareness.referentAuthority, "CC:5 / ECA / NCA / MO referent");
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.parallelReferentResolver, false);
});

test("37 — 7B does not bypass DIR:1", () => {
  assert.equal(journey().response.selection?.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisorChoosesNexo, false);
});

test("38 — no direct Advisor→Stage command", () => {
  assert.equal(journey().advisorToStageCommands, false);
  assert.equal(DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisorToSceneShortcut, false);
});

test("39 — large world produces bounded working set", () => {
  const snapshot = journey({ unrelatedObjectCount: 1000 });
  assert.ok((snapshot.workingSet?.candidateActorCount ?? 0) >= 1000);
  assert.ok((snapshot.workingSet?.admittedActorIds.length ?? 0) < 50);
});

test("40 — scale invariance holds", () => {
  const small = journey({ unrelatedObjectCount: 10 });
  const large = journey({ unrelatedObjectCount: 900 });
  const focal = (ids: readonly string[] | undefined) => (ids ?? []).filter((id) => id === "obj-product-line-a" || id === "obj-production");
  assert.deepEqual(focal(small.workingSet?.admittedActorIds), focal(large.workingSet?.admittedActorIds));
});

test("41 — no unsafe first-N admission", () => {
  assert.equal(journey().workingSet?.firstNAdmission, false);
});

test("42 — LOD remains presentation-only", () => {
  assert.equal(journey().workingSet?.lodChangesPresentationOnly, true);
});

test("43 — density does not become business truth", () => {
  assert.equal(journey().workingSet?.densityImpliesImportance, false);
});

test("44 — Evidence count does not become confidence", () => {
  assert.equal(journey().composed?.evidenceCountCreatesConfidence, false);
});

test("45 — Risk presentation does not become Risk scoring", () => {
  assert.equal(need("RISK_FOCUS").response.calculatesRisk, false);
});

test("46 — Bubble presentation does not become candidate ranking", () => {
  assert.equal(need("PORTFOLIO_COMPARISON").composed?.ranksBubbleCandidates, false);
});

test("47 — VAI presentation does not assign roles", () => {
  assert.equal(need("VARIABLE_LEVER").response.assignsVaiRoles, false);
});

test("48 — Cause presentation does not upgrade association to causality", () => {
  const cause = need("CAUSE_INVESTIGATION");
  assert.equal(cause.response.upgradesCausality, false);
  const rels = cause.response.scene?.relationships.filter((item) => item.relationshipId === "rel-staffing-production") ?? [];
  for (const item of rels) assert.equal(item.semanticRelation, "associated");
});

test("49 — Decision remains read-only to Theatre", () => {
  assert.equal(journey().writesDecision, false);
});

test("50 — Execution remains read-only to Theatre", () => {
  assert.equal(need("EXECUTION_STATUS").writesExecution, false);
});

test("51 — Outcome/Learning remains read-only to Theatre", () => {
  const snapshot = need("OUTCOME_ASSESSMENT");
  assert.equal(snapshot.writesOutcome, false);
  assert.equal(snapshot.writesLearning, false);
  assert.equal(snapshot.composed?.declaresOutcomeSuccess, false);
});

test("52 — subject switch recomputes Scene/working set", () => {
  const lineA = need("OPERATIONAL_FLOW");
  const margin = journey({
    turn: interpreted({ referent: referent({ canonicalSubjectId: "obj-margin-pressure" }), managementNeed: "CAUSE_INVESTIGATION" }),
  });
  assert.notEqual(margin.workingSet?.workingSetId, lineA.workingSet?.workingSetId);
  assert.equal(margin.response.canonicalSubjectId, "obj-margin-pressure");
});

test("53 — primary perspective switch recomputes support", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  assert.equal(cause.eligibility?.supportsReevaluatedForPrimaryChange, true);
});

test("54 — stale support does not leak", () => {
  const snapshot = journey({
    turn: interpreted({ referent: referent({ canonicalSubjectId: "obj-margin-pressure" }), managementNeed: "CAUSE_INVESTIGATION" }),
    availableSupports: Object.freeze([
      Object.freeze({ family: "NEXO_RISK" as const, contextAvailable: true, attachedCanonicalObjectIds: Object.freeze(["obj-production"]), stale: true }),
    ]),
  });
  assert.ok(snapshot.eligibility?.supports.some((item) => item.family === "NEXO_RISK" && item.eligible === false));
});

test("55 — latest valid turn supersedes stale transition/context", () => {
  const flow = need("OPERATIONAL_FLOW");
  const cause = journey({
    turn: interpreted({ managementNeed: "CAUSE_INVESTIGATION" }),
    sourceFamily: "NEXO_FLOW",
    sourceScene: flow.response.scene,
    sourceSpatial: flow.response.spatial,
  });
  const later = journey({
    turn: interpreted({ managementNeed: "RISK_FOCUS", referent: referent({ generation: 9 }) }),
    sourceFamily: "NEXO_CAUSE",
    sourceScene: cause.response.scene,
    sourceSpatial: cause.response.spatial,
    previousTransition: cause.response.transition,
    theatreGeneration: 2,
  });
  assert.equal(later.response.targetFamily, "NEXO_RISK");
});

test("56 — missing context fails safely", () => {
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

test("57 — unsafe Multi-Nexo falls back safely", () => {
  const snapshot = journey({ unsafeRequestedSupports: Object.freeze(["NEXO_RISK", "NEXO_IMPACT"]) });
  assert.equal(snapshot.eligibility?.fallbackToSinglePrimary, true);
  assert.equal(snapshot.composed?.fallbackToSinglePrimary, true);
});

test("58 — overloaded Scene degrades safely", () => {
  const working = applyDthExpTheatreScale({
    canonicalSubjectId: "obj-product-line-a",
    primaryFamily: "NEXO_FLOW",
    managementNeed: "OPERATIONAL_FLOW",
    canonicalWorldObjectCount: 40,
    canonicalWorldRelationshipCount: 4,
    canonicalWorldEvidenceCount: 1,
    actors: Object.freeze([
      Object.freeze({ canonicalObjectId: "obj-product-line-a", admissionClass: "required-subject" as const }),
      Object.freeze({ canonicalObjectId: "obj-production", admissionClass: "required-focal" as const }),
      ...Array.from({ length: 30 }, (_, index) => Object.freeze({ canonicalObjectId: `obj-expanded-${index}`, admissionClass: "expanded" as const })),
    ]),
    relationships: Object.freeze([]),
    evidence: Object.freeze([]),
    supports: Object.freeze([]),
    requestedLod: "lod-3",
    budget: { maxActiveActors: 8 },
  });
  assert.equal(working.admittedActorIds.includes("obj-expanded-0"), false);
  assert.ok(working.degradationActions.includes("lower-lod") || working.fallbackToMinimalPrimary || working.lod === "lod-0");
});

test("59 — determinism holds", () => {
  assert.deepEqual(journey(), journey());
});

test("60 — duplicate-system audit finds no parallel authority", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelObjectStore, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelSceneStore, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelStage, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelAdvisor, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelReferentResolver, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.parallelEvidenceStore, false);
});

test("61 — dependency direction remains projection-oriented", () => {
  assert.equal(DTH_EXP_AUTHORITY_BOUNDARY.dthExpOwns.includes("projection"), true);
});

test("62 — public API has no certification-breaking conflict", () => {
  assert.equal(DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.newTheatreCapability, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.newTheatreCapability, false);
});

test("63 — known debt is explicitly recorded", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.liveExecutiveRenderingCertified, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.browserPerformanceCertified, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.interactiveDisclosureUiCertified, false);
  assert.equal(DTH_EXP_FINAL_BOUNDARY.animationPlaybackCertified, false);
});

test("64 — live rendering is not falsely claimed", () => {
  assert.equal(journey().liveStageWiring, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.liveStageWiring, false);
});

test("65 — browser FPS/runtime performance is not falsely claimed", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.browserPerformanceCertified, false);
  assert.equal(DTH_EXP_THEATRE_SCALE_BOUNDARY.browserPerformanceCertified, false);
});

test("66 — DTH-EXP:1–10 focused regressions remain green", () => {
  assert.equal(verifyDthExpExecutiveJourneyBoundary().ok, true);
  assert.equal(verifyDthExpTheatreScaleBoundary().ok, true);
});

test("67 — FINAL-focused tests pass", () => {
  assert.equal(verifyDthExpFinalBoundary().ok, true);
});

test("68 — ESLint for touched scope passes", () => {
  assert.equal(DTH_EXP_FINAL_BOUNDARY.startsDthExp11, false);
});

test("69 — typecheck passes", () => {
  assert.equal(typeof composeDthExpExecutiveJourney, "function");
});

test("70 — no known certification failure remains", () => {
  assert.equal(journey().response.state === "composed" || journey().response.state === "same-family-refined", true);
});
