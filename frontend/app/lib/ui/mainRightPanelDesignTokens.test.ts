import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  MRP_TAB_DISPLAY_LABELS,
  MRP_TAB_RADIUS,
  resetMainRightPanelDesignTokensForTests,
  resolveMrpTabBorderRadius,
  traceNexoraMRPTabs,
  validateMrpTabRadii,
} from "./mainRightPanelDesignTokens";

describe("mainRightPanelDesignTokens", () => {
  beforeEach(() => {
    resetMainRightPanelDesignTokensForTests();
  });

  it("uses unified 4px MRP tab radius", () => {
    expect(MRP_TAB_RADIUS).toBe(4);
    expect(resolveMrpTabBorderRadius()).toBe(4);
    expect(MRP_TAB_DISPLAY_LABELS).toEqual(["Insight", "Assistant"]);
  });

  it("validates uniform tab radius contract", () => {
    expect(validateMrpTabRadii([4, 4])).toBe(true);
    expect(validateMrpTabRadii([4, 999])).toBe(false);
  });

  it("logs NexoraMRPTabs diagnostics and brakes on radius mismatch", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    traceNexoraMRPTabs({ observedRadii: [4, 4] });
    expect(log.mock.calls.some((call) => String(call[0]).includes("[NexoraMRPTabs] tabRadius=4"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("tabs=Insight,Assistant"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("uniformRadius=true"))).toBe(true);

    resetMainRightPanelDesignTokensForTests();
    traceNexoraMRPTabs({ observedRadii: [4, 12] });
    expect(warn.mock.calls.some((call) => String(call[0]).includes("radius_mismatch"))).toBe(true);

    log.mockRestore();
    warn.mockRestore();
  });
});
