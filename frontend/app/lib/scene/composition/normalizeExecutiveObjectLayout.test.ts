import { describe, expect, it } from "vitest";

import {
  classifyExecutiveObjectLayoutRole,
  normalizeExecutiveObjectLayout,
  resetExecutiveObjectLayoutForTests,
} from "./normalizeExecutiveObjectLayout";
import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo";

describe("normalizeExecutiveObjectLayout", () => {
  it("assigns unique positions with minimum spacing for the retail demo", () => {
    resetExecutiveObjectLayoutForTests();
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);

    expect(layout.objectCount).toBe(10);
    expect(layout.layoutPreset).toBe("executive_operational_map");
    expect(layout.overlapCountAfter).toBe(0);
    expect(Object.keys(layout.positions)).toHaveLength(10);

    const positions = Object.values(layout.positions);
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const dx = positions[i][0] - positions[j][0];
        const dy = positions[i][1] - positions[j][1];
        const dz = positions[i][2] - positions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        expect(dist).toBeGreaterThanOrEqual(1.8);
      }
    }
  });

  it("places Operations at center and Price Pressure away from center", () => {
    resetExecutiveObjectLayoutForTests();
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);
    const operations = layout.positions.obj_warehouse_1;
    const price = layout.positions.obj_price_1;
    expect(operations).toEqual([0, 0, 0]);
    const priceDist = Math.sqrt(price[0] ** 2 + price[1] ** 2 + price[2] ** 2);
    expect(priceDist).toBeGreaterThan(1.5);
  });

  it("classifies operations and pressure roles", () => {
    const operations = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_warehouse_1");
    const price = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_price_1");
    expect(classifyExecutiveObjectLayoutRole(operations)).toBe("center");
    expect(classifyExecutiveObjectLayoutRole(price)).toBe("risk");
  });
});
