/**
 * APP-2:7 — Executive Scenario Opportunity Engine.
 * Canonical read-only opportunity graph for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";
import type { ExecutiveScenarioOpportunityResolveRequest } from "./executiveScenarioOpportunityResolver.ts";
import {
  resolveExecutiveScenarioOpportunityGraph,
  resolveExecutiveScenarioOpportunityGraphProbeExample,
  validateExecutiveScenarioOpportunityInputs,
} from "./executiveScenarioOpportunityResolver.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";

export {
  resolveExecutiveScenarioOpportunityGraph,
  resolveExecutiveScenarioOpportunityGraphProbeExample,
  validateExecutiveScenarioOpportunityInputs,
};
export type { ExecutiveScenarioOpportunityGraph, ExecutiveScenarioOpportunityResolveRequest };

export const EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_OWNER =
  "app-2-executive-scenario-opportunity-engine" as const;

export const EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_TAGS = Object.freeze([
  "[APP2_7_EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE]",
  "[EXECUTIVE_SCENARIO_OPPORTUNITY_READY]",
  "[EXECUTIVE_OPPORTUNITY_READ_ONLY]",
  "[NO_RECOMMENDATIONS]",
  "[NO_OPPORTUNITY_RANKING]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_SCENARIO_CONTEXT]",
  "[CONSUMES_EXECUTIVE_PRIORITY]",
  "[CONSUMES_DEPENDENCY_GRAPH]",
  "[CONSUMES_CONFLICT_GRAPH]",
] as const);

export const EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_RULES = Object.freeze({
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
  consumesConflictGraph: true,
  rebuildsContext: false,
  rebuildsPriority: false,
  rebuildsDependencies: false,
  rebuildsConflicts: false,
  detectsOnly: true,
  ranksOpportunities: false,
  recommendsExecution: false,
} as const);

export function buildExecutiveScenarioOpportunityGraphFromInputs(
  request: ExecutiveScenarioOpportunityResolveRequest
): ExecutiveScenarioOpportunityGraph {
  return resolveExecutiveScenarioOpportunityGraph(request);
}

export function getExecutiveScenarioOpportunityEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contextEngineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  priorityEngineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
  dependencyEngineVersion: typeof SCENARIO_DEPENDENCY_GRAPH_VERSION;
  conflictEngineVersion: typeof EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION;
  owner: typeof EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    dependencyEngineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
    conflictEngineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
    owner: EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_OWNER,
  });
}

export const ExecutiveScenarioOpportunityEngine = Object.freeze({
  buildExecutiveScenarioOpportunityGraphFromInputs,
  resolveExecutiveScenarioOpportunityGraph,
  resolveExecutiveScenarioOpportunityGraphProbeExample,
  validateExecutiveScenarioOpportunityInputs,
  getExecutiveScenarioOpportunityEngineVersionMetadata,
  version: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
  rules: EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE_RULES,
});
