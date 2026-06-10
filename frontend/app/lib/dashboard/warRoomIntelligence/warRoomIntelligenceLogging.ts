/**
 * Phase 4:6 — War Room Intelligence logging.
 */

import type {
  CriticalRisksCard,
  DecisionFocusCard,
  ScenarioComparisonCard,
  SituationOverviewCard,
  TimelinePressureCard,
  WarRoomIntelligenceSurfaceModel,
  WarRoomTradeoffAnalysisCard,
} from "./warRoomIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportWarRoomIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `war_room:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][WarRoomIntelligence]", detail);
}

export function reportSituationOverview(overview: SituationOverviewCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `situation:${overview.currentState}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][SituationOverview]", overview);
}

export function reportCriticalRisk(risks: CriticalRisksCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `critical:${risks.exposure}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][CriticalRisk]", risks);
}

export function reportTimelinePressure(pressure: TimelinePressureCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `pressure:${pressure.decisionWindow}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TimelinePressure]", pressure);
}

export function reportScenarioComparison(comparison: ScenarioComparisonCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `comparison:${comparison.scenarios.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScenarioComparison]", comparison);
}

export function reportWarRoomTradeoffAnalysis(tradeoffs: WarRoomTradeoffAnalysisCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tradeoff:${tradeoffs.tradeoffs.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TradeoffAnalysis]", tradeoffs);
}

export function reportDecisionFocus(focus: DecisionFocusCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `focus:${focus.focus}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][DecisionFocus]", focus);
}

export function reportWarRoomIntelligenceSurface(model: WarRoomIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][WarRoomIntelligence]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    decisionFocus: model.snapshot.decisionFocus.focus,
    riskExposure: model.snapshot.criticalRisks.exposure,
  });
}

export function resetWarRoomIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
