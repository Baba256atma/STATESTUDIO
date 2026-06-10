/**
 * Phase 4:5 — Scenario Intelligence Runtime (single owner).
 */

import type {
  ScenarioIntelligenceAggregationInput,
  ScenarioIntelligenceSnapshot,
  ScenarioIntelligenceSurfaceModel,
} from "./scenarioIntelligenceContract.ts";
import {
  CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
  SCENARIO_INTELLIGENCE_SURFACE_VERSION,
} from "./scenarioIntelligenceContract.ts";
import { aggregateScenarioIntelligence } from "./scenarioIntelligenceAggregation.ts";
import { reportScenarioIntelligence } from "./scenarioIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: ScenarioIntelligenceSurfaceModel | null = null;

function buildSignature(input: ScenarioIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveScenarioIntelligenceSurface(
  input: ScenarioIntelligenceAggregationInput
): ScenarioIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateScenarioIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getScenarioIntelligenceSnapshotForExecutiveSummary(
  input: ScenarioIntelligenceAggregationInput
): ScenarioIntelligenceSnapshot {
  return resolveScenarioIntelligenceSurface(input).snapshot;
}

export function initializeScenarioIntelligenceRuntime(
  input: ScenarioIntelligenceAggregationInput
): ScenarioIntelligenceSurfaceModel {
  reportScenarioIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
    version: SCENARIO_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveScenarioIntelligenceSurface(input);
}

export function resetScenarioIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
