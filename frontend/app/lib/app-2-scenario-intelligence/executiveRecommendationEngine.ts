/**
 * APP-2:9 — Executive Recommendation Engine.
 * Canonical explainable recommendation portfolio for executive decision support.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import { EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION } from "./executiveRecommendationPortfolio.ts";
import type { ExecutiveRecommendationResolveRequest } from "./executiveRecommendationResolver.ts";
import {
  resolveExecutiveRecommendationPortfolio,
  resolveExecutiveRecommendationPortfolioProbeExample,
  validateExecutiveRecommendationInputs,
} from "./executiveRecommendationResolver.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";

export {
  resolveExecutiveRecommendationPortfolio,
  resolveExecutiveRecommendationPortfolioProbeExample,
  validateExecutiveRecommendationInputs,
};
export type { ExecutiveRecommendationPortfolio, ExecutiveRecommendationResolveRequest };

export const EXECUTIVE_RECOMMENDATION_ENGINE_OWNER =
  "app-2-executive-recommendation-engine" as const;

export const EXECUTIVE_RECOMMENDATION_ENGINE_TAGS = Object.freeze([
  "[APP2_9_EXECUTIVE_RECOMMENDATION_ENGINE]",
  "[EXECUTIVE_RECOMMENDATION_PORTFOLIO_READY]",
  "[EXECUTIVE_RECOMMENDATION_READ_ONLY]",
  "[NO_EXECUTION]",
  "[PORTFOLIO_BASED]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_EXECUTIVE_SNAPSHOT]",
  "[CONSUMES_EXECUTIVE_SUMMARY]",
] as const);

export const EXECUTIVE_RECOMMENDATION_ENGINE_RULES = Object.freeze({
  deterministic: true,
  repeatable: true,
  stateless: true,
  threadSafe: true,
  pure: true,
  serializable: true,
  readOnly: true,
  noSideEffects: true,
  noGlobalCache: true,
  workspaceIsolated: true,
  consumesSnapshot: true,
  consumesSummary: true,
  rebuildsSnapshot: false,
  rebuildsSummary: false,
  rebuildsContext: false,
  rebuildsPriority: false,
  rebuildsDependencies: false,
  rebuildsConflicts: false,
  rebuildsOpportunities: false,
  portfolioBased: true,
  executesDecisions: false,
  noLlm: true,
  noMl: true,
} as const);

export function buildExecutiveRecommendationPortfolioFromInputs(
  request: ExecutiveRecommendationResolveRequest
): ExecutiveRecommendationPortfolio {
  return resolveExecutiveRecommendationPortfolio(request);
}

export function getExecutiveRecommendationEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION;
  snapshotVersion: typeof EXECUTIVE_SCENARIO_SNAPSHOT_VERSION;
  summaryVersion: typeof EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_RECOMMENDATION_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
    snapshotVersion: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
    summaryVersion: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    owner: EXECUTIVE_RECOMMENDATION_ENGINE_OWNER,
  });
}

export const ExecutiveRecommendationEngine = Object.freeze({
  buildExecutiveRecommendationPortfolioFromInputs,
  resolveExecutiveRecommendationPortfolio,
  resolveExecutiveRecommendationPortfolioProbeExample,
  validateExecutiveRecommendationInputs,
  getExecutiveRecommendationEngineVersionMetadata,
  version: EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
  rules: EXECUTIVE_RECOMMENDATION_ENGINE_RULES,
});
