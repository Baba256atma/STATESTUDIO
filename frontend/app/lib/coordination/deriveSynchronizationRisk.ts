import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

export function deriveSynchronizationRisk(params: {
  relatedObjectIds: string[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const degradingMonitoring = (params.monitoringSignals ?? []).filter((item) =>
    item.relatedObjectIds.some((id) => related.has(id)) &&
      (item.trend === "degrading" || item.trend === "volatile" || item.monitoringStatus === "elevated" || item.monitoringStatus === "critical")
  ).length;
  const unresolvedZones = (params.fragilityZones ?? []).filter((zone) =>
    zone.relatedObjectIds.some((id) => related.has(id)) &&
      (zone.zoneType === "critical_corridor" || zone.zoneType === "systemic" || zone.zoneType === "amplifying")
  ).length;
  const interventionPressure = (params.interventions ?? []).filter((item) =>
    item.relatedObjectIds.some((id) => related.has(id)) &&
      (item.priority === "high" || item.priority === "critical")
  ).length;
  const forecastPressure = (params.forecasts ?? []).filter((item) =>
    item.relatedObjectIds.some((id) => related.has(id)) &&
      (item.direction === "degrading" || item.direction === "volatile")
  ).length;

  return clamp01(
    Math.min(1, degradingMonitoring / 2) * 0.28 +
      Math.min(1, unresolvedZones / 2) * 0.32 +
      Math.min(1, interventionPressure / 2) * 0.2 +
      Math.min(1, forecastPressure / 2) * 0.2
  );
}
