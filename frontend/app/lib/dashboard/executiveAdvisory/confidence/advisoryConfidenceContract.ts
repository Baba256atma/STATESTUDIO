/**
 * Phase 5:3 — Advisory Confidence Framework contract.
 */

import type { ImpactDirection } from "../../dashboardVisualSignalContract.ts";
import type { AdvisoryContext } from "../aggregation/advisoryContextContract.ts";
import type { ExecutiveAdvisoryAggregationInput } from "../executiveAdvisoryContract.ts";

export const ADVISORY_CONFIDENCE_FRAMEWORK_VERSION = "5.3.0";

export const CANONICAL_ADVISORY_CONFIDENCE_OWNER = "advisoryConfidenceRuntime";

export type EvidenceCoverageLevel = "sparse" | "partial" | "strong";

export type EvidenceConsistencyLevel = "conflicting" | "mixed" | "consistent";

export type EvidenceFreshnessLevel = "stale" | "recent" | "current";

export type SourceDiversityLevel = "single_source" | "few_sources" | "multiple_sources";

export type ReasoningStabilityLevel = "unstable" | "moderately_stable" | "stable";

export type OverallAdvisoryConfidenceLevel = "low" | "moderate" | "high" | "very_high";

export type ConfidenceEvaluationInput = Readonly<{
  advisoryContext: AdvisoryContext;
  dashboardContext: ExecutiveAdvisoryAggregationInput["dashboardContext"];
}>;

/** Phase 5:4 explainability foundation — contracts only. */
export type ConfidenceExplanationContract = Readonly<{
  confidenceDrivers: readonly string[];
  confidenceLimiters: readonly string[];
  missingEvidence: readonly string[];
  supportingEvidence: readonly string[];
  summary: string;
}>;

export type EvidenceCoverageEvaluation = Readonly<{
  level: EvidenceCoverageLevel;
  label: string;
  summary: string;
  signalCount: number;
}>;

export type EvidenceConsistencyEvaluation = Readonly<{
  level: EvidenceConsistencyLevel;
  label: string;
  summary: string;
}>;

export type EvidenceFreshnessEvaluation = Readonly<{
  level: EvidenceFreshnessLevel;
  label: string;
  summary: string;
}>;

export type SourceDiversityEvaluation = Readonly<{
  level: SourceDiversityLevel;
  label: string;
  summary: string;
  supportingDomains: readonly string[];
}>;

export type ReasoningStabilityEvaluation = Readonly<{
  level: ReasoningStabilityLevel;
  label: string;
  summary: string;
  trend: ImpactDirection;
}>;

export type OverallAdvisoryConfidence = Readonly<{
  level: OverallAdvisoryConfidenceLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type AdvisoryConfidenceEvaluation = Readonly<{
  coverage: EvidenceCoverageEvaluation;
  consistency: EvidenceConsistencyEvaluation;
  freshness: EvidenceFreshnessEvaluation;
  diversity: SourceDiversityEvaluation;
  stability: ReasoningStabilityEvaluation;
  overall: OverallAdvisoryConfidence;
  explanation: ConfidenceExplanationContract;
}>;

export type AdvisoryConfidenceAggregationInput = ExecutiveAdvisoryAggregationInput;
