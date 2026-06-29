/**
 * APP-2:8 — Executive Scenario Snapshot Builder.
 * Pure aggregation of certified APP-2 outputs — no analysis or inference.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import {
  createExecutiveScenarioSnapshot,
  type ExecutiveScenarioSnapshot,
  type ExecutiveScenarioSnapshotBuildRequest,
} from "./executiveScenarioSnapshot.ts";
import {
  createExecutiveScenarioSnapshotDiagnostic,
  type ExecutiveScenarioSnapshotDiagnostic,
} from "./executiveScenarioSummaryDiagnostics.ts";

function validateCertifiedInputs(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
  opportunityGraph: ExecutiveScenarioOpportunityGraph,
  workspaceId?: string
): readonly ExecutiveScenarioSnapshotDiagnostic[] {
  const diagnostics: ExecutiveScenarioSnapshotDiagnostic[] = [];
  const timestamp = context.generatedAt;

  if (!context.readOnly || context.identity === null) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_context",
        "ScenarioContext is missing or invalid.",
        timestamp
      )
    );
  }
  if (context.state === null) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_state",
        "ScenarioStateResult is not embedded in ScenarioContext.",
        timestamp
      )
    );
  }
  if (!priority.readOnly || priority.priorityLevel === "none") {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_priority",
        "ExecutiveScenarioPriority is missing or unset.",
        timestamp
      )
    );
  }
  if (!dependencyGraph.readOnly || dependencyGraph.dependencyNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_dependency_graph",
        "ScenarioDependencyGraph is missing or empty.",
        timestamp
      )
    );
  }
  if (!conflictGraph.readOnly || conflictGraph.conflictNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_conflict_graph",
        "ExecutiveScenarioConflictGraph is missing or empty.",
        timestamp
      )
    );
  }
  if (!opportunityGraph.readOnly || opportunityGraph.opportunityNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "missing_opportunity_graph",
        "ExecutiveScenarioOpportunityGraph is missing or empty.",
        timestamp
      )
    );
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "broken_reference",
        "Workspace isolation violation.",
        timestamp,
        Object.freeze({ workspaceId })
      )
    );
  }
  const scenarioId = context.scenarioId;
  if (
    scenarioId !== priority.scenarioId ||
    scenarioId !== dependencyGraph.scenarioId ||
    scenarioId !== conflictGraph.scenarioId ||
    scenarioId !== opportunityGraph.scenarioId
  ) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "broken_reference",
        "Certified input scenario ID mismatch.",
        timestamp
      )
    );
  }
  if (
    context.workspaceId !== priority.workspaceId ||
    context.workspaceId !== dependencyGraph.workspaceId ||
    context.workspaceId !== conflictGraph.workspaceId ||
    context.workspaceId !== opportunityGraph.workspaceId
  ) {
    diagnostics.push(
      createExecutiveScenarioSnapshotDiagnostic(
        "broken_reference",
        "Certified input workspace ID mismatch.",
        timestamp
      )
    );
  }

  return Object.freeze(diagnostics);
}

export function buildExecutiveScenarioSnapshot(
  request: ExecutiveScenarioSnapshotBuildRequest
): ExecutiveScenarioSnapshot {
  const {
    context,
    priority,
    dependencyGraph,
    conflictGraph,
    opportunityGraph,
    generatedAt,
    workspaceId,
  } = request;

  const diagnostics = validateCertifiedInputs(
    context,
    priority,
    dependencyGraph,
    conflictGraph,
    opportunityGraph,
    workspaceId
  );

  return createExecutiveScenarioSnapshot({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    context,
    state: context.state,
    priority,
    dependencyGraph,
    conflictGraph,
    opportunityGraph,
    metadata: context.metadata,
    diagnostics,
    generatedAt,
  });
}

export function buildExecutiveScenarioSnapshotFromParts(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
  opportunityGraph: ExecutiveScenarioOpportunityGraph,
  options: Readonly<{ generatedAt: string; workspaceId?: string }>
): ExecutiveScenarioSnapshot {
  return buildExecutiveScenarioSnapshot(
    Object.freeze({
      context,
      priority,
      dependencyGraph,
      conflictGraph,
      opportunityGraph,
      generatedAt: options.generatedAt,
      workspaceId: options.workspaceId,
    })
  );
}
