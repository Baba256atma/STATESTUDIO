import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logSceneNavigationToolbarMounted,
  resetSceneNavigationInstrumentationForTests,
} from "./sceneNavigationInstrumentation";

describe("sceneNavigationInstrumentation", () => {
  beforeEach(() => {
    resetSceneNavigationInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetSceneNavigationInstrumentationForTests();
  });

  it("logs toolbar mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logSceneNavigationToolbarMounted();
    logSceneNavigationToolbarMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][ToolbarMounted]");
  });
});
