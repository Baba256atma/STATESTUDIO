import { describe, expect, it } from "vitest";

import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo";
import {
  EXECUTIVE_MAX_WORLD_SIZE,
  EXECUTIVE_ZONE_GEOMETRY_MAX,
  resolveExecutiveNormalizedGeometry,
  resolveExecutiveNormalizedGeometryForObject,
} from "./executiveRawGeometryClamp";

describe("executiveRawGeometryClamp", () => {
  it("clamps zone-like torus geometry smaller than default torus footprint", () => {
    const normalized = resolveExecutiveNormalizedGeometry({
      type: "torus",
      zoneLike: true,
      transformScale: 1,
    });

    expect(normalized.dimensions.width).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.width);
    expect(normalized.dimensions.height).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.height);
    expect(normalized.finalWorldSize).toBeLessThanOrEqual(EXECUTIVE_MAX_WORLD_SIZE);
  });

  it("clamps operations box to a flat executive node footprint", () => {
    const operations = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_warehouse_1");
    const normalized = resolveExecutiveNormalizedGeometryForObject(operations, { transformScale: 1.2 });

    expect(normalized.dimensions.width).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.width);
    expect(normalized.dimensions.height).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.height);
    expect(normalized.dimensions.depth).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.depth);
    expect(normalized.finalWorldSize).toBeLessThanOrEqual(EXECUTIVE_MAX_WORLD_SIZE);
  });

  it("renders region-like types as compact box nodes", () => {
    const normalized = resolveExecutiveNormalizedGeometry({
      type: "region",
      zoneLike: true,
      transformScale: 2,
    });

    expect(normalized.renderKind).toBe("box");
    expect(normalized.finalWorldSize).toBeLessThanOrEqual(EXECUTIVE_MAX_WORLD_SIZE);
  });

  it("keeps price pressure under the world-size cap", () => {
    const price = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_price_1");
    const normalized = resolveExecutiveNormalizedGeometryForObject(price, { transformScale: 1.35 });

    expect(normalized.finalWorldSize).toBeLessThanOrEqual(EXECUTIVE_MAX_WORLD_SIZE);
    expect(normalized.dimensions.width).toBeLessThanOrEqual(EXECUTIVE_ZONE_GEOMETRY_MAX.width);
  });
});
