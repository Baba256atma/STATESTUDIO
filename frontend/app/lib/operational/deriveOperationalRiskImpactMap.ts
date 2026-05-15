import type { OperationalChangeSummary } from "./changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "./monitoringTypes.ts";
import type { OperationalPropagationPreview } from "./propagationPreviewTypes.ts";
import {
  attentionFromExposure,
  combinePropagationAndSeverity,
  compareOperationalRiskNodes,
  deriveOperationalExposureLevel,
  deriveOperationalImpactScore,
  maxOperationalExposureLevel,
  normalizeOperationalRisk,
  propagationLevelToScore01,
  sceneObjectFragility01,
} from "./riskImpactScoring.ts";
import type {
  OperationalRiskExposureLevel,
  OperationalRiskImpactMap,
  OperationalRiskImpactNode,
} from "./riskImpactTypes.ts";
import type { SceneJson, SceneObject } from "../sceneTypes.ts";

export type DeriveOperationalRiskImpactMapInput = Readonly<{
  monitoringSnapshot: OperationalMonitoringSnapshot | null;
  operationalChangeSummary: OperationalChangeSummary | null;
  propagationPreview: OperationalPropagationPreview | null;
  sceneJson: SceneJson | null;
  now?: number;
}>;

const MAX_IMPACT_NODES = 48;

function isoNow(now?: number): string {
  const ms = typeof now === "number" && Number.isFinite(now) ? now : Date.now();
  return new Date(ms).toISOString();
}

