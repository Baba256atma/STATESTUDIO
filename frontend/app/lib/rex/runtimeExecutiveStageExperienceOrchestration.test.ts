import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY as registry,
  RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS as dispositions,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS as reasonKinds,
  RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS as transitionIntents,
  compareRuntimeExecutiveStageExperiencePlans,
  createRuntimeExecutiveStageExperiencePlan,
  getRuntimeExecutiveStageExperienceOrchestrationIdentity,
  resolveRuntimeExecutiveStageExperiencePlan,
  runtimeExecutiveStageExperienceOrchestration as module,
  runtimeExecutiveStageExperienceOrchestrationApiNames as apiNames,
  runtimeExecutiveStageExperienceOrchestrationCanonicalIdentity as canonicalIdentity,
  verifyRuntimeExecutiveStageExperienceOrchestration,
  verifyRuntimeExecutiveStageExperiencePlan,
} from "./runtimeExecutiveStageExperienceOrchestration.ts";

import {
  createRuntimeExecutiveStageModel,
  projectRuntimeExecutiveStageFocusSelection,
  projectRuntimeExecutiveStagePresentationAttention,
  resolveRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStagePresentationAttention,
  runtimeExecutiveStagePresentationAttentionIdentity,
  verifyRuntimeExecutiveStagePresentationAttention,
} from "@/app/lib/rex/runtimeExecutiveStagePresentationAttention";

import { verifyRuntimeExecutiveStageFocusSelection } from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";
import { verifyRuntimeExecutiveStageModel } from "@/app/lib/rex/runtimeExecutiveStageModel";
import {
  createRuntimeExecutiveStageSceneContract,
  verifyRuntimeExecutiveStageExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";
import {
  createRuntimeExecutiveStageConnection,
  createRuntimeExecutiveStageContext,
  createRuntimeExecutiveStageScene,
  createRuntimeExecutiveStageSubject,
  verifyRuntimeExecutiveStageExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";
import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperienceOrchestration.ts",
    import.meta.url,
  ),
  "utf8",
);

function buildNeutralModel() {
  const subjects = [
    createRuntimeExecutiveStageSubject({
      subjectId: "object.supplier",
      kind: "object",
      label: "Supplier",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.warehouse",
      kind: "object",
      label: "Warehouse",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.factory",
      kind: "object",
      label: "Factory",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "kpi.production",
      kind: "kpi",
      label: "Production KPI",
      presentationState: "minimum",
      attention: "warning",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.customer",
      kind: "object",
      label: "Customer",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.unrelated",
      kind: "object",
      label: "Unrelated Asset",
      presentationState: "minimum",
      attention: "normal",
      focusRole: "unfocused",
      selection: "unselected",
    }),
  ];

  const scene = createRuntimeExecutiveStageScene({
    sceneId: "scene.factory-expansion",
    revision: "r1",
    subjects,
    connections: [
      createRuntimeExecutiveStageConnection({
        connectionId: "conn.supplier-warehouse",
        sourceSubjectId: "object.supplier",
        targetSubjectId: "object.warehouse",
        kind: "flow",
        direction: "directed",
        state: "active",
      }),
      createRuntimeExecutiveStageConnection({
        connectionId: "conn.warehouse-factory",
        sourceSubjectId: "object.warehouse",
        targetSubjectId: "object.factory",
        kind: "dependency",
        direction: "directed",
        state: "active",
      }),
      createRuntimeExecutiveStageConnection({
        connectionId: "conn.factory-kpi",
        sourceSubjectId: "object.factory",
        targetSubjectId: "kpi.production",
        kind: "kpi-relationship",
        direction: "directed",
        state: "emphasized",
      }),
      createRuntimeExecutiveStageConnection({
        connectionId: "conn.kpi-customer",
        sourceSubjectId: "kpi.production",
        targetSubjectId: "object.customer",
        kind: "impact",
        direction: "directed",
        state: "active",
      }),
    ],
    sceneState: "active",
    context: createRuntimeExecutiveStageContext({
      contextId: "ctx.factory-expansion",
      activeSubjectId: "object.factory",
    }),
  });

  return createRuntimeExecutiveStageModel({
    modelId: "model.factory-expansion",
    sceneContract: createRuntimeExecutiveStageSceneContract({
      scene,
      source: "executive",
    }),
  });
}

