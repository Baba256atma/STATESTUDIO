/**
 * P2:6 — Data-Reality-Aware Interaction & Scene Choreography tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY,
  DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_PROVENANCE_CHAIN,
  dataRealityAwareSceneChoreographyArchitecturalRole,
  dataRealityAwareSceneChoreographyIdentity,
  dataRealityAwareSceneChoreographyNamespace,
  dataRealityAwareSceneChoreographyPhase,
  dataRealityAwareSceneChoreographyVersion,
  getDataRealityAwareRelatedSceneObjects,
  getDataRealityAwareRetainedAttentionObjects,
  getDataRealityAwareSceneAnchor,
  getDataRealityAwareSceneCameraGuidance,
  getDataRealityAwareSceneChoreographyIdentity,
  resolveDataRealityAwareSceneChoreography,
} from "./dataRealityAwareSceneChoreography.ts";
import {
  dataRealityAwareFocusAttentionExperienceIdentity,
  resolveDataRealityAwareFocusAttentionExperience,
} from "./dataRealityAwareFocusAttentionExperience.ts";
import { resolveDataRealityAwareMVPRuntimeState } from "./dataRealityAwareMVPRuntimeState.ts";
import {
  getDataRealityAwareStageObjectBinding,
  resolveDataRealityAwareStageBinding,
} from "./dataRealityAwareStageExperienceBinding.ts";
import {
  getDataRealityAwareAdvisorSubject,
  resolveDataRealityAwareAdvisorBinding,
} from "./dataRealityAwareAdvisorExperienceBinding.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import { getExecutiveOperationsPressureDataset } from "./demo/executiveOperationsDemoDataset.ts";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  resetNexoraMVPObjectInteractionOverview,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "../nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience.ts";
import { resolveNexoraMVPDataRealityAwareFocusAttentionExperience } from "../nex-mvp/nexoraMVPDataRealityAwareFocusAttentionExperience.ts";
import {
  applyDataRealityAwareSceneChoreographyToStagePresentation,
  resolveNexoraMVPDataRealityAwareSceneChoreography,
} from "../nex-mvp/nexoraMVPDataRealityAwareSceneChoreography.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { EXECUTIVE_STAGE_FOCUS_VIEWING_CAMERA_TUPLE } from "../spatial-presentation/executiveViewingAngle.ts";

const here = dirname(fileURLToPath(import.meta.url));

const STAGE_OBJECTS = getDefaultNexoraMVPObjectInteractionCatalog().objects.map(
  (entry) => Object.freeze({ objectId: entry.id }),
);

const RELATIONSHIPS = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((entry) =>
  Object.freeze({
    id: entry.id,
    sourceId: entry.sourceId,
    targetId: entry.targetId,
  }),
);

const STAGE_BINDING_OBJECTS = STAGE_OBJECTS.map((entry) =>
  Object.freeze({ id: entry.objectId }),
);

function sharedRuntimeInput() {
  return {
    dataset: getExecutiveOperationsPressureDataset(),
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
    presentationState: "report" as const,
  };
}

function resolveFocus(overrides: {
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
} = {}) {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    ...sharedRuntimeInput(),
    ...overrides,
  });
  return resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId:
      overrides.focusedObjectId ?? runtimeState.focus.focusedObjectId,
    selectedObjectId:
      overrides.selectedObjectId ?? runtimeState.focus.selectedObjectId,
    presentationState: "report",
  });
}

function resolveChoreography(overrides: {
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
} = {}) {
  const focusAttention = resolveFocus(overrides);
  return resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
    presentationState: "report",
  });
}

test("P2:6 identity and boundary", () => {
  const identity = getDataRealityAwareSceneChoreographyIdentity();
  assert.equal(
    dataRealityAwareSceneChoreographyIdentity,
    "P2:6/DataRealityAwareInteractionSceneChoreographyIntegration",
  );
  assert.equal(
    identity.identity,
    "P2:6/DataRealityAwareInteractionSceneChoreographyIntegration",
  );
  assert.equal(dataRealityAwareSceneChoreographyVersion, "2.6.0");
  assert.equal(
    dataRealityAwareSceneChoreographyNamespace,
    "nexora.data-reality.interaction-scene-choreography",
  );
  assert.equal(
    dataRealityAwareSceneChoreographyPhase,
    "InteractionSceneChoreographyIntegration",
  );
  assert.equal(
    dataRealityAwareSceneChoreographyArchitecturalRole,
    "DataRealityAwareSceneChoreographyBoundary",
  );
  assert.equal(
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY.recomputesFocusAttention,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY.immediateFocusAttentionSource,
    dataRealityAwareFocusAttentionExperienceIdentity,
  );
});

test("TEST 1 — Determinism", () => {
  const a = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const b = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:5 Sole Focus Source", () => {
  const focusAttention = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.sourceFocusAttention, focusAttention);
  assert.equal(result.anchorObjectId, focusAttention.primaryFocus);
  assert.equal(
    result.provenance.immediateFocusAttentionSource,
    dataRealityAwareFocusAttentionExperienceIdentity,
  );
});

test("TEST 3 — Anchor Identity", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.equal(result.anchorObjectId, "obj-revenue");
  assert.equal(getDataRealityAwareSceneAnchor(result), "obj-revenue");
  const anchor = result.objects.find((entry) => entry.objectId === "obj-revenue");
  assert.equal(anchor?.isAnchor, true);
  assert.equal(anchor?.targetPositionRole, "focus-anchor");
});

test("TEST 4a — Recommended-only primaryFocus does not auto-anchor", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    ...sharedRuntimeInput(),
    focusedObjectId: undefined,
    selectedObjectId: undefined,
    selectedObjectIds: [],
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: undefined,
    selectedObjectId: undefined,
  });
  // P2:5 may still surface recommended as primaryFocus for attention semantics.
  assert.ok(focusAttention.primaryFocus !== undefined);
  assert.equal(focusAttention.selectedFocus, undefined);
  assert.equal(focusAttention.runtimeFocus, undefined);

  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, undefined);
  assert.equal(result.camera.mode, "overview");
});

test("TEST 4 — No Focus", () => {
  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    ...sharedRuntimeInput(),
    focusedObjectId: undefined,
    selectedObjectId: undefined,
    selectedObjectIds: [],
  });
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState,
    focusedObjectId: undefined,
    selectedObjectId: undefined,
  });
  // Force no primary focus for reset path.
  const withoutPrimary = {
    ...focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: withoutPrimary as typeof focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, undefined);
  assert.equal(result.camera.mode, "overview");
  assert.equal(result.camera.transitionKind, "focus-clear");
  assert.equal(result.resetBehavior.restoreNativeLayout, true);
  assert.equal(result.resetBehavior.clearBusinessTruth, false);
  for (const entry of result.objects) {
    assert.equal(entry.targetPositionRole, "native");
    assert.equal(entry.isAnchor, false);
  }
});

test("TEST 5 — Related Object Resolution", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const related = getDataRealityAwareRelatedSceneObjects(result).map(
    (entry) => entry.objectId,
  );
  // Canonical graph: revenue ↔ customer, revenue ↔ demand
  assert.ok(related.includes("obj-customer"));
  assert.ok(related.includes("obj-demand"));
  for (const entry of result.objects.filter((o) => o.isRelated)) {
    assert.equal(entry.targetPositionRole, "related-near");
    assert.equal(entry.shouldReveal, true);
  }
});

test("TEST 6 — No Fabricated Relations", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const capacity = result.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  // Capacity is critical under pressure but not graph-related to Revenue.
  assert.equal(capacity.isRelated, false);
  assert.equal(capacity.shouldReveal, false);
});

test("TEST 7 — Background Classification", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const background = result.objects.filter((entry) => entry.isBackground);
  assert.ok(background.length > 0);
  for (const entry of background) {
    assert.equal(entry.isAnchor, false);
    assert.equal(entry.isRelated, false);
  }
});

test("TEST 8 — Critical Attention Retention", () => {
  // Shared snapshot with Capacity critical+recommended; present Revenue.
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    currentWorkspace: "problem",
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const capacity = result.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  assert.equal(capacity.retainAttention, true);
  assert.ok(
    result.attentionRetention.objectIds.includes("obj-capacity"),
  );
});

test("TEST 9 — Recommended Attention Retention", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  assert.equal(shared.runtimeState.focus.recommendedObjectId, "obj-capacity");
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(focus.focusAttention.recommendedFocus, "obj-capacity");
  assert.equal(
    result.objects.find((entry) => entry.objectId === "obj-capacity")!
      .retainAttention,
    true,
  );
});

test("TEST 10 — Unresolved Attention Retention", () => {
  const focusAttention = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  for (const unresolvedId of focusAttention.unresolvedObjects) {
    if (unresolvedId === result.anchorObjectId) continue;
    const entry = result.objects.find((o) => o.objectId === unresolvedId);
    if (!entry) continue;
    assert.equal(entry.retainAttention, true);
  }
});

test("TEST 11 — Competing Attention", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, "obj-revenue");
  assert.equal(focus.focusAttention.recommendedFocus, "obj-capacity");
  assert.equal(focus.focusAttention.sceneAttention.hasCompetingAttention, true);
  const capacity = result.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  assert.equal(capacity.isAnchor, false);
  assert.equal(capacity.retainAttention, true);
});

test("TEST 12 — Selection Does Not Rewrite Reality", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const before = shared.runtimeState.objects.find(
    (o) => o.objectId === "obj-capacity",
  )!;
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const after =
    result.sourceFocusAttention.sourceRuntimeState.objects.find(
      (o) => o.objectId === "obj-capacity",
    )!;
  assert.equal(after.executiveState, before.executiveState);
  assert.equal(after.attention, before.attention);
  assert.equal(result.sourceFocusAttention.sourceRuntimeState, shared.runtimeState);
});

test("TEST 13 — Camera Guidance", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const camera = getDataRealityAwareSceneCameraGuidance(result);
  assert.equal(camera.mode, "focus");
  assert.equal(camera.targetObjectId, "obj-revenue");
  assert.equal(camera.targetRole, "focus-anchor");
});

test("TEST 14 — Reset Camera", () => {
  const focusAttention = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const cleared = {
    ...focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: cleared as typeof focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.camera.mode, "overview");
  assert.equal(result.camera.targetRole, "stage-origin");
  assert.equal(result.resetBehavior.restoreOverviewCamera, true);
});

test("TEST 15 — Connection Emphasis", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const foreground = result.connections.filter((c) => c.shouldForeground);
  assert.ok(foreground.length > 0);
  for (const connection of foreground) {
    assert.equal(connection.involvesAnchor, true);
  }
  const unrelated = result.connections.filter((c) => !c.involvesAnchor);
  for (const connection of unrelated) {
    assert.equal(connection.shouldForeground, false);
    assert.equal(connection.shouldDeemphasize, true);
  }
});

test("TEST 16 — No KPI Logic", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareSceneChoreography.ts"),
    "utf8",
  );
  assert.equal(/computeNexoraKPIs|minInclusive|maxExclusive|worseWhen/.test(source), false);
  assert.equal(
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY.ownsKpiComputation,
    false,
  );
});

test("TEST 17 — No Advisor Logic", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareSceneChoreography.ts"),
    "utf8",
  );
  assert.equal(
    /resolveDataRealityExecutiveAdvisor|composeAdvisor|generateRecommendation/.test(
      source,
    ),
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY.ownsAdvisorReasoning,
    false,
  );
});

test("TEST 18 — Presentation State Compatibility", () => {
  for (const presentationState of ["minimum", "report", "operation"] as const) {
    const focusAttention = resolveFocus({
      focusedObjectId: "obj-revenue",
      selectedObjectId: "obj-revenue",
    });
    const result = resolveDataRealityAwareSceneChoreography({
      focusAttention,
      stageObjects: STAGE_OBJECTS,
      relationships: RELATIONSHIPS,
      presentationState,
    });
    assert.equal(result.presentationState, presentationState);
    assert.equal(result.anchorObjectId, "obj-revenue");
  }
});

test("TEST 19 — Stable Object IDs", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  const ids = result.objects.map((entry) => entry.objectId).sort();
  assert.deepEqual(
    ids,
    STAGE_OBJECTS.map((entry) => entry.objectId).sort(),
  );
});

test("TEST 20 — Provenance", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  assert.deepEqual(
    result.provenance.chain,
    DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_PROVENANCE_CHAIN,
  );
  assert.equal(
    result.provenance.immediateFocusAttentionSource,
    dataRealityAwareFocusAttentionExperienceIdentity,
  );
});

test("TEST 21 — Click → Focus → Choreography", () => {
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(interaction, "obj-revenue");
  assert.equal(interaction.focusedSubject?.id, "obj-revenue");

  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: interaction.focusedSubject?.id,
    selectedObjectId: interaction.selectedSubject?.id,
    selectedObjectIds: interaction.selectedSubject
      ? [interaction.selectedSubject.id]
      : undefined,
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: experience.runtimeState,
    focusedObjectId: interaction.focusedSubject?.id,
    selectedObjectId: interaction.selectedSubject?.id,
  });
  assert.equal(focus.focusAttention.primaryFocus, "obj-revenue");

  const choreography = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(choreography.choreography.anchorObjectId, "obj-revenue");
  assert.equal(
    choreography.choreography.objects.find(
      (entry) => entry.objectId === "obj-revenue",
    )?.targetPositionRole,
    "focus-anchor",
  );
});

test("TEST 22 — Clear Selection/Focus", () => {
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(interaction, "obj-revenue");
  interaction = resetNexoraMVPObjectInteractionOverview(interaction);
  assert.equal(interaction.focusedSubject, null);

  const focusAttention = resolveFocus({
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const cleared = {
    ...focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: cleared as typeof focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  assert.equal(result.anchorObjectId, undefined);
  assert.ok(result.objects.every((entry) => entry.targetPositionRole === "native"));
  assert.equal(result.camera.mode, "overview");
});

test("TEST 23 — Rapid Focus Change Determinism", () => {
  for (const id of ["obj-revenue", "obj-capacity", "obj-customer"] as const) {
    const a = resolveChoreography({
      focusedObjectId: id,
      selectedObjectId: id,
    });
    const b = resolveChoreography({
      focusedObjectId: id,
      selectedObjectId: id,
    });
    assert.deepEqual(a, b);
    assert.equal(a.anchorObjectId, id);
    assert.ok(
      a.objects.every(
        (entry) => entry.isAnchor === (entry.objectId === id),
      ),
    );
  }
});

test("TEST 24 — Stage / Advisor / Focus / Choreography", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const stage = resolveDataRealityAwareStageBinding({
    runtimeState: shared.runtimeState,
    stageObjects: STAGE_BINDING_OBJECTS,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const advisor = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });

  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-revenue")!.isSelected,
    true,
  );
  assert.equal(advisor.advisorBinding.primarySubject?.objectId, "obj-revenue");
  assert.equal(focus.focusAttention.primaryFocus, "obj-revenue");
  assert.equal(choreography.anchorObjectId, "obj-revenue");

  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-capacity")!.realityState,
    "critical",
  );
  assert.equal(
    getDataRealityAwareAdvisorSubject(advisor.advisorBinding, "obj-capacity")!
      .executiveState,
    "critical",
  );
  assert.equal(focus.focusAttention.recommendedFocus, "obj-capacity");
  assert.equal(
    choreography.objects.find((e) => e.objectId === "obj-capacity")!
      .retainAttention,
    true,
  );
});

test("E2E — Competing attention choreography: Revenue anchor, Capacity retained", () => {
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
    stageObjects: STAGE_BINDING_OBJECTS,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const advisor = resolveDataRealityAwareAdvisorBinding({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const focus = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });

  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-revenue")!.isSelected,
    true,
  );
  assert.equal(
    getDataRealityAwareStageObjectBinding(stage, "obj-capacity")!.realityState,
    "critical",
  );
  assert.equal(advisor.primarySubject?.objectId, "obj-revenue");
  assert.equal(advisor.focus.recommendedObjectId, "obj-capacity");
  assert.equal(focus.primaryFocus, "obj-revenue");
  assert.equal(focus.recommendedFocus, "obj-capacity");
  assert.equal(focus.sceneAttention.hasCompetingAttention, true);

  assert.equal(choreography.anchorObjectId, "obj-revenue");
  const capacity = choreography.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  assert.equal(capacity.isAnchor, false);
  assert.equal(capacity.retainAttention, true);
  assert.equal(capacity.isRelated, false);
});

test("Relationship choreography — only canonical edges", () => {
  const result = resolveChoreography({
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
  });
  const related = new Set(
    getDataRealityAwareRelatedSceneObjects(result).map((e) => e.objectId),
  );
  // capacity ↔ budget, delivery, inventory
  assert.ok(related.has("obj-budget"));
  assert.ok(related.has("obj-delivery"));
  assert.ok(related.has("obj-inventory"));
  assert.equal(related.has("obj-revenue"), false);
  assert.equal(related.has("obj-customer"), false);
});

test("Renderer apply — targets reach Stage presentation without duplicates", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "problem",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  interaction = selectNexoraMVPInteractionSubject(interaction, "obj-revenue");
  const base = deriveNexoraMVPStageInteractionPresentation(interaction, catalog);

  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const { choreography } = resolveNexoraMVPDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const applied = applyDataRealityAwareSceneChoreographyToStagePresentation(
    base,
    choreography,
  );

  assert.equal(applied.scene.objects.length, base.scene.objects.length);
  assert.equal(
    new Set(applied.scene.objects.map((o) => o.id)).size,
    applied.scene.objects.length,
  );
  const revenue = applied.scene.objects.find((o) => o.id === "obj-revenue")!;
  assert.equal(revenue.role, "focused");
  assert.deepEqual(revenue.targetPosition, [0, 0.42, 0.14]);
  const capacity = applied.scene.objects.find((o) => o.id === "obj-capacity")!;
  assert.equal(capacity.role, "unrelated");
  // SP:4.1B — disclosure-hidden subjects stay presentation-hidden.
  if (capacity.disclosureState === "hidden") {
    assert.equal(capacity.opacity, 0);
    assert.equal(capacity.interactive, false);
  } else {
    assert.ok(capacity.opacity >= 0.58);
  }
  assert.equal(applied.scene.mode, "focus");
  assert.equal(
    applied.scene.camera.fov,
    EXECUTIVE_STAGE_FOCUS_VIEWING_CAMERA_TUPLE.fov,
  );

  const clearedFocus = {
    ...focus.focusAttention,
    primaryFocus: undefined,
    selectedFocus: undefined,
    runtimeFocus: undefined,
  };
  const resetPlan = resolveDataRealityAwareSceneChoreography({
    focusAttention: clearedFocus as typeof focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const resetApplied = applyDataRealityAwareSceneChoreographyToStagePresentation(
    base,
    resetPlan,
  );
  assert.equal(resetApplied.scene.mode, "overview");
  assert.equal(resetApplied.scene.focusedObjectId, null);
  for (const object of resetApplied.scene.objects) {
    assert.deepEqual(object.targetPosition, object.overviewPosition);
  }
});

test("Camera controller dependency stability — fixed hook arity", () => {
  const source = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx",
    ),
    "utf8",
  );
  assert.equal(source.includes("useFrame"), true);
  assert.equal(/OrbitControls/.test(source), false);
  // No conditional hooks / variable dependency arrays in camera controller.
  assert.equal(/if\s*\([^)]*\)\s*\{[^}]*use(Frame|Effect|Memo|Callback)/.test(source), false);
});

test("Retained attention helpers", () => {
  const shared = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-capacity"],
    presentationState: "report",
  });
  const focus = resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
    runtimeState: shared.runtimeState,
    focusedObjectId: "obj-revenue",
    selectedObjectId: "obj-revenue",
  });
  const result = resolveDataRealityAwareSceneChoreography({
    focusAttention: focus.focusAttention,
    stageObjects: STAGE_OBJECTS,
    relationships: RELATIONSHIPS,
  });
  const retained = getDataRealityAwareRetainedAttentionObjects(result);
  assert.ok(retained.some((entry) => entry.objectId === "obj-capacity"));
});
