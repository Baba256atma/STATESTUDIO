/**
 * Phase 6:6 — Institutional Alignment Runtime (single owner).
 */

import type {
  InstitutionalAlignmentAggregationInput,
  InstitutionalAlignmentSnapshot,
  InstitutionalAlignmentSurfaceModel,
} from "./institutionalAlignmentContract.ts";
import {
  CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION,
} from "./institutionalAlignmentContract.ts";
import { aggregateInstitutionalAlignment } from "./institutionalAlignmentAggregation.ts";
import { buildInstitutionalAlignmentBoardFeed } from "./boardIntelligenceContract.ts";
import type { InstitutionalAlignmentBoardFeed } from "./boardIntelligenceContract.ts";
import { reportInstitutionalAlignment } from "./institutionalAlignmentLogging.ts";

let lastSignature: string | null = null;
let lastModel: InstitutionalAlignmentSurfaceModel | null = null;

function buildSignature(input: InstitutionalAlignmentAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveInstitutionalAlignmentSurface(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalAlignmentSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateInstitutionalAlignment(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getInstitutionalAlignmentSnapshotForExecutiveSummary(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalAlignmentSnapshot {
  return resolveInstitutionalAlignmentSurface(input).snapshot;
}

/** Preparatory feed for future Board Intelligence. */
export function getInstitutionalAlignmentFeedForBoardIntelligence(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalAlignmentBoardFeed {
  return buildInstitutionalAlignmentBoardFeed(resolveInstitutionalAlignmentSurface(input).snapshot);
}

export function initializeInstitutionalAlignmentRuntime(
  input: InstitutionalAlignmentAggregationInput
): InstitutionalAlignmentSurfaceModel {
  reportInstitutionalAlignment({
    phase: "runtime_init",
    owner: CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
    version: INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveInstitutionalAlignmentSurface(input);
}

export function resetInstitutionalAlignmentRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
