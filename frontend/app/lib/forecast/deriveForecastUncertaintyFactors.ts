import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

export function deriveForecastUncertaintyFactors(params: {
  timelineIntelligence?: TimelineIntelligence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
  confidenceSignals?: DecisionConfidence[];
  alerts?: ExecutiveAlert[];
}): string[] {
  const factors: string[] = [];
  if ((params.timelineIntelligence ?? []).some((item) => item.trend === "volatile")) {
    factors.push("Propagation patterns remain volatile.");
  }
  if ((params.monitoringSignals ?? []).length < 1) {
    factors.push("Monitoring history is still limited.");
  }
  if ((params.confidenceSignals ?? []).some((item) => item.confidenceLevel === "low" || item.confidenceLevel === "moderate")) {
    factors.push("Recommendation confidence remains limited by mixed evidence.");
  }
  if ((params.fragilityZones ?? []).some((zone) => zone.zoneType === "systemic" || zone.zoneType === "critical_corridor")) {
    factors.push("Systemic fragility zones remain active.");
  }
  if ((params.alerts ?? []).some((alert) => alert.level === "urgent" || alert.level === "critical")) {
    factors.push("Executive alert pressure remains elevated.");
  }
  return Array.from(new Set(factors)).slice(0, 4);
}
