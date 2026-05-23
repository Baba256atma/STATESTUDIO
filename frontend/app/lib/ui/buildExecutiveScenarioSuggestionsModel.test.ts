import { describe, expect, it } from "vitest";

import { buildExecutiveScenarioSuggestionsModel } from "./buildExecutiveScenarioSuggestionsModel";
import { DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS } from "./scenarioSuggestionTypes";

describe("buildExecutiveScenarioSuggestionsModel", () => {
  it("returns demo scenarios when recommendation is missing", () => {
    const model = buildExecutiveScenarioSuggestionsModel(null);
    expect(model.scenarios.length).toBe(DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS.length);
    expect(model.compareReady).toBe(true);
    expect(model.scenarios[0]?.title).toBe("Expedite Supplier B");
  });

  it("maps canonical recommendation primary and alternatives", () => {
    const model = buildExecutiveScenarioSuggestionsModel({
      id: "reco:test",
      primary: { action: "Expedite Supplier B", impact_summary: "High recovery potential" },
      alternatives: [{ action: "Find Alternative Supplier", tradeoff: "Higher onboarding cost" }],
      reasoning: { why: "Supplier concentration is elevated." },
      confidence: { score: 0.78, level: "high" },
      source: "ai_reasoning",
      created_at: Date.now(),
    });

    expect(model.scenarios[0]?.title).toBe("Expedite Supplier B");
    expect(model.scenarios[0]?.status).toBe("recommended");
    expect(model.scenarios.some((entry) => entry.title === "Find Alternative Supplier")).toBe(true);
    expect(model.compareReady).toBe(true);
  });
});
