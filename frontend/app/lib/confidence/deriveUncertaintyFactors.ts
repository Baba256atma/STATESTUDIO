import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type { DomainScenarioComparison } from "../domain/domainScenarioComparison.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

function unique(values: unknown[], limit = 4): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
    if (result.length >= limit) break;
  }
  return result;
}

function isScenarioComparison(value: ScenarioComparison | DomainScenarioComparison): value is ScenarioComparison {
  return "confidenceDelta" in value;
}

export function deriveUncertaintyFactors(params: {
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  scenarioComparisons?: Array<ScenarioComparison | DomainScenarioComparison>;
}): string[] {
  const timeline = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence : [];
  const memory = Array.isArray(params.strategicMemory) ? params.strategicMemory : [];
  const monitoring = Array.isArray(params.monitoringSignals) ? params.monitoringSignals : [];
  const comparisons = Array.isArray(params.scenarioComparisons) ? params.scenarioComparisons : [];

  const factors: string[] = [];
  if (timeline.some((item) => item.trend === "volatile")) {
    factors.push("Timeline behavior remains volatile.");
  }
  if (timeline.some((item) => item.trend === "degrading" && item.confidence < 0.65)) {
    factors.push("Degrading timeline signals have limited confidence.");
  }
  if (monitoring.some((signal) => signal.monitoringStatus === "critical" && signal.trend === "volatile")) {
    factors.push("Critical monitoring signals are moving unevenly.");
  }
  if (memory.some((record) => (record.recurrenceCount ?? 1) < 2 && (record.confidence ?? 0) < 0.55)) {
    factors.push("Strategic memory evidence is still emerging.");
  }
  if (comparisons.some((comparison) => isScenarioComparison(comparison) && Math.abs(comparison.confidenceDelta) < 6)) {
    factors.push("Scenario comparison results remain close.");
  }
  if (comparisons.some((comparison) => !isScenarioComparison(comparison) && !comparison.recommendation)) {
    factors.push("Domain scenario comparison remains inconclusive.");
  }
  if (!timeline.length && !memory.length && !monitoring.length && !comparisons.length) {
    factors.push("Evidence coverage is limited.");
  }
  return unique(factors);
}
