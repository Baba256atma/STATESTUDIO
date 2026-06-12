import type React from "react";

import {
  dashboardVisualColors,
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { hudPanelActionButtonStyle } from "../../../lib/hud/hudPanelActionButtonStyle.ts";
import { nx, softCardStyle } from "../../ui/nexoraTheme.ts";

export const objectPanelSectionStyle: React.CSSProperties = {
  ...softCardStyle,
  padding: dashboardVisualSpacing.md,
  border: `1px solid ${dashboardVisualColors.border}`,
  background: dashboardVisualColors.surface,
};

export const objectPanelSectionLabel: React.CSSProperties = {
  ...dashboardVisualTypography.microLabel,
  color: dashboardVisualColors.textSoft,
  fontWeight: 800,
  marginBottom: dashboardVisualSpacing.sm,
};

export const objectPanelMetricCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: dashboardVisualSpacing.xs,
  minHeight: 72,
  padding: dashboardVisualSpacing.sm,
  borderRadius: 8,
  border: `1px solid ${dashboardVisualColors.border}`,
  background: "color-mix(in srgb, var(--nx-bg-panel-soft) 88%, var(--nx-bg-deep))",
};

export const objectPanelInsightCardStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${nx.borderSoft}`,
  background: "rgba(2,6,23,0.24)",
  color: nx.textSoft,
  fontSize: 11,
  lineHeight: 1.45,
};

export const objectPanelActionButtonStyle = hudPanelActionButtonStyle;

export function objectIconGlyph(objectType: string, objectName: string): string {
  const type = objectType.trim().toLowerCase();
  if (type.includes("risk")) return "⚠";
  if (type.includes("source") || type.includes("input")) return "◉";
  if (type.includes("decision")) return "◆";
  const initial = objectName.trim().charAt(0).toUpperCase();
  return initial || "O";
}
