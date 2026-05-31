import { describe, expect, it, beforeEach } from "vitest";

import { SSR_EXECUTIVE_ORIENTATION_SNAPSHOT } from "./executiveHydrationContract";
import {
  getExecutiveOrientationHydrationSnapshot,
  resolveExecutiveOrientationPanelVisible,
  resolveExecutiveOrientationWelcomeVisible,
  resolveOrientationWelcomeFromStorage,
  resetExecutiveOrientationVisibilityLogsForTests,
} from "./executiveOrientationVisibilityRuntime";
import { getExecutiveOrientationServerSnapshot } from "./orientation/executiveOrientationRuntime";

describe("executiveOrientationVisibilityRuntime", () => {
  beforeEach(() => {
    resetExecutiveOrientationVisibilityLogsForTests();
  });

  it("uses a stable SSR hydration snapshot with welcome suppressed", () => {
    expect(getExecutiveOrientationHydrationSnapshot()).toBe(SSR_EXECUTIVE_ORIENTATION_SNAPSHOT);
    expect(getExecutiveOrientationServerSnapshot()).toBe(SSR_EXECUTIVE_ORIENTATION_SNAPSHOT);
    expect(getExecutiveOrientationHydrationSnapshot().isFirstVisit).toBe(false);
    expect(getExecutiveOrientationHydrationSnapshot().welcomeDismissed).toBe(true);
  });

  it("keeps welcome hidden until hydration completes", () => {
    expect(
      resolveExecutiveOrientationWelcomeVisible({
        hydrated: false,
        surfaceEnabled: true,
        welcomeShowWelcome: true,
        centerComponentActive: false,
      })
    ).toBe(false);
    expect(
      resolveExecutiveOrientationWelcomeVisible({
        hydrated: true,
        surfaceEnabled: true,
        welcomeShowWelcome: true,
        centerComponentActive: false,
      })
    ).toBe(true);
  });

  it("respects center component and surface gating after hydration", () => {
    expect(
      resolveExecutiveOrientationWelcomeVisible({
        hydrated: true,
        surfaceEnabled: true,
        welcomeShowWelcome: true,
        centerComponentActive: true,
      })
    ).toBe(false);
    expect(
      resolveExecutiveOrientationWelcomeVisible({
        hydrated: true,
        surfaceEnabled: false,
        welcomeShowWelcome: true,
        centerComponentActive: false,
      })
    ).toBe(false);
  });

  it("derives storage visibility from orientation snapshot", () => {
    expect(
      resolveOrientationWelcomeFromStorage({
        tier: "firstVisit",
        visitCount: 1,
        welcomeDismissed: false,
        isFirstVisit: true,
      })
    ).toBe(true);
    expect(
      resolveOrientationWelcomeFromStorage({
        tier: "returningUser",
        visitCount: 2,
        welcomeDismissed: false,
        isFirstVisit: false,
      })
    ).toBe(false);
  });

  it("keeps orientation panel hidden until hydration", () => {
    expect(
      resolveExecutiveOrientationPanelVisible({
        hydrated: false,
        surfaceEnabled: true,
        tier: "firstVisit",
        overlayAllowed: true,
      })
    ).toBe(false);
    expect(
      resolveExecutiveOrientationPanelVisible({
        hydrated: true,
        surfaceEnabled: true,
        tier: "firstVisit",
        overlayAllowed: true,
      })
    ).toBe(true);
  });
});
