/**
 * NPA-T DTH-EXP:5B — semantic scene-transition tests.
 * Plans only. No playback, live Stage, or DTH-EXP:6.
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
  DTH_EXP_SCENE_TRANSITION_BOUNDARY,
  DTH_EXP_SCENE_TRANSITION_ENGINE,
  DTH_EXP_TIMING_CATEGORIES,
  DTH_EXP_TRANSITION_SEQUENCE,
  dthExpSceneTransitionIdentity,
  dthExpSpatialLayoutIdentity,
  planDthExpSceneTransition,
  projectDthExpSpatialLayout,
  projectDthExpTheatreScene,
  selectNexoraDirectorNexoFamily,
  verifyDthExpSceneTransitionBoundary,
  verifyDthExpSpatialLayoutBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
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
      hint("obj-production", { familyRelevance: ["NEXO_FLOW"], bottleneck: true }),
      hint("obj-product-line-a", { familyRelevance: "all" }),
      hint("obj-market", { familyRelevance: ["NEXO_FLOW"] }),
      hint("obj-cost", { kind: "kpi", familyRelevance: ["NEXO_BARS", "NEXO_CAUSE"] }),
      hint("obj-staffing", { vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
      hint("obj-risk-gap", { kind: "risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
      hint("obj-execution-1", { kind: "execution", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"] }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-goal-1", { kind: "goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-cost-history", { kind: "kpi", familyRelevance: ["NEXO_TIME"], timeBucket: "historical" }),
    ]),
    relationships: Object.freeze([
      rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
      rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
      rel("rel-line-market", "obj-product-line-a", "obj-market", "serves"),
      rel("rel-cost-line", "obj-cost", "obj-product-line-a", "associated"),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceRef: "cc8:evidence:cost-rise",
        attachedToKind: "object" as const,
        attachedToId: "obj-cost",
        familyRelevance: ["NEXO_CAUSE"] as const,
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
    ]),
    bottleneckCanonicalObjectId: "obj-production",
  });
}

function project(need: DthExpDirectorManagementNeed, bottleneck: string | null = null) {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: need,
  });
  const composed = composeNexoraDirectorSceneContext({ selection, directorPlan: dirPlan(), graph: graph() });
  const scene = composed.recipeResolution?.scene;
  if (!scene || !selection.selectedFamily) throw new Error(`missing scene for ${need}`);
  const snapshot = JSON.stringify(scene);
  return {
    composed,
    scene,
    snapshot,
    family: selection.selectedFamily,
    projection: projectDthExpSpatialLayout({
      scene,
      family: selection.selectedFamily,
      bottleneckFocusCanonicalObjectId: bottleneck,
    }),
  };
}

function transition(
  fromNeed: DthExpDirectorManagementNeed,
  toNeed: DthExpDirectorManagementNeed,
  extras?: { readonly fromBottleneck?: string | null; readonly toBottleneck?: string | null; readonly superseded?: string | null },
) {
  const source = project(fromNeed, extras?.fromBottleneck ?? null);
  const target = project(toNeed, extras?.toBottleneck ?? null);
  const plan = planDthExpSceneTransition({
    source: source.projection,
    target: target.projection,
    sourceScene: source.scene,
    targetScene: target.scene,
    supersededPlanId: extras?.superseded ?? null,
  });
  return { source, target, plan };
}

function actor(plan: ReturnType<typeof transition>["plan"], id: string) {
  return plan.actors.find((item) => item.canonicalObjectId === id);
}

test("DTH-EXP:5B identity and boundary", () => {
  assert.equal(dthExpSceneTransitionIdentity, "NPA-T DTH-EXP:5B/MeaningfulAnimation");
  assert.equal(verifyDthExpSceneTransitionBoundary().ok, true);
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.startsDthExp6, false);
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.animationPlayback, false);
});

test("1 — Source + target spatial projections produce a transition plan", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.identity, dthExpSceneTransitionIdentity);
  assert.equal(plan.engine, DTH_EXP_SCENE_TRANSITION_ENGINE);
  assert.equal(plan.sourceFamily, "NEXO_FLOW");
  assert.equal(plan.targetFamily, "NEXO_CAUSE");
});

test("2 — Same canonical actor across scenes is classified persistent", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const line = actor(plan, "obj-product-line-a");
  assert.ok(line);
  assert.ok(["persistent", "context-promoted", "context-reduced"].includes(line!.classification));
  assert.equal(line?.operations.includes("exit"), false);
  assert.equal(line?.operations.includes("enter"), false);
});

test("3 — Persistent actor retains canonical ID", () => {
  const { plan, source, target } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(actor(plan, "obj-product-line-a")?.canonicalObjectId, "obj-product-line-a");
  assert.ok(source.scene.actors.some((item) => item.canonicalObjectId === "obj-product-line-a"));
  assert.ok(target.scene.actors.some((item) => item.canonicalObjectId === "obj-product-line-a"));
});

test("4 — Entering actor is not interpreted as newly created business Object", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const cost = actor(plan, "obj-cost");
  assert.equal(cost?.classification, "entering");
  assert.equal(cost?.createsBusinessObject, false);
  assert.ok(cost?.operations.includes("enter"));
});

test("5 — Exiting actor is not interpreted as deleted business Object", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const market = actor(plan, "obj-market");
  assert.equal(market?.classification, "exiting");
  assert.equal(market?.deletesBusinessObject, false);
});

test("6 — Context promotion is presentation-only", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.ok(plan.actors.every((item) => item.presentationOnly === true));
});

test("7 — Context reduction is presentation-only", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "BOTTLENECK_LOCATION", { toBottleneck: "obj-production" });
  const reduced = plan.actors.filter((item) => item.classification === "context-reduced");
  assert.ok(reduced.every((item) => item.presentationOnly === true));
});

test("8 — Reposition has an explicit semantic reason", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const moved = plan.actors.filter((item) => item.operations.includes("reposition"));
  assert.ok(moved.length > 0);
  assert.ok(moved.every((item) => item.reasons.length > 0));
});

test("9 — Size transition has an explicit semantic reason", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const promoteOrReduce = plan.actors.filter((item) => item.operations.includes("promote") || item.operations.includes("de-emphasize"));
  assert.ok(promoteOrReduce.every((item) => item.reasons.length > 0));
});

test("10 — Role transform preserves canonical identity", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const line = actor(plan, "obj-product-line-a");
  assert.equal(line?.fromVisualRole, "flow-node");
  assert.equal(line?.toVisualRole, "cause-node");
  assert.ok(line?.operations.includes("role-transform"));
  assert.equal(line?.canonicalObjectId, "obj-product-line-a");
});

test("11 — Flow → Cause preserves shared actors", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.notEqual(actor(plan, "obj-product-line-a")?.classification, "entering");
  assert.notEqual(actor(plan, "obj-product-line-a")?.classification, "exiting");
});

test("12 — Cause → Impact preserves shared actors", () => {
  const { plan } = transition("CAUSE_INVESTIGATION", "VARIABLE_LEVER");
  assert.notEqual(actor(plan, "obj-product-line-a")?.classification, "exiting");
});

test("13 — Impact → Risk preserves shared actors", () => {
  const { plan } = transition("VARIABLE_LEVER", "RISK_FOCUS");
  assert.notEqual(actor(plan, "obj-product-line-a")?.classification, "exiting");
});

test("14 — Risk → Time preserves shared actors", () => {
  const { plan } = transition("RISK_FOCUS", "TEMPORAL_DEVELOPMENT");
  assert.notEqual(actor(plan, "obj-product-line-a")?.classification, "exiting");
});

test("15 — Same-family Flow → bottleneck focus works", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "OPERATIONAL_FLOW", { toBottleneck: "obj-production" });
  assert.equal(plan.sourceFamily, "NEXO_FLOW");
  assert.equal(plan.targetFamily, "NEXO_FLOW");
  assert.equal(plan.managementTransitionReason, "same-family-focus-change");
  assert.equal(actor(plan, "obj-market")?.classification, "context-reduced");
});

test("16 — Bottleneck remains NexoFlow", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "OPERATIONAL_FLOW", { toBottleneck: "obj-production" });
  assert.equal(plan.bottleneckFamily, false);
  assert.equal(plan.targetFamily, "NEXO_FLOW");
});

test("17 — Evidence reveal preserves CC:8 authority", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const evidence = plan.evidence.find((item) => item.evidenceRef === "cc8:evidence:cost-rise");
  assert.equal(evidence?.authority, "CC:8");
  assert.equal(evidence?.increasesCertainty, false);
  assert.equal(evidence?.copiesEvidence, false);
});

test("18 — Relationship semantics survive transition", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const associated = plan.relationships.find((item) => item.relationshipId === "rel-cost-line");
  assert.equal(associated?.semanticRelation, "associated");
  assert.equal(associated?.sourceAuthority, "NMI:1/relationship");
});

test("19 — associated does not become causal through animation", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.ok(plan.relationships.every((item) => item.impliesCausality === false));
  assert.ok(plan.relationships.every((item) => item.upgradesAssociationToCause === false));
  assert.equal(plan.proximityImpliesCausality, false);
});

test("20 — VAI roles remain unchanged", () => {
  const { plan, target } = transition("CAUSE_INVESTIGATION", "VARIABLE_LEVER");
  assert.equal(plan.assignsVaiRoles, false);
  assert.equal(target.scene.actors.find((item) => item.canonicalObjectId === "obj-staffing")?.vaiRoleRef, "LEVER");
});

test("21 — Risk truth remains unchanged", () => {
  const { plan, target } = transition("VARIABLE_LEVER", "RISK_FOCUS");
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.calculatesRisk, false);
  assert.equal(target.scene.actors.find((item) => item.canonicalObjectId === "obj-risk-gap")?.objectAuthority, "MO:1");
  assert.equal(plan.mutatesCanonicalObjects, false);
});

test("22 — Execution truth remains unchanged", () => {
  const { plan, target } = transition("OPERATIONAL_FLOW", "EXECUTION_STATUS");
  assert.equal(plan.writesExecution, false);
  assert.equal(target.scene.writes.executionState, false);
});

test("23 — Outcome truth remains unchanged", () => {
  const { plan, target } = transition("OPERATIONAL_FLOW", "OUTCOME_ASSESSMENT");
  assert.equal(plan.writesOutcome, false);
  assert.equal(target.scene.writes.outcome, false);
});

test("24 — Transition sequence is deterministic", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.deepEqual(
    plan.sequence.map((item) => item.step),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.equal(plan.sequence, DTH_EXP_TRANSITION_SEQUENCE);
});

test("25 — Timing categories are centralized/semantic", () => {
  assert.deepEqual([...DTH_EXP_TIMING_CATEGORIES], ["immediate", "short", "standard", "deliberate"]);
  assert.ok(DTH_EXP_TRANSITION_SEQUENCE.every((item) => (DTH_EXP_TIMING_CATEGORIES as readonly string[]).includes(item.timing)));
});

test("26 — Reduced-motion equivalent exists", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.reducedMotion.appliesTargetProjectionDirectly, true);
  assert.equal(plan.reducedMotion.movement, false);
});

test("27 — Reduced-motion preserves management meaning", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.reducedMotion.managementMeaningPreserved, true);
  assert.equal(plan.reducedMotion.becameFocal, "obj-product-line-a");
  assert.ok(plan.reducedMotion.entered.includes("obj-cost"));
  assert.ok(plan.reducedMotion.leftVisiblePerspective.includes("obj-market"));
});

test("28 — Persistent actors do not exit/re-enter unnecessarily", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const line = actor(plan, "obj-product-line-a");
  assert.equal(line?.operations.includes("exit") && line?.operations.includes("enter"), false);
  assert.equal(line?.classification === "entering" || line?.classification === "exiting", false);
});

test("29 — Latest valid target can supersede obsolete transition plan", () => {
  const first = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const second = transition("CAUSE_INVESTIGATION", "VARIABLE_LEVER", { superseded: first.plan.planId });
  assert.equal(second.plan.replacement.policy, "latest-valid-target-supersedes-incomplete-plan");
  assert.equal(second.plan.replacement.supersedesPlanId, first.plan.planId);
  assert.deepEqual([...second.plan.replacement.obsoletePlanMustNotOverride], [
    "new-subject",
    "new-director-selection",
    "new-scene-composition",
    "new-canonical-truth",
  ]);
});

test("30 — Hidden/collapsed actors receive bounded transition treatment", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "OPERATIONAL_FLOW", { toBottleneck: "obj-production" });
  const market = actor(plan, "obj-market");
  assert.equal(market?.boundedTreatment, true);
  assert.equal(market?.skipDetailedMotion, true);
});

test("31 — Same source/target inputs produce same transition plan", () => {
  const first = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  const second = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.deepEqual(first.plan.actors, second.plan.actors);
  assert.deepEqual(first.plan.relationships, second.plan.relationships);
  assert.equal(first.plan.planId, second.plan.planId);
});

test("32 — No canonical Object mutation", () => {
  const { plan, target } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.mutatesCanonicalObjects, false);
  assert.ok(target.scene.actors.every((item) => item.presentationMutatesCanonicalObject === false));
});

test("33 — No Theatre Scene mutation", () => {
  const { plan, target } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.mutatesTheatreScene, false);
  assert.equal(JSON.stringify(target.scene), target.snapshot);
});

test("34 — No Stage authority duplication", () => {
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.parallelStage, false);
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("35 — No Director authority duplication", () => {
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.parallelDirector, false);
  assert.equal(DTH_EXP_SCENE_TRANSITION_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("36 — No animation runtime/live /executive wiring is introduced", () => {
  const { plan } = transition("OPERATIONAL_FLOW", "CAUSE_INVESTIGATION");
  assert.equal(plan.animationPlayback, false);
  assert.equal(plan.liveStageWiring, false);
  assert.equal(plan.interpolatesPixels, false);
});

test("37 — DTH-EXP:1–5A gates remain green", () => {
  assert.equal(verifyDthExpSpatialLayoutBoundary().ok, true);
  assert.equal(dthExpSpatialLayoutIdentity, "NPA-T DTH-EXP:5A/DynamicSceneLayout");
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

test("certification journey: Product Line A flow → bottleneck → cause → impact → risk → time", () => {
  const steps: readonly {
    readonly from: DthExpDirectorManagementNeed;
    readonly to: DthExpDirectorManagementNeed;
    readonly toFamily: DthExpNexoRecipeFamily;
    readonly toBottleneck?: string;
  }[] = [
    { from: "OPERATIONAL_FLOW", to: "OPERATIONAL_FLOW", toFamily: "NEXO_FLOW", toBottleneck: "obj-production" },
    { from: "OPERATIONAL_FLOW", to: "CAUSE_INVESTIGATION", toFamily: "NEXO_CAUSE" },
    { from: "CAUSE_INVESTIGATION", to: "VARIABLE_LEVER", toFamily: "NEXO_IMPACT" },
    { from: "VARIABLE_LEVER", to: "RISK_FOCUS", toFamily: "NEXO_RISK" },
    { from: "RISK_FOCUS", to: "TEMPORAL_DEVELOPMENT", toFamily: "NEXO_TIME" },
  ];
  let superseded: string | null = null;
  for (const step of steps) {
    const result = transition(step.from, step.to, { toBottleneck: step.toBottleneck, superseded });
    assert.equal(result.plan.targetFamily, step.toFamily);
    assert.notEqual(actor(result.plan, "obj-product-line-a")?.classification, "exiting");
    assert.equal(actor(result.plan, "obj-product-line-a")?.canonicalObjectId, "obj-product-line-a");
    assert.equal(result.plan.mutatesCanonicalObjects, false);
    assert.equal(result.plan.reducedMotion.managementMeaningPreserved, true);
    assert.ok(Array.isArray(result.plan.reducedMotion.entered));
    assert.ok(Array.isArray(result.plan.reducedMotion.leftVisiblePerspective));
    assert.equal(result.plan.parallelTimelineAuthority, false);
    assert.equal(result.plan.bottleneckFamily, false);
    if (step.toFamily === "NEXO_CAUSE") {
      assert.equal(result.plan.evidence.find((item) => item.evidenceRef === "cc8:evidence:cost-rise")?.authority, "CC:8");
      assert.ok(result.plan.relationships.every((item) => item.upgradesAssociationToCause === false));
    }
    if (step.toFamily === "NEXO_IMPACT") {
      assert.equal(result.plan.assignsVaiRoles, false);
    }
    superseded = result.plan.planId;
  }
});
