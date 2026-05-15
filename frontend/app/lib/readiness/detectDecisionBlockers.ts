import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { OrganizationalResilienceSignal } from "../resilience/organizationalResilienceTypes.ts";
import type { DecisionReadinessBlocker } from "./executiveDecisionReadinessTypes.ts";

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

function severityFor(score: number): DecisionReadinessBlocker["severity"] {
  if (score >= 0.8) return "critical";
  if (score >= 0.6) return "high";
  if (score >= 0.38) return "medium";
  return "low";
}

function addBlocker(map: Map<string, DecisionReadinessBlocker>, blocker: DecisionReadinessBlocker): void {
  const current = map.get(blocker.id);
  const order = { low: 0, medium: 1, high: 2, critical: 3 };
  if (!current || order[blocker.severity] > order[current.severity]) {
    map.set(blocker.id, blocker);
  }
}

export function detectDecisionBlockers(params: {
  relatedObjectIds: string[];
  confidenceSignals?: DecisionConfidence[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  driftSignals?: StrategicDriftSignal[];
  resilienceSignals?: OrganizationalResilienceSignal[];
}): DecisionReadinessBlocker[] {
  const related = new Set(params.relatedObjectIds);
  const blockers = new Map<string, DecisionReadinessBlocker>();

  for (const zone of params.fragilityZones ?? []) {
    if (!overlaps(related, zone.relatedObjectIds)) continue;
    const pressure = Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0);
    if (pressure < 0.42) continue;
    addBlocker(blockers, {
      id: `readiness_blocker_propagation_${normalizeIdPart(zone.id)}`,
      label: "Unresolved propagation corridor",
      severity: severityFor(pressure),
      relatedObjectIds: zone.relatedObjectIds,
      rationale: "Propagation exposure remains too active for confident executive timing.",
    });
  }

  for (const insight of params.coordinationInsights ?? []) {
    if (!overlaps(related, insight.relatedObjectIds)) continue;
    const pressure = Math.max(insight.coordinationComplexity ?? 0, insight.synchronizationRisk ?? 0);
    if (pressure < 0.5) continue;
    addBlocker(blockers, {
      id: `readiness_blocker_coordination_${normalizeIdPart(insight.id)}`,
      label: "Coordination readiness gap",
      severity: severityFor(pressure),
      relatedObjectIds: insight.relatedObjectIds,
      rationale: "Execution alignment remains insufficiently stable for clean decision review.",
    });
  }

  for (const signal of params.driftSignals ?? []) {
    if (!overlaps(related, signal.relatedObjectIds) || signal.driftIntensity < 0.45) continue;
    addBlocker(blockers, {
      id: `readiness_blocker_drift_${normalizeIdPart(signal.id)}`,
      label: "Strategic drift still active",
      severity: severityFor(signal.driftIntensity),
      relatedObjectIds: signal.relatedObjectIds,
      rationale: "Operational conditions are still moving away from the stability baseline.",
    });
  }

  for (const forecast of params.forecasts ?? []) {
    if (!overlaps(related, forecast.relatedObjectIds)) continue;
    if (forecast.direction !== "volatile" && forecast.direction !== "uncertain" && forecast.direction !== "degrading") continue;
    const severity = forecast.direction === "volatile" ? "high" : forecast.direction === "degrading" ? "medium" : "medium";
    addBlocker(blockers, {
      id: `readiness_blocker_forecast_${normalizeIdPart(forecast.id)}`,
      label: "Unsettled stability outlook",
      severity,
      relatedObjectIds: forecast.relatedObjectIds,
      rationale: "Near-term stability evidence remains unsettled.",
    });
  }

  for (const confidence of params.confidenceSignals ?? []) {
    if (confidence.confidenceScore >= 0.5 && (confidence.uncertaintyFactors ?? []).length < 2) continue;
    addBlocker(blockers, {
      id: `readiness_blocker_confidence_${normalizeIdPart(confidence.id)}`,
      label: "Evidence confidence gap",
      severity: confidence.confidenceScore < 0.35 ? "high" : "medium",
      relatedObjectIds: params.relatedObjectIds,
      rationale: "Decision evidence has not converged enough for strong executive timing.",
    });
  }

  for (const resilience of params.resilienceSignals ?? []) {
    if (!overlaps(related, resilience.relatedObjectIds)) continue;
    if (resilience.resilienceState !== "fragile" && resilience.resilienceState !== "recovering") continue;
    addBlocker(blockers, {
      id: `readiness_blocker_resilience_${normalizeIdPart(resilience.id)}`,
      label: "Resilience still developing",
      severity: resilience.resilienceState === "fragile" ? "high" : "medium",
      relatedObjectIds: resilience.relatedObjectIds,
      rationale: "Recovery capacity is not yet durable enough to support confident action timing.",
    });
  }

  return Array.from(blockers.values()).sort((left, right) => {
    const order = { critical: 3, high: 2, medium: 1, low: 0 };
    if (order[right.severity] !== order[left.severity]) return order[right.severity] - order[left.severity];
    return left.id.localeCompare(right.id);
  });
}
