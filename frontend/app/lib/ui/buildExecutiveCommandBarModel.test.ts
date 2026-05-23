import { describe, expect, it } from "vitest";

import { buildExecutiveCommandBarModel } from "./buildExecutiveCommandBarModel";
import { createInitialPipelineStatusUi } from "../../screens/nexoraPipelineStatus";

describe("buildExecutiveCommandBarModel", () => {
  it("builds default mission-control status blocks", () => {
    const model = buildExecutiveCommandBarModel({
      pipelineStatus: createInitialPipelineStatusUi(),
      domainLabel: "Supply Chain",
    });

    expect(model.frsi.fragilityLabel).toBe("Assessing");
    expect(model.scenario.name).toBe("Supply Chain");
    expect(model.decision.label).toBe("Pending");
    expect(model.readiness.label).toBe("Monitoring");
    expect(model.actions).toContain("analyze");
  });

  it("derives high-risk FRSI and readiness from pipeline status", () => {
    const model = buildExecutiveCommandBarModel({
      pipelineStatus: {
        ...createInitialPipelineStatusUi(),
        status: "ready",
        fragilityLevel: "high",
        decisionTone: "urgent",
        decisionPosture: "Recommended action under review",
        insightLine: "Supplier dependency risk is increasing.",
      },
      selectedScenarioTitle: "Find Alternative Supplier",
    });

    expect(model.frsi.score).toBe(72);
    expect(model.frsi.fragilityLabel).toBe("High Risk");
    expect(model.frsi.trendLabel).toContain("Increasing");
    expect(model.scenario.name).toBe("Find Alternative Supplier");
    expect(model.decision.label).toBe("Under Review");
    expect(model.miniInsight).toBe("Supplier dependency risk is increasing.");
  });
});
