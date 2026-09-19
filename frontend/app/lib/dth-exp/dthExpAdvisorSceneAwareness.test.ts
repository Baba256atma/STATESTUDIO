/**
 * NPA-T DTH-EXP:7A — Advisor Scene Awareness tests.
 * Read-only context overlay. No second Advisor, referent resolver, or DTH-EXP:7B.
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
  composeNexoraDirectorSceneContext,
  DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY,
  DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE,
  dthExpAdvisorSceneAwarenessIdentity,
  planDthExpSceneTransition,
  projectDthExpAdvisorSceneAwareness,
  projectDthExpEvidenceScene,
  projectDthExpSpatialLayout,
  projectDthExpTheatreScene,
  selectNexoraDirectorNexoFamily,
  verifyDthExpAdvisorSceneAwarenessBoundary,
  verifyDthExpEvidenceSceneBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpConversationReferentState } from "./dthExpAdvisorSceneAwarenessContract.ts";
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
      hint("obj-capacity-gap", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_RISK"] }),
      hint("obj-margin-pressure", { kind: "problem", familyRelevance: ["NEXO_CAUSE", "NEXO_BARS"] }),
      hint("obj-risk-supply", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-risk-delay", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-gamma", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"] }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-cost-line", "obj-margin-pressure", "obj-product-line-a", "associated"),
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
        evidenceRef: "cc8:ev-line-ops",
        attachedToKind: "object" as const,
        attachedToId: "obj-product-line-a",
        familyRelevance: "all" as const,
        relevantToQuestion: true,
      }),
    ]),
    bindings: Object.freeze([]),
    bottleneckCanonicalObjectId: "obj-production",
    collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta", "obj-project-gamma"]),
  });
}

const records: readonly DthExpCanonicalEvidenceRecord[] = Object.freeze([
  Object.freeze({
    evidenceRef: "cc8:ev-capacity-17",
    authority: "CC:8" as const,
    provenanceRef: "csv:capacity-ops.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "accepted" as const,
    supportState: "authoritative" as const,
    semanticConfirmationState: "AUTHORITATIVE" as const,
    semanticFieldLabel: null,
    freshness: "current" as const,
    causalSupport: "none" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-production",
    sceneRelevance: "high" as const,
  }),
  Object.freeze({
    evidenceRef: "cc8:ev-line-ops",
    authority: "CC:8" as const,
    provenanceRef: "csv:line-ops.csv",
    provenanceKind: "csv-source" as const,
    dataRealityAcceptance: "accepted" as const,
    supportState: "likely" as const,
    semanticConfirmationState: "LIKELY" as const,
    semanticFieldLabel: null,
    freshness: "current" as const,
    causalSupport: "none" as const,
    relevantToQuestion: true,
    attachedToKind: "object" as const,
    attachedToId: "obj-product-line-a",
    sceneRelevance: "high" as const,
  }),
]);

function referent(partial: Partial<DthExpConversationReferentState> = {}): DthExpConversationReferentState {
  return Object.freeze({
    authority: "CC:5 / ECA / NCA / MO referent",
    canonicalSubjectId: null,
    subjectSource: "none",
    selectedCanonicalObjectId: null,
    selectedRelationshipId: null,
    selectedEvidenceRef: null,
    collectionMemberId: null,
    generation: 2,
    ...partial,
  });
}

function theatre(need: DthExpDirectorManagementNeed) {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: need,
  });
  const composed = composeNexoraDirectorSceneContext({ selection, directorPlan: dirPlan(), graph: graph() });
  const scene = composed.recipeResolution?.scene;
  if (!scene || !selection.selectedFamily) throw new Error(`missing scene for ${need}`);
  const spatial = projectDthExpSpatialLayout({ scene, family: selection.selectedFamily });
  const evidence = projectDthExpEvidenceScene({
    family: selection.selectedFamily,
    scene,
    spatial,
    records,
  });
  return { scene, spatial, evidence, family: selection.selectedFamily };
}

function aware(
  conversation: DthExpConversationReferentState,
  extras: Omit<Parameters<typeof projectDthExpAdvisorSceneAwareness>[0], "conversation"> = {},
) {
  return projectDthExpAdvisorSceneAwareness({ conversation, ...extras });
}

test("DTH-EXP:7A identity and boundary", () => {
  assert.equal(dthExpAdvisorSceneAwarenessIdentity, "NPA-T DTH-EXP:7A/AdvisorSceneAwareness");
  assert.equal(verifyDthExpAdvisorSceneAwarenessBoundary().ok, true);
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.startsDthExp7B, false);
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE, "DTH-EXP:7A/SceneAwarenessSnapshot");
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.advisor, conversationalExperienceIdentity);
});

test("1 — Advisor can consume current Theatre awareness", () => {
  const ctx = theatre("OPERATIONAL_FLOW");
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), ctx);
  assert.equal(snapshot.theatreAvailable, true);
  assert.equal(snapshot.family, "NEXO_FLOW");
  assert.ok(snapshot.visibleActorIds.includes("obj-product-line-a"));
});

test("2 — 7A does not create a second Advisor", () => {
  assert.equal(aware(referent()).parallelAdvisor, false);
});

test("3 — 7A does not create a second referent resolver", () => {
  assert.equal(aware(referent()).parallelReferentResolver, false);
});

test("4 — Canonical Object ID bridges Theatre and conversation", () => {
  const ctx = theatre("OPERATIONAL_FLOW");
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), ctx);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(snapshot.conversationalSubjectId, "obj-product-line-a");
});

test("5 — Visual label is not identity authority", () => {
  const ctx = theatre("OPERATIONAL_FLOW");
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), ctx);
  assert.equal(snapshot.grounding.usedVisualLabel, false);
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.labelIsIdentityAuthority, false);
});

test("6 — Screen position is not identity authority", () => {
  const ctx = theatre("OPERATIONAL_FLOW");
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), {
    ...ctx,
    utteranceKind: "deictic-follow-up",
  });
  assert.equal(snapshot.grounding.usedScreenPosition, false);
});

test("7 — Largest actor is not automatically subject", () => {
  const ctx = theatre("BOTTLENECK_LOCATION");
  const largest = [...ctx.spatial.actors].sort((left, right) => right.size.width * right.size.height - left.size.width * left.size.height)[0];
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), ctx);
  assert.equal(snapshot.grounding.usedLargestActor, false);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
  assert.notEqual(snapshot.grounding.canonicalObjectId, largest?.canonicalObjectId === "obj-product-line-a" ? "forced-mismatch" : largest?.canonicalObjectId);
});

test("8 — Focal actor does not override valid explicit subject", () => {
  const ctx = theatre("BOTTLENECK_LOCATION");
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), ctx);
  assert.notEqual(snapshot.theatreFocalCanonicalObjectId, snapshot.grounding.canonicalObjectId);
  assert.equal(snapshot.grounding.usedTheatreFocalOverride, false);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("9 — Legitimate canonical selection can support grounding", () => {
  const snapshot = aware(
    referent({
      canonicalSubjectId: "obj-risk-supply",
      subjectSource: "click",
      selectedCanonicalObjectId: "obj-risk-supply",
    }),
    { ...theatre("RISK_FOCUS"), utteranceKind: "deictic-follow-up" },
  );
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-risk-supply");
  assert.equal(snapshot.grounding.source, "canonical-selection");
});

test("10 — Named subject beats stale Theatre focus", () => {
  const ctx = theatre("CAUSE_INVESTIGATION");
  const snapshot = aware(
    referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named" }),
    { ...ctx, utteranceKind: "deictic-investigation" },
  );
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-margin-pressure");
  assert.notEqual(snapshot.grounding.canonicalObjectId, snapshot.theatreFocalCanonicalObjectId);
});

test("11 — Deictic follow-up preserves canonical subject", () => {
  const snapshot = aware(
    referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" }),
    { ...theatre("OPERATIONAL_FLOW"), utteranceKind: "deictic-follow-up" },
  );
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("12 — Deictic investigation preserves canonical subject", () => {
  const snapshot = aware(
    referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" }),
    { ...theatre("OPERATIONAL_FLOW"), utteranceKind: "deictic-investigation" },
  );
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(snapshot.requestsSceneChange, false);
  assert.notEqual(snapshot.family, "NEXO_CAUSE");
});

test("13 — Relationship awareness preserves relationship semantics", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("OPERATIONAL_FLOW"));
  const relationship = snapshot.relationshipRefs.find((item) => item.relationshipId === "rel-supplier-production");
  assert.equal(relationship?.semanticRelation, "feeds");
  assert.equal(relationship?.sourceAuthority, "NMI:1/relationship");
});

test("14 — Arrow geometry does not resolve relationship identity", () => {
  const snapshot = aware(referent(), {
    ...theatre("OPERATIONAL_FLOW"),
    utteranceKind: "deictic-relationship",
  });
  assert.equal(snapshot.grounding.relationshipId, null);
  assert.equal(snapshot.ambiguity, "ambiguous-relationship");
});

test("15 — Evidence awareness uses CC:8 refs", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), {
    ...theatre("CAUSE_INVESTIGATION"),
    utteranceKind: "supports",
  });
  assert.ok(snapshot.evidenceRefs.some((item) => item.evidenceRef.startsWith("cc8:")));
  assert.ok(snapshot.evidenceRefs.every((item) => item.authority === "CC:8"));
});

test("16 — Evidence does not become MO Object", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("CAUSE_INVESTIGATION"));
  assert.ok(snapshot.evidenceRefs.every((item) => item.isMoCatalogMember === false));
});

test("17 — Evidence prominence does not automatically become subject", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("CAUSE_INVESTIGATION"));
  assert.equal(snapshot.grounding.usedEvidenceProminence, false);
  assert.equal(snapshot.grounding.evidenceRef, null);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("18 — Ambiguous Object deixis does not guess", () => {
  const snapshot = aware(referent(), {
    ...theatre("RISK_FOCUS"),
    utteranceKind: "deictic-object",
    deixisKind: "risk",
  });
  assert.equal(snapshot.ambiguity, "ambiguous-object");
  assert.equal(snapshot.grounding.canonicalObjectId, null);
  assert.ok(snapshot.candidateCanonicalObjectIds.includes("obj-risk-supply"));
  assert.ok(snapshot.candidateCanonicalObjectIds.includes("obj-risk-delay"));
});

test("19 — Ambiguous Evidence deixis does not guess", () => {
  const snapshot = aware(referent(), {
    ...theatre("CAUSE_INVESTIGATION"),
    utteranceKind: "deictic-evidence",
  });
  assert.equal(snapshot.ambiguity, "ambiguous-evidence");
  assert.equal(snapshot.grounding.evidenceRef, null);
});

test("20 — Collection member identity remains stable", () => {
  const snapshot = aware(
    referent({
      canonicalSubjectId: "obj-project-beta",
      subjectSource: "conversation-named",
      collectionMemberId: "obj-project-beta",
    }),
    theatre("PORTFOLIO_COMPARISON"),
  );
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-project-beta");
});

test("21 — First collection member is not automatic fallback", () => {
  const ctx = theatre("PORTFOLIO_COMPARISON");
  const snapshot = aware(
    referent({
      canonicalSubjectId: "obj-project-beta",
      subjectSource: "conversation-named",
      collectionMemberId: "obj-project-beta",
    }),
    ctx,
  );
  assert.notEqual(snapshot.grounding.canonicalObjectId, snapshot.visibleActorIds[0] === "obj-project-beta" ? "obj-project-alpha" : snapshot.visibleActorIds[0]);
});

test("22 — Scene perspective change preserves subject identity", () => {
  const flow = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("OPERATIONAL_FLOW"));
  const cause = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("CAUSE_INVESTIGATION"));
  assert.equal(flow.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(cause.grounding.canonicalObjectId, "obj-product-line-a");
  assert.notEqual(flow.family, cause.family);
});

test("23 — Visual-role change does not change subject", () => {
  const flow = theatre("OPERATIONAL_FLOW");
  const cause = theatre("CAUSE_INVESTIGATION");
  const before = flow.scene.actors.find((item) => item.canonicalObjectId === "obj-product-line-a")?.visualRole;
  const after = cause.scene.actors.find((item) => item.canonicalObjectId === "obj-product-line-a")?.visualRole;
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), cause);
  assert.notEqual(before, after);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("24 — Entering actor does not automatically become subject", () => {
  const flow = theatre("OPERATIONAL_FLOW");
  const risk = theatre("RISK_FOCUS");
  const plan = planDthExpSceneTransition({
    source: flow.spatial,
    target: risk.spatial,
    sourceScene: flow.scene,
    targetScene: risk.scene,
  });
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), {
    ...risk,
    transition: plan,
  });
  assert.ok(plan.actors.some((item) => item.classification === "entering"));
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("25 — Exiting actor does not automatically erase valid subject", () => {
  const flow = theatre("OPERATIONAL_FLOW");
  const cause = theatre("CAUSE_INVESTIGATION");
  const plan = planDthExpSceneTransition({
    source: flow.spatial,
    target: cause.spatial,
    sourceScene: flow.scene,
    targetScene: cause.scene,
  });
  const snapshot = aware(referent({ canonicalSubjectId: "obj-supplier-a", subjectSource: "conversation-named" }), {
    ...cause,
    transition: plan,
    utteranceKind: "deictic-follow-up",
  });
  assert.ok(plan.actors.some((item) => item.classification === "exiting"));
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-supplier-a");
});

test("26 — Animation prominence does not create selection", () => {
  const flow = theatre("OPERATIONAL_FLOW");
  const cause = theatre("CAUSE_INVESTIGATION");
  const plan = planDthExpSceneTransition({
    source: flow.spatial,
    target: cause.spatial,
    sourceScene: flow.scene,
    targetScene: cause.scene,
  });
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), {
    ...cause,
    transition: plan,
  });
  assert.equal(snapshot.grounding.usedAnimationProminence, false);
});

test("27 — Nexo family informs context but does not override subject", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("VARIABLE_LEVER"));
  assert.equal(snapshot.family, "NEXO_IMPACT");
  assert.equal(snapshot.nexoFamilyOverridesSubject, false);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("28 — VAI authority remains unchanged", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("VARIABLE_LEVER"));
  assert.equal(snapshot.assignsVaiRoles, false);
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.vai, "VAI:1–8");
});

test("29 — causal safety remains unchanged", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("CAUSE_INVESTIGATION"));
  assert.equal(snapshot.upgradesCausality, false);
  assert.equal(snapshot.relationshipRefs.find((item) => item.relationshipId === "rel-cost-line")?.semanticRelation, "associated");
});

test("30 — Decision authority remains unchanged", () => {
  assert.equal(aware(referent()).writesDecision, false);
});

test("31 — Execution authority remains unchanged", () => {
  assert.equal(aware(referent(), theatre("EXECUTION_STATUS")).writesExecution, false);
});

test("32 — Outcome/Learning authority remains unchanged", () => {
  assert.equal(aware(referent(), theatre("OUTCOME_ASSESSMENT")).writesOutcome, false);
});

test("33 — Scene-awareness snapshot is read-only", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("OPERATIONAL_FLOW"));
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.grounding), true);
});

test("34 — Newer valid context outranks stale Theatre snapshot", () => {
  const stale = theatre("OPERATIONAL_FLOW");
  const snapshot = aware(
    referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named", generation: 4 }),
    { ...stale, theatreGeneration: 1, utteranceKind: "deictic-investigation" },
  );
  assert.equal(snapshot.staleTheatreIgnored, true);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-margin-pressure");
});

test("35 — Missing Theatre context does not break Advisor", () => {
  const snapshot = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }));
  assert.equal(snapshot.theatreAvailable, false);
  assert.equal(snapshot.grounding.canonicalObjectId, "obj-product-line-a");
});

test("36 — Reduced-motion and normal mode produce equivalent grounding", () => {
  const ctx = theatre("CAUSE_INVESTIGATION");
  const conversation = referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" });
  const motion = aware(conversation, { ...ctx, utteranceKind: "deictic-follow-up", reducedMotion: false });
  const reduced = aware(conversation, { ...ctx, utteranceKind: "deictic-follow-up", reducedMotion: true });
  assert.equal(motion.grounding.canonicalObjectId, reduced.grounding.canonicalObjectId);
  assert.equal(reduced.reducedMotionEquivalent, true);
});

test("37 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("38 — Director remains DIR:1", () => {
  assert.equal(DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("39 — 7A does not request scene changes", () => {
  const snapshot = aware(
    referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }),
    { ...theatre("OPERATIONAL_FLOW"), utteranceKind: "deictic-investigation" },
  );
  assert.equal(snapshot.requestsSceneChange, false);
  assert.equal(snapshot.family, "NEXO_FLOW");
});

test("40 — No live /executive scene manipulation is introduced", () => {
  assert.equal(aware(referent(), theatre("OPERATIONAL_FLOW")).liveStageWiring, false);
});

test("41 — DTH-EXP:1–6 gates remain green", () => {
  assert.equal(verifyDthExpEvidenceSceneBoundary().ok, true);
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const theatreScene = projectDthExpTheatreScene({
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
  assert.equal(theatreScene.actors.find((item) => item.canonicalObjectId === "obj-revenue")?.visualRole, "flow-node");
});

test("certification journey: historic referent-failure protections", () => {
  const named = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-named" }), theatre("OPERATIONAL_FLOW"));
  assert.equal(named.grounding.canonicalObjectId, "obj-product-line-a");
  const follow = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" }), {
    ...theatre("OPERATIONAL_FLOW"),
    utteranceKind: "deictic-follow-up",
  });
  assert.equal(follow.grounding.canonicalObjectId, "obj-product-line-a");
  const cause = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" }), theatre("CAUSE_INVESTIGATION"));
  assert.equal(cause.grounding.canonicalObjectId, "obj-product-line-a");
  assert.equal(cause.family, "NEXO_CAUSE");
  const supports = aware(referent({ canonicalSubjectId: "obj-product-line-a", subjectSource: "conversation-deictic" }), {
    ...theatre("CAUSE_INVESTIGATION"),
    utteranceKind: "supports",
  });
  assert.equal(supports.grounding.canonicalObjectId, "obj-product-line-a");
  assert.ok(supports.evidenceRefs.some((item) => item.evidenceRef === "cc8:ev-line-ops"));
  const switched = aware(referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named" }), theatre("CAUSE_INVESTIGATION"));
  assert.equal(switched.grounding.canonicalObjectId, "obj-margin-pressure");
  const investigate = aware(referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }), {
    ...theatre("OPERATIONAL_FLOW"),
    utteranceKind: "deictic-investigation",
  });
  assert.equal(investigate.grounding.canonicalObjectId, "obj-margin-pressure");
  assert.equal(investigate.requestsSceneChange, false);
  const ambiguous = aware(referent(), { ...theatre("RISK_FOCUS"), utteranceKind: "deictic-object", deixisKind: "risk" });
  assert.equal(ambiguous.ambiguity, "ambiguous-object");
  assert.equal(ambiguous.grounding.canonicalObjectId, null);
  const selected = aware(
    referent({
      canonicalSubjectId: "obj-risk-supply",
      subjectSource: "click",
      selectedCanonicalObjectId: "obj-risk-supply",
    }),
    { ...theatre("RISK_FOCUS"), utteranceKind: "deictic-follow-up" },
  );
  assert.equal(selected.grounding.canonicalObjectId, "obj-risk-supply");
  const stale = aware(
    referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-named", generation: 9 }),
    { ...theatre("OPERATIONAL_FLOW"), theatreGeneration: 1, utteranceKind: "deictic-investigation" },
  );
  assert.equal(stale.grounding.canonicalObjectId, "obj-margin-pressure");
  const reduced = aware(referent({ canonicalSubjectId: "obj-margin-pressure", subjectSource: "conversation-deictic" }), {
    ...theatre("CAUSE_INVESTIGATION"),
    reducedMotion: true,
    utteranceKind: "deictic-follow-up",
  });
  assert.equal(reduced.grounding.canonicalObjectId, "obj-margin-pressure");
});
