/**
 * APP-2:5 — Scenario Dependency Resolver.
 * Read-only ScenarioContext and ExecutiveScenarioPriority consumption.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { buildScenarioDependencyGraph } from "./scenarioDependencyBuilder.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import { createScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import { createScenarioDependencyDiagnostic } from "./scenarioDependencyDiagnostics.ts";

export type ScenarioDependencyResolveRequest = Readonly<{
  context: ScenarioContext;
  priority: ExecutiveScenarioPriority;
  generatedAt: string;
  workspaceId?: string;
}>;

export function validateScenarioDependencyInputs(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!context.readOnly) {
    return Object.freeze({ valid: false, message: "ScenarioContext must be read-only." });
  }
  if (!priority.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPriority must be read-only." });
  }
  if (context.engineVersion !== "APP-2/3") {
    return Object.freeze({ valid: false, message: "ScenarioContext engine version mismatch." });
  }
  if (priority.engineVersion !== "APP-2/4") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPriority engine version mismatch." });
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  if (context.scenarioId !== priority.scenarioId) {
    return Object.freeze({ valid: false, message: "ScenarioContext and priority scenario ID mismatch." });
  }
  if (context.workspaceId !== priority.workspaceId) {
    return Object.freeze({ valid: false, message: "ScenarioContext and priority workspace ID mismatch." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for dependency graph construction." });
}

export function resolveScenarioDependencyGraph(
  request: ScenarioDependencyResolveRequest
): ScenarioDependencyGraph {
  const validation = validateScenarioDependencyInputs(
    request.context,
    request.priority,
    request.workspaceId
  );

  if (!validation.valid) {
    return createScenarioDependencyGraph({
      scenarioId: request.context.scenarioId,
      workspaceId: request.context.workspaceId,
      dependencyNodes: Object.freeze([]),
      dependencyEdges: Object.freeze([]),
      incomingDependencies: Object.freeze([]),
      outgoingDependencies: Object.freeze([]),
      criticalDependencies: Object.freeze([]),
      isolatedDependencies: Object.freeze([]),
      sharedDependencies: Object.freeze([]),
      dependencyDiagnostics: Object.freeze([
        createScenarioDependencyDiagnostic(
          "invalid_edge",
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ]),
      generatedAt: request.generatedAt,
    });
  }

  return buildScenarioDependencyGraph(request.context, request.priority, {
    generatedAt: request.generatedAt,
  });
}

export function resolveScenarioDependencyGraphProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ScenarioDependencyGraph {
  const context = resolveScenarioContextProbeExample(generatedAt);
  const priority = resolveExecutiveScenarioPriorityProbeExample(generatedAt);
  return resolveScenarioDependencyGraph(
    Object.freeze({
      context,
      priority,
      generatedAt,
    })
  );
}
