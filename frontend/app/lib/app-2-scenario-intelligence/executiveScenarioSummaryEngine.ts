/**
 * APP-2:8 — Executive Scenario Summary Engine.
 * Canonical executive summary built exclusively from ExecutiveScenarioSnapshot.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import {
  EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
  type ExecutiveScenarioSnapshot,
} from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import type {
  ExecutiveScenarioSnapshotBuildRequest,
  ExecutiveScenarioSummaryResolveRequest,
} from "./executiveScenarioSummaryResolver.ts";
import {
  resolveExecutiveScenarioSnapshot,
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummary,
  resolveExecutiveScenarioSummaryFromCertifiedInputs,
  resolveExecutiveScenarioSummaryProbeExample,
  validateExecutiveScenarioSnapshotInputs,
} from "./executiveScenarioSummaryResolver.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";

export {
  resolveExecutiveScenarioSnapshot,
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummary,
  resolveExecutiveScenarioSummaryFromCertifiedInputs,
  resolveExecutiveScenarioSummaryProbeExample,
  validateExecutiveScenarioSnapshotInputs,
};
export type {
  ExecutiveScenarioSnapshot,
  ExecutiveScenarioSnapshotBuildRequest,
  ExecutiveScenarioSummary,
  ExecutiveScenarioSummaryResolveRequest,
};

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_OWNER =
  "app-2-executive-scenario-summary-engine" as const;

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_TAGS = Object.freeze([
  "[APP2_8_EXECUTIVE_SCENARIO_SUMMARY_ENGINE]",
  "[EXECUTIVE_SCENARIO_SNAPSHOT_READY]",
  "[EXECUTIVE_SCENARIO_SUMMARY_READY]",
  "[EXECUTIVE_SUMMARY_READ_ONLY]",
  "[NO_RECOMMENDATIONS]",
  "[TEMPLATE_BASED]",
  "[WORKSPACE_ISOLATED]",
  "[CONSUMES_EXECUTIVE_SNAPSHOT]",
] as const);

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_RULES = Object.freeze({
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
  consumesSnapshotOnly: true,
  rebuildsContext: false,
  rebuildsPriority: false,
  rebuildsDependencies: false,
  rebuildsConflicts: false,
  rebuildsOpportunities: false,
  templateBased: true,
  noLlm: true,
  noMl: true,
  summarizesOnly: true,
  recommendsExecution: false,
  ranksActions: false,
} as const);

export function buildExecutiveScenarioSnapshotFromInputs(
  request: ExecutiveScenarioSnapshotBuildRequest
): ExecutiveScenarioSnapshot {
  return resolveExecutiveScenarioSnapshot(request);
}

export function buildExecutiveScenarioSummaryFromSnapshot(
  request: ExecutiveScenarioSummaryResolveRequest
): ExecutiveScenarioSummary {
  return resolveExecutiveScenarioSummary(request);
}

export function buildExecutiveScenarioSummaryFromCertifiedInputs(
  request: ExecutiveScenarioSnapshotBuildRequest
): ExecutiveScenarioSummary {
  return resolveExecutiveScenarioSummaryFromCertifiedInputs(request);
}

export function getExecutiveScenarioSummaryEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION;
  snapshotVersion: typeof EXECUTIVE_SCENARIO_SNAPSHOT_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  stateEngineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
  contextEngineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
  priorityEngineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
  dependencyEngineVersion: typeof SCENARIO_DEPENDENCY_GRAPH_VERSION;
  conflictEngineVersion: typeof EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION;
  opportunityEngineVersion: typeof EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION;
  owner: typeof EXECUTIVE_SCENARIO_SUMMARY_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
    snapshotVersion: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    stateEngineVersion: SCENARIO_STATE_ENGINE_VERSION,
    contextEngineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
    priorityEngineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    dependencyEngineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
    conflictEngineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
    opportunityEngineVersion: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
    owner: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_OWNER,
  });
}

export const ExecutiveScenarioSummaryEngine = Object.freeze({
  buildExecutiveScenarioSnapshotFromInputs,
  buildExecutiveScenarioSummaryFromSnapshot,
  buildExecutiveScenarioSummaryFromCertifiedInputs,
  resolveExecutiveScenarioSnapshot,
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummary,
  resolveExecutiveScenarioSummaryFromCertifiedInputs,
  resolveExecutiveScenarioSummaryProbeExample,
  validateExecutiveScenarioSnapshotInputs,
  getExecutiveScenarioSummaryEngineVersionMetadata,
  version: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
  snapshotVersion: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
  rules: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_RULES,
});
