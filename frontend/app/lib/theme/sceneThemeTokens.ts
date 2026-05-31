import type React from "react";

import { nx } from "../../components/ui/nexoraTheme";
import {
  resolveExecutiveChipButtonStyle,
  resolveExecutiveControlButtonStyle,
} from "../workspace/harmonization";
import type { SceneThemeId, SceneThemeTokens } from "./sceneThemeTypes";

/** Scene-native HUD surfaces adapted by the theme runtime. */
export const SCENE_HUD_THEME_SURFACES = [
  "sceneInfoHud",
  "objectInfoHud",
  "timelineHud",
  "quickActionsDock",
  "sceneNavigationToolbar",
  "executiveStatusHud",
  "commandBar",
  "aiAssistant",
  "scenarioSuggestions",
  "scenarioComparison",
] as const;

export type SceneHudThemeSurfaceId = (typeof SCENE_HUD_THEME_SURFACES)[number];

/** Day — bright executive glass, restrained glow, dark typography. */
export function resolveDaySceneThemeTokens(): SceneThemeTokens {
  return {
    id: "day",
    panelBackground: "color-mix(in srgb, var(--nx-bg-panel) 92%, transparent)",
    panelBorder: nx.borderSoft,
    panelShadow: "0 10px 28px rgba(15, 23, 42, 0.1)",
    textPrimary: nx.textStrong,
    textSecondary: nx.muted,
    accent: nx.accent,
    warning: nx.warning,
    danger: nx.risk,
    success: nx.success,
    timeline: nx.accentInk,
    buttonBackground: "color-mix(in srgb, var(--nx-bg-elevated) 94%, transparent)",
    buttonBorder: nx.border,
    buttonText: nx.textSoft,
    overlayOpacity: 0.94,
    hudGlowIntensity: 0.06,
    hudGlow: "0 10px 28px rgba(15, 23, 42, 0.08)",
    headerBackground: "color-mix(in srgb, var(--nx-bg-elevated) 94%, transparent)",
    controlBackground: "color-mix(in srgb, var(--nx-bg-control) 90%, transparent)",
    controlBorder: nx.borderSoft,
    label: nx.lowMuted,
    chipBackground: "color-mix(in srgb, var(--nx-accent-soft) 42%, transparent)",
    chipBorder: nx.borderSoft,
    messageSurface: "color-mix(in srgb, var(--nx-bg-control) 88%, transparent)",
    inputSurface: "color-mix(in srgb, var(--nx-bg-elevated) 96%, transparent)",
    timelineTrack: nx.borderSoft,
    timelineMarker: nx.warning,
    timelineConnector: "color-mix(in srgb, var(--nx-accent-ink) 45%, transparent)",
  };
}

/** Night — executive command center, deep glass, subtle blue glow. */
export function resolveNightSceneThemeTokens(): SceneThemeTokens {
  return {
    id: "night",
    panelBackground: "color-mix(in srgb, var(--nx-bg-deep) 78%, transparent)",
    panelBorder: nx.borderSoft,
    panelShadow: "0 10px 32px rgba(0, 0, 0, 0.3)",
    textPrimary: nx.textSoft,
    textSecondary: nx.muted,
    accent: nx.accent,
    warning: nx.warning,
    danger: nx.risk,
    success: nx.success,
    timeline: nx.accentInk,
    buttonBackground: "color-mix(in srgb, var(--nx-bg-control) 72%, transparent)",
    buttonBorder: nx.border,
    buttonText: nx.textSoft,
    overlayOpacity: 0.82,
    hudGlowIntensity: 0.12,
    hudGlow: "0 0 16px color-mix(in srgb, var(--nx-accent) 12%, transparent)",
    headerBackground: "color-mix(in srgb, var(--nx-bg-deep) 88%, transparent)",
    controlBackground: "color-mix(in srgb, var(--nx-bg-control) 70%, transparent)",
    controlBorder: nx.borderSoft,
    label: nx.lowMuted,
    chipBackground: "color-mix(in srgb, var(--nx-accent-soft) 55%, transparent)",
    chipBorder: nx.borderStrong,
    messageSurface: "color-mix(in srgb, var(--nx-bg-control) 76%, transparent)",
    inputSurface: "color-mix(in srgb, var(--nx-bg-deep) 84%, transparent)",
    timelineTrack: nx.borderSoft,
    timelineMarker: nx.warning,
    timelineConnector: "color-mix(in srgb, var(--nx-accent-ink) 55%, transparent)",
  };
}

export function resolveSceneThemeTokens(id: SceneThemeId): SceneThemeTokens {
  return id === "day" ? resolveDaySceneThemeTokens() : resolveNightSceneThemeTokens();
}

export function sceneHudShellStyle(
  tokens: SceneThemeTokens,
  overrides?: React.CSSProperties
): React.CSSProperties {
  return {
    borderRadius: 10,
    border: `1px solid ${tokens.panelBorder}`,
    background: tokens.panelBackground,
    backdropFilter: "blur(12px)",
    boxShadow: tokens.hudGlow,
    color: tokens.textPrimary,
    pointerEvents: "auto",
    ...overrides,
  };
}

export function sceneHudSectionLabelStyle(tokens: SceneThemeTokens): React.CSSProperties {
  return {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: tokens.label,
  };
}

export function sceneHudControlButtonStyle(tokens: SceneThemeTokens): React.CSSProperties {
  return resolveExecutiveControlButtonStyle(tokens);
}

export function sceneHudChipStyle(tokens: SceneThemeTokens, active: boolean): React.CSSProperties {
  return resolveExecutiveChipButtonStyle(tokens, "default", active);
}
