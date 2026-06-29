/**
 * APP-2:8 — Executive Scenario Summary Resolver.
 * Snapshot aggregation and summary resolution — read-only certified consumption.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraphProbeExample } from "./executiveScenarioConflictResolver.ts";
import { resolveExecutiveScenarioOpportunityGraphProbeExample } from "./executiveScenarioOpportunityResolver.ts";
import {
  buildExecutiveScenarioSnapshot,
} from "./executiveScenarioSnapshotBuilder.ts";
import type {
  ExecutiveScenarioSnapshot,
  ExecutiveScenarioSnapshotBuildRequest,
} from "./executiveScenarioSnapshot.ts";
import { buildExecutiveScenarioSummary } from "./executiveScenarioSummaryBuilder.ts";
import {
  createExecutiveScenarioSummary,
  type ExecutiveScenarioSummary,
  type ExecutiveScenarioSummaryResolveRequest,
} from "./executiveScenarioSummaryResult.ts";
import { createExecutiveScenarioSummaryDiagnostic } from "./executiveScenarioSummaryDiagnostics.ts";

export type {
  ExecutiveScenarioSnapshot,
  ExecutiveScenarioSnapshotBuildRequest,
  ExecutiveScenarioSummaryResolveRequest,
};

export function validateExecutiveScenarioSnapshotInputs(
  context: ScenarioContext,
  priority: ExecutiveScenarioPriority,
  dependencyGraph: ScenarioDependencyGraph,
  conflictGraph: ExecutiveScenarioConflictGraph,
  opportunityGraph: ExecutiveScenarioOpportunityGraph,
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
  if (!opportunityGraph.readOnly) {
    return Object.freeze({
      valid: false,
      message: "ExecutiveScenarioOpportunityGraph must be read-only.",
    });
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
  if (opportunityGraph.engineVersion !== "APP-2/7") {
    return Object.freeze({
      valid: false,
      message: "ExecutiveScenarioOpportunityGraph engine version mismatch.",
    });
  }
  if (workspaceId !== undefined && context.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  const scenarioId = context.scenarioId;
  if (
    scenarioId !== priority.scenarioId ||
    scenarioId !== dependencyGraph.scenarioId ||
    scenarioId !== conflictGraph.scenarioId ||
    scenarioId !== opportunityGraph.scenarioId
  ) {
    return Object.freeze({ valid: false, message: "Certified input scenario ID mismatch." });
  }
  if (
    context.workspaceId !== priority.workspaceId ||
    context.workspaceId !== dependencyGraph.workspaceId ||
    context.workspaceId !== conflictGraph.workspaceId ||
    context.workspaceId !== opportunityGraph.workspaceId
  ) {
    return Object.freeze({ valid: false, message: "Certified input workspace ID mismatch." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for snapshot construction." });
}

export function resolveExecutiveScenarioSnapshot(
  request: ExecutiveScenarioSnapshotBuildRequest
): ExecutiveScenarioSnapshot {
  return buildExecutiveScenarioSnapshot(request);
}

export function resolveExecutiveScenarioSummary(
  request: ExecutiveScenarioSummaryResolveRequest
): ExecutiveScenarioSummary {
  const { snapshot, generatedAt, workspaceId } = request;

  if (!snapshot.readOnly) {
    return createExecutiveScenarioSummary({
      scenarioId: snapshot.scenarioId,
      workspaceId: snapshot.workspaceId,
      summaryStatus: "incomplete",
      executiveHeadline: "Executive summary unavailable.",
      situationBrief: "Snapshot is not read-only.",
      stateSummary: "",
      prioritySummary: "",
      dependencySummary: "",
      conflictSummary: "",
      opportunitySummary: "",
      riskSummary: "",
      kpiSummary: "",
      timelineSummary: "",
      executiveHighlights: Object.freeze([]),
      executiveConcerns: Object.freeze([]),
      executiveStrengths: Object.freeze([]),
      executiveWeaknesses: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: Object.freeze([
        createExecutiveScenarioSummaryDiagnostic(
          "missing_snapshot",
          "ExecutiveScenarioSnapshot must be read-only.",
          generatedAt
        ),
      ]),
      generatedAt,
    });
  }

  if (workspaceId !== undefined && snapshot.workspaceId !== workspaceId.trim()) {
    return createExecutiveScenarioSummary({
      scenarioId: snapshot.scenarioId,
      workspaceId: snapshot.workspaceId,
      summaryStatus: "incomplete",
      executiveHeadline: "Executive summary unavailable.",
      situationBrief: "Workspace isolation violation.",
      stateSummary: "",
      prioritySummary: "",
      dependencySummary: "",
      conflictSummary: "",
      opportunitySummary: "",
      riskSummary: "",
      kpiSummary: "",
      timelineSummary: "",
      executiveHighlights: Object.freeze([]),
      executiveConcerns: Object.freeze([]),
      executiveStrengths: Object.freeze([]),
      executiveWeaknesses: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: Object.freeze([
        createExecutiveScenarioSummaryDiagnostic(
          "invalid_summary",
          "Workspace isolation violation.",
          generatedAt,
          Object.freeze({ workspaceId })
        ),
      ]),
      generatedAt,
    });
  }

  return buildExecutiveScenarioSummary(snapshot, { generatedAt, workspaceId });
}

export function resolveExecutiveScenarioSnapshotProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioSnapshot {
  return resolveExecutiveScenarioSnapshot(
    Object.freeze({
      context: resolveScenarioContextProbeExample(generatedAt),
      priority: resolveExecutiveScenarioPriorityProbeExample(generatedAt),
      dependencyGraph: resolveScenarioDependencyGraphProbeExample(generatedAt),
      conflictGraph: resolveExecutiveScenarioConflictGraphProbeExample(generatedAt),
      opportunityGraph: resolveExecutiveScenarioOpportunityGraphProbeExample(generatedAt),
      generatedAt,
    })
  );
}

export function resolveExecutiveScenarioSummaryProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioSummary {
  return resolveExecutiveScenarioSummary(
    Object.freeze({
      snapshot: resolveExecutiveScenarioSnapshotProbeExample(generatedAt),
      generatedAt,
    })
  );
}

export function resolveExecutiveScenarioSummaryFromCertifiedInputs(
  request: ExecutiveScenarioSnapshotBuildRequest
): ExecutiveScenarioSummary {
  const snapshot = resolveExecutiveScenarioSnapshot(request);
  return resolveExecutiveScenarioSummary(
    Object.freeze({ snapshot, generatedAt: request.generatedAt, workspaceId: request.workspaceId })
  );
}
