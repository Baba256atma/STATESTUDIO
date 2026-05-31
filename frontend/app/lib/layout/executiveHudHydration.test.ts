import { describe, expect, it, beforeEach } from "vitest";

import { EXECUTIVE_HUD_SSR_LAYOUT, EXECUTIVE_HUD_SSR_VIEWPORT } from "./executiveHudSSRContract";
import {
  getExecutiveHudViewport,
  getExecutiveHudViewportWidth,
  isExecutiveHudLayoutHydrated,
  markExecutiveHudLayoutHydrated,
  resetExecutiveHudHydrationForTests,
} from "./executiveHudHydrationRuntime";
import { resolveExecutiveRightRailWidth } from "./executiveRightRailLayoutRuntime";

describe("executiveHudHydrationRuntime", () => {
  beforeEach(() => {
    resetExecutiveHudHydrationForTests();
  });

  it("uses SSR viewport before hydration", () => {
    expect(isExecutiveHudLayoutHydrated()).toBe(false);
    expect(getExecutiveHudViewportWidth()).toBe(EXECUTIVE_HUD_SSR_VIEWPORT.width);
    expect(getExecutiveHudViewport()).toEqual(EXECUTIVE_HUD_SSR_VIEWPORT);
  });

  it("keeps right rail at SSR width before hydration", () => {
    expect(resolveExecutiveRightRailWidth("executive")).toBe(EXECUTIVE_HUD_SSR_LAYOUT.rightRailWidth);
  });

  it("marks hydration and allows responsive viewport reads", () => {
    markExecutiveHudLayoutHydrated();
    expect(isExecutiveHudLayoutHydrated()).toBe(true);
    expect(getExecutiveHudViewportWidth()).toBeGreaterThanOrEqual(320);
  });
});