function buildFactoryPlan(options?: {
  readonly planId?: string;
  readonly previousPlan?: Parameters<
    typeof createRuntimeExecutiveStageExperiencePlan
  >[0]["previousPlan"];
  readonly enableNoiseReduction?: boolean;
}) {
  return resolveRuntimeExecutiveStageExperiencePlan({
    planId: options?.planId ?? "plan.factory.focus",
    model: buildNeutralModel(),
    selectionSubjectId: "object.factory",
    source: "executive",
    previousPlan: options?.previousPlan,
    enableNoiseReduction: options?.enableNoiseReduction,
    interactionReason: "Manager focused Factory",
  });
}

test("1. exact identity / version / namespace", () => {
  assert.equal(
    module.identity,
    "REX-2:6/RuntimeExecutiveStageExperienceOrchestration",
  );
  assert.equal(module.version, "2.6.0");
  assert.equal(
    module.namespace,
    "nexora.rex.stage-experience.orchestration",
  );
  assert.equal(module.phase, "Orchestration");
  assert.equal(module.layer, "REX");
  assert.deepEqual(
    getRuntimeExecutiveStageExperienceOrchestrationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:5", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-2:5/RuntimeExecutiveStagePresentationAttention",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveStagePresentationAttentionIdentity,
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStagePresentationAttention",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStagePresentationAttention",
  ]);
});

test("3. no direct REX-2:1–2:4 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:FocusSelection|Model|ExperienceFoundation|ExperienceContracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesPresentationAttentionOnly, true);
  assert.equal(boundary.importsRex24Directly, false);
  assert.equal(boundary.importsRex23Directly, false);
});

test("4. deterministic Factory focus orchestration", () => {
  const a = buildFactoryPlan();
  const b = buildFactoryPlan();
  assert.equal(a.status, "accepted");
  assert.equal(a.primaryFocusSubjectId, "object.factory");
  assert.deepEqual([...a.selectedSubjectIds], ["object.factory"]);
  assert.ok(a.secondaryFocusSubjectIds.includes("kpi.production"));
  assert.ok(a.secondaryFocusSubjectIds.includes("object.warehouse"));
  assert.ok(a.attentionSubjectIds.includes("kpi.production"));
  assert.deepEqual(
    a.visibleSubjectIds,
    b.visibleSubjectIds,
  );
  assert.deepEqual(
    a.emphasizedConnectionIds,
    b.emphasizedConnectionIds,
  );
  assert.equal(compareRuntimeExecutiveStageExperiencePlans(a, b).identical, true);
  assert.equal(verifyRuntimeExecutiveStageExperiencePlan(a).ok, true);
});

test("5. focus / selection / attention remain distinct", () => {
  const model = buildNeutralModel();
  const focusSelection = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    focusRequest: { primaryFocusSubjectId: "kpi.production" },
    source: "director",
  });
  const focused = projectRuntimeExecutiveStageFocusSelection(
    model,
    focusSelection,
  );
  const pa = resolveRuntimeExecutiveStagePresentationAttention({
    model: focused,
    focusSelection,
    source: "director",
  });
  const projected = projectRuntimeExecutiveStagePresentationAttention(
    focused,
    pa,
    { source: "director" },
  );
  const plan = createRuntimeExecutiveStageExperiencePlan({
    planId: "plan.kpi-override",
    model: projected,
    presentationAttention: pa,
    source: "director",
  });

  assert.equal(plan.selectedSubjectIds[0], "object.factory");
  assert.equal(plan.primaryFocusSubjectId, "kpi.production");
  assert.notEqual(plan.selectedSubjectIds[0], plan.primaryFocusSubjectId);
  assert.ok(plan.attentionSubjectIds.includes("kpi.production"));
  // attention ≠ focus as concepts: factory may be selected without being primary
  const factory = plan.subjects.find((s) => s.subjectId === "object.factory")!;
  const kpi = plan.subjects.find((s) => s.subjectId === "kpi.production")!;
  assert.equal(factory.selected, true);
  assert.equal(kpi.focusRole, "primary");
  assert.notEqual(kpi.attention, kpi.focusRole);
});

test("6. noise reduction suppresses unrelated subjects; preserves relevant ones", () => {
  const plan = buildFactoryPlan({ enableNoiseReduction: true });
  assert.ok(plan.visibleSubjectIds.includes("object.factory"));
  assert.ok(plan.visibleSubjectIds.includes("kpi.production"));
  assert.ok(plan.visibleSubjectIds.includes("object.warehouse"));
  assert.ok(plan.suppressedSubjectIds.includes("object.unrelated"));
  const unrelated = plan.subjects.find(
    (s) => s.subjectId === "object.unrelated",
  )!;
  assert.equal(unrelated.stageVisible, false);
  assert.ok(unrelated.dispositions.includes("suppressed"));
  assert.ok(
    unrelated.reasons.some((reason) => reason.kind === "noise-reduction"),
  );
});

