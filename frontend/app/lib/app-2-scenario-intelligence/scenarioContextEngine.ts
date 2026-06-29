/**
 * APP-2:3 — Scenario Context Engine.
 * Canonical read-only executive context assembly for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import type { ScenarioContextResolveRequest } from "./scenarioContextResolver.ts";
import {
  normalizeScenarioContextBuildInput,
  resolveScenarioContext,
  resolveScenarioContextProbeExample,
  resolveScenarioContextState,
} from "./scenarioContextResolver.ts";
import type { ScenarioContext } from "./scenarioContextResult.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";

export { buildScenarioContext, normalizeScenarioContextBuildInput, resolveScenarioContext, resolveScenarioContextProbeExample, resolveScenarioContextState };
export type { ScenarioContext, ScenarioContextResolveRequest };

export const SCENARIO_CONTEXT_ENGINE_OWNER = "app-2-scenario-context-engine" as const;

export const SCENARIO_CONTEXT_ENGINE_TAGS = Object.freeze([
  "[APP2_3_SCENARIO_CONTEXT_ENGINE]",
  "[SCENARIO_CONTEXT_ENGINE_READY]",
  "[SCENARIO_CONTEXT_READ_ONLY]",
  "[NO_RECOMMENDATIONS]",
  "[NO_PREDICTION]",
  "[WORKSPACE_ISOLATED]",
  "[CANONICAL_BUSINESS_CONTEXT]",
] as const);

export const SCENARIO_CONTEXT_ENGINE_RULES = Object.freeze({
  deterministic: true,
  repeatable: true,
  stateless: true,
  threadSafe: true,
  pure: true,
  serializable: true,
  lightweight: true,
  noSideEffects: true,
  noGlobalCache: true,
  executiveTimeReadOnly: true,
  timelineReadOnly: true,
  workspaceIsolated: true,
  consumesStateEngine: true,
} as const);

export function buildScenarioExecutiveContext(
  request: ScenarioContextResolveRequest
): ScenarioContext {
  return resolveScenarioContext(request);
}

export function getScenarioContextEngineVersionMetadata(): Readonly<{
  engineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  owner: typeof SCENARIO_CONTEXT_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    owner: SCENARIO_CONTEXT_ENGINE_OWNER,
  });
}

export const ScenarioContextEngine = Object.freeze({
  buildScenarioExecutiveContext,
  resolveScenarioContext,
  resolveScenarioContextState,
  normalizeScenarioContextBuildInput,
  buildScenarioContext,
  resolveScenarioContextProbeExample,
  getScenarioContextEngineVersionMetadata,
  version: SCENARIO_CONTEXT_ENGINE_VERSION,
  rules: SCENARIO_CONTEXT_ENGINE_RULES,
});
