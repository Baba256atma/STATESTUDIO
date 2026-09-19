/**
 * NPA-T DTH-EXP:4B — Director scene composition tests.
 * Context selection only. No rendering, multi-Nexo, or DTH-EXP:5.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  directNexoraPresentation,
  nexoraSemanticPresentationDirectorIdentity,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { DTH_EXP_VAI_ROLE_AUTHORITY } from "./dthExpTheatreContract.ts";
import { nexoraMVPObjectInteractionIdentity } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  composeNexoraDirectorSceneContext,
  DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY,
  dthExpDirectorNexoSelectionIdentity,
  dthExpDirectorSceneCompositionIdentity,
  selectNexoraDirectorNexoFamily,
  verifyDthExpDirectorNexoSelectionBoundary,
  verifyDthExpDirectorSceneCompositionBoundary,
  verifyDthExpNexoFamilyBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import { createInitialNexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
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

function select(need: DthExpDirectorManagementNeed, subject = "obj-product-line-a") {
  return selectNexoraDirectorNexoFamily({
    directorPlan: dirPlan(),
    canonicalSubjectId: subject,
    managementNeed: need,
  });
}

function hint(
  id: string,
  extras: Partial<DthExpDirectorSceneGraph["objects"][number]> & {
    readonly kind?: string;
    readonly label?: string;
    readonly authority?: string;
  } = {},
) {
  return Object.freeze({
    object: Object.freeze({
      id,
      kind: extras.kind ?? "object",
      label: extras.label ?? id,
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

function managementGraph(overrides?: Partial<DthExpDirectorSceneGraph>): DthExpDirectorSceneGraph {
  return Object.freeze({
    objects: overrides?.objects ??
      Object.freeze([
        hint("obj-supplier-a", { label: "Supplier A", familyRelevance: ["NEXO_FLOW"] }),
        hint("obj-production", { label: "Production", familyRelevance: ["NEXO_FLOW"], bottleneck: true }),
        hint("obj-product-line-a", { label: "Product Line A", familyRelevance: "all" }),
        hint("obj-market", { label: "Market", familyRelevance: ["NEXO_FLOW"] }),
        hint("obj-cost", { kind: "kpi", label: "Cost", familyRelevance: ["NEXO_BARS", "NEXO_CAUSE"] }),
        hint("obj-staffing", { label: "Staffing", vaiRoleRef: "LEVER", familyRelevance: ["NEXO_IMPACT", "NEXO_CAUSE"] }),
        hint("obj-risk-gap", { kind: "risk", label: "Capacity Gap Risk", authority: "MO:1", familyRelevance: ["NEXO_RISK"] }),
        hint("obj-execution-1", { kind: "execution", label: "Execute Plan", authority: "CC:11", familyRelevance: ["NEXO_EXECUTION"] }),
        hint("obj-decision-1", { kind: "decision", label: "Commit Plan", authority: "CC:10", familyRelevance: ["NEXO_EXECUTION"] }),
        hint("obj-outcome-1", { kind: "outcome", label: "Observed Delivery", authority: "CORE-OUT", familyRelevance: ["NEXO_OUTCOME"] }),
        hint("obj-goal-1", { kind: "goal", label: "Delivery Goal", authority: "MO:1", familyRelevance: ["NEXO_OUTCOME"] }),
        hint("obj-scenario-x", { kind: "scenario", label: "Scenario X", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
        hint("obj-project-alpha", { kind: "project", label: "Project Alpha", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
        hint("obj-project-beta", { kind: "project", label: "Project Beta", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
        hint("obj-project-gamma", { kind: "project", label: "Project Gamma", familyRelevance: ["NEXO_BUBBLE"], collectionMember: true }),
        hint("obj-cost-history", { kind: "kpi", label: "Cost History", familyRelevance: ["NEXO_TIME"], timeBucket: "historical" }),
      ]),
    relationships: overrides?.relationships ??
      Object.freeze([
        rel("rel-supplier-production", "obj-supplier-a", "obj-production", "feeds"),
        rel("rel-production-line", "obj-production", "obj-product-line-a", "produces"),
        rel("rel-line-market", "obj-product-line-a", "obj-market", "serves"),
        rel("rel-cost-line", "obj-cost", "obj-product-line-a", "associated"),
        rel("rel-staffing-line", "obj-staffing", "obj-product-line-a", "candidate"),
      ]),
    evidence: overrides?.evidence ??
      Object.freeze([
        Object.freeze({
          evidenceRef: "cc8:evidence:cost-rise",
          attachedToKind: "object" as const,
          attachedToId: "obj-cost",
          familyRelevance: ["NEXO_CAUSE"] as const,
          relevantToQuestion: true,
        }),
        Object.freeze({
          evidenceRef: "cc8:evidence:unrelated",
          attachedToKind: "object" as const,
          attachedToId: "obj-scenario-x",
          familyRelevance: ["NEXO_BUBBLE"] as const,
          relevantToQuestion: false,
        }),
        Object.freeze({
          evidenceRef: "cc8:evidence:flow",
          attachedToKind: "object" as const,
          attachedToId: "obj-production",
          familyRelevance: ["NEXO_FLOW"] as const,
          relevantToQuestion: true,
        }),
      ]),
    bindings: overrides?.bindings ??
      Object.freeze([
        Object.freeze({
          bindingId: "flow-throughput",
          canonicalObjectId: "obj-production",
          dimension: "kpi-value" as const,
          authority: "existing KPI observation owners",
          valueRef: "kpi:production:throughput",
        }),
        Object.freeze({
          bindingId: "cost-value",
          canonicalObjectId: "obj-cost",
          dimension: "cost" as const,
          authority: "existing KPI observation owners",
          valueRef: "kpi:line:cost",
        }),
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
    bottleneckCanonicalObjectId: overrides?.bottleneckCanonicalObjectId ?? "obj-production",
    previousSceneActorIds: overrides?.previousSceneActorIds,
    collectionMemberIds: overrides?.collectionMemberIds,
    requiredRelationshipIds: overrides?.requiredRelationshipIds,
  });
}

function compose(need: DthExpDirectorManagementNeed, graph = managementGraph(), subject = "obj-product-line-a") {
  return composeNexoraDirectorSceneContext({
    selection: select(need, subject),
    directorPlan: dirPlan(),
    graph,
  });
}

function ids(result: ReturnType<typeof compose>): readonly string[] {
  return result.actors.map((item) => item.canonicalObjectId);
}

test("DTH-EXP:4B identity and boundary", () => {
  assert.equal(dthExpDirectorSceneCompositionIdentity, "NPA-T DTH-EXP:4B/DirectorSceneComposition");
  assert.equal(verifyDthExpDirectorSceneCompositionBoundary().ok, true);
  assert.equal(DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.startsDthExp5, false);
  assert.equal(DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.director, nexoraSemanticPresentationDirectorIdentity);
});

test("1 — 4A selected family feeds 4B", () => {
  const selection = select("OPERATIONAL_FLOW");
  const result = composeNexoraDirectorSceneContext({ selection, directorPlan: dirPlan(), graph: managementGraph() });
  assert.equal(selection.selectedFamily, "NEXO_FLOW");
  assert.equal(result.selectedFamily, selection.selectedFamily);
  assert.equal(result.recipePipeline, "DTH-EXP:3B→DTH-EXP:3A");
});

test("2 — Canonical subject anchors composition", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.equal(result.canonicalSubjectId, "obj-product-line-a");
  assert.ok(ids(result).includes("obj-product-line-a"));
});

test("3 — Actors resolve through DTH-EXP:2", () => {
  const result = compose("OPERATIONAL_FLOW");
  assert.equal(result.actorResolver, "DTH-EXP:2/ObjectStageRoles");
  assert.equal(result.recipeResolution?.actorResolver, "DTH-EXP:2/ObjectStageRoles");
});

test("4 — Only canonical Objects are selected", () => {
  const graph = managementGraph();
  const result = compose("OPERATIONAL_FLOW", graph);
  const known = new Set(graph.objects.map((item) => item.object.id));
  assert.ok(result.actors.every((item) => known.has(item.canonicalObjectId)));
});

test("5 — Minimum relevant context is preferred over entire graph", () => {
  const result = compose("OPERATIONAL_FLOW");
  const selected = ids(result);
  assert.ok(selected.includes("obj-product-line-a"));
  assert.ok(selected.includes("obj-supplier-a"));
  assert.equal(selected.includes("obj-scenario-x"), false);
  assert.equal(selected.includes("obj-project-alpha"), false);
  assert.equal(selected.includes("obj-decision-1"), false);
  assert.ok(result.omittedCanonicalObjectIds.includes("obj-scenario-x"));
});

test("6 — Existing relationships are selected without semantic upgrade", () => {
  const result = compose("OPERATIONAL_FLOW");
  const feeds = result.relationships.find((item) => item.relationshipId === "rel-supplier-production");
  assert.equal(feeds?.semanticRelation, "feeds");
  assert.equal(feeds?.sourceAuthority, "NMI:1/relationship");
  assert.ok(result.recipeResolution?.scene.relationships.every((item) => item.impliesCausality === false));
});

test("7 — NexoCause does not convert association into causation", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.equal(result.selectedFamily, "NEXO_CAUSE");
  assert.equal(result.createsCausalTruth, false);
  const associated = result.relationships.find((item) => item.relationshipId === "rel-cost-line");
  assert.equal(associated?.semanticRelation, "associated");
  assert.notEqual(associated?.semanticRelation, "CAUSES");
});

test("8 — Evidence remains references", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.ok(result.evidenceRefs.includes("cc8:evidence:cost-rise"));
  assert.ok(result.recipeResolution?.scene.evidenceAttachments.every((item) => item.authority === "CC:8"));
  assert.ok(result.recipeResolution?.scene.evidenceAttachments.every((item) => item.copiesEvidence === false));
});

test("9 — Relevant Evidence can be selected", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.ok(result.evidenceRefs.includes("cc8:evidence:cost-rise"));
});

test("10 — Unrelated Evidence is not automatically included", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.equal(result.evidenceRefs.includes("cc8:evidence:unrelated"), false);
});

test("11 — Analytical bindings retain source authority", () => {
  const result = compose("VARIABLE_LEVER");
  const vai = result.analyticalBindings.find((item) => item.bindingId === "vai-lever");
  assert.equal(vai?.authority, "VAI:1–8");
  assert.equal(result.recipeResolution?.analyticalBindings.find((item) => item.bindingId === "vai-lever")?.copiedIntoRecipe, false);
});

test("12 — 4B does not independently calculate truth", () => {
  const result = compose("MAGNITUDE_COMPARISON");
  assert.equal(result.calculatesTruth, false);
  assert.ok(result.recipeResolution?.analyticalBindings.every((item) => item.calculatedByRecipe === false));
});

test("13 — NexoFlow selects flow-relevant context", () => {
  const result = compose("OPERATIONAL_FLOW");
  const selected = ids(result);
  assert.deepEqual(
    ["obj-supplier-a", "obj-production", "obj-product-line-a", "obj-market"].every((id) => selected.includes(id)),
    true,
  );
  assert.equal(result.selectedFamily, "NEXO_FLOW");
});

test("14 — Bottleneck composition stays inside NexoFlow", () => {
  const result = compose("BOTTLENECK_LOCATION");
  assert.equal(result.selectedFamily, "NEXO_FLOW");
  assert.equal(result.bottleneckFamily, false);
  const selected = ids(result);
  assert.ok(selected.includes("obj-production"));
  assert.ok(selected.includes("obj-supplier-a"));
  assert.ok(selected.includes("obj-product-line-a"));
  assert.equal(selected.includes("obj-market"), false);
});

test("15 — NexoImpact consumes existing VAI context", () => {
  const result = compose("VARIABLE_LEVER");
  assert.equal(result.assignsVaiRoles, false);
  const staffing = result.actors.find((item) => item.canonicalObjectId === "obj-staffing");
  assert.equal(staffing?.vaiRoleRef, "LEVER");
  assert.deepEqual([...DTH_EXP_VAI_ROLE_AUTHORITY], ["LEVER", "OUTCOME", "PATH_OF_EFFECT", "MODERATOR", "CONTROL", "CONFOUNDER"]);
});

test("16 — NexoRisk consumes existing Risk context", () => {
  const result = compose("RISK_FOCUS");
  assert.ok(ids(result).includes("obj-risk-gap"));
  assert.ok(ids(result).includes("obj-product-line-a"));
  assert.equal(result.actors.find((item) => item.canonicalObjectId === "obj-risk-gap")?.objectAuthority, "MO:1");
});

test("17 — NexoTime consumes existing time context without Timeline authority", () => {
  const result = compose("TEMPORAL_DEVELOPMENT");
  assert.equal(result.parallelTimelineAuthority, false);
  assert.ok(ids(result).includes("obj-product-line-a"));
  assert.ok(ids(result).includes("obj-cost-history"));
  assert.equal(result.analyticalBindings.some((item) => item.dimension === "time"), true);
});

test("18 — NexoCause preserves causal safety", () => {
  const result = compose("CAUSE_INVESTIGATION");
  assert.equal(result.createsCausalTruth, false);
  assert.equal(result.upgradesRelationshipSemantics, false);
});

test("19 — NexoExecution remains read-only", () => {
  const result = compose("EXECUTION_STATUS", managementGraph(), "obj-product-line-a");
  assert.equal(result.writesExecution, false);
  assert.ok(ids(result).includes("obj-execution-1"));
  assert.equal(result.recipeResolution?.scene.writes.executionState, false);
});

test("20 — NexoOutcome remains read-only", () => {
  const result = compose("OUTCOME_ASSESSMENT");
  assert.equal(result.writesOutcome, false);
  assert.ok(ids(result).includes("obj-outcome-1"));
  assert.equal(result.recipeResolution?.scene.writes.outcome, false);
  assert.equal(result.recipeResolution?.scene.writes.learning, false);
});

test("21 — Cross-family perspective change preserves Object IDs", () => {
  const flow = compose("OPERATIONAL_FLOW");
  const cause = compose("CAUSE_INVESTIGATION");
  const impact = compose("VARIABLE_LEVER");
  const risk = compose("RISK_FOCUS");
  for (const result of [flow, cause, impact, risk]) {
    assert.equal(result.canonicalSubjectId, "obj-product-line-a");
    assert.ok(ids(result).includes("obj-product-line-a"));
  }
});

test("22 — Stale previous-scene actors do not leak into unrelated new scenes", () => {
  const result = compose(
    "CAUSE_INVESTIGATION",
    managementGraph({
      previousSceneActorIds: Object.freeze(["obj-project-alpha", "obj-project-beta", "obj-project-gamma", "obj-product-line-a"]),
    }),
  );
  assert.equal(ids(result).includes("obj-project-alpha"), false);
  assert.equal(ids(result).includes("obj-project-beta"), false);
  assert.ok(ids(result).includes("obj-product-line-a"));
});

test("23 — Collection member identity remains stable", () => {
  const result = compose(
    "CAUSE_INVESTIGATION",
    managementGraph({
      collectionMemberIds: Object.freeze(["obj-project-alpha", "obj-project-beta", "obj-project-gamma"]),
      objects: Object.freeze([
        hint("obj-project-alpha", { kind: "project", collectionMember: true, familyRelevance: ["NEXO_BUBBLE"] }),
        hint("obj-project-beta", { kind: "project", collectionMember: true, familyRelevance: "all" }),
        hint("obj-project-gamma", { kind: "project", collectionMember: true, familyRelevance: ["NEXO_BUBBLE"] }),
        hint("obj-cost", { kind: "kpi", familyRelevance: ["NEXO_CAUSE"] }),
      ]),
    }),
    "obj-project-beta",
  );
  assert.equal(result.canonicalSubjectId, "obj-project-beta");
  assert.ok(ids(result).includes("obj-project-beta"));
  assert.equal(ids(result)[0] === "obj-project-alpha" ? false : true, true);
  assert.equal(ids(result).includes("obj-project-alpha"), false);
});

test("24 — Missing required context fails safely", () => {
  const result = composeNexoraDirectorSceneContext({
    selection: select("OPERATIONAL_FLOW", "obj-missing"),
    directorPlan: dirPlan(),
    graph: managementGraph(),
  });
  assert.equal(result.compositionState, "missing-required-actor");
  assert.equal(result.recipeResolution, null);
});

test("25 — No actor is invented as fallback", () => {
  const result = compose("OPERATIONAL_FLOW", managementGraph({ objects: Object.freeze([hint("obj-product-line-a")]) }));
  assert.equal(result.inventsActors, false);
  assert.deepEqual([...ids(result)], ["obj-product-line-a"]);
});

test("26 — No relationship is invented as fallback", () => {
  const result = compose("OPERATIONAL_FLOW", managementGraph({ relationships: Object.freeze([]) }));
  assert.equal(result.inventsRelationships, false);
  assert.equal(result.relationships.length, 0);
});

test("27 — No Evidence is invented as fallback", () => {
  const result = compose("CAUSE_INVESTIGATION", managementGraph({ evidence: Object.freeze([]) }));
  assert.equal(result.inventsEvidence, false);
  assert.deepEqual([...result.evidenceRefs], []);
});

test("28 — DIR:1 remains single Director authority", () => {
  const result = compose("OPERATIONAL_FLOW");
  assert.equal(result.sourceDirectorIdentity, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.parallelDirector, false);
});

test("29 — Stage remains NEX-MVP:3/4 authority", () => {
  assert.equal(DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
  assert.equal(nexoraMVPObjectInteractionIdentity, "NEX-MVP:4/NexoraObjectInteraction");
});

test("30 — DTH-EXP:1–4A gates remain green", () => {
  assert.equal(verifyDthExpDirectorNexoSelectionBoundary().ok, true);
  assert.equal(verifyDthExpNexoFamilyBoundary().ok, true);
  assert.equal(dthExpDirectorNexoSelectionIdentity, "NPA-T DTH-EXP:4A/DirectorNexoSelection");
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

test("unsupported relationship and missing binding fail safely", () => {
  const missingRel = compose("OPERATIONAL_FLOW", managementGraph({ requiredRelationshipIds: Object.freeze(["rel-does-not-exist"]) }));
  assert.equal(missingRel.compositionState, "unsupported-relationship");
  const missingBinding = compose(
    "VARIABLE_LEVER",
    managementGraph({
      bindings: Object.freeze([
        Object.freeze({
          bindingId: "required-missing",
          canonicalObjectId: "obj-staffing",
          dimension: "time" as const,
          authority: "VAI:1–8",
          valueRef: "time:missing",
          required: true,
          familyRelevance: ["NEXO_IMPACT"] as const,
        }),
      ]),
    }),
  );
  assert.equal(missingBinding.compositionState, "missing-required-binding");
});

test("ambiguous 4A selection does not populate a scene", () => {
  const result = composeNexoraDirectorSceneContext({
    selection: select("UNSPECIFIED"),
    directorPlan: dirPlan(),
    graph: managementGraph(),
  });
  assert.equal(result.compositionState, "no-selection");
  assert.equal(result.actors.length, 0);
});

test("certification journey: Product Line A flow → bottleneck → cause → impact → risk", () => {
  const subject = "obj-product-line-a";
  const graph = managementGraph();
  const turns: readonly DthExpDirectorManagementNeed[] = [
    "OPERATIONAL_FLOW",
    "BOTTLENECK_LOCATION",
    "CAUSE_INVESTIGATION",
    "VARIABLE_LEVER",
    "RISK_FOCUS",
  ];
  const expectedFamilies = ["NEXO_FLOW", "NEXO_FLOW", "NEXO_CAUSE", "NEXO_IMPACT", "NEXO_RISK"] as const;
  turns.forEach((need, index) => {
    const result = compose(need, graph, subject);
    assert.equal(result.canonicalSubjectId, subject);
    assert.equal(result.selectedFamily, expectedFamilies[index]);
    assert.equal(result.compositionState, "ok");
    assert.ok(ids(result).includes(subject));
    assert.equal(result.createsCausalTruth, false);
    assert.equal(result.writesCanonicalObjects, false);
    assert.ok(result.relationships.every((item) => item.sourceAuthority === "NMI:1/relationship"));
    if (need === "BOTTLENECK_LOCATION") {
      assert.equal(ids(result).includes("obj-scenario-x"), false);
      assert.ok(ids(result).includes("obj-production"));
    }
    if (need === "CAUSE_INVESTIGATION") {
      assert.ok(result.evidenceRefs.includes("cc8:evidence:cost-rise"));
      assert.equal(result.evidenceRefs.includes("cc8:evidence:unrelated"), false);
    }
    if (need === "VARIABLE_LEVER") {
      assert.equal(result.actors.find((item) => item.canonicalObjectId === "obj-staffing")?.vaiRoleRef, "LEVER");
    }
    if (need === "RISK_FOCUS") {
      assert.ok(ids(result).includes("obj-risk-gap"));
      assert.equal(ids(result).includes("obj-project-alpha"), false);
    }
  });
});
