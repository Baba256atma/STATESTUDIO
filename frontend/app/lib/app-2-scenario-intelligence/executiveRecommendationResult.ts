/**
 * APP-2:9 — Executive Recommendation result types.
 * Canonical immutable recommendation portfolio — no UI or execution artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ExecutiveRecommendationConfidenceLevel,
  ExecutiveRecommendationEvidenceSource,
  ExecutiveRecommendationFocus,
  ExecutiveRecommendationIntent,
} from "./executiveRecommendationPortfolio.ts";
import { EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION } from "./executiveRecommendationPortfolio.ts";
import type { ExecutiveRecommendationDiagnostic } from "./executiveRecommendationDiagnostics.ts";

export type ExecutiveRecommendationEvidence = Readonly<{
  evidenceId: string;
  source: ExecutiveRecommendationEvidenceSource;
  sourceRef: string;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationOption = Readonly<{
  recommendationId: string;
  title: string;
  summary: string;
  executiveIntent: ExecutiveRecommendationIntent;
  expectedBenefits: readonly string[];
  possibleTradeoffs: readonly string[];
  supportingEvidence: readonly ExecutiveRecommendationEvidence[];
  supportingConflicts: readonly string[];
  supportingOpportunities: readonly string[];
  dependencyReferences: readonly string[];
  priorityReferences: readonly string[];
  confidenceLevel: ExecutiveRecommendationConfidenceLevel;
  confidenceExplanation: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationPortfolio = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  recommendations: readonly ExecutiveRecommendationOption[];
  recommendedOrder: readonly string[];
  recommendedFocus: ExecutiveRecommendationFocus;
  evidence: readonly ExecutiveRecommendationEvidence[];
  constraints: readonly ExecutiveRecommendationConstraint[];
  assumptions: readonly ExecutiveRecommendationAssumption[];
  diagnostics: readonly ExecutiveRecommendationDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION;
}>;

export function createExecutiveRecommendationPortfolio(
  input: Omit<ExecutiveRecommendationPortfolio, "readOnly" | "engineVersion">
): ExecutiveRecommendationPortfolio {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
  });
}

export function createExecutiveRecommendationOption(
  input: Omit<ExecutiveRecommendationOption, "readOnly">
): ExecutiveRecommendationOption {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveRecommendationEvidence(
  input: Omit<ExecutiveRecommendationEvidence, "readOnly">
): ExecutiveRecommendationEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveRecommendationConstraint(
  input: Omit<ExecutiveRecommendationConstraint, "readOnly">
): ExecutiveRecommendationConstraint {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveRecommendationAssumption(
  input: Omit<ExecutiveRecommendationAssumption, "readOnly">
): ExecutiveRecommendationAssumption {
  return Object.freeze({ ...input, readOnly: true as const });
}
