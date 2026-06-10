/**
 * MRP:10:8 — Dashboard Home layout visual rhythm tokens.
 */

import type React from "react";

import { dashboardVisualSpacing } from "../dashboardVisualTheme.ts";
import type { DashboardHomeVisualWeight } from "./dashboardHomeLayoutContract.ts";
import type { DashboardHomeSectionLayoutVariant } from "./dashboardHomeLayoutTypes.ts";

export const dashboardHomeLayoutSpacing = Object.freeze({
  zonePaddingX: dashboardVisualSpacing.md,
  zonePaddingY: dashboardVisualSpacing.md,
  zoneInnerGap: dashboardVisualSpacing.sm,
  sectionGap: dashboardVisualSpacing.sm,
  zoneLabelGap: 4,
});

const ZONE_WEIGHT_BACKGROUND: Readonly<Record<DashboardHomeVisualWeight, string>> = Object.freeze({
  high: "var(--nx-bg-panel-soft)",
  medium: "var(--nx-bg-elevated)",
  low: "var(--nx-bg-control)",
});

export function resolveDashboardHomeZoneBackground(weight: DashboardHomeVisualWeight): string {
  return ZONE_WEIGHT_BACKGROUND[weight];
}

export function buildDashboardHomeZoneStyle(input: {
  visualWeight: DashboardHomeVisualWeight;
}): React.CSSProperties {
  return {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: dashboardHomeLayoutSpacing.zoneInnerGap,
    padding: `${dashboardHomeLayoutSpacing.zonePaddingY}px ${dashboardHomeLayoutSpacing.zonePaddingX}px`,
    background: resolveDashboardHomeZoneBackground(input.visualWeight),
    borderBottom: "1px solid var(--nx-border-soft)",
  };
}

export function buildDashboardHomeZoneChildSectionStyle(
  variant: DashboardHomeSectionLayoutVariant = "standalone"
): React.CSSProperties {
  if (variant === "standalone") {
    return {};
  }
  return {
    borderBottom: "none",
    paddingLeft: 0,
    paddingRight: 0,
    background: "transparent",
  };
}

export function applyDashboardHomeSectionChrome(
  variant: DashboardHomeSectionLayoutVariant,
  baseStyle: React.CSSProperties
): React.CSSProperties {
  if (variant === "standalone") {
    return baseStyle;
  }
  return {
    ...baseStyle,
    padding: `${dashboardVisualSpacing.sm}px 0`,
    ...buildDashboardHomeZoneChildSectionStyle(variant),
  };
}

export function buildDashboardHomeResponsiveGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
    gap: dashboardVisualSpacing.sm,
  };
}
