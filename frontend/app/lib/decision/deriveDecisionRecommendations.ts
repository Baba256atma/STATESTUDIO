import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import {
  buildDecisionRecommendationRationale,
  buildDecisionRecommendationSummary,
  buildDecisionRecommendationTitle,
  groupLabelForDecisionRecommendation,
} from "./decisionRecommendationNarratives.ts";
import {
  candidateFromComparison,
  candidateFromFragility,
  categoryForExecutiveInsight,
  categoryForScenario,
  centralRelationshipPressure,
  clampRecommendationConfidence,
  priorityFromRecommendationScore,
  propagationReachForObjectIds,
  scoreDecisionRecommendationPriority,
  type DecisionRecommendationCandidate,
} from "./decisionRecommendationRules.ts";
import type {
  DecisionRecommendation,
  DecisionRecommendationCategory,
  DecisionRecommendationGroup,
  DecisionRecommendationOverlayState,
} from "./decisionRecommendationTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_RECOMMENDATIONS = 6;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const next = String(value ?? "").trim();
    if (!next || seen.has(next)) continue;
    seen.add(next);
    result.push(next);
  }
  return result;
}

function severityRank(priority: DecisionRecommendation["priority"]): number {
  if (priority === "critical") return 4;
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

function candidateFromInsight(params: {
  insight: ExecutiveInsight;
  propagationHints?: DomainPropagationHint[];
  relationships?: EnrichedDomainRelationship[];
}): DecisionRecommendationCandidate {
  const affectedObjectIds = unique(params.insight.affectedObjectIds);
  return {
    category: categoryForExecutiveInsight(params.insight),
    confidence: params.insight.confidence,
    severity: params.insight.severity,
    affectedObjectIds,
    propagationReach: propagationReachForObjectIds(affectedObjectIds, params.propagationHints),
    executiveImpact: Math.min(1.25, 0.85 + params.insight.priorityScore / 220),
    recommendedFocus: params.insight.recommendedFocus ?? params.insight.title,
    domainId: params.insight.domainId,
    rationale: buildDecisionRecommendationRationale({
      category: categoryForExecutiveInsight(params.insight),
      focus: params.insight.recommendedFocus ?? params.insight.title,
      insight: params.insight,
    }),
    relatedScenarioIds: params.insight.sourceType === "scenario" ? [params.insight.id.replace(/^exec_insight_scenario_/, "")] : [],
    stabilityImprovement: centralRelationshipPressure(affectedObjectIds, params.relationships),
  };
}

function candidateFromScenario(params: {
  scenario: DomainScenario;
  propagationHints?: DomainPropagationHint[];
}): DecisionRecommendationCandidate | null {
  if (params.scenario.confidence < 0.34 && params.scenario.severity === "low") return null;
  const affectedObjectIds = unique([...(params.scenario.affectedObjectIds ?? []), ...params.scenario.relatedObjectIds]);
  return {
    category: categoryForScenario(params.scenario),
    confidence: params.scenario.confidence,
    severity: params.scenario.severity,
    affectedObjectIds,
    relatedScenarioIds: [params.scenario.id],
    propagationReach: propagationReachForObjectIds(affectedObjectIds, params.propagationHints),
    recommendedFocus: params.scenario.recommendedFocus ?? params.scenario.title,
    domainId: params.scenario.domainId,
    rationale: params.scenario.executiveSummary,
  };
}

function buildRecommendation(candidate: DecisionRecommendationCandidate): DecisionRecommendation {
  const confidence = clampRecommendationConfidence(candidate.confidence);
  const affectedObjectIds = unique(candidate.affectedObjectIds ?? []);
  const relatedScenarioIds = unique(candidate.relatedScenarioIds ?? []);
  const score = scoreDecisionRecommendationPriority({
    category: candidate.category,
    confidence,
    severity: candidate.severity,
    affectedObjectIds,
    relatedScenarioIds,
    propagationReach: candidate.propagationReach,
    stabilityImprovement: candidate.stabilityImprovement,
    executiveImpact: candidate.executiveImpact,
  });
  const priority = priorityFromRecommendationScore(score);
  const focus = candidate.recommendedFocus ?? affectedObjectIds[0] ?? candidate.category;
  return {
    id: `decision_rec_${normalizeIdPart(candidate.category)}_${normalizeIdPart(focus)}_${normalizeIdPart(relatedScenarioIds.join("_") || affectedObjectIds.join("_") || "general")}`,
    title: candidate.title ?? buildDecisionRecommendationTitle({ category: candidate.category, focus }),
    summary: candidate.summary ?? buildDecisionRecommendationSummary({ category: candidate.category, focus }),
    category: candidate.category,
    rationale: candidate.rationale ?? buildDecisionRecommendationRationale({ category: candidate.category, focus }),
    recommendedFocus: focus,
    affectedObjectIds,
    ...(relatedScenarioIds.length ? { relatedScenarioIds } : {}),
    confidence,
    priority,
    ...(candidate.domainId ? { domainId: candidate.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };
}

function recommendationRank(recommendation: DecisionRecommendation): number {
  const priorityBonus = severityRank(recommendation.priority) * 100;
  return priorityBonus + recommendation.confidence * 30 + recommendation.affectedObjectIds.length;
}

function dedupeAndRank(recommendations: DecisionRecommendation[]): DecisionRecommendation[] {
  const bestBySignature = new Map<string, DecisionRecommendation>();
  for (const recommendation of recommendations) {
    const signature = `${recommendation.category}|${recommendation.affectedObjectIds.slice().sort().join(",")}|${recommendation.relatedScenarioIds?.slice().sort().join(",") ?? ""}`;
    const existing = bestBySignature.get(signature);
    if (!existing || recommendationRank(recommendation) > recommendationRank(existing)) {
      bestBySignature.set(signature, recommendation);
    }
  }
  return Array.from(bestBySignature.values())
    .sort((left, right) => {
      const rankDelta = recommendationRank(right) - recommendationRank(left);
      if (rankDelta !== 0) return rankDelta;
      return left.id.localeCompare(right.id);
    })
    .slice(0, MAX_RECOMMENDATIONS);
}

function logRecommendation(recommendation: DecisionRecommendation): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][DecisionRecommendation]", {
    title: recommendation.title,
    category: recommendation.category,
    priority: recommendation.priority,
    confidence: recommendation.confidence,
    domain: recommendation.domainId ?? null,
    relatedScenarios: recommendation.relatedScenarioIds ?? [],
  });
}

