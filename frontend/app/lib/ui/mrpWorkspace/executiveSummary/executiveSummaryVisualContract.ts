/**
 * MRP:4:4 — Executive Summary visual language contract.
 *
 * Dark executive command center — Nexora Type-C semantic tokens, no motion clutter.
 */

import type React from "react";

import type {
  ExecutiveSummarySystemStatus,
  ExecutiveSummaryWorkspaceCardTone,
} from "./executiveSummaryWorkspaceContract.ts";

export const EXEC_SUMMARY_VISUAL_PASS_TAG = "[EXEC_SUMMARY_VISUAL_PASS]" as const;

export const EXECUTIVE_SUMMARY_VISUAL_VERSION = "4.4.0";

export const EXECUTIVE_SUMMARY_SCAN_SECONDS = 10;

/** Flat command-center geometry aligned with MRP context header (4px tab radius family). */
export const executiveSummaryVisualRadius = Object.freeze({
  section: 6,
  card: 6,
  indicator: 999,
});

export const executiveSummaryVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const executiveSummaryVisualColors = Object.freeze({
  shellBg: "var(--nx-bg-deep)",
  sectionBg: "var(--nx-console-bg)",
  cardBg: "var(--nx-bg-panel-soft)",
  divider: "var(--nx-divider)",
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

const TONE_ACCENT: Readonly<Record<ExecutiveSummaryWorkspaceCardTone, string>> = Object.freeze({
  neutral: executiveSummaryVisualColors.border,
  muted: executiveSummaryVisualColors.border,
  success: executiveSummaryVisualColors.success,
  warning: executiveSummaryVisualColors.warning,
  critical: executiveSummaryVisualColors.critical,
  accent: executiveSummaryVisualColors.accent,
});

const SYSTEM_STATUS_ACCENT: Readonly<Record<ExecutiveSummarySystemStatus, string>> = Object.freeze({
  healthy: executiveSummaryVisualColors.success,
  warning: executiveSummaryVisualColors.warning,
  critical: executiveSummaryVisualColors.critical,
});

export function resolveExecutiveSummaryToneAccent(
  tone: ExecutiveSummaryWorkspaceCardTone
): string {
  return TONE_ACCENT[tone] ?? executiveSummaryVisualColors.border;
}

export function resolveExecutiveSummarySystemStatusAccent(
  status: ExecutiveSummarySystemStatus
): string {
  return SYSTEM_STATUS_ACCENT[status] ?? executiveSummaryVisualColors.muted;
}

export function executiveSummarySectionLabelStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: executiveSummaryVisualColors.label,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  };
}

export function executiveSummaryWorkspaceShellStyle(): React.CSSProperties {
  return {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    padding: `${executiveSummaryVisualSpacing.shellPaddingY}px ${executiveSummaryVisualSpacing.shellPaddingX}px`,
    gap: executiveSummaryVisualSpacing.sectionGap,
    background: executiveSummaryVisualColors.shellBg,
    color: executiveSummaryVisualColors.text,
  };
}

export function executiveSummaryHeaderTitleStyle(): React.CSSProperties {
  return {
    margin: 0,
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    color: executiveSummaryVisualColors.text,
    lineHeight: 1.25,
  };
}

export function executiveSummaryHeaderPurposeStyle(): React.CSSProperties {
  return {
    margin: 0,
    fontSize: 11,
    fontWeight: 500,
    color: executiveSummaryVisualColors.muted,
    lineHeight: 1.4,
  };
}

export function executiveSummaryObjectContextStripStyle(muted = false): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
    gap: executiveSummaryVisualSpacing.cardGap,
    padding: "10px 12px",
    borderRadius: executiveSummaryVisualRadius.section,
    border: `1px solid ${executiveSummaryVisualColors.border}`,
    background: executiveSummaryVisualColors.sectionBg,
    opacity: muted ? 0.92 : 1,
  };
}

export function executiveSummaryObjectContextValueStyle(muted = false): React.CSSProperties {
  return {
    margin: 0,
    color: muted ? executiveSummaryVisualColors.muted : executiveSummaryVisualColors.text,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.3,
    wordBreak: "break-word",
  };
}

export function executiveSummaryCardStyle(
  tone: ExecutiveSummaryWorkspaceCardTone = "neutral"
): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: executiveSummaryVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: executiveSummaryVisualRadius.card,
    border: `1px solid ${executiveSummaryVisualColors.border}`,
    borderLeft: `3px solid ${resolveExecutiveSummaryToneAccent(tone)}`,
    background: executiveSummaryVisualColors.cardBg,
    minWidth: 0,
  };
}

export function executiveSummaryCardHeadlineStyle(
  tone: ExecutiveSummaryWorkspaceCardTone = "neutral"
): React.CSSProperties {
  const accent = resolveExecutiveSummaryToneAccent(tone);
  const useAccent =
    tone === "success" ||
    tone === "warning" ||
    tone === "critical" ||
    tone === "accent";
  return {
    margin: 0,
    color: useAccent ? accent : executiveSummaryVisualColors.text,
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 1.25,
  };
}

export function executiveSummaryCardDetailStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: executiveSummaryVisualColors.textSoft,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

export function executiveSummarySystemStatusIndicatorStyle(
  status: ExecutiveSummarySystemStatus
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: resolveExecutiveSummarySystemStatusAccent(status),
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

export function executiveSummarySystemStatusDotStyle(
  status: ExecutiveSummarySystemStatus
): React.CSSProperties {
  return {
    width: 7,
    height: 7,
    borderRadius: executiveSummaryVisualRadius.indicator,
    background: resolveExecutiveSummarySystemStatusAccent(status),
    flexShrink: 0,
  };
}

export function executiveSummaryInsightGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
    gap: executiveSummaryVisualSpacing.cardGap,
  };
}

let visualPassTraceLogged = false;

export function traceExecutiveSummaryVisualPassOnce(mountKey?: string | null): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  if (visualPassTraceLogged) return;
  visualPassTraceLogged = true;
  globalThis.console?.debug?.(EXEC_SUMMARY_VISUAL_PASS_TAG, {
    action: "executive_visual_language_active",
    version: EXECUTIVE_SUMMARY_VISUAL_VERSION,
    scanTargetSeconds: EXECUTIVE_SUMMARY_SCAN_SECONDS,
    mountKey: mountKey ?? null,
  });
}

/** @internal */
export function resetExecutiveSummaryVisualContractForTests(): void {
  visualPassTraceLogged = false;
}
