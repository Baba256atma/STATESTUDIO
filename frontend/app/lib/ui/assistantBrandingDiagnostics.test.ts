import { afterEach, describe, expect, it, vi } from "vitest";

import {
  resetAssistantBrandingDiagnosticsForTests,
  traceAssistantBrandingTitle,
  traceLegacyAssistantTitleRemoved,
} from "./assistantBrandingDiagnostics";
import { ASSISTANT_SURFACE_TITLE } from "./assistantBrandingContract";

describe("assistantBrandingDiagnostics", () => {
  afterEach(() => {
    resetAssistantBrandingDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("logs assistant title once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceAssistantBrandingTitle();
    traceAssistantBrandingTitle();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraBranding]\nassistantTitle=nexora");
  });

  it("logs legacy title removal once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceLegacyAssistantTitleRemoved();
    traceLegacyAssistantTitleRemoved();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraBranding]\nlegacyAssistantTitleRemoved=true");
  });
});

describe("assistantBrandingContract", () => {
  it("uses executive Title Case identity", () => {
    expect(ASSISTANT_SURFACE_TITLE).toBe("Nexora");
  });
});
