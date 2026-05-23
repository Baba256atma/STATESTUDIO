/**
 * E2:17 — Workspace appearance persistence delegates to the canonical Nexora UI theme store.
 * Do not duplicate theme state; read/write through `nexoraUiTheme` only.
 */
import {
  DEFAULT_THEME_MODE,
  NEXORA_THEME_MODE_STORAGE_KEY,
  persistThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
} from "./nexoraUiTheme";
import type { WorkspaceAppearanceMode } from "./workspaceAppearanceTypes";

export {
  DEFAULT_THEME_MODE as DEFAULT_WORKSPACE_APPEARANCE_PREFERENCE,
  NEXORA_THEME_MODE_STORAGE_KEY as WORKSPACE_APPEARANCE_STORAGE_KEY,
  persistThemeMode as persistWorkspaceAppearancePreference,
  readStoredThemeMode as readWorkspaceAppearancePreference,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
};

/** Executive control surface sets explicit day/night (never auto). */
export function persistWorkspaceAppearanceMode(mode: WorkspaceAppearanceMode): void {
  persistThemeMode(mode);
}