export function deriveDecisionRecommendations(params: {
  domainId?: string;
  insights?: ExecutiveInsight[];
  scenarios?: DomainScenario[];
  comparisons?: ScenarioComparison[];
  propagationHints?: DomainPropagationHint[];
  fragilityScores?: DomainFragilityScore[];
  relationships?: EnrichedDomainRelationship[];
}): DecisionRecommendation[] {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  const comparisons = Array.isArray(params.comparisons) ? params.comparisons : [];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores : [];
  const candidates: DecisionRecommendationCandidate[] = [];

  for (const insight of insights) {
    candidates.push(candidateFromInsight({
      insight,
      propagationHints: params.propagationHints,
      relationships: params.relationships,
    }));
  }

  for (const comparison of comparisons) {
    const candidate = candidateFromComparison({ comparison, scenarios });
    if (candidate) candidates.push({ ...candidate, domainId: candidate.domainId ?? params.domainId });
  }

  for (const scenario of scenarios) {
    const candidate = candidateFromScenario({ scenario, propagationHints: params.propagationHints });
    if (candidate) candidates.push(candidate);
  }

  for (const score of fragilityScores) {
    const candidate = candidateFromFragility(score);
    if (candidate) candidates.push({ ...candidate, domainId: params.domainId });
  }

  const recommendations = dedupeAndRank(candidates.map(buildRecommendation));
  for (const recommendation of recommendations) logRecommendation(recommendation);
  return recommendations;
}

export function groupDecisionRecommendations(recommendations: DecisionRecommendation[]): DecisionRecommendationGroup[] {
  const grouped = new Map<DecisionRecommendationCategory, DecisionRecommendation[]>();
  for (const recommendation of recommendations) {
    const current = grouped.get(recommendation.category) ?? [];
    current.push(recommendation);
    grouped.set(recommendation.category, current);
  }
  return Array.from(grouped.entries()).map(([category, items]) => ({
    label: groupLabelForDecisionRecommendation(category),
    category,
    recommendations: items.slice(),
  }));
}

export function buildDecisionRecommendationOverlayState(params: {
  recommendations: DecisionRecommendation[];
}): DecisionRecommendationOverlayState {
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations : [];
  const top = recommendations[0] ?? null;
  return {
    ...(top ? { topRecommendationId: top.id } : {}),
    affectedObjectIds: unique(recommendations.flatMap((item) => item.affectedObjectIds)),
    relatedScenarioIds: unique(recommendations.flatMap((item) => item.relatedScenarioIds ?? [])),
    executiveSummary: top
      ? `${top.title}: ${top.summary}`
      : "No decision recommendation is available yet.",
    groups: groupDecisionRecommendations(recommendations),
  };
}
