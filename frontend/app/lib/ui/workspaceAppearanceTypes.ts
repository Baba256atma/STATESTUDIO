import type { ResolvedUiTheme } from "./nexoraUiTheme";

/** Canonical executive workspace appearance mode (resolved; never `auto`). */
export type WorkspaceAppearanceMode = "day" | "night";

export type WorkspaceAppearanceSettings = {
  mode: WorkspaceAppearanceMode;
};

/** Maps resolved UI theme to workspace appearance settings. */
export function toWorkspaceAppearanceSettings(resolved: ResolvedUiTheme): WorkspaceAppearanceSettings {
  return { mode: resolved };
}

export function isWorkspaceAppearanceMode(value: unknown): value is WorkspaceAppearanceMode {
  return value === "day" || value === "night";
}

// E2:19 HUD customization
// E2:20 Executive profile preferences
// D8 Strategic memory personalization
// D10 Production preference management
