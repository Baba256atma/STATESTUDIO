import { dedupeBySignature, domainScenarioDedupeSignature } from "./domainDedupe.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import { calculateObjectFragilityScores, type DomainFragilityScore } from "./domainFragilityScoring.ts";
import { enrichDomainRelationships, type EnrichedDomainRelationship } from "./enrichDomainRelationships.ts";
import { matchDomainScenarioRules } from "./domainScenarioRules.ts";
import { scoreDomainScenarioIntelligence } from "./domainScenarioIntelligenceScoring.ts";
import {
  buildDomainScenarioExecutiveSummary,
  buildDomainScenarioProbableImpact,
  buildDomainScenarioRecommendedFocus,
  buildDomainScenarioTitle,
} from "./domainScenarioNarratives.ts";
import type { DomainScenario, DomainScenarioImpact, DomainScenarioSeverity } from "./domainScenarioTypes.ts";

const MAX_DERIVED_SCENARIOS = 5;
const DETERMINISTIC_CREATED_AT = 0;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectId(value: unknown): string {
  return String(asRecord(value).id ?? "").trim();
}

function objectLabel(value: unknown, fallback: string): string {
  const record = asRecord(value);
  const semantic = asRecord(record.semantic);
  return String(record.label ?? record.name ?? semantic.display_label ?? record.id ?? fallback).trim() || fallback;
}

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function severityRank(severity: DomainScenarioSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function impactsFor(severity: DomainScenarioSeverity, type: DomainScenario["type"]): DomainScenarioImpact[] {
  const magnitude = severity === "critical" ? 86 : severity === "high" ? 72 : severity === "medium" ? 48 : 24;
  if (type === "financial_pressure") {
    return [
      { category: "cost", direction: "increase", magnitude },
      { category: "confidence", direction: "decrease", magnitude: Math.max(18, magnitude - 18) },
    ];
  }
  if (type === "delay" || type === "bottleneck" || type === "resource_constraint") {
    return [
      { category: "timeline", direction: "increase", magnitude },
      { category: "stability", direction: "decrease", magnitude: Math.max(18, magnitude - 16) },
    ];
  }
  return [
    { category: "risk", direction: "increase", magnitude },
    { category: "confidence", direction: "decrease", magnitude: Math.max(18, magnitude - 20) },
  ];
}

function devLogScenario(scenario: DomainScenario): void {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][DomainScenarioDerived]", {
    scenarioType: scenario.type,
    domain: scenario.domainId,
    severity: scenario.severity,
    confidence: scenario.confidence,
    objectCount: scenario.relatedObjectIds.length,
  });
}

export function deriveDomainScenarios(params: {
  domainId: unknown;
  objects: unknown[];
  edges?: unknown[];
  enrichedRelationships?: EnrichedDomainRelationship[];
  fragilityScores?: DomainFragilityScore[];
}): DomainScenario[] {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const objects = Array.isArray(params.objects) ? params.objects : [];
    if (objects.length === 0) return [];

    const objectEntries: Array<[string, unknown]> = [];
    for (const object of objects) {
      const id = objectId(object);
      if (id) objectEntries.push([id, object]);
    }
    const objectById = new Map<string, unknown>(objectEntries);
    const enrichedRelationships = params.enrichedRelationships ?? enrichDomainRelationships({
      domainId,
      objects,
      edges: params.edges,
    });
    const fragilityScores = params.fragilityScores ?? calculateObjectFragilityScores({
      objects,
      edges: params.edges,
    });
    const fragilityById = new Map(fragilityScores.map((score) => [score.objectId, score]));
    const matches = matchDomainScenarioRules({
      domainId,
      objects,
      enrichedRelationships,
      fragilityScores,
    });

    const scenarios = matches.map((match): DomainScenario => {
      const sourceObject = objectById.get(match.sourceObjectId);
      const targetObject = match.targetObjectId ? objectById.get(match.targetObjectId) : undefined;
      const sourceLabel = objectLabel(sourceObject, match.sourceObjectId);
      const targetLabel = objectLabel(targetObject, match.targetObjectId ?? match.sourceObjectId);
      const fragilityScore = Math.max(
        fragilityById.get(match.sourceObjectId)?.score ?? 0,
        match.targetObjectId ? fragilityById.get(match.targetObjectId)?.score ?? 0 : 0
      );
      const score = scoreDomainScenarioIntelligence({
        severity: match.severity,
        baseConfidence: match.confidence,
        propagationReach: match.propagationReach,
        relationshipStrength: match.relationshipStrength,
        fragilityScore,
      });
      const title = buildDomainScenarioTitle({
        type: match.scenarioType,
        primaryLabel: sourceLabel,
        secondaryLabel: targetLabel,
      });
      const executiveSummary = buildDomainScenarioExecutiveSummary({
        type: match.scenarioType,
        primaryLabel: sourceLabel,
        secondaryLabel: targetLabel,
        severity: score.severity,
      });
      const relatedObjectIds = Array.from(new Set([match.sourceObjectId, match.targetObjectId].filter((id): id is string => Boolean(id))));

      return {
        id: `domain_intelligence_scenario_${domainId}_${normalizeIdPart(match.scenarioType)}_${normalizeIdPart(relatedObjectIds.join("_"))}`,
        domainId,
        title,
        description: executiveSummary,
        type: match.scenarioType,
        confidence: score.confidence,
        severity: score.severity,
        relatedObjectIds,
        affectedObjectIds: relatedObjectIds,
        impacts: impactsFor(score.severity, match.scenarioType),
        recommendedActions: [
          buildDomainScenarioRecommendedFocus({ type: match.scenarioType, primaryLabel: sourceLabel }),
          "Review connected risk and propagation signals before committing action",
        ],
        executiveSummary,
        probableImpact: buildDomainScenarioProbableImpact({
          type: match.scenarioType,
          primaryLabel: sourceLabel,
          secondaryLabel: targetLabel,
        }),
        recommendedFocus: buildDomainScenarioRecommendedFocus({ type: match.scenarioType, primaryLabel: sourceLabel }),
        createdAt: DETERMINISTIC_CREATED_AT,
        metadata: {
          source: "domain_scenario_intelligence",
          ruleReason: match.reason,
          propagationReach: match.propagationReach,
          relationshipStrength: match.relationshipStrength,
          executivePriority: score.priority,
          fragilityScore,
        },
      };
    });

    const sorted = dedupeBySignature<DomainScenario>(scenarios, domainScenarioDedupeSignature)
      .sort((left, right) => {
        const severityDelta = severityRank(right.severity) - severityRank(left.severity);
        if (severityDelta !== 0) return severityDelta;
        const confidenceDelta = right.confidence - left.confidence;
        if (confidenceDelta !== 0) return confidenceDelta;
        return left.id.localeCompare(right.id);
      })
      .slice(0, MAX_DERIVED_SCENARIOS);

    for (const scenario of sorted) devLogScenario(scenario);
    return sorted;
  } catch {
    return [];
  }
}
