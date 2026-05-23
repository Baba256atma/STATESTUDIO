import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logObjectHudMounted,
  resetObjectInfoHudInstrumentationForTests,
} from "./objectInfoHudInstrumentation";

describe("objectInfoHudInstrumentation", () => {
  beforeEach(() => {
    resetObjectInfoHudInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetObjectInfoHudInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logObjectHudMounted();
    logObjectHudMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:9][ObjectHudMounted]");
  });
});
