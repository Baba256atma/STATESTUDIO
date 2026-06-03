import { describe, expect, it, vi, beforeEach } from "vitest";

import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo";
import {
  applyExecutive3DFramingPullback,
  buildExecutive2DCameraFrame,
  buildExecutive3DCameraFrame,
  EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER,
  EXECUTIVE_3D_CAMERA_OFFSET,
  EXECUTIVE_3D_FRAMING_PULLBACK,
} from "./executiveCameraFrameFormulas";
import {
  EXECUTIVE_3D_DEFAULT_FRAMING_RADIUS,
  resetExecutive3DCameraProfileLogsForTests,
  resolveExecutive3DDefaultCamera,
} from "./executive3DCameraProfile";
import {
  computeLayoutPositionBounds,
  fitCameraToSceneObjects,
} from "./fitCameraToSceneObjects";
import { normalizeExecutiveObjectLayout } from "../composition/normalizeExecutiveObjectLayout";

describe("executiveCameraFrameFormulas", () => {
  beforeEach(() => {
    resetExecutive3DCameraProfileLogsForTests();
    vi.restoreAllMocks();
  });

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
  it("uses a lower command-center 3D default camera than the legacy drone overview", () => {
    const frame = resolveExecutive3DDefaultCamera();
    expect(frame.position[1]).toBeLessThan(6);
    expect(frame.position[2]).toBeLessThan(10);
    expect(frame.position).toEqual(
      buildExecutive3DCameraFrame(
        [0, 0, 0],
        applyExecutive3DFramingPullback(EXECUTIVE_3D_DEFAULT_FRAMING_RADIUS)
      ).position
    );
  });

  it("logs executive camera profile once per framing signature", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    resolveExecutive3DDefaultCamera();
    resolveExecutive3DDefaultCamera();
    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ExecutiveCameraProfile]");
    expect(logs).toHaveLength(1);
  });

  it("applies 3D framing pullback for closer operational presence", () => {
    expect(applyExecutive3DFramingPullback(10)).toBeCloseTo(10 * EXECUTIVE_3D_FRAMING_PULLBACK, 5);
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
    expect(Math.abs(fit3d.center[0] - bounds.center[0])).toBeLessThan(0.15);
    expect(fit3d.frame.lookAt).toEqual(fit3d.center);
    expect(fit3d.frame.position[1]).toBeGreaterThan(fit3d.center[1]);
    expect(fit3d.frame.position[1]).toBeLessThan(9.5);
    expect(fit3d.radius).toBeGreaterThan(6);
    expect(fit3d.radius).toBeLessThan(17);
    expect(Math.abs(fit2d.frame.position[0] - bounds.center[0])).toBeLessThan(0.15);
    expect(Math.abs(fit2d.frame.position[2] - bounds.center[2])).toBeLessThan(0.15);
    expect(fit2d.frame.position[1]).toBeGreaterThan(bounds.center[1]);
    expect(fit2d.frame.lookAt).toEqual(fit2d.center);
  });
});
