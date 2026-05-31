import type React from "react";

import type { NexoraHudThemeTokens } from "../../../lib/scene/nexoraHudTheme";
import { nexoraHudSectionLabelStyle, nexoraHudShellStyle } from "../../../lib/scene/nexoraHudTheme";
import { resolveSceneNativeHudMetricStyle } from "../../../lib/hud/visual";
import type { SceneThemeTokens } from "../../../lib/theme/sceneThemeTypes";
import {
  executiveStatusChipStyle as harmonizedStatusChipStyle,
  resolveExecutiveStatusPresentation,
  resolveExecutiveTypography,
} from "../../../lib/workspace/harmonization";
import type { ExecutiveStatusSeverity } from "./ExecutiveStatusHud.types";

export function executiveStatusShellStyle(
  theme: NexoraHudThemeTokens,
  severity: ExecutiveStatusSeverity,
  overrides?: React.CSSProperties
): React.CSSProperties {
  return nexoraHudShellStyle(
    theme,
    {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 10,
      minWidth: 0,
      ...overrides,
    },
    { surface: "executiveStatusHud", edgeAnchor: "TOP_RIGHT", focused: severity !== "normal" }
  );
}

export function executiveStatusHeadlineStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    ...resolveExecutiveTypography("body", theme.textPrimary),
    fontWeight: 700,
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
  return resolveSceneNativeHudMetricStyle(theme);
}

export function executiveStatusSublineStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return resolveExecutiveTypography("caption", theme.textSecondary);
}

export function executiveStatusChipStyle(
  tokens: SceneThemeTokens,
  severity: ExecutiveStatusSeverity,
  active = false
): React.CSSProperties {
  const kind =
    severity === "critical"
      ? "critical"
      : severity === "warning"
        ? "warning"
        : severity === "attention"
          ? "monitoring"
          : active
            ? "active"
            : "healthy";
  const presentation = resolveExecutiveStatusPresentation(kind, tokens);
  return harmonizedStatusChipStyle(presentation);
}

export function severityColor(theme: NexoraHudThemeTokens, severity: ExecutiveStatusSeverity): string {
  if (severity === "critical") return theme.critical;
  if (severity === "warning") return theme.warning;
  if (severity === "attention") return theme.accent;
  return theme.success;
}
