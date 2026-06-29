/**
 * APP-2:2 — Scenario State Engine.
 * Canonical read-only scenario state resolution for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { evaluateScenarioState } from "./scenarioStateEvaluator.ts";
import type { ScenarioStateResolveRequest } from "./scenarioStateResolver.ts";
import {
  normalizeScenarioStateResolveRequest,
  resolveScenarioStateEvaluationInput,
  resolveScenarioStateProbeExample,
} from "./scenarioStateResolver.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";

export const SCENARIO_STATE_ENGINE_OWNER = "app-2-scenario-state-engine" as const;

export const SCENARIO_STATE_ENGINE_TAGS = Object.freeze([
  "[APP2_2_SCENARIO_STATE_ENGINE]",
  "[SCENARIO_STATE_ENGINE_READY]",
  "[SCENARIO_STATE_READ_ONLY]",
  "[NO_RECOMMENDATIONS]",
  "[NO_PREDICTION]",
  "[WORKSPACE_ISOLATED]",
] as const);

export const SCENARIO_STATE_ENGINE_RULES = Object.freeze({
  deterministic: true,
  repeatable: true,
  stateless: true,
  threadSafe: true,
  pure: true,
  noSideEffects: true,
  noGlobalCache: true,
  executiveTimeReadOnly: true,
  timelineReadOnly: true,
  workspaceIsolated: true,
} as const);

export function resolveScenarioState(request: ScenarioStateResolveRequest): ScenarioStateResult {
  const input = resolveScenarioStateEvaluationInput(request);
  return evaluateScenarioState(input);
}

export function resolveScenarioStateFromInput(
  request: ScenarioStateResolveRequest
): ScenarioStateResult {
  const input = normalizeScenarioStateResolveRequest(request);
  return evaluateScenarioState(input);
}

export function getScenarioStateEngineVersionMetadata(): Readonly<{
  engineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  owner: typeof SCENARIO_STATE_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    owner: SCENARIO_STATE_ENGINE_OWNER,
  });
}

export const ScenarioStateEngine = Object.freeze({
  resolveScenarioState,
  resolveScenarioStateFromInput,
  resolveScenarioStateProbeExample,
  getScenarioStateEngineVersionMetadata,
  version: SCENARIO_STATE_ENGINE_VERSION,
  rules: SCENARIO_STATE_ENGINE_RULES,
});

export type { ScenarioStateResult, ScenarioStateResolveRequest };
