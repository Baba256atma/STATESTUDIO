/**
 * MRP:4E:2 — Derive executive scenarios from read-only object, risk, and timeline inputs.
 */

import { getRiskWorkspaceState } from "../risk/riskWorkspaceStateRuntime.ts";
import { getTimelineWorkspaceState } from "../timeline/timelineWorkspaceStateRuntime.ts";
import {
  DEFAULT_SCENARIO_GENERATION_RISK,
  DEFAULT_SCENARIO_GENERATION_TIMELINE,
  GENERATED_SCENARIO_ORDER,
  GENERATED_SCENARIO_TITLES,
  type GeneratedScenario,
  type GeneratedScenarioId,
  type ScenarioGenerationDataInput,
  type ScenarioGenerationInput,
  type ScenarioGenerationRiskSnapshot,
  type ScenarioGenerationSelectedObject,
  type ScenarioGenerationTimelineSnapshot,
} from "./scenarioGenerationContract.ts";
import { SCENARIO_NO_OBJECT_SELECTED_LABEL } from "./scenarioWorkspaceContextContract.ts";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resolveSelectedObject(input: ScenarioGenerationDataInput): ScenarioGenerationSelectedObject {
  const selectedObjectId =
    input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
  const selectedObject =
    input.selectedObjectLabel?.trim() ||
    input.routeObjectName?.trim() ||
    input.workspaceContext?.selectedObject?.trim() ||
    SCENARIO_NO_OBJECT_SELECTED_LABEL;
  const normalized = selectedObject.toLowerCase();
  const hasSelection =
    Boolean(selectedObjectId) ||
    (normalized !== SCENARIO_NO_OBJECT_SELECTED_LABEL.toLowerCase() &&
      normalized !== "no object selected");

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    hasSelection,
  });
}

export function resolveScenarioGenerationRiskSnapshot(
  input?: ScenarioGenerationDataInput | null
): ScenarioGenerationRiskSnapshot {
  const riskState = getRiskWorkspaceState();
  const selectedObjectId =
    input?.selectedObjectId?.trim() ||
    input?.routeObjectId?.trim() ||
    riskState.selectedObjectId;

  if (
    riskState.phase === "ready" &&
    (riskState.riskCount > 0 ||
      riskState.elevatedRiskCount > 0 ||
      riskState.criticalRiskCount > 0 ||
      riskState.dominantRiskCategory !== "None")
  ) {
    return Object.freeze({
      selectedObjectId: riskState.selectedObjectId ?? selectedObjectId,
      riskCount: riskState.riskCount,
      elevatedRiskCount: riskState.elevatedRiskCount,
      criticalRiskCount: riskState.criticalRiskCount,
      dominantRiskCategory: riskState.dominantRiskCategory,
    });
  }

  return Object.freeze({
    ...DEFAULT_SCENARIO_GENERATION_RISK,
    selectedObjectId: selectedObjectId ?? null,
  });
}

export function resolveScenarioGenerationTimelineSnapshot(
  input?: ScenarioGenerationDataInput | null
): ScenarioGenerationTimelineSnapshot {
  const timelineState = getTimelineWorkspaceState();
  const selectedObjectId =
    input?.selectedObjectId?.trim() ||
    input?.routeObjectId?.trim() ||
    timelineState.selectedObjectId;

  if (timelineState.phase === "ready" && timelineState.totalEvents > 0) {
    return Object.freeze({
      selectedObjectId: timelineState.selectedObjectId ?? selectedObjectId,
      totalEvents: timelineState.totalEvents,
      recentEventCount: timelineState.recentEventCount,
      decisionEventCount: timelineState.decisionEventCount,
      riskEventCount: timelineState.riskEventCount,
    });
  }

  return Object.freeze({
    ...DEFAULT_SCENARIO_GENERATION_TIMELINE,
    selectedObjectId: selectedObjectId ?? null,
  });
}

export function buildScenarioGenerationInput(
  input: ScenarioGenerationDataInput
): ScenarioGenerationInput {
  return Object.freeze({
    selectedObject: resolveSelectedObject(input),
    risk: resolveScenarioGenerationRiskSnapshot(input),
    timeline: resolveScenarioGenerationTimelineSnapshot(input),
  });
}

export function buildScenarioGenerationSignature(input: ScenarioGenerationInput): string {
  return JSON.stringify({
    selectedObject: input.selectedObject,
    risk: input.risk,
    timeline: input.timeline,
  });
}

function resolveImpactLabel(
  level: "low" | "medium" | "high" | "critical"
): string {
  return capitalize(level);
}

function resolveConfidenceLabel(level: "low" | "medium" | "high"): string {
  return capitalize(level);
}

function buildScenarioMetrics(input: ScenarioGenerationInput, id: GeneratedScenarioId): GeneratedScenario {
  const { selectedObject, risk, timeline } = input;
  const riskPressure =
    risk.criticalRiskCount * 3 + risk.elevatedRiskCount * 2 + timeline.riskEventCount;
  const activitySignal = timeline.recentEventCount + timeline.decisionEventCount;
  const dataPoints = risk.riskCount + timeline.totalEvents;
  const confidenceBase = clamp(35 + dataPoints * 4, 25, 90);
  const confidencePenalty = selectedObject.hasSelection ? 0 : 15;

  switch (id) {
    case "best_case":
      return Object.freeze({
        id,
        title: GENERATED_SCENARIO_TITLES.best_case,
        probability: formatPercent(clamp(68 - riskPressure * 2 + activitySignal, 20, 85)),
        impact: resolveImpactLabel(riskPressure > 4 ? "medium" : "low"),
        confidence: resolveConfidenceLabel(
          confidenceBase - confidencePenalty >= 60 ? "high" : "medium"
        ),
      });
    case "expected_case":
      return Object.freeze({
        id,
        title: GENERATED_SCENARIO_TITLES.expected_case,
        probability: formatPercent(clamp(50 - riskPressure + activitySignal * 0.5, 25, 65)),
        impact: resolveImpactLabel(
          risk.criticalRiskCount > 0 ? "high" : riskPressure > 2 ? "medium" : "medium"
        ),
        confidence: resolveConfidenceLabel(
          confidenceBase - confidencePenalty >= 45 ? "medium" : "low"
        ),
      });
    case "worst_case":
      return Object.freeze({
        id,
        title: GENERATED_SCENARIO_TITLES.worst_case,
        probability: formatPercent(
          clamp(18 + riskPressure * 2 + risk.criticalRiskCount * 3, 8, 45)
        ),
        impact: resolveImpactLabel(
          risk.criticalRiskCount > 0 ? "critical" : riskPressure > 3 ? "high" : "medium"
        ),
        confidence: resolveConfidenceLabel(
          confidenceBase - confidencePenalty >= 55 ? "medium" : "low"
        ),
      });
    default:
      return Object.freeze({
        id: "expected_case",
        title: GENERATED_SCENARIO_TITLES.expected_case,
        probability: "50%",
        impact: "Medium",
        confidence: "Medium",
      });
  }
}

export function deriveExecutiveScenarios(
  input: ScenarioGenerationInput
): readonly GeneratedScenario[] {
  return Object.freeze(
    GENERATED_SCENARIO_ORDER.map((id) => buildScenarioMetrics(input, id))
  );
}
