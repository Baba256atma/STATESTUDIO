import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainRiskSignalResult } from "../domain/domainRiskSignals.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import {
  buildExecutiveInsightSummary,
  buildExecutiveInsightTitle,
  recommendExecutiveFocus,
} from "./executiveInsightNarratives.ts";
import {
  priorityTierFromScore,
  scoreExecutiveInsightPriority,
} from "./scoreExecutiveInsights.ts";
import type {
  ExecutiveInsight,
  ExecutiveInsightCategory,
  ExecutiveInsightRankingResult,
  ExecutiveInsightSeverity,
  ExecutivePriorityTier,
} from "./executiveInsightTypes.ts";

const MAX_EXECUTIVE_INSIGHTS = 6;
const DETERMINISTIC_CREATED_AT = 0;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function labelFor(objects: unknown[], objectId: string): string {
  const object = objects.find((item) => String(asRecord(item).id ?? "").trim() === objectId);
  const record = asRecord(object);
  const semantic = asRecord(record.semantic);
  return String(record.label ?? record.name ?? semantic.display_label ?? objectId).trim() || objectId;
}

function severityRank(severity: ExecutiveInsightSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function fragilitySeverity(level: DomainFragilityScore["level"], score: number): ExecutiveInsightSeverity {
  if (level === "critical" || score >= 76) return "critical";
  if (level === "fragile" || score >= 51) return "high";
  if (level === "watch" || score >= 26) return "medium";
  return "low";
}

function scenarioCategory(scenario: DomainScenario): ExecutiveInsightCategory {
  if (scenario.type === "financial_pressure") return "financial";
  if (scenario.type === "resource_constraint" || scenario.type === "overload") return "capacity";
  if (scenario.type === "dependency_failure" || scenario.type === "bottleneck") return "dependency";
  if (scenario.type === "instability") return "stability";
  return "scenario";
}

function riskCategory(signal: DomainRiskSignalResult): ExecutiveInsightCategory {
  if (signal.signalType === "capacity") return "capacity";
  if (signal.signalType === "dependency") return "dependency";
  if (signal.signalType === "fragility") return "fragility";
  if (signal.signalType === "exposure" || signal.signalType === "security") return "risk";
  return "risk";
}

function relationshipCategory(relationship: EnrichedDomainRelationship): ExecutiveInsightCategory {
  if (relationship.meta.semantic === "financial") return "financial";
  if (relationship.meta.semantic === "dependency" || relationship.meta.semantic === "flow") return "dependency";
  if (relationship.meta.semantic === "risk") return "risk";
  if (relationship.meta.semantic === "monitoring") return "stability";
  return "operational";
}

function centralityFor(objectId: string, relationships: EnrichedDomainRelationship[], propagationHints: DomainPropagationHint[]): number {
  const relationshipCount = relationships.filter((item) => item.sourceObjectId === objectId || item.targetObjectId === objectId).length;
  const propagationCount = propagationHints.filter((item) => item.sourceObjectId === objectId || item.targetObjectId === objectId).length;
  return Math.min(1, (relationshipCount + propagationCount) / 8);
}

function reachFor(objectIds: string[], propagationHints: DomainPropagationHint[]): number {
  const related = propagationHints.filter((hint) => objectIds.includes(hint.sourceObjectId) || objectIds.includes(hint.targetObjectId));
  return new Set(related.flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId])).size;
}

function pushInsight(insights: ExecutiveInsight[], insight: Omit<ExecutiveInsight, "createdAt">): void {
  if (insight.confidence < 0.32 && insight.severity === "low") return;
  insights.push({ ...insight, createdAt: DETERMINISTIC_CREATED_AT });
}

