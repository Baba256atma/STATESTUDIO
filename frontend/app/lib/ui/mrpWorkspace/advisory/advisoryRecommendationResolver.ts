/**
 * MRP:5A:3 — Derive executive recommendation from consume-only workspace intelligence.
 */

import { getRiskWorkspaceState } from "../risk/riskWorkspaceStateRuntime.ts";
import { getScenarioWorkspaceState } from "../scenario/scenarioWorkspaceStateRuntime.ts";
import { getTimelineWorkspaceState } from "../timeline/timelineWorkspaceStateRuntime.ts";
import { getWarRoomState } from "../warRoom/warRoomStateRuntime.ts";
import { getWarRoomWorkspaceState } from "../warRoom/warRoomWorkspaceStateRuntime.ts";
import type { AdvisoryConfidenceLevel } from "./advisoryStateContract.ts";
import {
  ADVISORY_RECOMMENDATION_SOURCE_ORDER,
  DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
  DEFAULT_EXECUTIVE_RECOMMENDATION_CARD,
  MRP_ADVISORY_RECOMMENDATION_TAG,
  type AdvisoryRecommendationLayer,
  type AdvisoryRecommendationSourceId,
  type AdvisoryRecommendationSurface,
  type ExecutiveRecommendationCard,
} from "./advisoryRecommendationContract.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_INTAKE,
  type AdvisoryRecommendationIntake,
  type AdvisoryRiskIntakeSnapshot,
  type AdvisoryScenarioIntakeSnapshot,
  type AdvisoryTimelineIntakeSnapshot,
  type AdvisoryWarRoomIntakeSnapshot,
} from "./advisoryRecommendationIntakeContract.ts";
import type { AdvisoryFieldSnapshot } from "./advisoryWorkspaceStateContract.ts";
import type { AdvisoryWorkspaceContext } from "./advisoryWorkspaceContextContract.ts";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function resolveConfidenceLabel(level: AdvisoryConfidenceLevel): string {
  switch (level) {
    case "very_high":
      return "Very High";
    case "high":
      return "High";
    case "moderate":
      return "Moderate";
    case "low":
      return "Low";
    default:
      return "Unknown";
  }
}

function mapConfidenceScore(score: number): AdvisoryConfidenceLevel {
  if (score >= 80) return "very_high";
  if (score >= 65) return "high";
  if (score >= 45) return "moderate";
  if (score >= 25) return "low";
  return "unknown";
}

export function resolveAdvisoryRiskIntakeSnapshot(): AdvisoryRiskIntakeSnapshot {
  const riskState = getRiskWorkspaceState();
  if (riskState.phase !== "ready") {
    return DEFAULT_ADVISORY_RECOMMENDATION_INTAKE.risk;
  }

  return Object.freeze({
    available: riskState.riskCount > 0 || riskState.criticalRiskCount > 0,
    selectedObjectId: riskState.selectedObjectId,
    riskCount: riskState.riskCount,
    elevatedRiskCount: riskState.elevatedRiskCount,
    criticalRiskCount: riskState.criticalRiskCount,
    dominantRiskCategory: riskState.dominantRiskCategory,
  });
}

export function resolveAdvisoryTimelineIntakeSnapshot(): AdvisoryTimelineIntakeSnapshot {
  const timelineState = getTimelineWorkspaceState();
  if (timelineState.phase !== "ready") {
    return DEFAULT_ADVISORY_RECOMMENDATION_INTAKE.timeline;
  }

  return Object.freeze({
    available: timelineState.totalEvents > 0,
    selectedObjectId: timelineState.selectedObjectId,
    totalEvents: timelineState.totalEvents,
    recentEventCount: timelineState.recentEventCount,
    decisionEventCount: timelineState.decisionEventCount,
    riskEventCount: timelineState.riskEventCount,
  });
}

export function resolveAdvisoryScenarioIntakeSnapshot(): AdvisoryScenarioIntakeSnapshot {
  const scenarioState = getScenarioWorkspaceState();
  if (scenarioState.phase !== "ready") {
    return DEFAULT_ADVISORY_RECOMMENDATION_INTAKE.scenario;
  }

  const expected = scenarioState.generatedScenarios.find(
    (scenario) => scenario.id === "expected_case"
  );
  const worst = scenarioState.generatedScenarios.find((scenario) => scenario.id === "worst_case");

  return Object.freeze({
    available: scenarioState.generatedScenarios.length > 0,
    selectedObjectId: scenarioState.workspaceContext.selectedObjectId,
    scenarioCount: scenarioState.generatedScenarios.length,
    activeScenarioId: scenarioState.activeScenarioId,
    expectedProbability: expected?.probability ?? null,
    worstCaseImpact: worst?.impact ?? null,
  });
}

