/**
 * APP-2:6 — Executive Scenario Conflict Engine.
 * Canonical read-only conflict graph for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import type { ExecutiveScenarioConflictResolveRequest } from "./executiveScenarioConflictResolver.ts";
import {
  resolveExecutiveScenarioConflictGraph,
  resolveExecutiveScenarioConflictGraphProbeExample,
  validateExecutiveScenarioConflictInputs,
} from "./executiveScenarioConflictResolver.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";

export {
  resolveExecutiveScenarioConflictGraph,
  resolveExecutiveScenarioConflictGraphProbeExample,
  validateExecutiveScenarioConflictInputs,
};
export type { ExecutiveScenarioConflictGraph, ExecutiveScenarioConflictResolveRequest };

export const EXECUTIVE_SCENARIO_CONFLICT_ENGINE_OWNER =
  "app-2-executive-scenario-conflict-engine" as const;

export const EXECUTIVE_SCENARIO_CONFLICT_ENGINE_TAGS = Object.freeze([
  "[APP2_6_EXECUTIVE_SCENARIO_CONFLICT_ENGINE]",
  "[EXECUTIVE_SCENARIO_CONFLICT_READY]",
  "[EXECUTIVE_CONFLICT_READ_ONLY]",
  "[NO_CONFLICT_RESOLUTION]",
  "[NO_RECOMMENDATIONS]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_SCENARIO_CONTEXT]",
  "[CONSUMES_EXECUTIVE_PRIORITY]",
  "[CONSUMES_DEPENDENCY_GRAPH]",
] as const);

export const EXECUTIVE_SCENARIO_CONFLICT_ENGINE_RULES = Object.freeze({
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
  consumesDependencyGraph: true,
  rebuildsContext: false,
  rebuildsPriority: false,
  rebuildsDependencies: false,
  detectsOnly: true,
  resolvesConflicts: false,
} as const);

export function buildExecutiveScenarioConflictGraphFromInputs(
  request: ExecutiveScenarioConflictResolveRequest
): ExecutiveScenarioConflictGraph {
  return resolveExecutiveScenarioConflictGraph(request);
}

export function getExecutiveScenarioConflictEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contextEngineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  priorityEngineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
  dependencyEngineVersion: typeof SCENARIO_DEPENDENCY_GRAPH_VERSION;
  owner: typeof EXECUTIVE_SCENARIO_CONFLICT_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    dependencyEngineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
    owner: EXECUTIVE_SCENARIO_CONFLICT_ENGINE_OWNER,
  });
}

export const ExecutiveScenarioConflictEngine = Object.freeze({
  buildExecutiveScenarioConflictGraphFromInputs,
  resolveExecutiveScenarioConflictGraph,
  resolveExecutiveScenarioConflictGraphProbeExample,
  validateExecutiveScenarioConflictInputs,
  getExecutiveScenarioConflictEngineVersionMetadata,
  version: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
  rules: EXECUTIVE_SCENARIO_CONFLICT_ENGINE_RULES,
});
