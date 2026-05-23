import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { resolveNexoraHudTheme } from "../scene/nexoraHudTheme";
import {
  logWorkspaceAppearanceModeChanged,
  logWorkspaceAppearanceMounted,
  logWorkspaceAppearancePreferenceRestored,
  logWorkspaceAppearanceThemeApplied,
  logWorkspaceHudThemeUpdated,
  logWorkspaceSceneThemeUpdated,
  resetWorkspaceAppearanceInstrumentationForTests,
} from "./workspaceAppearanceInstrumentation";
import { toWorkspaceAppearanceSettings } from "./workspaceAppearanceTypes";
import { resolveThemeMode } from "./nexoraUiTheme";

describe("workspaceAppearanceTypes", () => {
  it("maps resolved ui theme to workspace settings", () => {
    expect(toWorkspaceAppearanceSettings("night")).toEqual({ mode: "night" });
    expect(toWorkspaceAppearanceSettings("day")).toEqual({ mode: "day" });
  });
});

describe("resolveNexoraHudTheme semantic tokens", () => {
  it("exposes E2:17 semantic tokens for day and night", () => {
    const night = resolveNexoraHudTheme("night");
    const day = resolveNexoraHudTheme("day");

    expect(night.panelBackground).toBe(night.shellBackground);
    expect(day.panelBackground).toBe(day.shellBackground);
    expect(night.accent).toContain("var(--nx-accent)");
    expect(night.success).toContain("var(--nx-success)");
    expect(night.critical).toContain("var(--nx-risk)");
    expect(night.panelGlow).not.toEqual(day.panelGlow);
  });
});

describe("workspaceAppearanceInstrumentation", () => {
  beforeEach(() => {
    resetWorkspaceAppearanceInstrumentationForTests();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs E2:17 events once where deduped", () => {
    logWorkspaceAppearanceMounted();
    logWorkspaceAppearanceMounted();
    logWorkspaceAppearanceThemeApplied("night");
    logWorkspaceAppearanceThemeApplied("night");
    logWorkspaceHudThemeUpdated("night");
    logWorkspaceSceneThemeUpdated("night");
    logWorkspaceAppearancePreferenceRestored("night", "night");

    expect(console.info).toHaveBeenCalledTimes(5);
  });

  it("logs mode changes on each toggle", () => {
    logWorkspaceAppearanceModeChanged("day");
    logWorkspaceAppearanceModeChanged("night");
    expect(console.info).toHaveBeenCalledTimes(2);
  });
});

describe("resolveThemeMode", () => {
  it("defaults auto to night when system prefers dark", () => {
    expect(resolveThemeMode("auto", true)).toBe("night");
    expect(resolveThemeMode("auto", false)).toBe("day");
  });
});
