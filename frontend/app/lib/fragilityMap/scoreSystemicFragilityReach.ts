import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { FragilityZoneType } from "./enterpriseFragilityMapTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function uniqueCount(values: unknown[]): number {
  return new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)).size;
}

export function scoreSystemicFragilityReach(params: {
  relatedObjectIds: string[];
  propagationHints?: DomainPropagationHint[];
  fragilityScores?: DomainFragilityScore[];
  relationships?: EnrichedDomainRelationship[];
  crossDomainInsights?: CrossDomainInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const propagation = (params.propagationHints ?? []).filter((hint) => related.has(hint.sourceObjectId) || related.has(hint.targetObjectId));
  const fragility = (params.fragilityScores ?? []).filter((score) => related.has(score.objectId));
  const relationships = (params.relationships ?? []).filter((item) => related.has(item.sourceObjectId) || related.has(item.targetObjectId));
  const crossDomain = (params.crossDomainInsights ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id)));
  const monitoring = (params.monitoringSignals ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id)));
  const memory = (params.strategicMemory ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id)));

  const propagationScore = average(propagation.map((hint) => hint.propagationStrength));
  const fragilityScore = average(fragility.map((score) => score.score / 100));
  const dependencyScore = Math.min(1, relationships.filter((item) => item.meta.semantic === "dependency" || item.meta.semantic === "risk").length / 4);
  const crossDomainScore = Math.min(1, uniqueCount(crossDomain.flatMap((item) => [item.sourceDomainId, item.targetDomainId])) / 3);
  const monitoringScore = Math.min(1, monitoring.filter((item) => item.monitoringStatus === "elevated" || item.monitoringStatus === "critical").length / 2);
  const recurrenceScore = Math.min(1, memory.reduce((sum, item) => sum + (item.recurrenceCount ?? 1), 0) / 8);

  return clamp01(
    propagationScore * 0.24 +
      fragilityScore * 0.26 +
      dependencyScore * 0.18 +
      crossDomainScore * 0.14 +
      monitoringScore * 0.1 +
      recurrenceScore * 0.08
  );
}

export function classifyFragilityZone(params: {
  relatedObjectCount: number;
  propagationIntensity: number;
  fragilityScore: number;
  systemicReach: number;
  corridorDetected?: boolean;
  domainCount?: number;
}): FragilityZoneType {
  if (params.corridorDetected && params.propagationIntensity >= 0.68 && params.fragilityScore >= 70) return "critical_corridor";
  if (params.systemicReach >= 0.72 || (params.domainCount ?? 0) >= 3) return "systemic";
  if (params.propagationIntensity >= 0.66 && params.fragilityScore >= 58) return "amplifying";
  if (params.relatedObjectCount >= 2 || params.fragilityScore >= 45) return "clustered";
  return "isolated";
}
