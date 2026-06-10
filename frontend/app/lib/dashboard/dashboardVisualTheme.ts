/**
 * Phase 3:5 — Visual consistency layer using Nexora semantic tokens (day/night via CSS vars).
 */

import type React from "react";
import type { ImpactDirection, ImpactLevel } from "./dashboardVisualSignalContract.ts";

export const dashboardVisualSpacing = Object.freeze({
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
});

export const dashboardVisualTypography = Object.freeze({
  microLabel: { fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const },
  summaryValue: { fontSize: 13, fontWeight: 600 },
  cardTitle: { fontSize: 12, fontWeight: 600 },
  cardMeta: { fontSize: 11, lineHeight: 1.4 },
});

export const dashboardVisualSizing = Object.freeze({
  microChartHeight: 28,
  microChartWidth: 72,
  microBarWidth: 6,
  impactCardMinHeight: 88,
  headerBadgeHeight: 18,
});

export const dashboardVisualColors = Object.freeze({
  surface: "var(--nx-bg-panel-soft)",
  border: "var(--nx-border-soft)",
  text: "var(--nx-text)",
  textSoft: "var(--nx-text-soft)",
  muted: "var(--nx-muted)",
  accent: "var(--nx-accent)",
  success: "var(--nx-success)",
  warning: "var(--nx-warning)",
  risk: "var(--nx-risk)",
  chartLine: "var(--nx-accent)",
  chartFill: "var(--nx-accent-soft)",
  barFill: "var(--nx-accent-muted)",
});

const IMPACT_LEVEL_COLOR: Readonly<Record<ImpactLevel, string>> = Object.freeze({
  low: "var(--nx-success)",
  moderate: "var(--nx-accent)",
  high: "var(--nx-warning)",
  critical: "var(--nx-risk)",
});

const DIRECTION_COLOR: Readonly<Record<ImpactDirection, string>> = Object.freeze({
  improving: "var(--nx-success)",
  stable: "var(--nx-muted)",
  deteriorating: "var(--nx-risk)",
});

export function resolveImpactLevelColor(level: ImpactLevel): string {
  return IMPACT_LEVEL_COLOR[level];
}

export function resolveDirectionColor(direction: ImpactDirection): string {
  return DIRECTION_COLOR[direction];
}

export function dashboardVisualPanelStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: dashboardVisualSpacing.md,
    padding: dashboardVisualSpacing.lg,
    color: dashboardVisualColors.text,
    background: dashboardVisualColors.surface,
    borderTop: `1px solid ${dashboardVisualColors.border}`,
  };
}
