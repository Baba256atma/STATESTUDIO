import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { OrganizationalResilienceSignal } from "../resilience/organizationalResilienceTypes.ts";
import type { AdaptationBottleneck } from "./enterpriseAdaptationTypes.ts";

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

function severityFor(score: number): AdaptationBottleneck["severity"] {
  if (score >= 0.82) return "critical";
  if (score >= 0.62) return "high";
  if (score >= 0.38) return "medium";
  return "low";
}

function addBottleneck(map: Map<string, AdaptationBottleneck>, bottleneck: AdaptationBottleneck): void {
  const current = map.get(bottleneck.id);
  const order = { low: 0, medium: 1, high: 2, critical: 3 };
  if (!current || order[bottleneck.severity] > order[current.severity]) map.set(bottleneck.id, bottleneck);
}

export function detectAdaptationBottlenecks(params: {
  relatedObjectIds: string[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  driftSignals?: StrategicDriftSignal[];
  resilienceSignals?: OrganizationalResilienceSignal[];
}): AdaptationBottleneck[] {
  const related = new Set(params.relatedObjectIds);
  const bottlenecks = new Map<string, AdaptationBottleneck>();

  for (const zone of params.fragilityZones ?? []) {
    if (!overlaps(related, zone.relatedObjectIds)) continue;
    const rigidity = Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0);
    if (rigidity < 0.48) continue;
    addBottleneck(bottlenecks, {
      id: `adaptation_bottleneck_dependency_${normalizeIdPart(zone.id)}`,
      label: "Rigid dependency concentration",
      relatedObjectIds: zone.relatedObjectIds,
      relatedZoneIds: [zone.id],
      severity: severityFor(rigidity),
      rationale: "Dependency pressure is constraining operational flexibility.",
    });
  }

  for (const insight of params.coordinationInsights ?? []) {
    if (!overlaps(related, insight.relatedObjectIds)) continue;
    const friction = Math.max(insight.coordinationComplexity ?? 0, insight.synchronizationRisk ?? 0);
    if (friction < 0.5) continue;
    addBottleneck(bottlenecks, {
      id: `adaptation_bottleneck_coordination_${normalizeIdPart(insight.id)}`,
      label: "Coordination adaptation friction",
      relatedObjectIds: insight.relatedObjectIds,
      severity: severityFor(friction),
      rationale: "Coordination pressure is slowing enterprise adjustment.",
    });
  }

  for (const signal of params.monitoringSignals ?? []) {
    if (!overlaps(related, signal.relatedObjectIds)) continue;
    if (signal.monitoringStatus !== "critical" && signal.trend !== "volatile" && signal.trend !== "degrading") continue;
    addBottleneck(bottlenecks, {
      id: `adaptation_bottleneck_monitoring_${normalizeIdPart(signal.id)}`,
      label: "Monitoring responsiveness gap",
      relatedObjectIds: signal.relatedObjectIds,
      severity: signal.monitoringStatus === "critical" ? "high" : "medium",
      rationale: "Limited visibility is constraining adaptive response timing.",
    });
  }

  for (const drift of params.driftSignals ?? []) {
    if (!overlaps(related, drift.relatedObjectIds) || drift.driftIntensity < 0.45) continue;
    addBottleneck(bottlenecks, {
      id: `adaptation_bottleneck_drift_${normalizeIdPart(drift.id)}`,
      label: "Adaptation drift resistance",
      relatedObjectIds: drift.relatedObjectIds,
      relatedZoneIds: drift.relatedZoneIds,
      severity: severityFor(drift.driftIntensity),
      rationale: "Strategic drift indicates adaptation is not holding against operational pressure.",
    });
  }

  for (const resilience of params.resilienceSignals ?? []) {
    if (!overlaps(related, resilience.relatedObjectIds)) continue;
    if (resilience.resilienceState !== "fragile" && resilience.resilienceState !== "recovering") continue;
    addBottleneck(bottlenecks, {
      id: `adaptation_bottleneck_resilience_${normalizeIdPart(resilience.id)}`,
      label: "Limited adaptive resilience",
      relatedObjectIds: resilience.relatedObjectIds,
      relatedZoneIds: resilience.relatedZoneIds,
      severity: resilience.resilienceState === "fragile" ? "high" : "medium",
      rationale: "Recovery capacity is not yet strong enough to support enterprise adaptation.",
    });
  }

  return Array.from(bottlenecks.values()).sort((left, right) => {
    const order = { critical: 3, high: 2, medium: 1, low: 0 };
    if (order[right.severity] !== order[left.severity]) return order[right.severity] - order[left.severity];
    return left.id.localeCompare(right.id);
  });
}
