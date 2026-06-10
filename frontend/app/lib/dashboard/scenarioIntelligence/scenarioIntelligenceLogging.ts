/**
 * Phase 4:5 — Scenario Intelligence logging.
 */

import type {
  ExpectedImpactCard,
  InvestigationPathsCard,
  ScenarioConfidenceCard,
  ScenarioIntelligenceSurfaceModel,
  ScenarioPortfolioCard,
  TradeoffAnalysisCard,
} from "./scenarioIntelligenceContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportScenarioIntelligence(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `scenario:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScenarioIntelligence]", detail);
}

export function reportScenarioPortfolio(portfolio: ScenarioPortfolioCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `portfolio:${portfolio.activeCount}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScenarioPortfolio]", portfolio);
}

export function reportScenarioConfidence(confidence: ScenarioConfidenceCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `confidence:${confidence.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScenarioConfidence]", confidence);
}

export function reportExpectedImpact(impact: ExpectedImpactCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `impact:${impact.level}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ExpectedImpact]", impact);
}

export function reportTradeoffAnalysis(tradeoffs: TradeoffAnalysisCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `tradeoff:${tradeoffs.tradeoffs.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][TradeoffAnalysis]", tradeoffs);
}

export function reportInvestigationPath(paths: InvestigationPathsCard): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `investigation:${paths.paths.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][InvestigationPath]", paths);
}

export function reportScenarioIntelligenceSurface(model: ScenarioIntelligenceSurfaceModel): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `surface:${model.headline}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ScenarioIntelligence]", {
    surfaceId: model.surfaceId,
    owner: model.owner,
    confidence: model.snapshot.confidence.level,
    impact: model.snapshot.expectedImpact.level,
    activeScenarios: model.snapshot.portfolio.activeCount,
  });
}

export function resetScenarioIntelligenceLoggingForTests(): void {
  loggedKeys.clear();
}