function dedupeAndRank(insights: ExecutiveInsight[]): ExecutiveInsight[] {
  const bestBySignature = new Map<string, ExecutiveInsight>();
  for (const insight of insights) {
    const signature = `${insight.category}|${insight.affectedObjectIds.slice().sort().join(",")}|${normalizeIdPart(insight.title)}`;
    const existing = bestBySignature.get(signature);
    if (!existing || insight.priorityScore > existing.priorityScore) {
      bestBySignature.set(signature, insight);
    }
  }
  return Array.from(bestBySignature.values())
    .sort((left, right) => {
      if (right.priorityScore !== left.priorityScore) return right.priorityScore - left.priorityScore;
      const severityDelta = severityRank(right.severity) - severityRank(left.severity);
      if (severityDelta !== 0) return severityDelta;
      const confidenceDelta = right.confidence - left.confidence;
      if (confidenceDelta !== 0) return confidenceDelta;
      return left.id.localeCompare(right.id);
    })
    .slice(0, MAX_EXECUTIVE_INSIGHTS);
}

function logRankedInsight(insight: ExecutiveInsight): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ExecutiveInsightRanked]", {
    title: insight.title,
    priorityScore: insight.priorityScore,
    tier: priorityTierFromScore(insight.priorityScore),
    sourceType: insight.sourceType,
    severity: insight.severity,
  });
}

