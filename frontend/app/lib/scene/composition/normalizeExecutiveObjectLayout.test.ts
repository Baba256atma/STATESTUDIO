import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  classifyExecutiveObjectLayoutRole,
  normalizeExecutiveObjectLayout,
  resetExecutiveObjectLayoutForTests,
} from "./normalizeExecutiveObjectLayout";
import { resolveExecutiveLayoutTemplate } from "./resolveExecutiveLayoutTemplate";
import { assertExecutiveLayoutGroundPlane } from "./executiveLayoutTemplateSlots";
import { retailSupplyChainDemoScene } from "../../demo/retailSupplyChainDemo";

describe("normalizeExecutiveObjectLayout", () => {
  beforeEach(() => {
    resetExecutiveObjectLayoutForTests();
    vi.restoreAllMocks();
  });

  it("assigns unique positions with minimum spacing for the retail demo", () => {
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);

    expect(layout.objectCount).toBe(10);
    expect(layout.layoutTemplateId).toBe("supply_chain");
    expect(layout.layoutPreset).toBe("supply_chain_executive_map");
    expect(layout.overlapCountAfter).toBe(0);
    expect(Object.keys(layout.positions)).toHaveLength(10);
    expect(assertExecutiveLayoutGroundPlane(layout.positions)).toBe(true);

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

  it("arranges supply-chain flow nodes left-to-right", () => {
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);
    const supplier = layout.positions.obj_supplier_1;
    const delivery = layout.positions.obj_delivery_1;
    const inventory = layout.positions.obj_inventory_1;
    const operations = layout.positions.obj_warehouse_1;
    const fulfillment = layout.positions.obj_order_flow_1;

    expect(layout.layoutTemplateId).toBe("supply_chain");
    expect(supplier[0]).toBeLessThan(delivery[0]);
    expect(delivery[0]).toBeLessThan(inventory[0]);
    expect(inventory[0]).toBeLessThan(operations[0]);
    expect(operations[0]).toBeLessThan(fulfillment[0]);
    expect(supplier[1]).toBe(0);
    expect(fulfillment[1]).toBe(0);
  });

  it("places pressure and outcome nodes off the main flow lane", () => {
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    const layout = normalizeExecutiveObjectLayout(objects);
    const price = layout.positions.obj_price_1;
    const customer = layout.positions.obj_customer_satisfaction_1;
    const delivery = layout.positions.obj_delivery_1;

    expect(Math.abs(price[2])).toBeLessThan(Math.abs(delivery[2]));
    expect(customer[2]).toBeLessThan(delivery[2]);
  });

  it("classifies operations and pressure roles", () => {
    const operations = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_warehouse_1");
    const price = retailSupplyChainDemoScene.scene?.objects?.find((obj) => obj.id === "obj_price_1");
    expect(classifyExecutiveObjectLayoutRole(operations)).toBe("center");
    expect(classifyExecutiveObjectLayoutRole(price)).toBe("risk");
  });
});

describe("resolveExecutiveLayoutTemplate", () => {
  it("selects project_pmo for milestone-heavy scenes", () => {
    const resolution = resolveExecutiveLayoutTemplate({
      objectCount: 8,
      objectRoles: [
        { id: "a", role: "center", label: "Project Goal", tokens: ["project", "goal", "strategy"] },
        { id: "b", role: "flow", label: "Milestone Alpha", tokens: ["milestone", "phase"] },
        { id: "c", role: "flow", label: "Task Backlog", tokens: ["task", "backlog"] },
        { id: "d", role: "risk", label: "Schedule Risk", tokens: ["risk", "delay"] },
        { id: "e", role: "other", label: "Resource Pool", tokens: ["resource", "capacity"] },
        { id: "f", role: "other", label: "Budget", tokens: ["budget", "cost"] },
        { id: "g", role: "outcome", label: "Stakeholder Review", tokens: ["stakeholder", "decision"] },
        { id: "h", role: "flow", label: "Delivery", tokens: ["delivery", "milestone"] },
      ],
    });
    expect(resolution.templateId).toBe("project_pmo");
  });

  it("selects financial for finance-oriented scenes", () => {
    const resolution = resolveExecutiveLayoutTemplate({
      domainId: "finance",
      objectCount: 7,
      objectRoles: [
        { id: "a", role: "flow", label: "Revenue", tokens: ["revenue", "income"] },
        { id: "b", role: "flow", label: "Margin", tokens: ["margin", "profit"] },
        { id: "c", role: "center", label: "Cash Flow", tokens: ["cash flow", "liquidity"] },
        { id: "d", role: "risk", label: "Debt", tokens: ["debt", "liability"] },
        { id: "e", role: "risk", label: "Operating Cost", tokens: ["cost", "expense"] },
        { id: "f", role: "outcome", label: "Forecast", tokens: ["forecast", "projection"] },
        { id: "g", role: "outcome", label: "Investment Decision", tokens: ["investment", "decision"] },
      ],
    });
    expect(resolution.templateId).toBe("financial");
  });

  it("logs layout template resolution once", () => {
    resetExecutiveObjectLayoutForTests();
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const objects = retailSupplyChainDemoScene.scene?.objects ?? [];
    normalizeExecutiveObjectLayout(objects);
    normalizeExecutiveObjectLayout(objects);
    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][LayoutTemplateResolved]");
    expect(logs).toHaveLength(1);
  });
});
