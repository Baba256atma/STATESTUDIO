/**
 * APP-2:6 — Executive Scenario Conflict Graph definitions.
 * Conflict vocabulary and categories — no resolution logic.
 */

export const EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION = "APP-2/6" as const;

export type ExecutiveScenarioConflictNodeKind =
  | "scenario"
  | "goal"
  | "kpi"
  | "risk"
  | "object"
  | "relationship"
  | "resource"
  | "executive_time"
  | "timeline"
  | "dependency"
  | "decision"
  | "simulation"
  | "related_scenario";

export type ExecutiveScenarioConflictCategory =
  | "strategic"
  | "financial"
  | "operational"
  | "resource"
  | "timeline"
  | "executive_time"
  | "dependency"
  | "kpi"
  | "risk"
  | "decision"
  | "simulation"
  | "business_rule"
  | "custom";

export type ExecutiveScenarioConflictSeverity = "low" | "moderate" | "high" | "critical";

export type ExecutiveScenarioConflictReasonCode =
  | "state_blocked"
  | "state_critical"
  | "priority_elevated"
  | "dependency_circular"
  | "dependency_critical"
  | "kpi_risk_tension"
  | "timeline_pressure"
  | "executive_time_mismatch"
  | "simulation_active"
  | "compare_divergence"
  | "relationship_contention"
  | "resource_contention"
  | "decision_pending"
  | "missing_reference"
  | "lifecycle_terminal";

export const EXECUTIVE_SCENARIO_CONFLICT_CATEGORIES = Object.freeze([
  "strategic",
  "financial",
  "operational",
  "resource",
  "timeline",
  "executive_time",
  "dependency",
  "kpi",
  "risk",
  "decision",
  "simulation",
  "business_rule",
  "custom",
] as const satisfies readonly ExecutiveScenarioConflictCategory[]);

export const EXECUTIVE_SCENARIO_CONFLICT_NODE_KINDS = Object.freeze([
  "scenario",
  "goal",
  "kpi",
  "risk",
  "object",
  "relationship",
  "resource",
  "executive_time",
  "timeline",
  "dependency",
  "decision",
  "simulation",
  "related_scenario",
] as const satisfies readonly ExecutiveScenarioConflictNodeKind[]);

export const EXECUTIVE_SCENARIO_CONFLICT_CATEGORY_BY_KIND: Readonly<
  Record<ExecutiveScenarioConflictNodeKind, ExecutiveScenarioConflictCategory>
> = Object.freeze({
  scenario: "strategic",
  goal: "strategic",
  kpi: "kpi",
  risk: "risk",
  object: "operational",
  relationship: "operational",
  resource: "resource",
  executive_time: "executive_time",
  timeline: "timeline",
  dependency: "dependency",
  decision: "decision",
  simulation: "simulation",
  related_scenario: "strategic",
});

export const EXECUTIVE_SCENARIO_CONFLICT_CRITICAL_SEVERITIES = Object.freeze([
  "high",
  "critical",
] as const satisfies readonly ExecutiveScenarioConflictSeverity[]);

export function isExecutiveScenarioConflictCategory(
  value: string
): value is ExecutiveScenarioConflictCategory {
  return (EXECUTIVE_SCENARIO_CONFLICT_CATEGORIES as readonly string[]).includes(value);
}

export function isExecutiveScenarioConflictNodeKind(
  value: string
): value is ExecutiveScenarioConflictNodeKind {
  return (EXECUTIVE_SCENARIO_CONFLICT_NODE_KINDS as readonly string[]).includes(value);
}
