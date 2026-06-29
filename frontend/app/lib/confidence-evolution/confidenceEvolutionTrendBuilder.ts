/**
 * APP-9:4 — Confidence trend model builder.
 */

import {
  calculateAverageAbsoluteDelta,
  calculateConfidenceDeltas,
  calculateTotalDelta,
} from "./confidenceEvolutionDeltas.ts";
import {
  detectConfidenceDrops,
  detectConfidencePeaks,
  detectConfidenceRecoveries,
} from "./confidenceEvolutionMovementDetection.ts";
import {
  classifyConfidenceStability,
  classifyConfidenceTrendDirection,
} from "./confidenceEvolutionTrendClassification.ts";
import { calculateModelConfidence } from "./confidenceEvolutionTrendRules.ts";
import {
  calculateConfidenceVolatility,
  classifyConfidenceVolatilityLevel,
} from "./confidenceEvolutionVolatility.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceEvolutionTrendModel,
} from "./confidenceEvolutionTrendTypes.ts";

export function buildConfidenceTrendModelFromRecords(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  generatedAt: string
): ConfidenceEvolutionTrendModel {
  const recordCount = records.length;
  const deltas = calculateConfidenceDeltas(records);
  const totalDelta = calculateTotalDelta(records);
  const averageDelta = recordCount < 2 ? null : calculateAverageAbsoluteDelta(deltas);
  const volatilityScore = calculateConfidenceVolatility(deltas, recordCount);
  const direction = classifyConfidenceTrendDirection(totalDelta, deltas, recordCount);
  const volatilityLevel = classifyConfidenceVolatilityLevel(volatilityScore, recordCount);
  const stabilityLevel = classifyConfidenceStability(volatilityScore, recordCount, direction);

  return Object.freeze({
    workspaceId,
    generatedAt,
    recordCount,
    firstScore: recordCount > 0 ? records[0]!.confidenceScore : null,
    lastScore: recordCount > 0 ? records[recordCount - 1]!.confidenceScore : null,
    totalDelta,
    averageDelta,
    direction,
    volatilityScore,
    volatilityLevel,
    stabilityLevel,
    peaks: detectConfidencePeaks(workspaceId, records),
    drops: detectConfidenceDrops(workspaceId, records, deltas),
    recoveries: detectConfidenceRecoveries(workspaceId, records, deltas),
    confidence: calculateModelConfidence(recordCount),
    metadata: Object.freeze({
      trendVersion: CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
      analysis: "historical_movement_only",
    }),
    contractVersion: CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionTrendBuilder = Object.freeze({
  buildConfidenceTrendModelFromRecords,
});
