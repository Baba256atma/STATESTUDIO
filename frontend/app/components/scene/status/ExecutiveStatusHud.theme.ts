import type React from "react";

import type { NexoraHudThemeTokens } from "../../../lib/scene/nexoraHudTheme";
import { nexoraHudSectionLabelStyle, nexoraHudShellStyle } from "../../../lib/scene/nexoraHudTheme";
import { sceneHudChipStyle } from "../../../lib/theme/sceneThemeTokens";
import type { SceneThemeTokens } from "../../../lib/theme/sceneThemeTypes";
import type { ExecutiveStatusSeverity } from "./ExecutiveStatusHud.types";

export function executiveStatusShellStyle(
  theme: NexoraHudThemeTokens,
  severity: ExecutiveStatusSeverity,
  overrides?: React.CSSProperties
): React.CSSProperties {
  const accent =
    severity === "critical"
      ? theme.critical
      : severity === "warning"
        ? theme.warning
        : severity === "attention"
          ? theme.accent
          : theme.success;

  return nexoraHudShellStyle(theme, {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 14,
    minWidth: 0,
    boxShadow:
      theme.mode === "night"
        ? `0 0 0 1px color-mix(in srgb, ${accent} 18%, transparent), ${theme.panelGlow}`
        : theme.shellShadow,
    ...overrides,
  });
}

export function executiveStatusHeadlineStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.35,
    color: theme.textPrimary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}

export function executiveStatusMetricLabelStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    ...nexoraHudSectionLabelStyle(theme),
    marginBottom: 2,
  };
}

export function executiveStatusMetricValueStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    fontSize: 18,
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: theme.textPrimary,
  };
}

export function executiveStatusSublineStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    fontSize: 10,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.textSecondary,
  };
}

export function executiveStatusChipStyle(
  tokens: SceneThemeTokens,
  severity: ExecutiveStatusSeverity,
  active = false
): React.CSSProperties {
  return sceneHudChipStyle(tokens, active || severity !== "normal");
}

export function severityColor(theme: NexoraHudThemeTokens, severity: ExecutiveStatusSeverity): string {
  if (severity === "critical") return theme.critical;
  if (severity === "warning") return theme.warning;
  if (severity === "attention") return theme.accent;
  return theme.success;
}
