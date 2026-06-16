/**
 * MRP:4E:1 — Scenario workspace visual contract.
 */

import type React from "react";

import type { ScenarioWorkspaceCardTone } from "./scenarioWorkspaceContract.ts";
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

export const SCENARIO_VISUAL_PASS_TAG = "[MRP_SCENARIO_VISUAL]" as const;
export const SCENARIO_VISUAL_VERSION = "4E.4.0";

export const scenarioVisualSpacing = Object.freeze({
  shellPaddingX: 12,
  shellPaddingY: 14,
  sectionGap: 14,
  cardGap: 10,
  fieldGap: 4,
  rowGap: 6,
});

export const scenarioVisualColors = Object.freeze({
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

const TONE_ACCENT: Readonly<Record<ScenarioWorkspaceCardTone, string>> = Object.freeze({
  neutral: scenarioVisualColors.border,
  muted: scenarioVisualColors.border,
  success: scenarioVisualColors.success,
  warning: scenarioVisualColors.warning,
  critical: scenarioVisualColors.critical,
  accent: scenarioVisualColors.accent,
});

const loggedVisualKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveScenarioToneAccent(tone: ScenarioWorkspaceCardTone): string {
  return TONE_ACCENT[tone] ?? scenarioVisualColors.border;
}

export function scenarioSectionLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function scenarioWorkspaceShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryWorkspaceShellStyle(),
    padding: `${scenarioVisualSpacing.shellPaddingY}px ${scenarioVisualSpacing.shellPaddingX}px`,
    gap: scenarioVisualSpacing.sectionGap,
    background: scenarioVisualColors.shellBg,
    color: scenarioVisualColors.text,
  };
}

export function scenarioHeaderTitleStyle(): React.CSSProperties {
  return executiveSummaryHeaderTitleStyle();
}

export function scenarioHeaderPurposeStyle(): React.CSSProperties {
  return executiveSummaryHeaderPurposeStyle();
}

export function scenarioCardStyle(tone: ScenarioWorkspaceCardTone): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${resolveScenarioToneAccent(tone)}`,
    background: scenarioVisualColors.cardBg,
  };
}

export function scenarioCardHeadlineStyle(
  tone: ScenarioWorkspaceCardTone
): React.CSSProperties {
  return {
    ...executiveSummaryCardHeadlineStyle(),
    color: tone === "muted" ? scenarioVisualColors.textSoft : scenarioVisualColors.text,
  };
}

export function scenarioCardDetailStyle(): React.CSSProperties {
  return executiveSummaryCardDetailStyle();
}

export function scenarioInsightGridStyle(): React.CSSProperties {
  return {
    ...executiveSummaryInsightGridStyle(),
    gap: scenarioVisualSpacing.cardGap,
  };
}

export function scenarioGenerationGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: scenarioVisualSpacing.cardGap,
    width: "100%",
  };
}

export function scenarioGenerationCardStyle(
  tone: "success" | "accent" | "warning" | "critical"
): React.CSSProperties {
  const accent =
    tone === "success"
      ? scenarioVisualColors.success
      : tone === "warning"
        ? scenarioVisualColors.warning
        : tone === "critical"
          ? scenarioVisualColors.critical
          : scenarioVisualColors.accent;
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${accent}`,
    background: scenarioVisualColors.cardBg,
  };
}

export function scenarioGenerationMetricLabelStyle(): React.CSSProperties {
  return executiveSummarySectionLabelStyle();
}

export function scenarioGenerationMetricValueStyle(accent: string): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(),
    color: accent,
  };
}

export function scenarioComparisonMatrixShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: scenarioVisualSpacing.fieldGap,
    background: scenarioVisualColors.cardBg,
    overflowX: "auto",
  };
}

export function scenarioComparisonMatrixTableStyle(): React.CSSProperties {
  return {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
  };
}

