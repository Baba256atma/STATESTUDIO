/**
 * MRP:5A:1 — Map AdvisoryWorkspaceState to workspace card views.
 */

import {
  ADVISORY_RECOMMENDATION_PURPOSE,
  DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
} from "./advisoryRecommendationContract.ts";
import {
  ADVISORY_EXPLAINABILITY_PURPOSE,
  DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
} from "./advisoryExplainabilityContract.ts";
import { buildAdvisoryHandoffSurface } from "./advisoryHandoffRuntime.ts";
import {
  ADVISORY_WORKSPACE_SECTION_LABELS,
  ADVISORY_WORKSPACE_SECTION_ORDER,
  type AdvisoryWorkspaceCardTone,
  type AdvisoryWorkspaceCardView,
  type AdvisoryWorkspaceView,
} from "./advisoryWorkspaceContract.ts";
import { RECOMMENDATION_OWNERSHIP_QUESTIONS } from "../governance/nexoraRule14RecommendationOwnershipContract.ts";
import {
  ADVISORY_EMPTY_DETAIL,
  ADVISORY_EMPTY_HEADLINE,
  ADVISORY_LOADING_DETAIL,
  ADVISORY_LOADING_HEADLINE,
  type AdvisoryFieldSnapshot,
  type AdvisoryWorkspaceState,
} from "./advisoryWorkspaceStateContract.ts";

function resolveFieldTone(
  state: AdvisoryWorkspaceState,
  fallback: AdvisoryWorkspaceCardTone
): AdvisoryWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  return fallback;
}

function buildFieldCard(
  id: AdvisoryWorkspaceCardView["id"],
  label: string,
  field: AdvisoryFieldSnapshot,
  state: AdvisoryWorkspaceState,
  tone: AdvisoryWorkspaceCardTone
): AdvisoryWorkspaceCardView {
  return Object.freeze({
    id,
    label,
    headline:
      state.phase === "loading"
        ? ADVISORY_LOADING_HEADLINE
        : state.phase === "empty"
          ? ADVISORY_EMPTY_HEADLINE
          : field.headline,
    detail:
      state.phase === "loading"
        ? ADVISORY_LOADING_DETAIL
        : state.phase === "empty"
          ? ADVISORY_EMPTY_DETAIL
          : field.detail,
    tone: resolveFieldTone(state, tone),
  });
}

export function buildAdvisoryWorkspaceViewFromState(
  state: AdvisoryWorkspaceState
): AdvisoryWorkspaceView {
  const cards: AdvisoryWorkspaceCardView[] = [
    buildFieldCard(
      "executive_recommendation",
      ADVISORY_WORKSPACE_SECTION_LABELS.executive_recommendation,
      state.executiveRecommendation,
      state,
      "accent"
    ),
    buildFieldCard(
      "recommendation_drivers",
      ADVISORY_WORKSPACE_SECTION_LABELS.recommendation_drivers,
      state.recommendationDrivers,
      state,
      "neutral"
    ),
    buildFieldCard(
      "confidence_summary",
      ADVISORY_WORKSPACE_SECTION_LABELS.confidence_summary,
      state.confidenceSummary,
      state,
      "success"
    ),
    buildFieldCard(
      "assumptions",
      ADVISORY_WORKSPACE_SECTION_LABELS.assumptions,
      state.assumptions,
      state,
      "warning"
    ),
    buildFieldCard(
      "alternative_recommendations",
      ADVISORY_WORKSPACE_SECTION_LABELS.alternative_recommendations,
      state.alternativeRecommendations,
      state,
      "muted"
    ),
  ];

  const orderedCards = ADVISORY_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "advisory",
    cards: Object.freeze(orderedCards),
    workspaceContext: state.workspaceContext,
    recommendation: state.recommendationSurface ?? DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
    explainability: state.explainabilitySurface ?? DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
    handoff: buildAdvisoryHandoffSurface({
      pendingRecommendationPackage: state.pendingRecommendationPackage,
    }),
    scanPurpose: `${RECOMMENDATION_OWNERSHIP_QUESTIONS.advisory} ${ADVISORY_RECOMMENDATION_PURPOSE} ${ADVISORY_EXPLAINABILITY_PURPOSE} Advisory recommends — Governance approves — War Room commits.`,
    phase: state.phase,
    revision: state.revision,
    source: "advisory_workspace_runtime_state",
    ownsRecommendationsOnly: true,
  });
}
