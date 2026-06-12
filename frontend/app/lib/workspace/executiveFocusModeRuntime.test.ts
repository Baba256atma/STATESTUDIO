import { describe, expect, it, beforeEach } from "vitest";

import {
  getExecutiveFocusModeSnapshot,
  getExecutiveFocusModeServerSnapshot,
  hydrateExecutiveFocusMode,
  resetExecutiveFocusModeRuntimeForTests,
  setExecutiveFocusModeEnabled,
  toggleExecutiveFocusMode,
} from "./executiveFocusModeRuntime";
import { resetExecutiveFocusSnapshotIdentityLogsForTests } from "./executiveFocusStoreSnapshotContract";
import { clearExecutiveNavigationPreferenceForTests } from "./executiveNavigationPersistence";
import { resolveFocusHudVisibility } from "./focusHudVisibilityRuntime";

describe("executiveFocusModeRuntime", () => {
  beforeEach(() => {
    resetExecutiveFocusModeRuntimeForTests();
    resetExecutiveFocusSnapshotIdentityLogsForTests();
    clearExecutiveNavigationPreferenceForTests();
  });

  it("returns a stable server snapshot reference", () => {
    expect(getExecutiveFocusModeServerSnapshot()).toBe(getExecutiveFocusModeServerSnapshot());
  });

  it("returns a stable client snapshot reference between reads", () => {
    const first = getExecutiveFocusModeSnapshot();
    const second = getExecutiveFocusModeSnapshot();
    expect(first).toBe(second);
  });

  it("defaults focus mode to disabled with ANALYSIS profile", () => {
    hydrateExecutiveFocusMode();
    expect(getExecutiveFocusModeSnapshot()).toEqual({ enabled: false, profile: "ANALYSIS" });
    expect(getExecutiveFocusModeSnapshot()).toBe(getExecutiveFocusModeServerSnapshot());
  });

  it("toggles focus mode without losing profile", () => {
    toggleExecutiveFocusMode("test");
    expect(getExecutiveFocusModeSnapshot().enabled).toBe(true);
    toggleExecutiveFocusMode("test");
    expect(getExecutiveFocusModeSnapshot().enabled).toBe(false);
  });

  it("reuses default snapshot reference after toggling back to default", () => {
    toggleExecutiveFocusMode("test");
    toggleExecutiveFocusMode("test");
    expect(getExecutiveFocusModeSnapshot()).toBe(getExecutiveFocusModeServerSnapshot());
  });

  it("updates cached snapshot only when focus state changes", () => {
    const before = getExecutiveFocusModeSnapshot();
    setExecutiveFocusModeEnabled(before.enabled, "test");
    expect(getExecutiveFocusModeSnapshot()).toBe(before);
  });

  it("preserves scene panel and hides object and timeline in ANALYSIS focus profile", () => {
    const sceneInfo = resolveFocusHudVisibility({
      focusEnabled: true,
      profileId: "ANALYSIS",
      panelId: "sceneInfoHud",
      layoutVisible: true,
    });
    const objectInfo = resolveFocusHudVisibility({
      focusEnabled: true,
      profileId: "ANALYSIS",
      panelId: "objectInfoHud",
      layoutVisible: true,
    });
    const timeline = resolveFocusHudVisibility({
      focusEnabled: true,
      profileId: "ANALYSIS",
      panelId: "timelineHud",
      layoutVisible: true,
    });
    expect(sceneInfo.visible).toBe(true);
    expect(objectInfo.visible).toBe(false);
    expect(timeline.visible).toBe(false);
  });

  it("preserves scene panel across all focus profiles", () => {
    for (const profileId of ["MINIMAL", "ANALYSIS", "PRESENTATION"] as const) {
      const sceneInfo = resolveFocusHudVisibility({
        focusEnabled: true,
        profileId,
        panelId: "sceneInfoHud",
        layoutVisible: true,
      });
      expect(sceneInfo.visible).toBe(true);
    }
  });
});
