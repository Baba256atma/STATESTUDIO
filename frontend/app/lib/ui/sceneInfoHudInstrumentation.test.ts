import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logSceneInfoHudMounted,
  resetSceneInfoHudInstrumentationForTests,
} from "./sceneInfoHudInstrumentation";

describe("sceneInfoHudInstrumentation", () => {
  beforeEach(() => {
    resetSceneInfoHudInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetSceneInfoHudInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logSceneInfoHudMounted();
    logSceneInfoHudMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:8][SceneInfoHudMounted]");
  });
});
