import type React from "react";

import type { SceneThemeTokens } from "../../theme/sceneThemeTypes";
import { logExecutiveStatusGovernance } from "./executiveHarmonizationInstrumentation";

export type ExecutiveStatusKind =
  | "healthy"
  | "warning"
  | "critical"
  | "active"
  | "inactive"
  | "monitoring";

export type ExecutiveStatusPresentation = {
  kind: ExecutiveStatusKind;
  label: string;
  color: string;
  background: string;
  border: string;
  dotSizePx: number;
  fontSizePx: number;
  fontWeight: number;
  uppercase: boolean;
};

const STATUS_LABELS: Record<ExecutiveStatusKind, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  active: "Active",
  inactive: "Inactive",
  monitoring: "Monitoring",
};

function statusColor(tokens: SceneThemeTokens, kind: ExecutiveStatusKind): string {
  if (kind === "critical") return tokens.danger;
  if (kind === "warning") return tokens.warning;
  if (kind === "healthy" || kind === "active") return tokens.success;
  if (kind === "monitoring") return tokens.accent;
  return tokens.textSecondary;
}

/** E2:49 Part 7 — consistent status presentation across workspace surfaces. */
export function resolveExecutiveStatusPresentation(
  kind: ExecutiveStatusKind,
  tokens: SceneThemeTokens,
  label?: string
): ExecutiveStatusPresentation {
  const color = statusColor(tokens, kind);
  const presentation: ExecutiveStatusPresentation = {
    kind,
    label: label ?? STATUS_LABELS[kind],
    color,
    background: `color-mix(in srgb, ${color} 14%, transparent)`,
    border: `color-mix(in srgb, ${color} 32%, transparent)`,
    dotSizePx: 6,
    fontSizePx: 10,
    fontWeight: 700,
    uppercase: false,
  };
  logExecutiveStatusGovernance("resolved", { kind, label: presentation.label });
  return presentation;
}

export function resolveExecutiveStatusFromPriority(
  priority: "critical" | "warning" | "attention" | "normal",
  tokens: SceneThemeTokens
): ExecutiveStatusPresentation {
  if (priority === "critical") return resolveExecutiveStatusPresentation("critical", tokens);
  if (priority === "warning") return resolveExecutiveStatusPresentation("warning", tokens);
  if (priority === "attention") return resolveExecutiveStatusPresentation("monitoring", tokens);
  return resolveExecutiveStatusPresentation("healthy", tokens);
}

export function executiveStatusChipStyle(
  presentation: ExecutiveStatusPresentation
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 8px",
    borderRadius: 999,
    border: `1px solid ${presentation.border}`,
    background: presentation.background,
    color: presentation.color,
    fontSize: presentation.fontSizePx,
    fontWeight: presentation.fontWeight,
    lineHeight: 1.2,
    textTransform: presentation.uppercase ? "uppercase" : "none",
  };
}

export function executiveStatusDotStyle(presentation: ExecutiveStatusPresentation): React.CSSProperties {
  return {
    width: presentation.dotSizePx,
    height: presentation.dotSizePx,
    borderRadius: 999,
    background: presentation.color,
    flexShrink: 0,
  };
}
