/**
 * Phase 5:2 — Advisory Aggregation Runtime (single aggregation owner).
 */

import type {
  AdvisoryContext,
  AdvisoryContextAggregationInput,
} from "./advisoryContextContract.ts";
import {
  ADVISORY_CONTEXT_AGGREGATION_VERSION,
  CANONICAL_ADVISORY_AGGREGATION_OWNER,
} from "./advisoryContextContract.ts";
import { generateAdvisoryContext } from "./advisoryContextGeneration.ts";
import { reportAdvisoryAggregation } from "./advisoryAggregationLogging.ts";

let lastSignature: string | null = null;
let lastContext: AdvisoryContext | null = null;

function buildSignature(input: AdvisoryContextAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveAdvisoryContext(input: AdvisoryContextAggregationInput): AdvisoryContext {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastContext) return lastContext;
  const context = generateAdvisoryContext(input);
  lastSignature = signature;
  lastContext = context;
  return context;
}

/** Approved feed for Executive Advisory surface. */
export function getAdvisoryContextForExecutiveAdvisory(
  input: AdvisoryContextAggregationInput
): AdvisoryContext {
  return resolveAdvisoryContext(input);
}

/** Approved feed for Executive Summary. */
export function getAdvisoryContextForExecutiveSummary(
  input: AdvisoryContextAggregationInput
): AdvisoryContext {
  return resolveAdvisoryContext(input);
}

export function initializeAdvisoryAggregationRuntime(
  input: AdvisoryContextAggregationInput
): AdvisoryContext {
  reportAdvisoryAggregation({
    phase: "runtime_init",
    owner: CANONICAL_ADVISORY_AGGREGATION_OWNER,
    version: ADVISORY_CONTEXT_AGGREGATION_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveAdvisoryContext(input);
}

export function resetAdvisoryAggregationRuntimeForTests(): void {
  lastSignature = null;
  lastContext = null;
}
