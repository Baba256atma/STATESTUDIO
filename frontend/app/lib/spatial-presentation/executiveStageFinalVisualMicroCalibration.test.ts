/**
 * SP:2.8A — Final Stage visual micro-calibration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  resolveExecutiveSpatialComposition,
} from "./executiveSpatialComposition.ts";
import {
  certifyExecutiveObjectVisualIntegration,
} from "./executiveObjectVisualIntegrationCertification.ts";
import {
  certifyExecutiveStageVisualCalibration,
} from "./executiveStageVisualCalibration.ts";
import {
  EXECUTIVE_STAGE_CONNECTION_ENERGY_SP28A,
  EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY,
  certifyExecutiveStageFinalVisualMicroCalibration,
  getExecutiveStageFinalVisualMicroCalibrationIdentity,
  verifyExecutiveStageFinalVisualMicroCalibration,
} from "./executiveStageFinalVisualMicroCalibration.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectLabelPresentation } from "./executiveObjectLabelInformationDensity.ts";

const source = readFileSync(
  new URL("./executiveStageFinalVisualMicroCalibration.ts", import.meta.url),
  "utf8",
);
const compositionSource = readFileSync(
  new URL("./executiveSpatialComposition.ts", import.meta.url),
  "utf8",
);

test("1. SP:2.8A identity is a calibration patch only", () => {
  const identity = getExecutiveStageFinalVisualMicroCalibrationIdentity();
  assert.equal(
    identity.id,
    "SP:2.8A/ExecutiveStageFinalVisualMicroCalibration",
  );
  assert.equal(identity.version, "2.8.1");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-final-visual-micro-calibration",
  );
  assert.equal(identity.architecturalRole, "PresentationOnlyCalibrationPatch");
  assert.equal(
    EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY.redesignsSp28,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY.startsSp3Atmosphere,
    false,
  );
  assert.equal(verifyExecutiveStageFinalVisualMicroCalibration().ok, true);
});

test("2. Dial exclusion expands to full panel footprint", () => {
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX <= 0.45);
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY <= -0.28);
  assert.ok(EXECUTIVE_SAFE_FRAMING_MARGINS.bottom >= 0.28);
  assert.ok(EXECUTIVE_SAFE_FRAMING_MARGINS.right >= 0.3);
});

test("3. generic Dial geometry clearance is bounded and ID-agnostic", () => {
  const before = Object.freeze({ x: 2.05, y: -0.05, z: 1.5 });
  const after = applyExecutiveSpatialUiOverlaySafeCorrection(before);
  assert.ok(after.x < before.x);
  assert.ok(after.y >= before.y);
  assert.ok(
    before.x - after.x <= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.maxCorrectionX,
  );
  assert.doesNotMatch(compositionSource, /objectId\s*===\s*["']risk["']/i);
  assert.doesNotMatch(source, /objectId\s*===\s*["']risk["']/i);
});

test("4. multiple arbitrary identities receive equivalent BR correction", () => {
  const ids = ["obj-a", "obj-risk", "capacity-x", "delivery-y", "zzz"];
  const positions = ids.map((objectId) => {
    const result = resolveExecutiveSpatialComposition({
      objects: [
        Object.freeze({
          objectId,
          preferredPosition: Object.freeze({ x: 2.1, y: 0, z: 1.5 }),
        }),
      ],
    });
    return result.objects[0]!.position;
  });
  for (const position of positions) {
    assert.deepEqual(position, positions[0]);
    assert.ok(position.x < 1.8);
  }
});

test("5. bottom boundary and bottom-left localization", () => {
  assert.ok(EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY >= -0.16);
  const low = applyExecutiveSpatialUiOverlaySafeCorrection(
    Object.freeze({ x: 0.1, y: -0.4, z: 1.0 }),
  );
  assert.ok(
    low.y >= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.stageFloorY - 1e-9,
  );
  assert.ok(low.y >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY);

  const bottomLeft = Object.freeze({ x: -1.7, y: 0, z: 1.35 });
  const corrected = applyExecutiveSpatialUiOverlaySafeCorrection(bottomLeft);
  assert.ok(Math.abs(corrected.x - bottomLeft.x) < 0.08);
  assert.ok(Math.abs(corrected.z - bottomLeft.z) < 0.08);
});

test("6. central constellation breathing is preserved", () => {
  const result = certifyExecutiveStageFinalVisualMicroCalibration();
  assert.equal(result.checks.centralBreathingPreserved, true);
});

test("7. connection hierarchy quieter background; focus preserved", () => {
  const energy = EXECUTIVE_STAGE_CONNECTION_ENERGY_SP28A;
  assert.equal(energy.background, 0.045);
  assert.equal(energy.overview, 0.14);
  assert.equal(energy.focus, 0.74);
  assert.ok(energy.background < energy.backgroundBeforeSp28A);
  assert.ok(energy.focus > energy.overview);
  assert.ok(energy.overview > energy.background);
});

test("8. non-edge + compact label regression", () => {
  const revenue = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
  });
  const capacity = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(revenue.emphasis.showFocusPedestal, true);
  assert.equal(capacity.spatialRole, "background");
  assert.equal(capacity.emphasis.stateClass, "critical");

  const watch = resolveExecutiveObjectLabelPresentation({
    objectId: "delivery",
    objectName: "Delivery",
    spatialRole: "overview",
    status: "watch",
    stateMarker: "attention",
  });
  assert.equal(watch.lines.length, 1);
  assert.match(watch.lines[0] ?? "", /DELIVERY · watch/i);
});

test("9. SP:2.8 and SP:2.7 remain certified", () => {
  const sp27 = certifyExecutiveObjectVisualIntegration();
  assert.equal(sp27.structuralStatus, "certified");
  assert.equal(sp27.automatedStatus, "certified");
  const sp28 = certifyExecutiveStageVisualCalibration();
  assert.equal(sp28.automatedStatus, "certified");
  const sp28a = certifyExecutiveStageFinalVisualMicroCalibration();
  assert.equal(sp28a.automatedStatus, "certified");
  assert.equal(sp28a.humanVisualStatus, "pending");
  assert.equal(sp28a.sp28AutomatedStatus, "certified");
});

test("10. dense scene Dial/bottom corrections remain bounded", () => {
  const dense = resolveExecutiveSpatialComposition({
    objects: Array.from({ length: 12 }, (_, index) =>
      Object.freeze({
        objectId: `dense-${index}`,
        preferredPosition: Object.freeze({
          x: 1.6 + (index % 3) * 0.35,
          y: -0.05,
          z: 1.0 + (index % 4) * 0.2,
        }),
      }),
    ),
  });
  for (const entry of dense.objects) {
    assert.ok(
      entry.position.x <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX + 1e-9,
    );
    assert.ok(
      entry.position.y >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY - 1e-9,
    );
    const inDialCorner =
      entry.position.x >= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinX &&
      entry.position.z >= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinZ;
    assert.equal(inDialCorner, false);
  }
  assert.equal(certifyExecutiveStageVisualCalibration().checks.denseScene, true);
});

test("11. focus variation keeps BR focus usable without ID hacks", () => {
  const focuses = ["center-a", "outer-b", "br-focus"] as const;
  for (const focusedObjectId of focuses) {
    const preferred =
      focusedObjectId === "br-focus"
        ? Object.freeze({ x: 2.05, y: 0, z: 1.4 })
        : focusedObjectId === "outer-b"
          ? Object.freeze({ x: -2.2, y: 0.2, z: -1.3 })
          : Object.freeze({ x: 0.1, y: 0.2, z: 0.1 });
    const composition = resolveExecutiveSpatialComposition({
      objects: [
        Object.freeze({ objectId: focusedObjectId, preferredPosition: preferred }),
        Object.freeze({
          objectId: "peer",
          preferredPosition: Object.freeze({ x: -1.5, y: 0.1, z: 0.8 }),
        }),
      ],
    });
    const focused = composition.objects.find(
      (entry) => entry.objectId === focusedObjectId,
    )!;
    assert.ok(focused);
    assert.ok(focused.position.y >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY);
    if (focusedObjectId === "br-focus") {
      assert.ok(
        focused.position.x < EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinX ||
          focused.position.z < EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinZ,
      );
    }
  }
});

test("12. no SP:3 and no Risk-specific hacks", () => {
  assert.doesNotMatch(source, /fog|bloom|SSAO|postprocessing/i);
  assert.doesNotMatch(source, /if\s*\(\s*(?:objectId|label|objectName)/);
  assert.equal(
    verifyExecutiveStageFinalVisualMicroCalibration().doesNotStartSp3,
    true,
  );
});
