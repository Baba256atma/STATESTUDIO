import type React from "react";

import { requestCameraToolbarAction as dispatchSceneNavigationLegacyAction } from "./sceneNavigationContract";
import {
  resolveSceneNativeHudSectionLabel,
  resolveSceneNativeHudShell,
  type SceneNativeHudShellInput,
} from "../hud/visual/sceneNativeHudDesignSystem";
import { resolveSceneThemeTokens, sceneHudShellStyle as themeHudShellStyle } from "../theme/sceneThemeTokens";
import type { SceneHudThemeSurfaceId } from "../theme/sceneThemeTokens";
import type { SceneThemeTokens } from "../theme/sceneThemeTypes";
import type { ResolvedUiTheme } from "../ui/nexoraUiTheme";

/** E2:11 / E2:20 — Scene-native HUD day/night theme contract. */
export type NexoraHudThemeMode = "day" | "night";

export type NexoraHudThemeTokens = {
  mode: NexoraHudThemeMode;
  /** E2:17 semantic workspace appearance tokens — all HUDs must consume these. */
  panelBackground: string;
  panelBorder: string;
  panelGlow: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  critical: string;
  /** Legacy aliases retained for existing E2 HUD components. */
  shellBackground: string;
  shellBorder: string;
  shellShadow: string;
  headerBackground: string;
  text: string;
  textMuted: string;
  label: string;
  controlBackground: string;
  controlBorder: string;
  buttonBackground: string;
  buttonBorder: string;
  buttonText: string;
};

export function resolveNexoraHudThemeMode(resolvedTheme?: ResolvedUiTheme | null): NexoraHudThemeMode {
  return resolvedTheme === "day" ? "day" : "night";
}

/** Bridge centralized scene theme runtime tokens to legacy HUD token shape. */
export function toNexoraHudThemeTokens(tokens: SceneThemeTokens): NexoraHudThemeTokens {
  return {
    mode: tokens.id,
    panelBackground: tokens.panelBackground,
    panelBorder: tokens.panelBorder,
    panelGlow: tokens.hudGlow,
    textPrimary: tokens.textPrimary,
    textSecondary: tokens.textSecondary,
    accent: tokens.accent,
    success: tokens.success,
    warning: tokens.warning,
    critical: tokens.danger,
    shellBackground: tokens.panelBackground,
    shellBorder: tokens.panelBorder,
    shellShadow: tokens.panelShadow,
    headerBackground: tokens.headerBackground,
    text: tokens.textPrimary,
    textMuted: tokens.textSecondary,
    label: tokens.label,
    controlBackground: tokens.controlBackground,
    controlBorder: tokens.controlBorder,
    buttonBackground: tokens.buttonBackground,
    buttonBorder: tokens.buttonBorder,
    buttonText: tokens.buttonText,
  };
}

export function resolveNexoraHudTheme(mode: NexoraHudThemeMode): NexoraHudThemeTokens {
  return toNexoraHudThemeTokens(resolveSceneThemeTokens(mode));
}

export function nexoraHudShellStyle(
  theme: NexoraHudThemeTokens,
  overrides?: React.CSSProperties,
  shellInput?: Partial<Omit<SceneNativeHudShellInput, "themeMode">> & { surface?: SceneHudThemeSurfaceId }
): React.CSSProperties {
  if (shellInput?.surface) {
    return resolveSceneNativeHudShell(
      theme,
      {
        surface: shellInput.surface,
        themeMode: theme.mode,
        depthLayer: shellInput.depthLayer,
        transparencyMode: shellInput.transparencyMode,
        edgeAnchor: shellInput.edgeAnchor,
        focused: shellInput.focused,
        collapsed: shellInput.collapsed,
      },
      overrides
    );
  }

  return themeHudShellStyle(
    {
      id: theme.mode,
      panelBackground: theme.panelBackground,
      panelBorder: theme.panelBorder,
      panelShadow: theme.shellShadow,
      textPrimary: theme.textPrimary,
      textSecondary: theme.textSecondary,
      accent: theme.accent,
      warning: theme.warning,
      danger: theme.critical,
      success: theme.success,
      timeline: theme.accent,
      buttonBackground: theme.buttonBackground,
      buttonBorder: theme.buttonBorder,
      buttonText: theme.buttonText,
      overlayOpacity: theme.mode === "night" ? 0.82 : 0.94,
      hudGlowIntensity: theme.mode === "night" ? 0.12 : 0.06,
      hudGlow: theme.panelGlow,
      headerBackground: theme.headerBackground,
      controlBackground: theme.controlBackground,
      controlBorder: theme.controlBorder,
      label: theme.label,
      chipBackground: theme.controlBackground,
      chipBorder: theme.controlBorder,
      messageSurface: theme.controlBackground,
      inputSurface: theme.controlBackground,
      timelineTrack: theme.controlBorder,
      timelineMarker: theme.warning,
      timelineConnector: theme.accent,
    },
    overrides
  );
}

export function nexoraHudSectionLabelStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return resolveSceneNativeHudSectionLabel(theme, "sectionHeader");
}

export function nexoraHudIconButtonStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    borderRadius: 9,
    border: `1px solid ${theme.buttonBorder}`,
    background: theme.buttonBackground,
    color: theme.buttonText,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    padding: 0,
  };
}

export function requestCameraToolbarAction(action: CameraToolbarActionId): void {
  dispatchSceneNavigationLegacyAction(action);
}

export type CameraToolbarActionId =
  | "fit_view"
  | "reset_view"
  | "focus_selection"
  | "zoom_in"
  | "zoom_out"
  | "snapshot";

export const CAMERA_TOOLBAR_ACTIONS: readonly {
  id: CameraToolbarActionId;
  label: string;
  icon: string;
}[] = [
  { id: "fit_view", label: "Fit View", icon: "⊞" },
  { id: "focus_selection", label: "Focus Selection", icon: "◎" },
  { id: "reset_view", label: "Reset View", icon: "↺" },
  { id: "zoom_in", label: "Zoom In", icon: "+" },
  { id: "zoom_out", label: "Zoom Out", icon: "−" },
  { id: "snapshot", label: "Snapshot", icon: "◫" },
] as const;
