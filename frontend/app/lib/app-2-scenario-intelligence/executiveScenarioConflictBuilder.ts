/**
 * APP-2:6 — Executive Scenario Conflict Builder.
 * Pure deterministic conflict detection — no resolution or side effects.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import {
  EXECUTIVE_SCENARIO_CONFLICT_CATEGORY_BY_KIND,
  EXECUTIVE_SCENARIO_CONFLICT_CRITICAL_SEVERITIES,
  type ExecutiveScenarioConflictReasonCode,
  type ExecutiveScenarioConflictSeverity,
} from "./executiveScenarioConflictGraph.ts";
import {
  createExecutiveScenarioConflictDiagnostic,
  type ExecutiveScenarioConflictDiagnostic,
} from "./executiveScenarioConflictDiagnostics.ts";
import type {
  ExecutiveScenarioConflictBuildInput,
  ExecutiveScenarioConflictCluster,
  ExecutiveScenarioConflictEdge,
  ExecutiveScenarioConflictEvidence,
  ExecutiveScenarioConflictGraph,
  ExecutiveScenarioConflictNode,
} from "./executiveScenarioConflictResult.ts";
import {
  createExecutiveScenarioConflictCluster,
  createExecutiveScenarioConflictEdge,
  createExecutiveScenarioConflictEvidence,
  createExecutiveScenarioConflictGraph,
  createExecutiveScenarioConflictNode,
} from "./executiveScenarioConflictResult.ts";

function conflictNodeId(kind: string, refId: string): string {
  return `conflict:${kind}:${refId}`;
}

function conflictEdgeId(source: string, target: string, reason: string): string {
  return `conflict-edge:${source}->${target}:${reason}`;
}

function addConflictNode(
  nodes: Map<string, ExecutiveScenarioConflictNode>,
  kind: ExecutiveScenarioConflictNode["kind"],
  refId: string,
  label: string,
  severity: ExecutiveScenarioConflictSeverity
): string {
  const id = conflictNodeId(kind, refId);
  if (!nodes.has(id)) {
    nodes.set(
      id,
      createExecutiveScenarioConflictNode({
        conflictNodeId: id,
        kind,
        refId,
        label,
        category: EXECUTIVE_SCENARIO_CONFLICT_CATEGORY_BY_KIND[kind],
        severity,
      })
    );
  }
  return id;
}

function addConflictEdge(
  edges: ExecutiveScenarioConflictEdge[],
  sourceConflictNodeId: string,
  targetRefId: string,
  category: ExecutiveScenarioConflictEdge["category"],
  reasonCode: ExecutiveScenarioConflictReasonCode,
  propagationStrength: number
): void {
  edges.push(
    createExecutiveScenarioConflictEdge({
      conflictEdgeId: conflictEdgeId(sourceConflictNodeId, targetRefId, reasonCode),
      sourceConflictNodeId,
      targetRefId,
      category,
      reasonCode,
      propagationStrength: Math.min(1, Math.max(0.1, Math.round(propagationStrength * 100) / 100)),
    })
  );
}

function addEvidence(
  evidenceItems: ExecutiveScenarioConflictEvidence[],
  input: Omit<ExecutiveScenarioConflictEvidence, "readOnly" | "evidenceId">
): void {
  evidenceItems.push(
    createExecutiveScenarioConflictEvidence({
      evidenceId: `evidence:${input.originatingEntity}:${input.affectedEntity}:${input.reasonCode}`,
      ...input,
    })
  );
}

function buildClusters(
  nodes: readonly ExecutiveScenarioConflictNode[]
): ExecutiveScenarioConflictCluster[] {
  const byCategory = new Map<string, string[]>();
  for (const node of nodes) {
    const list = byCategory.get(node.category) ?? [];
    list.push(node.conflictNodeId);
    byCategory.set(node.category, list);
  }
  return [...byCategory.entries()].map(([category, conflictNodeIds]) =>
    createExecutiveScenarioConflictCluster({
      clusterId: `cluster:${category}`,
      category: category as ExecutiveScenarioConflictCluster["category"],
      conflictNodeIds: Object.freeze([...conflictNodeIds].sort()),
      label: `${category} conflict cluster`,
    })
  );
}

function collectDiagnostics(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  nodes: readonly ExecutiveScenarioConflictNode[],
  edges: readonly ExecutiveScenarioConflictEdge[],
  evidence: readonly ExecutiveScenarioConflictEvidence[],
  generatedAt: string
): ExecutiveScenarioConflictDiagnostic[] {
  const diagnostics: ExecutiveScenarioConflictDiagnostic[] = [];

  if (!context.identity) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "missing_context",
        "Scenario identity is unavailable for conflict detection.",
        generatedAt
      )
    );
  }

  if (priority.priorityLevel === "none") {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "missing_priority",
        "Executive priority is unavailable for conflict detection.",
        generatedAt
      )
    );
  }

  if (dependencyGraph.dependencyNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "missing_dependency_graph",
        "Dependency graph is empty for conflict detection.",
        generatedAt
      )
    );
  }

  if (
    context.scenarioId !== dependencyGraph.scenarioId ||
    context.scenarioId !== priority.scenarioId
  ) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "broken_reference",
        "Certified input identity mismatch.",
        generatedAt
      )
    );
  }

  const circular = dependencyGraph.dependencyDiagnostics.filter(
    (entry) => entry.code === "circular_dependency"
  );
  for (const entry of circular) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "circular_conflict",
        "Circular dependency propagated to conflict graph.",
        generatedAt,
        entry.metadata
      )
    );
  }

  if (evidence.length === 0 && nodes.length > 0) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "missing_evidence",
        "Conflict nodes detected without supporting evidence.",
        generatedAt
      )
    );
  }

  if (nodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "incomplete_graph",
        "No conflicts detected in executive conflict graph.",
        generatedAt
      )
    );
  }

  if (edges.some((edge) => !edge.sourceConflictNodeId || !edge.targetRefId)) {
    diagnostics.push(
      createExecutiveScenarioConflictDiagnostic(
        "invalid_conflict_edge",
        "Conflict edge references are incomplete.",
        generatedAt
      )
    );
  }

  return diagnostics;
}

export function buildExecutiveScenarioConflictGraph(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  input: ExecutiveScenarioConflictBuildInput
): ExecutiveScenarioConflictGraph {
  const generatedAt = input.generatedAt;
  const nodes = new Map<string, ExecutiveScenarioConflictNode>();
  const edges: ExecutiveScenarioConflictEdge[] = [];
  const evidenceItems: ExecutiveScenarioConflictEvidence[] = [];
  const scenarioRef = context.scenarioId;

  addConflictNode(nodes, "scenario", scenarioRef, "Scenario root", "moderate");

  if (context.state?.isBlocked || context.state?.currentState === "blocked") {
    const nodeId = addConflictNode(
      nodes,
      "scenario",
      `${scenarioRef}:blocked`,
      "Blocked scenario state",
      "critical"
    );
    addConflictEdge(edges, nodeId, scenarioRef, "operational", "state_blocked", 0.9);
    addEvidence(evidenceItems, {
      originatingEntity: scenarioRef,
      affectedEntity: scenarioRef,
      reasonCode: "state_blocked",
      summary: "Scenario state is blocked.",
      dependencyRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  if (context.state?.currentState === "critical") {
    const nodeId = addConflictNode(
      nodes,
      "scenario",
      `${scenarioRef}:critical`,
      "Critical scenario state",
      "critical"
    );
    addConflictEdge(edges, nodeId, scenarioRef, "operational", "state_critical", 0.95);
    addEvidence(evidenceItems, {
      originatingEntity: scenarioRef,
      affectedEntity: scenarioRef,
      reasonCode: "state_critical",
      summary: "Scenario health state is critical.",
      dependencyRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  if (EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK[priority.priorityLevel] >= 3) {
    const nodeId = addConflictNode(
      nodes,
      "goal",
      `${scenarioRef}:priority`,
      "Elevated executive priority",
      priority.priorityLevel === "critical" ? "critical" : "high"
    );
    addConflictEdge(edges, nodeId, scenarioRef, "strategic", "priority_elevated", 0.75);
    addEvidence(evidenceItems, {
      originatingEntity: scenarioRef,
      affectedEntity: scenarioRef,
      reasonCode: "priority_elevated",
      summary: `Executive priority level is ${priority.priorityLevel}.`,
      dependencyRef: null,
      supportingKpi: context.kpis[0]?.kpiId ?? null,
      supportingRisk: context.risks[0]?.riskId ?? null,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  for (const diagnostic of dependencyGraph.dependencyDiagnostics) {
    if (diagnostic.code === "circular_dependency") {
      const nodeId = addConflictNode(
        nodes,
        "dependency",
        `${scenarioRef}:circular`,
        "Circular dependency conflict",
        "high"
      );
      addConflictEdge(edges, nodeId, scenarioRef, "dependency", "dependency_circular", 0.85);
      addEvidence(evidenceItems, {
        originatingEntity: scenarioRef,
        affectedEntity: scenarioRef,
        reasonCode: "dependency_circular",
        summary: "Circular dependency detected in dependency graph.",
        dependencyRef: diagnostic.metadata.cycle ? String(diagnostic.metadata.cycle) : null,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const dep of dependencyGraph.criticalDependencies) {
    const nodeId = addConflictNode(
      nodes,
      "dependency",
      dep.edgeId,
      `Critical dependency ${dep.reasonCode}`,
      "high"
    );
    addConflictEdge(edges, nodeId, dep.target, "dependency", "dependency_critical", dep.strength);
    addEvidence(evidenceItems, {
      originatingEntity: dep.source,
      affectedEntity: dep.target,
      reasonCode: "dependency_critical",
      summary: `Critical dependency edge ${dep.edgeId}.`,
      dependencyRef: dep.edgeId,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  if (context.kpis.length > 0 && context.risks.length > 0) {
    const nodeId = addConflictNode(
      nodes,
      "kpi",
      `${context.kpis[0]!.kpiId}:tension`,
      "KPI and risk tension",
      "moderate"
    );
    addConflictEdge(
      edges,
      nodeId,
      context.risks[0]!.riskId,
      "kpi",
      "kpi_risk_tension",
      0.7
    );
    addEvidence(evidenceItems, {
      originatingEntity: context.kpis[0]!.kpiId,
      affectedEntity: context.risks[0]!.riskId,
      reasonCode: "kpi_risk_tension",
      summary: "KPI targets conflict with active risk exposure.",
      dependencyRef: null,
      supportingKpi: context.kpis[0]!.kpiId,
      supportingRisk: context.risks[0]!.riskId,
      supportingTimeline: context.timelineReference?.timelineId ?? null,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  for (const risk of context.risks) {
    const nodeId = addConflictNode(nodes, "risk", risk.riskId, risk.label, "high");
    addConflictEdge(edges, nodeId, scenarioRef, "risk", "kpi_risk_tension", 0.65);
    addEvidence(evidenceItems, {
      originatingEntity: risk.riskId,
      affectedEntity: scenarioRef,
      reasonCode: "kpi_risk_tension",
      summary: `Risk ${risk.label} affects scenario.`,
      dependencyRef: null,
      supportingKpi: context.kpis[0]?.kpiId ?? null,
      supportingRisk: risk.riskId,
      supportingTimeline: null,
      supportingExecutiveTime: null,
    });
  }

  if (context.timelineReference && context.state?.lifecycle === "waiting") {
    const nodeId = addConflictNode(
      nodes,
      "timeline",
      context.timelineReference.timelineId,
      "Timeline pressure",
      "moderate"
    );
    addConflictEdge(
      edges,
      nodeId,
      scenarioRef,
      "timeline",
      "timeline_pressure",
      0.6
    );
    addEvidence(evidenceItems, {
      originatingEntity: context.timelineReference.timelineId,
      affectedEntity: scenarioRef,
      reasonCode: "timeline_pressure",
      summary: "Scenario waiting state creates timeline pressure.",
      dependencyRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: context.timelineReference.timelineId,
      supportingExecutiveTime: context.executiveTimeReference?.contextKey ?? null,
    });
  }

  if (context.executiveTimeReference && !context.timelineReference) {
    const nodeId = addConflictNode(
      nodes,
      "executive_time",
      context.executiveTimeReference.contextKey,
      "Executive Time without timeline anchor",
      "low"
    );
    addConflictEdge(
      edges,
      nodeId,
      scenarioRef,
      "executive_time",
      "executive_time_mismatch",
      0.5
    );
    addEvidence(evidenceItems, {
      originatingEntity: context.executiveTimeReference.contextKey,
      affectedEntity: scenarioRef,
      reasonCode: "executive_time_mismatch",
      summary: "Executive Time reference lacks timeline anchor.",
      dependencyRef: null,
      supportingKpi: null,
      supportingRisk: null,
      supportingTimeline: null,
      supportingExecutiveTime: context.executiveTimeReference.contextKey,
    });
  }

  for (const simulation of context.simulationReferences) {
    if (["active", "running", "in_progress"].includes(simulation.status.toLowerCase())) {
      const nodeId = addConflictNode(
        nodes,
        "simulation",
        simulation.simulationId,
        simulation.label,
        "moderate"
      );
      addConflictEdge(edges, nodeId, scenarioRef, "simulation", "simulation_active", 0.65);
      addEvidence(evidenceItems, {
        originatingEntity: simulation.simulationId,
        affectedEntity: scenarioRef,
        reasonCode: "simulation_active",
        summary: `Active simulation ${simulation.label}.`,
        dependencyRef: simulation.simulationId,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const compare of context.compareReferences) {
    if (compare.candidateScenarioId !== context.scenarioId) {
      const nodeId = addConflictNode(
        nodes,
        "related_scenario",
        compare.candidateScenarioId,
        `Compare divergence ${compare.compareId}`,
        "moderate"
      );
      addConflictEdge(edges, nodeId, scenarioRef, "strategic", "compare_divergence", 0.6);
      addEvidence(evidenceItems, {
        originatingEntity: compare.candidateScenarioId,
        affectedEntity: scenarioRef,
        reasonCode: "compare_divergence",
        summary: `Compare reference ${compare.compareId} indicates scenario divergence.`,
        dependencyRef: compare.compareId,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const relationship of context.relationships) {
    if (dependencyGraph.sharedDependencies.some((node) => node.refId === relationship.relationshipId)) {
      const nodeId = addConflictNode(
        nodes,
        "relationship",
        relationship.relationshipId,
        `${relationship.sourceId}->${relationship.targetId}`,
        "moderate"
      );
      addConflictEdge(
        edges,
        nodeId,
        relationship.targetId,
        "operational",
        "relationship_contention",
        0.55
      );
      addEvidence(evidenceItems, {
        originatingEntity: relationship.sourceId,
        affectedEntity: relationship.targetId,
        reasonCode: "relationship_contention",
        summary: "Shared relationship dependency creates contention.",
        dependencyRef: relationship.relationshipId,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const dataSource of context.dataSources) {
    if (dependencyGraph.isolatedDependencies.some((node) => node.refId === dataSource.dataSourceId)) {
      const nodeId = addConflictNode(
        nodes,
        "resource",
        dataSource.dataSourceId,
        dataSource.label,
        "low"
      );
      addConflictEdge(edges, nodeId, scenarioRef, "resource", "resource_contention", 0.45);
      addEvidence(evidenceItems, {
        originatingEntity: dataSource.dataSourceId,
        affectedEntity: scenarioRef,
        reasonCode: "resource_contention",
        summary: `Isolated resource ${dataSource.label}.`,
        dependencyRef: dataSource.dataSourceId,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  for (const decision of context.decisionReferences) {
    if (!decision.decisionId) {
      const nodeId = addConflictNode(
        nodes,
        "decision",
        decision.journalEntryId,
        "Pending decision reference",
        "moderate"
      );
      addConflictEdge(edges, nodeId, scenarioRef, "decision", "decision_pending", 0.55);
      addEvidence(evidenceItems, {
        originatingEntity: decision.journalEntryId,
        affectedEntity: scenarioRef,
        reasonCode: "decision_pending",
        summary: "Decision journal entry lacks resolved decision ID.",
        dependencyRef: decision.journalEntryId,
        supportingKpi: null,
        supportingRisk: null,
        supportingTimeline: null,
        supportingExecutiveTime: null,
      });
    }
  }

  const frozenNodes = Object.freeze(
    [...nodes.values()].sort((a, b) => a.conflictNodeId.localeCompare(b.conflictNodeId))
  );
  const frozenEdges = Object.freeze([...edges]);
  const frozenEvidence = Object.freeze([...evidenceItems]);

  const diagnostics = Object.freeze(
    collectDiagnostics(context, priority, dependencyGraph, frozenNodes, frozenEdges, frozenEvidence, generatedAt)
  );

  const criticalConflicts = Object.freeze(
    frozenNodes.filter((node) =>
      (EXECUTIVE_SCENARIO_CONFLICT_CRITICAL_SEVERITIES as readonly string[]).includes(node.severity)
    )
  );

  const blockedConflicts = Object.freeze(
    frozenNodes.filter(
      (node) =>
        node.label.includes("Blocked") ||
        frozenEdges.some(
          (edge) =>
            edge.sourceConflictNodeId === node.conflictNodeId && edge.reasonCode === "state_blocked"
        )
    )
  );

  const resolvedConflicts = Object.freeze(
    context.state?.lifecycle === "completed" || context.state?.lifecycle === "archived"
      ? frozenNodes.filter((node) => node.severity === "low")
      : []
  );

  const conflictCategories = Object.freeze(
    [...new Set(frozenNodes.map((node) => node.category))].sort()
  );

  const clusters = Object.freeze(buildClusters(frozenNodes));

  return createExecutiveScenarioConflictGraph({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    conflictNodes: frozenNodes,
    conflictEdges: frozenEdges,
    conflictClusters: clusters,
    criticalConflicts,
    blockedConflicts,
    resolvedConflicts,
    conflictCategories,
    supportingEvidence: frozenEvidence,
    diagnostics,
    generatedAt,
  });
}
