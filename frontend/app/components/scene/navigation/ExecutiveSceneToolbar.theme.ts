import type React from "react";

import type { NexoraHudThemeTokens } from "../../../lib/scene/nexoraHudTheme";
import { nexoraHudShellStyle } from "../../../lib/scene/nexoraHudTheme";

export function sceneToolbarShellStyle(
  theme: NexoraHudThemeTokens,
  overrides?: React.CSSProperties
): React.CSSProperties {
  return nexoraHudShellStyle(theme, {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 7px",
    borderRadius: 999,
    boxShadow: theme.mode === "night" ? theme.panelGlow : theme.shellShadow,
    ...overrides,
  });
}

export function sceneToolbarSegmentStyle(
  theme: NexoraHudThemeTokens,
  active: boolean
): React.CSSProperties {
  return {
    height: 30,
    minWidth: 30,
    padding: "0 8px",
    borderRadius: 999,
    border: `1px solid ${active ? theme.accent : theme.controlBorder}`,
    background: active
      ? `color-mix(in srgb, ${theme.accent} 16%, ${theme.controlBackground})`
      : theme.controlBackground,
    color: active ? theme.textPrimary : theme.textSecondary,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexShrink: 0,
  };
}

export function sceneToolbarActionStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    width: 30,
    height: 30,
    borderRadius: 999,
    border: `1px solid ${theme.buttonBorder}`,
    background: theme.buttonBackground,
    color: theme.buttonText,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    flexShrink: 0,
  };
}

export function sceneToolbarDividerStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    width: 1,
    alignSelf: "stretch",
    margin: "4px 2px",
    background: theme.controlBorder,
    opacity: theme.mode === "night" ? 0.85 : 0.65,
    flexShrink: 0,
  };
}

export function sceneToolbarPresetStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    height: 30,
    padding: "0 10px",
    borderRadius: 999,
    border: `1px solid ${theme.controlBorder}`,
    background: theme.controlBackground,
    color: theme.textSecondary,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.04em",
    cursor: "pointer",
    maxWidth: 132,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flexShrink: 1,
  };
}
