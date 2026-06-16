/**
 * MRP:4C:4 — Risk workspace executive visual surface contract.
 *
 * Read-only presentation layer — no charts, simulation, or scenario generation.
 */

export const MRP_RISK_VISUAL_TAG = "[MRP_RISK_VISUAL]" as const;

export const RISK_VISUAL_SURFACE_VERSION = "4C.4.0";

export type RiskSummaryVisual = Readonly<{
  totalRisks: number;
  elevatedRisks: number;
  criticalRisks: number;
}>;

export type RiskTopRiskRow = Readonly<{
  risk: string;
  severity: string;
  impact: string;
}>;

export type RiskVisualSurface = Readonly<{
  summary: RiskSummaryVisual;
  topRisks: readonly RiskTopRiskRow[];
  emptyMessage: string | null;
}>;

export const DEFAULT_RISK_SUMMARY_VISUAL: RiskSummaryVisual = Object.freeze({
  totalRisks: 0,
  elevatedRisks: 0,
  criticalRisks: 0,
});

export const DEFAULT_RISK_VISUAL_SURFACE: RiskVisualSurface = Object.freeze({
  summary: DEFAULT_RISK_SUMMARY_VISUAL,
  topRisks: Object.freeze([]),
  emptyMessage: "No prioritized risks in the active scene.",
});

export const RISK_SUMMARY_METRIC_LABELS = Object.freeze({
  totalRisks: "Total Risks",
  elevatedRisks: "Elevated Risks",
  criticalRisks: "Critical Risks",
});

export const RISK_TOP_RISKS_COLUMN_LABELS = Object.freeze({
  risk: "Risk",
  severity: "Severity",
  impact: "Impact",
});
