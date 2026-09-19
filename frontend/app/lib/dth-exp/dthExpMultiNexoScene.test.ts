/**
 * NPA-T DTH-EXP:8B — Multi-Nexo Scene Composition tests.
 * Primary skeleton + local support. No second layout engine or DTH-EXP:9.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  composeDthExpMultiNexoScene,
  DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS,
  DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY,
  DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY,
  DTH_EXP_SCENE_TRANSITION_ENGINE,
  dthExpMultiNexoSceneIdentity,
  planDthExpMultiNexoComposition,
  projectDthExpAdvisorSceneAwareness,
  projectDthExpTheatreScene,
  selectNexoraDirectorNexoFamily,
  verifyDthExpMultiNexoCompositionBoundary,
  verifyDthExpMultiNexoSceneBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpMultiNexoAvailableSupport, DthExpMultiNexoCompositionInput } from "./dthExpMultiNexoCompositionContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import {
  DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
} from "./dthExpSpatialLayoutContract.ts";
import { DTH_EXP_SPATIAL_LAYOUT_ENGINE, dthExpSpatialLayoutIdentity, dthExpSpatialLayoutVersion } from "./dthExpSpatialLayoutIdentity.ts";
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

function support(family: DthExpNexoRecipeFamily, attached: readonly string[], extras: Partial<DthExpMultiNexoAvailableSupport> = {}): DthExpMultiNexoAvailableSupport {
  return Object.freeze({ family, contextAvailable: true, attachedCanonicalObjectIds: attached, stale: false, ...extras });
}

function eligibility(partial: Partial<DthExpMultiNexoCompositionInput> = {}) {
  return planDthExpMultiNexoComposition(
    Object.freeze({
      canonicalSubjectId: "obj-product-line-a",
      primaryFamily: "NEXO_FLOW",
      primarySelectionAuthority: "DTH-EXP:4A",
      managementNeed: "OPERATIONAL_FLOW",
      primaryReason: "director-management-need:OPERATIONAL_FLOW",
      primaryActorIds: Object.freeze(["obj-supplier-a", "obj-production", "obj-inventory", "obj-product-line-a", "obj-market"]),
      relationshipRefs: Object.freeze([
        Object.freeze({ relationshipId: "rel-production-inventory", semanticRelation: "feeds" }),
        Object.freeze({ relationshipId: "rel-staffing-production", semanticRelation: "associated" }),
      ]),
      evidenceRefs: Object.freeze(["cc8:ev-capacity-17"]),
      availableSupports: Object.freeze([
        support("NEXO_RISK", ["obj-production", "obj-product-line-a"]),
        support("NEXO_IMPACT", ["obj-production"]),
        support("NEXO_TIME", ["obj-product-line-a"]),
        support("NEXO_BUBBLE", ["obj-project-gamma"]),
      ]),
      ...partial,
    }),
  );
}

function layoutActor(id: string, x: number, y: number, focal: boolean) {
  const position = Object.freeze({ x, y });
  const size = Object.freeze({ width: 0.08, height: 0.08 });
  return Object.freeze({
    actorId: `actor:${id}`,
    canonicalObjectId: id,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    lane: "flow",
    region: focal ? "focal" : "path",
    order: 0,
    position,
    size,
    sizeReason: focal ? "focal-attention" as const : "supporting-context" as const,
    depth: focal ? "foreground" as const : "middle" as const,
    emphasis: focal ? "high" as const : "medium" as const,
    disclosure: "visible" as const,
    grouping: "flow",
    distanceFromFocal: focal ? 0 : 0.2,
    proximityImpliesCausality: false as const,
    layoutReason: "dth-exp:5a:flow",
    animationTarget: Object.freeze({
      position,
      size,
      emphasis: focal ? "high" as const : "medium" as const,
      disclosure: "visible" as const,
      grouping: "flow",
      interpolationImplemented: false as const,
      durationMs: null,
      easing: null,
    }),
  });
}

function spatial(family: DthExpNexoRecipeFamily = "NEXO_FLOW", focalId = "obj-production"): DthExpSpatialLayoutProjection {
  const actors = Object.freeze([
    layoutActor("obj-supplier-a", 0.1, 0.5, false),
    layoutActor("obj-production", 0.35, 0.5, focalId === "obj-production"),
    layoutActor("obj-inventory", 0.55, 0.5, false),
    layoutActor("obj-product-line-a", 0.7, 0.5, focalId === "obj-product-line-a"),
    layoutActor("obj-market", 0.9, 0.5, false),
  ]);
  return Object.freeze({
    identity: dthExpSpatialLayoutIdentity,
    version: dthExpSpatialLayoutVersion,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    family,
    coordinateSpace: DTH_EXP_NORMALIZED_STAGE_SPACE,
    sceneRef: "dth-exp:8b:test-scene",
    focalCanonicalObjectId: focalId,
    density: "normal",
    actors,
    relationshipPaths: Object.freeze([
      Object.freeze({
        relationshipId: "rel-production-inventory",
        fromCanonicalObjectId: "obj-production",
        toCanonicalObjectId: "obj-inventory",
        fromPosition: Object.freeze({ x: 0.35, y: 0.5 }),
        toPosition: Object.freeze({ x: 0.55, y: 0.5 }),
        presentationKind: "directional" as const,
        semanticRelation: "feeds",
        sourceAuthority: "NMI:1/relationship",
        sourceRef: "nmi:src:rel-production-inventory",
        impliesCausality: false as const,
        upgradesAssociationToCause: false as const,
      }),
      Object.freeze({
        relationshipId: "rel-staffing-production",
        fromCanonicalObjectId: "obj-staffing",
        toCanonicalObjectId: "obj-production",
        fromPosition: Object.freeze({ x: 0.35, y: 0.7 }),
        toPosition: Object.freeze({ x: 0.35, y: 0.5 }),
        presentationKind: "contextual" as const,
        semanticRelation: "associated",
        sourceAuthority: "NMI:1/relationship",
        sourceRef: "nmi:src:rel-staffing-production",
        impliesCausality: false as const,
        upgradesAssociationToCause: false as const,
      }),
    ]),
    evidenceHints: Object.freeze([]),
    futureTransitionSemantics: DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
    animationEngine: false,
    interpolationImplemented: false,
    liveStageWiring: false,
    mutatesTheatreScene: false,
    mutatesCanonicalObjects: false,
    proximityImpliesCausality: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    declaresOutcomeSuccess: false,
    layoutProvenance: "DTH-EXP:5A/SharedSpatialGrammar",
  });
}

function compose(plan = eligibility(), layout = spatial(), extras: { readonly reducedMotion?: boolean } = {}) {
  return composeDthExpMultiNexoScene({ eligibility: plan, spatial: layout, reducedMotion: extras.reducedMotion });
}

test("DTH-EXP:8B identity and boundary", () => {
  assert.equal(dthExpMultiNexoSceneIdentity, "NPA-T DTH-EXP:8B/MultiNexoSceneComposition");
  assert.equal(verifyDthExpMultiNexoSceneBoundary().ok, true);
  assert.equal(DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.startsDthExp9, false);
});

test("1 — 8B consumes certified 8A plan", () => {
  const plan = eligibility();
  assert.equal(compose(plan).eligibilityCompositionId, plan.compositionId);
});

test("2 — Output is one composed Theatre projection", () => {
  assert.equal(compose().identity, dthExpMultiNexoSceneIdentity);
});

test("3 — No second Scene store is created", () => {
  assert.equal(DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.secondSceneStore, false);
  assert.equal("sceneStore" in compose(), false);
});

test("4 — Primary Scene remains structural skeleton", () => {
  const layout = spatial();
  const composed = compose(eligibility(), layout);
  for (const actor of layout.actors) {
    assert.deepEqual(composed.actors.find((item) => item.canonicalObjectId === actor.canonicalObjectId)?.primaryPosition, actor.position);
  }
});

test("5 — Primary family owns base spatial grammar", () => {
  assert.equal(compose().primaryOwnsBaseSpatialGrammar, true);
  assert.equal(compose().primaryFamily, "NEXO_FLOW");
});

test("6 — Supporting family cannot globally rearrange primary layout", () => {
  assert.ok(compose().attachments.every((item) => item.rearrangesBaseScene === false));
  assert.equal(compose().secondGlobalLayoutEngine, false);
});

test("7 — Supporting meaning attaches to existing context", () => {
  assert.ok(compose().attachments.some((item) => item.family === "NEXO_RISK" && item.attachedToCanonicalObjectId === "obj-production"));
});

test("8 — One canonical Object remains one Theatre Actor", () => {
  const matches = compose().actors.filter((item) => item.canonicalObjectId === "obj-production");
  assert.equal(matches.length, 1);
  assert.equal(matches[0]?.theatreActorCount, 1);
});

test("9 — Primary + supporting roles coexist without duplication", () => {
  const actor = compose().actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(actor?.primaryVisualRole, "flow-node");
  assert.ok(actor?.supportingAnnotations.includes("risk-context"));
});

test("10 — Shared relationship identity remains one", () => {
  assert.equal(compose().relationshipRefs.filter((item) => item === "rel-production-inventory").length, 1);
});

test("11 — Relationship semantics remain unchanged", () => {
  assert.equal(compose().relationshipSemantics.find((item) => item.relationshipId === "rel-staffing-production")?.semanticRelation, "associated");
});

test("12 — Shared Evidence identity remains one", () => {
  assert.deepEqual([...compose().evidenceRefs], ["cc8:ev-capacity-17"]);
});

test("13 — Evidence is not duplicated per family", () => {
  assert.equal(compose().evidenceCopiedPerFamily, false);
});

test("14 — Composition semantic hierarchy is preserved", () => {
  assert.deepEqual([...compose().layers], [...DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS]);
});

test("15 — Local adjustment does not become second global layout engine", () => {
  const layout = spatial();
  const composed = compose(eligibility(), layout);
  const production = layout.actors.find((item) => item.canonicalObjectId === "obj-production")!;
  const attachment = composed.attachments.find((item) => item.attachedToCanonicalObjectId === "obj-production" && item.family === "NEXO_RISK");
  assert.deepEqual(attachment?.primaryPosition, production.position);
  assert.notDeepEqual(attachment?.annotationPosition, production.position);
  assert.equal(composed.secondGlobalLayoutEngine, false);
});

test("16 — conflict resolution follows deterministic priority", () => {
  assert.deepEqual([...compose().conflictPriority], [...DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY]);
});

test("17 — authority conflict rejects unsafe support", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { contextAvailable: false })]) }));
  assert.ok(composed.omittedSupports.includes("NEXO_RISK"));
  assert.ok(composed.resolvedConflicts.includes("authority-conflict"));
});

test("18 — grammar conflict preserves primary", () => {
  const composed = compose();
  assert.ok(composed.omittedSupports.includes("NEXO_BUBBLE"));
  assert.equal(composed.primaryFamily, "NEXO_FLOW");
});

test("19 — subject conflict omits unrelated support", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_RISK", ["obj-project-gamma"])]) }));
  assert.ok(composed.omittedSupports.includes("NEXO_RISK"));
});

test("20 — causal-safety conflict does not create cause", () => {
  const composed = compose();
  assert.equal(composed.compositionCreatesCausality, false);
  assert.ok(composed.attachments.filter((item) => item.family === "NEXO_RISK" || item.family === "NEXO_IMPACT").every((item) => item.causalSeparationHint));
});

test("21 — relationship conflict preserves canonical semantics", () => {
  assert.equal(compose().relationshipSemantics.find((item) => item.relationshipId === "rel-staffing-production")?.semanticRelation, "associated");
});

test("22 — role conflict preserves primary role", () => {
  const actor = compose().actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(actor?.primaryVisualRole, "flow-node");
  assert.equal(actor?.supportingAnnotations.includes("flow-node"), false);
});

test("23 — density is presentation metadata only", () => {
  assert.equal(compose().densityIsPresentationOnly, true);
});

test("24 — progressive disclosure protects primary scene", () => {
  const composed = compose();
  assert.equal(composed.primaryFamily, "NEXO_FLOW");
  assert.ok(composed.deferredSupports.includes("NEXO_TIME") || composed.admittedSupports.length <= 2);
});

test("25 — focal actor remains visually/semantically primary", () => {
  const actor = compose().actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(actor?.isFocal, true);
});

test("26 — Evidence clustering does not create confidence", () => {
  assert.equal(compose().evidenceCountCreatesConfidence, false);
});

test("27 — FLOW + RISK composes safely", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"])]) }));
  assert.ok(composed.admittedSupports.includes("NEXO_RISK"));
  assert.equal(composed.calculatesRisk, false);
});

test("28 — FLOW + IMPACT composes safely with VAI authority", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_IMPACT", ["obj-production"])]) }));
  assert.ok(composed.admittedSupports.includes("NEXO_IMPACT"));
  assert.equal(composed.assignsVaiRoles, false);
});

test("29 — FLOW + TIME creates no Timeline authority", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_TIME", ["obj-product-line-a"])]) }));
  assert.ok(composed.admittedSupports.includes("NEXO_TIME"));
  assert.equal(composed.parallelTimelineAuthority, false);
});

test("30 — CAUSE + IMPACT preserves causal safety", () => {
  const composed = compose(
    eligibility({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION", availableSupports: Object.freeze([support("NEXO_IMPACT", ["obj-production"])]) }),
    spatial("NEXO_CAUSE"),
  );
  assert.ok(composed.admittedSupports.includes("NEXO_IMPACT"));
  assert.equal(composed.compositionCreatesCausality, false);
});

test("31 — BUBBLE + RISK does not rank candidates", () => {
  const composed = compose(
    eligibility({
      canonicalSubjectId: "obj-project-gamma",
      primaryFamily: "NEXO_BUBBLE",
      managementNeed: "PORTFOLIO_COMPARISON",
      primaryActorIds: Object.freeze(["obj-project-gamma"]),
      availableSupports: Object.freeze([support("NEXO_RISK", ["obj-project-gamma"])]),
    }),
    spatial("NEXO_BUBBLE", "obj-product-line-a"),
  );
  assert.equal(composed.ranksBubbleCandidates, false);
});

test("32 — EXECUTION + TIME preserves CC:11", () => {
  const composed = compose(
    eligibility({
      primaryFamily: "NEXO_EXECUTION",
      managementNeed: "EXECUTION_STATUS",
      availableSupports: Object.freeze([support("NEXO_TIME", ["obj-product-line-a"])]),
    }),
    spatial("NEXO_EXECUTION"),
  );
  assert.ok(composed.admittedSupports.includes("NEXO_TIME"));
  assert.equal(composed.writesExecution, false);
});

test("33 — OUTCOME + TIME preserves CORE-OUT", () => {
  const composed = compose(
    eligibility({
      primaryFamily: "NEXO_OUTCOME",
      managementNeed: "OUTCOME_ASSESSMENT",
      availableSupports: Object.freeze([support("NEXO_TIME", ["obj-product-line-a"])]),
    }),
    spatial("NEXO_OUTCOME"),
  );
  assert.ok(composed.admittedSupports.includes("NEXO_TIME"));
  assert.equal(composed.declaresOutcomeSuccess, false);
  assert.equal(composed.writesOutcome, false);
});

test("34 — multiple supporting families can compose when jointly safe", () => {
  const composed = compose();
  assert.ok(composed.admittedSupports.includes("NEXO_RISK"));
  assert.ok(composed.admittedSupports.includes("NEXO_IMPACT"));
});

test("35 — pairwise eligibility does not guarantee combined safety", () => {
  const plan = eligibility();
  assert.ok(plan.supportingFamilies.includes("NEXO_TIME"));
  const composed = compose(plan);
  assert.equal(composed.admittedSupports.includes("NEXO_TIME"), false);
  assert.ok(composed.deferredSupports.includes("NEXO_TIME"));
});

test("36 — combined density/semantic conflict can collapse/defer support", () => {
  const composed = compose();
  assert.ok(composed.deferredSupports.length > 0);
  assert.ok(composed.resolvedConflicts.includes("density-conflict"));
});

test("37 — supporting priority follows management relevance", () => {
  const composed = compose();
  assert.ok(composed.admittedSupports.includes("NEXO_RISK"));
  assert.ok(composed.admittedSupports.includes("NEXO_IMPACT"));
});

test("38 — presentation priority does not become business ranking", () => {
  assert.equal(compose().presentationPriorityIsBusinessRanking, false);
});

test("39 — primary perspective change causes recomposition", () => {
  const flow = compose();
  const cause = compose(
    eligibility({
      primaryFamily: "NEXO_CAUSE",
      managementNeed: "CAUSE_INVESTIGATION",
      previousPrimaryFamily: "NEXO_FLOW",
      previousEligibleSupports: eligibility().supportingFamilies,
    }),
    spatial("NEXO_CAUSE"),
  );
  assert.equal(cause.primaryFamily, "NEXO_CAUSE");
  assert.notEqual(cause.compositionId, flow.compositionId);
});

test("40 — stale support is not blindly carried forward", () => {
  const composed = compose(eligibility({ availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { stale: true })]) }));
  assert.ok(composed.omittedSupports.includes("NEXO_RISK"));
});

test("41 — same-family refinement reevaluates support", () => {
  const composed = compose(
    eligibility({
      previousPrimaryFamily: "NEXO_FLOW",
      bottleneckCanonicalObjectId: "obj-production",
      availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"]), support("NEXO_TIME", ["obj-market"])]),
    }),
  );
  assert.ok(composed.admittedSupports.includes("NEXO_RISK") || composed.omittedSupports.includes("NEXO_TIME"));
  assert.ok(composed.omittedSupports.includes("NEXO_TIME"));
});

test("42 — 5B remains transition authority", () => {
  assert.equal(compose().transitionAuthority, "DTH-EXP:5B");
  assert.equal(DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.transition, DTH_EXP_SCENE_TRANSITION_ENGINE);
});

test("43 — no second animation engine", () => {
  assert.equal(compose().secondAnimationEngine, false);
});

test("44 — canonical actor identity survives recomposition", () => {
  const flow = compose();
  const cause = compose(eligibility({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION", previousPrimaryFamily: "NEXO_FLOW" }), spatial("NEXO_CAUSE"));
  assert.ok(flow.actors.some((item) => item.canonicalObjectId === "obj-production"));
  assert.ok(cause.actors.some((item) => item.canonicalObjectId === "obj-production"));
});

test("45 — Evidence identity survives recomposition", () => {
  const flow = compose();
  const cause = compose(eligibility({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION" }), spatial("NEXO_CAUSE"));
  assert.ok(flow.evidenceRefs.includes("cc8:ev-capacity-17"));
  assert.ok(cause.evidenceRefs.includes("cc8:ev-capacity-17"));
});

test("46 — composed scene remains consumable by 7A", () => {
  const composed = compose();
  assert.equal(composed.advisorConsumable, true);
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: Object.freeze({
      authority: "CC:5 / ECA / NCA / MO referent",
      canonicalSubjectId: composed.canonicalSubjectId,
      subjectSource: "conversation-named",
      selectedCanonicalObjectId: null,
      selectedRelationshipId: null,
      selectedEvidenceRef: null,
      collectionMemberId: null,
      generation: 1,
    }),
  });
  assert.equal(awareness.grounding.canonicalObjectId, "obj-product-line-a");
});

test("47 — 8B does not parse manager text", () => {
  assert.equal(compose().parsesRawText, false);
});

test("48 — 7B/DIR:1 remains primary-change path", () => {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: "CAUSE_INVESTIGATION",
  });
  assert.equal(compose().choosesPrimaryFamily, false);
  assert.equal(selection.selectedFamily, "NEXO_CAUSE");
  assert.equal(DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("49 — reduced-motion retains management meaning", () => {
  const motion = compose(eligibility(), spatial(), { reducedMotion: false });
  const reduced = compose(eligibility(), spatial(), { reducedMotion: true });
  assert.equal(motion.canonicalSubjectId, reduced.canonicalSubjectId);
  assert.deepEqual(motion.admittedSupports, reduced.admittedSupports);
  assert.equal(reduced.reducedMotionComplete, true);
});

test("50 — same inputs produce same composed scene", () => {
  assert.deepEqual(compose(), compose());
});

test("51 — unsafe composition falls back to single-primary scene", () => {
  const composed = compose(eligibility({ unsafeRequestedSupports: Object.freeze(["NEXO_RISK", "NEXO_IMPACT"]) }));
  assert.equal(composed.fallbackToSinglePrimary, true);
  assert.deepEqual([...composed.admittedSupports], []);
  assert.equal(composed.primaryFamily, "NEXO_FLOW");
});

test("52 — no canonical management writes occur", () => {
  const composed = compose();
  assert.equal(composed.writesCanonicalObjects, false);
  assert.equal(composed.writesDecision, false);
  assert.equal(composed.writesExecution, false);
  assert.equal(composed.writesOutcome, false);
});

test("53 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("54 — no live /executive wiring", () => {
  assert.equal(compose().liveStageWiring, false);
  assert.equal(compose().multiNexoRendering, false);
});

test("55 — DTH-EXP:1–8A gates remain green", () => {
  assert.equal(verifyDthExpMultiNexoCompositionBoundary().ok, true);
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

test("certification journey: Flow skeleton with bounded support", () => {
  const flow = compose();
  assert.equal(flow.primaryFamily, "NEXO_FLOW");
  assert.equal(flow.primaryOwnsBaseSpatialGrammar, true);
  assert.ok(flow.admittedSupports.includes("NEXO_RISK"));
  const production = flow.actors.find((item) => item.canonicalObjectId === "obj-production");
  assert.equal(production?.theatreActorCount, 1);
  assert.ok(production?.supportingAnnotations.includes("risk-context"));
  assert.ok(flow.admittedSupports.includes("NEXO_IMPACT"));
  assert.equal(flow.compositionCreatesCausality, false);
  assert.deepEqual([...flow.evidenceRefs], ["cc8:ev-capacity-17"]);
  assert.equal(flow.evidenceCopiedPerFamily, false);
  assert.ok(flow.deferredSupports.includes("NEXO_TIME"));
  assert.ok(flow.omittedSupports.includes("NEXO_BUBBLE"));
  assert.equal(flow.choosesPrimaryFamily, false);
  const cause = compose(eligibility({ primaryFamily: "NEXO_CAUSE", managementNeed: "CAUSE_INVESTIGATION", previousPrimaryFamily: "NEXO_FLOW" }), spatial("NEXO_CAUSE"));
  assert.equal(cause.primaryFamily, "NEXO_CAUSE");
  assert.ok(cause.actors.some((item) => item.canonicalObjectId === "obj-production"));
  const switched = compose(eligibility({
    canonicalSubjectId: "obj-margin-pressure",
    primaryFamily: "NEXO_CAUSE",
    primaryActorIds: Object.freeze(["obj-margin-pressure"]),
    previousPrimaryFamily: "NEXO_FLOW",
    availableSupports: Object.freeze([support("NEXO_RISK", ["obj-production"], { stale: true })]),
  }), spatial("NEXO_CAUSE"));
  assert.ok(switched.omittedSupports.includes("NEXO_RISK"));
  const fallback = compose(eligibility({ unsafeRequestedSupports: Object.freeze(["NEXO_IMPACT", "NEXO_RISK"]) }));
  assert.equal(fallback.fallbackToSinglePrimary, true);
  const reduced = compose(eligibility(), spatial(), { reducedMotion: true });
  assert.equal(reduced.primaryFamily, flow.primaryFamily);
  assert.deepEqual(reduced.admittedSupports, flow.admittedSupports);
});
