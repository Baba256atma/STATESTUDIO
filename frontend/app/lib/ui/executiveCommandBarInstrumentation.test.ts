import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  logExecutiveCommandBarMounted,
  logExecutiveFrsiStatusRendered,
  logExecutiveCommandBarThemeResolved,
  resetExecutiveCommandBarInstrumentationForTests,
} from "./executiveCommandBarInstrumentation";

describe("executiveCommandBarInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveCommandBarInstrumentationForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dedupes mount and theme logs", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveCommandBarMounted();
    logExecutiveCommandBarMounted();
    logExecutiveFrsiStatusRendered(72);
    logExecutiveFrsiStatusRendered(72);
    logExecutiveCommandBarThemeResolved("night");
    logExecutiveCommandBarThemeResolved("night");
    expect(info).toHaveBeenCalledTimes(3);
    info.mockRestore();
  });
});
