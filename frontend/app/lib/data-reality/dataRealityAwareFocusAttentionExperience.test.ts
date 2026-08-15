/**
 * P2:5 — Data-Reality-Aware Focus & Attention Experience tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY,
  DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_PROVENANCE_CHAIN,
  dataRealityAwareFocusAttentionExperienceArchitecturalRole,
  dataRealityAwareFocusAttentionExperienceIdentity,
  dataRealityAwareFocusAttentionExperienceNamespace,
  dataRealityAwareFocusAttentionExperiencePhase,
  dataRealityAwareFocusAttentionExperienceVersion,
  getDataRealityAwareAttentionObjectState,
  getDataRealityAwareCompetingAttention,
  getDataRealityAwareCriticalAttentionObjects,
  getDataRealityAwareFocusAttentionExperienceIdentity,
  getDataRealityAwarePrimaryFocus,
  resolveDataRealityAwareFocusAttentionExperience,
  resolveDataRealityAwarePrimaryFocusObjectId,
} from "./dataRealityAwareFocusAttentionExperience.ts";
import {
  dataRealityAwareMVPRuntimeStateIdentity,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import {
  getDataRealityAwareStageObjectBinding,
  resolveDataRealityAwareStageBinding,
} from "./dataRealityAwareStageExperienceBinding.ts";
import {
  getDataRealityAwareAdvisorSubject,
  resolveDataRealityAwareAdvisorBinding,
} from "./dataRealityAwareAdvisorExperienceBinding.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "../nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience.ts";
import {
  applyDataRealityAwareFocusAttentionToStagePresentation,
  resolveNexoraMVPDataRealityAwareFocusAttentionExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareFocusAttentionExperience.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

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

function resolveRuntime(overrides: Partial<RuntimeTestInput> = {}) {
  return resolveDataRealityAwareMVPRuntimeState({
    ...sharedRuntimeInput(),
    ...overrides,
  });
}

function resolveFocus(overrides: Partial<RuntimeTestInput> & {
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
} = {}) {
  const runtimeState = resolveRuntime(overrides);
  return resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId:
      overrides.focusedObjectId ?? runtimeState.focus.focusedObjectId,
    selectedObjectId:
      overrides.selectedObjectId ?? runtimeState.focus.selectedObjectId,
    presentationState: overrides.presentationState ?? "report",
    workspace: overrides.currentWorkspace,
  });
}

test("P2:5 identity and boundary", () => {
  const identity = getDataRealityAwareFocusAttentionExperienceIdentity();
  assert.equal(
    dataRealityAwareFocusAttentionExperienceIdentity,
    "P2:5/DataRealityAwareFocusAttentionExperienceIntegration",
  );
  assert.equal(
    identity.identity,
    "P2:5/DataRealityAwareFocusAttentionExperienceIntegration",
  );
  assert.equal(dataRealityAwareFocusAttentionExperienceVersion, "2.5.0");
  assert.equal(
    dataRealityAwareFocusAttentionExperienceNamespace,
    "nexora.data-reality.focus-attention-experience",
  );
  assert.equal(
    dataRealityAwareFocusAttentionExperiencePhase,
    "FocusAttentionExperienceIntegration",
  );
  assert.equal(
    dataRealityAwareFocusAttentionExperienceArchitecturalRole,
    "DataRealityAwareExecutiveAttentionBoundary",
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.ownsCameraChoreography,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.repositionsGeometry,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.inventsSeverityScores,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );
});

test("TEST 1 — Determinism", () => {
  const a = resolveFocus();
  const b = resolveFocus();
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:2 Sole Truth Source", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  assert.equal(result.sourceRuntimeState, runtimeState);
  assert.equal(
    result.provenance.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );

  const source = readFileSync(
    join(here, "dataRealityAwareFocusAttentionExperience.ts"),
    "utf8",
  );
  assert.ok(source.includes('from "./dataRealityAwareMVPRuntimeState.ts"'));
  assert.equal(/dataRealityAwareStageExperienceBinding/.test(source), false);
  assert.equal(/dataRealityAwareAdvisorExperienceBinding/.test(source), false);
  assert.equal(/resolveDataRealityAdvisorForMVPRuntime/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
});

test("TEST 3 — Object Identity Preservation", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  assert.deepEqual(
    result.objectStates.map((entry) => entry.objectId).sort(),
    runtimeState.objects.map((entry) => entry.objectId).sort(),
  );
});

test("TEST 4 — Attention Preservation", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  for (const object of runtimeState.objects) {
    const state = getDataRealityAwareAttentionObjectState(
      result,
      object.objectId,
    )!;
    assert.equal(state.attention, object.attention);
    assert.equal(state.executiveState, object.executiveState);
  }
});

test("TEST 5 — Selection Separation", () => {
  const a = resolveFocus({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const b = resolveFocus({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-revenue",
    selectedObjectIds: ["obj-revenue"],
  });
  const capacityA = getDataRealityAwareAttentionObjectState(a, "obj-capacity")!;
  const capacityB = getDataRealityAwareAttentionObjectState(b, "obj-capacity")!;
  assert.equal(capacityA.executiveState, capacityB.executiveState);
  assert.equal(capacityA.attention, capacityB.attention);
  assert.equal(capacityA.isSelected, true);
  assert.equal(capacityB.isSelected, false);
});

test("TEST 6 — Focus Separation", () => {
  const result = resolveFocus({
    focusedObjectId: "obj-inventory",
    selectedObjectId: "obj-delivery",
    selectedObjectIds: ["obj-delivery"],
  });
  assert.equal(result.runtimeFocus, "obj-inventory");
  assert.equal(result.selectedFocus, "obj-delivery");
  assert.notEqual(result.runtimeFocus, result.selectedFocus);
  assert.equal(result.primaryFocus, "obj-inventory");
});

test("TEST 7 — Recommended Focus Preservation", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  assert.equal(
    result.recommendedFocus,
    runtimeState.focus.recommendedObjectId,
  );
});

test("TEST 8 — No Fabricated Recommendation", () => {
  const runtimeState = resolveRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(
    result.recommendedFocus,
    runtimeState.focus.recommendedObjectId,
  );
  if (runtimeState.focus.recommendedObjectId === undefined) {
    assert.equal(result.recommendedFocus, undefined);
  }
});

test("TEST 9 — Primary Focus Precedence", () => {
  const runtimeState = resolveRuntime({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  assert.equal(
    resolveDataRealityAwarePrimaryFocusObjectId(
      runtimeState,
      "obj-revenue",
      "obj-inventory",
    ),
    "obj-inventory",
  );
  // Explicit selectedObjectId beats stale runtime focus when focused param is absent.
  assert.equal(
    resolveDataRealityAwarePrimaryFocusObjectId(
      runtimeState,
      "obj-revenue",
      undefined,
    ),
    "obj-revenue",
  );
  const focusedRevenue = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-capacity",
  });
  assert.equal(getDataRealityAwarePrimaryFocus(focusedRevenue), "obj-revenue");
});

test("TEST 10 — Critical Non-Focused Object", () => {
  const result = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
    selectedObjectIds: ["obj-revenue"],
  });
  const capacity = getDataRealityAwareAttentionObjectState(
    result,
    "obj-capacity",
  )!;
  assert.equal(capacity.isCritical, true);
  assert.equal(capacity.isPrimaryFocus, false);
  assert.ok(result.criticalObjects.includes("obj-capacity"));
  assert.ok(
    result.presentationGuidance.retainAttentionObjectIds.includes(
      "obj-capacity",
    ),
  );
});

test("TEST 11 — Selected Normal vs Critical Recommended", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const revenue = getDataRealityAwareAttentionObjectState(
    result,
    "obj-revenue",
  )!;
  const capacity = getDataRealityAwareAttentionObjectState(
    result,
    "obj-capacity",
  )!;
  assert.equal(result.primaryFocus, "obj-revenue");
  assert.ok(
    revenue.executiveState === "stable" ||
      revenue.executiveState === "watch" ||
      revenue.executiveState === "opportunity",
  );
  assert.equal(capacity.isCritical, true);
  if (runtimeState.focus.recommendedObjectId === "obj-capacity") {
    assert.equal(result.recommendedFocus, "obj-capacity");
    assert.equal(capacity.isRecommendedFocus, true);
  }
});

test("TEST 12 — Unresolved Preservation", () => {
  const result = resolveFocus({
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const cost = getDataRealityAwareAttentionObjectState(result, "cost")!;
  assert.equal(cost.isUnresolved, true);
  assert.equal(cost.executiveState, "unresolved");
  assert.ok(result.unresolvedObjects.includes("cost"));
  assert.notEqual(cost.focusRole, "background");
});

test("TEST 13 — No Severity Fabrication", () => {
  const result = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
    selectedObjectIds: ["obj-revenue"],
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const revenue = getDataRealityAwareAttentionObjectState(
    result,
    "obj-revenue",
  )!;
  assert.equal(revenue.isCritical, revenue.executiveState === "critical");
  assert.equal(revenue.isPrimaryFocus, true);
  if (revenue.executiveState === "stable") {
    assert.equal(revenue.isCritical, false);
  }
  const cost = getDataRealityAwareAttentionObjectState(result, "cost")!;
  assert.equal(cost.isCritical, false);
  assert.equal(cost.isUnresolved, true);
});

test("TEST 14 — Competing Attention", () => {
  const runtimeState = resolveRuntime();
  const result = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const competing = getDataRealityAwareCompetingAttention(result);
  assert.equal(result.primaryFocus, "obj-revenue");
  assert.equal(competing.hasCompetingAttention, true);
  assert.ok(competing.competingObjectIds.includes("obj-capacity"));
  assert.ok(getDataRealityAwareCriticalAttentionObjects(result).length > 0);
});

test("TEST 15 — Foreground Guidance", () => {
  const result = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
    selectedObjectIds: ["obj-revenue"],
  });
  const revenue = getDataRealityAwareAttentionObjectState(
    result,
    "obj-revenue",
  )!;
  const capacity = getDataRealityAwareAttentionObjectState(
    result,
    "obj-capacity",
  )!;
  assert.equal(revenue.shouldForeground, true);
  assert.equal(capacity.shouldForeground, false);
  assert.equal(capacity.executiveState, "critical");
  assert.equal(capacity.shouldDeemphasize, false);
});

test("TEST 16 — No Camera Logic", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareFocusAttentionExperience.ts"),
    "utf8",
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.ownsCameraChoreography,
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

test("TEST 17 — No Geometry Logic", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareFocusAttentionExperience.ts"),
    "utf8",
  );
  assert.equal(
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY.repositionsGeometry,
    false,
  );
  for (const token of [
    "targetPosition",
    "overviewPosition",
    "BoxGeometry",
    "SphereGeometry",
    "repositionObject",
    "pullTowardCenter",
  ]) {
    assert.equal(source.includes(token), false, token);
  }
});

test("TEST 18 — No Business Ranking Duplication", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareFocusAttentionExperience.ts"),
    "utf8",
  );
  assert.equal(/minInclusive|maxExclusive|worseWhen/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/severityScore|weightedSeverity|criticalityFormula/.test(source), false);
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
});

test("TEST 19 — Stage ↔ Focus Reality Consistency", () => {
  const runtimeState = resolveRuntime();
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });
  const focus = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    const stageObject = getDataRealityAwareStageObjectBinding(stage, id)!;
    const focusObject = getDataRealityAwareAttentionObjectState(focus, id)!;
    assert.equal(stageObject.realityState, focusObject.executiveState);
    assert.equal(stageObject.attention, focusObject.attention);
  }
});

test("TEST 20 — Advisor ↔ Focus Recommendation Consistency", () => {
  const runtimeState = resolveRuntime();
  const advisor = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  const focus = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
  });
  assert.equal(
    focus.recommendedFocus,
    advisor.focus.recommendedObjectId,
  );
  assert.equal(
    focus.recommendedFocus,
    runtimeState.focus.recommendedObjectId,
  );
});

test("TEST 21 — Selection Consistency across Stage/Advisor/Focus", () => {
  const runtimeState = resolveRuntime({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
  });
  const advisor = resolveDataRealityAwareAdvisorBinding({
    runtimeState,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
  });
  const focus = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
  });

  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-capacity")!.isSelected,
    true,
  );
  assert.equal(
    getDataRealityAwareAdvisorSubject(advisor, "obj-capacity")!.isSelected,
    true,
  );
  assert.equal(
    getDataRealityAwareAttentionObjectState(focus, "obj-capacity")!.isSelected,
    true,
  );
  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-capacity")!.realityState,
    getDataRealityAwareAttentionObjectState(focus, "obj-capacity")!
      .executiveState,
  );
});

test("E2E — Competing attention: Revenue selected, Capacity critical+recommended", () => {
  // Shared P2:2 snapshot where Advisor recommends Capacity (critical under pressure).
  // Presentation then explores Revenue without re-resolving recommended focus.
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    currentWorkspace: "problem",
    presentationState: "report",
  });
  assert.equal(shared.runtimeState.focus.recommendedObjectId, "obj-capacity");

  const stage = resolveDataRealityAwareStageBinding({
    runtimeState: shared.runtimeState,
    stageObjects: STAGE_OBJECTS,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const advisor = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
    presentationState: "report",
  });

  const stageCapacity = getDataRealityAwareStageObjectBinding(
    stage,
    "obj-capacity",
  )!;
  const stageRevenue = getDataRealityAwareStageObjectBinding(
    stage,
    "obj-revenue",
  )!;
  assert.equal(stageRevenue.isSelected, true);
  assert.equal(stageCapacity.realityState, "critical");
  assert.equal(stageCapacity.isSelected, false);

  assert.equal(advisor.advisorBinding.primarySubject?.objectId, "obj-revenue");
  assert.equal(
    advisor.advisorBinding.focus.recommendedObjectId,
    "obj-capacity",
  );
  const advisorCapacity = getDataRealityAwareAdvisorSubject(
    advisor.advisorBinding,
    "obj-capacity",
  )!;
  assert.equal(advisorCapacity.executiveState, "critical");

  assert.equal(focus.focusAttention.primaryFocus, "obj-revenue");
  assert.equal(focus.focusAttention.recommendedFocus, "obj-capacity");
  assert.equal(focus.focusAttention.selectedFocus, "obj-revenue");
  assert.equal(focus.focusAttention.runtimeFocus, "obj-revenue");
  const focusCapacity = getDataRealityAwareAttentionObjectState(
    focus.focusAttention,
    "obj-capacity",
  )!;
  assert.equal(focusCapacity.isCritical, true);
  assert.equal(focusCapacity.isRecommendedFocus, true);
  assert.equal(focusCapacity.isPrimaryFocus, false);
  assert.equal(focus.focusAttention.sceneAttention.hasCompetingAttention, true);
  assert.deepEqual(
    focus.focusAttention.provenance.chain,
    DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_PROVENANCE_CHAIN,
  );
});

test("Dataset A/B — Capacity attention semantics change", () => {
  const a = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: resolveNexoraMVPDataRealityAwareStageExperience({
      datasetScenario: "baseline",
      focusedObjectId: "obj-capacity",
      presentationState: "report",
    }).runtimeState,
    focusedObjectId: "obj-capacity",
  });
  const b = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: resolveNexoraMVPDataRealityAwareStageExperience({
      datasetScenario: "operational-pressure",
      focusedObjectId: "obj-capacity",
      presentationState: "report",
    }).runtimeState,
    focusedObjectId: "obj-capacity",
  });

  const capacityA = getDataRealityAwareAttentionObjectState(
    a.focusAttention,
    "obj-capacity",
  )!;
  const capacityB = getDataRealityAwareAttentionObjectState(
    b.focusAttention,
    "obj-capacity",
  )!;
  assert.equal(capacityA.objectId, capacityB.objectId);
  assert.notEqual(
    `${capacityA.executiveState}:${capacityA.attention}:${capacityA.isCritical}`,
    `${capacityB.executiveState}:${capacityB.attention}:${capacityB.isCritical}`,
  );
  assert.equal(capacityB.isCritical, true);
});

test("Stage apply retains critical attention without geometry change", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
  });
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(
    interaction,
    "obj-revenue",
    experience.catalog,
  );
  const base = deriveNexoraMVPStageInteractionPresentation(
    interaction,
    experience.catalog,
  );
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const applied = applyDataRealityAwareFocusAttentionToStagePresentation(
    base,
    focus.focusAttention,
  );

  const capacityBefore = base.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const capacityAfter = applied.scene.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  assert.deepEqual(capacityAfter.targetPosition, capacityBefore.targetPosition);
  assert.equal(capacityAfter.role, capacityBefore.role);
  if (capacityBefore.role === "unrelated") {
    assert.ok(capacityAfter.opacity >= capacityBefore.opacity);
    assert.ok(capacityAfter.emissiveIntensity >= capacityBefore.emissiveIntensity);
  }
});