test("7. focus influences connection emphasis; ordering deterministic", () => {
  const plan = buildFactoryPlan();
  assert.ok(plan.emphasizedConnectionIds.includes("conn.factory-kpi"));
  assert.ok(plan.emphasizedConnectionIds.includes("conn.warehouse-factory"));
  assert.deepEqual(
    plan.subjects.map((s) => s.subjectId),
    [
      "object.supplier",
      "object.warehouse",
      "object.factory",
      "kpi.production",
      "object.customer",
      "object.unrelated",
    ],
  );
  assert.deepEqual(
    plan.connections.map((c) => c.connectionId),
    [
      "conn.supplier-warehouse",
      "conn.warehouse-factory",
      "conn.factory-kpi",
      "conn.kpi-customer",
    ],
  );
});

test("8. presentation states preserved; scene transition intents", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  const plan = buildFactoryPlan();
  const factory = plan.subjects.find((s) => s.subjectId === "object.factory")!;
  const kpi = plan.subjects.find((s) => s.subjectId === "kpi.production")!;
  assert.equal(factory.presentationState, "operation");
  assert.equal(kpi.presentationState, "report");
  assert.ok(["minimum", "report", "operation"].includes(plan.stagePresentationState));
  assert.ok(plan.sceneTransition.intents.includes("initial-scene"));

  const next = buildFactoryPlan({
    planId: "plan.factory.focus.2",
    previousPlan: plan,
  });
  const comparison = compareRuntimeExecutiveStageExperiencePlans(plan, next);
  assert.equal(comparison.identical, true);
  assert.ok(transitionIntents.includes("focus-change"));
  assert.ok(reasonKinds.includes("primary-focus"));
});

test("9. invalid input fails deterministically; immutability", () => {
  const model = buildNeutralModel();
  const pa = resolveRuntimeExecutiveStagePresentationAttentionFromSelectionSafe(
    model,
  );
  const invalid = createRuntimeExecutiveStageExperiencePlan({
    planId: "",
    model,
    presentationAttention: pa,
    source: "system",
  });
  assert.equal(invalid.status, "invalid");
  assert.ok(invalid.reasons.some((reason) => reason.kind === "invalid-input"));

  const plan = buildFactoryPlan();
  const subjectsRef = plan.subjects;
  compareRuntimeExecutiveStageExperiencePlans(plan, plan);
  assert.equal(plan.subjects, subjectsRef);
  assert.ok(Object.isFrozen(plan));
  assert.ok(Object.isFrozen(plan.subjects));
  assert.ok(Object.isFrozen(plan.connections));
  assert.ok(Object.isFrozen(model));
});

test("10. no renderer/UI/business-calc leakage", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\b(ReactNode|HTMLElement|document\.|window\.)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:render|animate|fetch|calculateKpi|calculateKoi)[A-Za-z0-9_]*\b/,
  );
  assert.doesNotMatch(source, /\b(Vector3|mesh|opacity|CSS|pixel|viewport)\s*[:=]/);
  assert.equal(boundary.rendersUi, false);
  assert.equal(boundary.executesAnimation, false);
  assert.equal(boundary.calculatesKpi, false);
  assert.equal(boundary.calculatesKoi, false);
  assert.equal(boundary.rendererIndependent, true);
  assert.ok(dispositions.includes("primary"));
  assert.ok(dispositions.includes("suppressed"));
  assert.ok(capabilities.includes("noise-reduction"));
});

test("11. registry counts and upstream regressions", () => {
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.reasonKindCount, reasonKinds.length);
  assert.equal(invariants.length, 23);

  const verification = verifyRuntimeExecutiveStageExperienceOrchestration();
  assert.equal(verification.ok, true);
  assert.equal(verification.presentationAttentionBoundaryIntact, true);
  assert.equal(verification.orchestrationOnly, true);

  assert.equal(verifyRuntimeExecutiveStagePresentationAttention().ok, true);
  assert.equal(verifyRuntimeExecutiveStageFocusSelection().ok, true);
  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});

function resolveRuntimeExecutiveStagePresentationAttentionFromSelectionSafe(
  model: ReturnType<typeof buildNeutralModel>,
) {
  return resolveRuntimeExecutiveStagePresentationAttention({
    model,
    focusSelection: resolveRuntimeExecutiveStageFocusSelection({
      model,
      selectionRequest: { kind: "preserve" },
      source: "system",
    }),
    source: "system",
  });
}
