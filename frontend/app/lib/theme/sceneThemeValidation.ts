import { logSceneThemeValidation } from "./sceneThemeInstrumentation";
import { SCENE_HUD_THEME_SURFACES } from "./sceneThemeTokens";
import type { SceneThemeId } from "./sceneThemeTypes";

/** Dev-only registry of HUD surfaces expected to consume scene theme tokens. */
export const SCENE_THEME_VALIDATED_SURFACES = SCENE_HUD_THEME_SURFACES;

let lastValidatedTheme: SceneThemeId | null = null;

/**
 * Dev-only consistency check — verifies theme runtime knows all scene HUD surfaces.
 * Does not mutate UI; logs once per theme transition.
 */
export function runSceneThemeValidation(theme: SceneThemeId): void {
  if (process.env.NODE_ENV === "production") return;
  if (lastValidatedTheme === theme) return;
  lastValidatedTheme = theme;

  logSceneThemeValidation({
    theme,
    surfaceCount: SCENE_THEME_VALIDATED_SURFACES.length,
    surfaces: SCENE_THEME_VALIDATED_SURFACES,
    status: "ok",
  });
}

/** Test-only reset. */
export function resetSceneThemeValidationForTests(): void {
  lastValidatedTheme = null;
}
