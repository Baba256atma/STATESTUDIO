import test from "node:test";
import assert from "node:assert/strict";

import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo.ts";
import { normalizeExecutiveObjectLayout } from "../composition/normalizeExecutiveObjectLayout.ts";
import {
  compute2DStrategicNetworkBounds,
  STRATEGIC_2D_NETWORK_PADDING,
} from "./executive2DStrategicMapRuntime.ts";
import { computeLayoutPositionBounds, fitCameraToSceneObjects } from "./fitCameraToSceneObjects.ts";
import { resolveExecutive2DOrthographicFrame } from "./executive2DCameraProfile.ts";
import {
  applyExecutiveObjectScaleGovernance,
  MAX_FOOTPRINT_TO_AVERAGE_RATIO,
} from "./executive2DObjectScaleGovernance.ts";

test("2D strategic bounds ignore oversized geometry extents", () => {
  const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
  const layout = normalizeExecutiveObjectLayout(objects);
  const geometryBounds = computeLayoutPositionBounds(objects, layout.positions);
  const strategicBounds = compute2DStrategicNetworkBounds(objects, layout.positions);

  assert.equal(Object.keys(layout.positions).length, 10);
  assert.ok(strategicBounds.size[0] <= geometryBounds.size[0] + 0.01);
  assert.ok(strategicBounds.size[2] <= geometryBounds.size[2] + 0.01);
  assert.ok(strategicBounds.size[0] >= 6.5);
  assert.ok(strategicBounds.size[2] >= 6.5);
});

test("2D fit uses strategic network center on ground plane", () => {
  const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
  const layout = normalizeExecutiveObjectLayout(objects);
  const fit2d = fitCameraToSceneObjects({
    objects,
    mode: "2D",
    layoutPositions: layout.positions,
    viewportWidth: 1440,
    viewportHeight: 900,
  });

  assert.equal(fit2d.center[1], 0);
  assert.ok(fit2d.frame.position[1] > fit2d.center[1]);
  assert.ok((fit2d.frame as { zoom?: number }).zoom != null);
});

test("2D orthographic frame fits full strategic network span", () => {
  const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
  const layout = normalizeExecutiveObjectLayout(objects);
  const bounds = compute2DStrategicNetworkBounds(objects, layout.positions);
  const frame = resolveExecutive2DOrthographicFrame(bounds, 1440, 900);

  assert.ok(frame.zoom >= 8);
  assert.ok(frame.orthoSize >= bounds.size[0] * 0.4);
  assert.equal(frame.projection, "orthographic");
});

test("2D scale governance keeps tier spread within max-to-average ratio", () => {
  const scales = (
    ["critical", "important", "supporting", "minor"] as const
  ).map((importance) =>
    applyExecutiveObjectScaleGovernance({
      rawScale: 1.1,
      baseScale: 1.1,
      viewMode: "2D",
      role: "center",
      importance,
    }).scale
  );
  const average = scales.reduce((sum, value) => sum + value, 0) / scales.length;
  const max = Math.max(...scales);
  assert.ok(max <= average * MAX_FOOTPRINT_TO_AVERAGE_RATIO + 0.001);
  assert.ok(scales.every((value) => value >= 0.45 && value <= 0.85));
});
