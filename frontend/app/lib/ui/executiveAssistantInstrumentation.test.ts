import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  logExecutiveAssistantCollapsed,
  logExecutiveAssistantExpanded,
  logExecutiveAssistantMounted,
  logExecutiveAssistantThemeResolved,
  resetExecutiveAssistantInstrumentationForTests,
} from "./executiveAssistantInstrumentation";

describe("executiveAssistantInstrumentation", () => {
  beforeEach(() => {
    resetExecutiveAssistantInstrumentationForTests();
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dedupes mount and theme logs", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveAssistantMounted();
    logExecutiveAssistantMounted();
    logExecutiveAssistantThemeResolved("night");
    logExecutiveAssistantThemeResolved("night");
    expect(info).toHaveBeenCalledTimes(2);
    info.mockRestore();
  });

  it("emits collapse and expand traces", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveAssistantCollapsed();
    logExecutiveAssistantExpanded();
    expect(info).toHaveBeenCalledWith("[Nexora][E2:12][AssistantCollapsed]");
    expect(info).toHaveBeenCalledWith("[Nexora][E2:12][AssistantExpanded]");
    info.mockRestore();
  });
});
