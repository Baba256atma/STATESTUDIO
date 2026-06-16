/**
 * MRP:4C:4 — Map RiskWorkspaceState to executive visual surface views.
 */

import {
  DEFAULT_RISK_SUMMARY_VISUAL,
  DEFAULT_RISK_VISUAL_SURFACE,
  type RiskVisualSurface,
} from "./riskVisualSurfaceContract.ts";
import {
  RISK_LOADING_HEADLINE,
  type RiskWorkspaceState,
} from "./riskWorkspaceStateContract.ts";

export function buildRiskVisualSurfaceFromState(state: RiskWorkspaceState): RiskVisualSurface {
  if (state.phase === "loading") {
    return Object.freeze({
      summary: DEFAULT_RISK_SUMMARY_VISUAL,
      topRisks: Object.freeze([]),
      emptyMessage: RISK_LOADING_HEADLINE,
    });
  }

  if (state.phase === "empty") {
    return DEFAULT_RISK_VISUAL_SURFACE;
  }

  const summary = Object.freeze({
    totalRisks: state.riskCount,
    elevatedRisks: state.elevatedRiskCount,
    criticalRisks: state.criticalRiskCount,
  });

  const topRisks = state.topRiskRows;
  const emptyMessage =
    topRisks.length === 0 ? "No prioritized risks in the active scene." : null;

  return Object.freeze({
    summary,
    topRisks,
    emptyMessage,
  });
}
