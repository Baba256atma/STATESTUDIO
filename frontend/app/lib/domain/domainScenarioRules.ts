import { normalizeDomainId } from "./domainHelpers.ts";
import type { EnrichedDomainRelationship } from "./enrichDomainRelationships.ts";
import type { DomainFragilityScore } from "./domainFragilityScoring.ts";
import type { NexoraDomainId } from "./domainTypes.ts";
import type { DomainScenarioSeverity, DomainScenarioType } from "./domainScenarioTypes.ts";

export type DomainScenarioRuleMatch = {
  scenarioType: DomainScenarioType;
  sourceObjectId: string;
  targetObjectId?: string;
  reason: string;
  propagationReach: number;
  relationshipStrength: number;
  severity: DomainScenarioSeverity;
  confidence: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectId(value: unknown): string {
  return String(asRecord(value).id ?? "").trim();
}

function objectRole(value: unknown): string {
  const record = asRecord(value);
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  return String(meta.semanticRole ?? semantic.role ?? record.role ?? "").trim().toLowerCase();
}

function objectText(value: unknown): string {
  const record = asRecord(value);
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  const parts = [
    record.id,
    record.label,
    record.name,
    record.category,
    record.business_meaning,
    semantic.display_label,
    semantic.category,
    semantic.business_meaning,
    meta.templateId,
  ];
  return parts
    .map((part) => String(part ?? "").toLowerCase().replace(/[_-]+/g, " "))
    .filter(Boolean)
    .join(" ");
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function severityFromPressure(score: number, reach: number, strength: number): DomainScenarioSeverity {
  const pressure = score + reach * 8 + strength * 18;
  if (pressure >= 96) return "critical";
  if (pressure >= 72) return "high";
  if (pressure >= 44) return "medium";
  return "low";
}

function severityRank(severity: DomainScenarioSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function typeFor(params: {
  domainId: NexoraDomainId;
  sourceObject: unknown;
  targetObject?: unknown;
  relationship?: EnrichedDomainRelationship;
  sourceFragility?: DomainFragilityScore;
  targetFragility?: DomainFragilityScore;
}): DomainScenarioType {
  const sourceText = objectText(params.sourceObject);
  const targetText = objectText(params.targetObject);
  const semantic = params.relationship?.meta.semantic;
  const sourceRole = objectRole(params.sourceObject);
  const targetRole = objectRole(params.targetObject);

  if (params.domainId === "finance" && includesAny(`${sourceText} ${targetText}`, ["cash", "revenue", "liquidity", "asset", "exposure"])) {
    return "financial_pressure";
  }
  if (params.domainId === "pmo" && includesAny(`${sourceText} ${targetText}`, ["resource", "capacity", "budget", "timeline", "milestone"])) {
    return includesAny(`${sourceText} ${targetText}`, ["resource", "capacity"]) ? "resource_constraint" : "bottleneck";
  }
  if (params.domainId === "saas_devops" && includesAny(`${sourceText} ${targetText}`, ["service", "database", "incident", "outage", "reliability"])) {
    return semantic === "dependency" ? "dependency_failure" : "instability";
  }
  if (params.domainId === "security" && includesAny(`${sourceText} ${targetText}`, ["vulnerability", "threat", "access", "exposure"])) {
    return "instability";
  }
  if (includesAny(`${sourceText} ${targetText}`, ["supplier", "delivery", "lead time", "delay"])) {
    return "delay";
  }
  if (semantic === "dependency") return "dependency_failure";
  if (semantic === "flow") return "bottleneck";
  if (semantic === "risk") return "instability";
  if (semantic === "monitoring" || sourceRole === "monitor" || targetRole === "monitor") return "communication_breakdown";
  if (sourceRole === "constraint" || targetRole === "constraint") return "resource_constraint";
  return "bottleneck";
}

export function matchDomainScenarioRules(params: {
  domainId: unknown;
  objects: unknown[];
  enrichedRelationships?: EnrichedDomainRelationship[];
  fragilityScores?: DomainFragilityScore[];
}): DomainScenarioRuleMatch[] {
  const domainId = normalizeDomainId(params.domainId);
  const objects = Array.isArray(params.objects) ? params.objects : [];
  const relationships = Array.isArray(params.enrichedRelationships) ? params.enrichedRelationships : [];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores : [];
  const objectEntries: Array<[string, unknown]> = [];
  for (const object of objects) {
    const id = objectId(object);
    if (id) objectEntries.push([id, object]);
  }
  const objectsById = new Map<string, unknown>(objectEntries);
  const fragilityById = new Map(fragilityScores.map((score) => [score.objectId, score]));
  const reachBySource = new Map<string, number>();
  const matches: DomainScenarioRuleMatch[] = [];
  const seen = new Set<string>();

  for (const relationship of relationships) {
    reachBySource.set(relationship.sourceObjectId, (reachBySource.get(relationship.sourceObjectId) ?? 0) + 1);
  }

  for (const relationship of relationships) {
    const sourceObject = objectsById.get(relationship.sourceObjectId);
    const targetObject = objectsById.get(relationship.targetObjectId);
    if (!sourceObject || !targetObject) continue;

    const sourceFragility = fragilityById.get(relationship.sourceObjectId);
    const targetFragility = fragilityById.get(relationship.targetObjectId);
    const strongestScore = Math.max(sourceFragility?.score ?? 0, targetFragility?.score ?? 0);
    const reach = Math.max(reachBySource.get(relationship.sourceObjectId) ?? 1, reachBySource.get(relationship.targetObjectId) ?? 0);
    const strength = relationship.meta.strength ?? 0.55;
    const type = typeFor({ domainId, sourceObject, targetObject, relationship, sourceFragility, targetFragility });
    const severity = severityFromPressure(strongestScore, reach, strength);
    const confidence = clamp01(0.44 + strongestScore / 260 + reach * 0.045 + strength * 0.22);
    const key = `${type}|${relationship.sourceObjectId}|${relationship.targetObjectId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push({
      scenarioType: type,
      sourceObjectId: relationship.sourceObjectId,
      targetObjectId: relationship.targetObjectId,
      reason: `${relationship.meta.semantic}:${relationship.relationshipType}`,
      propagationReach: reach,
      relationshipStrength: Number(strength.toFixed(2)),
      severity,
      confidence: Number(confidence.toFixed(2)),
    });
  }

  for (const score of fragilityScores.filter((item) => item.level === "fragile" || item.level === "critical")) {
    const object = objectsById.get(score.objectId);
    if (!object) continue;
    const type = typeFor({ domainId, sourceObject: object, sourceFragility: score });
    const severity = severityFromPressure(score.score, 0, 0.55);
    const key = `${type}|${score.objectId}|self`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push({
      scenarioType: type,
      sourceObjectId: score.objectId,
      reason: `fragility:${score.level}`,
      propagationReach: reachBySource.get(score.objectId) ?? 0,
      relationshipStrength: 0.55,
      severity,
      confidence: Number(clamp01(0.42 + score.score / 220).toFixed(2)),
    });
  }

  return matches.sort((left, right) => {
    const severityDelta = severityRank(right.severity) - severityRank(left.severity);
    if (severityDelta !== 0) return severityDelta;
    const confidenceDelta = right.confidence - left.confidence;
    if (confidenceDelta !== 0) return confidenceDelta;
    return `${left.scenarioType}:${left.sourceObjectId}:${left.targetObjectId ?? ""}`.localeCompare(
      `${right.scenarioType}:${right.sourceObjectId}:${right.targetObjectId ?? ""}`
    );
  });
}
