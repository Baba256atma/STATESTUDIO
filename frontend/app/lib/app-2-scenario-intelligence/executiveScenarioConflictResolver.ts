/**
 * APP-2:6 — Executive Scenario Conflict Resolver.
 * Read-only consumption of certified ScenarioContext, Priority, and DependencyGraph.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";
import { buildExecutiveScenarioConflictGraph } from "./executiveScenarioConflictBuilder.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import { createExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import { createExecutiveScenarioConflictDiagnostic } from "./executiveScenarioConflictDiagnostics.ts";

export type ExecutiveScenarioConflictResolveRequest = Readonly<{
  context: ScenarioContext;
  priority: ExecutiveScenarioPriority;
  dependencyGraph: ScenarioDependencyGraph;
  generatedAt: string;
  workspaceId?: string;
}>;

export function validateExecutiveScenarioConflictInputs(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!context.readOnly) {
    return Object.freeze({ valid: false, message: "ScenarioContext must be read-only." });
  }
  if (!priority.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPriority must be read-only." });
  }
  if (!dependencyGraph.readOnly) {
    return Object.freeze({ valid: false, message: "ScenarioDependencyGraph must be read-only." });
  }
  if (context.engineVersion !== "APP-2/3") {
    return Object.freeze({ valid: false, message: "ScenarioContext engine version mismatch." });
  }
  if (priority.engineVersion !== "APP-2/4") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPriority engine version mismatch." });
  }
  if (dependencyGraph.engineVersion !== "APP-2/5") {
    return Object.freeze({ valid: false, message: "ScenarioDependencyGraph engine version mismatch." });
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  if (
    context.scenarioId !== priority.scenarioId ||
    context.scenarioId !== dependencyGraph.scenarioId
  ) {
    return Object.freeze({ valid: false, message: "Certified input scenario ID mismatch." });
  }
  if (
    context.workspaceId !== priority.workspaceId ||
    context.workspaceId !== dependencyGraph.workspaceId
  ) {
    return Object.freeze({ valid: false, message: "Certified input workspace ID mismatch." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for conflict graph construction." });
}

export function resolveExecutiveScenarioConflictGraph(
  request: ExecutiveScenarioConflictResolveRequest
): ExecutiveScenarioConflictGraph {
  const validation = validateExecutiveScenarioConflictInputs(
    request.context,
    request.priority,
    request.dependencyGraph,
    request.workspaceId
  );

  if (!validation.valid) {
    return createExecutiveScenarioConflictGraph({
      scenarioId: request.context.scenarioId,
      workspaceId: request.context.workspaceId,
      conflictNodes: Object.freeze([]),
      conflictEdges: Object.freeze([]),
      conflictClusters: Object.freeze([]),
      criticalConflicts: Object.freeze([]),
      blockedConflicts: Object.freeze([]),
      resolvedConflicts: Object.freeze([]),
      conflictCategories: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: Object.freeze([
        createExecutiveScenarioConflictDiagnostic(
          "invalid_conflict_edge",
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ]),
      generatedAt: request.generatedAt,
    });
  }

  return buildExecutiveScenarioConflictGraph(
    request.context,
    request.priority,
    request.dependencyGraph,
    { generatedAt: request.generatedAt }
  );
}

export function resolveExecutiveScenarioConflictGraphProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioConflictGraph {
  return resolveExecutiveScenarioConflictGraph(
    Object.freeze({
      context: resolveScenarioContextProbeExample(generatedAt),
      priority: resolveExecutiveScenarioPriorityProbeExample(generatedAt),
      dependencyGraph: resolveScenarioDependencyGraphProbeExample(generatedAt),
      generatedAt,
    })
  );
}
