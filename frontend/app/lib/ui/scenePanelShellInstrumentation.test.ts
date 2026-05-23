import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logScenePanelShellMounted,
  resetScenePanelShellInstrumentationForTests,
} from "./scenePanelShellInstrumentation";

describe("scenePanelShellInstrumentation", () => {
  beforeEach(() => {
    resetScenePanelShellInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetScenePanelShellInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logScenePanelShellMounted();
    logScenePanelShellMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:3][ScenePanelShellMounted]");
  });
});
