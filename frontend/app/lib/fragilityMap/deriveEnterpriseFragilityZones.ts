import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import { detectFragilityCorridors } from "./detectFragilityCorridors.ts";
import type {
  EnterpriseFragilityMapOverlayState,
  EnterpriseFragilityZone,
  FragilityZoneType,
} from "./enterpriseFragilityMapTypes.ts";
import {
  buildFragilityExecutiveImpact,
  buildFragilityZoneSummary,
  buildFragilityZoneTitle,
} from "./fragilityMapNarratives.ts";
import {
  classifyFragilityZone,
  scoreSystemicFragilityReach,
} from "./scoreSystemicFragilityReach.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_ZONES = 5;

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
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function zoneRank(type: FragilityZoneType): number {
  if (type === "critical_corridor") return 5;
  if (type === "systemic") return 4;
  if (type === "amplifying") return 3;
  if (type === "clustered") return 2;
  return 1;
}

function collectDomainIds(params: {
  crossDomainInsights?: CrossDomainInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
}): string[] {
  return unique([
    ...(params.crossDomainInsights ?? []).flatMap((item) => [item.sourceDomainId, item.targetDomainId]),
    ...(params.monitoringSignals ?? []).map((item) => item.domainId),
    ...(params.strategicMemory ?? []).map((item) => item.domainId),
  ]);
}

function corridorZone(params: {
  objectIds: string[];
  relatedEdgeIds: string[];
  propagationIntensity: number;
  fragilityScore: number;
  domainIds: string[];
  systemicReach: number;
}): EnterpriseFragilityZone {
  const zoneType = classifyFragilityZone({
    relatedObjectCount: params.objectIds.length,
    propagationIntensity: params.propagationIntensity,
    fragilityScore: params.fragilityScore,
    systemicReach: params.systemicReach,
    corridorDetected: true,
    domainCount: params.domainIds.length,
  });
  return {
    id: `enterprise_fragility_zone_${normalizeIdPart(params.objectIds.join("_"))}_${normalizeIdPart(zoneType)}`,
    title: buildFragilityZoneTitle({ zoneType, relatedObjectIds: params.objectIds }),
    summary: buildFragilityZoneSummary({ zoneType, relatedObjectIds: params.objectIds }),
    zoneType,
    relatedObjectIds: params.objectIds,
    ...(params.relatedEdgeIds.length ? { relatedEdgeIds: params.relatedEdgeIds } : {}),
    propagationIntensity: params.propagationIntensity,
    fragilityScore: params.fragilityScore,
    systemicReach: params.systemicReach,
    confidence: Math.round(Math.min(0.96, Math.max(0.2, params.systemicReach * 0.55 + params.propagationIntensity * 0.25 + (params.fragilityScore / 100) * 0.2)) * 100) / 100,
    executiveImpact: buildFragilityExecutiveImpact({ zoneType }),
    ...(params.domainIds.length ? { domainIds: params.domainIds } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };
}

function logFragilityZone(zone: EnterpriseFragilityZone, corridorDetection: boolean, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][EnterpriseFragilityMap]", {
    zoneType: zone.zoneType,
    propagationIntensity: zone.propagationIntensity,
    systemicReach: zone.systemicReach ?? 0,
    relatedObjects: zone.relatedObjectIds,
    corridorDetection,
  });
}

