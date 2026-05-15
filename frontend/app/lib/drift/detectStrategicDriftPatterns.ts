import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type {
  StrategicDriftPattern,
  StrategicDriftSignal,
  StrategicDriftType,
} from "./strategicDriftTypes.ts";

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

function driftTypeFromMemory(record: StrategicMemoryRecord): StrategicDriftType {
  if (record.category === "monitoring") return "monitoring_gap";
  if (record.category === "propagation") return "propagation_expansion";
  if (record.category === "recommendation") return "intervention_decay";
  if (record.category === "dependency") return "coordination_decay";
  return "fragility_reemergence";
}

export function detectStrategicDriftPatterns(params: {
  driftSignals?: StrategicDriftSignal[];
  strategicMemory?: StrategicMemoryRecord[];
}): StrategicDriftPattern[] {
  const patterns = new Map<string, StrategicDriftPattern>();

  for (const signal of params.driftSignals ?? []) {
    const key = `${signal.driftType}|${signal.relatedObjectIds.slice().sort().join("|")}`;
    patterns.set(key, {
      id: `strategic_drift_pattern_${normalizeIdPart(key)}`,
      driftType: signal.driftType,
      relatedObjectIds: signal.relatedObjectIds,
      recurrenceScore: Math.round(Math.min(1, signal.driftIntensity * 0.72 + (signal.confidence ?? 0.4) * 0.28) * 100) / 100,
      description: `${signal.title} remains visible as an early strategic drift pattern.`,
    });
  }

  for (const record of params.strategicMemory ?? []) {
    if ((record.recurrenceCount ?? 0) < 2) continue;
    const driftType = driftTypeFromMemory(record);
    const relatedObjectIds = unique(record.relatedObjectIds);
    if (!relatedObjectIds.length) continue;
    const key = `${driftType}|${relatedObjectIds.slice().sort().join("|")}`;
    const recurrenceScore = Math.round(Math.min(1, ((record.recurrenceCount ?? 1) / 5) * ((record.confidence ?? 0.6) + 0.25)) * 100) / 100;
    const current = patterns.get(key);
    if (!current || recurrenceScore > current.recurrenceScore) {
      patterns.set(key, {
        id: `strategic_drift_pattern_${normalizeIdPart(key)}`,
        driftType,
        relatedObjectIds,
        recurrenceScore,
        description: `${record.title} has reappeared often enough to qualify as strategic drift context.`,
      });
    }
  }

  return Array.from(patterns.values()).sort((left, right) => {
    if (right.recurrenceScore !== left.recurrenceScore) return right.recurrenceScore - left.recurrenceScore;
    return left.id.localeCompare(right.id);
  });
}
