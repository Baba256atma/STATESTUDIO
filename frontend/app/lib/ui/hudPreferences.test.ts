import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { applyHudPreferencesToLayoutContract, isHudPanelVisible, resolveHudPanelDock } from "./hudPreferencesController";
import { getRegisteredHudPanels } from "./hudPanelRegistry";
import {
  logHudDockChanged,
  logHudPreferencesMounted,
  logHudPreferenceRestored,
  logHudVisibilityChanged,
  resetHudPreferencesInstrumentationForTests,
} from "./hudPreferencesInstrumentation";
import { mergeHudPreferences, readStoredHudPreferences } from "./hudPreferencesStore";
import { resolveWorkspaceLayoutContract } from "./workspaceLayoutController";

describe("hudPanelRegistry", () => {
  it("registers all executive HUD panels", () => {
    const ids = getRegisteredHudPanels().map((panel) => panel.id);
    expect(ids).toContain("sceneInfoHud");
    expect(ids).toContain("timelineHud");
    expect(ids).toContain("aiAssistant");
    expect(ids).toContain("commandBar");
  });
});

describe("applyHudPreferencesToLayoutContract", () => {
  it("applies visibility, size, and dock overrides", () => {
    const base = resolveWorkspaceLayoutContract("executive", 1440);
    const preferences = mergeHudPreferences({
      visibility: { timelineHud: "hidden", sceneInfoHud: "visible" },
      size: { timelineHud: "expanded", sceneInfoHud: "compact" },
      dock: { timelineHud: "top", objectInfoHud: "left" },
    });
    const merged = applyHudPreferencesToLayoutContract(base, preferences);

    expect(merged.hud.timelineHud.visible).toBe(false);
    expect(merged.hud.sceneInfoHud.sizeMode).toBe("compact");
    expect(merged.hud.timelineHud.top).toBeDefined();
    expect(merged.hud.objectInfoHud.left).toBeDefined();
    expect(resolveHudPanelDock(preferences, "timelineHud")).toBe("top");
    expect(isHudPanelVisible(preferences, "timelineHud")).toBe(false);
  });
});

describe("hudPreferencesInstrumentation", () => {
  beforeEach(() => {
    resetHudPreferencesInstrumentationForTests();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs mount and restore once", () => {
    logHudPreferencesMounted();
    logHudPreferencesMounted();
    logHudPreferenceRestored(getRegisteredHudPanels().length);
    expect(console.info).toHaveBeenCalledTimes(2);
  });

  it("logs preference changes", () => {
    logHudVisibilityChanged("sceneInfoHud", "hidden");
    logHudDockChanged("timelineHud", "top");
    expect(console.info).toHaveBeenCalledTimes(2);
  });
});

describe("readStoredHudPreferences", () => {
  it("returns merged defaults when storage is empty", () => {
    const prefs = readStoredHudPreferences();
    expect(isHudPanelVisible(prefs, "sceneInfoHud")).toBe(true);
    expect(prefs.size.sceneInfoHud).toBe("normal");
  });
});
