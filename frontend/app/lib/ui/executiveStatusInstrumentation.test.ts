import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logExecutiveStatusHudMounted,
  resetExecutiveStatusInstrumentationForTests,
} from "./executiveStatusInstrumentation";

describe("executiveStatusInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveStatusInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetExecutiveStatusInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logExecutiveStatusHudMounted();
    logExecutiveStatusHudMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][ExecutiveStatusMounted]");
  });
});
