/**
 * NPA-T STAGE-SPATIAL:1A-FIX1 — STAGE-PROD preserves Stage-owned Object-focus XY.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { resolveNexoraLiveStageDthExpSpatial } from "@/app/executive/nex-mvp/resolveNexoraLiveStageDthExpSpatial.ts";
import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyNexoraMVPExecutiveCollectionIntegrity } from "@/app/lib/nex-mvp/nexoraMVPExecutiveCollectionIntegrity.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyExecutiveOvsIsometricPlacementToStagePresentation,
  projectExecutiveOvsIsometricTheatreVisual,
} from "@/app/lib/spatial-presentation/executiveOvsIsometricTheatreVisual.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA,
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
} from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import {
  measureExecutiveStage2DBoundsGap,
  resolveExecutiveStage2DMinVisualGap,
  resolveExecutiveStage2DVisibleBounds,
  resolveExecutiveStage2DVisualFootprint,
} from "@/app/lib/spatial-presentation/executiveStage2DHardSeparation.ts";
import { projectStageProdDirectorComposition } from "./stageProdDirectorComposition.ts";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function composedStage(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId, catalog);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const base = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withTopologyPlane =
    applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomposition =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(
      withTopologyPlane,
    );
  const withCollectionIntegrity =
    applyNexoraMVPExecutiveCollectionIntegrity(withRecomposition);
  const withLabels = applyExecutiveStageObjectLabelTerritoryToStagePresentation(
    withCollectionIntegrity,
    { presentationLevel: "minimum" },
  );
  const presentation = applyExecutiveStageFixedCameraToStagePresentation(
    withLabels,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
  });
  const spatial = resolveNexoraLiveStageDthExpSpatial(theatre);
  return { state, presentation, theatre, spatial };
}

function visible(presentation: ReturnType<typeof composedStage>["presentation"]) {
  return presentation.scene.objects.filter(
    (object) => object.disclosureState !== "hidden" && object.opacity > 0.05,
  );
}

test("A — Capacity preserves Stage-owned XY when dthExpSpatial is null", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  assert.equal(spatial, null);
  const before = visible(presentation).map((object) => ({
    id: object.id,
    xy: [...object.targetPosition],
  }));
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  assert.equal(composition.status, "preserved");
  assert.equal(composition.family, "investigation");
  assert.equal(composition.sceneIntentKind, "REVIEW_FOCAL_OBJECT");
  for (const entry of before) {
    const after = composition.presentation.scene.objects.find(
      (object) => object.id === entry.id,
    );
    assert.deepEqual(after?.targetPosition, entry.xy);
  }
});

test("B — Capacity supports are not the compressed 1.20 / y=-1.15 row", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const supports = ["obj-budget", "obj-delivery", "obj-inventory", "obj-customer"]
    .map((id) =>
      composition.presentation.scene.objects.find((object) => object.id === id),
    )
    .filter((object) => object != null);
  assert.ok(supports.length >= 3);
  const sameRow = supports.every(
    (object) => object.targetPosition[1] === -1.15,
  );
  assert.equal(sameRow, false);
  const xs = supports.map((object) => object.targetPosition[0]).sort((a, b) => a - b);
  if (xs.length >= 2) {
    const spreads = xs.slice(1).map((x, index) => +(x - xs[index]!).toFixed(2));
    assert.equal(spreads.every((spread) => spread === 1.2), false);
  }
});

test("C — adjacent Capacity Objects satisfy existing min-gap footprint", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const related = visible(composition.presentation).filter(
    (object) => object.id !== "obj-capacity",
  );
  const minGap = resolveExecutiveStage2DMinVisualGap();
  const half = resolveExecutiveStage2DVisualFootprint("related", "minimum").halfExtent;
  let minCenter = Number.POSITIVE_INFINITY;
  let minAabbGap = Number.POSITIVE_INFINITY;
  for (let i = 0; i < related.length; i += 1) {
    for (let j = i + 1; j < related.length; j += 1) {
      const dx =
        related[i]!.targetPosition[0] - related[j]!.targetPosition[0];
      const dy =
        related[i]!.targetPosition[1] - related[j]!.targetPosition[1];
      minCenter = Math.min(minCenter, Math.hypot(dx, dy));
      minAabbGap = Math.min(
        minAabbGap,
        measureExecutiveStage2DBoundsGap(
          resolveExecutiveStage2DVisibleBounds(
            related[i]!.targetPosition[0],
            related[i]!.targetPosition[1],
            half,
          ),
          resolveExecutiveStage2DVisibleBounds(
            related[j]!.targetPosition[0],
            related[j]!.targetPosition[1],
            half,
          ),
        ),
      );
    }
  }
  assert.ok(minCenter > 1.2, `support center distance ${minCenter} still compressed`);
  assert.ok(
    minAabbGap >= minGap,
    `related AABB gap ${minAabbGap} < required ${minGap}`,
  );
});

test("D — Capacity remains focal / dominant", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const capacity = composition.presentation.scene.objects.find(
    (object) => object.id === "obj-capacity",
  );
  assert.equal(capacity?.focused, true);
  assert.equal(composition.presentation.scene.focusedObjectId, "obj-capacity");
  assert.ok((capacity?.scale ?? 0) >= 0.92);
  for (const object of visible(composition.presentation)) {
    if (object.id === "obj-capacity") continue;
    assert.ok(object.scale <= (capacity?.scale ?? 1));
  }
});

test("E — Capacity admission is not reduced by STAGE-PROD", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const before = visible(presentation).map((object) => object.id).sort();
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const after = visible(composition.presentation).map((object) => object.id).sort();
  assert.deepEqual(after, before);
  assert.ok(after.includes("obj-capacity"));
  assert.ok(after.includes("obj-budget"));
  assert.ok(after.includes("obj-delivery"));
  assert.ok(after.includes("obj-inventory"));
});

test("F — existing Capacity relationship IDs are unchanged", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const before = presentation.scene.connections.map((connection) => connection.id).sort();
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const after = composition.presentation.scene.connections
    .map((connection) => connection.id)
    .sort();
  assert.deepEqual(after, before);
  assert.ok(after.includes("rel-budget-capacity"));
  assert.ok(after.includes("rel-capacity-delivery"));
});

test("G — Capacity label anchors remain distinct", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const anchors = visible(composition.presentation).map((object) =>
    `${object.targetPosition[0].toFixed(3)},${object.targetPosition[1].toFixed(3)}`,
  );
  assert.equal(new Set(anchors).size, anchors.length);
});

test("H — Capacity centers no longer share the compressed presence row", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  const related = visible(composition.presentation).filter(
    (object) => object.id !== "obj-capacity",
  );
  const half = resolveExecutiveStage2DVisualFootprint("related", "minimum").halfExtent;
  const minGap = resolveExecutiveStage2DMinVisualGap();
  for (let i = 0; i < related.length; i += 1) {
    for (let j = i + 1; j < related.length; j += 1) {
      const gap = measureExecutiveStage2DBoundsGap(
        resolveExecutiveStage2DVisibleBounds(
          related[i]!.targetPosition[0],
          related[i]!.targetPosition[1],
          half,
        ),
        resolveExecutiveStage2DVisibleBounds(
          related[j]!.targetPosition[0],
          related[j]!.targetPosition[1],
          half,
        ),
      );
      assert.ok(gap >= minGap);
    }
  }
});

test("I — canonical Object Z remains 0", () => {
  const { presentation, theatre, spatial } = composedStage("obj-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  for (const object of composition.presentation.scene.objects) {
    assert.equal(object.targetPosition[2], 0);
  }
});

test("J — STAGE-SPATIAL:2 camera pose is unchanged", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.mode, "fixed-executive-perspective");
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.fov, 42);
  const source = readFileSync(
    join(here, "stageProdDirectorComposition.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /azimuth|elevation|FOV|OrbitControls/);
});

test("K — Capacity remains REVIEW_FOCAL_OBJECT and is not NEXO_FLOW", () => {
  const { theatre, spatial } = composedStage("obj-capacity");
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_FOCAL_OBJECT");
  assert.equal(spatial, null);
  assert.notEqual(
    (spatial as unknown as { readonly family?: string } | null)?.family,
    "NEXO_FLOW",
  );
});

test("L — Risk spatial path is not destroyed by STAGE-PROD", () => {
  const { presentation, theatre, spatial } = composedStage("obj-risk");
  assert.equal(spatial?.family, "NEXO_RISK");
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
    spatial,
  });
  assert.equal(composition.status, "applied");
  const visual = projectExecutiveOvsIsometricTheatreVisual({
    spatial,
    objects: composition.presentation.scene.objects,
    connections: composition.presentation.scene.connections,
  });
  assert.equal(visual.consumedFamily, "NEXO_RISK");
  assert.equal(visual.sceneStatus, "available");
  const placed = applyExecutiveOvsIsometricPlacementToStagePresentation(
    composition.presentation,
    visual,
  );
  const risk = placed.scene.objects.find((object) => object.id === "obj-risk");
  assert.ok(risk);
  assert.equal(risk?.targetPosition[2], 0);
  assert.ok(
    visual.actorPlacements.some(
      (placement) => placement.canonicalObjectId === "obj-risk",
    ),
  );
  assert.ok(visual.structures.length >= 1);
});