export function deriveEnterpriseFragilityZones(params: {
  fragilityScores?: DomainFragilityScore[];
  propagationHints?: DomainPropagationHint[];
  relationships?: EnrichedDomainRelationship[];
  crossDomainInsights?: CrossDomainInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  debug?: boolean;
}): EnterpriseFragilityZone[] {
  const domainIds = collectDomainIds(params);
  const corridors = detectFragilityCorridors({
    propagationHints: params.propagationHints,
    fragilityScores: params.fragilityScores,
    relationships: params.relationships,
    domainIds,
  });
  const zones: EnterpriseFragilityZone[] = [];

  for (const corridor of corridors) {
    const systemicReach = scoreSystemicFragilityReach({
      relatedObjectIds: corridor.objectPath,
      propagationHints: params.propagationHints,
      fragilityScores: params.fragilityScores,
      relationships: params.relationships,
      crossDomainInsights: params.crossDomainInsights,
      monitoringSignals: params.monitoringSignals,
      strategicMemory: params.strategicMemory,
    });
    zones.push(corridorZone({
      objectIds: corridor.objectPath,
      relatedEdgeIds: corridor.relatedEdgeIds,
      propagationIntensity: corridor.propagationIntensity,
      fragilityScore: corridor.fragilityScore,
      domainIds: corridor.domainIds.length ? corridor.domainIds : domainIds,
      systemicReach,
    }));
  }

  const highFragility = (params.fragilityScores ?? []).filter((score) => score.score >= 55);
  for (const score of highFragility) {
    const relatedObjectIds = unique([
      score.objectId,
      ...(params.propagationHints ?? [])
        .filter((hint) => hint.sourceObjectId === score.objectId || hint.targetObjectId === score.objectId)
        .flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId]),
    ]);
    if (zones.some((zone) => relatedObjectIds.every((id) => zone.relatedObjectIds.includes(id)))) continue;
    const propagationIntensity = Math.round(average((params.propagationHints ?? [])
      .filter((hint) => relatedObjectIds.includes(hint.sourceObjectId) || relatedObjectIds.includes(hint.targetObjectId))
      .map((hint) => hint.propagationStrength)) * 100) / 100;
    const systemicReach = scoreSystemicFragilityReach({
      relatedObjectIds,
      propagationHints: params.propagationHints,
      fragilityScores: params.fragilityScores,
      relationships: params.relationships,
      crossDomainInsights: params.crossDomainInsights,
      monitoringSignals: params.monitoringSignals,
      strategicMemory: params.strategicMemory,
    });
    const zoneType = classifyFragilityZone({
      relatedObjectCount: relatedObjectIds.length,
      propagationIntensity,
      fragilityScore: score.score,
      systemicReach,
      domainCount: domainIds.length,
    });
    zones.push({
      id: `enterprise_fragility_zone_${normalizeIdPart(relatedObjectIds.join("_"))}_${normalizeIdPart(zoneType)}`,
      title: buildFragilityZoneTitle({ zoneType, relatedObjectIds }),
      summary: buildFragilityZoneSummary({ zoneType, relatedObjectIds }),
      zoneType,
      relatedObjectIds,
      propagationIntensity,
      fragilityScore: score.score,
      systemicReach,
      confidence: Math.round(Math.min(0.92, Math.max(0.18, systemicReach * 0.6 + (score.score / 100) * 0.4)) * 100) / 100,
      executiveImpact: buildFragilityExecutiveImpact({ zoneType }),
      ...(domainIds.length ? { domainIds } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    });
  }

  const deduped = new Map<string, EnterpriseFragilityZone>();
  for (const zone of zones) {
    const key = `${zone.relatedObjectIds.slice().sort().join("|")}|${zone.zoneType}`;
    const current = deduped.get(key);
    if (!current || zoneRank(zone.zoneType) > zoneRank(current.zoneType) || (zone.systemicReach ?? 0) > (current.systemicReach ?? 0)) {
      deduped.set(key, zone);
    }
  }

  const result = Array.from(deduped.values()).sort((left, right) => {
    if (zoneRank(right.zoneType) !== zoneRank(left.zoneType)) return zoneRank(right.zoneType) - zoneRank(left.zoneType);
    if ((right.systemicReach ?? 0) !== (left.systemicReach ?? 0)) return (right.systemicReach ?? 0) - (left.systemicReach ?? 0);
    if (right.fragilityScore !== left.fragilityScore) return right.fragilityScore - left.fragilityScore;
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_ZONES);

  for (const zone of result) {
    logFragilityZone(zone, corridors.some((corridor) => corridor.objectPath.every((id) => zone.relatedObjectIds.includes(id))), params.debug);
  }
  return result;
}

export function buildEnterpriseFragilityMapOverlayState(params: {
  zones: EnterpriseFragilityZone[];
}): EnterpriseFragilityMapOverlayState {
  const zones = Array.isArray(params.zones) ? params.zones : [];
  const top = zones[0] ?? null;
  return {
    ...(top ? { topZoneId: top.id } : {}),
    headline: top?.title ?? "No enterprise fragility zone is visible yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough fragility evidence to map enterprise exposure.",
    zoneType: top?.zoneType ?? "isolated",
    relatedObjectIds: unique(zones.flatMap((zone) => zone.relatedObjectIds)),
    systemicReach: top?.systemicReach ?? 0,
  };
}
