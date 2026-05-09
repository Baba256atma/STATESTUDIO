import type { SceneJson, SceneLoop, SceneObject } from "../sceneTypes.ts";
import type { TypeCExecutiveSummary } from "./typeCExecutiveSummary.ts";

type FragilityLevel = "low" | "medium" | "high" | "critical" | null;

export type TypeCExecutiveSummaryInput = {
  sceneJson: SceneJson | null;
  selectedObjectId?: string | null;
  focusedObjectId?: string | null;
  fragilitySignals?: unknown;
};

const FALLBACK_SUMMARY: TypeCExecutiveSummary = {
  headline: "No executive insight available",
  recommendation: "Add objects or run analysis to generate insights",
  confidence: { label: "Low", value: 10 },
  why: [],
  nextActions: [],
  riskNotes: [],
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function sceneObjects(sceneJson: SceneJson | null): SceneObject[] {
  return Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
}

function sceneLoops(sceneJson: SceneJson | null): SceneLoop[] {
  return Array.isArray(sceneJson?.scene?.loops) ? sceneJson.scene.loops : [];
}

function normalizeId(value: string | null | undefined): string | null {
  const id = String(value ?? "").trim();
  return id || null;
}

function objectLabel(object: SceneObject | undefined, fallback = "system"): string {
  if (!object) return fallback;
  return String(object.label ?? object.name ?? object.display_label ?? object.id ?? fallback).trim() || fallback;
}

function findObject(objects: SceneObject[], id: string | null): SceneObject | undefined {
  if (!id) return undefined;
  return objects.find((object) => String(object.id ?? "") === id);
}

function normalizeFragilityLevel(value: unknown): FragilityLevel {
  const level = String(value ?? "").trim().toLowerCase();
  if (level === "critical") return "critical";
  if (level === "high") return "high";
  if (level === "medium" || level === "moderate") return "medium";
  if (level === "low") return "low";
  return null;
}

function firstStringFrom(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstStringFrom(item);
      if (found) return found;
    }
  }
  const record = asRecord(value);
  if (!record) return null;
  for (const key of ["id", "objectId", "object_id", "label", "name"]) {
    const found = firstStringFrom(record[key]);
    if (found) return found;
  }
  return null;
}

