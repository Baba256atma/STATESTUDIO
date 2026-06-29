/**
 * APP-2:8 — Executive Scenario Summary result types.
 * Canonical immutable executive narrative — no UI or rendering artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummaryDiagnostic } from "./executiveScenarioSummaryDiagnostics.ts";

export const EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION = "APP-2/8" as const;

export type ExecutiveScenarioSummaryStatus = "complete" | "partial" | "incomplete";

export type ExecutiveScenarioSummaryEvidenceSource =
  | "state"
  | "priority"
  | "dependency_graph"
  | "conflict_graph"
  | "opportunity_graph"
  | "kpi"
  | "risk"
  | "timeline"
  | "executive_time";

export type ExecutiveScenarioSummaryEvidence = Readonly<{
  evidenceId: string;
  section: string;
  source: ExecutiveScenarioSummaryEvidenceSource;
  sourceRef: string;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveScenarioSummary = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  summaryStatus: ExecutiveScenarioSummaryStatus;
  executiveHeadline: string;
  situationBrief: string;
  stateSummary: string;
  prioritySummary: string;
  dependencySummary: string;
  conflictSummary: string;
  opportunitySummary: string;
  riskSummary: string;
  kpiSummary: string;
  timelineSummary: string;
  executiveHighlights: readonly string[];
  executiveConcerns: readonly string[];
  executiveStrengths: readonly string[];
  executiveWeaknesses: readonly string[];
  supportingEvidence: readonly ExecutiveScenarioSummaryEvidence[];
  diagnostics: readonly ExecutiveScenarioSummaryDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION;
}>;

export type ExecutiveScenarioSummaryResolveRequest = Readonly<{
  snapshot: import("./executiveScenarioSnapshot.ts").ExecutiveScenarioSnapshot;
  generatedAt: string;
  workspaceId?: string;
}>;

export function createExecutiveScenarioSummary(
  input: Omit<ExecutiveScenarioSummary, "readOnly" | "engineVersion">
): ExecutiveScenarioSummary {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
  });
}

export function createExecutiveScenarioSummaryEvidence(
  input: Omit<ExecutiveScenarioSummaryEvidence, "readOnly">
): ExecutiveScenarioSummaryEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}
