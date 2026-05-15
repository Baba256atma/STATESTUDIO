import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionEvolutionChange } from "./decisionReviewTypes.ts";

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function topRecommendation(recommendations?: DecisionRecommendation[]): DecisionRecommendation | null {
  return (recommendations ?? [])[0] ?? null;
}

function averageConfidence(confidenceSignals?: DecisionConfidence[], recommendations?: DecisionRecommendation[]): number | null {
  const values = [
    ...(confidenceSignals ?? []).map((item) => item.confidenceScore),
    ...(recommendations ?? []).map((item) => item.confidence),
  ].filter((value) => typeof value === "number" && Number.isFinite(value));
  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

function monitoringState(signals?: ExecutiveMonitoringSignal[]): string {
  if ((signals ?? []).some((item) => item.monitoringStatus === "critical" || item.monitoringStatus === "elevated")) return "elevated";
  if ((signals ?? []).some((item) => item.monitoringStatus === "watch")) return "watch";
  if ((signals ?? []).length) return "stable";
  return "none";
}

function fragilityState(zones?: EnterpriseFragilityZone[]): string {
  const top = (zones ?? [])[0] ?? null;
  if (!top) return "none";
  if (top.zoneType === "critical_corridor" || top.zoneType === "systemic") return "elevated";
  if (top.zoneType === "isolated" || top.systemicReach === 0) return "reduced";
  return "active";
}

function interventionState(interventions?: StrategicIntervention[]): string {
  const top = (interventions ?? [])[0] ?? null;
  if (!top) return "none";
  if (top.priority === "critical" || top.priority === "high") return "stronger_intervention";
  return "monitoring_intervention";
}

export function trackDecisionEvolution(params: {
  previousRecommendations?: DecisionRecommendation[];
  currentRecommendations?: DecisionRecommendation[];
  previousConfidenceSignals?: DecisionConfidence[];
  currentConfidenceSignals?: DecisionConfidence[];
  previousMonitoringSignals?: ExecutiveMonitoringSignal[];
  currentMonitoringSignals?: ExecutiveMonitoringSignal[];
  previousFragilityZones?: EnterpriseFragilityZone[];
  currentFragilityZones?: EnterpriseFragilityZone[];
  previousInterventions?: StrategicIntervention[];
  currentInterventions?: StrategicIntervention[];
}): DecisionEvolutionChange[] {
  const changes: DecisionEvolutionChange[] = [];
  const previousRecommendation = topRecommendation(params.previousRecommendations);
  const currentRecommendation = topRecommendation(params.currentRecommendations);

  if (previousRecommendation && currentRecommendation && previousRecommendation.id !== currentRecommendation.id) {
    changes.push({
      id: `decision_evolution_recommendation_${normalizeIdPart(previousRecommendation.id)}_${normalizeIdPart(currentRecommendation.id)}`,
      type: "recommendation_changed",
      previousState: previousRecommendation.title,
      currentState: currentRecommendation.title,
      relatedRecommendationIds: unique([previousRecommendation.id, currentRecommendation.id]),
      relatedObjectIds: unique([...previousRecommendation.affectedObjectIds, ...currentRecommendation.affectedObjectIds]),
    });
  }

  const previousConfidence = averageConfidence(params.previousConfidenceSignals, params.previousRecommendations);
  const currentConfidence = averageConfidence(params.currentConfidenceSignals, params.currentRecommendations);
  if (previousConfidence !== null && currentConfidence !== null && Math.abs(currentConfidence - previousConfidence) >= 0.05) {
    changes.push({
      id: "decision_evolution_confidence",
      type: "confidence_changed",
      previousState: String(previousConfidence),
      currentState: String(currentConfidence),
      confidenceDrift: Math.round((currentConfidence - previousConfidence) * 100) / 100,
      relatedRecommendationIds: unique([previousRecommendation?.id, currentRecommendation?.id]),
      relatedObjectIds: unique([...(previousRecommendation?.affectedObjectIds ?? []), ...(currentRecommendation?.affectedObjectIds ?? [])]),
    });
  }

  const previousMonitoring = monitoringState(params.previousMonitoringSignals);
  const currentMonitoring = monitoringState(params.currentMonitoringSignals);
  if (previousMonitoring !== currentMonitoring) {
    changes.push({
      id: `decision_evolution_monitoring_${previousMonitoring}_${currentMonitoring}`,
      type: "monitoring_changed",
      previousState: previousMonitoring,
      currentState: currentMonitoring,
      relatedRecommendationIds: unique([currentRecommendation?.id, previousRecommendation?.id]),
      relatedObjectIds: unique([...(params.previousMonitoringSignals ?? []).flatMap((item) => item.relatedObjectIds), ...(params.currentMonitoringSignals ?? []).flatMap((item) => item.relatedObjectIds)]),
    });
  }

  const previousFragility = fragilityState(params.previousFragilityZones);
  const currentFragility = fragilityState(params.currentFragilityZones);
  if (previousFragility !== currentFragility) {
    changes.push({
      id: `decision_evolution_fragility_${previousFragility}_${currentFragility}`,
      type: "fragility_changed",
      previousState: previousFragility,
      currentState: currentFragility,
      relatedRecommendationIds: unique([currentRecommendation?.id, previousRecommendation?.id]),
      relatedObjectIds: unique([...(params.previousFragilityZones ?? []).flatMap((item) => item.relatedObjectIds), ...(params.currentFragilityZones ?? []).flatMap((item) => item.relatedObjectIds)]),
    });
  }

  const previousIntervention = interventionState(params.previousInterventions);
  const currentIntervention = interventionState(params.currentInterventions);
  if (previousIntervention !== currentIntervention && currentIntervention !== "none") {
    changes.push({
      id: `decision_evolution_intervention_${previousIntervention}_${currentIntervention}`,
      type: "intervention_changed",
      previousState: previousIntervention,
      currentState: currentIntervention,
      relatedRecommendationIds: unique([currentRecommendation?.id, previousRecommendation?.id]),
      relatedObjectIds: unique([...(params.currentInterventions ?? []).flatMap((item) => item.relatedObjectIds)]),
    });
  }

  return changes.sort((left, right) => left.id.localeCompare(right.id));
}