export function deriveExecutiveInsights(params: {
  domainId?: string;
  objects?: unknown[];
  scenarios?: DomainScenario[];
  riskSignals?: DomainRiskSignalResult[];
  fragilityScores?: DomainFragilityScore[];
  relationships?: EnrichedDomainRelationship[];
  propagationHints?: DomainPropagationHint[];
}): ExecutiveInsightRankingResult {
  const objects = Array.isArray(params.objects) ? params.objects : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  const riskSignals = Array.isArray(params.riskSignals) ? params.riskSignals : [];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores : [];
  const relationships = Array.isArray(params.relationships) ? params.relationships : [];
  const propagationHints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const insights: ExecutiveInsight[] = [];

  for (const scenario of scenarios) {
    const affectedObjectIds = Array.from(new Set([...(scenario.affectedObjectIds ?? []), ...scenario.relatedObjectIds])).filter(Boolean);
    const primaryId = affectedObjectIds[0] ?? "scenario";
    const primaryLabel = labelFor(objects, primaryId);
    const category = scenarioCategory(scenario);
    const priorityScore = scoreExecutiveInsightPriority({
      severity: scenario.severity,
      confidence: scenario.confidence,
      propagationReach: reachFor(affectedObjectIds, propagationHints),
      dependencyDensity: affectedObjectIds.length,
      objectCentrality: centralityFor(primaryId, relationships, propagationHints),
      relationshipStrength: 0.7,
    });
    pushInsight(insights, {
      id: `exec_insight_scenario_${normalizeIdPart(scenario.id)}`,
      title: scenario.title || buildExecutiveInsightTitle({ category, primaryLabel, severity: scenario.severity }),
      summary: scenario.executiveSummary || buildExecutiveInsightSummary({ category, primaryLabel, sourceType: "scenario" }),
      category,
      severity: scenario.severity,
      confidence: scenario.confidence,
      priorityScore,
      affectedObjectIds,
      recommendedFocus: scenario.recommendedFocus ?? recommendExecutiveFocus({ category, primaryLabel }),
      domainId: scenario.domainId ?? params.domainId,
      sourceType: "scenario",
    });
  }

  for (const signal of riskSignals) {
    const primaryId = signal.relatedObjectIds[0] ?? "risk";
    const primaryLabel = labelFor(objects, primaryId);
    const category = riskCategory(signal);
    const priorityScore = scoreExecutiveInsightPriority({
      severity: signal.severity,
      confidence: signal.confidence,
      propagationReach: reachFor(signal.relatedObjectIds, propagationHints),
      dependencyDensity: signal.relatedObjectIds.length,
      objectCentrality: centralityFor(primaryId, relationships, propagationHints),
      relationshipStrength: 0.65,
      domainWeight: signal.signalType === "exposure" ? 1.08 : 1,
    });
    pushInsight(insights, {
      id: `exec_insight_risk_${normalizeIdPart(signal.id)}`,
      title: buildExecutiveInsightTitle({ category, primaryLabel, severity: signal.severity }),
      summary: signal.explanation || buildExecutiveInsightSummary({ category, primaryLabel, sourceType: "propagation" }),
      category,
      severity: signal.severity,
      confidence: signal.confidence,
      priorityScore,
      affectedObjectIds: signal.relatedObjectIds,
      recommendedFocus: recommendExecutiveFocus({ category, primaryLabel }),
      domainId: signal.domainId ?? params.domainId,
      sourceType: "propagation",
    });
  }

  for (const score of fragilityScores.filter((item) => item.level !== "stable")) {
    const primaryLabel = labelFor(objects, score.objectId);
    const severity = fragilitySeverity(score.level, score.score);
    const category: ExecutiveInsightCategory = score.level === "critical" ? "stability" : "fragility";
    const confidence = Math.min(0.95, 0.42 + score.score / 180);
    const priorityScore = scoreExecutiveInsightPriority({
      severity,
      confidence,
      propagationReach: reachFor([score.objectId], propagationHints),
      dependencyDensity: relationships.filter((item) => item.sourceObjectId === score.objectId || item.targetObjectId === score.objectId).length,
      objectCentrality: centralityFor(score.objectId, relationships, propagationHints),
      relationshipStrength: 0.62,
    });
    pushInsight(insights, {
      id: `exec_insight_fragility_${normalizeIdPart(score.objectId)}`,
      title: buildExecutiveInsightTitle({ category, primaryLabel, severity }),
      summary: buildExecutiveInsightSummary({ category, primaryLabel, sourceType: "fragility" }),
      category,
      severity,
      confidence: Number(confidence.toFixed(2)),
      priorityScore,
      affectedObjectIds: [score.objectId],
      recommendedFocus: recommendExecutiveFocus({ category, primaryLabel }),
      domainId: params.domainId,
      sourceType: "fragility",
    });
  }

  for (const relationship of relationships) {
    const strength = relationship.meta.strength ?? 0.5;
    if (strength < 0.72 && relationship.meta.semantic !== "risk") continue;
    const sourceLabel = labelFor(objects, relationship.sourceObjectId);
    const targetLabel = labelFor(objects, relationship.targetObjectId);
    const category = relationshipCategory(relationship);
    const severity: ExecutiveInsightSeverity = relationship.meta.semantic === "risk" ? "high" : strength >= 0.84 ? "high" : "medium";
    const confidence = Math.min(0.92, 0.45 + strength * 0.45);
    const affectedObjectIds = [relationship.sourceObjectId, relationship.targetObjectId];
    const priorityScore = scoreExecutiveInsightPriority({
      severity,
      confidence,
      propagationReach: reachFor(affectedObjectIds, propagationHints),
      dependencyDensity: affectedObjectIds.length,
      relationshipStrength: strength,
      objectCentrality: Math.max(
        centralityFor(relationship.sourceObjectId, relationships, propagationHints),
        centralityFor(relationship.targetObjectId, relationships, propagationHints)
      ),
    });
    pushInsight(insights, {
      id: `exec_insight_relationship_${normalizeIdPart(relationship.sourceObjectId)}_${normalizeIdPart(relationship.targetObjectId)}_${normalizeIdPart(relationship.meta.semantic)}`,
      title: buildExecutiveInsightTitle({ category, primaryLabel: sourceLabel, severity }),
      summary: relationship.executiveExplanation || buildExecutiveInsightSummary({ category, primaryLabel: sourceLabel, secondaryLabel: targetLabel, sourceType: "relationship" }),
      category,
      severity,
      confidence: Number(confidence.toFixed(2)),
      priorityScore,
      affectedObjectIds,
      recommendedFocus: recommendExecutiveFocus({ category, primaryLabel: sourceLabel }),
      domainId: params.domainId,
      sourceType: "relationship",
    });
  }

  const ranked = dedupeAndRank(insights);
  for (const insight of ranked) logRankedInsight(insight);
  const tiers: Record<ExecutivePriorityTier, ExecutiveInsight[]> = {
    monitor: [],
    attention: [],
    urgent: [],
    critical: [],
  };
  for (const insight of ranked) {
    tiers[priorityTierFromScore(insight.priorityScore)].push(insight);
  }

  return {
    insights: ranked,
    topInsight: ranked[0] ?? null,
    tiers,
  };
}
