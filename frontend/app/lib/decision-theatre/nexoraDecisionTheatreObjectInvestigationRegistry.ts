/**
 * DTH:6 — Investigation action and type-priority registry.
 * Presentation priorities only. Does not invent missing data.
 */

import type { NexoraDecisionTheatreInvestigationAction } from "./nexoraDecisionTheatreObjectInvestigation.ts";

export const nexoraDecisionTheatreObjectInvestigationRegistryIdentity =
  "DTH:6/ObjectInvestigationRegistry" as const;

export const NEXORA_DECISION_THEATRE_INVESTIGATION_TYPE_PRIORITY = Object.freeze({
  problem: Object.freeze(["evidence", "goal", "kpi", "risk", "scenario"]),
  risk: Object.freeze(["evidence", "problem", "goal", "scenario"]),
  opportunity: Object.freeze(["evidence", "goal", "scenario"]),
  goal: Object.freeze(["kpi", "problem", "scenario", "decision"]),
  kpi: Object.freeze(["goal", "problem", "risk"]),
  scenario: Object.freeze(["assumption", "evidence", "cost", "time", "risk", "decision"]),
  decision: Object.freeze(["evidence", "scenario", "execution"]),
  execution: Object.freeze(["decision", "outcome"]),
  outcome: Object.freeze(["execution", "goal"]),
  object: Object.freeze(["problem", "scenario", "decision", "kpi"]),
} as const);

export function investigationTypePriority(
  type: string,
): readonly string[] {
  const key = type as keyof typeof NEXORA_DECISION_THEATRE_INVESTIGATION_TYPE_PRIORITY;
  return NEXORA_DECISION_THEATRE_INVESTIGATION_TYPE_PRIORITY[key] ?? NEXORA_DECISION_THEATRE_INVESTIGATION_TYPE_PRIORITY.object;
}

export const NEXORA_DECISION_THEATRE_INVESTIGATION_ACTION_ROUTES = Object.freeze({
  EXPLAIN_OBJECT: "MO:2/GenericExplainEngine",
  SHOW_EVIDENCE: "MO:2/evidence-focus",
  SHOW_RELATIONSHIPS: "NEX-MVP:4/related-one-hop",
  SHOW_HISTORY: "unavailable-unless-temporal-authority",
  SHOW_DECISION_RELEVANCE: "CC:10/read-only",
  COMPARE_RELATED: "NCA-POST:4/existing-comparison",
  RETURN_TO_SCENE: "NEX-MVP:4/preserve-stage",
} as const satisfies Record<NexoraDecisionTheatreInvestigationAction, string>);

export function managerRelationLanguage(relation: string | null): string {
  const value = (relation ?? "related").toLowerCase();
  if (value.includes("cause") || value.includes("causal")) return "associated with";
  if (value === "affected-by" || value === "affects") return "affects";
  if (value === "explored-by") return "explored by";
  if (value === "constrained-by") return "constrained by";
  if (value === "acts-on") return "acts on";
  if (value === "observed-by" || value === "observes") return "observed by";
  return value.replace(/-/g, " ");
}