function collectImpactedIds(value: unknown): string[] {
  const record = asRecord(value);
  if (!record) return [];
  const candidates = [
    record.impacted_nodes,
    record.impactedNodes,
    record.highlightedObjectIds,
    record.highlighted_object_ids,
    record.primary_object_ids,
    record.affected_object_ids,
    asRecord(record.riskPropagation)?.impacted_nodes,
    asRecord(record.risk_propagation)?.impacted_nodes,
  ];
  const ids: string[] = [];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    for (const item of candidate) {
      const id = firstStringFrom(item);
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

function readNestedLevel(value: unknown): FragilityLevel {
  const record = asRecord(value);
  if (!record) return null;
  const direct =
    normalizeFragilityLevel(record.fragilityLevel) ??
    normalizeFragilityLevel(record.fragility_level) ??
    normalizeFragilityLevel(record.riskLevel) ??
    normalizeFragilityLevel(record.level);
  if (direct) return direct;
  for (const key of ["pipelineStatus", "pipelineStatusUi", "fragility", "fragility_scan", "scanner", "risk"]) {
    const nested = readNestedLevel(record[key]);
    if (nested) return nested;
  }
  return null;
}

function readSignalCount(value: unknown): number {
  const record = asRecord(value);
  if (!record) return 0;
  const direct = Number(record.signalsCount ?? record.mappedObjectsCount ?? record.signal_count ?? 0);
  let best = Number.isFinite(direct) ? direct : 0;
  for (const key of ["pipelineStatus", "pipelineStatusUi", "fragility", "fragility_scan", "scanner"]) {
    best = Math.max(best, readSignalCount(record[key]));
  }
  return best;
}

function dependencyConcentration(objects: SceneObject[], loops: SceneLoop[]): boolean {
  const counts = new Map<string, number>();
  for (const loop of loops) {
    for (const edge of Array.isArray(loop.edges) ? loop.edges : []) {
      const from = normalizeId(edge.from);
      const to = normalizeId(edge.to);
      if (from) counts.set(from, (counts.get(from) ?? 0) + 1);
      if (to) counts.set(to, (counts.get(to) ?? 0) + 1);
    }
  }
  for (const object of objects) {
    const deps = Array.isArray(object.dependencies) ? object.dependencies.length : 0;
    if (deps >= 2) return true;
    if ((counts.get(String(object.id ?? "")) ?? 0) >= 3) return true;
  }
  return false;
}

function pushUnique(target: string[], item: string): void {
  if (target.length >= 2) return;
  if (!target.includes(item)) target.push(item);
}

function confidenceLabel(value: number): TypeCExecutiveSummary["confidence"]["label"] {
  if (value < 40) return "Low";
  if (value < 80) return "Medium";
  return "High";
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 10;
  return Math.min(95, Math.max(10, Math.round(value)));
}

export function buildTypeCExecutiveSummary(input: TypeCExecutiveSummaryInput): TypeCExecutiveSummary | null {
  try {
    const objects = sceneObjects(input.sceneJson);
    const loops = sceneLoops(input.sceneJson);
    const selectedId = normalizeId(input.selectedObjectId);
    const focusedId = normalizeId(input.focusedObjectId);
    const fragilityLevel = readNestedLevel(input.fragilitySignals);
    const signalCount = readSignalCount(input.fragilitySignals);
    const impactedIds = collectImpactedIds(input.fragilitySignals);

    if (!objects.length && !fragilityLevel && signalCount <= 0) {
      return { ...FALLBACK_SUMMARY };
    }

    const targetId = focusedId ?? selectedId ?? impactedIds[0] ?? null;
    const targetObject = findObject(objects, targetId);
    const targetLabel = objectLabel(targetObject, targetId ?? objects[0]?.label ?? objects[0]?.name ?? "system");
    const highFragility = fragilityLevel === "critical" || fragilityLevel === "high";
    const mediumFragility = fragilityLevel === "medium";
    const stable = fragilityLevel === "low" || (!fragilityLevel && objects.length > 0);
    const hasDependencyConcentration = dependencyConcentration(objects, loops);

    const headline = highFragility
      ? `System fragility increasing around ${targetLabel}`
      : stable
        ? "System stable with localized risks"
        : mediumFragility
          ? `System pressure building around ${targetLabel}`
          : FALLBACK_SUMMARY.headline;
    const recommendation = highFragility
      ? `Stabilize ${targetLabel} before scaling`
      : mediumFragility
        ? `Monitor and optimize ${targetLabel}`
        : stable
          ? "Proceed with current strategy"
          : FALLBACK_SUMMARY.recommendation;

    const why: string[] = [];
    if (impactedIds.length > 1 || highFragility) pushUnique(why, "Delay propagation detected");
    if (hasDependencyConcentration) pushUnique(why, "High dependency concentration");
    if (mediumFragility || highFragility || signalCount > 2) pushUnique(why, "Volatility increasing");

    const nextActions: string[] = [];
    if (highFragility || targetLabel.toLowerCase().includes("supplier")) pushUnique(nextActions, `Analyze ${targetLabel} risk`);
    if (hasDependencyConcentration) pushUnique(nextActions, `Reduce dependency on ${targetLabel}`);
    pushUnique(nextActions, mediumFragility ? "Run scenario simulation" : "Monitor localized risks");

    const riskNotes: string[] = [];
    if (highFragility || impactedIds.length > 1) pushUnique(riskNotes, "Small delays may cascade");
    if (mediumFragility || highFragility || hasDependencyConcentration) {
      pushUnique(riskNotes, "System sensitive to input variance");
    }

    let confidence = highFragility ? 62 : mediumFragility ? 48 : stable ? 34 : 10;
    if (objects.length >= 3) confidence += 10;
    if (loops.length > 0) confidence += 5;
    if (selectedId || focusedId) confidence += 15;
    if (signalCount > 0) confidence += Math.min(10, signalCount * 2);
    if (objects.length === 1 && !fragilityLevel) confidence = Math.min(confidence, 35);
    const confidenceValue = clampPercent(confidence);

    return {
      headline,
      recommendation,
      confidence: {
        label: confidenceLabel(confidenceValue),
        value: confidenceValue,
      },
      why: why.slice(0, 2),
      nextActions: nextActions.slice(0, 2),
      riskNotes: riskNotes.slice(0, 2),
    };
  } catch {
    return { ...FALLBACK_SUMMARY };
  }
}
