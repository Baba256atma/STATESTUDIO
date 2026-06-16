/**
 * MRP:4:10 — Operational workspace visual language contract.
 *
 * Dark executive command center — Nexora Type-C semantic tokens, aligned with Executive Summary.
 */

import type React from "react";

import {
  executiveSummaryCardDetailStyle,
  executiveSummaryCardHeadlineStyle,
  executiveSummaryCardStyle,
  executiveSummaryHeaderPurposeStyle,
  executiveSummaryHeaderTitleStyle,
  executiveSummaryInsightGridStyle,
  executiveSummaryObjectContextStripStyle,
  executiveSummaryObjectContextValueStyle,
  executiveSummarySectionLabelStyle,
  executiveSummaryVisualColors,
  executiveSummaryVisualRadius,
  executiveSummaryVisualSpacing,
  executiveSummaryWorkspaceShellStyle,
  resolveExecutiveSummaryToneAccent,
} from "../executiveSummary/executiveSummaryVisualContract.ts";
import type {
  OperationalActivityLevel,
  OperationalStatus,
  OperationalWorkspaceCardTone,
} from "./operationalWorkspaceContract.ts";

export const OPERATIONAL_VISUAL_PASS_TAG = "[OPERATIONAL_VISUAL_PASS]" as const;

export const OPERATIONAL_VISUAL_VERSION = "4.10.0";

/** Executive scan target — operational state readable within ten seconds. */
export const OPERATIONAL_SCAN_SECONDS = 10;

/** Shared command-center geometry — identical to Executive Summary. */
export const operationalVisualRadius = executiveSummaryVisualRadius;

export const operationalVisualSpacing = executiveSummaryVisualSpacing;

export const operationalVisualColors = executiveSummaryVisualColors;

const OPERATIONAL_STATUS_ACCENT: Readonly<Record<OperationalStatus, string>> = Object.freeze({
  healthy: operationalVisualColors.success,
  warning: operationalVisualColors.warning,
  critical: operationalVisualColors.critical,
});

const OPERATIONAL_ACTIVITY_ACCENT: Readonly<Record<OperationalActivityLevel, string>> =
  Object.freeze({
    low: operationalVisualColors.success,
    medium: operationalVisualColors.warning,
    high: operationalVisualColors.critical,
  });

const TONE_ACCENT: Readonly<Record<OperationalWorkspaceCardTone, string>> = Object.freeze({
  neutral: operationalVisualColors.border,
  muted: operationalVisualColors.border,
  success: operationalVisualColors.success,
  warning: operationalVisualColors.warning,
  critical: operationalVisualColors.critical,
  accent: operationalVisualColors.accent,
});

export function resolveOperationalToneAccent(tone: OperationalWorkspaceCardTone): string {
  return TONE_ACCENT[tone] ?? resolveExecutiveSummaryToneAccent(tone);
}

export function resolveOperationalStatusAccent(status: OperationalStatus): string {
  return OPERATIONAL_STATUS_ACCENT[status] ?? operationalVisualColors.muted;
}

export function resolveOperationalActivityLevelAccent(
  level: OperationalActivityLevel
): string {
  return OPERATIONAL_ACTIVITY_ACCENT[level] ?? operationalVisualColors.muted;
}

export function operationalSectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function operationalWorkspaceShellStyle(): React.CSSProperties {
  return executiveSummaryWorkspaceShellStyle();
}

export function operationalHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function operationalHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function operationalObjectContextStripStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextStripStyle(muted);
}

export function operationalObjectContextValueStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextValueStyle(muted);
}

export function operationalCardStyle(tone: OperationalWorkspaceCardTone): React.CSSProperties {
  return executiveSummaryCardStyle(tone);
}

export function operationalCardHeadlineStyle(
  tone: OperationalWorkspaceCardTone
): React.CSSProperties {
  return executiveSummaryCardHeadlineStyle(tone);
}

export function operationalCardDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

export function operationalInsightGridStyle(): React.CSSProperties {
  return executiveSummaryInsightGridStyle();
}

export function operationalStatusIndicatorStyle(
  status: OperationalStatus
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: resolveOperationalStatusAccent(status),
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };
}

export function operationalStatusDotStyle(status: OperationalStatus): React.CSSProperties {
  return {
    width: 7,
    height: 7,
    borderRadius: operationalVisualRadius.indicator,
    background: resolveOperationalStatusAccent(status),
    flexShrink: 0,
  };
}

export function operationalActivityLevelDotStyle(
  level: OperationalActivityLevel
): React.CSSProperties {
  return {
    width: 6,
    height: 6,
    borderRadius: operationalVisualRadius.indicator,
    background: resolveOperationalActivityLevelAccent(level),
    flexShrink: 0,
  };
}

export function operationalActivityLevelChipStyle(
  level: OperationalActivityLevel,
  active: boolean
): React.CSSProperties {
  const accent = resolveOperationalActivityLevelAccent(level);
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: operationalVisualRadius.indicator,
    border: `1px solid ${active ? accent : operationalVisualColors.border}`,
    background: active ? "var(--nx-nav-tile-active-bg)" : "var(--nx-bg-control)",
    color: active ? accent : operationalVisualColors.muted,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}

export function operationalActivityLevelScaleStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexWrap: "wrap",
    gap: operationalVisualSpacing.cardGap,
  };
}

let visualPassTraceLogged = false;

export function traceOperationalVisualPassOnce(mountKey?: string | null): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  if (visualPassTraceLogged) return;
  visualPassTraceLogged = true;
  globalThis.console?.debug?.(OPERATIONAL_VISUAL_PASS_TAG, {
    action: "operational_visual_language_active",
    version: OPERATIONAL_VISUAL_VERSION,
    scanTargetSeconds: OPERATIONAL_SCAN_SECONDS,
    mountKey: mountKey ?? null,
  });
}

/** @internal */
export function resetOperationalVisualContractForTests(): void {
  visualPassTraceLogged = false;
}