function stableObjectId(obj: SceneObject, idx: number): string {
  return String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`).trim();
}

function objectLabel(sceneJson: SceneJson | null, objectId: string): string {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  for (let i = 0; i < objects.length; i += 1) {
    const o = objects[i]!;
    if (stableObjectId(o, i) === objectId) {
      const lab = typeof o.label === "string" ? o.label.trim() : "";
      const nm = typeof o.name === "string" ? o.name.trim() : "";
      return lab || nm || objectId;
    }
  }
  return objectId;
}

function findSceneObject(sceneJson: SceneJson | null, objectId: string): SceneObject | null {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  for (let i = 0; i < objects.length; i += 1) {
    const o = objects[i]!;
    if (stableObjectId(o, i) === objectId) return o;
  }
  return null;
}

function dedupeSorted(ids: readonly string[]): readonly string[] {
  return [...new Set(ids.map((x) => String(x).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function worseningBias01(change: OperationalChangeSummary | null): number {
  if (!change) return 0.5;
  const w = Math.max(0, change.worseningCount);
  const i = Math.max(0, change.improvingCount);
  const t = w + i + 1;
  return normalizeOperationalRisk(w / t);
}

function collectCandidateObjectIds(
  monitoring: OperationalMonitoringSnapshot | null,
  change: OperationalChangeSummary | null,
  propagation: OperationalPropagationPreview | null
): readonly string[] {
  const acc: string[] = [];
  if (monitoring?.affectedObjectIds) for (const x of monitoring.affectedObjectIds) acc.push(String(x).trim());
  if (monitoring?.topRiskObjectId) acc.push(String(monitoring.topRiskObjectId).trim());
  if (monitoring?.signals) {
    for (const s of monitoring.signals) {
      if (typeof s.objectId === "string" && s.objectId.trim()) acc.push(s.objectId.trim());
    }
  }
  if (change?.affectedObjectIds) for (const x of change.affectedObjectIds) acc.push(String(x).trim());
  if (change?.topChange?.objectId) acc.push(String(change.topChange.objectId).trim());
  if (propagation?.sourceObjectIds) for (const x of propagation.sourceObjectIds) acc.push(String(x).trim());
  if (propagation?.affectedObjectIds) for (const x of propagation.affectedObjectIds) acc.push(String(x).trim());
  if (propagation?.propagationNodes) {
    for (const n of propagation.propagationNodes) {
      acc.push(String(n.objectId).trim());
      acc.push(String(n.sourceObjectId).trim());
    }
  }
  return dedupeSorted(acc).slice(0, MAX_IMPACT_NODES);
}

function maxSignalSeverityForObject(monitoring: OperationalMonitoringSnapshot | null, objectId: string): number {
  if (!monitoring?.signals) return 0;
  let m = 0;
  for (const s of monitoring.signals) {
    if (s.objectId === objectId && typeof s.severity === "number" && Number.isFinite(s.severity)) {
      m = Math.max(m, normalizeOperationalRisk(s.severity));
    }
  }
  return m;
}

function maxPropagationScoreForObject(propagation: OperationalPropagationPreview | null, objectId: string): number {
  if (!propagation?.propagationNodes?.length) {
    if (propagation?.affectedObjectIds?.includes(objectId)) {
      return normalizeOperationalRisk(propagationLevelToScore01(propagation.highestRiskLevel) * 0.55);
    }
    return 0;
  }
  let m = 0;
  for (const n of propagation.propagationNodes) {
    if (n.objectId === objectId) m = Math.max(m, normalizeOperationalRisk(n.propagationScore));
  }
  if (m === 0 && propagation.affectedObjectIds?.includes(objectId)) {
    return normalizeOperationalRisk(propagationLevelToScore01(propagation.highestRiskLevel) * 0.5);
  }
  return m;
}

function impactReasonLine(
  objectId: string,
  opSev: number,
  prop: number,
  frag: number | undefined,
  label: string
): string {
  const parts: string[] = [];
  if (opSev >= 0.45) parts.push("active operational signals");
  if (prop >= 0.25) parts.push("downstream propagation stress");
  if (frag != null && frag >= 0.35) parts.push("scanner-elevated structural emphasis");
  const core = parts.length ? parts.join(" + ") : "latent connectivity exposure";
  return `${label} (${objectId}) — ${core}.`;
}

function buildExecutiveHeadline(
  highest: OperationalRiskExposureLevel,
  topId: string | undefined,
  sceneJson: SceneJson | null
): string {
  const lab = topId ? objectLabel(sceneJson, topId) : "Operational fabric";
  switch (highest) {
    case "critical":
      return `${lab}: critical operational exposure across linked systems`;
    case "high":
      return `${lab}: elevated downstream operational pressure`;
    case "elevated":
      return `${lab}: operational pressure building on adjacent systems`;
    default:
      return `Operational exposure contained — ${lab} within normal guardrails`;
  }
}

const EMPTY_MAP: Omit<OperationalRiskImpactMap, "id" | "generatedAt"> = {
  nodes: [],
  highestExposureLevel: "minimal",
  affectedObjectIds: [],
  summary: "No operational risk-impact map — insufficient operational anchors or scene context.",
  executiveRiskHeadline: "Operational risk surface stable in current read model.",
};

/**
 * Consolidates monitoring, change detection, propagation preview, and light scene fragility hints
 * into a single executive risk-impact read model. Pure function; does not mutate inputs.
 * Does not invoke connectors, routing, or scene mutation — consumes read-only `sceneJson`.
 */
export function deriveOperationalRiskImpactMap(
  input?: DeriveOperationalRiskImpactMapInput | null
): OperationalRiskImpactMap {
  const generatedAt = isoNow(input?.now);
  if (!input) {
    return { ...EMPTY_MAP, id: "oprim:empty", generatedAt };
  }

  const { monitoringSnapshot, operationalChangeSummary, propagationPreview, sceneJson } = input;
  const candidates = collectCandidateObjectIds(monitoringSnapshot, operationalChangeSummary, propagationPreview);
  if (candidates.length === 0) {
    return {
      ...EMPTY_MAP,
      id: "oprim:no_candidates",
      generatedAt,
    };
  }

  const bias = worseningBias01(operationalChangeSummary);
  const nodes: OperationalRiskImpactNode[] = [];

  for (const objectId of candidates) {
    const opSev = Math.max(
      maxSignalSeverityForObject(monitoringSnapshot, objectId),
      monitoringSnapshot?.topRiskObjectId === objectId ? 0.55 : 0
    );
    const prop = maxPropagationScoreForObject(propagationPreview, objectId);
    const obj = findSceneObject(sceneJson, objectId);
    const frag =
      obj == null
        ? undefined
        : sceneObjectFragility01({
            scannerEmphasis: (obj as unknown as Record<string, unknown>)["scanner_emphasis"],
            emphasis: obj.emphasis,
            scannerSeverity: (obj as unknown as Record<string, unknown>)["scanner_severity"],
          });
    const combined = combinePropagationAndSeverity(opSev, prop, frag);
    const impact01 = deriveOperationalImpactScore({ combined01: combined, worseningBias: bias });
    const exposure = deriveOperationalExposureLevel(impact01);
    const label = objectLabel(sceneJson, objectId);
    const sigIds =
      monitoringSnapshot?.signals?.filter((s) => s.objectId === objectId).map((s) => s.id) ?? [];
    const node: OperationalRiskImpactNode = {
      objectId,
      exposureLevel: exposure,
      operationalSeverity: normalizeOperationalRisk(opSev),
      propagationScore: normalizeOperationalRisk(prop),
      ...(frag != null ? { fragilityScore: normalizeOperationalRisk(frag) } : {}),
      affectedSignals: dedupeSorted(sigIds),
      impactReason: impactReasonLine(objectId, opSev, prop, frag, label),
      recommendedAttentionLevel: attentionFromExposure(exposure),
    };
    nodes.push(node);
  }

  const sorted = [...nodes].sort(compareOperationalRiskNodes);
  const trimmed = sorted.slice(0, MAX_IMPACT_NODES);
  const levels = trimmed.map((n) => n.exposureLevel);
  const highestExposureLevel = levels.length ? maxOperationalExposureLevel(levels) : "minimal";

  let mostFragileObjectId: string | undefined;
  let bestFrag = -1;
  for (const n of trimmed) {
    const f = n.fragilityScore;
    if (f == null) continue;
    if (f > bestFrag || (f === bestFrag && (mostFragileObjectId == null || n.objectId < mostFragileObjectId))) {
      bestFrag = f;
      mostFragileObjectId = n.objectId;
    }
  }
  if (mostFragileObjectId == null && trimmed.length > 0) {
    mostFragileObjectId = trimmed[0]!.objectId;
  }

  const affectedObjectIds = dedupeSorted(trimmed.map((n) => n.objectId));
  const top = trimmed[0];
  const executiveRiskHeadline = buildExecutiveHeadline(highestExposureLevel, top?.objectId, sceneJson);
  const summary = top
    ? `Highest exposure ${highestExposureLevel} at ${objectLabel(sceneJson, top.objectId)}; ${trimmed.length} system(s) in the consolidated operational risk map.`
    : EMPTY_MAP.summary;

  const id = `oprim:${highestExposureLevel}|${trimmed.length}|${dedupeSorted(candidates).join("+")}`;

  return {
    id,
    nodes: trimmed,
    highestExposureLevel,
    affectedObjectIds,
    ...(mostFragileObjectId ? { mostFragileObjectId } : {}),
    summary,
    executiveRiskHeadline,
    generatedAt,
  };
}
