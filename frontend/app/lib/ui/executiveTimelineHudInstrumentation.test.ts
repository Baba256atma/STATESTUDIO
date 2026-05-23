import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logExecutiveTimelineMounted,
  resetExecutiveTimelineHudInstrumentationForTests,
} from "./executiveTimelineHudInstrumentation";

describe("executiveTimelineHudInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveTimelineHudInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetExecutiveTimelineHudInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logExecutiveTimelineMounted();
    logExecutiveTimelineMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:10][TimelineMounted]");
  });
});
