import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logObjectPanelShellMounted,
  resetObjectPanelShellInstrumentationForTests,
} from "./objectPanelShellInstrumentation";

describe("objectPanelShellInstrumentation", () => {
  beforeEach(() => {
    resetObjectPanelShellInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetObjectPanelShellInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logObjectPanelShellMounted();
    logObjectPanelShellMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:4][ObjectPanelShellMounted]");
  });
});
