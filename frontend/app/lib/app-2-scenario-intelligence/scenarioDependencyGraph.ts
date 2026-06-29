/**
 * APP-2:5 — Scenario Dependency Graph definitions.
 * Dependency vocabulary and category definitions — no optimization logic.
 */

export const SCENARIO_DEPENDENCY_GRAPH_VERSION = "APP-2/5" as const;

export type ScenarioDependencyNodeKind =
  | "scenario"
  | "workspace"
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "executive_time"
  | "timeline"
  | "decision"
  | "simulation"
  | "compare"
  | "related_scenario"
  | "data_source";

export type ScenarioDependencyCategory =
  | "business"
  | "operational"
  | "financial"
  | "strategic"
  | "resource"
  | "risk"
  | "timeline"
  | "executive_time"
  | "simulation"
  | "decision"
  | "custom";

export type ScenarioDependencyDirection = "incoming" | "outgoing";

export type ScenarioDependencyReasonCode =
  | "scenario_root"
  | "object_reference"
  | "relationship_reference"
  | "kpi_reference"
  | "risk_reference"
  | "executive_time_reference"
  | "timeline_reference"
  | "decision_reference"
  | "simulation_reference"
  | "compare_reference"
  | "related_scenario_reference"
  | "workspace_reference"
  | "data_source_reference"
  | "priority_elevated"
  | "shared_reference";

export const SCENARIO_DEPENDENCY_CATEGORIES = Object.freeze([
  "business",
  "operational",
  "financial",
  "strategic",
  "resource",
  "risk",
  "timeline",
  "executive_time",
  "simulation",
  "decision",
  "custom",
] as const satisfies readonly ScenarioDependencyCategory[]);

export const SCENARIO_DEPENDENCY_NODE_KINDS = Object.freeze([
  "scenario",
  "workspace",
  "object",
  "relationship",
  "kpi",
  "risk",
  "executive_time",
  "timeline",
  "decision",
  "simulation",
  "compare",
  "related_scenario",
  "data_source",
] as const satisfies readonly ScenarioDependencyNodeKind[]);

export const SCENARIO_DEPENDENCY_CATEGORY_BY_KIND: Readonly<
  Record<ScenarioDependencyNodeKind, ScenarioDependencyCategory>
> = Object.freeze({
  scenario: "business",
  workspace: "operational",
  object: "business",
  relationship: "operational",
  kpi: "financial",
  risk: "risk",
  executive_time: "executive_time",
  timeline: "timeline",
  decision: "decision",
  simulation: "simulation",
  compare: "strategic",
  related_scenario: "strategic",
  data_source: "resource",
});

export const SCENARIO_DEPENDENCY_CRITICAL_STRENGTH_THRESHOLD = 0.7 as const;

export function isScenarioDependencyCategory(value: string): value is ScenarioDependencyCategory {
  return (SCENARIO_DEPENDENCY_CATEGORIES as readonly string[]).includes(value);
}

export function isScenarioDependencyNodeKind(value: string): value is ScenarioDependencyNodeKind {
  return (SCENARIO_DEPENDENCY_NODE_KINDS as readonly string[]).includes(value);
}
