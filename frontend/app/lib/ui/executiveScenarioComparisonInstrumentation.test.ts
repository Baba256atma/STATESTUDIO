import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  logExecutiveScenarioComparisonWorkspaceMounted,
  logExecutiveScenarioComparisonSimulationRequested,
  logExecutiveScenarioDecisionEvaluationRendered,
  resetExecutiveScenarioComparisonInstrumentationForTests,
} from "./executiveScenarioComparisonInstrumentation";

describe("executiveScenarioComparisonInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveScenarioComparisonInstrumentationForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dedupes workspace mount logs", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveScenarioComparisonWorkspaceMounted();
    logExecutiveScenarioComparisonWorkspaceMounted();
    expect(info).toHaveBeenCalledTimes(1);
    info.mockRestore();
  });

  it("emits simulation and evaluation traces", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveScenarioComparisonSimulationRequested({ scenarioId: "a", title: "Scenario A" });
    logExecutiveScenarioDecisionEvaluationRendered("a");
    expect(info).toHaveBeenCalledWith("[Nexora][E2:14][SimulationRequested]", {
      scenarioId: "a",
      title: "Scenario A",
    });
    expect(info).toHaveBeenCalledWith("[Nexora][E2:14][DecisionEvaluationRendered]", { bestOptionId: "a" });
    info.mockRestore();
  });
});
