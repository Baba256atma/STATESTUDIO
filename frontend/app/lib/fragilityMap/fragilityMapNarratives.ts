import type { FragilityZoneType } from "./enterpriseFragilityMapTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the active operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" -> ");
}

export function buildFragilityZoneTitle(params: {
  zoneType: FragilityZoneType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.zoneType === "critical_corridor") return `Critical fragility corridor: ${path}`;
  if (params.zoneType === "systemic") return `Systemic fragility zone: ${path}`;
  if (params.zoneType === "amplifying") return `Amplifying fragility path: ${path}`;
  if (params.zoneType === "clustered") return `Clustered fragility zone: ${path}`;
  return `Isolated fragility point: ${path}`;
}

export function buildFragilityZoneSummary(params: {
  zoneType: FragilityZoneType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.zoneType === "critical_corridor") {
    return `Operational instability is amplifying through the ${path} dependency corridor.`;
  }
  if (params.zoneType === "systemic") {
    return `Fragility is extending across enterprise operating dependencies around ${path}.`;
  }
  if (params.zoneType === "amplifying") {
    return `Fragility pressure is increasing through connected operational pathways around ${path}.`;
  }
  if (params.zoneType === "clustered") {
    return `Fragility remains concentrated across related operational nodes around ${path}.`;
  }
  return `Fragility is currently localized around ${path}.`;
}

export function buildFragilityExecutiveImpact(params: {
  zoneType: FragilityZoneType;
}): string {
  if (params.zoneType === "critical_corridor") {
    return "Enterprise resilience may be constrained by a tightly coupled high-dependency corridor.";
  }
  if (params.zoneType === "systemic") {
    return "Systemic exposure is high enough to warrant executive-level visibility.";
  }
  if (params.zoneType === "amplifying") {
    return "Operational instability may amplify if dependency pressure remains unresolved.";
  }
  if (params.zoneType === "clustered") {
    return "The cluster should remain visible because localized pressure is becoming concentrated.";
  }
  return "The issue appears localized and should remain in passive monitoring.";
}
