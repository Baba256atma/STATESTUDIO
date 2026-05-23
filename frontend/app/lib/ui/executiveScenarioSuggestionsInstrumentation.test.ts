import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  logExecutiveScenarioCompareRequested,
  logExecutiveScenarioPanelMounted,
  logExecutiveScenarioThemeResolved,
  resetExecutiveScenarioSuggestionsInstrumentationForTests,
} from "./executiveScenarioSuggestionsInstrumentation";

describe("executiveScenarioSuggestionsInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveScenarioSuggestionsInstrumentationForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dedupes mount and theme logs", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveScenarioPanelMounted();
    logExecutiveScenarioPanelMounted();
    logExecutiveScenarioThemeResolved("day");
    logExecutiveScenarioThemeResolved("day");
    expect(info).toHaveBeenCalledTimes(2);
    info.mockRestore();
  });

  it("emits compare requested trace", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveScenarioCompareRequested({ selectedScenarioIds: ["a", "b"] });
    expect(info).toHaveBeenCalledWith("[Nexora][E2:13][CompareRequested]", {
      selectedScenarioIds: ["a", "b"],
    });
    info.mockRestore();
  });
});
