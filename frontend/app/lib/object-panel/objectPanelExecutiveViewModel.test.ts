import { describe, expect, it } from "vitest";

import { buildObjectPanelExecutiveViewModel } from "./objectPanelExecutiveViewModel.ts";

describe("objectPanelExecutiveViewModel", () => {
  it("maps existing panel data into executive hierarchy fields", () => {
    const model = {
      objectId: "obj-a",
      objectName: "Revenue Node",
      objectType: "Source",
      status: "Active",
      riskLevel: "medium",
      connections: 4,
      dependencies: 2,
      scenarios: 1,
    };
    const view = buildObjectPanelExecutiveViewModel({
      model,
      data: {
        objectId: "obj-a",
        insight: "Elevated dependency risk detected.",
        recommendedAction: "Review upstream inputs.",
        riskLevel: "medium",
        confidence: 0.82,
        connectionCount: 4,
        dependencyCount: 2,
        affectedObjects: ["obj-b"],
      },
    });

    expect(view.executiveSummary).toContain("Elevated dependency risk");
    expect(view.signals.impact).toBe("Moderate");
    expect(view.signals.confidence).toBe("82%");
    expect(view.insights.length).toBeGreaterThan(0);
    expect(view.insights.length).toBeLessThanOrEqual(3);
    expect(view.relationships.connectedObjects).toBe(4);
  });
});
