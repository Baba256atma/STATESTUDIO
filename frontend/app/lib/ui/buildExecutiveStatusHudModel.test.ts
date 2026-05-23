import { describe, expect, it } from "vitest";

import { buildExecutiveStatusHudModel } from "./buildExecutiveStatusHudModel";
import { createInitialPipelineStatusUi } from "../../screens/nexoraPipelineStatus";

describe("buildExecutiveStatusHudModel", () => {
  it("aggregates pipeline status without inventing confidence", () => {
    const model = buildExecutiveStatusHudModel({
      pipelineStatus: {
        ...createInitialPipelineStatusUi(),
        status: "ready",
        fragilityLevel: "high",
        confidenceScore: 0.81,
        confidenceTier: "high",
        insightLine: "Supply-chain risk continues to increase.",
      },
      selectedScenarioTitle: "Recovery Scenario",
      domainLabel: "Operations",
    });

    expect(model.frsiScore).toBe(72);
    expect(model.confidenceDecision).toBe("81%");
    expect(model.readinessLabel).toBe("Needs Attention");
    expect(model.headline).toContain("Supply-chain risk");
    expect(model.snapshot.frsi).toBe(72);
    expect(model.snapshot.confidence).toBe(81);
    expect(model.chips).toHaveLength(4);
  });

  it("falls back safely when confidence is unavailable", () => {
    const model = buildExecutiveStatusHudModel({
      pipelineStatus: createInitialPipelineStatusUi(),
    });

    expect(model.confidenceDecision).toBeNull();
    expect(model.healthLabel).toBe("Attention");
    expect(model.snapshot.confidence).toBeUndefined();
  });
});
