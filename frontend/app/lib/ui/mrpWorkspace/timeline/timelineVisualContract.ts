/**
 * MRP:4D:1 / 4D:4 — Timeline workspace visual contract.
 */

import type React from "react";

import type { TimelineWorkspaceCardTone } from "./timelineWorkspaceContract.ts";
import {
  MRP_TIMELINE_VISUAL_TAG,
  TIMELINE_VISUAL_SURFACE_VERSION,
} from "./timelineVisualSurfaceContract.ts";
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

export const TIMELINE_VISUAL_PASS_TAG = MRP_TIMELINE_VISUAL_TAG;
export const TIMELINE_VISUAL_VERSION = TIMELINE_VISUAL_SURFACE_VERSION;

export const timelineVisualRadius = Object.freeze({
  section: 6,
  card: 6,
});

export const timelineVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const timelineVisualColors = Object.freeze({
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

const TONE_ACCENT: Readonly<Record<TimelineWorkspaceCardTone, string>> = Object.freeze({
  neutral: timelineVisualColors.border,
  muted: timelineVisualColors.border,
  success: timelineVisualColors.success,
  warning: timelineVisualColors.warning,
  critical: timelineVisualColors.critical,
  accent: timelineVisualColors.accent,
});

export function resolveTimelineToneAccent(tone: TimelineWorkspaceCardTone): string {
  return TONE_ACCENT[tone] ?? timelineVisualColors.border;
}

export function timelineSectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function timelineWorkspaceShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryWorkspaceShellStyle(),
    padding: `${timelineVisualSpacing.shellPaddingY}px ${timelineVisualSpacing.shellPaddingX}px`,
    gap: timelineVisualSpacing.sectionGap,
    background: timelineVisualColors.shellBg,
    color: timelineVisualColors.text,
  };
}

export function timelineHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function timelineHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function timelineCardStyle(tone: TimelineWorkspaceCardTone): React.CSSProperties {
  return executiveSummaryCardStyle(tone);
}

export function timelineCardHeadlineStyle(
  tone: TimelineWorkspaceCardTone
): React.CSSProperties {
  return executiveSummaryCardHeadlineStyle(tone);
}

export function timelineCardDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

export function timelineInsightGridStyle(): React.CSSProperties {
  return executiveSummaryInsightGridStyle();
}

export function timelineObjectContextStripStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextStripStyle(muted);
}

export function timelineObjectContextValueStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextValueStyle(muted);
}

export function timelineObjectContextEmptyStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: timelineVisualColors.muted,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.35,
  };
}

export function timelineSummaryVisualCardStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: timelineVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: timelineVisualRadius.card,
    border: `1px solid ${timelineVisualColors.border}`,
    borderLeft: `3px solid ${timelineVisualColors.accent}`,
    background: timelineVisualColors.cardBg,
    minWidth: 0,
  };
}

export function timelineSceneCoverageCardStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: timelineVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: timelineVisualRadius.card,
    border: `1px solid ${timelineVisualColors.border}`,
    borderLeft: `3px solid ${timelineVisualColors.success}`,
    background: timelineVisualColors.cardBg,
    minWidth: 0,
  };
}

export function timelineSummaryMetricsGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 96px), 1fr))",
    gap: timelineVisualSpacing.cardGap,
  };
}

export function timelineSummaryMetricValueStyle(accent: string): React.CSSProperties {
  return {
    margin: 0,
    color: accent,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  };
}

export function timelineSummaryMetricLabelStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: timelineVisualColors.label,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

export function timelineSummaryMetricTextValueStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: timelineVisualColors.text,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.25,
    wordBreak: "break-word",
  };
}

export function resolveTimelineCategoryAccent(category: string): string {
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("risk")) return timelineVisualColors.critical;
  if (normalized.includes("decision")) return timelineVisualColors.warning;
  if (normalized.includes("object")) return timelineVisualColors.accent;
  return timelineVisualColors.textSoft;
}

export function timelineEventsListStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: timelineVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: timelineVisualRadius.card,
    border: `1px solid ${timelineVisualColors.border}`,
    borderLeft: `3px solid ${timelineVisualColors.warning}`,
    background: timelineVisualColors.cardBg,
    minWidth: 0,
    overflow: "hidden",
  };
}

export function timelineDecisionHistoryListStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: timelineVisualSpacing.rowGap,
    padding: "12px 12px 12px 14px",
    borderRadius: timelineVisualRadius.card,
    border: `1px solid ${timelineVisualColors.border}`,
    borderLeft: `3px solid ${timelineVisualColors.success}`,
    background: timelineVisualColors.cardBg,
    minWidth: 0,
    overflow: "hidden",
  };
}

export function timelineEventsHeaderRowStyle(columns: string): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: columns,
    gap: timelineVisualSpacing.cardGap,
    paddingBottom: 6,
    borderBottom: `1px solid ${timelineVisualColors.border}`,
  };
}

export function timelineEventsRowStyle(columns: string): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: columns,
    gap: timelineVisualSpacing.cardGap,
    alignItems: "start",
    padding: "6px 0",
    borderBottom: `1px solid ${timelineVisualColors.border}`,
  };
}

export function timelineEventsHeaderCellStyle(): React.CSSProperties {
  return timelineSummaryMetricLabelStyle();
}

export function timelineEventsCellStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: timelineVisualColors.text,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.35,
    wordBreak: "break-word",
  };
}

export function timelineEventsCategoryCellStyle(category: string): React.CSSProperties {
  return {
    ...timelineEventsCellStyle(),
    color: resolveTimelineCategoryAccent(category),
    fontWeight: 700,
  };
}

export function timelineEventsEmptyStyle(): React.CSSProperties {
  return {
    margin: 0,
    color: timelineVisualColors.muted,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

let visualPassTraceLogged = false;

export function traceTimelineVisualPassOnce(mountKey?: string | null): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  if (visualPassTraceLogged) return;
  visualPassTraceLogged = true;
  globalThis.console?.debug?.(MRP_TIMELINE_VISUAL_TAG, {
    action: "timeline_visual_surface_active",
    version: TIMELINE_VISUAL_SURFACE_VERSION,
    mountKey: mountKey ?? null,
  });
}

/** @internal */
export function resetTimelineVisualContractForTests(): void {
  visualPassTraceLogged = false;
}