export function resolveAdvisoryWarRoomIntakeSnapshot(): AdvisoryWarRoomIntakeSnapshot {
  const warRoomState = getWarRoomState();
  const warRoomWorkspace = getWarRoomWorkspaceState();

  if (warRoomWorkspace.phase !== "ready" && warRoomState.status === "draft") {
    return DEFAULT_ADVISORY_RECOMMENDATION_INTAKE.warRoom;
  }

  return Object.freeze({
    available:
      warRoomState.activeDecisionId !== null ||
      warRoomState.selectedStrategy !== null ||
      warRoomWorkspace.workspaceContext.hasSelection,
    selectedObjectId: warRoomWorkspace.workspaceContext.selectedObjectId,
    activeDecisionId: warRoomState.activeDecisionId,
    selectedStrategy:
      warRoomState.selectedStrategy ?? warRoomWorkspace.workspaceContext.strategyFocus,
    status: warRoomState.status,
  });
}

export function buildAdvisoryRecommendationIntake(): AdvisoryRecommendationIntake {
  return Object.freeze({
    risk: resolveAdvisoryRiskIntakeSnapshot(),
    timeline: resolveAdvisoryTimelineIntakeSnapshot(),
    scenario: resolveAdvisoryScenarioIntakeSnapshot(),
    warRoom: resolveAdvisoryWarRoomIntakeSnapshot(),
  });
}

export function buildAdvisoryRecommendationIntakeSignature(
  intake: AdvisoryRecommendationIntake
): string {
  return JSON.stringify(intake);
}

function resolveActiveSources(intake: AdvisoryRecommendationIntake): AdvisoryRecommendationSourceId[] {
  const sources: AdvisoryRecommendationSourceId[] = [];
  if (intake.risk.available) sources.push("risk");
  if (intake.timeline.available) sources.push("timeline");
  if (intake.scenario.available) sources.push("scenario");
  if (intake.warRoom.available) sources.push("war_room");
  return sources;
}

export function computeAdvisoryConfidenceMetrics(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
}): Readonly<{
  riskPressure: number;
  activitySignal: number;
  dataPoints: number;
  confidenceScore: number;
  confidence: AdvisoryConfidenceLevel;
}> {
  const { intake } = input;
  const riskPressure =
    intake.risk.criticalRiskCount * 3 +
    intake.risk.elevatedRiskCount * 2 +
    intake.timeline.riskEventCount;
  const activitySignal = intake.timeline.recentEventCount + intake.timeline.decisionEventCount;
  const dataPoints =
    intake.risk.riskCount + intake.timeline.totalEvents + intake.scenario.scenarioCount;
  const confidenceScore = clamp(
    30 + dataPoints * 4 + (intake.scenario.available ? 10 : 0) - riskPressure * 2,
    20,
    92
  );
  const confidence = mapConfidenceScore(confidenceScore);

  return Object.freeze({
    riskPressure,
    activitySignal,
    dataPoints,
    confidenceScore,
    confidence,
  });
}

