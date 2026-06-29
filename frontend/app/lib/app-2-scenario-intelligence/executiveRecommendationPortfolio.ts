/**
 * APP-2:9 — Executive Recommendation Portfolio definitions.
 * Recommendation vocabulary and confidence model — no execution logic.
 */

export const EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION = "APP-2/9" as const;

export type ExecutiveRecommendationIntent =
  | "maintain_course"
  | "accelerate_initiative"
  | "delay_initiative"
  | "reduce_exposure"
  | "increase_investment"
  | "gather_evidence"
  | "rescope_scenario"
  | "monitor_only";

export type ExecutiveRecommendationConfidenceLevel =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type ExecutiveRecommendationFocus =
  | "stability"
  | "growth"
  | "risk_mitigation"
  | "evidence"
  | "monitoring"
  | "optimization";

export type ExecutiveRecommendationEvidenceSource =
  | "state"
  | "priority"
  | "dependency_graph"
  | "conflict_graph"
  | "opportunity_graph"
  | "summary"
  | "risk"
  | "kpi"
  | "timeline"
  | "executive_time";

export const EXECUTIVE_RECOMMENDATION_INTENTS = Object.freeze([
  "maintain_course",
  "accelerate_initiative",
  "delay_initiative",
  "reduce_exposure",
  "increase_investment",
  "gather_evidence",
  "rescope_scenario",
  "monitor_only",
] as const satisfies readonly ExecutiveRecommendationIntent[]);

export const EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS = Object.freeze([
  "very_low",
  "low",
  "medium",
  "high",
  "very_high",
] as const satisfies readonly ExecutiveRecommendationConfidenceLevel[]);

export const EXECUTIVE_RECOMMENDATION_CONFIDENCE_RANK: Readonly<
  Record<ExecutiveRecommendationConfidenceLevel, number>
> = Object.freeze({
  very_low: 0,
  low: 1,
  medium: 2,
  high: 3,
  very_high: 4,
});

export const EXECUTIVE_RECOMMENDATION_INTENT_LABELS: Readonly<
  Record<ExecutiveRecommendationIntent, string>
> = Object.freeze({
  maintain_course: "Maintain Current Course",
  accelerate_initiative: "Accelerate Initiative",
  delay_initiative: "Delay Initiative",
  reduce_exposure: "Reduce Exposure",
  increase_investment: "Increase Investment",
  gather_evidence: "Gather More Evidence",
  rescope_scenario: "Rescope Scenario",
  monitor_only: "Monitor Only",
});

export const EXECUTIVE_RECOMMENDATION_INTENT_ORDER: Readonly<
  Record<ExecutiveRecommendationIntent, number>
> = Object.freeze({
  reduce_exposure: 0,
  delay_initiative: 1,
  gather_evidence: 2,
  rescope_scenario: 3,
  maintain_course: 4,
  monitor_only: 5,
  accelerate_initiative: 6,
  increase_investment: 7,
});
