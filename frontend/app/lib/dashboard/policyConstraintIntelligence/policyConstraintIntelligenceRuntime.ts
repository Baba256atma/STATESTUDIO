/**
 * Phase 6:3 — Policy & Constraint Intelligence Runtime (single owner).
 */

import type {
  PolicyConstraintIntelligenceAggregationInput,
  PolicyConstraintIntelligenceSnapshot,
  PolicyConstraintIntelligenceSurfaceModel,
} from "./policyConstraintIntelligenceContract.ts";
import {
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION,
} from "./policyConstraintIntelligenceContract.ts";
import { aggregatePolicyConstraintIntelligence } from "./policyConstraintIntelligenceAggregation.ts";
import { reportPolicyIntelligence } from "./policyConstraintIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: PolicyConstraintIntelligenceSurfaceModel | null = null;

function buildSignature(input: PolicyConstraintIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolvePolicyConstraintIntelligenceSurface(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregatePolicyConstraintIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getPolicyConstraintIntelligenceSnapshotForExecutiveSummary(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSnapshot {
  return resolvePolicyConstraintIntelligenceSurface(input).snapshot;
}

/** Approved feed for Strategic Alignment presentation layer. */
export function getPolicyConstraintIntelligenceSnapshotForStrategicAlignment(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSnapshot {
  return resolvePolicyConstraintIntelligenceSurface(input).snapshot;
}

/** Approved feed for Governance presentation layer. */
export function getPolicyConstraintIntelligenceSnapshotForGovernance(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSnapshot {
  return resolvePolicyConstraintIntelligenceSurface(input).snapshot;
}

export function initializePolicyConstraintIntelligenceRuntime(
  input: PolicyConstraintIntelligenceAggregationInput
): PolicyConstraintIntelligenceSurfaceModel {
  reportPolicyIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
    version: POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolvePolicyConstraintIntelligenceSurface(input);
}

export function resetPolicyConstraintIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
