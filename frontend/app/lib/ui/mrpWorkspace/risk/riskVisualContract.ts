/**
 * MRP:4C:1 / 4C:4 — Risk workspace visual contract.
 */

import type React from "react";

import type { RiskWorkspaceCardTone } from "./riskWorkspaceContract.ts";
import { MRP_RISK_VISUAL_TAG, RISK_VISUAL_SURFACE_VERSION } from "./riskVisualSurfaceContract.ts";
import {
  executiveSummaryObjectContextStripStyle,
  executiveSummaryObjectContextValueStyle,
} from "../executiveSummary/executiveSummaryVisualContract.ts";

export const RISK_VISUAL_PASS_TAG = MRP_RISK_VISUAL_TAG;
export const RISK_VISUAL_VERSION = RISK_VISUAL_SURFACE_VERSION;

export const riskVisualRadius = Object.freeze({
  section: 6,
  card: 6,
});

export const riskVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const riskVisualColors = Object.freeze({
  shellBg: "var(--nx-bg-deep)",
  cardBg: "var(--nx-bg-panel-soft)",
  border: "var(--nx-border-soft)",
  text: "var(--nx-text)",
  textSoft: "var(--nx-text-soft)",
  label: "var(--nx-low-muted)",
  muted: "var(--nx-muted)",
  success: "var(--nx-success)",
  warning: "var(--nx-warning)",
  critical: "var(--nx-risk)",
  accent: "var(--nx-accent)",
});

const TONE_ACCENT: Readonly<Record<RiskWorkspaceCardTone, string>> = Object.freeze({
  neutral: riskVisualColors.border,
  muted: riskVisualColors.border,
  success: riskVisualColors.success,
  warning: riskVisualColors.warning,
  critical: riskVisualColors.critical,
  accent: riskVisualColors.accent,
});

export function resolveRiskToneAccent(tone: RiskWorkspaceCardTone): string {
  return TONE_ACCENT[tone] ?? riskVisualColors.border;
}

export function riskSectionLabelStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.label,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  };
}

export function riskWorkspaceShellStyle(): React.CSSProperties {
  return {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    padding: `${riskVisualSpacing.shellPaddingY}px ${riskVisualSpacing.shellPaddingX}px`,
    gap: riskVisualSpacing.sectionGap,
    background: riskVisualColors.shellBg,
    color: riskVisualColors.text,
  };
}

export function riskHeaderTitleStyle(): React.CSSProperties {
  return {
    margin: 0,
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    color: riskVisualColors.text,
    lineHeight: 1.25,
  };
}

export function riskHeaderPurposeStyle(): React.CSSProperties {
  return {
    margin: 0,
    fontSize: 11,
    fontWeight: 500,
    color: riskVisualColors.muted,
    lineHeight: 1.4,
  };
}

export function riskCardStyle(tone: RiskWorkspaceCardTone): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: riskVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: riskVisualRadius.card,
    border: `1px solid ${riskVisualColors.border}`,
    borderLeft: `3px solid ${resolveRiskToneAccent(tone)}`,
    background: riskVisualColors.cardBg,
    minWidth: 0,
  };
}

export function riskCardHeadlineStyle(tone: RiskWorkspaceCardTone): React.CSSProperties {
  const accent = resolveRiskToneAccent(tone);
  const useAccent =
    tone === "success" ||
    tone === "warning" ||
    tone === "critical" ||
    tone === "accent";
  return {
    margin: 0,
    color: useAccent ? accent : riskVisualColors.text,
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 1.25,
  };
}

export function riskCardDetailStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.textSoft,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

export function riskInsightGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
    gap: riskVisualSpacing.cardGap,
  };
}

export function riskObjectContextStripStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextStripStyle(muted);
}

export function riskObjectContextValueStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextValueStyle(muted);
}

export function riskObjectContextEmptyStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.muted,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.35,
  };
}

export function riskSummaryVisualCardStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: riskVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: riskVisualRadius.card,
    border: `1px solid ${riskVisualColors.border}`,
    borderLeft: `3px solid ${riskVisualColors.warning}`,
    background: riskVisualColors.cardBg,
    minWidth: 0,
  };
}

export function riskSceneCoverageCardStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: riskVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: riskVisualRadius.card,
    border: `1px solid ${riskVisualColors.border}`,
    borderLeft: `3px solid ${riskVisualColors.accent}`,
    background: riskVisualColors.cardBg,
    minWidth: 0,
  };
}

export function riskSummaryMetricsGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 96px), 1fr))",
    gap: riskVisualSpacing.cardGap,
  };
}

export function riskSummaryMetricValueStyle(accent: string): React.CSSProperties {
  return {
    margin: 0,
    color: accent,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  };
}

export function riskSummaryMetricLabelStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.label,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

export function resolveRiskSeverityAccent(severity: string): string {
  const normalized = severity.trim().toLowerCase();
  if (normalized.includes("critical")) return riskVisualColors.critical;
  if (
    normalized.includes("elevated") ||
    normalized.includes("warning") ||
    normalized.includes("high")
  ) {
    return riskVisualColors.warning;
  }
  return riskVisualColors.textSoft;
}

export function riskTopRisksListStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: riskVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: riskVisualRadius.card,
    border: `1px solid ${riskVisualColors.border}`,
    borderLeft: `3px solid ${riskVisualColors.critical}`,
    background: riskVisualColors.cardBg,
    minWidth: 0,
    overflow: "hidden",
  };
}

export function riskTopRisksHeaderRowStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 1fr)",
    gap: riskVisualSpacing.cardGap,
    paddingBottom: 6,
    borderBottom: `1px solid ${riskVisualColors.border}`,
  };
}

export function riskTopRisksRowStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 1fr)",
    gap: riskVisualSpacing.cardGap,
    alignItems: "start",
    padding: "6px 0",
    borderBottom: `1px solid ${riskVisualColors.border}`,
  };
}

export function riskTopRisksHeaderCellStyle(): React.CSSProperties {
  return riskSummaryMetricLabelStyle();
}

export function riskTopRisksCellStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.text,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.35,
    wordBreak: "break-word",
  };
}

export function riskTopRisksSeverityCellStyle(severity: string): React.CSSProperties {
  return {
    ...riskTopRisksCellStyle(),
    color: resolveRiskSeverityAccent(severity),
    fontWeight: 700,
    textTransform: "capitalize",
  };
}

export function riskTopRisksEmptyStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: riskVisualColors.muted,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

let visualPassTraceLogged = false;

export function traceRiskVisualPassOnce(mountKey?: string | null): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  if (visualPassTraceLogged) return;
  visualPassTraceLogged = true;
  globalThis.console?.debug?.(MRP_RISK_VISUAL_TAG, {
    action: "risk_visual_surface_active",
    version: RISK_VISUAL_SURFACE_VERSION,
    mountKey: mountKey ?? null,
  });
}

/** @internal */
export function resetRiskVisualContractForTests(): void {
  visualPassTraceLogged = false;
}
