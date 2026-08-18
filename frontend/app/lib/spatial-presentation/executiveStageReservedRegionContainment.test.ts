/**
 * STAGE-OBJ:4-FIX — Hard Stage Boundary & Reserved-Region Containment.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
} from "./executiveStage2DFixedCamera.ts";
import { resolveExecutiveStage2DTopologyReadability } from "./executiveStage2DTopologyReadability.ts";
import {
  resolveExecutiveStage2DVisibleBounds,
} from "./executiveStage2DHardSeparation.ts";
import { setExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY,
  EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION,
  correctExecutiveStageFootprintIntoSafeRegion,
  getExecutiveStageReservedRegionContainmentIdentity,
  resolveExecutiveStageObjectContainmentHalfExtent,
  resolveExecutiveStageReservedRegionContainment,
  verifyExecutiveStageReservedRegionContainment,
} from "./executiveStageReservedRegionContainment.ts";

function pipeline(objectId: string, presentationState: "minimum" | "report" | "operation" = "minimum") {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: presentationState,
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomp =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  return applyExecutiveStageFixedCameraToStagePresentation(withRecomp);
}

test("identity STAGE-OBJ:4-FIX / 4.4.3", () => {
  const identity = getExecutiveStageReservedRegionContainmentIdentity();
  assert.equal(
    identity.id,
    "STAGE-OBJ:4-FIX/ExecutiveStageReservedRegionContainment",
  );
  assert.equal(identity.version, "4.4.3");
  assert.equal(verifyExecutiveStageReservedRegionContainment().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesCamera,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.movesAnchor,
    false,
  );
});

test("A — Inventory under Capacity is fully contained above bottom safe edge", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const presentation = pipeline("obj-capacity");
  const inventory = presentation.scene.objects.find(
    (object) => object.id === "obj-inventory",
  )!;
  assert.notEqual(inventory.disclosureState, "hidden");
  assert.ok(inventory.opacity > 0.2);
  const halfExtent = resolveExecutiveStageObjectContainmentHalfExtent({
    classification: "related",
    presentationState: "minimum",
  });
  const bounds = resolveExecutiveStage2DVisibleBounds(
    inventory.targetPosition[0],
    inventory.targetPosition[1],
    halfExtent,
  );
  assert.ok(
    bounds.minY >= EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY - 1e-6,
    `Inventory bottom ${bounds.minY} below usable ${EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY}`,
  );
  assert.equal(inventory.targetPosition[2], 0);
});

test("B–E — visible Capacity neighborhood clears usable + Dial + presentation", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  const presentation = pipeline("obj-capacity");
  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: {
        readonly clippedObjectCount?: number;
        readonly containmentStatus?: string;
      };
    }
  ).stage2dReadability;
  assert.equal(readability?.clippedObjectCount ?? 0, 0);
  assert.ok(
    readability?.containmentStatus === "valid" ||
      readability?.containmentStatus === "degraded",
  );

  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden" || object.opacity <= 0.2) continue;
    const classification =
      object.role === "focused"
        ? "anchor"
        : object.role === "related"
          ? "related"
          : object.role === "peripheral"
            ? "peripheral"
            : "background";
    const halfExtent = resolveExecutiveStageObjectContainmentHalfExtent({
      classification: classification as "related",
      presentationState: "minimum",
      focused: object.focused,
    });
    const bounds = resolveExecutiveStage2DVisibleBounds(
      object.targetPosition[0],
      object.targetPosition[1],
      halfExtent,
    );
    assert.ok(
      bounds.minY >=
        EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY - 1e-6,
      `${object.id} clipped bottom`,
    );
    // Dial hard region intersection must be empty.
    const dial = EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.hardReservedRegions.find(
      (region) => region.id === "workspace-dial",
    )!;
    assert.ok(
      bounds.maxX <= dial.minX ||
        bounds.minX >= dial.maxX ||
        bounds.maxY <= dial.minY ||
        bounds.minY >= dial.maxY,
      `${object.id} intersects Dial`,
    );
  }
});

test("J–N — XY-only; z=0; anchor fixed; camera fixed", () => {
  const presentation = pipeline("obj-capacity");
  const capacity = presentation.scene.objects.find(
    (object) => object.id === "obj-capacity",
  )!;
  assert.deepEqual(capacity.targetPosition, [0, 0, 0]);
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.equal(object.targetPosition[2], 0);
  }
  assert.deepEqual(presentation.scene.camera.position, [
    0,
    0,
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  ]);
  assert.equal(
    EXECUTIVE_STAGE_RESERVED_REGION_CONTAINMENT_BOUNDARY.usesZForContainment,
    false,
  );
});

test("bottom violation pushes upward minimally", () => {
  const corrected = correctExecutiveStageFootprintIntoSafeRegion({
    x: 0,
    y: -2.1,
    halfExtent: 0.55,
  });
  assert.ok(corrected.y > -2.1);
  assert.ok(
    corrected.y - 0.55 >=
      EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY - 1e-6,
  );
});

test("AD — clipped count zero for Capacity / Revenue / Delivery", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  for (const id of ["obj-capacity", "obj-revenue", "obj-delivery"]) {
    const layout = resolveExecutiveStage2DTopologyReadability({
      anchorObjectId: id,
      presentationState: "minimum",
      objects: [
        "obj-budget",
        "obj-capacity",
        "obj-delivery",
        "obj-revenue",
        "obj-customer",
        "obj-risk",
        "obj-inventory",
        "obj-demand",
      ].map((objectId) =>
        Object.freeze({
          objectId,
          attention:
            objectId === "obj-risk"
              ? "critical"
              : objectId === "obj-customer"
                ? "important"
                : "normal",
          status: objectId === "obj-demand" ? "watch" : "stable",
        }),
      ),
      relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
        Object.freeze({
          id: edge.id,
          sourceId: edge.sourceId,
          targetId: edge.targetId,
        }),
      ),
    });
    assert.equal(layout.clippedObjectCount ?? 0, 0, id);
    assert.equal(layout.layoutOverlapCount ?? 0, 0, id);
  }
});

test("AB — Minimum/Report/Operation Capacity containment", () => {
  setExecutiveObjectPresenceV2Enabled(true);
  for (const level of ["minimum", "report", "operation"] as const) {
    const presentation = pipeline("obj-capacity", level);
    const readability = (
      presentation.scene as {
        readonly stage2dReadability?: { readonly clippedObjectCount?: number };
      }
    ).stage2dReadability;
    assert.equal(readability?.clippedObjectCount ?? 0, 0, level);
  }
});

test("containment hide peripheral before clipping related", () => {
  const result = resolveExecutiveStageReservedRegionContainment({
    anchorObjectId: "anchor",
    positions: {
      anchor: Object.freeze({ x: 0, y: 0, z: 0 }),
      related: Object.freeze({ x: 1.2, y: 0.2, z: 0 }),
      peripheral: Object.freeze({ x: 2.8, y: -2.2, z: 0 }),
    },
    classifications: {
      anchor: "anchor",
      related: "related",
      peripheral: "peripheral",
    },
    presentationState: "minimum",
  });
  assert.equal(result.positions.anchor!.x, 0);
  assert.equal(result.positions.anchor!.y, 0);
  assert.ok(result.positions.related);
  // Peripheral in deep south should be corrected or hidden — never clipped.
  if (result.positions.peripheral) {
    const half = resolveExecutiveStageObjectContainmentHalfExtent({
      classification: "peripheral",
    });
    const bounds = resolveExecutiveStage2DVisibleBounds(
      result.positions.peripheral.x,
      result.positions.peripheral.y,
      half,
    );
    assert.ok(
      bounds.minY >=
        EXECUTIVE_STAGE_SAFE_PRESENTATION_REGION.usableRect.minY - 1e-6,
    );
  }
  assert.equal(result.clippedObjectCount, 0);
});
