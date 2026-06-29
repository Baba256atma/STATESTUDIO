/**
 * APP-2:4 — Executive Scenario Priority Resolver.
 * Read-only ScenarioContext consumption and workspace validation.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { evaluateExecutiveScenarioPriority } from "./executiveScenarioPriorityEvaluator.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ExecutiveScenarioPriorityEvaluationInput } from "./executiveScenarioPriorityResult.ts";
import {
  createExecutiveScenarioPriorityDiagnostic,
} from "./executiveScenarioPriorityDiagnostics.ts";
import { createExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";

export type ExecutiveScenarioPriorityResolveRequest = Readonly<{
  context: ScenarioContext;
  evaluatedAt: string;
  workspaceId?: string;
}>;

export function validateScenarioContextForPriority(
  context: ScenarioContext,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!context.readOnly) {
    return Object.freeze({ valid: false, message: "ScenarioContext must be read-only." });
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  if (context.engineVersion !== "APP-2/3") {
    return Object.freeze({ valid: false, message: "ScenarioContext engine version mismatch." });
  }
  return Object.freeze({ valid: true, message: "ScenarioContext is valid for priority evaluation." });
}

export function normalizeExecutiveScenarioPriorityRequest(
  request: ExecutiveScenarioPriorityResolveRequest
): ExecutiveScenarioPriorityEvaluationInput {
  return Object.freeze({
    contextGeneratedAt: request.context.generatedAt,
    evaluatedAt: request.evaluatedAt,
  });
}

export function resolveExecutiveScenarioPriority(
  request: ExecutiveScenarioPriorityResolveRequest
): ExecutiveScenarioPriority {
  const validation = validateScenarioContextForPriority(request.context, request.workspaceId);
  if (!validation.valid) {
    return createExecutiveScenarioPriority({
      scenarioId: request.context.scenarioId,
      workspaceId: request.context.workspaceId,
      priorityLevel: "none",
      priorityReasonCodes: Object.freeze(["invalid_priority"]),
      priorityFactors: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: Object.freeze([
        createExecutiveScenarioPriorityDiagnostic(
          "invalid_priority",
          validation.message,
          request.evaluatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ]),
      generatedAt: request.evaluatedAt,
    });
  }

  return evaluateExecutiveScenarioPriority(
    request.context,
    normalizeExecutiveScenarioPriorityRequest(request)
  );
}

export function resolveExecutiveScenarioPriorityProbeExample(
  evaluatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioPriority {
  const context = resolveScenarioContextProbeExample(evaluatedAt);
  return resolveExecutiveScenarioPriority(
    Object.freeze({
      context,
      evaluatedAt,
    })
  );
}
