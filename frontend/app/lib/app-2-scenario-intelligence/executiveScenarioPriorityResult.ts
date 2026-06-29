/**
 * APP-2:4 — Executive Scenario Priority result types.
 * Canonical immutable executive priority assessment — no UI artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type { ExecutiveScenarioPriorityDiagnostic } from "./executiveScenarioPriorityDiagnostics.ts";

export const EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION = "APP-2/4" as const;

export type ExecutiveScenarioPriorityLevel = "none" | "low" | "normal" | "high" | "critical";

export type ExecutiveScenarioPriorityReasonCode =
  | "state_contribution"
  | "executive_time_contribution"
  | "timeline_contribution"
  | "risk_contribution"
  | "kpi_contribution"
  | "relationship_contribution"
  | "workspace_contribution"
  | "decision_contribution"
  | "simulation_contribution"
  | "lifecycle_contribution"
  | "incomplete_context"
  | "invalid_priority";

export type ExecutiveScenarioPriorityFactor = Readonly<{
  factorId: string;
  dimension:
    | "state"
    | "executive_time"
    | "timeline"
    | "risk"
    | "kpi"
    | "relationship"
    | "workspace"
    | "decision"
    | "simulation"
    | "lifecycle";
  weight: number;
  label: string;
  readOnly: true;
}>;

export type ExecutiveScenarioPriorityEvidence = Readonly<{
  evidenceId: string;
  dimension: ExecutiveScenarioPriorityFactor["dimension"];
  summary: string;
  sourceRef: string | null;
  readOnly: true;
}>;

export type ExecutiveScenarioPriority = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  priorityLevel: ExecutiveScenarioPriorityLevel;
  priorityReasonCodes: readonly ExecutiveScenarioPriorityReasonCode[];
  priorityFactors: readonly ExecutiveScenarioPriorityFactor[];
  supportingEvidence: readonly ExecutiveScenarioPriorityEvidence[];
  diagnostics: readonly ExecutiveScenarioPriorityDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION;
}>;

export type ExecutiveScenarioPriorityEvaluationInput = Readonly<{
  contextGeneratedAt: string;
  evaluatedAt: string;
}>;

export const EXECUTIVE_SCENARIO_PRIORITY_LEVELS = Object.freeze([
  "none",
  "low",
  "normal",
  "high",
  "critical",
] as const satisfies readonly ExecutiveScenarioPriorityLevel[]);

export const EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK: Readonly<
  Record<ExecutiveScenarioPriorityLevel, number>
> = Object.freeze({
  none: 0,
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
});

export function createExecutiveScenarioPriority(
  input: Omit<ExecutiveScenarioPriority, "readOnly" | "engineVersion">
): ExecutiveScenarioPriority {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
  });
}

export function isExecutiveScenarioPriorityLevel(
  value: string
): value is ExecutiveScenarioPriorityLevel {
  return (EXECUTIVE_SCENARIO_PRIORITY_LEVELS as readonly string[]).includes(value);
}
