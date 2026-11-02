/**
 * NPA-T STAGE-FINAL-PLACEMENT-AUTHORITY:1
 * Readability is the last targetPosition writer.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
  type DthExpSpatialActorLayout,
  type DthExpSpatialLayoutProjection,
} from "../dth-exp/dthExpSpatialLayoutContract.ts";
import {
  DTH_EXP_SPATIAL_LAYOUT_ENGINE,
  dthExpSpatialLayoutIdentity,
  dthExpSpatialLayoutVersion,
} from "../dth-exp/dthExpSpatialLayoutIdentity.ts";
import type { ManagementLevelSpatialComposition } from "../nmi/nmiManagementLevelSpatialContract.ts";
import { applyManagementLevelSpatialToStagePresentation } from "../nmi/nmiLiveManagementLevelStageAdapter.ts";
import { projectNexoraDecisionTheatreFoundation } from "../decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  type NexoraMVPStageInteractionPresentation,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectStageProdDirectorComposition } from "../stage-prod/stageProdDirectorComposition.ts";
import {
  applyExecutiveOvsIsometricPlacementToStagePresentation,
  projectExecutiveOvsIsometricTheatreVisual,
} from "./executiveOvsIsometricTheatreVisual.ts";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function focusState(id: string) {
  return selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    id,
    catalog,
  );
}

function derived(id: string) {
  const state = focusState(id);
  return {
    state,
    presentation: deriveNexoraMVPStageInteractionPresentation(state, catalog, {
      consultExecutiveChangeSessionStore: false,
    }),
  };
}

function positionOf(
  presentation: NexoraMVPStageInteractionPresentation,
  id: string,
) {
  return (
    presentation.scene.objects.find((object) => object.id === id)?.targetPosition ??
    presentation.contextNodes.find((node) => node.id === id)?.targetPosition ??
    null
  );
}

function finalPlacement(presentation: NexoraMVPStageInteractionPresentation, external: boolean) {
  const sealed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(
    presentation,
    external ? { sealExternalPlacement: true } : undefined,
  );
  const camera = applyExecutiveStageFixedCameraToStagePresentation(sealed);
  const labeled = applyExecutiveStageObjectLabelTerritoryToStagePresentation(camera, {
    presentationLevel: "minimum",
  });
  return { sealed, camera, labeled };
}

test("canvas writes targetPosition in readability, then camera, then one label pass", () => {
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
  const readability = pipeline.indexOf(
    "applyExecutiveStage2DTopologyRecompositionToStagePresentation(",
  );
  const camera = pipeline.indexOf(
    "applyExecutiveStageFixedCameraToStagePresentation(",
  );
  const labels = pipeline.indexOf(
    "applyExecutiveStageObjectLabelTerritoryToStagePresentation(",
  );
  assert.ok(
    isometric > 0 &&
      management > isometric &&
      readability > management &&
      camera > readability &&
      labels > camera,
  );
  assert.equal(
    stage.split("applyExecutiveStageObjectLabelTerritoryToStagePresentation(").length - 1,
    1,
  );
  assert.equal(
    stage.split("applyExecutiveStage2DTopologyRecompositionToStagePresentation(").length - 1,
    1,
  );
});

test("focused subjects stay at the origin for each workflow kind", () => {
  for (const id of [
    "obj-capacity",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    const { state, presentation } = derived(id);
    const flat = applyExecutiveStage2DTopologyPlaneToStagePresentation(presentation);
    const theatre = projectNexoraDecisionTheatreFoundation({
      stageState: state,
      catalog,
    });
    const composition = projectStageProdDirectorComposition({
      presentation: flat,
      theatre,
    });
    const external = composition.status === "applied";
    const { sealed, labeled } = finalPlacement(composition.presentation, external);
    const center = positionOf(sealed, id);
    assert.deepEqual(center, [0, 0, 0], id);
    assert.deepEqual(positionOf(labeled, id), [0, 0, 0], id);
    const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
    assert.equal(advisor.advisorSubjectId, state.focusedSubject?.id, id);
  }
});

test("camera and captions do not rewrite the sealed coordinates", () => {
  const { presentation } = derived("obj-capacity");
  const moved = {
    ...presentation,
    scene: {
      ...presentation.scene,
      objects: presentation.scene.objects.map((object) =>
        object.id === "obj-capacity"
          ? { ...object, targetPosition: [2, -1, 0] as const, focused: true as const }
          : {
              ...object,
              targetPosition: [
                object.targetPosition[0] + 2,
                object.targetPosition[1] - 1,
                0,
              ] as const,
            },
      ),
    },
  };
  const { sealed, camera, labeled } = finalPlacement(moved, true);
  assert.deepEqual(positionOf(sealed, "obj-capacity"), [0, 0, 0]);
  for (const object of sealed.scene.objects) {
    assert.deepEqual(
      positionOf(camera, object.id),
      object.targetPosition,
      object.id,
    );
    assert.deepEqual(
      positionOf(labeled, object.id),
      object.targetPosition,
      object.id,
    );
  }
  const related = sealed.scene.objects.find((object) => object.id !== "obj-capacity");
  assert.ok(related);
  assert.equal(related.targetPosition[0], moved.scene.objects.find((object) => object.id === related.id)!.targetPosition[0] - 2);
  assert.equal(related.targetPosition[1], moved.scene.objects.find((object) => object.id === related.id)!.targetPosition[1] + 1);
});

test("comparison preferences without a focused subject keep their order", () => {
  const { presentation } = derived("obj-capacity");
  const overview = {
    ...presentation,
    focusedSubjectId: null,
    scene: {
      ...presentation.scene,
      focusedObjectId: null,
      objects: presentation.scene.objects.map((object) => ({
        ...object,
        focused: false,
        targetPosition:
          object.id === "obj-capacity"
            ? ([-1.2, 0.45, 0] as const)
            : object.id === "obj-risk"
              ? ([1.2, 0.45, 0] as const)
              : object.targetPosition,
      })),
    },
  };
  const { sealed } = finalPlacement(overview, true);
  assert.deepEqual(positionOf(sealed, "obj-capacity"), [-1.2, 0.45, 0]);
  assert.deepEqual(positionOf(sealed, "obj-risk"), [1.2, 0.45, 0]);
});

test("isometric scale survives and the focused anchor is not left off-center", () => {
  const { presentation } = derived("obj-capacity");
  const actor = (id: string, x: number, y: number): DthExpSpatialActorLayout =>
    Object.freeze({
      actorId: `actor:${id}`,
      canonicalObjectId: id,
      engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
      lane: "flow",
      region: "flow",
      order: 0,
      position: Object.freeze({ x, y }),
      size: Object.freeze({ width: 0.12, height: 0.12 }),
      sizeReason: "supporting-context",
      depth: "middle",
      emphasis: "low",
      disclosure: "visible",
      grouping: "flow",
      distanceFromFocal: 0,
      proximityImpliesCausality: false,
      layoutReason: "final-placement-test",
      animationTarget: Object.freeze({
        position: Object.freeze({ x, y }),
        size: Object.freeze({ width: 0.12, height: 0.12 }),
        emphasis: "low" as const,
        disclosure: "visible" as const,
        grouping: "flow",
        interpolationImplemented: false as const,
        durationMs: null,
        easing: null,
      }),
    });
  const spatial: DthExpSpatialLayoutProjection = Object.freeze({
    identity: dthExpSpatialLayoutIdentity,
    version: dthExpSpatialLayoutVersion,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    family: "NEXO_FLOW",
    coordinateSpace: DTH_EXP_NORMALIZED_STAGE_SPACE,
    sceneRef: "final-placement",
    focalCanonicalObjectId: "obj-capacity",
    density: "sparse",
    actors: Object.freeze([actor("obj-capacity", 0.2, 0.5), actor("obj-risk", 0.8, 0.5)]),
    relationshipPaths: Object.freeze([]),
    evidenceHints: Object.freeze([]),
    futureTransitionSemantics: DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
    animationEngine: false,
    interpolationImplemented: false,
    liveStageWiring: false,
    mutatesTheatreScene: false,
    mutatesCanonicalObjects: false,
    proximityImpliesCausality: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    declaresOutcomeSuccess: false,
    layoutProvenance: "DTH-EXP:5A/SharedSpatialGrammar",
  });
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial,
    objects: presentation.scene.objects,
    connections: presentation.scene.connections,
  });
  const placed = applyExecutiveOvsIsometricPlacementToStagePresentation(presentation, visual);
  const before = placed.scene.objects.find((object) => object.id === "obj-capacity");
  const riskBefore = placed.scene.objects.find((object) => object.id === "obj-risk");
  assert.ok(before && riskBefore);
  const { sealed } = finalPlacement(placed, true);
  const after = sealed.scene.objects.find((object) => object.id === "obj-capacity");
  const riskAfter = sealed.scene.objects.find((object) => object.id === "obj-risk");
  assert.ok(after && riskAfter);
  assert.deepEqual(after.targetPosition, [0, 0, 0]);
  assert.equal(after.scale, before.scale);
  assert.equal(after.opacity, before.opacity);
  assert.equal(after.labelProminence, before.labelProminence);
  assert.equal(after.kind, before.kind);
  assert.ok(Math.abs(riskAfter.targetPosition[0] - (riskBefore.targetPosition[0] - before.targetPosition[0])) < 1e-9);
  assert.ok(Math.abs(riskAfter.targetPosition[1] - (riskBefore.targetPosition[1] - before.targetPosition[1])) < 1e-9);
});

test("management levels keep slot relationships and center a focused subject", () => {
  const { presentation } = derived("obj-capacity");
  const spatial = {
    visibleLevelCount: 2,
    slots: [
      {
        role: "ACTIVE",
        canonicalId: "obj-capacity",
        detailMode: "FULL",
        scale: 1,
        placement: { world: { x: 1.5, y: 2.5, z: 0 } },
      },
      {
        role: "PARENT",
        canonicalId: "obj-risk",
        detailMode: "SUMMARY",
        scale: 0.72,
        placement: { world: { x: 4, y: 1, z: 0 } },
      },
    ],
  } as unknown as ManagementLevelSpatialComposition;
  const protectedActive = applyManagementLevelSpatialToStagePresentation(presentation, spatial, {
    theatreActive: true,
  });
  assert.deepEqual(
    positionOf(protectedActive, "obj-capacity"),
    positionOf(presentation, "obj-capacity"),
  );
  const leveled = applyManagementLevelSpatialToStagePresentation(presentation, spatial);
  const active = leveled.scene.objects.find((object) => object.id === "obj-capacity");
  const parent = leveled.scene.objects.find((object) => object.id === "obj-risk");
  assert.ok(active && parent);
  assert.equal(active.scale, 1);
  assert.equal(parent.scale, 0.72);
  assert.equal(parent.labelProminence, "reduced");
  const { sealed } = finalPlacement(leveled, true);
  assert.deepEqual(positionOf(sealed, "obj-capacity"), [0, 0, 0]);
  assert.deepEqual(positionOf(sealed, "obj-risk"), [2.5, -1.5, 0]);
  assert.equal(sealed.scene.objects.find((object) => object.id === "obj-risk")?.scale, 0.72);
});

test("back restores the previous focus and overview clears it", () => {
  let state = focusState("obj-capacity");
  state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-capacity", catalog);
  const scenario = derived("ctx-scenario-capacity");
  const advisor = buildNexoraMVPAdvisorContextBridge(scenario.state, scenario.presentation);
  assert.equal(advisor.advisorSubjectId, "ctx-scenario-capacity");
  const back = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(back.focusedSubject?.id, "obj-capacity");
  const overview = resetNexoraMVPObjectInteractionOverview(back);
  assert.equal(overview.mode, "overview");
  assert.equal(overview.focusedSubject, null);
  assert.equal(overview.workspace, "overview");
});
