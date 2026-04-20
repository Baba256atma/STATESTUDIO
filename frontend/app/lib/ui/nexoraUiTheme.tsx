"use client";

import React, { createContext, useContext, useMemo } from "react";

export type ThemeMode = "night" | "day" | "auto";

export type ResolvedUiTheme = "night" | "day";

export const NEXORA_THEME_MODE_STORAGE_KEY = "nx-theme-mode";

const LEGACY_UI_THEME_KEY = "nexora.ui_theme";

export const DEFAULT_THEME_MODE: ThemeMode = "auto";

export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveThemeMode(mode: ThemeMode, prefersDark: boolean): ResolvedUiTheme {
  if (mode === "auto") return prefersDark ? "night" : "day";
  return mode;
}

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME_MODE;
  try {
    const raw = window.localStorage.getItem(NEXORA_THEME_MODE_STORAGE_KEY);
    if (raw === "night" || raw === "day" || raw === "auto") return raw;
    const legacy = window.localStorage.getItem(LEGACY_UI_THEME_KEY);
    if (legacy === "night" || legacy === "day") {
      window.localStorage.setItem(NEXORA_THEME_MODE_STORAGE_KEY, legacy);
      return legacy;
    }
  } catch {
    // ignore
  }
  return DEFAULT_THEME_MODE;
}

export function persistThemeMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NEXORA_THEME_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

type NexoraUiThemeContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: ResolvedUiTheme;
};

const NexoraUiThemeContext = createContext<NexoraUiThemeContextValue | null>(null);

export function NexoraUiThemeProvider(props: {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: ResolvedUiTheme;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      themeMode: props.themeMode,
      setThemeMode: props.setThemeMode,
      resolvedTheme: props.resolvedTheme,
    }),
    [props.themeMode, props.setThemeMode, props.resolvedTheme]
  );
  return <NexoraUiThemeContext.Provider value={value}>{props.children}</NexoraUiThemeContext.Provider>;
}

export function useNexoraUiTheme(): NexoraUiThemeContextValue {
  const ctx = useContext(NexoraUiThemeContext);
  if (!ctx) {
    throw new Error("useNexoraUiTheme must be used within NexoraUiThemeProvider");
  }
  return ctx;
}
