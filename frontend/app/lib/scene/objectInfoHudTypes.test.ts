import { describe, expect, it } from "vitest";

import { buildObjectInfoHudModel } from "./objectInfoHudTypes";

describe("buildObjectInfoHudModel", () => {
  it("returns placeholder model when no object is selected", () => {
    expect(buildObjectInfoHudModel({ selectedObjectId: null }).selectedObjectId).toBeNull();
  });

  it("maps executive panel and object details into HUD model", () => {
    const model = buildObjectInfoHudModel({
      selectedObjectId: "supplier_a",
      sceneJson: {
        state_vector: {},
        scene: {
          objects: [
            { id: "supplier_a", label: "Supplier A" },
            { id: "warehouse_b", label: "Warehouse B" },
          ],
          relationships: [
            {
              id: "rel_1",
              sourceId: "supplier_a",
              targetId: "warehouse_b",
              type: "supplies",
              direction: "uni",
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        },
      },
      objectDetails: {
        id: "supplier_a",
        title: "Supplier A",
        label: "Supplier A",
        type: "supplier",
        resolved: true,
        emphasis: 0.82,
        scanner_reason: "Delay detected",
        currentStatusSummary: "Supplier delay is increasing downstream inventory pressure.",
        relatedSignals: [],
        suggestedActions: [],
      },
      executivePanelData: {
        objectId: "supplier_a",
        objectName: "Supplier A",
        insight: "Supplier delay is increasing downstream inventory pressure.",
        riskLevel: "high",
        recommendedAction: "Review alternate suppliers.",
        confidence: 0.71,
      },
    });

    expect(model.objectName).toBe("Supplier A");
    expect(model.statusLabel).toBe("High Risk");
    expect(model.signals).toContain("Delay detected");
    expect(model.executiveSummary).toContain("Supplier delay");
    expect(model.relationshipCount).toBe(1);
    expect(model.outgoingRelationships?.[0]).toContain("Warehouse B");
  });
});
