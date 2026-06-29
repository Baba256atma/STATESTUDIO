/**
 * APP-2:5 — Scenario Dependency Builder.
 * Pure deterministic dependency graph assembly — no side effects.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK } from "./executiveScenarioPriorityResult.ts";
import {
  SCENARIO_DEPENDENCY_CATEGORY_BY_KIND,
  SCENARIO_DEPENDENCY_CRITICAL_STRENGTH_THRESHOLD,
  type ScenarioDependencyReasonCode,
} from "./scenarioDependencyGraph.ts";
import {
  createScenarioDependencyDiagnostic,
  type ScenarioDependencyDiagnostic,
} from "./scenarioDependencyDiagnostics.ts";
import type {
  ScenarioDependencyBuildInput,
  ScenarioDependencyEdge,
  ScenarioDependencyGraph,
  ScenarioDependencyNode,
} from "./scenarioDependencyResult.ts";
import {
  createScenarioDependencyEdge,
  createScenarioDependencyGraph,
  createScenarioDependencyNode,
} from "./scenarioDependencyResult.ts";

function nodeId(kind: string, refId: string): string {
  return `node:${kind}:${refId}`;
}

function edgeId(source: string, target: string, reason: string): string {
  return `edge:${source}->${target}:${reason}`;
}

function clampStrength(value: number): number {
  return Math.min(1, Math.max(0.1, Math.round(value * 100) / 100));
}

function priorityBoost(priority: ExecutiveScenarioPriority): number {
  return EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK[priority.priorityLevel] * 0.05;
}

function addNode(
  nodes: Map<string, ScenarioDependencyNode>,
  kind: ScenarioDependencyNode["kind"],
  refId: string,
  label: string
): string {
  const id = nodeId(kind, refId);
  if (!nodes.has(id)) {
    nodes.set(
      id,
      createScenarioDependencyNode({
        nodeId: id,
        kind,
        refId,
        label,
        category: SCENARIO_DEPENDENCY_CATEGORY_BY_KIND[kind],
      })
    );
  }
  return id;
}

function addEdge(
  edges: ScenarioDependencyEdge[],
  source: string,
  target: string,
  direction: ScenarioDependencyEdge["direction"],
  strength: number,
  reasonCode: ScenarioDependencyReasonCode,
  type: ScenarioDependencyEdge["type"]
): void {
  const normalizedStrength = clampStrength(strength);
  edges.push(
    createScenarioDependencyEdge({
      edgeId: edgeId(source, target, reasonCode),
      source,
      target,
      type,
      direction,
      strength: normalizedStrength,
      reasonCode,
    })
  );
}

function detectCircularDependencies(edges: readonly ScenarioDependencyEdge[]): string[][] {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): void {
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      if (cycleStart >= 0) cycles.push(stack.slice(cycleStart).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    stack.push(node);
    for (const next of adjacency.get(node) ?? []) dfs(next);
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of adjacency.keys()) dfs(node);
  return cycles;
}

function collectDiagnostics(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  nodes: readonly ScenarioDependencyNode[],
  edges: readonly ScenarioDependencyEdge[],
  generatedAt: string
): ScenarioDependencyDiagnostic[] {
  const diagnostics: ScenarioDependencyDiagnostic[] = [];

  if (!context.identity) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "missing_context",
        "Scenario identity is unavailable for dependency graph construction.",
        generatedAt
      )
    );
  }

  if (!context.state) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "missing_state",
        "Scenario state is unavailable for dependency graph construction.",
        generatedAt
      )
    );
  }

  if (!context.workspace) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "missing_workspace",
        "Workspace reference is unavailable for dependency graph construction.",
        generatedAt
      )
    );
  }

  if (priority.priorityLevel === "none") {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "missing_priority",
        "Executive priority is unavailable for dependency graph construction.",
        generatedAt
      )
    );
  }

  if (context.scenarioId !== priority.scenarioId || context.workspaceId !== priority.workspaceId) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "broken_reference",
        "ScenarioContext and ExecutiveScenarioPriority identity mismatch.",
        generatedAt,
        Object.freeze({
          contextScenarioId: context.scenarioId,
          priorityScenarioId: priority.scenarioId,
        })
      )
    );
  }

  const cycles = detectCircularDependencies(edges);
  for (const cycle of cycles) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "circular_dependency",
        "Circular dependency detected in scenario dependency graph.",
        generatedAt,
        Object.freeze({ cycle })
      )
    );
  }

  if (nodes.length <= 1) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "incomplete_graph",
        "Dependency graph contains only the root scenario node.",
        generatedAt
      )
    );
  }

  if (edges.length === 0 && nodes.length > 0) {
    diagnostics.push(
      createScenarioDependencyDiagnostic(
        "missing_dependency",
        "No dependency edges were detected.",
        generatedAt
      )
    );
  }

  return diagnostics;
}

export function buildScenarioDependencyGraph(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  input: ScenarioDependencyBuildInput
): ScenarioDependencyGraph {
  const generatedAt = input.generatedAt;
  const nodes = new Map<string, ScenarioDependencyNode>();
  const edges: ScenarioDependencyEdge[] = [];
  const boost = priorityBoost(priority);

  const rootLabel = context.identity?.scenarioType ?? "scenario";
  const rootNodeId = nodeId("scenario", context.scenarioId);
  addNode(nodes, "scenario", context.scenarioId, rootLabel);

  if (context.workspace) {
    const workspaceNode = addNode(
      nodes,
      "workspace",
      context.workspace.workspaceId,
      `Workspace ${context.workspace.workspaceId}`
    );
    addEdge(
      edges,
      rootNodeId,
      workspaceNode,
      "outgoing",
      0.5 + boost,
      "workspace_reference",
      "operational"
    );
  }

  for (const object of context.objects) {
    const objectNode = addNode(nodes, "object", object.objectId, object.label);
    addEdge(
      edges,
      rootNodeId,
      objectNode,
      "outgoing",
      0.6 + boost,
      "object_reference",
      "business"
    );
  }

  for (const relationship of context.relationships) {
    const relationshipNode = addNode(
      nodes,
      "relationship",
      relationship.relationshipId,
      `${relationship.sourceId}->${relationship.targetId}`
    );
    addEdge(
      edges,
      rootNodeId,
      relationshipNode,
      "outgoing",
      0.55 + boost,
      "relationship_reference",
      "operational"
    );
    if (nodes.has(nodeId("object", relationship.sourceId))) {
      addEdge(
        edges,
        relationshipNode,
        nodeId("object", relationship.sourceId),
        "outgoing",
        0.5,
        "shared_reference",
        "operational"
      );
    }
    if (nodes.has(nodeId("object", relationship.targetId))) {
      addEdge(
        edges,
        relationshipNode,
        nodeId("object", relationship.targetId),
        "outgoing",
        0.5,
        "shared_reference",
        "operational"
      );
    }
  }

  for (const kpi of context.kpis) {
    const kpiNode = addNode(nodes, "kpi", kpi.kpiId, kpi.label);
    addEdge(
      edges,
      rootNodeId,
      kpiNode,
      "outgoing",
      0.65 + boost,
      "kpi_reference",
      "financial"
    );
  }

  for (const risk of context.risks) {
    const riskNode = addNode(nodes, "risk", risk.riskId, risk.label);
    addEdge(
      edges,
      rootNodeId,
      riskNode,
      "outgoing",
      0.7 + boost,
      "risk_reference",
      "risk"
    );
  }

  if (context.executiveTimeReference) {
    const timeNode = addNode(
      nodes,
      "executive_time",
      context.executiveTimeReference.contextKey,
      `Executive Time ${context.executiveTimeReference.contextKey}`
    );
    addEdge(
      edges,
      rootNodeId,
      timeNode,
      "outgoing",
      0.6 + boost,
      "executive_time_reference",
      "executive_time"
    );
  }

  if (context.timelineReference) {
    const timelineNode = addNode(
      nodes,
      "timeline",
      context.timelineReference.timelineId,
      `Timeline ${context.timelineReference.timelineId}`
    );
    addEdge(
      edges,
      rootNodeId,
      timelineNode,
      "outgoing",
      0.6 + boost,
      "timeline_reference",
      "timeline"
    );
  }

  for (const decision of context.decisionReferences) {
    const decisionNode = addNode(
      nodes,
      "decision",
      decision.journalEntryId,
      `Decision ${decision.journalEntryId}`
    );
    addEdge(
      edges,
      rootNodeId,
      decisionNode,
      "outgoing",
      0.55 + boost,
      "decision_reference",
      "decision"
    );
  }

  for (const simulation of context.simulationReferences) {
    const simulationNode = addNode(
      nodes,
      "simulation",
      simulation.simulationId,
      simulation.label
    );
    addEdge(
      edges,
      rootNodeId,
      simulationNode,
      "outgoing",
      0.6 + boost,
      "simulation_reference",
      "simulation"
    );
    if (["active", "running", "in_progress"].includes(simulation.status.toLowerCase())) {
      addEdge(
        edges,
        simulationNode,
        rootNodeId,
        "incoming",
        0.65,
        "simulation_reference",
        "simulation"
      );
    }
  }

  for (const compare of context.compareReferences) {
    const compareNode = addNode(nodes, "compare", compare.compareId, `Compare ${compare.compareId}`);
    addEdge(
      edges,
      rootNodeId,
      compareNode,
      "outgoing",
      0.6 + boost,
      "compare_reference",
      "strategic"
    );

    if (compare.baselineScenarioId === context.scenarioId) {
      const relatedNode = addNode(
        nodes,
        "related_scenario",
        compare.candidateScenarioId,
        `Related ${compare.candidateScenarioId}`
      );
      addEdge(
        edges,
        relatedNode,
        rootNodeId,
        "incoming",
        0.7,
        "related_scenario_reference",
        "strategic"
      );
      addEdge(
        edges,
        compareNode,
        relatedNode,
        "outgoing",
        0.55,
        "compare_reference",
        "strategic"
      );
    }

    if (compare.candidateScenarioId === context.scenarioId) {
      const relatedNode = addNode(
        nodes,
        "related_scenario",
        compare.baselineScenarioId,
        `Related ${compare.baselineScenarioId}`
      );
      addEdge(
        edges,
        rootNodeId,
        relatedNode,
        "outgoing",
        0.7,
        "related_scenario_reference",
        "strategic"
      );
      addEdge(
        edges,
        compareNode,
        relatedNode,
        "outgoing",
        0.55,
        "compare_reference",
        "strategic"
      );
    }
  }

  for (const dataSource of context.dataSources) {
    const dataSourceNode = addNode(
      nodes,
      "data_source",
      dataSource.dataSourceId,
      dataSource.label
    );
    addEdge(
      edges,
      rootNodeId,
      dataSourceNode,
      "outgoing",
      0.5 + boost,
      "data_source_reference",
      "resource"
    );
  }

  const frozenEdges = Object.freeze([...edges]);
  const frozenNodes = Object.freeze([...nodes.values()].sort((a, b) => a.nodeId.localeCompare(b.nodeId)));
  const diagnostics = Object.freeze(
    collectDiagnostics(context, priority, frozenNodes, frozenEdges, generatedAt)
  );

  const incomingDependencies = Object.freeze(
    frozenEdges.filter((edge) => edge.direction === "incoming")
  );
  const outgoingDependencies = Object.freeze(
    frozenEdges.filter((edge) => edge.direction === "outgoing")
  );

  const criticalDependencies = Object.freeze(
    frozenEdges.filter(
      (edge) =>
        edge.strength >= SCENARIO_DEPENDENCY_CRITICAL_STRENGTH_THRESHOLD ||
        edge.reasonCode === "risk_reference" ||
        edge.reasonCode === "priority_elevated"
    )
  );

  const edgeCountByNode = new Map<string, number>();
  for (const edge of frozenEdges) {
    edgeCountByNode.set(edge.source, (edgeCountByNode.get(edge.source) ?? 0) + 1);
    edgeCountByNode.set(edge.target, (edgeCountByNode.get(edge.target) ?? 0) + 1);
  }

  const isolatedDependencies = Object.freeze(
    frozenNodes.filter(
      (node) =>
        node.kind !== "scenario" &&
        (edgeCountByNode.get(node.nodeId) ?? 0) <= 1
    )
  );

  const refCount = new Map<string, number>();
  for (const node of frozenNodes) {
    refCount.set(node.refId, (refCount.get(node.refId) ?? 0) + 1);
  }
  const sharedDependencies = Object.freeze(
    frozenNodes.filter((node) => (refCount.get(node.refId) ?? 0) > 1 || node.kind === "relationship")
  );

  return createScenarioDependencyGraph({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    dependencyNodes: frozenNodes,
    dependencyEdges: frozenEdges,
    incomingDependencies,
    outgoingDependencies,
    criticalDependencies,
    isolatedDependencies,
    sharedDependencies,
    dependencyDiagnostics: diagnostics,
    generatedAt,
  });
}