export function deriveExecutiveRecommendationCard(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
}): ExecutiveRecommendationCard {
  const { intake, workspaceContext } = input;

  if (!workspaceContext.hasSelection) {
    return DEFAULT_EXECUTIVE_RECOMMENDATION_CARD;
  }

  const objectLabel = workspaceContext.selectedObject;
  const focus =
    intake.warRoom.selectedStrategy?.trim() ||
    workspaceContext.recommendationFocus.trim() ||
    "Stabilize operational posture";

  const { activitySignal, confidence } = computeAdvisoryConfidenceMetrics(input);

  const recommendation = `Recommend ${focus.toLowerCase()} for ${objectLabel}.`;
  const whyParts = [
    intake.risk.available
      ? `${intake.risk.riskCount} risk signal${intake.risk.riskCount === 1 ? "" : "s"} (${intake.risk.dominantRiskCategory})`
      : null,
    intake.timeline.available
      ? `${intake.timeline.recentEventCount} recent timeline event${intake.timeline.recentEventCount === 1 ? "" : "s"}`
      : null,
    intake.scenario.available
      ? `scenario outlook ${intake.scenario.expectedProbability ?? "pending"}`
      : null,
    intake.warRoom.available && intake.warRoom.status
      ? `War Room status ${intake.warRoom.status} (consume-only)`
      : null,
  ].filter(Boolean);

  const why =
    whyParts.length > 0
      ? `Grounded in ${whyParts.join(", ")}. Advisory consumes certified intelligence — does not execute.`
      : "Grounded in advisory object context — awaiting certified workspace intelligence.";

  const expectedBenefit =
    intake.scenario.available && intake.scenario.expectedProbability
      ? `Expected case projects ${intake.scenario.expectedProbability} favorable trajectory with ${activitySignal} supporting activity signals.`
      : `Operational stabilization and improved decision clarity for ${objectLabel}.`;

  const expectedRisk =
    intake.scenario.available && intake.scenario.worstCaseImpact
      ? `Worst-case scenario impact ${intake.scenario.worstCaseImpact}; ${intake.risk.criticalRiskCount} critical risk${intake.risk.criticalRiskCount === 1 ? "" : "s"} monitored.`
      : intake.risk.available
        ? `${intake.risk.elevatedRiskCount} elevated and ${intake.risk.criticalRiskCount} critical risks remain under ${intake.risk.dominantRiskCategory}.`
        : "Residual risk requires continued monitoring before commitment.";

  return Object.freeze({
    recommendation,
    why,
    expectedBenefit,
    expectedRisk,
    confidence,
  });
}

export function deriveAdvisoryRecommendationLayer(input: {
  intake: AdvisoryRecommendationIntake;
  workspaceContext: AdvisoryWorkspaceContext;
}): AdvisoryRecommendationLayer {
  const sources = Object.freeze(resolveActiveSources(input.intake));
  const card = deriveExecutiveRecommendationCard(input);

  if (!input.workspaceContext.hasSelection) {
    return DEFAULT_ADVISORY_RECOMMENDATION_LAYER;
  }

  return Object.freeze({
    card,
    sources,
    consumesIntelligenceOnly: true,
    createsRecommendation: true,
    executesActions: false,
  });
}

export function buildAdvisoryRecommendationSignature(
  layer: AdvisoryRecommendationLayer
): string {
  return JSON.stringify({
    card: layer.card,
    sources: layer.sources,
    consumesIntelligenceOnly: layer.consumesIntelligenceOnly,
    createsRecommendation: layer.createsRecommendation,
    executesActions: layer.executesActions,
  });
}

export function buildAdvisoryRecommendationSurface(
  layer: AdvisoryRecommendationLayer
): AdvisoryRecommendationSurface {
  return Object.freeze({
    purpose: "What do I recommend?",
    card: layer.card,
    sources: [...layer.sources],
    consumesIntelligenceOnly: true,
    createsRecommendation: true,
    executesActions: false,
  });
}

export function buildExecutiveRecommendationCardSnapshot(
  layer: AdvisoryRecommendationLayer
): AdvisoryFieldSnapshot {
  return Object.freeze({
    headline: layer.card.recommendation,
    detail: `${MRP_ADVISORY_RECOMMENDATION_TAG} ${layer.card.why}`,
  });
}

export function listAdvisoryRecommendationSourceLabels(
  sources: readonly AdvisoryRecommendationSourceId[]
): string {
  return ADVISORY_RECOMMENDATION_SOURCE_ORDER.filter((source) => sources.includes(source))
    .map((source) => source.replace("_", " "))
    .join(" · ");
}

export function buildAssumptionsSnapshot(layer: AdvisoryRecommendationLayer): AdvisoryFieldSnapshot {
  return Object.freeze({
    headline: layer.sources.includes("scenario") ? "Scenario-linked assumptions" : "General assumptions",
    detail: `${MRP_ADVISORY_RECOMMENDATION_TAG} Expected risk: ${layer.card.expectedRisk}`,
  });
}

export function buildAlternativeRecommendationsSnapshot(
  layer: AdvisoryRecommendationLayer
): AdvisoryFieldSnapshot {
  return Object.freeze({
    headline: "Alternative recommendations available",
    detail: `${MRP_ADVISORY_RECOMMENDATION_TAG} Advisory creates recommendation only — War Room owns commitment.`,
  });
}
