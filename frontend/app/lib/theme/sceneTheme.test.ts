import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { toNexoraHudThemeTokens, resolveNexoraHudTheme } from "../scene/nexoraHudTheme";
import {
  logSceneHudThemeAdapted,
  logSceneThemeApplied,
  logSceneThemeChanged,
  resetSceneThemeInstrumentationForTests,
} from "./sceneThemeInstrumentation";
import { readStoredSceneThemeId, resolvedUiToSceneThemeId } from "./sceneThemeStore";
import {
  resolveDaySceneThemeTokens,
  resolveNightSceneThemeTokens,
  resolveSceneThemeTokens,
  SCENE_HUD_THEME_SURFACES,
} from "./sceneThemeTokens";
import { runSceneThemeValidation, resetSceneThemeValidationForTests } from "./sceneThemeValidation";

describe("sceneThemeTokens", () => {
  it("provides distinct day and night token packs", () => {
    const day = resolveDaySceneThemeTokens();
    const night = resolveNightSceneThemeTokens();
    expect(day.id).toBe("day");
    expect(night.id).toBe("night");
    expect(day.panelBackground).not.toBe(night.panelBackground);
    expect(day.hudGlowIntensity).toBeLessThan(night.hudGlowIntensity);
  });

  it("bridges to legacy hud theme tokens", () => {
    const hud = toNexoraHudThemeTokens(resolveSceneThemeTokens("night"));
    expect(hud.mode).toBe("night");
    expect(hud.panelBackground).toContain("var(--nx-bg-deep)");
    expect(resolveNexoraHudTheme("day").textPrimary).toBeTruthy();
  });

  it("registers all scene HUD surfaces for validation", () => {
    expect(SCENE_HUD_THEME_SURFACES.length).toBeGreaterThanOrEqual(8);
  });
});

describe("sceneThemeInstrumentation", () => {
  beforeEach(() => {
    resetSceneThemeInstrumentationForTests();
    resetSceneThemeValidationForTests();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs theme transitions and validation", () => {
    logSceneThemeChanged("night", "day");
    logSceneThemeApplied("day");
    logSceneHudThemeAdapted({ affectedHudCount: 8, adaptationDurationMs: 12, theme: "day" });
    runSceneThemeValidation("day");
    runSceneThemeValidation("day");
    expect(console.info).toHaveBeenCalledTimes(4);
  });
});

describe("sceneThemeStore", () => {
  it("maps resolved ui theme to scene theme id", () => {
    expect(resolvedUiToSceneThemeId("day")).toBe("day");
    expect(readStoredSceneThemeId()).toMatch(/day|night/);
  });
});
