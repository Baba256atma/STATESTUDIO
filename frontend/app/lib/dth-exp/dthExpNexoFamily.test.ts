/**
 * NPA-T DTH-EXP:3B — Nexo family recipe definition tests.
 * Definitions only. Shared 3A resolver. No rendering, Director selection, or DTH-EXP:4.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { dthExpSceneRecipeIdentity } from "./dthExpSceneRecipeIdentity.ts";
import { resolveDthExpSceneRecipe } from "./dthExpResolveSceneRecipe.ts";
import {
  DTH_EXP_NEXO_COMPOSITION_PREPARATION,
  DTH_EXP_NEXO_FAMILY_RESOLVER,
} from "./dthExpNexoFamilyContract.ts";
import {
  DTH_EXP_NEXO_FAMILY_BOUNDARY,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_NEXO_RECIPE_IMPLEMENTATION,
  DTH_EXP_NEXO_TIME_BOUNDARY,
  DTH_EXP_SCENE_RECIPE_BOUNDARY,
  defineNexoBarsRecipe,
  defineNexoBubbleRecipe,
  defineNexoCauseRecipe,
  defineNexoExecutionRecipe,
  defineNexoFlowRecipe,
  defineNexoImpactRecipe,
  defineNexoOutcomeRecipe,
  defineNexoRiskRecipe,
  defineNexoTimeRecipe,
  dthExpNexoFamilyIdentity,
  projectDthExpTheatreScene,
  resolveNexoFamilyRecipe,
  verifyDthExpNexoFamilyBoundary,
  verifyDthExpSceneRecipeBoundary,
} from "./dthExpPublicIndex.ts";
import type { DthExpNexoFamilyDefinition } from "./dthExpNexoFamilyContract.ts";
import type { DthExpSceneRecipeContext } from "./dthExpSceneRecipeContract.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const chain = Object.freeze({
  supplier: Object.freeze({ id: "obj-supplier-a", kind: "object", label: "Supplier A", authority: "NEX-MVP:4/catalog" }),
  production: Object.freeze({ id: "obj-production", kind: "object", label: "Production", authority: "NEX-MVP:4/catalog" }),
  productLine: Object.freeze({
    id: "obj-product-line-a",
    kind: "object",
    label: "Product Line A",
    authority: "NEX-MVP:4/catalog",
  }),
  market: Object.freeze({ id: "obj-market", kind: "object", label: "Market", authority: "NEX-MVP:4/catalog" }),
  cost: Object.freeze({ id: "obj-cost", kind: "kpi", label: "Cost", authority: "NEX-MVP:4/catalog" }),
  staffing: Object.freeze({ id: "obj-staffing", kind: "object", label: "Staffing", authority: "NEX-MVP:4/catalog" }),
  risk: Object.freeze({ id: "obj-risk-gap", kind: "risk", label: "Capacity Gap Risk", authority: "MO:1" }),
  execution: Object.freeze({ id: "obj-execution-1", kind: "execution", label: "Execute Plan", authority: "CC:11" }),
  decision: Object.freeze({ id: "obj-decision-1", kind: "decision", label: "Commit Plan", authority: "CC:10" }),
  outcome: Object.freeze({ id: "obj-outcome-1", kind: "outcome", label: "Observed Delivery", authority: "CORE-OUT" }),
  goal: Object.freeze({ id: "obj-goal-1", kind: "goal", label: "Delivery Goal", authority: "MO:1" }),
});

const flowRelationships = Object.freeze([
  Object.freeze({
    relationshipId: "rel-supplier-production",
    fromId: chain.supplier.id,
    toId: chain.production.id,
    semanticRelation: "feeds",
    sourceAuthority: "NMI:1/relationship",
    sourceRef: "nmi:src:supplier-production",
  }),
  Object.freeze({
    relationshipId: "rel-production-line",
    fromId: chain.production.id,
    toId: chain.productLine.id,
    semanticRelation: "produces",
    sourceAuthority: "NMI:1/relationship",
    sourceRef: "nmi:src:production-line",
  }),
  Object.freeze({
    relationshipId: "rel-line-market",
    fromId: chain.productLine.id,
    toId: chain.market.id,
    semanticRelation: "serves",
    sourceAuthority: "NMI:1/relationship",
    sourceRef: "nmi:src:line-market",
  }),
]);

function ctx(overrides?: Partial<DthExpSceneRecipeContext>): DthExpSceneRecipeContext {
  return Object.freeze({
    objects: overrides?.objects ?? Object.freeze(Object.values(chain)),
    relationships: overrides?.relationships ?? flowRelationships,
    availableEvidenceRefs: overrides?.availableEvidenceRefs ?? Object.freeze(["cc8:evidence:flow"]),
    availableBindingRefs: overrides?.availableBindingRefs ?? Object.freeze(["kpi:line:otd", "vai:staffing:lever", "time:line:now"]),
    theatreSceneIdentity: overrides?.theatreSceneIdentity ?? "dth:scene:chain",
  });
}

function allFamilies(): readonly DthExpNexoFamilyDefinition[] {
  return Object.freeze([
    defineNexoBubbleRecipe({
      recipeId: "nexo:bubble:projects",
      candidates: [{ canonicalObjectId: chain.productLine.id }, { canonicalObjectId: chain.market.id }],
      focalCanonicalObjectId: chain.productLine.id,
      analyticalBindings: [
        {
          bindingId: "bubble-value",
          canonicalObjectId: chain.productLine.id,
          dimension: "value",
          authority: "existing KPI observation owners",
          valueRef: "kpi:line:otd",
        },
      ],
    }),
    defineNexoBarsRecipe({
      recipeId: "nexo:bars:kpi",
      comparable: [{ canonicalObjectId: chain.productLine.id }, { canonicalObjectId: chain.cost.id }],
      focalCanonicalObjectId: chain.productLine.id,
      analyticalBindings: [
        {
          bindingId: "bar-kpi",
          canonicalObjectId: chain.productLine.id,
          dimension: "kpi-value",
          authority: "existing KPI observation owners",
          valueRef: "kpi:line:otd",
        },
      ],
    }),
    defineNexoFlowRecipe({
      recipeId: "nexo:flow:chain",
      upstream: [{ canonicalObjectId: chain.supplier.id }, { canonicalObjectId: chain.production.id }],
      focal: { canonicalObjectId: chain.productLine.id },
      downstream: [{ canonicalObjectId: chain.market.id }],
      bottleneckCanonicalObjectId: chain.production.id,
      relationships: [
        {
          requirementId: "r1",
          relationshipId: "rel-supplier-production",
          fromCanonicalObjectId: chain.supplier.id,
          toCanonicalObjectId: chain.production.id,
          required: true,
        },
        {
          requirementId: "r2",
          relationshipId: "rel-production-line",
          fromCanonicalObjectId: chain.production.id,
          toCanonicalObjectId: chain.productLine.id,
          required: true,
        },
        {
          requirementId: "r3",
          relationshipId: "rel-line-market",
          fromCanonicalObjectId: chain.productLine.id,
          toCanonicalObjectId: chain.market.id,
          required: true,
        },
      ],
    }),
    defineNexoImpactRecipe({
      recipeId: "nexo:impact:levers",
      focal: { canonicalObjectId: chain.productLine.id, vaiRoleRef: "OUTCOME" },
      variables: [{ canonicalObjectId: chain.staffing.id, vaiRoleRef: "LEVER" }],
      analyticalBindings: [
        {
          bindingId: "vai-lever",
          canonicalObjectId: chain.staffing.id,
          dimension: "vai-role",
          authority: "VAI:1–8",
          valueRef: "vai:staffing:lever",
        },
      ],
    }),
    defineNexoRiskRecipe({
      recipeId: "nexo:risk:gap",
      risks: [{ canonicalObjectId: chain.risk.id }],
      related: [{ canonicalObjectId: chain.productLine.id }],
      focalCanonicalObjectId: chain.risk.id,
      analyticalBindings: [
        {
          bindingId: "risk-severity",
          canonicalObjectId: chain.risk.id,
          dimension: "risk",
          authority: "MO:1 risk",
          valueRef: "kpi:line:otd",
          required: false,
        },
      ],
    }),
    defineNexoTimeRecipe({
      recipeId: "nexo:time:line",
      current: [{ canonicalObjectId: chain.productLine.id }],
      historical: [{ canonicalObjectId: chain.cost.id, required: false }],
      future: [{ canonicalObjectId: chain.market.id, required: false }],
      focalCanonicalObjectId: chain.productLine.id,
      analyticalBindings: [
        {
          bindingId: "time-now",
          canonicalObjectId: chain.productLine.id,
          dimension: "time",
          authority: "existing KPI observation owners",
          valueRef: "time:line:now",
        },
      ],
    }),
    defineNexoCauseRecipe({
      recipeId: "nexo:cause:cost",
      focal: { canonicalObjectId: chain.productLine.id },
      candidateCauses: [{ canonicalObjectId: chain.cost.id, evidenceRefs: ["cc8:evidence:flow"] }],
      relationships: [
        {
          requirementId: "cause-rel",
          relationshipId: null,
          fromCanonicalObjectId: chain.cost.id,
          toCanonicalObjectId: chain.productLine.id,
          required: false,
        },
      ],
      evidenceRequirements: [
        {
          requirementId: "cause-ev",
          evidenceRef: "cc8:evidence:flow",
          attachedToKind: "object",
          attachedToId: chain.cost.id,
          required: false,
        },
      ],
    }),
    defineNexoExecutionRecipe({
      recipeId: "nexo:execution:plan",
      decision: { canonicalObjectId: chain.decision.id },
      execution: { canonicalObjectId: chain.execution.id },
      analyticalBindings: [
        {
          bindingId: "exec-progress",
          canonicalObjectId: chain.execution.id,
          dimension: "execution-progress",
          authority: "CC:11",
          valueRef: "kpi:line:otd",
          required: false,
        },
      ],
    }),
    defineNexoOutcomeRecipe({
      recipeId: "nexo:outcome:delivery",
      goal: { canonicalObjectId: chain.goal.id },
      observed: { canonicalObjectId: chain.outcome.id },
      analyticalBindings: [
        {
          bindingId: "outcome-vs-goal",
          canonicalObjectId: chain.outcome.id,
          dimension: "outcome-vs-goal",
          authority: "CORE-OUT",
          valueRef: "kpi:line:otd",
          required: false,
        },
      ],
    }),
  ]);
}

test("DTH-EXP:3B identity and boundary", () => {
  assert.equal(dthExpNexoFamilyIdentity, "NPA-T DTH-EXP:3B/NexoFamilyRecipes");
  assert.equal(verifyDthExpNexoFamilyBoundary().ok, true);
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.startsDthExp4, false);
  assert.equal(DTH_EXP_SCENE_RECIPE_BOUNDARY.startsDthExp3B, false);
  assert.equal(DTH_EXP_NEXO_COMPOSITION_PREPARATION.multiNexoScenesImplemented, false);
});

test("1 — All nine Nexo family definitions use DTH-EXP:3A recipes", () => {
  const families = allFamilies();
  assert.equal(families.length, 9);
  assert.deepEqual(
    families.map((item) => item.family).sort(),
    [...DTH_EXP_NEXO_RECIPE_FAMILIES].sort(),
  );
  for (const family of families) {
    assert.equal(family.recipe.identity, dthExpSceneRecipeIdentity);
    assert.equal(family.recipe.family, family.family);
    assert.equal(family.recipe.compositionMetadata.composer, "DTH-EXP:3A/SceneRecipeResolver");
    assert.equal(family.recipe.nexoFamilyRecipeImplemented, false);
  }
});

test("2 — No family introduces a second recipe engine", () => {
  for (const family of allFamilies()) {
    assert.equal(family.parallelEngine, false);
    assert.equal(family.resolver, resolveDthExpSceneRecipe);
  }
  assert.equal(DTH_EXP_NEXO_FAMILY_RESOLVER, resolveDthExpSceneRecipe);
  assert.ok(Object.values(DTH_EXP_NEXO_RECIPE_IMPLEMENTATION).every((item) => item === false));
});

test("3 — NexoBubble resolves candidate Objects without ranking them", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_BUBBLE");
  assert.ok(definition);
  assert.equal(definition?.ranksCandidates, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.projectionStatus, "ok");
  assert.ok(resolved.scene.actors.every((item) => item.visualRole === "bubble"));
  assert.equal("ranked" in resolved.scene, false);
  assert.equal("recommendation" in resolved.scene, false);
});

test("4 — NexoBars consumes authoritative values without recalculating truth", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_BARS");
  assert.equal(definition?.calculatesKpi, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.analyticalBindings[0]?.calculatedByRecipe, false);
  assert.equal(resolved.analyticalBindings[0]?.authority, "existing KPI observation owners");
  assert.ok(resolved.scene.actors.every((item) => item.visualRole === "bar"));
});

test("5 — NexoFlow preserves existing directional relationships", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_FLOW");
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.projectionStatus, "ok");
  assert.equal(resolved.scene.relationships.length, 3);
  assert.ok(resolved.scene.relationships.every((item) => item.sourceAuthority === "NMI:1/relationship"));
  assert.ok(resolved.scene.relationships.every((item) => item.impliesCausality === false));
  assert.ok(resolved.scene.actors.every((item) => item.visualRole === "flow-node"));
});

test("6 — NexoFlow can represent a bottleneck condition without creating NexoBottleneck", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_FLOW");
  assert.equal(definition?.bottleneckIsNexoFamily, false);
  assert.equal(definition?.bottleneckCanonicalObjectId, chain.production.id);
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.bottleneckFamily, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(
    resolved.scene.actors.find((item) => item.canonicalObjectId === chain.production.id)?.attention,
    "emphasized",
  );
  assert.equal((DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes("NEXO_BOTTLENECK"), false);
});

test("7 — NexoImpact consumes VAI roles without redefining them", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_IMPACT");
  assert.equal(definition?.consumesVai, true);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  const lever = resolved.scene.actors.find((item) => item.canonicalObjectId === chain.staffing.id);
  assert.equal(lever?.vaiRoleRef, "LEVER");
  assert.equal(lever?.visualRole, "impact-node");
  assert.equal(lever?.visualRoleMutatesVaiRole, false);
  assert.equal(resolved.analyticalBindings[0]?.calculatedByRecipe, false);
});

test("8 — NexoRisk consumes existing Risk truth", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_RISK");
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  const risk = resolved.scene.actors.find((item) => item.canonicalObjectId === chain.risk.id);
  assert.equal(risk?.canonicalObjectKind, "risk");
  assert.equal(risk?.objectAuthority, "MO:1");
  assert.equal(risk?.visualRole, "risk-marker");
  assert.equal(definition?.isBusinessTruthAuthority, false);
});

test("9 — NexoTime uses time references without creating Timeline authority", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_TIME");
  assert.equal(definition?.parallelTimelineAuthority, false);
  assert.equal(definition?.timelineIsNexoTimeTechnique, true);
  assert.equal(DTH_EXP_NEXO_TIME_BOUNDARY.parallelTimelineTheatreSystem, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.nexoTimeParallelTimeline, false);
  assert.equal(resolved.scene.actors.find((item) => item.canonicalObjectId === chain.productLine.id)?.visualRole, "time-point");
  assert.equal(resolved.analyticalBindings[0]?.dimension, "time");
});

test("10 — NexoCause preserves causal/evidence safety", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_CAUSE");
  assert.equal(definition?.convertsCorrelationToCause, false);
  assert.equal(definition?.candidateMeansConfirmedCause, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.ok(resolved.scene.relationships.every((item) => item.impliesCausality === false));
  assert.ok(resolved.scene.relationships.every((item) => item.manufacturedCausalTruth === false));
  assert.equal(resolved.scene.evidenceAttachments[0]?.copiesEvidence, false);
});

test("11 — NexoExecution remains read-only over Execution authority", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_EXECUTION");
  assert.equal(definition?.writesExecution, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.scene.writes.executionState, false);
  assert.equal(resolved.scene.actors.find((item) => item.canonicalObjectId === chain.execution.id)?.objectAuthority, "CC:11");
});

test("12 — NexoOutcome remains read-only over Outcome/Learning authority", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_OUTCOME");
  assert.equal(definition?.writesOutcome, false);
  assert.equal(definition?.writesLearning, false);
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.equal(resolved.scene.writes.outcome, false);
  assert.equal(resolved.scene.writes.learning, false);
  assert.equal(resolved.scene.actors.find((item) => item.canonicalObjectId === chain.outcome.id)?.objectAuthority, "CORE-OUT");
});

test("13 — Evidence remains references", () => {
  const definition = allFamilies().find((item) => item.family === "NEXO_CAUSE");
  const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
  assert.ok(resolved.scene.evidenceAttachments.every((item) => item.authority === "CC:8"));
  assert.ok(resolved.scene.evidenceAttachments.every((item) => item.copiesEvidence === false));
});

test("14 — Same Object identity survives across multiple Nexo families", () => {
  const expected = Object.freeze({
    NEXO_FLOW: "flow-node",
    NEXO_BARS: "bar",
    NEXO_BUBBLE: "bubble",
    NEXO_CAUSE: "cause-node",
    NEXO_IMPACT: "impact-node",
    NEXO_TIME: "time-point",
  } as const);
  for (const [family, visualRole] of Object.entries(expected)) {
    const definition = allFamilies().find((item) => item.family === family);
    const resolved = resolveNexoFamilyRecipe({ definition: definition!, context: ctx() });
    const actor = resolved.scene.actors.find((item) => item.canonicalObjectId === chain.productLine.id);
    assert.equal(actor?.canonicalObjectId, chain.productLine.id);
    assert.equal(actor?.isCanonicalObjectDuplicate, false);
    assert.equal(actor?.visualRole, visualRole);
  }
});

test("15 — Family definitions do not mutate canonical Objects", () => {
  const before = JSON.stringify(chain.productLine);
  for (const family of allFamilies()) {
    resolveNexoFamilyRecipe({ definition: family, context: ctx() });
  }
  assert.equal(JSON.stringify(chain.productLine), before);
  assert.equal("visualType" in chain.productLine, false);
});

test("16 — Director authority remains unchanged", () => {
  const resolved = resolveNexoFamilyRecipe({
    definition: allFamilies()[0]!,
    context: ctx(),
  });
  assert.equal(resolved.automaticDirectorSelection, false);
  assert.equal(resolved.scene.directorComposition.authority, nexoraSemanticPresentationDirectorIdentity);
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.director, "DIR:1");
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.automaticDirectorSelection, false);
});

test("17 — Stage authority remains unchanged", () => {
  const resolved = resolveNexoFamilyRecipe({
    definition: allFamilies()[2]!,
    context: ctx(),
  });
  assert.equal(resolved.scene.secondStage, false);
  assert.equal(resolved.scene.stageHost, "NEX-MVP:3/Nexora3DExecutiveStage");
  assert.equal(DTH_EXP_NEXO_FAMILY_BOUNDARY.stage, "NEX-MVP:3 / NEX-MVP:4");
});

test("18 — No Nexo family becomes business truth authority", () => {
  for (const family of allFamilies()) {
    assert.equal(family.isBusinessTruthAuthority, false);
    assert.equal(family.recipe.copiesManagementTruth, false);
  }
});

test("19 — Missing required authoritative inputs fail safely", () => {
  const definition = defineNexoFlowRecipe({
    recipeId: "nexo:flow:missing",
    upstream: [{ canonicalObjectId: "obj-missing-supplier" }],
    focal: { canonicalObjectId: chain.productLine.id },
    downstream: [{ canonicalObjectId: chain.market.id }],
  });
  const resolved = resolveNexoFamilyRecipe({ definition, context: ctx() });
  assert.equal(resolved.projectionStatus, "failed");
  assert.equal(resolved.scene.actors.length, 0);
});

test("20 — Optional information degrades safely", () => {
  const definition = defineNexoTimeRecipe({
    recipeId: "nexo:time:optional",
    current: [{ canonicalObjectId: chain.productLine.id }],
    future: [{ canonicalObjectId: "obj-forecast-missing", required: false }],
    focalCanonicalObjectId: chain.productLine.id,
  });
  const resolved = resolveNexoFamilyRecipe({ definition, context: ctx() });
  assert.notEqual(resolved.projectionStatus, "failed");
  assert.ok(resolved.limitations.some((item) => item.startsWith("omitted-optional-actor:")));
  assert.equal(resolved.scene.actors.some((item) => item.canonicalObjectId === "obj-forecast-missing"), false);
});

test("21 — DTH-EXP:1–3A gates remain green", () => {
  assert.equal(verifyDthExpSceneRecipeBoundary().ok, true);
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
  const scene = projectDthExpTheatreScene({ theatre, visualRolesByCanonicalObjectId: { "obj-revenue": "bar" } });
  assert.equal(scene.recipeRef, null);
  const generic = resolveDthExpSceneRecipe({
    recipe: defineNexoBarsRecipe({
      recipeId: "nexo:bars:compat",
      comparable: [{ canonicalObjectId: "obj-revenue" }],
    }).recipe,
    context: {
      objects: Object.freeze([{ id: "obj-revenue", kind: "object", label: "Revenue" }]),
    },
  });
  assert.equal(generic.scene.identity, "NPA-T DTH-EXP:1/TheatreFoundation");
});

test("cross-family identity: Supplier → Production → Product Line A → Market", () => {
  const flow = allFamilies().find((item) => item.family === "NEXO_FLOW")!;
  const cause = allFamilies().find((item) => item.family === "NEXO_CAUSE")!;
  const impact = allFamilies().find((item) => item.family === "NEXO_IMPACT")!;
  const time = allFamilies().find((item) => item.family === "NEXO_TIME")!;
  const flowScene = resolveNexoFamilyRecipe({ definition: flow, context: ctx() }).scene;
  assert.deepEqual(
    [...flowScene.participatingCanonicalObjectIds].sort(),
    [chain.market.id, chain.productLine.id, chain.production.id, chain.supplier.id].sort(),
  );
  for (const family of [cause, impact, time]) {
    const resolved = resolveNexoFamilyRecipe({ definition: family, context: ctx() });
    const line = resolved.scene.actors.find((item) => item.canonicalObjectId === chain.productLine.id);
    assert.equal(line?.canonicalObjectId, chain.productLine.id);
    assert.equal(line?.isCanonicalObjectDuplicate, false);
    assert.equal(resolved.scene.writes.vaiRoles, false);
    assert.equal(resolved.scene.writes.evidence, false);
  }
  assert.ok(flowScene.relationships.every((item) => item.sourceRef.startsWith("nmi:src:")));
});
