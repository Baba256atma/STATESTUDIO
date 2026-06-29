/**
 * APP-2:7 — Executive Scenario Opportunity Builder.
 * Pure deterministic opportunity detection — no ranking or side effects.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import {
  EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORY_BY_KIND,
  EXECUTIVE_SCENARIO_OPPORTUNITY_HIGH_VALUE_THRESHOLD,
  EXECUTIVE_SCENARIO_OPPORTUNITY_QUICK_WIN_THRESHOLD,
  type ExecutiveScenarioOpportunityReasonCode,
  type ExecutiveScenarioOpportunityValue,
} from "./executiveScenarioOpportunityGraph.ts";
import {
  createExecutiveScenarioOpportunityDiagnostic,
  type ExecutiveScenarioOpportunityDiagnostic,
} from "./executiveScenarioOpportunityDiagnostics.ts";
import type {
  ExecutiveScenarioOpportunityBuildInput,
  ExecutiveScenarioOpportunityCluster,
  ExecutiveScenarioOpportunityEdge,
  ExecutiveScenarioOpportunityEvidence,
  ExecutiveScenarioOpportunityGraph,
  ExecutiveScenarioOpportunityNode,
} from "./executiveScenarioOpportunityResult.ts";
import {
  createExecutiveScenarioOpportunityCluster,
  createExecutiveScenarioOpportunityEdge,
  createExecutiveScenarioOpportunityEvidence,
  createExecutiveScenarioOpportunityGraph,
  createExecutiveScenarioOpportunityNode,
} from "./executiveScenarioOpportunityResult.ts";

const CURRENT_TIME_KEYS = Object.freeze(["now", "today"] as const);

function opportunityNodeId(kind: string, refId: string): string {
  return `opportunity:${kind}:${refId}`;
}

function opportunityEdgeId(source: string, target: string, reason: string): string {
  return `opportunity-edge:${source}->${target}:${reason}`;
}

function clampStrength(value: number): number {
  return Math.min(1, Math.max(0.1, Math.round(value * 100) / 100));
}

function addNode(
  nodes: Map<string, ExecutiveScenarioOpportunityNode>,
  kind: ExecutiveScenarioOpportunityNode["kind"],
  refId: string,
  label: string,
  value: ExecutiveScenarioOpportunityValue
): string {
  const id = opportunityNodeId(kind, refId);
  if (!nodes.has(id)) {
    nodes.set(
      id,
      createExecutiveScenarioOpportunityNode({
        opportunityNodeId: id,
        kind,
        refId,
        label,
        category: EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORY_BY_KIND[kind],
        value,
      })
    );
  }
  return id;
}

function addEdge(
  edges: ExecutiveScenarioOpportunityEdge[],
  sourceOpportunityNodeId: string,
  targetRefId: string,
  category: ExecutiveScenarioOpportunityEdge["category"],
  reasonCode: ExecutiveScenarioOpportunityReasonCode,
  strength: number
): void {
  edges.push(
    createExecutiveScenarioOpportunityEdge({
      opportunityEdgeId: opportunityEdgeId(sourceOpportunityNodeId, targetRefId, reasonCode),
      sourceOpportunityNodeId,
      targetRefId,
      category,
      reasonCode,
      strength: clampStrength(strength),
    })
  );
}

function addEvidence(
  evidenceItems: ExecutiveScenarioOpportunityEvidence[],
  input: Omit<ExecutiveScenarioOpportunityEvidence, "readOnly" | "evidenceId">
): void {
  evidenceItems.push(
    createExecutiveScenarioOpportunityEvidence({
      evidenceId: `evidence:${input.originatingEntity}:${input.affectedEntity}:${input.reasonCode}`,
      ...input,
    })
  );
}

function buildClusters(
  nodes: readonly ExecutiveScenarioOpportunityNode[]
): ExecutiveScenarioOpportunityCluster[] {
  const byCategory = new Map<string, string[]>();
  for (const node of nodes) {
    const list = byCategory.get(node.category) ?? [];
    list.push(node.opportunityNodeId);
    byCategory.set(node.category, list);
  }
  return [...byCategory.entries()].map(([category, opportunityNodeIds]) =>
    createExecutiveScenarioOpportunityCluster({
      clusterId: `cluster:${category}`,
      category: category as ExecutiveScenarioOpportunityCluster["category"],
      opportunityNodeIds: Object.freeze([...opportunityNodeIds].sort()),
      label: `${category} opportunity cluster`,
    })
  );
}

function collectDiagnostics(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
  nodes: readonly ExecutiveScenarioOpportunityNode[],
  edges: readonly ExecutiveScenarioOpportunityEdge[],
  evidence: readonly ExecutiveScenarioOpportunityEvidence[],
  generatedAt: string
): ExecutiveScenarioOpportunityDiagnostic[] {
  const diagnostics: ExecutiveScenarioOpportunityDiagnostic[] = [];

  if (!context.identity) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "missing_context",
        "Scenario identity is unavailable for opportunity detection.",
        generatedAt
      )
    );
  }

  if (priority.priorityLevel === "none") {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "missing_priority",
        "Executive priority is unavailable for opportunity detection.",
        generatedAt
      )
    );
  }

  if (dependencyGraph.dependencyNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "missing_dependency_graph",
        "Dependency graph is empty for opportunity detection.",
        generatedAt
      )
    );
  }

  if (conflictGraph.conflictNodes.length === 0 && conflictGraph.diagnostics.length === 0) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "missing_conflict_graph",
        "Conflict graph is empty for opportunity detection.",
        generatedAt
      )
    );
  }

  if (
    context.scenarioId !== priority.scenarioId ||
    context.scenarioId !== dependencyGraph.scenarioId ||
    context.scenarioId !== conflictGraph.scenarioId
  ) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "broken_reference",
        "Certified input identity mismatch.",
        generatedAt
      )
    );
  }

  if (evidence.length === 0 && nodes.length > 0) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "missing_evidence",
        "Opportunity nodes detected without supporting evidence.",
        generatedAt
      )
    );
  }

  if (nodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "incomplete_graph",
        "No opportunities detected in executive opportunity graph.",
        generatedAt
      )
    );
  }

  if (edges.some((edge) => !edge.sourceOpportunityNodeId || !edge.targetRefId)) {
    diagnostics.push(
      createExecutiveScenarioOpportunityDiagnostic(
        "invalid_opportunity_edge",
        "Opportunity edge references are incomplete.",
        generatedAt
      )
    );
  }

  return diagnostics;
}

export function buildExecutiveScenarioOpportunityGraph(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
  input: ExecutiveScenarioOpportunityBuildInput
): ExecutiveScenarioOpportunityGraph {
  const generatedAt = input.generatedAt;
  const nodes = new Map<string, ExecutiveScenarioOpportunityNode>();
  const edges: ExecutiveScenarioOpportunityEdge[] = [];
  const evidenceItems: ExecutiveScenarioOpportunityEvidence[] = [];
  const scenarioRef = context.scenarioId;
  const rootNodeId = addNode(nodes, "scenario", scenarioRef, "Scenario root", "moderate");

  if (context.state?.currentState === "healthy" || context.state?.currentState === "attention") {
    const nodeId = addNode(
      nodes,
      "goal",
      `${scenarioRef}:healthy-state`,
      "Healthy scenario state opportunity",
      "high"
    );
    addEdge(edges, nodeId, scenarioRef, "operational", "healthy_state", 0.75);
    addEvidence(evidenceItems, {
      originatingEntity: scenarioRef,
      affectedEntity: scenarioRef,
      reasonCode: "healthy_state",
      summary: `Scenario state ${context.state.currentState} enables operational opportunity.`,
      dependencyRef: null,
      conflictRef: null,
      supportingKpi: context.kpis[0]?.kpiId ?? null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  if (EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK[priority.priorityLevel] >= 2) {
    const nodeId = addNode(
      nodes,
      "goal",
      `${scenarioRef}:priority`,
      "Priority-aligned opportunity",
      priority.priorityLevel === "critical" || priority.priorityLevel === "high" ? "strategic" : "high"
    );
    addEdge(edges, nodeId, scenarioRef, "strategic", "priority_alignment", 0.7);
    addEvidence(evidenceItems, {
      originatingEntity: scenarioRef,
      affectedEntity: scenarioRef,
      reasonCode: "priority_alignment",
      summary: `Executive priority ${priority.priorityLevel} aligns with opportunity detection.`,
      dependencyRef: null,
      conflictRef: null,
      supportingKpi: context.kpis[0]?.kpiId ?? null,
      supportingRisk: context.risks[0]?.riskId ?? null,
      supportingTimeline: null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  for (const dep of dependencyGraph.criticalDependencies) {
    const nodeId = addNode(
      nodes,
      "dependency",
      dep.edgeId,
      `Dependency leverage ${dep.reasonCode}`,
      "high"
    );
    addEdge(edges, nodeId, dep.target, "dependency", "dependency_strength", dep.strength);
    addEvidence(evidenceItems, {
      originatingEntity: dep.source,
      affectedEntity: dep.target,
      reasonCode: "dependency_strength",
      summary: `Critical dependency ${dep.edgeId} presents leverage opportunity.`,
      dependencyRef: dep.edgeId,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  for (const conflict of conflictGraph.resolvedConflicts) {
    const nodeId = addNode(
      nodes,
      "conflict",
      conflict.conflictNodeId,
      `Conflict mitigation ${conflict.label}`,
      "moderate"
    );
    addEdge(edges, nodeId, scenarioRef, "conflict_resolution", "conflict_mitigation", 0.6);
    addEvidence(evidenceItems, {
      originatingEntity: conflict.refId,
      affectedEntity: scenarioRef,
      reasonCode: "conflict_mitigation",
      summary: "Resolved conflict creates mitigation opportunity.",
      dependencyRef: null,
      conflictRef: conflict.conflictNodeId,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  for (const kpi of context.kpis) {
    const hasCriticalConflict = conflictGraph.criticalConflicts.some((entry) =>
      entry.label.toLowerCase().includes("kpi")
    );
    if (!hasCriticalConflict) {
      const nodeId = addNode(nodes, "kpi", kpi.kpiId, kpi.label, "high");
      addEdge(edges, rootNodeId, kpi.kpiId, "financial", "kpi_improvement", 0.72);
      addEvidence(evidenceItems, {
        originatingEntity: kpi.kpiId,
        affectedEntity: scenarioRef,
        reasonCode: "kpi_improvement",
        summary: `KPI ${kpi.label} improvement opportunity.`,
        dependencyRef: null,
        conflictRef: null,
        supportingKpi: kpi.kpiId,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const risk of context.risks) {
    const completedSimulation = context.simulationReferences.some(
      (entry) => entry.status.toLowerCase() === "completed"
    );
    if (completedSimulation) {
      const nodeId = addNode(nodes, "risk", risk.riskId, risk.label, "moderate");
      addEdge(edges, nodeId, scenarioRef, "operational", "risk_reduction", 0.65);
      addEvidence(evidenceItems, {
        originatingEntity: risk.riskId,
        affectedEntity: scenarioRef,
        reasonCode: "risk_reduction",
        summary: `Simulation insight enables risk reduction for ${risk.label}.`,
        dependencyRef: context.simulationReferences[0]?.simulationId ?? null,
        conflictRef: null,
        supportingKpi: null,
        supportingRisk: risk.riskId,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const relationship of context.relationships) {
    const nodeId = addNode(
      nodes,
      "relationship",
      relationship.relationshipId,
      `${relationship.sourceId}->${relationship.targetId}`,
      "moderate"
    );
    addEdge(edges, nodeId, relationship.targetId, "process", "relationship_leverage", 0.58);
    addEvidence(evidenceItems, {
      originatingEntity: relationship.sourceId,
      affectedEntity: relationship.targetId,
      reasonCode: "relationship_leverage",
      summary: "Relationship leverage opportunity detected.",
      dependencyRef: relationship.relationshipId,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  if (context.executiveTimeReference) {
    const isCurrent = (CURRENT_TIME_KEYS as readonly string[]).includes(
      context.executiveTimeReference.contextKey
    );
    const nodeId = addNode(
      nodes,
      "executive_time",
      context.executiveTimeReference.contextKey,
      `Executive Time ${context.executiveTimeReference.contextKey}`,
      isCurrent ? "high" : "moderate"
    );
    addEdge(
      edges,
      nodeId,
      scenarioRef,
      "executive_time",
      "executive_time_alignment",
      isCurrent ? 0.75 : 0.55
    );
    addEvidence(evidenceItems, {
      originatingEntity: context.executiveTimeReference.contextKey,
      affectedEntity: scenarioRef,
      reasonCode: "executive_time_alignment",
      summary: "Executive Time alignment creates temporal opportunity.",
      dependencyRef: null,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference.contextKey,
    });
  }

  if (context.timelineReference && context.state?.lifecycle === "active") {
    const nodeId = addNode(
      nodes,
      "timeline",
      context.timelineReference.timelineId,
      `Timeline ${context.timelineReference.timelineId}`,
      "moderate"
    );
    addEdge(edges, nodeId, scenarioRef, "timeline", "timeline_window", 0.6);
    addEvidence(evidenceItems, {
      originatingEntity: context.timelineReference.timelineId,
      affectedEntity: scenarioRef,
      reasonCode: "timeline_window",
      summary: "Active lifecycle with timeline anchor creates opportunity window.",
      dependencyRef: null,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference.timelineId,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  for (const decision of context.decisionReferences) {
    const nodeId = addNode(
      nodes,
      "decision",
      decision.journalEntryId,
      `Decision ${decision.journalEntryId}`,
      decision.decisionId ? "moderate" : "high"
    );
    addEdge(edges, nodeId, scenarioRef, "decision", "decision_opening", 0.62);
    addEvidence(evidenceItems, {
      originatingEntity: decision.journalEntryId,
      affectedEntity: scenarioRef,
      reasonCode: "decision_opening",
      summary: "Decision journal reference opens executive opportunity.",
      dependencyRef: decision.journalEntryId,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  for (const simulation of context.simulationReferences) {
    if (simulation.status.toLowerCase() === "completed") {
      const nodeId = addNode(nodes, "simulation", simulation.simulationId, simulation.label, "high");
      addEdge(edges, nodeId, scenarioRef, "simulation", "simulation_insight", 0.68);
      addEvidence(evidenceItems, {
        originatingEntity: simulation.simulationId,
        affectedEntity: scenarioRef,
        reasonCode: "simulation_insight",
        summary: `Completed simulation ${simulation.label} provides insight opportunity.`,
        dependencyRef: simulation.simulationId,
        conflictRef: null,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const compare of context.compareReferences) {
    const nodeId = addNode(
      nodes,
      "related_scenario",
      compare.candidateScenarioId,
      `Compare advantage ${compare.compareId}`,
      "strategic"
    );
    addEdge(edges, nodeId, scenarioRef, "market", "compare_advantage", 0.7);
    addEvidence(evidenceItems, {
      originatingEntity: compare.candidateScenarioId,
      affectedEntity: scenarioRef,
      reasonCode: "compare_advantage",
      summary: `Compare reference ${compare.compareId} reveals market opportunity.`,
      dependencyRef: compare.compareId,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  for (const dataSource of context.dataSources) {
    const nodeId = addNode(nodes, "resource", dataSource.dataSourceId, dataSource.label, "moderate");
    addEdge(edges, nodeId, scenarioRef, "resource", "resource_availability", 0.52);
    addEvidence(evidenceItems, {
      originatingEntity: dataSource.dataSourceId,
      affectedEntity: scenarioRef,
      reasonCode: "resource_availability",
      summary: `Data source ${dataSource.label} availability opportunity.`,
      dependencyRef: dataSource.dataSourceId,
      conflictRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  for (const object of context.objects) {
    addNode(nodes, "object", object.objectId, object.label, "moderate");
  }

  for (const blocked of conflictGraph.blockedConflicts) {
    addNode(
      nodes,
      "conflict",
      `blocked:${blocked.conflictNodeId}`,
      `Blocked opportunity ${blocked.label}`,
      "low"
    );
  }

  const frozenNodes = Object.freeze(
    [...nodes.values()].sort((a, b) => a.opportunityNodeId.localeCompare(b.opportunityNodeId))
  );
  const frozenEdges = Object.freeze([...edges]);
  const frozenEvidence = Object.freeze([...evidenceItems]);

  const diagnostics = Object.freeze(
    collectDiagnostics(
      context,
      priority,
      dependencyGraph,
      conflictGraph,
      frozenNodes,
      frozenEdges,
      frozenEvidence,
      generatedAt
    )
  );

  const edgeStrengthByNode = new Map<string, number>();
  for (const edge of frozenEdges) {
    const current = edgeStrengthByNode.get(edge.sourceOpportunityNodeId) ?? 0;
    edgeStrengthByNode.set(edge.sourceOpportunityNodeId, Math.max(current, edge.strength));
  }

  const highValueOpportunities = Object.freeze(
    frozenNodes.filter(
      (node) =>
        node.value === "high" ||
        node.value === "strategic" ||
        (edgeStrengthByNode.get(node.opportunityNodeId) ?? 0) >=
          EXECUTIVE_SCENARIO_OPPORTUNITY_HIGH_VALUE_THRESHOLD
    )
  );

  const quickWinOpportunities = Object.freeze(
    frozenNodes.filter((node) => {
      const strength = edgeStrengthByNode.get(node.opportunityNodeId) ?? 0;
      const isCurrentTime =
        node.kind === "executive_time" &&
        (CURRENT_TIME_KEYS as readonly string[]).includes(node.refId);
      return (
        strength >= EXECUTIVE_SCENARIO_OPPORTUNITY_QUICK_WIN_THRESHOLD &&
        (isCurrentTime || node.kind === "kpi" || node.kind === "simulation")
      );
    })
  );

  const strategicOpportunities = Object.freeze(
    frozenNodes.filter(
      (node) =>
        node.category === "strategic" ||
        node.category === "market" ||
        node.value === "strategic"
    )
  );

  const blockedOpportunities = Object.freeze(
    frozenNodes.filter((node) => node.opportunityNodeId.includes("blocked:"))
  );

  const clusters = Object.freeze(buildClusters(frozenNodes));

  return createExecutiveScenarioOpportunityGraph({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    opportunityNodes: frozenNodes,
    opportunityEdges: frozenEdges,
    opportunityClusters: clusters,
    highValueOpportunities,
    quickWinOpportunities,
    strategicOpportunities,
    blockedOpportunities,
    supportingEvidence: frozenEvidence,
    diagnostics,
    generatedAt,
  });
}
