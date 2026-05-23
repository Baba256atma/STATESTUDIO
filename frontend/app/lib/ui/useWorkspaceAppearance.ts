"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useSceneThemeOptional } from "../theme/useSceneTheme";
import { resolveNexoraHudTheme, resolveNexoraHudThemeMode } from "../scene/nexoraHudTheme";
import { useNexoraUiTheme } from "./nexoraUiTheme";
import {
  logWorkspaceAppearanceModeChanged,
  logWorkspaceAppearanceMounted,
} from "./workspaceAppearanceInstrumentation";
import {
  toWorkspaceAppearanceSettings,
  type WorkspaceAppearanceMode,
  type WorkspaceAppearanceSettings,
} from "./workspaceAppearanceTypes";

export type WorkspaceAppearanceContext = {
  mode: WorkspaceAppearanceMode;
  settings: WorkspaceAppearanceSettings;
  preference: ReturnType<typeof useNexoraUiTheme>["themeMode"];
  hudTheme: ReturnType<typeof resolveNexoraHudTheme>;
  isNight: boolean;
  isDay: boolean;
  setMode: (mode: WorkspaceAppearanceMode) => void;
  toggleMode: () => void;
};

/**
 * E2:17 / E2:20 — Executive workspace appearance.
 * Delegates visual tokens to SceneThemeProvider when present; never duplicates theme state.
 */
export function useWorkspaceAppearance(): WorkspaceAppearanceContext {
  const sceneTheme = useSceneThemeOptional();
  const { themeMode, setThemeMode, resolvedTheme } = useNexoraUiTheme();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logWorkspaceAppearanceMounted();
  }, []);

  const settings = useMemo(() => toWorkspaceAppearanceSettings(resolvedTheme), [resolvedTheme]);
  const hudTheme = useMemo(
    () => sceneTheme?.hudTheme ?? resolveNexoraHudTheme(resolveNexoraHudThemeMode(resolvedTheme)),
    [resolvedTheme, sceneTheme?.hudTheme]
  );

  const setMode = useCallback(
    (mode: WorkspaceAppearanceMode) => {
      if (mode === resolvedTheme && themeMode === mode) return;
      logWorkspaceAppearanceModeChanged(mode);
      if (sceneTheme) {
        sceneTheme.setTheme(mode);
        return;
      }
      setThemeMode(mode);
    },
    [resolvedTheme, sceneTheme, setThemeMode, themeMode]
  );

  const toggleMode = useCallback(() => {
    if (sceneTheme) {
      sceneTheme.toggleTheme();
      return;
    }
    setMode(resolvedTheme === "night" ? "day" : "night");
  }, [resolvedTheme, sceneTheme, setMode]);

  return {
    mode: sceneTheme?.currentTheme ?? resolvedTheme,
    settings,
    preference: themeMode,
    hudTheme,
    isNight: sceneTheme?.isNight ?? resolvedTheme === "night",
    isDay: sceneTheme?.isDay ?? resolvedTheme === "day",
    setMode,
    toggleMode,
  };
}
