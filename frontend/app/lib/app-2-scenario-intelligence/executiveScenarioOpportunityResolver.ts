/**
 * APP-2:7 — Executive Scenario Opportunity Resolver.
 * Read-only consumption of certified executive models.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraphProbeExample } from "./executiveScenarioConflictResolver.ts";
import { buildExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityBuilder.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import { createExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import { createExecutiveScenarioOpportunityDiagnostic } from "./executiveScenarioOpportunityDiagnostics.ts";

export type ExecutiveScenarioOpportunityResolveRequest = Readonly<{
  context: ScenarioContext;
  priority: ExecutiveScenarioPriority;
  dependencyGraph: ScenarioDependencyGraph;
  conflictGraph: ExecutiveScenarioConflictGraph;
  generatedAt: string;
  workspaceId?: string;
}>;

export function validateExecutiveScenarioOpportunityInputs(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
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
  if (!conflictGraph.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioConflictGraph must be read-only." });
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
  if (conflictGraph.engineVersion !== "APP-2/6") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioConflictGraph engine version mismatch." });
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  const scenarioId = context.scenarioId;
  if (
    scenarioId !== priority.scenarioId ||
    scenarioId !== dependencyGraph.scenarioId ||
    scenarioId !== conflictGraph.scenarioId
  ) {
    return Object.freeze({ valid: false, message: "Certified input scenario ID mismatch." });
  }
  if (
    context.workspaceId !== priority.workspaceId ||
    context.workspaceId !== dependencyGraph.workspaceId ||
    context.workspaceId !== conflictGraph.workspaceId
  ) {
    return Object.freeze({ valid: false, message: "Certified input workspace ID mismatch." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for opportunity graph construction." });
}

export function resolveExecutiveScenarioOpportunityGraph(
  request: ExecutiveScenarioOpportunityResolveRequest
): ExecutiveScenarioOpportunityGraph {
  const validation = validateExecutiveScenarioOpportunityInputs(
    request.context,
    request.priority,
    request.dependencyGraph,
    request.conflictGraph,
    request.workspaceId
  );

  if (!validation.valid) {
    return createExecutiveScenarioOpportunityGraph({
      scenarioId: request.context.scenarioId,
      workspaceId: request.context.workspaceId,
      opportunityNodes: Object.freeze([]),
      opportunityEdges: Object.freeze([]),
      opportunityClusters: Object.freeze([]),
      highValueOpportunities: Object.freeze([]),
      quickWinOpportunities: Object.freeze([]),
      strategicOpportunities: Object.freeze([]),
      blockedOpportunities: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: Object.freeze([
        createExecutiveScenarioOpportunityDiagnostic(
          "invalid_opportunity_edge",
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ]),
      generatedAt: request.generatedAt,
    });
  }

  return buildExecutiveScenarioOpportunityGraph(
    request.context,
    request.priority,
    request.dependencyGraph,
    request.conflictGraph,
    { generatedAt: request.generatedAt }
  );
}

export function resolveExecutiveScenarioOpportunityGraphProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioOpportunityGraph {
  return resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({
      context: resolveScenarioContextProbeExample(generatedAt),
      priority: resolveExecutiveScenarioPriorityProbeExample(generatedAt),
      dependencyGraph: resolveScenarioDependencyGraphProbeExample(generatedAt),
      conflictGraph: resolveExecutiveScenarioConflictGraphProbeExample(generatedAt),
      generatedAt,
    })
  );
}
