import type React from "react";

import type { NexoraHudThemeTokens } from "../../scene/nexoraHudTheme";

/** E2:53 — Compact executive toolbar layout tokens. */
export const EXECUTIVE_TOOLBAR_COMPACT_LAYOUT = Object.freeze({
  shellGap: 2,
  shellPadding: "3px 5px",
  shellMaxWidth: "min(380px, 90vw)",
  segmentHeight: 26,
  segmentMinWidth: 26,
  segmentPadding: "0 7px",
  actionHeight: 26,
  actionPadding: "0 8px",
  labelFontSize: 9,
  iconFontSize: 11,
});

export function executiveToolbarShellStyle(
  theme: NexoraHudThemeTokens,
  baseStyle: React.CSSProperties
): React.CSSProperties {
  return {
    ...baseStyle,
    gap: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.shellGap,
    padding: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.shellPadding,
    maxWidth: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.shellMaxWidth,
    boxShadow:
      theme.mode === "night"
        ? "0 8px 24px rgba(2, 6, 23, 0.28)"
        : "0 8px 20px rgba(15, 23, 42, 0.08)",
  };
}

export function executiveToolbarSegmentStyle(active: boolean, theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    height: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.segmentHeight,
    minWidth: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.segmentMinWidth,
    padding: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.segmentPadding,
    fontSize: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.labelFontSize,
    fontWeight: 800,
    borderRadius: 999,
    border: `1px solid ${active ? theme.accent : theme.controlBorder}`,
    background: active
      ? `color-mix(in srgb, ${theme.accent} 14%, ${theme.controlBackground})`
      : theme.controlBackground,
    color: active ? theme.textPrimary : theme.textSecondary,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

export function executiveToolbarActionStyle(
  theme: NexoraHudThemeTokens,
  active = false
): React.CSSProperties {
  return {
    height: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.actionHeight,
    padding: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.actionPadding,
    borderRadius: 999,
    border: `1px solid ${active ? theme.accent : theme.buttonBorder}`,
    background: active
      ? `color-mix(in srgb, ${theme.accent} 14%, ${theme.buttonBackground})`
      : theme.buttonBackground,
    color: active ? theme.textPrimary : theme.buttonText,
    fontSize: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.iconFontSize,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexShrink: 0,
    whiteSpace: "nowrap",
  };
}

export function executiveToolbarLabelStyle(): React.CSSProperties {
  return {
    fontSize: EXECUTIVE_TOOLBAR_COMPACT_LAYOUT.labelFontSize,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}
