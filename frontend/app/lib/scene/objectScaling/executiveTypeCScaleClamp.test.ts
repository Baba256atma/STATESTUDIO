import { describe, expect, it } from "vitest";

import {
  clampExecutiveTypeCObjectScale,
  isZoneLikeExecutiveObject,
} from "./executiveTypeCScaleClamp";
import {
  computeScaleAwareSceneBounds,
  fitCameraToSceneObjects,
} from "../camera/fitCameraToSceneObjects";

describe("fitCameraToSceneObjects", () => {
  const objects = [
    {
      id: "a",
      label: "Operations",
      type: "box",
      transform: { pos: [-4, 0, 0], scale: [3, 3, 3] },
    },
    {
      id: "b",
      label: "Price Pressure",
      type: "torus",
      transform: { pos: [4, 0, 2], scale: [2, 2, 2] },
    },
  ];

  it("clamps oversized zone-like scales before bounds expansion", () => {
    const bounds = computeScaleAwareSceneBounds(objects);
    expect(bounds.size[0]).toBeLessThan(20);
  });

  it("frames 3D camera outside object cluster", () => {
    const fit = fitCameraToSceneObjects({ objects, mode: "3D" });
    expect(fit.frame.position[0]).toBeGreaterThan(fit.center[0] - 1);
    expect(fit.frame.lookAt).toEqual(fit.center);
  });

  it("frames 2D camera above scene center", () => {
    const fit = fitCameraToSceneObjects({ objects, mode: "2D" });
    expect(fit.frame.position[1]).toBeGreaterThan(fit.center[1]);
    expect(fit.frame.lookAt[0]).toBeCloseTo(fit.center[0], 5);
  });
});

describe("clampExecutiveTypeCObjectScale", () => {
  it("allows selected objects up to 1.35", () => {
    expect(clampExecutiveTypeCObjectScale(2, { selected: true })).toBe(1.35);
    expect(clampExecutiveTypeCObjectScale(2, { selected: false })).toBe(1.15);
  });

  it("clamps zone-like objects to 0.85", () => {
    expect(
      clampExecutiveTypeCObjectScale(1.5, {
        zoneLike: isZoneLikeExecutiveObject({ label: "Operations", type: "box" }),
      })
    ).toBe(0.85);
  });
});
