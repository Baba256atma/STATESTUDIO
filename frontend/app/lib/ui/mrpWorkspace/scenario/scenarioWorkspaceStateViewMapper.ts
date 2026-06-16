/**
 * MRP:4E:1 / 4E:2 / 4E:3 / 4E:4 / 4E:5 — Map ScenarioWorkspaceState to workspace card views.
 */

import {
  SCENARIO_WORKSPACE_SECTION_LABELS,
  SCENARIO_WORKSPACE_SECTION_ORDER,
  type ScenarioWorkspaceCardTone,
  type ScenarioWorkspaceCardView,
  type ScenarioWorkspaceView,
} from "./scenarioWorkspaceContract.ts";
import {
  DEFAULT_SCENARIO_COMPARISON_SURFACE,
  SCENARIO_COMPARISON_CONTEXT,
} from "./scenarioComparisonContract.ts";
import {
  SCENARIO_HANDOFF_QUESTION,
} from "./scenarioHandoffContract.ts";
import { buildScenarioHandoffSurface } from "./scenarioHandoffRuntime.ts";
import {
  DEFAULT_SCENARIO_PROJECTION_SURFACE,
  SCENARIO_PROJECTION_CONTEXT,
  SCENARIO_PROJECTION_QUESTION,
} from "./scenarioProjectionContract.ts";
import {
  DEFAULT_SCENARIO_GENERATION_SURFACE,
  SCENARIO_DECISION_QUESTION,
} from "./scenarioGenerationContract.ts";
import {
  SCENARIO_EMPTY_DETAIL,
  SCENARIO_EMPTY_HEADLINE,
  SCENARIO_LOADING_DETAIL,
  SCENARIO_LOADING_HEADLINE,
  type ScenarioFieldSnapshot,
  type ScenarioWorkspaceState,
} from "./scenarioWorkspaceStateContract.ts";

function resolveFieldTone(
  state: ScenarioWorkspaceState,
  fallback: ScenarioWorkspaceCardTone
): ScenarioWorkspaceCardTone {
  if (state.phase === "loading") return "neutral";
  if (state.phase === "empty") return "muted";
  return fallback;
}

function buildFieldCard(
  id: ScenarioWorkspaceCardView["id"],
  label: string,
  field: ScenarioFieldSnapshot,
  state: ScenarioWorkspaceState,
  tone: ScenarioWorkspaceCardTone
): ScenarioWorkspaceCardView {
  return Object.freeze({
    id,
    label,
    headline:
      state.phase === "loading"
        ? SCENARIO_LOADING_HEADLINE
        : state.phase === "empty"
          ? SCENARIO_EMPTY_HEADLINE
          : field.headline,
    detail:
      state.phase === "loading"
        ? SCENARIO_LOADING_DETAIL
        : state.phase === "empty"
          ? SCENARIO_EMPTY_DETAIL
          : field.detail,
    tone: resolveFieldTone(state, tone),
  });
}

export function buildScenarioWorkspaceViewFromState(
  state: ScenarioWorkspaceState
): ScenarioWorkspaceView {
  const cards: ScenarioWorkspaceCardView[] = [
    buildFieldCard(
      "scenario_summary",
      SCENARIO_WORKSPACE_SECTION_LABELS.scenario_summary,
      state.scenarioSummary,
      state,
      "accent"
    ),
    buildFieldCard(
      "scenario_list",
      SCENARIO_WORKSPACE_SECTION_LABELS.scenario_list,
      state.scenarioList,
      state,
      "neutral"
    ),
    buildFieldCard(
      "scenario_comparison",
      SCENARIO_WORKSPACE_SECTION_LABELS.scenario_comparison,
      state.scenarioComparison,
      state,
      "warning"
    ),
    buildFieldCard(
      "future_projection",
      SCENARIO_WORKSPACE_SECTION_LABELS.future_projection,
      state.futureProjection,
      state,
      "accent"
    ),
  ];

  const orderedCards = SCENARIO_WORKSPACE_SECTION_ORDER.map(
    (id) => cards.find((card) => card.id === id)!
  );

  return Object.freeze({
    workspaceId: "scenario",
    cards: Object.freeze(orderedCards),
    workspaceContext: state.workspaceContext,
    generation:
      state.generatedScenarios.length > 0
        ? Object.freeze({
            question: SCENARIO_DECISION_QUESTION,
            scenarios: state.generatedScenarios,
            readOnly: true as const,
          })
        : DEFAULT_SCENARIO_GENERATION_SURFACE,
    comparison:
      state.comparisonMatrix.columns.length > 0
        ? Object.freeze({
            matrix: state.comparisonMatrix,
            dashboardContext: SCENARIO_COMPARISON_CONTEXT,
            readOnly: true as const,
          })
        : DEFAULT_SCENARIO_COMPARISON_SURFACE,
    projection:
      state.projectionLayer.trends.length > 0
        ? Object.freeze({
            layer: state.projectionLayer,
            question: SCENARIO_PROJECTION_QUESTION,
            dashboardContext: SCENARIO_PROJECTION_CONTEXT,
            readOnly: true as const,
          })
        : DEFAULT_SCENARIO_PROJECTION_SURFACE,
    handoff:
      state.handoffReady && state.pendingCommitPackage
        ? buildScenarioHandoffSurface({
            activeScenarioId: state.activeScenarioId,
            selectedScenarioId: state.selectedScenarioId,
            pendingCommitPackage: state.pendingCommitPackage,
          })
        : buildScenarioHandoffSurface({
            activeScenarioId: state.activeScenarioId,
            selectedScenarioId: state.selectedScenarioId,
            pendingCommitPackage: null,
          }),
    scanPurpose:
      state.handoffReady && state.pendingCommitPackage
        ? `${SCENARIO_HANDOFF_QUESTION} ${state.pendingCommitPackage.title} prepared for War Room — no execution from Scenario workspace.`
        : state.projectionLayer.trends.length > 0
        ? `${SCENARIO_PROJECTION_QUESTION} Forecast Expected, Best Case, and Worst Case trends — no action execution.`
        : state.comparisonMatrix.columns.length > 0
          ? `${SCENARIO_DECISION_QUESTION} Compare Scenario A, B, and C across executive impact dimensions — no action execution.`
          : state.generatedScenarios.length > 0
            ? `${SCENARIO_DECISION_QUESTION} Compare generated Best, Expected, and Worst futures within 5–10 seconds — no action execution.`
            : "Explore possible futures and compare scenarios within 5–10 seconds — no action execution.",
    phase: state.phase,
    revision: state.revision,
    source: "scenario_workspace_runtime_state",
    exploresFuturesOnly: true,
  });
}
