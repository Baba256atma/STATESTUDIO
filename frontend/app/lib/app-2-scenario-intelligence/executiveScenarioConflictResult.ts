/**
 * APP-2:6 — Executive Scenario Conflict result types.
 * Canonical immutable conflict graph — no UI or rendering artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ExecutiveScenarioConflictCategory,
  ExecutiveScenarioConflictNodeKind,
  ExecutiveScenarioConflictReasonCode,
  ExecutiveScenarioConflictSeverity,
} from "./executiveScenarioConflictGraph.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import type { ExecutiveScenarioConflictDiagnostic } from "./executiveScenarioConflictDiagnostics.ts";

export type ExecutiveScenarioConflictNode = Readonly<{
  conflictNodeId: string;
  kind: ExecutiveScenarioConflictNodeKind;
  label: string;
  refId: string;
  category: ExecutiveScenarioConflictCategory;
  severity: ExecutiveScenarioConflictSeverity;
  readOnly: true;
}>;

export type ExecutiveScenarioConflictEdge = Readonly<{
  conflictEdgeId: string;
  sourceConflictNodeId: string;
  targetRefId: string;
  category: ExecutiveScenarioConflictCategory;
  reasonCode: ExecutiveScenarioConflictReasonCode;
  propagationStrength: number;
  readOnly: true;
}>;

export type ExecutiveScenarioConflictCluster = Readonly<{
  clusterId: string;
  category: ExecutiveScenarioConflictCategory;
  conflictNodeIds: readonly string[];
  label: string;
  readOnly: true;
}>;

export type ExecutiveScenarioConflictEvidence = Readonly<{
  evidenceId: string;
  originatingEntity: string;
  affectedEntity: string;
  reasonCode: ExecutiveScenarioConflictReasonCode;
  summary: string;
  dependencyRef: string | null;
  supportingKpi: string | null;
  supportingRisk: string | null;
  supportingTimeline: string | null;
  supportingExecutiveTime: string | null;
  readOnly: true;
}>;

export type ExecutiveScenarioConflictGraph = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  conflictNodes: readonly ExecutiveScenarioConflictNode[];
  conflictEdges: readonly ExecutiveScenarioConflictEdge[];
  conflictClusters: readonly ExecutiveScenarioConflictCluster[];
  criticalConflicts: readonly ExecutiveScenarioConflictNode[];
  blockedConflicts: readonly ExecutiveScenarioConflictNode[];
  resolvedConflicts: readonly ExecutiveScenarioConflictNode[];
  conflictCategories: readonly ExecutiveScenarioConflictCategory[];
  supportingEvidence: readonly ExecutiveScenarioConflictEvidence[];
  diagnostics: readonly ExecutiveScenarioConflictDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION;
}>;

export type ExecutiveScenarioConflictBuildInput = Readonly<{
  generatedAt: string;
}>;

export function createExecutiveScenarioConflictGraph(
  input: Omit<ExecutiveScenarioConflictGraph, "readOnly" | "engineVersion">
): ExecutiveScenarioConflictGraph {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
  });
}

export function createExecutiveScenarioConflictNode(
  input: Omit<ExecutiveScenarioConflictNode, "readOnly">
): ExecutiveScenarioConflictNode {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioConflictEdge(
  input: Omit<ExecutiveScenarioConflictEdge, "readOnly">
): ExecutiveScenarioConflictEdge {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioConflictCluster(
  input: Omit<ExecutiveScenarioConflictCluster, "readOnly">
): ExecutiveScenarioConflictCluster {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioConflictEvidence(
  input: Omit<ExecutiveScenarioConflictEvidence, "readOnly">
): ExecutiveScenarioConflictEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}
