/**
 * APP-2:7 — Executive Scenario Opportunity Graph definitions.
 * Opportunity vocabulary and categories — no ranking or execution logic.
 */

export const EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION = "APP-2/7" as const;

export type ExecutiveScenarioOpportunityNodeKind =
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
  | "conflict"
  | "decision"
  | "simulation"
  | "related_scenario"
  | "data_source";

export type ExecutiveScenarioOpportunityCategory =
  | "strategic"
  | "financial"
  | "operational"
  | "resource"
  | "market"
  | "customer"
  | "innovation"
  | "process"
  | "timeline"
  | "executive_time"
  | "dependency"
  | "conflict_resolution"
  | "decision"
  | "simulation"
  | "custom";

export type ExecutiveScenarioOpportunityValue = "low" | "moderate" | "high" | "strategic";

export type ExecutiveScenarioOpportunityReasonCode =
  | "healthy_state"
  | "priority_alignment"
  | "dependency_strength"
  | "conflict_mitigation"
  | "kpi_improvement"
  | "risk_reduction"
  | "relationship_leverage"
  | "resource_availability"
  | "timeline_window"
  | "executive_time_alignment"
  | "simulation_insight"
  | "compare_advantage"
  | "decision_opening"
  | "market_expansion"
  | "process_optimization";

export const EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES = Object.freeze([
  "strategic",
  "financial",
  "operational",
  "resource",
  "market",
  "customer",
  "innovation",
  "process",
  "timeline",
  "executive_time",
  "dependency",
  "conflict_resolution",
  "decision",
  "simulation",
  "custom",
] as const satisfies readonly ExecutiveScenarioOpportunityCategory[]);

export const EXECUTIVE_SCENARIO_OPPORTUNITY_NODE_KINDS = Object.freeze([
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
  "conflict",
  "decision",
  "simulation",
  "related_scenario",
  "data_source",
] as const satisfies readonly ExecutiveScenarioOpportunityNodeKind[]);

export const EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORY_BY_KIND: Readonly<
  Record<ExecutiveScenarioOpportunityNodeKind, ExecutiveScenarioOpportunityCategory>
> = Object.freeze({
  scenario: "strategic",
  goal: "strategic",
  kpi: "financial",
  risk: "operational",
  object: "operational",
  relationship: "process",
  resource: "resource",
  executive_time: "executive_time",
  timeline: "timeline",
  dependency: "dependency",
  conflict: "conflict_resolution",
  decision: "decision",
  simulation: "simulation",
  related_scenario: "market",
  data_source: "resource",
});

export const EXECUTIVE_SCENARIO_OPPORTUNITY_HIGH_VALUE_THRESHOLD = 0.7 as const;
export const EXECUTIVE_SCENARIO_OPPORTUNITY_QUICK_WIN_THRESHOLD = 0.55 as const;

export function isExecutiveScenarioOpportunityCategory(
  value: string
): value is ExecutiveScenarioOpportunityCategory {
  return (EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES as readonly string[]).includes(value);
}

export function isExecutiveScenarioOpportunityNodeKind(
  value: string
): value is ExecutiveScenarioOpportunityNodeKind {
  return (EXECUTIVE_SCENARIO_OPPORTUNITY_NODE_KINDS as readonly string[]).includes(value);
}
