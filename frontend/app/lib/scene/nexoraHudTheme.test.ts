import { describe, expect, it } from "vitest";

import {
  CAMERA_TOOLBAR_ACTIONS,
  resolveNexoraHudTheme,
  resolveNexoraHudThemeMode,
} from "./nexoraHudTheme";

describe("nexoraHudTheme", () => {
  it("resolves hud theme mode from resolved ui theme", () => {
    expect(resolveNexoraHudThemeMode("day")).toBe("day");
    expect(resolveNexoraHudThemeMode("night")).toBe("night");
    expect(resolveNexoraHudThemeMode(null)).toBe("night");
  });

  it("provides distinct day and night shell tokens", () => {
    const day = resolveNexoraHudTheme("day");
    const night = resolveNexoraHudTheme("night");
    expect(day.mode).toBe("day");
    expect(night.mode).toBe("night");
    expect(day.shellBackground).not.toBe(night.shellBackground);
    expect(day.panelBackground).toBe(day.shellBackground);
    expect(night.accent).toContain("var(--nx-accent)");
  });

  it("defines camera toolbar actions", () => {
    expect(CAMERA_TOOLBAR_ACTIONS.map((action) => action.id)).toEqual([
      "fit_view",
      "focus_selection",
      "reset_view",
      "zoom_in",
      "zoom_out",
      "snapshot",
    ]);
  });
});
