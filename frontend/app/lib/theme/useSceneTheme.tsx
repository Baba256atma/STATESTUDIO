"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";

import { useNexoraUiTheme } from "../ui/nexoraUiTheme";
import {
  logSceneHudThemeAdapted,
  logSceneThemeApplied,
  logSceneThemeChanged,
} from "./sceneThemeInstrumentation";
import { resolvedUiToSceneThemeId } from "./sceneThemeStore";
import {
  resolveSceneThemeTokens,
  SCENE_HUD_THEME_SURFACES,
} from "./sceneThemeTokens";
import { toNexoraHudThemeTokens } from "../scene/nexoraHudTheme";
import type { SceneThemeId, SceneThemeTokens } from "./sceneThemeTypes";
import { runSceneThemeValidation } from "./sceneThemeValidation";
import type { NexoraHudThemeTokens, NexoraHudThemeMode } from "../scene/nexoraHudTheme";
import { resolveNexoraHudTheme } from "../scene/nexoraHudTheme";

export type SceneThemeContextValue = {
  currentTheme: SceneThemeId;
  tokens: SceneThemeTokens;
  hudTheme: NexoraHudThemeTokens;
  isNight: boolean;
  isDay: boolean;
  setTheme: (theme: SceneThemeId) => void;
  toggleTheme: () => void;
};

const SceneThemeContext = createContext<SceneThemeContextValue | null>(null);

export function SceneThemeProvider(props: { children: React.ReactNode }): React.ReactElement {
  const { resolvedTheme, setThemeMode } = useNexoraUiTheme();
  const previousThemeRef = useRef<SceneThemeId | null>(null);
  const adaptationStartRef = useRef<number>(0);

  const currentTheme = resolvedUiToSceneThemeId(resolvedTheme);
  const tokens = useMemo(() => resolveSceneThemeTokens(currentTheme), [currentTheme]);
  const hudTheme = useMemo(() => toNexoraHudThemeTokens(tokens), [tokens]);

  useEffect(() => {
    const previous = previousThemeRef.current;
    if (previous && previous !== currentTheme) {
      const adaptationDurationMs = Math.max(0, Math.round(performance.now() - adaptationStartRef.current));
      logSceneThemeChanged(previous, currentTheme);
      logSceneHudThemeAdapted({
        affectedHudCount: SCENE_HUD_THEME_SURFACES.length,
        adaptationDurationMs,
        theme: currentTheme,
      });
    }
    previousThemeRef.current = currentTheme;
    logSceneThemeApplied(currentTheme);
    runSceneThemeValidation(currentTheme);
    adaptationStartRef.current = performance.now();
  }, [currentTheme]);

  const setTheme = useCallback(
    (theme: SceneThemeId) => {
      if (theme === currentTheme) return;
      setThemeMode(theme);
    },
    [currentTheme, setThemeMode]
  );

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "night" ? "day" : "night");
  }, [currentTheme, setTheme]);

  const value = useMemo<SceneThemeContextValue>(
    () => ({
      currentTheme,
      tokens,
      hudTheme,
      isNight: currentTheme === "night",
      isDay: currentTheme === "day",
      setTheme,
      toggleTheme,
    }),
    [currentTheme, hudTheme, setTheme, toggleTheme, tokens]
  );

  return <SceneThemeContext.Provider value={value}>{props.children}</SceneThemeContext.Provider>;
}

export function useSceneTheme(): SceneThemeContextValue {
  const ctx = useContext(SceneThemeContext);
  if (!ctx) {
    throw new Error("useSceneTheme must be used within SceneThemeProvider");
  }
  return ctx;
}

export function useSceneThemeOptional(): SceneThemeContextValue | null {
  return useContext(SceneThemeContext);
}

/** Preferred HUD hook — uses runtime tokens without prop drilling; falls back when outside provider. */
export function useSceneHudTheme(fallbackMode: NexoraHudThemeMode = "night"): NexoraHudThemeTokens {
  const sceneTheme = useSceneThemeOptional();
  return sceneTheme?.hudTheme ?? resolveNexoraHudTheme(fallbackMode);
}
