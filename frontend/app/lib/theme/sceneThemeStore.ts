/**
 * E2:20 — Scene theme persistence delegates to canonical Nexora UI theme store (E2:17).
 * Do not duplicate theme preference state.
 */
import {
  DEFAULT_THEME_MODE,
  NEXORA_THEME_MODE_STORAGE_KEY,
  persistThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
} from "../ui/nexoraUiTheme";
import type { SceneThemeId } from "./sceneThemeTypes";
import { isSceneThemeId } from "./sceneThemeTypes";

export {
  DEFAULT_THEME_MODE as DEFAULT_SCENE_THEME_PREFERENCE,
  NEXORA_THEME_MODE_STORAGE_KEY as SCENE_THEME_STORAGE_KEY,
  persistThemeMode as persistSceneThemePreference,
  readStoredThemeMode as readSceneThemePreference,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
};

export function resolvedUiToSceneThemeId(resolved: ResolvedUiTheme): SceneThemeId {
  return resolved === "day" ? "day" : "night";
}

export function persistSceneThemeId(id: SceneThemeId): void {
  persistThemeMode(id);
}

export function readStoredSceneThemeId(): SceneThemeId {
  const stored = readStoredThemeMode();
  if (stored === "day" || stored === "night") return stored;
  return resolveThemeMode(stored, false) === "day" ? "day" : "night";
}

export function parseSceneThemeId(value: unknown): SceneThemeId | null {
  return isSceneThemeId(value) ? value : null;
}
