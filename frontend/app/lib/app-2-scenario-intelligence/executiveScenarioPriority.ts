/**
 * APP-2:4 — Executive Scenario Priority Engine.
 * Canonical read-only executive priority assessment for APP-2 consumers.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import type { ExecutiveScenarioPriorityResolveRequest } from "./executiveScenarioPriorityResolver.ts";
import {
  normalizeExecutiveScenarioPriorityRequest,
  resolveExecutiveScenarioPriority,
  resolveExecutiveScenarioPriorityProbeExample,
  validateScenarioContextForPriority,
} from "./executiveScenarioPriorityResolver.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";

export {
  normalizeExecutiveScenarioPriorityRequest,
  resolveExecutiveScenarioPriority,
  resolveExecutiveScenarioPriorityProbeExample,
  validateScenarioContextForPriority,
};
export type { ExecutiveScenarioPriority, ExecutiveScenarioPriorityResolveRequest };

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_OWNER =
  "app-2-executive-scenario-priority-engine" as const;

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_TAGS = Object.freeze([
  "[APP2_4_EXECUTIVE_SCENARIO_PRIORITY_ENGINE]",
  "[EXECUTIVE_SCENARIO_PRIORITY_READY]",
  "[EXECUTIVE_PRIORITY_READ_ONLY]",
  "[NO_RECOMMENDATIONS]",
  "[NO_PREDICTION]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_SCENARIO_CONTEXT]",
] as const);

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_RULES = Object.freeze({
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
  rebuildsContext: false,
} as const);

export function evaluateExecutiveScenarioPriorityFromContext(
  request: ExecutiveScenarioPriorityResolveRequest
): ExecutiveScenarioPriority {
  return resolveExecutiveScenarioPriority(request);
}

export function getExecutiveScenarioPriorityEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contextEngineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  owner: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    owner: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_OWNER,
  });
}

export const ExecutiveScenarioPriorityEngine = Object.freeze({
  evaluateExecutiveScenarioPriorityFromContext,
  resolveExecutiveScenarioPriority,
  resolveExecutiveScenarioPriorityProbeExample,
  validateScenarioContextForPriority,
  normalizeExecutiveScenarioPriorityRequest,
  getExecutiveScenarioPriorityEngineVersionMetadata,
  version: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  rules: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_RULES,
});
