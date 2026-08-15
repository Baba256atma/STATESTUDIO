/**
 * P2:4 — Data-Reality-Aware Advisor Experience Binding tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY,
  DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
  dataRealityAwareAdvisorExperienceBindingArchitecturalRole,
  dataRealityAwareAdvisorExperienceBindingIdentity,
  dataRealityAwareAdvisorExperienceBindingNamespace,
  dataRealityAwareAdvisorExperienceBindingPhase,
  dataRealityAwareAdvisorExperienceBindingVersion,
  getDataRealityAwareAdvisorExperienceBindingIdentity,
  getDataRealityAwareAdvisorPrimarySubject,
  getDataRealityAwareAdvisorRecommendations,
  getDataRealityAwareAdvisorSubject,
  getDataRealityAwareAdvisorUnresolvedSubjects,
  resolveDataRealityAwareAdvisorBinding,
  resolveDataRealityAwareAdvisorPrimarySubjectId,
} from "./dataRealityAwareAdvisorExperienceBinding.ts";
import {
  dataRealityAwareMVPRuntimeStateIdentity,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import {
  getDataRealityAwareStageObjectBinding,
  resolveDataRealityAwareStageBinding,
} from "./dataRealityAwareStageExperienceBinding.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import {
  applyDataRealityAwareAdvisorBindingToAdvisorViewModel,
  resolveNexoraMVPDataRealityAwareAdvisorExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience.ts";
import type { NexoraMVPAdvisorViewModel } from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";

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

function resolveAdvisor(overrides: Partial<RuntimeTestInput> = {}) {
  const runtimeState = resolveRuntime(overrides);
  return resolveDataRealityAwareAdvisorBinding({
    runtimeState,
    presentationState: overrides.presentationState ?? "report",
    selectedObjectId:
      overrides.selectedObjectId ?? runtimeState.focus.selectedObjectId,
    focusedObjectId:
      overrides.focusedObjectId ?? runtimeState.focus.focusedObjectId,
    workspace: overrides.currentWorkspace ?? runtimeState.context.workspace,
  });
}

test("P2:4 identity and boundary", () => {
  const identity = getDataRealityAwareAdvisorExperienceBindingIdentity();
  assert.equal(
    dataRealityAwareAdvisorExperienceBindingIdentity,
    "P2:4/DataRealityAwareAdvisorExperienceBinding",
  );
  assert.equal(
    identity.identity,
    "P2:4/DataRealityAwareAdvisorExperienceBinding",
  );
  assert.equal(dataRealityAwareAdvisorExperienceBindingVersion, "2.4.0");
  assert.equal(
    dataRealityAwareAdvisorExperienceBindingNamespace,
    "nexora.data-reality.advisor-experience-binding",
  );
  assert.equal(
    dataRealityAwareAdvisorExperienceBindingPhase,
    "AdvisorExperienceBinding",
  );
  assert.equal(
    dataRealityAwareAdvisorExperienceBindingArchitecturalRole,
    "DataRealityAwareAdvisorPresentationBoundary",
  );
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY.consumesP22RuntimeStateOnly,
    true,
  );
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY.usesStagePresentationAsTruth,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY.usesGenerativeAi,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );
});

test("TEST 1 — Determinism", () => {
  const a = resolveAdvisor();
  const b = resolveAdvisor();
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:2 Sole Truth Source", () => {
  const runtimeState = resolveRuntime();
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  assert.equal(binding.sourceRuntimeState, runtimeState);
  assert.equal(
    binding.provenance.immediateRuntimeSource,
    dataRealityAwareMVPRuntimeStateIdentity,
  );

  const source = readFileSync(
    join(here, "dataRealityAwareAdvisorExperienceBinding.ts"),
    "utf8",
  );
  assert.ok(source.includes('from "./dataRealityAwareMVPRuntimeState.ts"'));
  assert.equal(/dataRealityAwareStageExperienceBinding/.test(source), false);
  assert.equal(/resolveDataRealityAdvisorForMVPRuntime/.test(source), false);
  assert.equal(/resolveDatasetExecutiveReality/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
});

test("TEST 3 — Dataset Reality Propagation", () => {
  const a = resolveAdvisor({ dataset: getExecutiveOperationsDemoDataset() });
  const b = resolveAdvisor({
    dataset: getExecutiveOperationsPressureDataset(),
  });
  assert.notEqual(a.datasetIdentity.datasetId, b.datasetIdentity.datasetId);
  assert.notEqual(a.headline, b.headline);
  assert.notDeepEqual(a.overallCondition, b.overallCondition);
});

test("TEST 4 — Object Identity", () => {
  const runtimeState = resolveRuntime();
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  assert.deepEqual(
    binding.prioritizedSubjects.map((entry) => entry.objectId).sort(),
    runtimeState.objects.map((entry) => entry.objectId).sort(),
  );
});

test("TEST 5 — Executive State Preservation", () => {
  const runtimeState = resolveRuntime();
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  for (const object of runtimeState.objects) {
    const subject = getDataRealityAwareAdvisorSubject(binding, object.objectId)!;
    assert.equal(subject.executiveState, object.executiveState);
    assert.equal(subject.attention, object.attention);
    assert.equal(subject.priority, object.priority);
  }
});

test("TEST 6 — Selection Changes Presentation", () => {
  const runtimeState = resolveRuntime({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const focusedCapacity = resolveDataRealityAwareAdvisorBinding({
    runtimeState,
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-revenue",
  });
  const focusedRevenue = resolveDataRealityAwareAdvisorBinding({
    runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-capacity",
  });

  assert.equal(
    getDataRealityAwareAdvisorPrimarySubject(focusedCapacity)?.objectId,
    "obj-capacity",
  );
  assert.equal(
    getDataRealityAwareAdvisorPrimarySubject(focusedRevenue)?.objectId,
    "obj-revenue",
  );
  assert.notEqual(
    focusedCapacity.primarySubject?.objectId,
    focusedRevenue.primarySubject?.objectId,
  );
  assert.equal(
    resolveDataRealityAwareAdvisorPrimarySubjectId(
      runtimeState,
      "obj-revenue",
      "obj-revenue",
    ),
    "obj-revenue",
  );
});

test("TEST 7 — Selection Does Not Change Truth", () => {
  const a = resolveAdvisor({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
  });
  const b = resolveAdvisor({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-revenue",
    selectedObjectIds: ["obj-revenue"],
  });

  const capacityA = getDataRealityAwareAdvisorSubject(a, "obj-capacity")!;
  const capacityB = getDataRealityAwareAdvisorSubject(b, "obj-capacity")!;
  assert.equal(capacityA.executiveState, capacityB.executiveState);
  assert.equal(capacityA.attention, capacityB.attention);
  assert.equal(capacityA.advisorMeaning, capacityB.advisorMeaning);
  assert.deepEqual(capacityA.evidenceIds, capacityB.evidenceIds);
  assert.deepEqual(capacityA.recommendedAction, capacityB.recommendedAction);
});

test("TEST 8 — Focus Separation", () => {
  const binding = resolveAdvisor({
    focusedObjectId: "obj-inventory",
    selectedObjectId: "obj-delivery",
    selectedObjectIds: ["obj-delivery"],
  });
  assert.equal(binding.focus.focusedObjectId, "obj-inventory");
  assert.equal(binding.focus.selectedObjectId, "obj-delivery");
  assert.notEqual(binding.focus.focusedObjectId, binding.focus.selectedObjectId);
  assert.equal(binding.primarySubject?.objectId, "obj-inventory");
  assert.equal(binding.focusedSubject?.isFocused, true);
  assert.equal(binding.selectedSubject?.isSelected, true);
});

test("TEST 9 — Recommendation Preservation", () => {
  const runtimeState = resolveRuntime();
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  assert.deepEqual(
    getDataRealityAwareAdvisorRecommendations(binding),
    runtimeState.recommendations.actions,
  );
  assert.deepEqual(
    binding.recommendations.recommendedFocus,
    runtimeState.recommendations.recommendedFocus,
  );
});

test("TEST 10 — No Fabricated Recommendation", () => {
  const runtimeState = resolveRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  assert.deepEqual(binding.actions, runtimeState.recommendations.actions);
  const cost = getDataRealityAwareAdvisorSubject(binding, "cost");
  if (cost && runtimeState.objects.find((o) => o.objectId === "cost")?.recommendedAction === undefined) {
    assert.equal(cost.recommendedAction, undefined);
  }
});

test("TEST 11 — Evidence Preservation", () => {
  const runtimeState = resolveRuntime();
  const binding = resolveDataRealityAwareAdvisorBinding({ runtimeState });
  for (const object of runtimeState.objects) {
    const subject = getDataRealityAwareAdvisorSubject(binding, object.objectId)!;
    assert.deepEqual(subject.evidenceIds, object.evidenceIds);
  }
});

test("TEST 12 — Unresolved Preservation", () => {
  const binding = resolveAdvisor({
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const unresolved = getDataRealityAwareAdvisorUnresolvedSubjects(binding);
  assert.ok(unresolved.some((entry) => entry.objectId === "cost"));
  const cost = getDataRealityAwareAdvisorSubject(binding, "cost")!;
  assert.equal(cost.executiveState, "unresolved");
  assert.equal(cost.isUnresolved, true);
  assert.notEqual(cost.executiveState, "stable");
});

test("TEST 13 — Presentation State Compatibility", () => {
  for (const presentationState of ["minimum", "report", "operation"] as const) {
    const binding = resolveAdvisor({ presentationState });
    assert.equal(binding.presentationState, presentationState);
    if (presentationState === "minimum") {
      assert.equal(binding.presentationDensity.showSummary, false);
      assert.equal(binding.presentationDensity.showRecommendedActions, false);
    }
    if (presentationState === "report") {
      assert.equal(binding.presentationDensity.showSummary, true);
      assert.equal(binding.presentationDensity.showRecommendedActions, false);
    }
    if (presentationState === "operation") {
      assert.equal(binding.presentationDensity.showRecommendedActions, true);
    }
  }
});

test("TEST 14 — No Advisor Reasoning Duplication", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareAdvisorExperienceBinding.ts"),
    "utf8",
  );
  assert.equal(/minInclusive|maxExclusive|worseWhen/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/composeDataRealityExecutiveAdvisorResponse/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveAdvisoryResolution/.test(source), false);
  assert.equal(/severityScore|severityRank/.test(source), false);
});

test("TEST 15 — No External AI", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareAdvisorExperienceBinding.ts"),
    "utf8",
  );
  for (const pattern of [
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
    /fetch\(/,
    /XMLHttpRequest/,
    /generateText/,
    /chat\.completions/,
  ]) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_BOUNDARY.usesGenerativeAi,
    false,
  );
});

test("TEST 16 — Same Reality / Same Object State (Stage ↔ Advisor)", () => {
  const runtimeState = resolveRuntime();
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });
  const advisor = resolveDataRealityAwareAdvisorBinding({ runtimeState });

  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ]) {
    const stageObject = getDataRealityAwareStageObjectBinding(stage, id)!;
    const advisorSubject = getDataRealityAwareAdvisorSubject(advisor, id)!;
    assert.equal(stageObject.realityState, advisorSubject.executiveState);
    assert.equal(stageObject.attention, advisorSubject.attention);
  }
});

test("TEST 17 — Unresolved Consistency (Stage ↔ Advisor)", () => {
  const runtimeState = resolveRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
  });
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: STAGE_OBJECTS,
  });
  const advisor = resolveDataRealityAwareAdvisorBinding({ runtimeState });

  // Runtime-only Cost subject remains unresolved in Advisor.
  const advisorCost = getDataRealityAwareAdvisorSubject(advisor, "cost")!;
  assert.equal(advisorCost.executiveState, "unresolved");

  // Stage objects without runtime truth remain unresolved/unbound.
  const stageBudget = getDataRealityAwareStageObjectBinding(stage, "obj-budget")!;
  assert.equal(stageBudget.realityState, "unresolved");
  assert.equal(stageBudget.isUnresolved, true);
});

test("TEST 18 — Selection Consistency (Stage ↔ Advisor)", () => {
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

  const stageCapacity = getDataRealityAwareStageObjectBinding(
    stage,
    "obj-capacity",
  )!;
  const advisorCapacity = getDataRealityAwareAdvisorSubject(
    advisor,
    "obj-capacity",
  )!;
  assert.equal(stageCapacity.isSelected, true);
  assert.equal(advisorCapacity.isSelected, true);
  assert.equal(advisor.primarySubject?.objectId, "obj-capacity");
  assert.equal(stageCapacity.realityState, advisorCapacity.executiveState);
});

test("E2E — Dataset → P2:2 → Stage P2:3 + Advisor P2:4 Capacity change", () => {
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

  const advisorA = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: a.runtimeState,
    focusedObjectId: "obj-capacity",
    presentationState: "report",
  });
  const advisorB = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: b.runtimeState,
    focusedObjectId: "obj-capacity",
    presentationState: "report",
  });

  const stageCapacityA = getDataRealityAwareStageObjectBinding(
    a.stageBinding,
    "obj-capacity",
  )!;
  const stageCapacityB = getDataRealityAwareStageObjectBinding(
    b.stageBinding,
    "obj-capacity",
  )!;
  const advisorCapacityA = getDataRealityAwareAdvisorSubject(
    advisorA.advisorBinding,
    "obj-capacity",
  )!;
  const advisorCapacityB = getDataRealityAwareAdvisorSubject(
    advisorB.advisorBinding,
    "obj-capacity",
  )!;

  assert.equal(stageCapacityA.mvpStatus, "watch");
  assert.equal(stageCapacityA.mvpAttention, "important");
  assert.equal(advisorCapacityA.executiveState, stageCapacityA.realityState);
  assert.notEqual(advisorCapacityA.executiveState, "critical");

  assert.equal(stageCapacityB.mvpStatus, "risk");
  assert.equal(stageCapacityB.mvpAttention, "critical");
  assert.equal(advisorCapacityB.executiveState, stageCapacityB.realityState);
  assert.equal(advisorCapacityB.executiveState, "critical");

  assert.notEqual(advisorA.advisorBinding.headline, advisorB.advisorBinding.headline);
  assert.deepEqual(
    advisorA.advisorBinding.provenance.chain,
    DATA_REALITY_AWARE_ADVISOR_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
  );
});

test("shared P2:2 snapshot — Stage and Advisor consume identical runtimeState", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    presentationState: "operation",
  });
  const advisor = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: "obj-capacity",
    presentationState: "operation",
  });
  assert.equal(
    advisor.advisorBinding.sourceRuntimeState,
    experience.runtimeState,
  );
  assert.equal(
    advisor.advisorBinding.sourceRuntimeState.stateId,
    experience.stageBinding.sourceRuntimeState.stateId,
  );
});

test("Advisor VM overlay preserves UI actions and applies certified content", () => {
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    presentationState: "operation",
  });
  const { advisorBinding } = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: "obj-capacity",
    presentationState: "operation",
  });

  const base: NexoraMVPAdvisorViewModel = Object.freeze({
    contextKey: "test",
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    title: "Advisor · Capacity",
    contextLine: "fixture",
    recommendation: "fixture recommendation",
    rationale: "fixture rationale",
    nextActions: Object.freeze([
      Object.freeze({
        id: "ui-open-report",
        label: "Open Report",
        kind: "change-presentation" as const,
        available: true,
        presentationState: "report" as const,
      }),
    ]),
    warning: null,
    observation: "fixture observation",
    priority: "normal",
    emptyReason: null,
  });

  const overlaid = applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
    base,
    advisorBinding,
  );
  assert.equal(overlaid.nextActions, base.nextActions);
  assert.equal(overlaid.title, advisorBinding.headline);
  assert.notEqual(overlaid.recommendation, "fixture recommendation");
  if (advisorBinding.recommendations.primaryAction) {
    assert.equal(
      overlaid.recommendation,
      advisorBinding.recommendations.primaryAction.title,
    );
  }
});
