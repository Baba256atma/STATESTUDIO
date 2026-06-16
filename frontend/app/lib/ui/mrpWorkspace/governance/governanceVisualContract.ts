/**
 * MRP:5B:1 — Governance workspace visual contract.
 */

import type React from "react";

import type { GovernanceWorkspacePanelTone } from "./governanceWorkspaceContract.ts";
import {
  executiveSummaryCardDetailStyle,
  executiveSummaryCardHeadlineStyle,
  executiveSummaryCardStyle,
  executiveSummaryHeaderPurposeStyle,
  executiveSummaryHeaderTitleStyle,
  executiveSummaryInsightGridStyle,
  executiveSummarySectionLabelStyle,
  executiveSummaryWorkspaceShellStyle,
} from "../executiveSummary/executiveSummaryVisualContract.ts";

export const GOVERNANCE_VISUAL_PASS_TAG = "[MRP_5B1_GOVERNANCE_VISUAL]" as const;

const TONE_ACCENT: Readonly<Record<GovernanceWorkspacePanelTone, string>> = Object.freeze({
  neutral: "var(--nx-border-soft)",
  muted: "var(--nx-border-soft)",
  success: "var(--nx-success)",
  warning: "var(--nx-warning)",
});

const loggedVisualKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceGovernanceVisualPassOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedVisualKeys.has(key)) return;
  loggedVisualKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_VISUAL_PASS_TAG, {
    action: "governance_visual_pass",
    mountKey: mountKey ?? null,
  });
}

export function resetGovernanceVisualContractForTests(): void {
  loggedVisualKeys.clear();
}

export function governanceWorkspaceShellStyle(): React.CSSProperties {
  return executiveSummaryWorkspaceShellStyle();
}

export function governanceHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function governanceHeaderSubtitleStyle(): React.CSSProperties {
  return {
    ...executiveSummaryHeaderPurposeStyle(),
    letterSpacing: "0.04em",
  };
}

export function governanceHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function governanceInsightGridStyle(): React.CSSProperties {
  return executiveSummaryInsightGridStyle();
}

export function governancePanelStyle(tone: GovernanceWorkspacePanelTone): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${TONE_ACCENT[tone]}`,
  };
}

export function governanceSectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function governancePanelHeadlineStyle(
  tone: GovernanceWorkspacePanelTone
): React.CSSProperties {
  return executiveSummaryCardHeadlineStyle(tone === "warning" ? "warning" : "neutral");
}

export function governancePanelDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

const VERDICT_COLORS: Readonly<Record<"PASS" | "WARNING" | "BLOCKED", string>> = Object.freeze({
  PASS: "var(--nx-success)",
  WARNING: "var(--nx-warning)",
  BLOCKED: "var(--nx-danger, #c0392b)",
});

export function governanceIntelligenceShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 0,
  };
}

export function governanceIntelligenceRowStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 8,
    alignItems: "start",
    paddingTop: 8,
    borderTop: "1px solid var(--nx-border-soft)",
  };
}

export function governanceIntelligenceQuestionStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardHeadlineStyle("neutral"),
    fontSize: 13,
  };
}

export function governanceIntelligenceVerdictStyle(
  verdict: "PASS" | "WARNING" | "BLOCKED"
): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: VERDICT_COLORS[verdict],
    whiteSpace: "nowrap",
  };
}

export function governanceIntelligenceRowDetailStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardDetailStyle(),
    gridColumn: "1 / -1",
    margin: 0,
  };
}

const APPROVAL_STATUS_COLORS: Readonly<
  Record<"Approved" | "Pending" | "Rejected" | "Unknown", string>
> = Object.freeze({
  Approved: "var(--nx-success)",
  Pending: "var(--nx-warning)",
  Rejected: "var(--nx-danger, #c0392b)",
  Unknown: "var(--nx-text-muted, #888)",
});

export function governanceApprovalLayerStatusStyle(
  status: "Approved" | "Pending" | "Rejected" | "Unknown"
): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: APPROVAL_STATUS_COLORS[status],
    whiteSpace: "nowrap",
  };
}

const DECISION_OUTCOME_COLORS: Readonly<Record<
  "APPROVED" | "APPROVED WITH CONDITIONS" | "REVIEW REQUIRED" | "BLOCKED",
  string
>> = Object.freeze({
  APPROVED: "var(--nx-success)",
  "APPROVED WITH CONDITIONS": "var(--nx-warning)",
  "REVIEW REQUIRED": "var(--nx-text-muted, #888)",
  BLOCKED: "var(--nx-danger, #c0392b)",
});

export function governanceDecisionGateShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 0,
    borderLeft: "3px solid var(--nx-border-soft)",
    gridColumn: "1 / -1",
  };
}

export function governanceDecisionOutcomeStyle(
  outcome: "APPROVED" | "APPROVED WITH CONDITIONS" | "REVIEW REQUIRED" | "BLOCKED"
): React.CSSProperties {
  return {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: DECISION_OUTCOME_COLORS[outcome],
  };
}

export function governanceDecisionGateRuleStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardDetailStyle(),
    fontStyle: "italic",
    margin: 0,
  };
}
