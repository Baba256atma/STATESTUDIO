import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  LEFT_NAV_BUTTON_RADIUS,
  LEFT_NAV_UTILITY_BUTTON_COUNT,
  resetLeftNavDesignTokensForTests,
  resolveLeftNavButtonBorderRadius,
  resolveLeftNavInteractiveButtonCount,
  traceNexoraLeftNavStyle,
  validateLeftNavButtonRadii,
} from "./leftNavDesignTokens";

describe("leftNavDesignTokens", () => {
  beforeEach(() => {
    resetLeftNavDesignTokensForTests();
  });

  it("uses unified 4px left navigation button radius", () => {
    expect(LEFT_NAV_BUTTON_RADIUS).toBe(4);
    expect(resolveLeftNavButtonBorderRadius()).toBe(4);
  });

  it("counts primary and utility buttons for runtime diagnostics", () => {
    expect(resolveLeftNavInteractiveButtonCount(7)).toBe(7 + LEFT_NAV_UTILITY_BUTTON_COUNT);
  });

  it("validates uniform radius contract", () => {
    expect(validateLeftNavButtonRadii([4, 4, 4])).toBe(true);
    expect(validateLeftNavButtonRadii([4, 12])).toBe(false);
  });

  it("logs NexoraLeftNavStyle diagnostics and brakes on mixed radii", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    traceNexoraLeftNavStyle({ buttonCount: 9, observedRadii: [4, 4, 4] });
    expect(log.mock.calls.some((call) => String(call[0]).includes("[NexoraLeftNavStyle] radius=4"))).toBe(true);
    expect(log.mock.calls.some((call) => String(call[0]).includes("uniformRadius=true"))).toBe(true);

    resetLeftNavDesignTokensForTests();
    traceNexoraLeftNavStyle({ buttonCount: 9, observedRadii: [4, 12] });
    expect(warn.mock.calls.some((call) => String(call[0]).includes("mixed_corner_radius_detected"))).toBe(true);

    log.mockRestore();
    warn.mockRestore();
  });
});
