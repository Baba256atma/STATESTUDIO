import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  logExecutiveQuickActionsMounted,
  logExecutiveQuickActionAnalyzeRequested,
  resetExecutiveQuickActionsInstrumentationForTests,
} from "./executiveQuickActionsInstrumentation";

describe("executiveQuickActionsInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveQuickActionsInstrumentationForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dedupes mount logs", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveQuickActionsMounted();
    logExecutiveQuickActionsMounted();
    expect(info).toHaveBeenCalledTimes(1);
    info.mockRestore();
  });

  it("emits analyze requested trace", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveQuickActionAnalyzeRequested({ hasObjectSelection: false, label: "Analyze System" });
    expect(info).toHaveBeenCalledWith("[Nexora][E2:16][AnalyzeRequested]", {
      hasObjectSelection: false,
      label: "Analyze System",
    });
    info.mockRestore();
  });
});
