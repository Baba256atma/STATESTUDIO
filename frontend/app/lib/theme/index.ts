export type { SceneThemeId, SceneThemeTokens } from "./sceneThemeTypes";
export { isSceneThemeId } from "./sceneThemeTypes";

export {
  resolveDaySceneThemeTokens,
  resolveNightSceneThemeTokens,
  resolveSceneThemeTokens,
  sceneHudChipStyle,
  sceneHudControlButtonStyle,
  sceneHudSectionLabelStyle,
  sceneHudShellStyle,
  SCENE_HUD_THEME_SURFACES,
} from "./sceneThemeTokens";
export type { SceneHudThemeSurfaceId } from "./sceneThemeTokens";

export {
  persistSceneThemeId,
  readStoredSceneThemeId,
  resolvedUiToSceneThemeId,
  SCENE_THEME_STORAGE_KEY,
} from "./sceneThemeStore";

export {
  logSceneHudThemeAdapted,
  logSceneThemeApplied,
  logSceneThemeChanged,
  resetSceneThemeInstrumentationForTests,
} from "./sceneThemeInstrumentation";

export { runSceneThemeValidation, SCENE_THEME_VALIDATED_SURFACES } from "./sceneThemeValidation";

export { SceneThemeProvider, useSceneHudTheme, useSceneTheme, useSceneThemeOptional } from "./useSceneTheme";
