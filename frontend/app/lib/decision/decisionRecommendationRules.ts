import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { ExecutiveInsight, ExecutiveInsightSeverity } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type {
  DecisionRecommendationCategory,
  DecisionRecommendationPriority,
} from "./decisionRecommendationTypes.ts";

export type DecisionRecommendationRuleInput = {
  category: DecisionRecommendationCategory;
  confidence: number;
  severity?: ExecutiveInsightSeverity | DomainScenario["severity"];
  affectedObjectIds?: string[];
  relatedScenarioIds?: string[];
  propagationReach?: number;
  stabilityImprovement?: number;
  executiveImpact?: number;
};

export type DecisionRecommendationCandidate = DecisionRecommendationRuleInput & {
  title?: string;
  summary?: string;
  rationale?: string;
  recommendedFocus?: string;
  domainId?: string;
};

export function clampRecommendationConfidence(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0.45;
  return Math.min(1, Math.max(0, number));
}

function severityWeight(severity: DecisionRecommendationRuleInput["severity"]): number {
  if (severity === "critical") return 38;
  if (severity === "high") return 28;
  if (severity === "medium") return 16;
  if (severity === "low") return 7;
  return 12;
}

export function priorityFromRecommendationScore(score: number): DecisionRecommendationPriority {
  if (score >= 82) return "critical";
  if (score >= 62) return "high";
  if (score >= 36) return "medium";
  return "low";
}

export function scoreDecisionRecommendationPriority(input: DecisionRecommendationRuleInput): number {
  const confidence = clampRecommendationConfidence(input.confidence);
  const affectedCount = Math.min(8, input.affectedObjectIds?.length ?? 0);
  const scenarioCount = Math.min(4, input.relatedScenarioIds?.length ?? 0);
  const propagationReach = Math.min(8, Math.max(0, input.propagationReach ?? 0));
  const stabilityImprovement = Math.min(40, Math.max(-20, input.stabilityImprovement ?? 0));
  const executiveImpact = Math.min(1.25, Math.max(0.75, input.executiveImpact ?? 1));
  const categoryBoost =
    input.category === "stabilize" ? 8 :
    input.category === "diversify" ? 7 :
    input.category === "reduce_risk" ? 6 :
    input.category === "protect" ? 5 :
    input.category === "rebalance" ? 4 :
    input.category === "monitor" ? -4 :
    0;

  const raw =
    severityWeight(input.severity) +
    confidence * 24 +
    affectedCount * 3.5 +
    scenarioCount * 2.5 +
    propagationReach * 2.25 +
    stabilityImprovement * 0.35 +
    categoryBoost;

  return Math.round(Math.min(100, Math.max(0, raw * executiveImpact)));
}

export function categoryForExecutiveInsight(insight: ExecutiveInsight): DecisionRecommendationCategory {
  if (insight.category === "dependency") return insight.severity === "critical" || insight.priorityScore >= 80 ? "diversify" : "reduce_risk";
  if (insight.category === "fragility" || insight.category === "stability") return "stabilize";
  if (insight.category === "capacity") return "rebalance";
  if (insight.category === "financial") return "protect";
  if (insight.category === "risk") return "reduce_risk";
  if (insight.category === "operational") return "optimize";
  return insight.confidence < 0.55 ? "investigate" : "optimize";
}

export function categoryForScenario(scenario: DomainScenario): DecisionRecommendationCategory {
  if (scenario.type === "delay" || scenario.type === "dependency_failure" || scenario.type === "bottleneck") return "stabilize";
  if (scenario.type === "resource_constraint" || scenario.type === "overload") return "rebalance";
  if (scenario.type === "financial_pressure") return "protect";
  if (scenario.type === "mitigation" || scenario.type === "containment") return "reduce_risk";
  if (scenario.type === "optimization" || scenario.type === "expansion") return "optimize";
  return scenario.confidence < 0.55 ? "investigate" : "monitor";
}

export function candidateFromComparison(params: {
  comparison: ScenarioComparison;
  scenarios?: DomainScenario[];
}): DecisionRecommendationCandidate | null {
  const recommendedId = params.comparison.recommendedScenarioId;
  if (!recommendedId) return null;
  const scenario = (params.scenarios ?? []).find((item) => item.id === recommendedId);
  const stabilityImprovement = Math.max(0, params.comparison.stabilityDelta);
  const fragilityReduction = Math.max(0, -params.comparison.fragilityDelta);
  const propagationReduction = Math.max(0, -params.comparison.propagationDelta);
  return {
    category: stabilityImprovement + fragilityReduction >= propagationReduction ? "stabilize" : "reduce_risk",
    confidence: Math.min(0.94, Math.max(0.45, (scenario?.confidence ?? 0.62) + Math.abs(params.comparison.confidenceDelta) / 220)),
    severity: scenario?.severity ?? "medium",
    affectedObjectIds: scenario?.affectedObjectIds ?? scenario?.relatedObjectIds ?? [],
    relatedScenarioIds: [recommendedId],
    propagationReach: Math.round(propagationReduction / 10),
    stabilityImprovement,
    recommendedFocus: scenario?.recommendedFocus ?? scenario?.title ?? "leading strategic alternative",
    domainId: scenario?.domainId,
    rationale: `${params.comparison.executiveSummary} The comparison favors ${scenario?.title ?? recommendedId} as the clearer executive path.`,
  };
}

export function propagationReachForObjectIds(objectIds: string[], hints?: DomainPropagationHint[]): number {
  const ids = new Set(objectIds);
  const related = (hints ?? []).filter((hint) => ids.has(hint.sourceObjectId) || ids.has(hint.targetObjectId));
  return new Set(related.flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId])).size;
}

export function centralRelationshipPressure(objectIds: string[], relationships?: EnrichedDomainRelationship[]): number {
  const ids = new Set(objectIds);
  const related = (relationships ?? []).filter((item) => ids.has(item.sourceObjectId) || ids.has(item.targetObjectId));
  return related.reduce((sum, item) => sum + (item.meta.strength ?? 0.5), 0);
}

export function candidateFromFragility(score: DomainFragilityScore): DecisionRecommendationCandidate | null {
  if (score.level === "stable" || score.score < 40) return null;
  return {
    category: score.level === "critical" ? "stabilize" : "monitor",
    confidence: Math.min(0.92, 0.42 + score.score / 140),
    severity: score.level === "critical" ? "critical" : score.level === "fragile" ? "high" : "medium",
    affectedObjectIds: [score.objectId],
    propagationReach: 1,
    recommendedFocus: score.objectId,
    rationale: `${score.objectId} has a fragility score of ${Math.round(score.score)}, making it a visible executive pressure point.`,
  };
}
