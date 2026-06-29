/**
 * APP-2:8 — Executive Scenario Snapshot.
 * Immutable aggregation object — no analysis, scoring, or inference.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioMetadataRecord,
} from "./scenarioIntelligenceTypes.ts";
import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import type { ExecutiveScenarioSnapshotDiagnostic } from "./executiveScenarioSummaryDiagnostics.ts";

export const EXECUTIVE_SCENARIO_SNAPSHOT_VERSION = "APP-2/8" as const;

export type ExecutiveScenarioSnapshot = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  context: ScenarioContext;
  state: ScenarioStateResult | null;
  priority: ExecutiveScenarioPriority;
  dependencyGraph: ScenarioDependencyGraph;
  conflictGraph: ExecutiveScenarioConflictGraph;
  opportunityGraph: ExecutiveScenarioOpportunityGraph;
  metadata: ScenarioMetadataRecord | null;
  diagnostics: readonly ExecutiveScenarioSnapshotDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_SCENARIO_SNAPSHOT_VERSION;
}>;

export type ExecutiveScenarioSnapshotBuildRequest = Readonly<{
  context: ScenarioContext;
  priority: ExecutiveScenarioPriority;
  dependencyGraph: ScenarioDependencyGraph;
  conflictGraph: ExecutiveScenarioConflictGraph;
  opportunityGraph: ExecutiveScenarioOpportunityGraph;
  generatedAt: string;
  workspaceId?: string;
}>;

export function createExecutiveScenarioSnapshot(
  input: Omit<ExecutiveScenarioSnapshot, "readOnly" | "engineVersion">
): ExecutiveScenarioSnapshot {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
  });
}
