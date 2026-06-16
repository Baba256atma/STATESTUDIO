/**
 * MRP:4F:1 — War Room workspace visual contract.
 */

import type React from "react";

import type { WarRoomWorkspaceCardTone } from "./warRoomWorkspaceContract.ts";
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
  executiveSummaryWorkspaceShellStyle,
} from "../executiveSummary/executiveSummaryVisualContract.ts";

export const WAR_ROOM_VISUAL_PASS_TAG = "[MRP_WARROOM_VISUAL]" as const;
export const WAR_ROOM_VISUAL_VERSION = "4F.1.0";

export const warRoomVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const warRoomVisualColors = Object.freeze({
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

const TONE_ACCENT: Readonly<Record<WarRoomWorkspaceCardTone, string>> = Object.freeze({
  neutral: warRoomVisualColors.border,
  muted: warRoomVisualColors.border,
  success: warRoomVisualColors.success,
  warning: warRoomVisualColors.warning,
  critical: warRoomVisualColors.critical,
  accent: warRoomVisualColors.accent,
});

const loggedVisualKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveWarRoomToneAccent(tone: WarRoomWorkspaceCardTone): string {
  return TONE_ACCENT[tone] ?? warRoomVisualColors.border;
}

export function warRoomSectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function warRoomWorkspaceShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryWorkspaceShellStyle(),
    padding: `${warRoomVisualSpacing.shellPaddingY}px ${warRoomVisualSpacing.shellPaddingX}px`,
    gap: warRoomVisualSpacing.sectionGap,
    background: warRoomVisualColors.shellBg,
    color: warRoomVisualColors.text,
  };
}

export function warRoomHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function warRoomHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function warRoomCardStyle(tone: WarRoomWorkspaceCardTone): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${resolveWarRoomToneAccent(tone)}`,
    background: warRoomVisualColors.cardBg,
  };
}

export function warRoomCardHeadlineStyle(
  tone: WarRoomWorkspaceCardTone
): React.CSSProperties {
  return {
    ...executiveSummaryCardHeadlineStyle(),
    color: tone === "muted" ? warRoomVisualColors.textSoft : warRoomVisualColors.text,
  };
}

export function warRoomCardDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

export function warRoomInsightGridStyle(): React.CSSProperties {
  return {
    ...executiveSummaryInsightGridStyle(),
    gap: warRoomVisualSpacing.cardGap,
  };
}

export function warRoomWorkspaceContextStripStyle(muted: boolean): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextStripStyle(),
    opacity: muted ? 0.72 : 1,
  };
}

export function warRoomWorkspaceContextValueStyle(muted: boolean): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(),
    color: muted ? warRoomVisualColors.textSoft : warRoomVisualColors.text,
  };
}

export function warRoomActionPlanPanelShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: warRoomVisualSpacing.sectionGap,
    background: warRoomVisualColors.cardBg,
  };
}

export function warRoomActionPlanSectionShellStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: warRoomVisualSpacing.fieldGap,
  };
}

export function warRoomActionPlanItemRowStyle(
  status: "pending" | "active" | "complete"
): React.CSSProperties {
  const accent =
    status === "active"
      ? warRoomVisualColors.accent
      : status === "complete"
        ? warRoomVisualColors.success
        : warRoomVisualColors.border;
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${accent}`,
    background: warRoomVisualColors.cardBg,
    display: "grid",
    gridTemplateColumns: "minmax(160px, 1fr) minmax(100px, 120px) minmax(80px, 90px) minmax(80px, 90px)",
    gap: warRoomVisualSpacing.cardGap,
    alignItems: "center",
  };
}

export function warRoomActionPlanMetaLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function warRoomActionPlanMetaValueStyle(accent?: string): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(),
    color: accent ?? warRoomVisualColors.text,
  };
}

export function warRoomMonitoringPanelShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: warRoomVisualSpacing.sectionGap,
    background: warRoomVisualColors.cardBg,
  };
}

export function warRoomMonitoringSectionShellStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: warRoomVisualSpacing.fieldGap,
  };
}

export function warRoomMonitoringItemRowStyle(accent: string): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${accent}`,
    background: warRoomVisualColors.cardBg,
    display: "flex",
    flexDirection: "column",
    gap: warRoomVisualSpacing.fieldGap,
  };
}

export function resolveWarRoomMonitorSeverityAccent(
  severity: "critical" | "warning" | "stable" | "info" | "healthy" | "at_risk"
): string {
  if (severity === "critical") return warRoomVisualColors.critical;
  if (severity === "warning" || severity === "at_risk") return warRoomVisualColors.warning;
  if (severity === "healthy" || severity === "stable") return warRoomVisualColors.success;
  if (severity === "info") return warRoomVisualColors.accent;
  return warRoomVisualColors.border;
}

export function resolveWarRoomEscalationAccent(
  level: "none" | "watch" | "escalate" | "critical"
): string {
  if (level === "critical") return warRoomVisualColors.critical;
  if (level === "escalate") return warRoomVisualColors.warning;
  if (level === "watch") return warRoomVisualColors.accent;
  return warRoomVisualColors.border;
}

export function traceWarRoomVisualPassOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedVisualKeys.has(key)) return;
  loggedVisualKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_VISUAL_PASS_TAG, {
    action: "visual_pass",
    version: WAR_ROOM_VISUAL_VERSION,
    mountKey,
  });
}

export function resetWarRoomVisualContractForTests(): void {
  loggedVisualKeys.clear();
}
