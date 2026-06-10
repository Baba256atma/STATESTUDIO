/**
 * Phase 5:3 — Advisory Confidence Runtime (single confidence owner).
 */

import { getAdvisoryContextForExecutiveAdvisory } from "../aggregation/advisoryAggregationRuntime.ts";
import type {
  AdvisoryConfidenceAggregationInput,
  AdvisoryConfidenceEvaluation,
  OverallAdvisoryConfidenceLevel,
} from "./advisoryConfidenceContract.ts";
import {
  ADVISORY_CONFIDENCE_FRAMEWORK_VERSION,
  CANONICAL_ADVISORY_CONFIDENCE_OWNER,
} from "./advisoryConfidenceContract.ts";
import { evaluateAdvisoryConfidence } from "./advisoryConfidenceEvaluation.ts";
import {
  reportAdvisoryConfidenceFramework,
  reportConfidenceAggregation,
  reportEvidenceConsistency,
  reportEvidenceCoverage,
  reportEvidenceFreshness,
  reportReasoningStability,
  reportSourceDiversity,
} from "./advisoryConfidenceLogging.ts";

let lastSignature: string | null = null;
let lastEvaluation: AdvisoryConfidenceEvaluation | null = null;
let lastOverallLevel: OverallAdvisoryConfidenceLevel | null = null;

function buildSignature(input: AdvisoryConfidenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveAdvisoryConfidence(
  input: AdvisoryConfidenceAggregationInput
): AdvisoryConfidenceEvaluation {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastEvaluation) return lastEvaluation;

  const advisoryContext = getAdvisoryContextForExecutiveAdvisory(input);
  const evaluation = evaluateAdvisoryConfidence(
    { advisoryContext, dashboardContext: input.dashboardContext },
    lastOverallLevel
  );

  lastSignature = signature;
  lastEvaluation = evaluation;
  lastOverallLevel = evaluation.overall.level;

  reportConfidenceAggregation({
    dashboardContext: input.dashboardContext,
    version: ADVISORY_CONFIDENCE_FRAMEWORK_VERSION,
    overall: evaluation.overall.level,
    owner: CANONICAL_ADVISORY_CONFIDENCE_OWNER,
  });
  reportEvidenceCoverage(evaluation.coverage);
  reportEvidenceConsistency(evaluation.consistency);
  reportEvidenceFreshness(evaluation.freshness);
  reportSourceDiversity(evaluation.diversity);
  reportReasoningStability(evaluation.stability);
  reportAdvisoryConfidenceFramework(evaluation);

  return evaluation;
}

/** Approved feed for Executive Advisory surface. */
export function getAdvisoryConfidenceForExecutiveAdvisory(
  input: AdvisoryConfidenceAggregationInput
): AdvisoryConfidenceEvaluation {
  return resolveAdvisoryConfidence(input);
}

/** Approved feed for Executive Summary. */
export function getAdvisoryConfidenceForExecutiveSummary(
  input: AdvisoryConfidenceAggregationInput
): AdvisoryConfidenceEvaluation {
  return resolveAdvisoryConfidence(input);
}

export function initializeAdvisoryConfidenceRuntime(
  input: AdvisoryConfidenceAggregationInput
): AdvisoryConfidenceEvaluation {
  reportConfidenceAggregation({
    phase: "runtime_init",
    owner: CANONICAL_ADVISORY_CONFIDENCE_OWNER,
    version: ADVISORY_CONFIDENCE_FRAMEWORK_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveAdvisoryConfidence(input);
}

export function resetAdvisoryConfidenceRuntimeForTests(): void {
  lastSignature = null;
  lastEvaluation = null;
  lastOverallLevel = null;
}
