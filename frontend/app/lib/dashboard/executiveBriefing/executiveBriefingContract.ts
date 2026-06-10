/**
 * MRP:10:4 — Executive Intelligence Briefing contract.
 *
 * Read-only presentation shapes for Dashboard Home recommendations.
 * No AI orchestration, no intelligence engines, no state ownership.
 */

import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";

export type ExecutiveRecommendationType =
  | "attention"
  | "opportunity"
  | "risk"
  | "insight"
  | "follow_up";

export type ExecutiveRecommendationConfidence = "low" | "medium" | "high";

export type ExecutiveRecommendationActionKind =
  | "workspace_launch"
  | "focus_recommendations";

/** Card view projected from existing recommendation sources. */
export type ExecutiveRecommendationCardView = Readonly<{
  id: string;
  title: string;
  summary: string;
  recommendationType: ExecutiveRecommendationType;
  confidence: ExecutiveRecommendationConfidence;
  suggestedActionLabel: string;
  suggestedWorkspaceId: ExecutiveWorkspaceId | null;
  actionKind: ExecutiveRecommendationActionKind;
  launchable: boolean;
  sourceSignal: string;
}>;

export type ExecutiveIntelligenceBriefingView = Readonly<{
  narrative: string;
  totalCount: number;
  attentionCount: number;
  opportunityCount: number;
  riskCount: number;
  insightCount: number;
  followUpCount: number;
  isNominal: boolean;
}>;

export type ExecutiveBriefingView = Readonly<{
  briefing: ExecutiveIntelligenceBriefingView;
  recommendations: readonly ExecutiveRecommendationCardView[];
  evaluatedAt: number;
  source: "executive_briefing_layer";
}>;

/** Display cap — never overload Dashboard Home. */
export const EXECUTIVE_BRIEFING_MIN_DISPLAY = 3;
export const EXECUTIVE_BRIEFING_MAX_DISPLAY = 7;

export const EXECUTIVE_RECOMMENDATION_TYPE_LABELS: Readonly<
  Record<ExecutiveRecommendationType, string>
> = Object.freeze({
  attention: "Attention",
  opportunity: "Opportunity",
  risk: "Risk",
  insight: "Insight",
  follow_up: "Follow-Up",
});

export const EXECUTIVE_RECOMMENDATION_CONFIDENCE_LABELS: Readonly<
  Record<ExecutiveRecommendationConfidence, string>
> = Object.freeze({
  low: "Low",
  medium: "Medium",
  high: "High",
});

/** Reserved slots for future engine integration without Dashboard Home redesign. */
export const FUTURE_EXECUTIVE_BRIEFING_SOURCE_SLOTS = Object.freeze([
  "risk_engine",
  "scenario_engine",
  "strategic_planning_engine",
  "operational_intelligence_engine",
  "advisory_engine",
] as const);

export type FutureExecutiveBriefingSourceSlot =
  (typeof FUTURE_EXECUTIVE_BRIEFING_SOURCE_SLOTS)[number];

const loggedBrakes = new Set<string>();

export function warnExecutiveBriefingBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ExecutiveBriefing][Brake]", { message, ...detail });
}

export function resetExecutiveBriefingBrakesForTests(): void {
  loggedBrakes.clear();
}
