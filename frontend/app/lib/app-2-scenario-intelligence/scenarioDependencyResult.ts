/**
 * APP-2:5 — Scenario Dependency Engine result types.
 * Canonical immutable dependency graph — no UI or rendering artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ScenarioDependencyCategory,
  ScenarioDependencyDirection,
  ScenarioDependencyNodeKind,
  ScenarioDependencyReasonCode,
} from "./scenarioDependencyGraph.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import type { ScenarioDependencyDiagnostic } from "./scenarioDependencyDiagnostics.ts";

export type ScenarioDependencyNode = Readonly<{
  nodeId: string;
  kind: ScenarioDependencyNodeKind;
  label: string;
  refId: string;
  category: ScenarioDependencyCategory;
  readOnly: true;
}>;

export type ScenarioDependencyEdge = Readonly<{
  edgeId: string;
  source: string;
  target: string;
  type: ScenarioDependencyCategory;
  direction: ScenarioDependencyDirection;
  strength: number;
  reasonCode: ScenarioDependencyReasonCode;
  readOnly: true;
}>;

export type ScenarioDependencyGraph = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  dependencyNodes: readonly ScenarioDependencyNode[];
  dependencyEdges: readonly ScenarioDependencyEdge[];
  incomingDependencies: readonly ScenarioDependencyEdge[];
  outgoingDependencies: readonly ScenarioDependencyEdge[];
  criticalDependencies: readonly ScenarioDependencyEdge[];
  isolatedDependencies: readonly ScenarioDependencyNode[];
  sharedDependencies: readonly ScenarioDependencyNode[];
  dependencyDiagnostics: readonly ScenarioDependencyDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof SCENARIO_DEPENDENCY_GRAPH_VERSION;
}>;

export type ScenarioDependencyBuildInput = Readonly<{
  generatedAt: string;
}>;

export function createScenarioDependencyGraph(
  input: Omit<ScenarioDependencyGraph, "readOnly" | "engineVersion">
): ScenarioDependencyGraph {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: SCENARIO_DEPENDENCY_GRAPH_VERSION,
  });
}

export function createScenarioDependencyNode(
  input: Omit<ScenarioDependencyNode, "readOnly">
): ScenarioDependencyNode {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createScenarioDependencyEdge(
  input: Omit<ScenarioDependencyEdge, "readOnly">
): ScenarioDependencyEdge {
  return Object.freeze({ ...input, readOnly: true as const });
}
