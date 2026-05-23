import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  logCameraToolbarMounted,
  resetCameraToolbarInstrumentationForTests,
} from "./cameraToolbarInstrumentation";

describe("cameraToolbarInstrumentation", () => {
  beforeEach(() => {
    resetCameraToolbarInstrumentationForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetCameraToolbarInstrumentationForTests();
  });

  it("logs mount once in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    logCameraToolbarMounted();
    logCameraToolbarMounted();
    expect(info).toHaveBeenCalledTimes(1);
    expect(info.mock.calls[0]?.[0]).toBe("[Nexora][E2:11][CameraToolbarMounted]");
  });
});