export function scenarioComparisonMatrixHeaderCellStyle(): React.CSSProperties {
  return {
    ...executiveSummarySectionLabelStyle(),
    textAlign: "left",
    padding: "6px 8px",
    borderBottom: `1px solid ${scenarioVisualColors.border}`,
    whiteSpace: "nowrap",
  };
}

export function scenarioComparisonMatrixCellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(),
    padding: "8px",
    borderBottom: `1px solid ${scenarioVisualColors.border}`,
    verticalAlign: "top",
  };
}

export function scenarioProjectionPanelShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: scenarioVisualSpacing.sectionGap,
    background: scenarioVisualColors.cardBg,
  };
}

export function scenarioProjectionTrendRowStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(120px, 1fr) minmax(120px, 120px) minmax(160px, 1fr)",
    gap: scenarioVisualSpacing.cardGap,
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${scenarioVisualColors.border}`,
  };
}

export function scenarioProjectionCurveShellStyle(): React.CSSProperties {
  return {
    width: "100%",
    minHeight: 56,
    borderRadius: 8,
    border: `1px solid ${scenarioVisualColors.border}`,
    background: "rgba(2,6,23,0.35)",
    padding: "6px 8px",
  };
}

export function scenarioProjectionTrendDeltaStyle(
  direction: "up" | "down" | "stable"
): React.CSSProperties {
  const color =
    direction === "up"
      ? scenarioVisualColors.success
      : direction === "down"
        ? scenarioVisualColors.critical
        : scenarioVisualColors.textSoft;
  return {
    ...executiveSummaryObjectContextValueStyle(),
    color,
    fontWeight: 600,
    whiteSpace: "nowrap",
  };
}

export function scenarioProjectionImpactGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: scenarioVisualSpacing.cardGap,
    width: "100%",
  };
}

export function scenarioProjectionImpactCardStyle(
  direction: "up" | "down" | "stable"
): React.CSSProperties {
  const accent =
    direction === "up"
      ? scenarioVisualColors.success
      : direction === "down"
        ? scenarioVisualColors.warning
        : scenarioVisualColors.border;
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${accent}`,
    background: scenarioVisualColors.cardBg,
    display: "flex",
    flexDirection: "column",
    gap: scenarioVisualSpacing.fieldGap,
  };
}

export function scenarioHandoffPanelShellStyle(): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    display: "flex",
    flexDirection: "column",
    gap: scenarioVisualSpacing.fieldGap,
    background: scenarioVisualColors.cardBg,
  };
}

export function scenarioHandoffCommitButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    alignSelf: "flex-start",
    padding: "8px 14px",
    borderRadius: 8,
    border: `1px solid ${scenarioVisualColors.accent}`,
    background: disabled ? "rgba(2,6,23,0.35)" : scenarioVisualColors.accent,
    color: disabled ? scenarioVisualColors.textSoft : "#020617",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}

export function scenarioHandoffScenarioOptionStyle(selected: boolean): React.CSSProperties {
  return {
    ...executiveSummaryCardStyle(),
    borderLeft: `3px solid ${selected ? scenarioVisualColors.accent : scenarioVisualColors.border}`,
    background: scenarioVisualColors.cardBg,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: scenarioVisualSpacing.fieldGap,
  };
}

export function scenarioWorkspaceContextStripStyle(muted: boolean): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextStripStyle(),
    opacity: muted ? 0.72 : 1,
  };
}

export function scenarioWorkspaceContextValueStyle(muted: boolean): React.CSSProperties {
  return {
    ...executiveSummaryObjectContextValueStyle(),
    color: muted ? scenarioVisualColors.textSoft : scenarioVisualColors.text,
  };
}

export function traceScenarioVisualPassOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedVisualKeys.has(key)) return;
  loggedVisualKeys.add(key);
  globalThis.console?.debug?.(SCENARIO_VISUAL_PASS_TAG, {
    action: "visual_pass",
    version: SCENARIO_VISUAL_VERSION,
    mountKey,
  });
}

export function resetScenarioVisualContractForTests(): void {
  loggedVisualKeys.clear();
}
