import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolveExecutive2DOrthographicFrame } from "../camera/executive2DCameraProfile";
import { resolveExecutive3DCameraFrame } from "../camera/executive3DCameraProfile";
import { resolveExecutiveOrbitRuntimeConfig } from "../interaction/executiveOrbitRuntime";
import {
  resetExecutiveViewportModeRuntimeForTests,
  resolveExecutiveViewportModeConfig,
} from "./executiveViewportModeRuntime";
import {
  resolveExecutiveViewportCameraFrame,
} from "./executiveViewportCameraRuntime";
import { resetExecutiveSceneFramingForTests } from "../composition/executiveSceneFramingRuntime";
import { resetExecutiveDensityCompressionForTests } from "../objectScaling/executiveDensityCompressionRuntime";

function buildScene(objects: Array<{ id: string; position: [number, number, number] }>) {
  return {
    scene: {
      objects: objects.map((object) => ({ id: object.id, position: object.position })),
      relationships: [],
    },
  };
}

describe("E2:92 executive viewport modes", () => {
  beforeEach(() => {
    resetExecutiveViewportModeRuntimeForTests();
    resetExecutiveSceneFramingForTests();
    resetExecutiveDensityCompressionForTests();
    vi.restoreAllMocks();
  });

  it("defines independent 2D and 3D mode configs", () => {
    const twoD = resolveExecutiveViewportModeConfig("2D");
    const threeD = resolveExecutiveViewportModeConfig("3D");
    expect(twoD.projection).toBe("orthographic");
    expect(threeD.projection).toBe("perspective");
    expect(twoD.enableOrbitRotate).toBe(false);
    expect(threeD.enableOrbitRotate).toBe(true);
    expect(twoD.zoomToCursor).toBe(true);
    expect(twoD.transitionDurationMs).toBeGreaterThanOrEqual(300);
    expect(twoD.transitionDurationMs).toBeLessThanOrEqual(800);
  });

  it("frames 2D orthographic maps with readable zoom", () => {
    const frame = resolveExecutive2DOrthographicFrame(
      { center: [0, 0, 0], size: [8, 1, 8] },
      1440,
      900,
      12
    );
    expect(frame.projection).toBe("orthographic");
    expect(frame.zoom).toBeGreaterThan(10);
    expect(frame.position[1]).toBeGreaterThan(frame.lookAt[1]);
  });

  it("uses executive perspective tilt in 3D", () => {
    const frame = resolveExecutive3DCameraFrame(
      { center: [0, 0, 0], size: [6, 1, 6] },
      14,
      { executiveTiltRadians: 0.68 }
    );
    expect(frame.position[1]).toBeGreaterThan(0);
    expect(frame.position[2]).toBeGreaterThan(frame.lookAt[2]);
  });

  it("configures orbit controls for mode-specific navigation", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [2, 0, 1] },
    ]);
    const orbit2D = resolveExecutiveOrbitRuntimeConfig({ viewMode: "2D", sceneJson });
    const orbit3D = resolveExecutiveOrbitRuntimeConfig({ viewMode: "3D", sceneJson });
    expect(orbit2D.enableRotate).toBe(false);
    expect(orbit3D.enableRotate).toBe(true);
    expect(orbit3D.mouseButtons.MIDDLE).toBe(2);
    expect(orbit2D.zoomToCursor).toBe(true);
    expect(orbit2D.target).not.toEqual([0, 0, 0]);
  });

  it("resolves viewport camera frames from framing engine", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [14, 0, 0] },
    ]);
    const mapFrame = resolveExecutiveViewportCameraFrame({
      sceneJson,
      viewMode: "2D",
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    const perspectiveFrame = resolveExecutiveViewportCameraFrame({
      sceneJson,
      viewMode: "3D",
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(mapFrame?.projection).toBe("orthographic");
    expect(perspectiveFrame?.projection).toBe("perspective");
    expect(mapFrame!.zoom).toBeGreaterThan(perspectiveFrame!.zoom);
  });

  it("ignores preserveCenter when resolving canonical 2D frames", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [14, 0, 0] },
    ]);
    const canonical = resolveExecutiveViewportCameraFrame({
      sceneJson,
      viewMode: "2D",
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    const leaked = resolveExecutiveViewportCameraFrame({
      sceneJson,
      viewMode: "2D",
      viewportWidth: 1440,
      viewportHeight: 900,
      preserveCenter: [99, 0, 99],
    });
    expect(canonical).not.toBeNull();
    expect(leaked).not.toBeNull();
    expect(leaked!.position).toEqual(canonical!.position);
    expect(leaked!.lookAt).toEqual(canonical!.lookAt);
    expect(leaked!.zoom).toEqual(canonical!.zoom);
    expect(leaked!.operationalCenter).toEqual(canonical!.operationalCenter);
  });
});
