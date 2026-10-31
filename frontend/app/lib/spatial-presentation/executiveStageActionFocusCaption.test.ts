/**
 * NPA-T STAGE-ACTION-FOCUS-CAPTION-FIX:1
 * Actions navigation keeps one caption per canonical subject, and
 * STAGE-LABEL:1 reads positions after the last placement pass.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  executiveStageContextCaptionVisible,
  executiveStageObjectCaptionCanonicalIds,
} from "../../executive/nex-mvp/stage/NexoraStageContextNodes.tsx";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { completeNexoraMVPOperationPresentation } from "../nex-mvp/nexoraMVPPresentationState.ts";
import type { ExecutiveStageLabelLayoutResult } from "./executiveStageObjectLabelTerritory.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
} from "./executiveStage2DFixedCamera.ts";

const here = dirname(fileURLToPath(import.meta.url));

function act(ids: readonly string[]) {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
  for (const id of ids) {
    const selected = selectNexoraMVPInteractionSubject(state, id);
    state = completeNexoraMVPOperationPresentation(selected, selected !== state);
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: state.presentationState,
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const flattened = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const recomposed =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(flattened);
  const fixed = applyExecutiveStageFixedCameraToStagePresentation(recomposed);
  const placed = applyExecutiveStageObjectLabelTerritoryToStagePresentation(fixed, {
    presentationLevel:
      state.presentationState === "report" || state.presentationState === "operation"
        ? state.presentationState
        : "minimum",
  });
  return { state, placed, beforeLabels: fixed };
}

function layoutOf(presentation: ReturnType<typeof act>["placed"]): ExecutiveStageLabelLayoutResult | null {
  return (
    presentation.scene as { stageLabelLayout?: ExecutiveStageLabelLayoutResult }
  ).stageLabelLayout ?? null;
}

function visibleContextCaptions(
  presentation: ReturnType<typeof act>["placed"],
) {
  const owners = executiveStageObjectCaptionCanonicalIds(presentation.scene.objects);
  return presentation.contextNodes.filter((node) =>
    executiveStageContextCaptionVisible(node, owners),
  );
}

test("zero-opacity source anchors do not render captions", () => {
  const { placed } = act(["obj-capacity", "ctx-problem-capacity"]);
  const anchor = placed.contextNodes.find((node) => node.role === "source-anchor");
  assert.ok(anchor);
  assert.equal(anchor.opacity, 0);
  assert.equal(executiveStageContextCaptionVisible(anchor), false);
  assert.equal(
    visibleContextCaptions(placed).some((node) => node.subjectId === "obj-capacity"),
    false,
  );
});

test("Capacity does not produce a duplicate visible caption", () => {
  const { placed } = act(["obj-capacity", "ctx-scenario-capacity"]);
  const owners = executiveStageObjectCaptionCanonicalIds(placed.scene.objects);
  assert.equal(owners.has("obj-capacity"), true);
  const anchor = placed.contextNodes.find((node) => node.subjectId === "obj-capacity");
  assert.ok(anchor);
  assert.equal(executiveStageContextCaptionVisible(anchor, owners), false);
  const capacityCaptions = [
    ...placed.scene.objects.filter(
      (object) => object.id === "obj-capacity" && owners.has(object.id),
    ),
    ...visibleContextCaptions(placed).filter((node) => node.subjectId === "obj-capacity"),
  ];
  assert.equal(capacityCaptions.length, 1);
});

test("focused problem, scenario, and decision captions remain visible", () => {
  for (const id of [
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
  ]) {
    const { placed, state } = act(["obj-capacity", id]);
    const focus = placed.scene.objects.find((object) => object.id === id);
    assert.equal(state.focusedSubject?.id, id);
    assert.ok(focus);
    assert.equal(focus.focused, true);
    assert.equal(focus.labelVisible, true);
    assert.notEqual(focus.labelVisibilityMode, "hidden");
    assert.ok((focus.opacity ?? 0) >= 0.2);
  }
});

test("label territory uses final object positions and does not move them", () => {
  const { placed, beforeLabels } = act(["obj-capacity", "ctx-scenario-capacity"]);
  const scenario = placed.scene.objects.find(
    (object) => object.id === "ctx-scenario-capacity",
  );
  assert.ok(scenario);
  const moved = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    {
      ...beforeLabels,
      scene: {
        ...beforeLabels.scene,
        objects: beforeLabels.scene.objects.map((object) =>
          object.id === "ctx-scenario-capacity"
            ? { ...object, targetPosition: [3.25, -1.4, 0] as const }
            : object,
        ),
      },
    },
    { presentationLevel: "minimum" },
  );
  const relocated = moved.scene.objects.find(
    (object) => object.id === "ctx-scenario-capacity",
  );
  assert.ok(relocated);
  assert.deepEqual(relocated.targetPosition, [3.25, -1.4, 0]);
  const ownership = layoutOf(moved)?.byId.get("ctx-scenario-capacity");
  assert.ok(ownership);
  assert.deepEqual(ownership.anchorPoint, [3.25, -1.4]);
  assert.ok(Math.abs(ownership.anchorPoint[1] - scenario.targetPosition[1]) > 1);
  for (const object of placed.scene.objects) {
    const original = beforeLabels.scene.objects.find((entry) => entry.id === object.id);
    assert.deepEqual(object.targetPosition, original?.targetPosition);
  }
  assert.equal(placed.scene.camera, beforeLabels.scene.camera);
});

test("visible object caption rectangles do not overlap after Actions transitions", () => {
  for (const id of [
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
  ]) {
    const { placed } = act(["obj-capacity", id]);
    const result = layoutOf(placed);
    assert.ok(result);
    assert.equal(result.labelLabelOverlapCount, 0);
    assert.equal(result.collisionCount >= 0, true);
  }
});

test("Advisor and Stage share the canonical focused subject", () => {
  const { state, placed } = act(["obj-capacity", "ctx-scenario-capacity"]);
  const advisor = buildNexoraMVPAdvisorContextBridge(state, placed);
  assert.equal(advisor.advisorSubjectId, "ctx-scenario-capacity");
  assert.equal(advisor.focusedSubject?.id, state.focusedSubject?.id);
  assert.equal(placed.scene.focusedObjectId, state.focusedSubject?.id);
});

test("Back and Overview restore the previous focus", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
  state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-capacity");
  const back = stepBackNexoraMVPObjectInteraction(state);
  assert.equal(back.focusedSubject?.id, "obj-capacity");
  assert.equal(back.mode, "object-focused");
  const overview = resetNexoraMVPObjectInteractionOverview(back);
  assert.equal(overview.mode, "overview");
  assert.equal(overview.focusedSubject, null);
});

test("camera constants and Stage label order stay after final placement", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  const stage = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  const pipeline = stage.slice(stage.indexOf("const fixedCameraInteraction"));
  const isometric = pipeline.indexOf(
    "applyExecutiveOvsIsometricPlacementToStagePresentation(",
  );
  const management = pipeline.indexOf(
    "applyManagementLevelSpatialToStagePresentation(",
  );
  const labels = pipeline.indexOf(
    "applyExecutiveStageObjectLabelTerritoryToStagePresentation(",
  );
  assert.ok(isometric > 0 && management > isometric && labels > management);
  assert.equal(
    stage.split("applyExecutiveStageObjectLabelTerritoryToStagePresentation(").length -
      1,
    1,
  );
});

test("a distinct visible context subject can still show its caption", () => {
  const visible = executiveStageContextCaptionVisible(
    {
      opacity: 0.92,
      labelVisible: true,
      subjectId: "ctx-scenario-demand",
      role: "context",
    },
    new Set(["obj-capacity"]),
  );
  assert.equal(visible, true);
});
