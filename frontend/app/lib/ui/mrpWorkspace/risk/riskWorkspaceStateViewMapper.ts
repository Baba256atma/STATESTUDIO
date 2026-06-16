/**
 * MRP:4C:1 / 4C:2 — Map RiskWorkspaceState to workspace card views.
 */

import {
  RISK_WORKSPACE_SECTION_ORDER,
  type RiskWorkspaceCardTone,
  type RiskWorkspaceCardView,
  type RiskWorkspaceView,
} from "./riskWorkspaceContract.ts";
import { MRP_RISK_STATE_TAG } from "./riskWorkspaceMetricsContract.ts";
import { buildRiskVisualSurfaceFromState } from "./riskVisualSurfaceMapper.ts";
import {
  RISK_EMPTY_DETAIL,
  RISK_EMPTY_HEADLINE,
  RISK_LOADING_DETAIL,
  RISK_LOADING_HEADLINE,
  type RiskFieldSnapshot,
  type RiskWorkspaceState,
} from "./riskWorkspaceStateContract.ts";

function resolveFieldTone(
  state: RiskWorkspaceState,
  fallback: RiskWorkspaceCardTone
): RiskWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  if (state.criticalRiskCount > 0) return "critical";
  if (state.elevatedRiskCount > 0) return "warning";
  return fallback;
}

function buildMetricsFieldSnapshots(state: RiskWorkspaceState): Readonly<{
  riskSummary: RiskFieldSnapshot;
  topRisks: RiskFieldSnapshot;
  riskDrivers: RiskFieldSnapshot;
  recommendedMonitoring: RiskFieldSnapshot;
}> {
  const hasRiskSignals = state.riskCount > 0;

  return Object.freeze({
    riskSummary: Object.freeze({
      headline: hasRiskSignals
        ? `${state.riskCount} tracked risk signal${state.riskCount === 1 ? "" : "s"}`
        : "No active risk signals detected",
      detail: hasRiskSignals
        ? `${state.criticalRiskCount} critical · ${state.elevatedRiskCount} elevated · dominant ${state.dominantRiskCategory}`
        : `${MRP_RISK_STATE_TAG} Structural scan — no elevated scene risk markers detected.`,
    }),
    topRisks: Object.freeze({
      headline: hasRiskSignals
        ? `${state.criticalRiskCount} critical · ${state.elevatedRiskCount} elevated`
        : "No prioritized risks",
      detail: hasRiskSignals
        ? "Ranked from scene severity, status, and scanner markers."
        : `${MRP_RISK_STATE_TAG} Top risk ranking activates when scene risk markers are present.`,
    }),
    riskDrivers: Object.freeze({
      headline: hasRiskSignals
        ? `Dominant category: ${state.dominantRiskCategory}`
        : "No dominant risk category",
      detail: hasRiskSignals
        ? `${state.riskCount} objects contributing to current risk posture.`
        : `${MRP_RISK_STATE_TAG} Risk drivers derive from read-only workspace scene data.`,
    }),
    recommendedMonitoring: Object.freeze({
      headline: state.objectContext.hasSelection
        ? `Monitor selection: ${state.objectContext.selectedObject}`
        : "Workspace-wide monitoring posture",
      detail: hasRiskSignals
        ? "Prioritize critical signals and elevated markers in the active scene."
        : `${MRP_RISK_STATE_TAG} Monitoring guidance follows derived risk metrics.`,
    }),
  });
}

function buildFieldCard(
  id: RiskWorkspaceCardView["id"],
  label: string,
  field: RiskFieldSnapshot,
  state: RiskWorkspaceState,
  tone: RiskWorkspaceCardTone
): RiskWorkspaceCardView {
  return Object.freeze({
    id,
    label,
    headline:
      state.phase === "loading"
        ? RISK_LOADING_HEADLINE
        : state.phase === "empty"
          ? RISK_EMPTY_HEADLINE
          : field.headline,
    detail:
      state.phase === "loading"
        ? RISK_LOADING_DETAIL
        : state.phase === "empty"
          ? RISK_EMPTY_DETAIL
          : field.detail,
    tone: resolveFieldTone(state, tone),
  });
}

export function buildRiskWorkspaceViewFromState(
  state: RiskWorkspaceState
): RiskWorkspaceView {
  const fields =
    state.phase === "ready" ? buildMetricsFieldSnapshots(state) : state;

  const cards: RiskWorkspaceCardView[] = [
    buildFieldCard(
      "risk_summary",
      "Risk Summary",
      state.phase === "ready" ? fields.riskSummary : state.riskSummary,
      state,
      "warning"
    ),
    buildFieldCard(
      "top_risks",
      "Top Risks",
      state.phase === "ready" ? fields.topRisks : state.topRisks,
      state,
      "critical"
    ),
    buildFieldCard(
      "risk_drivers",
      "Risk Drivers",
      state.phase === "ready" ? fields.riskDrivers : state.riskDrivers,
      state,
      "accent"
    ),
    buildFieldCard(
      "recommended_monitoring",
      "Recommended Monitoring",
      state.phase === "ready"
        ? fields.recommendedMonitoring
        : state.recommendedMonitoring,
      state,
      "neutral"
    ),
  ];

  const orderedCards = RISK_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "risk",
    cards: Object.freeze(orderedCards),
    objectContext: state.objectContext,
    visualSurface: buildRiskVisualSurfaceFromState(state),
    sceneCoverage: state.sceneCoverage,
    sceneAwarenessReadOnly: state.sceneAwarenessReadOnly,
    scanPurpose:
      "Review current risk posture and monitoring priorities within 5–10 seconds.",
    phase: state.phase,
    revision: state.revision,
    source: "risk_workspace_runtime_state",
  });
}
