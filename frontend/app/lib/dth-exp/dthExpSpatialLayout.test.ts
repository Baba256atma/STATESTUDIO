/**
 * NPA-T DTH-EXP:5A — spatial grammar tests.
 * Projection only. No animation, live Stage, or DTH-EXP:5B.
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
  DTH_EXP_SPATIAL_LAYOUT_BOUNDARY,
  DTH_EXP_SPATIAL_LAYOUT_ENGINE,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
  defineNexoBubbleRecipe,
  dthExpDirectorSceneCompositionIdentity,
  dthExpSpatialLayoutIdentity,
  projectDthExpSpatialLayout,
  resolveNexoFamilyRecipe,
  selectNexoraDirectorNexoFamily,
  verifyDthExpDirectorSceneCompositionBoundary,
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
import { projectDthExpTheatreScene } from "./dthExpPublicIndex.ts";

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
  extras: Partial<DthExpDirectorSceneGraph["objects"][number]> & {
    readonly kind?: string;
    readonly authority?: string;
  } = {},
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
      hint("obj-decision-1", { kind: "decision", authority: "CC:10", familyRelevance: ["NEXO_EXECUTION"] }),
      hint("obj-outcome-1", { kind: "outcome", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-goal-1", { kind: "goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
      hint("obj-project-alpha", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
      hint("obj-project-beta", { kind: "project", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
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
    collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta", "obj-product-line-a"]),
  });
}

function layout(need: DthExpDirectorManagementNeed, extras?: { readonly bottleneck?: string | null }) {
  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: "obj-product-line-a",
    managementNeed: need,
  });
  const composed = composeNexoraDirectorSceneContext({ selection, directorPlan: dirPlan(), graph: graph() });
  const scene = composed.recipeResolution?.scene;
  if (!scene) throw new Error(`missing scene for ${need}`);
  return {
    composed,
    scene,
    snapshot: JSON.stringify(scene),
    projection: projectDthExpSpatialLayout({
      scene,
      family: selection.selectedFamily!,
      bottleneckFocusCanonicalObjectId: extras?.bottleneck,
    }),
  };
}

function actor(projection: ReturnType<typeof layout>["projection"], id: string) {
  return projection.actors.find((item) => item.canonicalObjectId === id);
}

test("DTH-EXP:5A identity and boundary", () => {
  assert.equal(dthExpSpatialLayoutIdentity, "NPA-T DTH-EXP:5A/DynamicSceneLayout");
  assert.equal(verifyDthExpSpatialLayoutBoundary().ok, true);
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.startsDthExp5B, false);
  assert.equal(DTH_EXP_NORMALIZED_STAGE_SPACE.pixelIndependent, true);
});

test("1 — Resolved Theatre Scene produces a spatial projection", () => {
  const result = layout("OPERATIONAL_FLOW");
  assert.equal(result.projection.identity, dthExpSpatialLayoutIdentity);
  assert.ok(result.projection.actors.length > 0);
});

test("2 — Spatial projection does not mutate Theatre Scene", () => {
  const result = layout("OPERATIONAL_FLOW");
  assert.equal(JSON.stringify(result.scene), result.snapshot);
  assert.equal(result.projection.mutatesTheatreScene, false);
});

test("3 — Canonical Objects are not mutated", () => {
  const result = layout("CAUSE_INVESTIGATION");
  assert.equal(result.projection.mutatesCanonicalObjects, false);
  assert.ok(result.scene.actors.every((item) => item.presentationMutatesCanonicalObject === false));
});

test("4 — Canonical actor IDs survive layout", () => {
  const result = layout("OPERATIONAL_FLOW");
  for (const item of result.scene.actors) {
    assert.equal(actor(result.projection, item.canonicalObjectId)?.canonicalObjectId, item.canonicalObjectId);
    assert.equal(actor(result.projection, item.canonicalObjectId)?.actorId, item.actorId);
  }
});

test("5 — Same input produces deterministic layout", () => {
  const first = layout("OPERATIONAL_FLOW");
  const second = layout("OPERATIONAL_FLOW");
  assert.deepEqual(first.projection.actors, second.projection.actors);
});

test("6 — Focal actor receives focal spatial treatment", () => {
  const result = layout("CAUSE_INVESTIGATION");
  const focal = actor(result.projection, "obj-product-line-a");
  assert.equal(focal?.emphasis, "high");
  assert.equal(focal?.depth, "foreground");
  assert.equal(focal?.sizeReason, "focal-attention");
  assert.ok(Math.abs(focal!.position.x - DTH_EXP_NORMALIZED_STAGE_SPACE.focalZone.x) < 0.25);
});

test("7 — Supporting actors remain secondary", () => {
  const result = layout("CAUSE_INVESTIGATION");
  const cost = actor(result.projection, "obj-cost");
  assert.ok(cost);
  assert.notEqual(cost?.emphasis, "high");
  assert.equal(cost?.depth, "middle");
});

test("8 — Proximity does not create causal truth", () => {
  const result = layout("CAUSE_INVESTIGATION");
  assert.equal(result.projection.proximityImpliesCausality, false);
  assert.ok(result.projection.actors.every((item) => item.proximityImpliesCausality === false));
  assert.ok(result.projection.relationshipPaths.every((item) => item.impliesCausality === false));
});

test("9 — Size has explicit semantic reason", () => {
  const result = layout("MAGNITUDE_COMPARISON");
  assert.ok(result.projection.actors.every((item) => item.sizeReason.length > 0));
});

test("10 — Depth/emphasis remains presentation-only", () => {
  const result = layout("OPERATIONAL_FLOW");
  assert.ok(["foreground", "middle", "background"].includes(result.projection.actors[0]!.depth));
  assert.equal(result.scene.writes.canonicalObjects, false);
});

test("11 — NexoBubble uses shared layout grammar", () => {
  const result = layout("PORTFOLIO_COMPARISON");
  assert.equal(result.projection.family, "NEXO_BUBBLE");
  assert.equal(result.projection.engine, DTH_EXP_SPATIAL_LAYOUT_ENGINE);
  assert.ok(result.projection.actors.every((item) => item.engine === DTH_EXP_SPATIAL_LAYOUT_ENGINE));
});

test("12 — NexoBars uses shared layout grammar", () => {
  const result = layout("MAGNITUDE_COMPARISON");
  assert.equal(result.projection.family, "NEXO_BARS");
  assert.equal(result.projection.engine, DTH_EXP_SPATIAL_LAYOUT_ENGINE);
  assert.ok(result.projection.actors.every((item) => item.lane === "baseline"));
});

test("13 — NexoFlow supports upstream → focal → downstream", () => {
  const result = layout("OPERATIONAL_FLOW");
  const supplier = actor(result.projection, "obj-supplier-a");
  const line = actor(result.projection, "obj-product-line-a");
  const market = actor(result.projection, "obj-market");
  assert.ok(supplier && line && market);
  assert.ok(supplier.position.x < line.position.x);
  assert.ok(line.position.x < market.position.x);
});

test("14 — Bottleneck focus keeps immediate neighbors and reduces distant context", () => {
  const result = layout("OPERATIONAL_FLOW", { bottleneck: "obj-production" });
  assert.equal(result.projection.bottleneckFamily, false);
  assert.notEqual(actor(result.projection, "obj-supplier-a")?.disclosure, "collapsed");
  assert.notEqual(actor(result.projection, "obj-product-line-a")?.disclosure, "collapsed");
  assert.equal(actor(result.projection, "obj-market")?.disclosure, "collapsed");
  assert.equal(actor(result.projection, "obj-market")?.sizeReason, "collapsed-distant-context");
});

test("15 — NexoImpact preserves VAI semantics", () => {
  const result = layout("VARIABLE_LEVER");
  const staffing = result.scene.actors.find((item) => item.canonicalObjectId === "obj-staffing");
  assert.equal(staffing?.vaiRoleRef, "LEVER");
  assert.equal(staffing?.visualRoleMutatesVaiRole, false);
  assert.equal(result.projection.engine, DTH_EXP_SPATIAL_LAYOUT_ENGINE);
});

test("16 — NexoRisk consumes existing Risk truth only", () => {
  const result = layout("RISK_FOCUS");
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.calculatesRisk, false);
  assert.equal(result.scene.actors.find((item) => item.canonicalObjectId === "obj-risk-gap")?.objectAuthority, "MO:1");
});

test("17 — NexoTime supports Past → Now → Future without Timeline authority", () => {
  const result = layout("TEMPORAL_DEVELOPMENT");
  assert.equal(result.projection.parallelTimelineAuthority, false);
  const past = actor(result.projection, "obj-cost-history");
  const now = actor(result.projection, "obj-product-line-a");
  assert.ok(past && now);
  assert.ok(past.position.x < now.position.x);
});

test("18 — NexoCause preserves relationship/causal semantics", () => {
  const result = layout("CAUSE_INVESTIGATION");
  const associated = result.projection.relationshipPaths.find((item) => item.relationshipId === "rel-cost-line");
  assert.equal(associated?.semanticRelation, "associated");
  assert.equal(associated?.presentationKind, "candidate");
  assert.equal(associated?.upgradesAssociationToCause, false);
});

test("19 — NexoExecution consumes existing execution state only", () => {
  const result = layout("EXECUTION_STATUS");
  assert.equal(result.scene.writes.executionState, false);
  assert.ok(actor(result.projection, "obj-execution-1"));
});

test("20 — NexoOutcome does not invent success/failure", () => {
  const result = layout("OUTCOME_ASSESSMENT");
  assert.equal(result.projection.declaresOutcomeSuccess, false);
  assert.equal(result.scene.writes.outcome, false);
});

test("21 — Evidence attachment remains associated with supported actor/relationship", () => {
  const result = layout("CAUSE_INVESTIGATION");
  const hint = result.projection.evidenceHints.find((item) => item.evidenceRef === "cc8:evidence:cost-rise");
  const cost = actor(result.projection, "obj-cost");
  assert.equal(hint?.authority, "CC:8");
  assert.equal(hint?.attachedToId, "obj-cost");
  assert.equal(hint?.placement, "attach-to-actor");
  assert.ok(Math.hypot(hint!.position.x - cost!.position.x, hint!.position.y - cost!.position.y) < 0.2);
});

test("22 — Relationship paths retain source semantics", () => {
  const result = layout("OPERATIONAL_FLOW");
  const feeds = result.projection.relationshipPaths.find((item) => item.relationshipId === "rel-supplier-production");
  assert.equal(feeds?.sourceAuthority, "NMI:1/relationship");
  assert.equal(feeds?.presentationKind, "directional");
  assert.ok(feeds!.fromPosition.x < feeds!.toPosition.x);
});

test("23 — Progressive disclosure states are presentation-only", () => {
  const result = layout("OPERATIONAL_FLOW", { bottleneck: "obj-production" });
  assert.ok(["visible", "contextual", "de-emphasized", "collapsed", "hidden"].includes(actor(result.projection, "obj-market")!.disclosure));
  assert.equal(result.composed.writesCanonicalObjects, false);
});

test("24 — Dense scenes preserve focus hierarchy", () => {
  const candidates = Array.from({ length: 12 }, (_, index) => ({ canonicalObjectId: `obj-cand-${index}` }));
  const definition = defineNexoBubbleRecipe({
    recipeId: "nexo:bubble:dense",
    candidates: [{ canonicalObjectId: "obj-product-line-a" }, ...candidates],
    focalCanonicalObjectId: "obj-product-line-a",
  });
  const resolved = resolveNexoFamilyRecipe({
    definition,
    context: {
      objects: Object.freeze([
        { id: "obj-product-line-a", label: "Product Line A" },
        ...candidates.map((item) => ({ id: item.canonicalObjectId, label: item.canonicalObjectId })),
      ]),
    },
  });
  const projection = projectDthExpSpatialLayout({ scene: resolved.scene, family: "NEXO_BUBBLE" });
  assert.equal(projection.density, "dense");
  const focal = actor(projection, "obj-product-line-a");
  assert.equal(focal?.emphasis, "high");
  assert.ok(projection.actors.filter((item) => item.canonicalObjectId !== "obj-product-line-a").every((item) => item.emphasis !== "high"));
});

test("25 — Same Object can occupy different positions across Nexo perspectives while retaining ID", () => {
  const flow = actor(layout("OPERATIONAL_FLOW").projection, "obj-product-line-a");
  const cause = actor(layout("CAUSE_INVESTIGATION").projection, "obj-product-line-a");
  const impact = actor(layout("VARIABLE_LEVER").projection, "obj-product-line-a");
  assert.equal(flow?.canonicalObjectId, "obj-product-line-a");
  assert.equal(cause?.canonicalObjectId, "obj-product-line-a");
  assert.equal(impact?.canonicalObjectId, "obj-product-line-a");
  assert.notDeepEqual(flow?.position, cause?.position);
});

test("26 — Layout exposes target state for future 5B animation", () => {
  const laid = layout("OPERATIONAL_FLOW").projection.actors[0]!;
  assert.deepEqual(laid.animationTarget.position, laid.position);
  assert.equal(laid.animationTarget.interpolationImplemented, false);
  assert.equal(laid.animationTarget.durationMs, null);
  assert.equal(laid.animationTarget.easing, null);
});

test("27 — No animation engine is introduced", () => {
  assert.equal(layout("OPERATIONAL_FLOW").projection.animationEngine, false);
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.animationEngine, false);
});

test("28 — No new layout-specific business authority is introduced", () => {
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.calculatesRisk, false);
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.declaresOutcomeSuccess, false);
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.upgradesRelationshipSemantics, false);
});

test("29 — Stage remains NEX-MVP:3/4", () => {
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
  assert.equal(layout("OPERATIONAL_FLOW").scene.stageHost, "NEX-MVP:3/Nexora3DExecutiveStage");
});

test("30 — Director remains DIR:1", () => {
  assert.equal(DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(layout("OPERATIONAL_FLOW").scene.directorComposition.authority, nexoraSemanticPresentationDirectorIdentity);
});

test("31 — DTH-EXP:1–4B gates remain green", () => {
  assert.equal(verifyDthExpDirectorSceneCompositionBoundary().ok, true);
  assert.equal(dthExpDirectorSceneCompositionIdentity, "NPA-T DTH-EXP:4B/DirectorSceneComposition");
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

test("shared engine covers all nine families", () => {
  const needs: readonly DthExpDirectorManagementNeed[] = [
    "PORTFOLIO_COMPARISON",
    "MAGNITUDE_COMPARISON",
    "OPERATIONAL_FLOW",
    "VARIABLE_LEVER",
    "RISK_FOCUS",
    "TEMPORAL_DEVELOPMENT",
    "CAUSE_INVESTIGATION",
    "EXECUTION_STATUS",
    "OUTCOME_ASSESSMENT",
  ];
  const families = new Set<DthExpNexoRecipeFamily>();
  for (const need of needs) {
    const result = layout(need);
    families.add(result.projection.family);
    assert.equal(result.projection.engine, DTH_EXP_SPATIAL_LAYOUT_ENGINE);
  }
  assert.equal(families.size, 9);
});

test("certification journey: Product Line A spatial perspectives", () => {
  const flow = layout("OPERATIONAL_FLOW");
  assert.ok(actor(flow.projection, "obj-supplier-a")!.position.x < actor(flow.projection, "obj-market")!.position.x);
  const bottleneck = layout("OPERATIONAL_FLOW", { bottleneck: "obj-production" });
  assert.equal(actor(bottleneck.projection, "obj-market")?.disclosure, "collapsed");
  const cause = layout("CAUSE_INVESTIGATION");
  assert.equal(actor(cause.projection, "obj-product-line-a")?.lane, "focal-condition");
  assert.equal(cause.projection.evidenceHints[0]?.attachedToId, "obj-cost");
  const impact = layout("VARIABLE_LEVER");
  assert.equal(impact.scene.actors.find((item) => item.canonicalObjectId === "obj-staffing")?.vaiRoleRef, "LEVER");
  const time = layout("TEMPORAL_DEVELOPMENT");
  assert.ok(actor(time.projection, "obj-cost-history")!.position.x < actor(time.projection, "obj-product-line-a")!.position.x);
  for (const result of [flow, bottleneck, cause, impact, time]) {
    assert.equal(actor(result.projection, "obj-product-line-a")?.canonicalObjectId, "obj-product-line-a");
    assert.equal(result.projection.animationEngine, false);
    assert.equal(result.projection.proximityImpliesCausality, false);
  }
});
