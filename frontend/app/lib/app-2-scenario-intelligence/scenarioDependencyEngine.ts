/**
 * APP-2:5 — Scenario Dependency Engine.
 * Canonical read-only dependency graph for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import type { ScenarioDependencyResolveRequest } from "./scenarioDependencyResolver.ts";
import {
  resolveScenarioDependencyGraph,
  resolveScenarioDependencyGraphProbeExample,
  validateScenarioDependencyInputs,
} from "./scenarioDependencyResolver.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";

export {
  resolveScenarioDependencyGraph,
  resolveScenarioDependencyGraphProbeExample,
  validateScenarioDependencyInputs,
};
export type { ScenarioDependencyGraph, ScenarioDependencyResolveRequest };

export const SCENARIO_DEPENDENCY_ENGINE_OWNER = "app-2-scenario-dependency-engine" as const;

export const SCENARIO_DEPENDENCY_ENGINE_TAGS = Object.freeze([
  "[APP2_5_SCENARIO_DEPENDENCY_ENGINE]",
  "[SCENARIO_DEPENDENCY_ENGINE_READY]",
  "[SCENARIO_DEPENDENCY_READ_ONLY]",
  "[NO_CONFLICT_DETECTION]",
  "[NO_RECOMMENDATIONS]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_SCENARIO_CONTEXT]",
  "[CONSUMES_EXECUTIVE_PRIORITY]",
] as const);

export const SCENARIO_DEPENDENCY_ENGINE_RULES = Object.freeze({
  deterministic: true,
  repeatable: true,
  stateless: true,
  threadSafe: true,
  pure: true,
  serializable: true,
  readOnly: true,
  noSideEffects: true,
  noGlobalCache: true,
  workspaceIsolated: true,
  consumesScenarioContext: true,
  consumesExecutivePriority: true,
  rebuildsContext: false,
  rebuildsPriority: false,
  detectsOnly: true,
} as const);

export function buildScenarioDependencyGraphFromInputs(
  request: ScenarioDependencyResolveRequest
): ScenarioDependencyGraph {
  return resolveScenarioDependencyGraph(request);
}

export function getScenarioDependencyEngineVersionMetadata(): Readonly<{
  engineVersion: typeof SCENARIO_DEPENDENCY_GRAPH_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contextEngineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  priorityEngineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
  owner: typeof SCENARIO_DEPENDENCY_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    owner: SCENARIO_DEPENDENCY_ENGINE_OWNER,
  });
}

export const ScenarioDependencyEngine = Object.freeze({
  buildScenarioDependencyGraphFromInputs,
  resolveScenarioDependencyGraph,
  resolveScenarioDependencyGraphProbeExample,
  validateScenarioDependencyInputs,
  getScenarioDependencyEngineVersionMetadata,
  version: SCENARIO_DEPENDENCY_GRAPH_VERSION,
  rules: SCENARIO_DEPENDENCY_ENGINE_RULES,
});
