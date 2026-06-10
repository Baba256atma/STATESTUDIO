/**
 * Phase 5:4 — Advisory Explainability Runtime (single explainability owner).
 */

import { getAdvisoryContextForExecutiveAdvisory } from "../aggregation/advisoryAggregationRuntime.ts";
import { getAdvisoryConfidenceForExecutiveAdvisory } from "../confidence/advisoryConfidenceRuntime.ts";
import type {
  AdvisoryExplainabilityAggregationInput,
  AdvisoryExplanationBundle,
} from "./advisoryExplainabilityContract.ts";
import {
  ADVISORY_EXPLAINABILITY_LAYER_VERSION,
  CANONICAL_ADVISORY_EXPLAINABILITY_OWNER,
} from "./advisoryExplainabilityContract.ts";
import { generateAdvisoryExplanation } from "./advisoryExplainabilityGeneration.ts";
import {
  reportAdvisoryExplainability,
  reportAssumption,
  reportConfidenceDriver,
  reportConfidenceLimiter,
  reportGuidanceExplanation,
  reportReasoningPath,
  reportSupportingEvidence,
} from "./advisoryExplainabilityLogging.ts";

let lastSignature: string | null = null;
let lastBundle: AdvisoryExplanationBundle | null = null;

function buildSignature(input: AdvisoryExplainabilityAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveAdvisoryExplanation(
  input: AdvisoryExplainabilityAggregationInput
): AdvisoryExplanationBundle {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastBundle) return lastBundle;

  const advisoryContext = getAdvisoryContextForExecutiveAdvisory(input);
  const confidenceEvaluation = getAdvisoryConfidenceForExecutiveAdvisory(input);

  const bundle = generateAdvisoryExplanation({
    advisoryContext,
    confidenceEvaluation,
    dashboardContext: input.dashboardContext,
  });

  lastSignature = signature;
  lastBundle = bundle;

  reportGuidanceExplanation(bundle.guidance);
  reportSupportingEvidence(bundle.supportingEvidence);
  reportConfidenceDriver(bundle.confidenceDrivers);
  reportConfidenceLimiter(bundle.confidenceLimiters);
  reportReasoningPath(bundle.reasoningPath);
  reportAssumption(bundle.assumptionsAndUnknowns);
  reportAdvisoryExplainability(bundle);

  return bundle;
}

/** Approved feed for Executive Advisory surface. */
export function getAdvisoryExplanationForExecutiveAdvisory(
  input: AdvisoryExplainabilityAggregationInput
): AdvisoryExplanationBundle {
  return resolveAdvisoryExplanation(input);
}

/** Approved feed for Executive Summary. */
export function getAdvisoryExplanationForExecutiveSummary(
  input: AdvisoryExplainabilityAggregationInput
): AdvisoryExplanationBundle {
  return resolveAdvisoryExplanation(input);
}

/** Approved feed for War Room intelligence surface. */
export function getAdvisoryExplanationForWarRoom(
  input: AdvisoryExplainabilityAggregationInput
): AdvisoryExplanationBundle {
  return resolveAdvisoryExplanation(input);
}

export function initializeAdvisoryExplainabilityRuntime(
  input: AdvisoryExplainabilityAggregationInput
): AdvisoryExplanationBundle {
  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.info?.("[Nexora][AdvisoryExplainability]", {
      phase: "runtime_init",
      owner: CANONICAL_ADVISORY_EXPLAINABILITY_OWNER,
      version: ADVISORY_EXPLAINABILITY_LAYER_VERSION,
      dashboardContext: input.dashboardContext,
    });
  }
  return resolveAdvisoryExplanation(input);
}

export function resetAdvisoryExplainabilityRuntimeForTests(): void {
  lastSignature = null;
  lastBundle = null;
}
