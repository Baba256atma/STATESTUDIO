import { describe, expect, it } from "vitest";

import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo";
import {
  buildExecutive2DCameraFrame,
  buildExecutive3DCameraFrame,
  EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER,
  EXECUTIVE_3D_CAMERA_OFFSET,
} from "./executiveCameraFrameFormulas";
import {
  computeLayoutPositionBounds,
  fitCameraToSceneObjects,
} from "./fitCameraToSceneObjects";
import { normalizeExecutiveObjectLayout } from "../composition/normalizeExecutiveObjectLayout";

describe("executiveCameraFrameFormulas", () => {
  it("places 2D camera above center on +Y", () => {
    const frame = buildExecutive2DCameraFrame([1, 0.5, -2], 4);
    expect(frame.position).toEqual([1, 0.5 + 4 * EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER, -2]);
    expect(frame.lookAt).toEqual([1, 0.5, -2]);
    expect(frame.position[0]).toBe(frame.lookAt[0]);
    expect(frame.position[2]).toBe(frame.lookAt[2]);
    expect(frame.position[1]).toBeGreaterThan(frame.lookAt[1]);
  });

  it("places 3D camera at the executive angled offset", () => {
    const frame = buildExecutive3DCameraFrame([0, 0, 0], 5);
    expect(frame.position).toEqual([
      5 * EXECUTIVE_3D_CAMERA_OFFSET.x,
      5 * EXECUTIVE_3D_CAMERA_OFFSET.y,
      5 * EXECUTIVE_3D_CAMERA_OFFSET.z,
    ]);
    expect(frame.lookAt).toEqual([0, 0, 0]);
  });
});

describe("fitCameraToSceneObjects layout framing", () => {
  it("frames all 10 retail demo layout positions", () => {
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);
    const bounds = computeLayoutPositionBounds(objects, layout.positions);
    const fit3d = fitCameraToSceneObjects({
      objects,
      mode: "3D",
      layoutPositions: layout.positions,
    });
    const fit2d = fitCameraToSceneObjects({
      objects,
      mode: "2D",
      layoutPositions: layout.positions,
    });

    expect(Object.keys(layout.positions)).toHaveLength(10);
    expect(fit3d.center[0]).toBeCloseTo(bounds.center[0], 5);
    expect(fit3d.frame.lookAt).toEqual(fit3d.center);
    expect(fit3d.frame.position[1]).toBeGreaterThan(fit3d.center[1]);
    expect(fit2d.frame.position[0]).toBeCloseTo(bounds.center[0], 5);
    expect(fit2d.frame.position[2]).toBeCloseTo(bounds.center[2], 5);
    expect(fit2d.frame.position[1]).toBeGreaterThan(bounds.center[1]);
    expect(fit2d.frame.lookAt).toEqual(fit2d.center);
  });
});
