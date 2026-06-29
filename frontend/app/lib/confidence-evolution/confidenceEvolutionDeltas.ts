/**
 * APP-9:4 — Confidence delta calculation.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import { CONFIDENCE_EVOLUTION_TREND_RULES } from "./confidenceEvolutionTrendRules.ts";
import type { ConfidenceDeltaPair } from "./confidenceEvolutionTrendTypes.ts";

export function calculateConfidenceDeltas(
  records: readonly ConfidenceEvolutionEngineRecord[]
): readonly ConfidenceDeltaPair[] {
  if (records.length < 2) {
    return Object.freeze([]);
  }

  const deltas: ConfidenceDeltaPair[] = [];
  for (let index = 1; index < records.length; index += 1) {
    const previous = records[index - 1]!;
    const current = records[index]!;
    const delta = current.confidenceScore - previous.confidenceScore;
    deltas.push(
      Object.freeze({
        recordId: current.id,
        previousRecordId: previous.id,
        fromScore: previous.confidenceScore,
        toScore: current.confidenceScore,
        delta,
        occurredAt: current.updatedAt,
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(deltas);
}

export function calculateTotalDelta(records: readonly ConfidenceEvolutionEngineRecord[]): number | null {
  if (records.length === 0) {
    return null;
  }
  if (records.length === 1) {
    return 0;
  }
  return records[records.length - 1]!.confidenceScore - records[0]!.confidenceScore;
}

export function calculateAverageAbsoluteDelta(deltas: readonly ConfidenceDeltaPair[]): number {
  if (deltas.length === 0) {
    return CONFIDENCE_EVOLUTION_TREND_RULES.minScore;
  }
  const sum = deltas.reduce((total, entry) => total + Math.abs(entry.delta), 0);
  return sum / deltas.length;
}

export const ConfidenceEvolutionDeltas = Object.freeze({
  calculateConfidenceDeltas,
  calculateTotalDelta,
  calculateAverageAbsoluteDelta,
});
