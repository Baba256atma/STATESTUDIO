/**
 * Phase 5:4 — Advisory Explainability Layer contract.
 */

import type { AdvisoryContext } from "../aggregation/advisoryContextContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../confidence/advisoryConfidenceContract.ts";
import type { ExecutiveAdvisoryAggregationInput } from "../executiveAdvisoryContract.ts";

export const ADVISORY_EXPLAINABILITY_LAYER_VERSION = "5.4.0";

export const CANONICAL_ADVISORY_EXPLAINABILITY_OWNER = "advisoryExplainabilityRuntime";

export type ExplainabilityInputSource = "operational" | "risk" | "timeline" | "scenario" | "war_room";

export type ExplainabilityInputContract = Readonly<{
  advisoryContext: AdvisoryContext;
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
  dashboardContext: ExecutiveAdvisoryAggregationInput["dashboardContext"];
}>;

export type GuidanceExplanation = Readonly<{
  headline: string;
  executiveSummary: string;
  primaryFactors: readonly string[];
  whyThisGuidance: string;
}>;

export type SupportingEvidenceEntry = Readonly<{
  source: ExplainabilityInputSource;
  label: string;
  summary: string;
}>;

export type SupportingEvidenceLayer = Readonly<{
  operational: readonly SupportingEvidenceEntry[];
  risk: readonly SupportingEvidenceEntry[];
  timeline: readonly SupportingEvidenceEntry[];
  scenario: readonly SupportingEvidenceEntry[];
  warRoom: readonly SupportingEvidenceEntry[];
  summary: string;
}>;

export type ConfidenceDriverEntry = Readonly<{
  label: string;
  justification: string;
}>;

export type ConfidenceDriverLayer = Readonly<{
  drivers: readonly ConfidenceDriverEntry[];
  summary: string;
}>;

export type ConfidenceLimiterEntry = Readonly<{
  label: string;
  impact: string;
}>;

export type ConfidenceLimiterLayer = Readonly<{
  limiters: readonly ConfidenceLimiterEntry[];
  summary: string;
}>;

export type ReasoningPathStep = Readonly<{
  label: string;
  detail: string;
}>;

export type ReasoningPathRender = Readonly<{
  steps: readonly ReasoningPathStep[];
  pathLabel: string;
  summary: string;
}>;

export type AssumptionEntry = Readonly<{
  kind: "assumption" | "unknown" | "missing_context" | "unresolved_dependency";
  label: string;
  detail: string;
}>;

export type AssumptionsUnknownsLayer = Readonly<{
  entries: readonly AssumptionEntry[];
  summary: string;
}>;

export type AdvisoryExplanationBundle = Readonly<{
  guidance: GuidanceExplanation;
  supportingEvidence: SupportingEvidenceLayer;
  confidenceDrivers: ConfidenceDriverLayer;
  confidenceLimiters: ConfidenceLimiterLayer;
  reasoningPath: ReasoningPathRender;
  assumptionsAndUnknowns: AssumptionsUnknownsLayer;
}>;

export type AdvisoryExplainabilityAggregationInput = ExecutiveAdvisoryAggregationInput;
