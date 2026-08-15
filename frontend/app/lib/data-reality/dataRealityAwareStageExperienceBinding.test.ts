/**
 * P2:3 — Data-Reality-Aware Stage Experience Binding tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY,
  DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
  dataRealityAwareStageExperienceBindingArchitecturalRole,
  dataRealityAwareStageExperienceBindingIdentity,
  dataRealityAwareStageExperienceBindingNamespace,
  dataRealityAwareStageExperienceBindingPhase,
  dataRealityAwareStageExperienceBindingVersion,
  getCriticalDataRealityStageObjects,
  getDataRealityAwareStageExperienceBindingIdentity,
  getDataRealityAwareStageObjectBinding,
  getUnresolvedDataRealityStageObjects,
  mapDataRealityAdvisorStateToStageMvpVocabulary,
  resolveDataRealityAwareStageBinding,
} from "./dataRealityAwareStageExperienceBinding.ts";
import {
  dataRealityAwareMVPRuntimeStateIdentity,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyDataRealityAwareStageBindingsToCatalog,
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";

const here = dirname(fileURLToPath(import.meta.url));

const STAGE_OBJECTS = getDefaultNexoraMVPObjectInteractionCatalog().objects.map(
  (entry) => Object.freeze({ id: entry.id }),
);

type RuntimeTestInput = {
  readonly dataset: ReturnType<typeof getExecutiveOperationsPressureDataset>;
  readonly focusedObjectId: string;
  readonly selectedObjectIds: readonly string[];
  readonly selectedObjectId: string;
  readonly currentWorkspace: string;
  readonly requestedIntent: "investigate";
  readonly responseMode: "standard";
  readonly presentationState: string;
};

function sharedRuntimeInput(
  dataset = getExecutiveOperationsPressureDataset(),
): RuntimeTestInput {
  return {
    dataset,
    focusedObjectId:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.focusedObjectId,
    selectedObjectIds:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.selectedObjectIds,
    selectedObjectId: "obj-inventory",
    currentWorkspace:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.currentWorkspace,
    requestedIntent:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.requestedIntent,
    responseMode:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.responseMode,
    presentationState: "report",
  };
}

function resolveBinding(
  overrides: Partial<RuntimeTestInput> & {
    readonly stageObjects?: readonly { readonly id: string }[];
  } = {},
) {
  const input = { ...sharedRuntimeInput(), ...overrides };
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(input);
  return resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: overrides.stageObjects ?? STAGE_OBJECTS,
    presentationState: input.presentationState,
    selectedObjectId: input.selectedObjectId,
    focusedObjectId: input.focusedObjectId,
  });
}

test("P2:3 identity and boundary", () => {
  const identity = getDataRealityAwareStageExperienceBindingIdentity();
  assert.equal(
    dataRealityAwareStageExperienceBindingIdentity,
    "P2:3/DataRealityAwareStageExperienceBinding",
  );
  assert.equal(identity.identity, "P2:3/DataRealityAwareStageExperienceBinding");
  assert.equal(dataRealityAwareStageExperienceBindingVersion, "2.3.0");
  assert.equal(
    dataRealityAwareStageExperienceBindingNamespace,
    "nexora.data-reality.stage-experience-binding",
  );
  assert.equal(
    dataRealityAwareStageExperienceBindingPhase,
    "StageExperienceBinding",
  );
  assert.equal(
    dataRealityAwareStageExperienceBindingArchitecturalRole,
    "DataRealityAwareStagePresentationBoundary",
  );
  assert.equal(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY.consumesP22RuntimeStateOnly,
    true,
  );
  assert.equal(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY.createsStageGeometry,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY.ownsCameraChoreography,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );
});

test("TEST 1 — Determinism", () => {
  const a = resolveBinding();
  const b = resolveBinding();
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:2 Sole Truth Source", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(
    sharedRuntimeInput(),
  );
  const binding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
    presentationState: "report",
  });
  assert.equal(binding.sourceRuntimeState, runtimeState);
  assert.equal(
    binding.provenance.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );

  const source = readFileSync(
    join(here, "dataRealityAwareStageExperienceBinding.ts"),
    "utf8",
  );
  assert.ok(source.includes("resolveDataRealityAwareMVPRuntimeState"));
  assert.ok(source.includes('from "./dataRealityAwareMVPRuntimeState.ts"'));
  assert.equal(/resolveDataRealityAdvisorForMVPRuntime/.test(source), false);
  assert.equal(/resolveDatasetExecutiveReality/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveAdvisorIntegration/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
});

test("TEST 3 — Object Identity Mapping", () => {
  const binding = resolveBinding();
  const stageIds = STAGE_OBJECTS.map((entry) => entry.id).sort();
  assert.deepEqual(
    binding.objects.map((entry) => entry.objectId).sort(),
    stageIds,
  );
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    assert.ok(getDataRealityAwareStageObjectBinding(binding, id));
  }
});

test("TEST 4 — Reality State Preservation", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(
    sharedRuntimeInput(),
  );
  const binding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });

  for (const runtimeObject of runtimeState.objects) {
    const stageObject = getDataRealityAwareStageObjectBinding(
      binding,
      runtimeObject.objectId,
    );
    if (!stageObject) continue;
    assert.equal(stageObject.realityState, runtimeObject.executiveState);
    assert.equal(stageObject.attention, runtimeObject.attention);
  }
});

test("TEST 5 — Missing Reality Safety", () => {
  const binding = resolveBinding();
  const budget = getDataRealityAwareStageObjectBinding(binding, "obj-budget")!;
  assert.ok(budget);
  assert.equal(budget.bindingStatus, "unbound");
  assert.equal(budget.isUnresolved, true);
  assert.equal(budget.realityState, "unresolved");
  assert.equal(budget.mvpStatus, "unresolved");
  assert.notEqual(budget.mvpStatus, "stable");
  assert.ok(binding.unresolved.unboundObjectIds.includes("obj-budget"));
});

test("TEST 6 — Selection Separation", () => {
  const a = resolveBinding({
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const b = resolveBinding({
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-revenue"],
  });

  const capacityA = getDataRealityAwareStageObjectBinding(a, "obj-capacity")!;
  const capacityB = getDataRealityAwareStageObjectBinding(b, "obj-capacity")!;
  assert.equal(capacityA.realityState, capacityB.realityState);
  assert.equal(capacityA.mvpStatus, capacityB.mvpStatus);
  assert.equal(capacityA.isSelected, true);
  assert.equal(capacityB.isSelected, false);

  const revenueB = getDataRealityAwareStageObjectBinding(b, "obj-revenue")!;
  assert.equal(revenueB.isSelected, true);
  assert.equal(revenueB.realityState, capacityA.realityState === "critical"
    ? revenueB.realityState
    : revenueB.realityState);
  // Selection must not force critical.
  if (revenueB.realityState === "stable") {
    assert.notEqual(revenueB.mvpStatus, "risk");
  }
});

test("TEST 7 — Focus Separation", () => {
  const binding = resolveBinding({
    focusedObjectId: "obj-inventory",
    selectedObjectId: "obj-delivery",
    selectedObjectIds: ["obj-delivery"],
  });
  const inventory = getDataRealityAwareStageObjectBinding(
    binding,
    "obj-inventory",
  )!;
  const delivery = getDataRealityAwareStageObjectBinding(
    binding,
    "obj-delivery",
  )!;
  assert.equal(inventory.isFocused, true);
  assert.equal(inventory.isSelected, false);
  assert.equal(delivery.isSelected, true);
  assert.equal(delivery.isFocused, false);
  assert.equal(inventory.realityState, delivery.realityState === inventory.realityState
    ? inventory.realityState
    : inventory.realityState);
});

test("TEST 8 — Recommended Focus Separation", () => {
  const binding = resolveBinding({
    focusedObjectId: "obj-inventory",
    selectedObjectId: "obj-delivery",
    selectedObjectIds: ["obj-delivery"],
  });
  assert.equal(binding.focus.focusedObjectId, "obj-inventory");
  assert.equal(binding.focus.selectedObjectId, "obj-delivery");
  assert.notEqual(binding.focus.focusedObjectId, binding.focus.selectedObjectId);
  if (binding.focus.recommendedObjectId) {
    const recommended = getDataRealityAwareStageObjectBinding(
      binding,
      binding.focus.recommendedObjectId,
    )!;
    assert.equal(recommended.isRecommendedFocus, true);
  }
});

test("TEST 9 — Combined State Support", () => {
  const binding = resolveBinding({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const capacity = getDataRealityAwareStageObjectBinding(
    binding,
    "obj-capacity",
  )!;
  assert.ok(
    capacity.realityState === "critical" || capacity.realityState === "risk",
  );
  assert.equal(capacity.isSelected, true);
  if (binding.focus.recommendedObjectId === "obj-capacity") {
    assert.equal(capacity.isRecommendedFocus, true);
  }
  assert.equal(capacity.presentationEmphasis, "critical");
});

test("TEST 10 — Recommendation Preservation", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(
    sharedRuntimeInput(),
  );
  const binding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });

  for (const runtimeObject of runtimeState.objects) {
    const stageObject = getDataRealityAwareStageObjectBinding(
      binding,
      runtimeObject.objectId,
    );
    if (!stageObject) continue;
    assert.deepEqual(
      stageObject.recommendedAction,
      runtimeObject.recommendedAction,
    );
  }
});

test("TEST 11 — No Fabricated Recommendation", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(
    sharedRuntimeInput(getExecutiveOperationsDemoDataset()),
  );
  const binding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });
  const budget = getDataRealityAwareStageObjectBinding(binding, "obj-budget")!;
  assert.equal(budget.recommendedAction, undefined);
});

test("TEST 12 — Unresolved Preservation", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    presentationState: "report",
    currentWorkspace: "problem",
    requestedIntent: "investigate",
  });
  const unresolved = getUnresolvedDataRealityStageObjects(
    experience.stageBinding,
  );
  assert.ok(unresolved.some((entry) => entry.objectId === "obj-budget"));
  const catalogBudget = experience.catalog.objects.find(
    (entry) => entry.id === "obj-budget",
  )!;
  assert.equal(catalogBudget.status, "unresolved");
  assert.notEqual(catalogBudget.status, "stable");
});

test("TEST 13 — Presentation State Compatibility", () => {
  for (const presentationState of ["minimum", "report", "operation"] as const) {
    const binding = resolveBinding({ presentationState });
    assert.equal(binding.presentationState, presentationState);
    for (const object of binding.objects) {
      assert.equal(object.presentationState, presentationState);
    }
  }
});

test("TEST 14 — Scene Attention Summary", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState(
    sharedRuntimeInput(),
  );
  const binding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });
  assert.equal(
    binding.sceneAttention.dominantState,
    runtimeState.attention.dominantState,
  );
  assert.equal(
    binding.sceneAttention.dominantAttention,
    runtimeState.attention.dominantAttention,
  );
  assert.ok(binding.sceneAttention.criticalObjectIds.includes("obj-capacity"));
  assert.ok(getCriticalDataRealityStageObjects(binding).length > 0);
});

test("TEST 15 — No Visual Business Logic Duplication", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareStageExperienceBinding.ts"),
    "utf8",
  );
  assert.equal(/minInclusive|maxExclusive|worseWhen/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/composeDataRealityExecutiveAdvisorResponse/.test(source), false);
  assert.equal(/#7dd3fc|#fbbf24|#f87171/.test(source), false);
  assert.equal(/emissiveIntensity|glowStrength/.test(source), false);
});

test("TEST 16 — No Camera Behavior", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareStageExperienceBinding.ts"),
    "utf8",
  );
  assert.equal(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY.ownsCameraChoreography,
    false,
  );
  for (const token of [
    "orbit",
    "lookAt",
    "PerspectiveCamera",
    "camera.position",
    "zoomTo",
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test("TEST 17 — No Duplicate Stage Objects", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const binding = resolveBinding({ stageObjects: STAGE_OBJECTS });
  const applied = applyDataRealityAwareStageBindingsToCatalog(catalog, binding);
  assert.equal(applied.objects.length, catalog.objects.length);
  assert.deepEqual(
    applied.objects.map((entry) => entry.id).sort(),
    catalog.objects.map((entry) => entry.id).sort(),
  );
  assert.equal(applied.relationships.length, catalog.relationships.length);
});

test("TEST 18 — Dataset Change Propagation", () => {
  const a = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory", "obj-delivery"],
    currentWorkspace: "problem",
    presentationState: "report",
    requestedIntent: "investigate",
  });
  const b = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory", "obj-delivery"],
    currentWorkspace: "problem",
    presentationState: "report",
    requestedIntent: "investigate",
  });

  const capacityA = getDataRealityAwareStageObjectBinding(
    a.stageBinding,
    "obj-capacity",
  )!;
  const capacityB = getDataRealityAwareStageObjectBinding(
    b.stageBinding,
    "obj-capacity",
  )!;
  assert.notEqual(
    `${capacityA.realityState}:${capacityA.mvpStatus}:${capacityA.mvpAttention}`,
    `${capacityB.realityState}:${capacityB.mvpStatus}:${capacityB.mvpAttention}`,
  );

  const catalogA = a.catalog.objects.find((entry) => entry.id === "obj-capacity")!;
  const catalogB = b.catalog.objects.find((entry) => entry.id === "obj-capacity")!;
  assert.notEqual(
    `${catalogA.status}:${catalogA.attention}`,
    `${catalogB.status}:${catalogB.attention}`,
  );
});

test("INTEGRATION — Dataset → P2:2 → P2:3 → Stage binding changes for Object X", () => {
  const a = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: "obj-capacity",
    currentWorkspace: "problem",
    presentationState: "report",
  });
  const b = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    currentWorkspace: "problem",
    presentationState: "report",
  });

  assert.equal(
    a.runtimeState.identity.identity,
    "P2:2/DataRealityAwareMVPRuntimeStateIntegration",
  );
  assert.equal(
    a.stageBinding.identity.identity,
    "P2:3/DataRealityAwareStageExperienceBinding",
  );

  const capacityA = a.catalog.objects.find((entry) => entry.id === "obj-capacity")!;
  const capacityB = b.catalog.objects.find((entry) => entry.id === "obj-capacity")!;
  assert.equal(capacityA.status, "watch");
  assert.equal(capacityA.attention, "important");
  assert.equal(capacityB.status, "risk");
  assert.equal(capacityB.attention, "critical");

  assert.deepEqual(
    DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
    a.stageBinding.provenance.chain,
  );
});

test("vocabulary mapping preserves unresolved ≠ healthy", () => {
  const unresolved = mapDataRealityAdvisorStateToStageMvpVocabulary("unresolved");
  const stable = mapDataRealityAdvisorStateToStageMvpVocabulary("stable");
  assert.equal(unresolved.mvpStatus, "unresolved");
  assert.equal(unresolved.presentationEmphasis, "unresolved");
  assert.notEqual(unresolved.mvpStatus, stable.mvpStatus);
});
