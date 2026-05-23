import { describe, expect, it } from "vitest";

import { buildExecutiveScenarioComparisonModel, mapScenarioSuggestionToComparisonOption } from "./buildExecutiveScenarioComparisonModel";
import { DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS } from "./scenarioSuggestionTypes";

describe("buildExecutiveScenarioComparisonModel", () => {
  it("maps scenario suggestions into comparison options with summary", () => {
    const model = buildExecutiveScenarioComparisonModel({
      scenarios: DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS,
    });

    expect(model.options.length).toBeGreaterThanOrEqual(2);
    expect(model.summary.bestOptionTitle.length).toBeGreaterThan(0);
    expect(model.summary.nextSuggestedAction).toContain("Simulate");
    expect(model.options[0]?.title).toBeTruthy();
  });

  it("prioritizes focus scenario ids when comparing", () => {
    const model = buildExecutiveScenarioComparisonModel({
      scenarios: DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS,
      focusScenarioIds: ["find_alt_supplier", "expedite_supplier_b"],
    });

    expect(model.options.map((option) => option.id)).toEqual(
      expect.arrayContaining(["find_alt_supplier", "expedite_supplier_b"])
    );
  });

  it("maps executive comparison fields from a scenario suggestion", () => {
    const option = mapScenarioSuggestionToComparisonOption(DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS[1]!);
    expect(option.title).toBe("Find Alternative Supplier");
    expect(option.confidence).toBe(78);
    expect(option.expectedFrsiImpact).toBe(-25);
    expect(option.riskChange).toBe("lower");
  });
});
