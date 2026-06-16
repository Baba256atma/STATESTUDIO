/**
 * MRP:5A:1 — Advisory workspace visual contract.
 */

import type React from "react";

import type { AdvisoryWorkspaceCardTone } from "./advisoryWorkspaceContract.ts";
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

export const ADVISORY_VISUAL_PASS_TAG = "[MRP_ADVISORY_VISUAL]" as const;
export const ADVISORY_VISUAL_VERSION = "5A.1.0";

export const advisoryVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const advisoryVisualColors = Object.freeze({
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

const TONE_ACCENT: Readonly<Record<AdvisoryWorkspaceCardTone, string>> = Object.freeze({
  neutral: advisoryVisualColors.border,
  muted: advisoryVisualColors.border,
  success: advisoryVisualColors.success,
  warning: advisoryVisualColors.warning,
  critical: advisoryVisualColors.critical,
  accent: advisoryVisualColors.accent,
});

const loggedVisualKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceAdvisoryVisualPassOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedVisualKeys.has(key)) return;
  loggedVisualKeys.add(key);
  globalThis.console?.debug?.(ADVISORY_VISUAL_PASS_TAG, {
    action: "advisory_visual_pass",
    mountKey: mountKey ?? null,
    version: ADVISORY_VISUAL_VERSION,
  });
}

export function resetAdvisoryVisualContractForTests(): void {
  loggedVisualKeys.clear();
}

export function advisoryWorkspaceShellStyle(): React.CSSProperties {
  return executiveSummaryWorkspaceShellStyle();
}

export function advisoryHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function advisoryHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function advisoryInsightGridStyle(): React.CSSProperties {
  return executiveSummaryInsightGridStyle();
}

export function advisorySectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function advisoryCardStyle(tone: AdvisoryWorkspaceCardTone): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${TONE_ACCENT[tone]}`,
  };
}

export function advisoryCardHeadlineStyle(
  tone: AdvisoryWorkspaceCardTone
): React.CSSProperties {
  return {
    ...executiveSummaryCardHeadlineStyle(),
    color: tone === "muted" ? advisoryVisualColors.textSoft : advisoryVisualColors.text,
  };
}

export function advisoryCardDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

export function advisoryWorkspaceContextStripStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextStripStyle(muted);
}

export function advisoryWorkspaceContextValueStyle(muted: boolean): React.CSSProperties {
  return executiveSummaryObjectContextValueStyle(muted);
}

export function executiveRecommendationCardShellStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: advisoryVisualSpacing.sectionGap,
    padding: `${advisoryVisualSpacing.shellPaddingY}px ${advisoryVisualSpacing.shellPaddingX}px`,
    borderRadius: 12,
    border: `1px solid ${advisoryVisualColors.border}`,
    background: advisoryVisualColors.cardBg,
  };
}

export function executiveRecommendationFieldShellStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: advisoryVisualSpacing.fieldGap,
    minWidth: 0,
  };
}

export function executiveRecommendationFieldValueStyle(
  accent?: string
): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(false),
    color: accent ?? advisoryVisualColors.text,
  };
}

export function executiveRecommendationSourcesStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardDetailStyle(),
    color: advisoryVisualColors.textSoft,
  };
}

export function advisoryExplainabilityShellStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: advisoryVisualSpacing.sectionGap,
    padding: `${advisoryVisualSpacing.shellPaddingY}px ${advisoryVisualSpacing.shellPaddingX}px`,
    borderRadius: 12,
    border: `1px solid ${advisoryVisualColors.border}`,
    background: advisoryVisualColors.cardBg,
  };
}

export function advisoryExplainabilitySectionGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: advisoryVisualSpacing.cardGap,
  };
}

export function advisoryExplainabilityDriverListStyle(): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: advisoryVisualSpacing.rowGap,
    margin: 0,
    paddingLeft: 16,
  };
}

export function advisoryExplainabilityDriverDetailStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardDetailStyle(),
    color: advisoryVisualColors.textSoft,
  };
}

export function advisoryExplainabilityScoreStyle(accent?: string): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(false),
    color: accent ?? advisoryVisualColors.accent,
    fontSize: 18,
    fontWeight: 600,
  };
}

export function advisoryHandoffPanelShellStyle(): React.CSSProperties {
  return advisoryExplainabilityShellStyle();
}

export function advisoryHandoffCommitButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    alignSelf: "flex-start",
    padding: "8px 14px",
    borderRadius: 8,
    border: `1px solid ${disabled ? advisoryVisualColors.border : advisoryVisualColors.accent}`,
    background: disabled ? advisoryVisualColors.shellBg : advisoryVisualColors.cardBg,
    color: disabled ? advisoryVisualColors.textSoft : advisoryVisualColors.text,
    cursor: disabled ? "not-allowed" : "pointer",
    font: "inherit",
  };
}
