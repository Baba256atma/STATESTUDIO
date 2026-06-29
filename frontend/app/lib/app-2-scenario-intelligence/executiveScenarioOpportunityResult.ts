/**
 * APP-2:7 — Executive Scenario Opportunity result types.
 * Canonical immutable opportunity graph — no UI or rendering artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ExecutiveScenarioOpportunityCategory,
  ExecutiveScenarioOpportunityNodeKind,
  ExecutiveScenarioOpportunityReasonCode,
  ExecutiveScenarioOpportunityValue,
} from "./executiveScenarioOpportunityGraph.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";
import type { ExecutiveScenarioOpportunityDiagnostic } from "./executiveScenarioOpportunityDiagnostics.ts";

export type ExecutiveScenarioOpportunityNode = Readonly<{
  opportunityNodeId: string;
  kind: ExecutiveScenarioOpportunityNodeKind;
  label: string;
  refId: string;
  category: ExecutiveScenarioOpportunityCategory;
  value: ExecutiveScenarioOpportunityValue;
  readOnly: true;
}>;

export type ExecutiveScenarioOpportunityEdge = Readonly<{
  opportunityEdgeId: string;
  sourceOpportunityNodeId: string;
  targetRefId: string;
  category: ExecutiveScenarioOpportunityCategory;
  reasonCode: ExecutiveScenarioOpportunityReasonCode;
  strength: number;
  readOnly: true;
}>;

export type ExecutiveScenarioOpportunityCluster = Readonly<{
  clusterId: string;
  category: ExecutiveScenarioOpportunityCategory;
  opportunityNodeIds: readonly string[];
  label: string;
  readOnly: true;
}>;

export type ExecutiveScenarioOpportunityEvidence = Readonly<{
  evidenceId: string;
  originatingEntity: string;
  affectedEntity: string;
  reasonCode: ExecutiveScenarioOpportunityReasonCode;
  summary: string;
  dependencyRef: string | null;
  conflictRef: string | null;
  supportingKpi: string | null;
  supportingRisk: string | null;
  supportingTimeline: string | null;
  supportingExecutiveTime: string | null;
  readOnly: true;
}>;

export type ExecutiveScenarioOpportunityGraph = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  opportunityNodes: readonly ExecutiveScenarioOpportunityNode[];
  opportunityEdges: readonly ExecutiveScenarioOpportunityEdge[];
  opportunityClusters: readonly ExecutiveScenarioOpportunityCluster[];
  highValueOpportunities: readonly ExecutiveScenarioOpportunityNode[];
  quickWinOpportunities: readonly ExecutiveScenarioOpportunityNode[];
  strategicOpportunities: readonly ExecutiveScenarioOpportunityNode[];
  blockedOpportunities: readonly ExecutiveScenarioOpportunityNode[];
  supportingEvidence: readonly ExecutiveScenarioOpportunityEvidence[];
  diagnostics: readonly ExecutiveScenarioOpportunityDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION;
}>;

export type ExecutiveScenarioOpportunityBuildInput = Readonly<{
  generatedAt: string;
}>;

export function createExecutiveScenarioOpportunityGraph(
  input: Omit<ExecutiveScenarioOpportunityGraph, "readOnly" | "engineVersion">
): ExecutiveScenarioOpportunityGraph {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
  });
}

export function createExecutiveScenarioOpportunityNode(
  input: Omit<ExecutiveScenarioOpportunityNode, "readOnly">
): ExecutiveScenarioOpportunityNode {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioOpportunityEdge(
  input: Omit<ExecutiveScenarioOpportunityEdge, "readOnly">
): ExecutiveScenarioOpportunityEdge {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioOpportunityCluster(
  input: Omit<ExecutiveScenarioOpportunityCluster, "readOnly">
): ExecutiveScenarioOpportunityCluster {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioOpportunityEvidence(
  input: Omit<ExecutiveScenarioOpportunityEvidence, "readOnly">
): ExecutiveScenarioOpportunityEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}
